// extract-symbols: writes server/src/pack/symbols.js and server/assets/symbols/NAME.svg.
//
//   swift run -c release extract-symbols                 everything
//   swift run -c release extract-symbols --only a,b      only these symbols' SVGs (the pack is still written)
//   swift run -c release extract-symbols --verify 60     also compare 60 SVGs (some fixed, the rest random)
//                                                        with the system's own rendering, pixel by pixel
//   swift run -c release extract-symbols --verify-only 60  compare without writing anything
import AppKit
import SwiftUI

let args = CommandLine.arguments
func option(_ name: String) -> String? { args.firstIndex(of: name).flatMap { $0 + 1 < args.count ? args[$0 + 1] : nil } }

let repo = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
    .deletingLastPathComponent().deletingLastPathComponent()
let packURL = repo.appendingPathComponent("server/src/pack/symbols.js")
let svgDir = repo.appendingPathComponent("server/assets/symbols")

/// The symbol drawn by SwiftUI as PDF: regular weight, medium scale, 100-point font.
@MainActor func renderPDF(_ name: String) -> Data? {
    guard NSImage(systemSymbolName: name, accessibilityDescription: nil) != nil else { return nil }
    let renderer = ImageRenderer(content: Image(systemName: name).font(.system(size: 100)).foregroundStyle(.black))
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

/// Reads back the path data this tool writes (M, L, Q, C, Z with absolute coordinates).
func parsePathData(_ d: String) -> CGMutablePath {
    let path = CGMutablePath()
    let scanner = Scanner(string: d)
    scanner.charactersToBeSkipped = CharacterSet(charactersIn: " ,")
    func n() -> CGFloat { CGFloat(scanner.scanDouble() ?? 0) }
    func p() -> CGPoint { let x = n(); return CGPoint(x: x, y: n()) }
    while !scanner.isAtEnd {
        guard let c = scanner.scanCharacter() else { break }
        switch c {
        case "M": path.move(to: p())
        case "L": path.addLine(to: p())
        case "Q": let a = p(); path.addQuadCurve(to: p(), control: a)
        case "C": let a = p(), b = p(); path.addCurve(to: p(), control1: a, control2: b)
        case "Z": path.closeSubpath()
        default: break
        }
    }
    return path
}

/// Coverage (alpha, 0 to 255) of each pixel.
func mask(width: Int, height: Int, draw: (CGContext) -> Void) -> [Int] {
    let ctx = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width,
                        space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.alphaOnly.rawValue)!
    draw(ctx)
    let buf = ctx.data!.bindMemory(to: UInt8.self, capacity: width * height)
    return (0..<(width * height)).map { Int(buf[$0]) }
}

/// Overlap of the SVG's pixels and the system's own drawing of the symbol:
/// the PDF that SwiftUI draws, rasterized by Core Graphics with its soft masks, at 2x.
@MainActor func overlap(_ name: String, svg: String) -> Double? {
    guard let vb = svg.range(of: #"viewBox="0 0 (\d+) (\d+)""#, options: .regularExpression) else { return nil }
    let dims = svg[vb].split(whereSeparator: { !$0.isNumber }).compactMap { Int($0) }
    let (w, h) = (dims[2], dims[3])
    let (W, H) = (w * 2, h * 2)
    guard let pdf = renderPDF(name), let provider = CGDataProvider(data: pdf as CFData),
          let page = CGPDFDocument(provider)?.page(at: 1) else { print("  \(name): no reference drawing"); return nil }
    let a = mask(width: W, height: H) { ctx in ctx.scaleBy(x: 2, y: 2); ctx.drawPDFPage(page) }
    let b = mask(width: W, height: H) { ctx in
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
    // Intersection over union on coverage, so translucent layers and anti-aliasing count by how much they cover.
    var inter = 0, uni = 0
    for i in 0..<a.count { inter += min(a[i], b[i]); uni += max(a[i], b[i]) }
    if let dir = ProcessInfo.processInfo.environment["DIFF_DIR"] {
        // Gray where both agree, red where only the system draws, blue where only the SVG does.
        var px = [UInt8](repeating: 255, count: W * H * 4)
        for i in 0..<a.count {
            let (x, y) = (a[i] > 127, b[i] > 127)
            let c: (UInt8, UInt8, UInt8) = x && y ? (160, 160, 160) : x ? (230, 0, 0) : y ? (0, 0, 230) : (255, 255, 255)
            px[i * 4] = c.0; px[i * 4 + 1] = c.1; px[i * 4 + 2] = c.2
        }
        let ctx = CGContext(data: &px, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4,
                            space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
        let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
        try? rep.representation(using: .png, properties: [:])?.write(to: URL(fileURLWithPath: dir).appendingPathComponent("\(name).png"))
    }
    return uni == 0 ? 1 : Double(inter) / Double(uni)
}

// MARK: - Main

@MainActor func main() throws {
    let meta = Metadata.load()
    print("SF Symbols \(meta.appVersion), macOS \(meta.macOSVersion): \(meta.names.count) names (\(meta.systemNames.count) on this macOS)")

    let verifyOnly = option("--verify-only")
    let only = option("--only").map { Set($0.split(separator: ",").map(String.init)) }
    var svgs: [String: String] = [:]

    func extract(_ name: String) -> (svg: String?, why: String?) {
        guard let pdf = renderPDF(name) else { return (nil, "macOS cannot draw it") }
        guard let shape = readPDF(pdf) else { return (nil, "the PDF could not be read") }
        if !shape.unsupported.isEmpty { return (nil, "the PDF holds \(shape.unsupported.sorted().joined(separator: ", "))") }
        if shape.fills.isEmpty { return (nil, "it draws nothing") }
        return (svgDocument(shape), nil)
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
