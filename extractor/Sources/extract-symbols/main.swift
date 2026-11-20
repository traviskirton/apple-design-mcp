// extract-symbols: writes server/src/pack/symbols.js and server/assets/symbols/NAME.svg.
//
//   swift run -c release extract-symbols                 everything
//   swift run -c release extract-symbols --only a,b      only these symbols' SVGs (the pack is still written)
//   swift run -c release extract-symbols --verify 60     also compare 60 SVGs (some fixed, the rest random)
//                                                        with the system's own rendering, pixel by pixel
//   swift run -c release extract-symbols --verify-only 60  compare without writing anything
//   swift run -c release extract-symbols --verify-only all --verify-weights all --report FILE
//                                                        compare every symbol in every weight; FILE gets the
//                                                        summary and those below --flag-below (default 0.97),
//                                                        DIFF_DIR a PNG of each of those (scripts/check-drawings.mjs)
//   swift run -c release extract-symbols --weights all   the other eight weights (or --weights medium,semibold),
//                                                        into server/assets/symbol-weights/WEIGHT/SHARD.txt;
//                                                        with --only, only those symbols are updated
import AppKit
import PDFVector
import SwiftUI

let args = CommandLine.arguments
func option(_ name: String) -> String? { args.firstIndex(of: name).flatMap { $0 + 1 < args.count ? args[$0 + 1] : nil } }

let repo = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
    .deletingLastPathComponent().deletingLastPathComponent()
let packURL = repo.appendingPathComponent("server/src/pack/symbols.js")
let svgDir = repo.appendingPathComponent("server/assets/symbols")
let weightDir = repo.appendingPathComponent("server/assets/symbol-weights")

/// The weights besides regular. The Worker may hold at most 20,000 static files, so each weight is
/// written as 256 shards, one symbol per line: its name, a tab, its SVG. server/src/symbols.ts and
/// server/scripts/symbol-shapes.mjs find a symbol's shard the same way (`shard`).
let weights: [(String, Font.Weight)] = [
    ("ultralight", .ultraLight), ("thin", .thin), ("light", .light), ("medium", .medium),
    ("semibold", .semibold), ("bold", .bold), ("heavy", .heavy), ("black", .black),
]

/// FNV-1a of the name's UTF-8 bytes, modulo 256, as two hex digits.
func shard(_ name: String) -> String {
    var h: UInt32 = 0x811c9dc5
    for b in name.utf8 { h ^= UInt32(b); h = h &* 0x01000193 }
    return String(format: "%02x", h % 256)
}

/// The symbol drawn by SwiftUI as PDF: medium scale, 100-point font, regular weight unless given.
@MainActor func renderPDF(_ name: String, weight: Font.Weight = .regular) -> Data? {
    guard NSImage(systemSymbolName: name, accessibilityDescription: nil) != nil else { return nil }
    let renderer = ImageRenderer(content: Image(systemName: name).font(.system(size: 100, weight: weight)).foregroundStyle(.black))
    let data = NSMutableData()
    renderer.render { size, draw in
        var box = CGRect(origin: .zero, size: size)
        guard size.width > 0, size.height > 0,
              let consumer = CGDataConsumer(data: data as CFMutableData),
              let ctx = CGContext(consumer: consumer, mediaBox: &box, nil) else { return }
        ctx.beginPDFPage(nil); draw(ctx); ctx.endPDFPage(); ctx.closePDF()
    }
    return data.length > 0 ? data as Data : nil
}

// MARK: - Verification

/// The system's own drawing of the symbol (the PDF that SwiftUI draws, rasterized by Core Graphics with its
/// soft masks) and the SVG's drawing, as coverage at 2x, and their overlap: intersection over union on
/// coverage, so translucent layers and anti-aliasing count by how much they cover (1.0 is identical).
struct Comparison { let score: Double; let system: [Int]; let svg: [Int]; let width: Int; let height: Int }

