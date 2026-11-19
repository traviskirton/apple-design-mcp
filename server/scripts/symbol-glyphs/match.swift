// Names the SF Symbols behind private-use code points by shape: each code point's glyph in SF Pro is
// drawn on a small grid and compared with every symbol's outline (server/assets/symbols/NAME.svg).
// Needs a Mac with the SF Pro font installed and server/assets/symbols present.
// usage: swiftc -O match.swift -o match && ./match REPO HEX [HEX ...] > out.txt   (NO_ASPECT=1 drops the proportion check)
// then:  node resolve.mjs out.txt
import CoreGraphics
import CoreText
import Foundation

let args = CommandLine.arguments
let repo = args[1]
let N = 64 // grid size

func parse(_ d: String) -> CGMutablePath {
    let p = CGMutablePath(); let sc = Scanner(string: d); sc.charactersToBeSkipped = CharacterSet(charactersIn: " ,")
    func n() -> CGFloat { CGFloat(sc.scanDouble() ?? 0) }
    func pt() -> CGPoint { let x = n(); return CGPoint(x: x, y: n()) }
    while !sc.isAtEnd {
        guard let c = sc.scanCharacter() else { break }
        switch c {
        case "M": p.move(to: pt()); case "L": p.addLine(to: pt())
        case "Q": let a = pt(); p.addQuadCurve(to: pt(), control: a)
        case "C": let a = pt(), b = pt(); p.addCurve(to: pt(), control1: a, control2: b)
        case "Z": p.closeSubpath(); default: break
        }
    }
    return p
}

/// The paths scaled to fit an N×N grid (keeping proportions, centred), as 8-bit coverage, plus the aspect ratio.
func fingerprint(_ parts: [(CGPath, Bool)], flipped: Bool) -> (bits: [UInt8], aspect: CGFloat) {
    let b = parts.map { $0.0.boundingBox }.reduce(CGRect.null) { $0.union($1) }
    guard b.width > 0, b.height > 0 else { return ([], 0) }
    let s = CGFloat(N) / max(b.width, b.height)
    var px = [UInt8](repeating: 0, count: N * N)
    let ctx = CGContext(data: &px, width: N, height: N, bitsPerComponent: 8, bytesPerRow: N, space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.none.rawValue)!
    ctx.translateBy(x: CGFloat(N) / 2, y: CGFloat(N) / 2)
    ctx.scaleBy(x: s, y: flipped ? -s : s)
    ctx.translateBy(x: -b.midX, y: -b.midY)
    ctx.setFillColor(gray: 1, alpha: 1)
    for (path, evenOdd) in parts { ctx.addPath(path); ctx.fillPath(using: evenOdd ? .evenOdd : .winding) }
    return (px, b.width / b.height)
}

func iou(_ a: [UInt8], _ b: [UInt8]) -> Double {
    var i = 0, u = 0
    for k in 0..<min(a.count, b.count) { i += Int(min(a[k], b[k])); u += Int(max(a[k], b[k])) }
    return u == 0 ? 0 : Double(i) / Double(u)
}

// Every symbol's outline: its opaque paths, each with its own fill rule (translucent layers left out).
let dir = "\(repo)/server/assets/symbols"
let re = try! NSRegularExpression(pattern: #"<path( fill-rule="evenodd")?( fill-opacity="[\d.]+")? d="([^"]*)"/>"#)
var symbols: [(name: String, bits: [UInt8], aspect: CGFloat)] = []
for file in try! FileManager.default.contentsOfDirectory(atPath: dir) where file.hasSuffix(".svg") {
    let svg = try! String(contentsOfFile: "\(dir)/\(file)", encoding: .utf8)
    var parts: [(CGPath, Bool)] = []
    for m in re.matches(in: svg, range: NSRange(svg.startIndex..., in: svg)) where m.range(at: 2).location == NSNotFound {
        parts.append((parse(String(svg[Range(m.range(at: 3), in: svg)!])), m.range(at: 1).location != NSNotFound))
    }
    let f = fingerprint(parts, flipped: false)
    if !f.bits.isEmpty { symbols.append((String(file.dropLast(4)), f.bits, f.aspect)) }
}

let font = CTFontCreateWithName("SF Pro" as CFString, 100, nil)
let fontURL = CTFontCopyAttribute(font, kCTFontURLAttribute) as? URL
print("font: \(CTFontCopyFullName(font) as String) at \(fontURL?.path ?? "?"); \(symbols.count) symbol outlines")
for hex in args.dropFirst(2) {
    let cp = UInt32(hex, radix: 16)!
    var utf16 = Array(String(UnicodeScalar(cp)!).utf16)
    var glyphs = [CGGlyph](repeating: 0, count: utf16.count)
    guard CTFontGetGlyphsForCharacters(font, &utf16, &glyphs, utf16.count), glyphs[0] != 0,
          let path = CTFontCreatePathForGlyph(font, glyphs[0], nil) else { print("\(hex) unknown (no glyph)"); continue }
    let g = fingerprint([(path, false)], flipped: false)
    // Font glyphs are y-up and the SVGs y-down: compare against the SVG flipped.
    let scored = symbols.map { s -> (String, Double) in
        let flippedBits = (0..<N).flatMap { y in s.bits[(N - 1 - y) * N ..< (N - y) * N] }
        let aspectPenalty = ProcessInfo.processInfo.environment["NO_ASPECT"] != nil ? 1 : (abs(log(Double(g.aspect / s.aspect))) > 0.08 ? 0.5 : 1)
        return (s.name, iou(g.bits, Array(flippedBits)) * aspectPenalty)
    }.sorted { $0.1 > $1.1 }
    let best = scored[0]
    let ties = scored.prefix(while: { $0.1 >= best.1 - 0.0001 }).map(\.0)
    print(String(format: "%@ %@ %.3f next %.3f %@", hex, best.0, best.1, scored[ties.count].1, ties.count > 1 ? "ties: " + ties.joined(separator: ",") : ""))
}