@MainActor func compare(_ name: String, svg: String, weight: Font.Weight = .regular) -> Comparison? {
    guard let vb = svg.range(of: #"viewBox="0 0 (\d+) (\d+)""#, options: .regularExpression) else { return nil }
    let dims = svg[vb].split(whereSeparator: { !$0.isNumber }).compactMap { Int($0) }
    let (w, h) = (dims[2], dims[3])
    let (W, H) = (w * 2, h * 2)
    guard let pdf = renderPDF(name, weight: weight), let provider = CGDataProvider(data: pdf as CFData),
          let page = CGPDFDocument(provider)?.page(at: 1) else { return nil }
    let a = coverage(width: W, height: H) { ctx in ctx.scaleBy(x: 2, y: 2); ctx.drawPDFPage(page) }
    let b = coverage(width: W, height: H) { ctx in
        ctx.scaleBy(x: 2, y: 2); ctx.translateBy(x: 0, y: CGFloat(h)); ctx.scaleBy(x: 1, y: -1)
        let re = try! NSRegularExpression(pattern: #"<path( fill-rule="evenodd")?(?: fill-opacity="([\d.]+)")? d="([^"]*)"/>"#)
        for m in re.matches(in: svg, range: NSRange(svg.startIndex..., in: svg)) {
            let evenOdd = m.range(at: 1).location != NSNotFound
            let opacity = Range(m.range(at: 2), in: svg).flatMap { Double(svg[$0]) } ?? 1
            ctx.setAlpha(opacity)
            ctx.addPath(parsePathData(String(svg[Range(m.range(at: 3), in: svg)!])))
            ctx.fillPath(using: evenOdd ? .evenOdd : .winding)
        }
    }
    return Comparison(score: overlapScore(a, b), system: a, svg: b, width: W, height: H)
}

/// A PNG of a comparison: gray where both agree, red where only the system draws, blue where only the SVG does.
func writeDiff(_ c: Comparison, to file: URL) {
    let (W, H) = (c.width, c.height)
    var px = [UInt8](repeating: 255, count: W * H * 4)
    for i in 0..<c.system.count {
        let (x, y) = (c.system[i] > 127, c.svg[i] > 127)
        let color: (UInt8, UInt8, UInt8) = x && y ? (160, 160, 160) : x ? (230, 0, 0) : y ? (0, 0, 230) : (255, 255, 255)
        px[i * 4] = color.0; px[i * 4 + 1] = color.1; px[i * 4 + 2] = color.2
    }
    let ctx = CGContext(data: &px, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4,
                        space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
    try? FileManager.default.createDirectory(at: file.deletingLastPathComponent(), withIntermediateDirectories: true)
    let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
    try? rep.representation(using: .png, properties: [:])?.write(to: file)
}

/// The overlap for --verify N; with DIFF_DIR set, also writes the comparison as DIFF_DIR/NAME.png.
@MainActor func overlap(_ name: String, svg: String) -> Double? {
    guard let c = compare(name, svg: svg) else { print("  \(name): no reference drawing"); return nil }
    if let dir = ProcessInfo.processInfo.environment["DIFF_DIR"] {
        writeDiff(c, to: URL(fileURLWithPath: dir).appendingPathComponent("\(name).png"))
    }
    return c.score
}

/// The SVGs of one weight, by name, read from its shards in server/assets/symbol-weights/WEIGHT.
func weightSVGs(_ weightName: String) -> [String: String] {
    var table: [String: String] = [:]
    let dir = weightDir.appendingPathComponent(weightName)
    for file in (try? FileManager.default.contentsOfDirectory(atPath: dir.path)) ?? [] where file.hasSuffix(".txt") {
        let text = (try? String(contentsOf: dir.appendingPathComponent(file), encoding: .utf8)) ?? ""
        for line in text.split(separator: "\n") {
            guard let tab = line.firstIndex(of: "\t") else { continue }
            table[String(line[..<tab])] = String(line[line.index(after: tab)...])
        }
    }
    return table
}

/// --verify all: every symbol in regular weight, and with --verify-weights in those weights too.
/// Prints a summary per weight and the worst symbols; --report FILE writes the summary and every
/// symbol below --flag-below (default 0.97) as JSON, and DIFF_DIR gets a PNG for each of those only.
@MainActor func verifyAll(_ names: [String], svgs: [String: String]) throws {
    let threshold = Double(option("--flag-below") ?? "") ?? 0.97
    let diffDir = ProcessInfo.processInfo.environment["DIFF_DIR"].map { URL(fileURLWithPath: $0) }
    var groups: [(name: String, weight: Font.Weight, svgs: [String: String])] = []
    var regular = svgs
    for name in names where regular[name] == nil {
        if let svg = try? String(contentsOf: svgDir.appendingPathComponent("\(name).svg"), encoding: .utf8) { regular[name] = svg }
    }
    groups.append(("regular", .regular, regular))
    if let list = option("--verify-weights") {
        for (weightName, weight) in weights where list == "all" || list.split(separator: ",").contains(where: { $0 == weightName }) {
            groups.append((weightName, weight, weightSVGs(weightName)))
        }
    }
    var flagged: [[String: Any]] = []
    var summary: [[String: Any]] = []
    for group in groups {
        var compared = 0, noDrawing = 0, below = 0, total = 0.0
        var worst: [(String, Double)] = []
        let started = Date()
        for (i, name) in names.enumerated() {
            autoreleasepool {
                guard let svg = group.svgs[name], let c = compare(name, svg: svg, weight: group.weight) else { noDrawing += 1; return }
                compared += 1
                total += c.score
                worst.append((name, c.score))
                if c.score < threshold {
                    below += 1
                    var entry: [String: Any] = ["name": name, "weight": group.name, "overlap": (c.score * 10000).rounded() / 10000]
                    if let dir = diffDir {
                        let file = "\(group.name)/\(name).png"
                        writeDiff(c, to: dir.appendingPathComponent(file))
                        entry["diff"] = file
                    }
                    flagged.append(entry)
                }
            }
            if (i + 1) % 2000 == 0 { print("  \(group.name): \(i + 1)/\(names.count)") }
        }
        worst.sort { $0.1 < $1.1 }
        let mean = compared == 0 ? 0 : total / Double(compared)
        print(String(format: "%@: %d symbols compared, mean overlap %.4f, worst %.4f, %d below %.3f, %d without a drawing (%.0f s)",
                     group.name, compared, mean, worst.first?.1 ?? 0, below, threshold, noDrawing, Date().timeIntervalSince(started)))
        for (name, s) in worst.prefix(5) { print(String(format: "  %.4f  %@", s, name)) }
        summary.append(["weight": group.name, "compared": compared, "no_drawing": noDrawing, "flagged": below,
                        "mean": (mean * 10000).rounded() / 10000, "worst": ((worst.first?.1 ?? 0) * 10000).rounded() / 10000])
    }
    if let path = option("--report") {
        let report: [String: Any] = ["kind": "symbols", "threshold": threshold, "generated_at": ISO8601DateFormatter().string(from: Date()),
                                     "groups": summary, "flagged": flagged]
        let url = URL(fileURLWithPath: path)
        try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
        try JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys]).write(to: url)
        print("Report: \(path)")
    }
}

// MARK: - Main

@MainActor func main() throws {
    let meta = Metadata.load()
    print("SF Symbols \(meta.appVersion), macOS \(meta.macOSVersion): \(meta.names.count) names (\(meta.systemNames.count) on this macOS)")

    let verifyOnly = option("--verify-only")
    let only = option("--only").map { Set($0.split(separator: ",").map(String.init)) }
    var svgs: [String: String] = [:]

    func extract(_ name: String, weight: Font.Weight = .regular) -> (svg: String?, why: String?) {
        guard let pdf = renderPDF(name, weight: weight) else { return (nil, "macOS cannot draw it") }
        guard let shape = readPDF(pdf) else { return (nil, "the PDF could not be read") }
        if !shape.unsupported.isEmpty { return (nil, "the PDF holds \(shape.unsupported.sorted().joined(separator: ", "))") }
        if shape.fills.isEmpty { return (nil, "it draws nothing") }
        return (svgDocument(shape), nil)
    }

    if let list = option("--weights") {
        let wanted = list == "all" ? weights : weights.filter { w in list.split(separator: ",").contains { $0 == w.0 } }
        if wanted.isEmpty { print("--weights takes all, or names from: \(weights.map(\.0).joined(separator: ", "))"); return }
        let todo = only.map { o in meta.names.filter { o.contains($0) } } ?? meta.names
        for (weightName, weight) in wanted {
            let dir = weightDir.appendingPathComponent(weightName)
            try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
            var shards: [String: [String: String]] = [:]
            if only != nil {
                // Keep the other symbols already in the shards.
                for file in (try? FileManager.default.contentsOfDirectory(atPath: dir.path)) ?? [] where file.hasSuffix(".txt") {
                    let text = (try? String(contentsOf: dir.appendingPathComponent(file), encoding: .utf8)) ?? ""
                    for line in text.split(separator: "\n") {
                        guard let tab = line.firstIndex(of: "\t") else { continue }
                        shards[String(file.dropLast(4)), default: [:]][String(line[..<tab])] = String(line[line.index(after: tab)...])
                    }
                }
            }
            var written = 0, skipped = 0, done = 0
            for name in todo {
                let (svg, _) = autoreleasepool { extract(name, weight: weight) }
                if let svg {
                    shards[shard(name), default: [:]][name] = svg.trimmingCharacters(in: .whitespacesAndNewlines)
                    written += 1
                } else {
                    skipped += 1
                }
                done += 1
                if done % 2000 == 0 { print("  \(weightName): \(done)/\(todo.count)") }
            }
            var bytes = 0
            for (key, entries) in shards {
                let text = entries.keys.sorted().map { "\($0)\t\(entries[$0]!)" }.joined(separator: "\n") + "\n"
                bytes += text.utf8.count
                try Data(text.utf8).write(to: dir.appendingPathComponent("\(key).txt"))
            }
            print("\(weightName): \(written) symbols in \(shards.count) files (\(bytes / 1024) KB) in server/assets/symbol-weights/\(weightName); \(skipped) skipped")
        }
        return
    }

    if verifyOnly == nil {
        try FileManager.default.createDirectory(at: svgDir, withIntermediateDirectories: true)
        var skipped: [String: [String]] = [:]
        var done = 0, bytes = 0
        let todo = only.map { o in meta.names.filter { o.contains($0) } } ?? meta.names
        for name in todo {
            let (svg, why) = autoreleasepool { extract(name) }
            if let svg {
                svgs[name] = svg
                let data = Data(svg.utf8)
                bytes += data.count
                try data.write(to: svgDir.appendingPathComponent("\(name).svg"))
            } else {
                skipped[why ?? "unknown", default: []].append(name)
            }
            done += 1
            if done % 1000 == 0 { print("  \(done)/\(todo.count)") }
        }
        print("SVGs: \(svgs.count) written to server/assets/symbols (\(bytes / 1024) KB)")
        for (why, names) in skipped.sorted(by: { $0.key < $1.key }) {
            print("  skipped \(names.count) because \(why): \(names.prefix(8).joined(separator: ", "))\(names.count > 8 ? ", ..." : "")")
        }
        // The pack counts every shape on disk, so a run with --only keeps earlier shapes.
        let onDisk = Set(((try? FileManager.default.contentsOfDirectory(atPath: svgDir.path)) ?? [])
            .filter { $0.hasSuffix(".svg") }.map { String($0.dropLast(4)) })
        try writePack(meta, shapes: onDisk, to: packURL)
        print("Pack: \(meta.names.count) symbols, \(onDisk.intersection(meta.names).count) with shapes, written to server/src/pack/symbols.js")
        // The Worker's search index is built from the pack ahead of time (server/scripts/build-symbol-index.mjs).
        let node = Process()
        node.executableURL = URL(fileURLWithPath: "/usr/bin/env")
        node.arguments = ["node", repo.appendingPathComponent("server/scripts/build-symbol-index.mjs").path]
        try node.run()
        node.waitUntilExit()
        if node.terminationStatus != 0 { print("  the symbol index was not rebuilt; run npm run pack:symbol-index in server/") }
    }

    if (option("--verify") ?? verifyOnly) == "all" {
        try verifyAll(meta.names, svgs: svgs)
        return
    }

    if let count = Int(option("--verify") ?? verifyOnly ?? "") {
        let fixed = (option("--check").map { $0.split(separator: ",").map(String.init) } ?? []) + ["heart", "heart.fill", "gearshape", "gearshape.fill", "square.and.arrow.up", "person.2.fill",
                     "heart.circle.fill", "wifi", "wifi.slash", "bell.slash.fill", "trash", "trash.slash",
                     "photo.badge.plus", "folder.badge.plus", "xmark.circle.fill", "checkmark.seal.fill", "apple.logo",
                     "person.crop.circle.badge.checkmark", "car.side.fill", "globe", "camera.fill", "mic.slash.circle.fill",
                     "eye.slash", "lock.open.fill", "square.and.pencil", "a.circle", "chart.bar.xaxis", "figure.walk"]
            .filter { meta.year[$0] != nil }
        var rng = SystemRandomNumberGenerator()
        let pool = meta.names.filter { !fixed.contains($0) }
        let random = (0..<max(0, count - fixed.count)).map { _ in pool.randomElement(using: &rng)! }
        var scores: [(String, Double)] = []
        for name in fixed + random {
            let svg = svgs[name] ?? (try? String(contentsOf: svgDir.appendingPathComponent("\(name).svg"), encoding: .utf8)) ?? extract(name).svg
            guard let svg, let score = overlap(name, svg: svg) else { print("  \(name): no shape to compare"); continue }
            scores.append((name, score))
        }
        scores.sort { $0.1 < $1.1 }
        let mean = scores.map(\.1).reduce(0, +) / Double(max(1, scores.count))
        print(String(format: "Verified %d symbols: mean overlap %.4f, worst %.4f", scores.count, mean, scores.first?.1 ?? 0))
        for (name, s) in scores.prefix(8) { print(String(format: "  %.4f  %@", s, name)) }
    }
}

try MainActor.assumeIsolated { try main() }
