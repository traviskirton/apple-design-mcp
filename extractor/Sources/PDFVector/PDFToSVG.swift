// Reads the vector drawing in a PDF page into plain filled paths, for SVG output.
//
// Supported: paths, transforms (`cm`, form matrices), clips (`W n` and form bounding boxes), fill and
// stroke colors (gray, RGB, CMYK and ICC-based spaces), line width, caps, joins and miter limit,
// opacity, and soft masks. Strokes become filled outlines, and clips and masks are applied with
// Core Graphics' boolean path operations, so the result needs nothing but filled paths.
//
// SwiftUI draws a symbol's cut-outs (the heart inside heart.circle.fill, the gap beside a slash) as
// soft masks: a luminosity mask on a white backdrop with the cut-out shape filled in black. Those
// become path subtraction.
//
// Text in simple fonts (Type 1, CFF, TrueType) whose program is embedded in the PDF is turned into
// glyph outlines, so a symbol set as text in a font becomes paths.
//
// Not supported, reported in `unsupported`: other text, images, shadings and patterns, dashes.
import CoreGraphics
import CoreText
import Foundation

public struct RGB: Hashable {
    public var r: CGFloat, g: CGFloat, b: CGFloat
    public static let black = RGB(r: 0, g: 0, b: 0)
    public init(r: CGFloat, g: CGFloat, b: CGFloat) { self.r = r; self.g = g; self.b = b }
    public var hex: String {
        let c = [r, g, b].map { Int(($0 * 255).rounded()).clamped(0, 255) }
        return String(format: "#%02x%02x%02x", c[0], c[1], c[2])
    }
}

extension Int {
    func clamped(_ lo: Int, _ hi: Int) -> Int { Swift.min(Swift.max(self, lo), hi) }
}

public struct Fill {
    public var path: CGPath
    public var evenOdd: Bool
    /// Below 1 for translucent paint.
    public var opacity: CGFloat = 1
    public var color: RGB = .black
    public init(path: CGPath, evenOdd: Bool, opacity: CGFloat = 1, color: RGB = .black) {
        self.path = path; self.evenOdd = evenOdd; self.opacity = opacity; self.color = color
    }
}

private struct GState {
    var ctm = CGAffineTransform.identity
    var alpha: CGFloat = 1
    var strokeAlpha: CGFloat = 1
    /// Opacity of the transparency groups being drawn, applied to everything inside them.
    var groupAlpha: CGFloat = 1
    var fillColor = RGB.black
    var strokeColor = RGB.black
    var fillComponents = 1
    var strokeComponents = 1
    var lineWidth: CGFloat = 1
    var lineCap = CGLineCap.butt
    var lineJoin = CGLineJoin.miter
    var miterLimit: CGFloat = 10
    /// Shape removed from (or, for a black-backdrop mask, kept from) every fill, in page space.
    var mask: CGPath?
    var maskSubtracts = true
    /// A soft mask hides everything outside its group's bounding box.
    var maskBounds: CGPath?
    /// The clip, in page space: a form's bounding box, a `W n` path, or a clip given by the caller.
    var clip: CGPath?
}

/// Reads the drawing operators of one content stream and collects its fills in page space.
private final class Interpreter {
    var state = GState()
    var stack: [GState] = []
    /// The current path, in user space; it is transformed when it is painted.
    var path = CGMutablePath()
    var pendingClip: (CGPath, Bool)?
    var fills: [Fill] = []
    var unsupported = Set<String>()
    let contentStream: CGPDFContentStreamRef
    // Text state (PDF 1.7, 9.3 and 9.4).
    var textMatrix = CGAffineTransform.identity
    var lineMatrix = CGAffineTransform.identity
    var fontName: String?
    var fontSize: CGFloat = 1
    var charSpacing: CGFloat = 0
    var wordSpacing: CGFloat = 0
    var horizontalScale: CGFloat = 1
    var leading: CGFloat = 0
    var rise: CGFloat = 0
    var fonts: [String: EmbeddedFont?] = [:]

    init(contentStream: CGPDFContentStreamRef, state: GState) {
        self.contentStream = contentStream
        self.state = state
    }

    func run() {
        let table = CGPDFOperatorTableCreate()!
        func on(_ op: String, _ cb: @escaping CGPDFOperatorCallback) { CGPDFOperatorTableSetCallback(table, op, cb) }

        on("q") { _, i in let s = me(i); s.stack.append(s.state) }
        on("Q") { _, i in let s = me(i); if let last = s.stack.popLast() { s.state = last } }
        on("cm") { sc, i in
            let s = me(i)
            let n = popNumbers(sc, 6)
            s.state.ctm = CGAffineTransform(a: n[0], b: n[1], c: n[2], d: n[3], tx: n[4], ty: n[5]).concatenating(s.state.ctm)
        }
        on("m") { sc, i in let n = popNumbers(sc, 2); me(i).path.move(to: CGPoint(x: n[0], y: n[1])) }
        on("l") { sc, i in let n = popNumbers(sc, 2); me(i).path.addLine(to: CGPoint(x: n[0], y: n[1])) }
        on("c") { sc, i in
            let n = popNumbers(sc, 6)
            me(i).path.addCurve(to: CGPoint(x: n[4], y: n[5]), control1: CGPoint(x: n[0], y: n[1]), control2: CGPoint(x: n[2], y: n[3]))
        }
        on("v") { sc, i in
            let s = me(i); let n = popNumbers(sc, 4)
            s.path.addCurve(to: CGPoint(x: n[2], y: n[3]), control1: s.path.currentPoint, control2: CGPoint(x: n[0], y: n[1]))
        }
        on("y") { sc, i in
            let n = popNumbers(sc, 4)
            me(i).path.addCurve(to: CGPoint(x: n[2], y: n[3]), control1: CGPoint(x: n[0], y: n[1]), control2: CGPoint(x: n[2], y: n[3]))
        }
        on("h") { _, i in me(i).path.closeSubpath() }
        on("re") { sc, i in let n = popNumbers(sc, 4); me(i).path.addRect(CGRect(x: n[0], y: n[1], width: n[2], height: n[3])) }

        on("f") { _, i in me(i).paint(fill: true, evenOdd: false, stroke: false) }
        on("F") { _, i in me(i).paint(fill: true, evenOdd: false, stroke: false) }
        on("f*") { _, i in me(i).paint(fill: true, evenOdd: true, stroke: false) }
        on("S") { _, i in me(i).paint(fill: false, evenOdd: false, stroke: true) }
        on("s") { _, i in let s = me(i); s.path.closeSubpath(); s.paint(fill: false, evenOdd: false, stroke: true) }
        on("B") { _, i in me(i).paint(fill: true, evenOdd: false, stroke: true) }
        on("B*") { _, i in me(i).paint(fill: true, evenOdd: true, stroke: true) }
        on("b") { _, i in let s = me(i); s.path.closeSubpath(); s.paint(fill: true, evenOdd: false, stroke: true) }
        on("b*") { _, i in let s = me(i); s.path.closeSubpath(); s.paint(fill: true, evenOdd: true, stroke: true) }
        on("n") { _, i in me(i).endPath() }
        on("W") { _, i in let s = me(i); s.pendingClip = (s.transformed(s.path), false) }
        on("W*") { _, i in let s = me(i); s.pendingClip = (s.transformed(s.path), true) }

        on("w") { sc, i in me(i).state.lineWidth = popNumbers(sc, 1)[0] }
        on("J") { sc, i in me(i).state.lineCap = [CGLineCap.butt, .round, .square][Int(popNumbers(sc, 1)[0]).clamped(0, 2)] }
        on("j") { sc, i in me(i).state.lineJoin = [CGLineJoin.miter, .round, .bevel][Int(popNumbers(sc, 1)[0]).clamped(0, 2)] }
        on("M") { sc, i in me(i).state.miterLimit = popNumbers(sc, 1)[0] }
        on("d") { sc, i in
            var array: CGPDFArrayRef?
            var phase: CGPDFReal = 0
            CGPDFScannerPopNumber(sc, &phase)
            if CGPDFScannerPopArray(sc, &array), let array, CGPDFArrayGetCount(array) > 0 { me(i).unsupported.insert("dashed lines (drawn solid)") }
        }

        // Colors. The number of components comes from the color space set with cs / CS.
        on("cs") { sc, i in let s = me(i); s.state.fillComponents = s.components(popName(sc)); s.state.fillColor = .black }
        on("CS") { sc, i in let s = me(i); s.state.strokeComponents = s.components(popName(sc)); s.state.strokeColor = .black }
        for op in ["sc", "scn"] { on(op) { sc, i in let s = me(i); s.state.fillColor = color(popAll(sc), s.state.fillComponents) } }
        for op in ["SC", "SCN"] { on(op) { sc, i in let s = me(i); s.state.strokeColor = color(popAll(sc), s.state.strokeComponents) } }
        on("g") { sc, i in me(i).state.fillColor = color(popNumbers(sc, 1), 1) }
        on("G") { sc, i in me(i).state.strokeColor = color(popNumbers(sc, 1), 1) }
        on("rg") { sc, i in me(i).state.fillColor = color(popNumbers(sc, 3), 3) }
        on("RG") { sc, i in me(i).state.strokeColor = color(popNumbers(sc, 3), 3) }
        on("k") { sc, i in me(i).state.fillColor = color(popNumbers(sc, 4), 4) }
        on("K") { sc, i in me(i).state.strokeColor = color(popNumbers(sc, 4), 4) }

        on("gs") { sc, i in if let n = popName(sc) { me(i).applyExtGState(n) } }
        on("Do") { sc, i in if let n = popName(sc) { me(i).drawXObject(n) } }
        on("BT") { _, i in let s = me(i); s.textMatrix = .identity; s.lineMatrix = .identity }
        on("Tf") { sc, i in let s = me(i); s.fontSize = popNumbers(sc, 1)[0]; s.fontName = popName(sc) }
        on("Tm") { sc, i in
            let s = me(i); let n = popNumbers(sc, 6)
            s.textMatrix = CGAffineTransform(a: n[0], b: n[1], c: n[2], d: n[3], tx: n[4], ty: n[5]); s.lineMatrix = s.textMatrix
        }
        on("Td") { sc, i in let s = me(i); let n = popNumbers(sc, 2); s.nextLine(n[0], n[1]) }
        on("TD") { sc, i in let s = me(i); let n = popNumbers(sc, 2); s.leading = -n[1]; s.nextLine(n[0], n[1]) }
        on("T*") { _, i in let s = me(i); s.nextLine(0, -s.leading) }
        on("TL") { sc, i in me(i).leading = popNumbers(sc, 1)[0] }
        on("Tc") { sc, i in me(i).charSpacing = popNumbers(sc, 1)[0] }
        on("Tw") { sc, i in me(i).wordSpacing = popNumbers(sc, 1)[0] }
        on("Tz") { sc, i in me(i).horizontalScale = popNumbers(sc, 1)[0] / 100 }
        on("Ts") { sc, i in me(i).rise = popNumbers(sc, 1)[0] }
        on("Tj") { sc, i in let s = me(i); if let b = popBytes(sc) { s.show(b) } }
        on("'") { sc, i in let s = me(i); s.nextLine(0, -s.leading); if let b = popBytes(sc) { s.show(b) } }
        on("\"") { sc, i in
            let s = me(i); let b = popBytes(sc); let n = popNumbers(sc, 2)
            s.wordSpacing = n[0]; s.charSpacing = n[1]; s.nextLine(0, -s.leading); if let b { s.show(b) }
        }
        on("TJ") { sc, i in
            let s = me(i)
            var array: CGPDFArrayRef?
            guard CGPDFScannerPopArray(sc, &array), let array else { return }
            for k in 0..<CGPDFArrayGetCount(array) {
                var str: CGPDFStringRef?
                var n: CGPDFReal = 0
                if CGPDFArrayGetString(array, k, &str), let str, let ptr = CGPDFStringGetBytePtr(str) {
                    s.show(Array(UnsafeBufferPointer(start: ptr, count: CGPDFStringGetLength(str))))
                } else if CGPDFArrayGetNumber(array, k, &n) {
                    s.textMatrix = CGAffineTransform(translationX: -n / 1000 * s.fontSize * s.horizontalScale, y: 0).concatenating(s.textMatrix)
                }
            }
        }
        on("BI") { _, i in me(i).unsupported.insert("images") }
        on("sh") { _, i in me(i).unsupported.insert("shadings") }

        let scanner = CGPDFScannerCreate(contentStream, table, Unmanaged.passUnretained(self).toOpaque())
        CGPDFScannerScan(scanner)
        CGPDFScannerRelease(scanner)
        CGPDFOperatorTableRelease(table)
    }

    func nextLine(_ tx: CGFloat, _ ty: CGFloat) {
        lineMatrix = CGAffineTransform(translationX: tx, y: ty).concatenating(lineMatrix)
        textMatrix = lineMatrix
    }

    func font(_ name: String) -> EmbeddedFont? {
        if let cached = fonts[name] { return cached }
        let f = dictionary("Font", name).flatMap(EmbeddedFont.init)
        fonts[name] = f
        return f
    }

    /// Draws a string's glyphs as filled outlines and advances the text position.
    func show(_ bytes: [UInt8]) {
        guard let name = fontName, let font = font(name) else { unsupported.insert("text"); return }
        for code in bytes {
            let render = CGAffineTransform(a: fontSize * horizontalScale, b: 0, c: 0, d: fontSize, tx: 0, ty: rise)
                .concatenating(textMatrix).concatenating(state.ctm)
            if let glyph = font.path(Int(code)) {
                var t = render
                if let outline = glyph.copy(using: &t) { add(outline, evenOdd: false, alpha: state.alpha, color: state.fillColor) }
            } else {
                unsupported.insert("text in an unreadable font")
            }
            let advance = (font.width(Int(code)) * fontSize + charSpacing + (code == 32 ? wordSpacing : 0)) * horizontalScale
            textMatrix = CGAffineTransform(translationX: advance, y: 0).concatenating(textMatrix)
        }
    }

    func transformed(_ p: CGPath) -> CGPath {
        var t = state.ctm
        return p.copy(using: &t) ?? p
    }

    func endPath() {
        if let (shape, evenOdd) = pendingClip { state.clip = clipped(state.clip, by: shape, evenOdd: evenOdd) }
        pendingClip = nil
        path = CGMutablePath()
    }

    func paint(fill: Bool, evenOdd: Bool, stroke: Bool) {
        defer { endPath() }
        guard !path.isEmpty else { return }
        if fill { add(transformed(path), evenOdd: evenOdd, alpha: state.alpha, color: state.fillColor) }
        if stroke, state.lineWidth > 0 {
            // A zero-width line is the thinnest line the device can draw; use a hairline.
            let width = state.lineWidth
            let outline = path.copy(strokingWithWidth: width, lineCap: state.lineCap, lineJoin: state.lineJoin, miterLimit: state.miterLimit)
            add(transformed(outline), evenOdd: false, alpha: state.strokeAlpha, color: state.strokeColor)
        }
    }

    func add(_ painted: CGPath, evenOdd: Bool, alpha: CGFloat, color: RGB) {
        let alpha = alpha * state.groupAlpha
        guard alpha > 0.001, !painted.isEmpty else { return }
        var shape = painted
        var eo = evenOdd
        let rule: CGPathFillRule = eo ? .evenOdd : .winding
        if let clip = state.clip, !contains(clip, shape) {
            guard clip.boundingBox.intersects(shape.boundingBox) else { return }
            shape = shape.intersection(clip, using: rule)
            eo = false // the result of a boolean operation fills correctly with the nonzero rule
        }
        if let mask = state.mask, mask.boundingBox.intersects(shape.boundingBox) {
            let r: CGPathFillRule = eo ? .evenOdd : .winding
            shape = state.maskSubtracts ? shape.subtracting(mask, using: r) : shape.intersection(mask, using: r)
            eo = false
        }
        if let bounds = state.maskBounds, !contains(bounds, shape) {
            shape = shape.intersection(bounds, using: eo ? .evenOdd : .winding)
            eo = false
        }
        if !shape.isEmpty { fills.append(Fill(path: shape, evenOdd: eo, opacity: alpha, color: color)) }
    }

    func resource(_ category: String, _ name: String) -> CGPDFObjectRef? {
        CGPDFContentStreamGetResource(contentStream, category, name)
    }

    func dictionary(_ category: String, _ name: String) -> CGPDFDictionaryRef? {
        guard let obj = resource(category, name) else { return nil }
        var dict: CGPDFDictionaryRef?
        if CGPDFObjectGetValue(obj, .dictionary, &dict) { return dict }
        var stream: CGPDFStreamRef?
        if CGPDFObjectGetValue(obj, .stream, &stream), let stream { return CGPDFStreamGetDictionary(stream) }
        return nil
    }

    /// Components of a color space by name: a device space, or an entry in the ColorSpace resources.
    func components(_ name: String?) -> Int {
        switch name {
        case "DeviceGray", "CalGray", "G": return 1
        case "DeviceRGB", "CalRGB", "RGB": return 3
        case "DeviceCMYK", "CMYK": return 4
        case "Pattern": unsupported.insert("patterns (drawn black)"); return 0
        case nil: return 1
        default: break
        }
        guard let obj = resource("ColorSpace", name!) else { return 3 }
        var array: CGPDFArrayRef?
        guard CGPDFObjectGetValue(obj, .array, &array), let array else { return 3 }
        var family: UnsafePointer<CChar>?
        CGPDFArrayGetName(array, 0, &family)
        switch family.map({ String(cString: $0) }) {
        case "ICCBased":
            var stream: CGPDFStreamRef?
            var n: CGPDFInteger = 3
            if CGPDFArrayGetStream(array, 1, &stream), let stream, let dict = CGPDFStreamGetDictionary(stream) { CGPDFDictionaryGetInteger(dict, "N", &n) }
            return Int(n)
        case "CalGray": return 1
        case "Pattern": unsupported.insert("patterns (drawn black)"); return 0
        default: return 3
        }
    }

    func applyExtGState(_ name: String) {
        guard let gs = dictionary("ExtGState", name) else { return }
        var v: CGPDFReal = 1
        if CGPDFDictionaryGetNumber(gs, "ca", &v) { state.alpha = v }
        if CGPDFDictionaryGetNumber(gs, "CA", &v) { state.strokeAlpha = v }
        if CGPDFDictionaryGetNumber(gs, "LW", &v) { state.lineWidth = v }
        var smaskName: UnsafePointer<CChar>?
        if CGPDFDictionaryGetName(gs, "SMask", &smaskName) { state.mask = nil; state.maskBounds = nil; return } // /SMask /None
        var smask: CGPDFDictionaryRef?
        guard CGPDFDictionaryGetDictionary(gs, "SMask", &smask), let smask else { return }
        var group: CGPDFStreamRef?
        guard CGPDFDictionaryGetStream(smask, "G", &group), let group else { return }
        // A white backdrop (/BC [1]) with black shapes cuts those shapes out; otherwise the shapes are what shows.
        var backdrop: CGPDFArrayRef?
        var first: CGPDFReal = 0
        let white = CGPDFDictionaryGetArray(smask, "BC", &backdrop) && backdrop != nil
            && CGPDFArrayGetNumber(backdrop!, 0, &first) && first > 0.5
        var maskState = GState()
        maskState.ctm = state.ctm // a mask is placed by the transform in force when it is set
        let shapes = runForm(group, state: maskState)
        state.maskBounds = formBBox(group).map { CGPath(rect: $0, transform: [formMatrix(group).concatenating(state.ctm)]) }
        guard !shapes.isEmpty else { state.mask = nil; return }
        var union: CGPath = shapes[0].path
        for f in shapes.dropFirst() { union = union.union(f.path) }
        state.mask = union
        state.maskSubtracts = white
    }

    func drawXObject(_ name: String) {
        guard let obj = resource("XObject", name) else { return }
        var stream: CGPDFStreamRef?
        guard CGPDFObjectGetValue(obj, .stream, &stream), let stream, let dict = CGPDFStreamGetDictionary(stream) else { return }
        var subtype: UnsafePointer<CChar>?
        CGPDFDictionaryGetName(dict, "Subtype", &subtype)
        if subtype.map({ String(cString: $0) }) == "Image" { unsupported.insert("images"); return }
        var inner = state
        var group: CGPDFDictionaryRef?
        if CGPDFDictionaryGetDictionary(dict, "Group", &group) {
            // A transparency group is drawn as a whole at the current opacity, with opacity reset to 1
            // inside it. Applying that opacity to each path inside is exact unless the paths overlap.
            inner.groupAlpha *= state.alpha
            inner.alpha = 1
            inner.strokeAlpha = 1
        }
        fills += runForm(stream, state: inner)
    }

    /// The fills of a form XObject drawn with `state`, clipped to the form's bounding box.
    func runForm(_ stream: CGPDFStreamRef, state: GState) -> [Fill] {
        guard let resources = formResources(stream) else { unsupported.insert("a form without resources"); return [] }
        var inner = state
        inner.ctm = formMatrix(stream).concatenating(state.ctm)
        if let bbox = formBBox(stream) { inner.clip = clipped(inner.clip, by: CGPath(rect: bbox, transform: [inner.ctm]), evenOdd: false) }
        let child = Interpreter(contentStream: CGPDFContentStreamCreateWithStream(stream, resources, contentStream), state: inner)
        child.run()
        unsupported.formUnion(child.unsupported)
        return child.fills
    }
}

private func me(_ info: UnsafeMutableRawPointer?) -> Interpreter { Unmanaged<Interpreter>.fromOpaque(info!).takeUnretainedValue() }

private func color(_ v: [CGFloat], _ components: Int) -> RGB {
    switch (components, v.count) {
    case (_, 1): return RGB(r: v[0], g: v[0], b: v[0])
    case (4, 4), (_, 4): return RGB(r: (1 - v[0]) * (1 - v[3]), g: (1 - v[1]) * (1 - v[3]), b: (1 - v[2]) * (1 - v[3]))
    case (_, 3): return RGB(r: v[0], g: v[1], b: v[2])
    default: return .black
    }
}

/// The clip after intersecting it with `shape`.
private func clipped(_ clip: CGPath?, by shape: CGPath, evenOdd: Bool) -> CGPath {
    guard let clip else { return evenOdd ? shape.normalized(using: .evenOdd) : shape }
    if contains(shape, clip) { return clip }
    if contains(clip, shape) { return shape }
    return clip.intersection(shape, using: evenOdd ? .evenOdd : .winding)
}

/// True when `inner` lies inside `outer`, judged by bounding boxes; only for rectangular clips.
private func contains(_ outer: CGPath, _ inner: CGPath) -> Bool {
    outer.boundingBox.insetBy(dx: -0.01, dy: -0.01).contains(inner.boundingBox) && isRectangle(outer)
}

private func isRectangle(_ path: CGPath) -> Bool {
    var points = 0, curves = false
    path.applyWithBlock { el in
        switch el.pointee.type {
        case .moveToPoint, .addLineToPoint: points += 1
        case .addCurveToPoint, .addQuadCurveToPoint: curves = true
        default: break
        }
    }
    return !curves && points <= 5
}

private func formResources(_ stream: CGPDFStreamRef) -> CGPDFDictionaryRef? {
    var res: CGPDFDictionaryRef?
    if let dict = CGPDFStreamGetDictionary(stream) { CGPDFDictionaryGetDictionary(dict, "Resources", &res) }
    return res
}

private func formBBox(_ stream: CGPDFStreamRef) -> CGRect? {
    var array: CGPDFArrayRef?
    guard let dict = CGPDFStreamGetDictionary(stream), CGPDFDictionaryGetArray(dict, "BBox", &array), let array else { return nil }
    var n = [CGPDFReal](repeating: 0, count: 4)
    for i in 0..<4 { CGPDFArrayGetNumber(array, i, &n[i]) }
    return CGRect(x: min(n[0], n[2]), y: min(n[1], n[3]), width: abs(n[2] - n[0]), height: abs(n[3] - n[1]))
}

private func formMatrix(_ stream: CGPDFStreamRef) -> CGAffineTransform {
    var array: CGPDFArrayRef?
    guard let dict = CGPDFStreamGetDictionary(stream), CGPDFDictionaryGetArray(dict, "Matrix", &array), let array else { return .identity }
    var n = [CGPDFReal](repeating: 0, count: 6)
    for i in 0..<6 { CGPDFArrayGetNumber(array, i, &n[i]) }
    return CGAffineTransform(a: n[0], b: n[1], c: n[2], d: n[3], tx: n[4], ty: n[5])
}

/// Pops `count` numbers; the scanner hands them back last first.
private func popNumbers(_ scanner: CGPDFScannerRef, _ count: Int) -> [CGFloat] {
    var out = [CGFloat](repeating: 0, count: count)
    for i in stride(from: count - 1, through: 0, by: -1) {
        var v: CGPDFReal = 0
        CGPDFScannerPopNumber(scanner, &v)
        out[i] = v
    }
    return out
}

/// Pops every number on the operand stack (a color's components), in order.
private func popAll(_ scanner: CGPDFScannerRef) -> [CGFloat] {
    var out: [CGFloat] = []
    var v: CGPDFReal = 0
    while out.count < 4, CGPDFScannerPopNumber(scanner, &v) { out.insert(v, at: 0) }
    return out
}

private func popBytes(_ scanner: CGPDFScannerRef) -> [UInt8]? {
    var str: CGPDFStringRef?
    guard CGPDFScannerPopString(scanner, &str), let str, let ptr = CGPDFStringGetBytePtr(str) else { return nil }
    return Array(UnsafeBufferPointer(start: ptr, count: CGPDFStringGetLength(str)))
}

/// A simple font (one byte per character) whose program is embedded in the PDF.
private final class EmbeddedFont {
    let ctFont: CTFont
    let cgFont: CGFont
    var names: [Int: String] = [:]
    var widths: [Int: CGFloat] = [:]
    var cache: [Int: CGPath?] = [:]

    init?(_ dict: CGPDFDictionaryRef) {
        var subtype: UnsafePointer<CChar>?
        CGPDFDictionaryGetName(dict, "Subtype", &subtype)
        guard let subtype, ["Type1", "TrueType", "MMType1"].contains(String(cString: subtype)) else { return nil }
        var descriptor: CGPDFDictionaryRef?
        guard CGPDFDictionaryGetDictionary(dict, "FontDescriptor", &descriptor), let descriptor else { return nil }
        var program: CGPDFStreamRef?
        for key in ["FontFile3", "FontFile2", "FontFile"] where program == nil { CGPDFDictionaryGetStream(descriptor, key, &program) }
        var format = CGPDFDataFormat.raw
        guard let program, let data = CGPDFStreamCopyData(program, &format), let provider = CGDataProvider(data: data),
              let cg = CGFont(provider) else { return nil }
        cgFont = cg
        ctFont = CTFontCreateWithGraphicsFont(cg, 1, nil, nil) // one unit per em: outlines in text space
        var encoding: CGPDFDictionaryRef?
        var differences: CGPDFArrayRef?
        if CGPDFDictionaryGetDictionary(dict, "Encoding", &encoding), let encoding,
           CGPDFDictionaryGetArray(encoding, "Differences", &differences), let differences {
            var code = 0
            for k in 0..<CGPDFArrayGetCount(differences) {
                var n: CGPDFInteger = 0
                var name: UnsafePointer<CChar>?
                if CGPDFArrayGetInteger(differences, k, &n) { code = n }
                else if CGPDFArrayGetName(differences, k, &name), let name { names[code] = String(cString: name); code += 1 }
            }
        }
        var first: CGPDFInteger = 0
        var w: CGPDFArrayRef?
        if CGPDFDictionaryGetInteger(dict, "FirstChar", &first), CGPDFDictionaryGetArray(dict, "Widths", &w), let w {
            for k in 0..<CGPDFArrayGetCount(w) {
                var v: CGPDFReal = 0
                if CGPDFArrayGetNumber(w, k, &v) { widths[first + k] = v / 1000 }
            }
        }
    }

    func width(_ code: Int) -> CGFloat { widths[code] ?? 0 }

    func path(_ code: Int) -> CGPath? {
        if let cached = cache[code] { return cached }
        var glyph: CGGlyph = 0
        if let name = names[code] ?? asciiGlyphName(code) { glyph = cgFont.getGlyphWithGlyphName(name: name as CFString) }
        if glyph == 0 {
            var chars: [UniChar] = [UniChar(code)]
            var g: [CGGlyph] = [0]
            if CTFontGetGlyphsForCharacters(ctFont, &chars, &g, 1) { glyph = g[0] }
        }
        let p: CGPath? = glyph == 0 ? nil : (CTFontCreatePathForGlyph(ctFont, glyph, nil) ?? CGMutablePath())
        cache[code] = p
        return p
    }
}

/// The glyph name of a printable ASCII code; the same in Standard, MacRoman and WinAnsi encodings
/// (where they differ, in the quote characters, the Standard name is used).
private func asciiGlyphName(_ code: Int) -> String? {
    let names = ["space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quotesingle", "parenleft",
                 "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four",
                 "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at"]
    switch code {
    case 32...64: return names[code - 32]
    case 65...90, 97...122: return String(UnicodeScalar(UInt8(code)))
    case 91: return "bracketleft"
    case 92: return "backslash"
    case 93: return "bracketright"
    case 94: return "asciicircum"
    case 95: return "underscore"
    case 96: return "grave"
    case 123: return "braceleft"
    case 124: return "bar"
    case 125: return "braceright"
    case 126: return "asciitilde"
    default: return nil
    }
}

private func popName(_ scanner: CGPDFScannerRef) -> String? {
    var name: UnsafePointer<CChar>?
    guard CGPDFScannerPopName(scanner, &name), let name else { return nil }
    return String(cString: name)
}

public struct PDFShape {
    public var width: Int
    public var height: Int
    public var fills: [Fill]
    public var unsupported: Set<String>
}

/// The fills of a page, drawn with `transform` (page space to the caller's space) and clipped to
/// `clip` (in the caller's space).
public func readPage(_ page: CGPDFPage, transform: CGAffineTransform = .identity, clip: CGPath? = nil) -> (fills: [Fill], unsupported: Set<String>) {
    var state = GState()
    state.ctm = transform
    state.clip = clip
    let interpreter = Interpreter(contentStream: CGPDFContentStreamCreateWithPage(page), state: state)
    interpreter.run()
    return (interpreter.fills, interpreter.unsupported)
}

/// The fills of a one-page PDF, in page space (origin bottom left).
public func readPDF(_ data: Data) -> PDFShape? {
    guard let provider = CGDataProvider(data: data as CFData), let doc = CGPDFDocument(provider), let page = doc.page(at: 1) else { return nil }
    let box = page.getBoxRect(.mediaBox)
    let (fills, unsupported) = readPage(page)
    return PDFShape(width: Int(box.width.rounded()), height: Int(box.height.rounded()), fills: fills, unsupported: unsupported)
}

public func num(_ v: CGFloat, decimals: Int = 2) -> String {
    var s = String(format: "%.\(decimals)f", Double(v))
    if s.contains(".") {
        while s.hasSuffix("0") { s.removeLast() }
        if s.hasSuffix(".") { s.removeLast() }
    }
    return s == "-0" ? "0" : s
}

/// SVG path data with y flipped to SVG's top-left origin.
public func svgPathData(_ path: CGPath, height: CGFloat, decimals: Int = 2) -> String {
    var d: [String] = []
    func p(_ pt: CGPoint) -> String { "\(num(pt.x, decimals: decimals)) \(num(height - pt.y, decimals: decimals))" }
    path.applyWithBlock { el in
        let pts = el.pointee.points
        switch el.pointee.type {
        case .moveToPoint: d.append("M" + p(pts[0]))
        case .addLineToPoint: d.append("L" + p(pts[0]))
        case .addQuadCurveToPoint: d.append("Q" + p(pts[0]) + " " + p(pts[1]))
        case .addCurveToPoint: d.append("C" + p(pts[0]) + " " + p(pts[1]) + " " + p(pts[2]))
        case .closeSubpath: d.append("Z")
        @unknown default: break
        }
    }
    return d.joined()
}

/// A symbol's SVG: every fill in `currentColor`.
public func svgDocument(_ shape: PDFShape) -> String {
    let paths = shape.fills.map { f in
        "<path" + (f.evenOdd ? " fill-rule=\"evenodd\"" : "")
            + (f.opacity < 0.995 ? " fill-opacity=\"\(num(f.opacity))\"" : "") + " d=\"\(svgPathData(f.path, height: CGFloat(shape.height)))\"/>"
    }
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 \(shape.width) \(shape.height)\" fill=\"currentColor\">"
        + paths.joined() + "</svg>\n"
}

/// Reads back path data written by `svgPathData` (M, L, Q, C, Z with absolute coordinates).
public func parsePathData(_ d: String) -> CGMutablePath {
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

/// Coverage (alpha, 0 to 255) of each pixel of a `width` × `height` drawing.
public func coverage(width: Int, height: Int, draw: (CGContext) -> Void) -> [Int] {
    let ctx = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width,
                        space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.alphaOnly.rawValue)!
    draw(ctx)
    let buf = ctx.data!.bindMemory(to: UInt8.self, capacity: width * height)
    return (0..<(width * height)).map { Int(buf[$0]) }
}

/// Intersection over union of two coverage maps, 1.0 when identical.
public func overlapScore(_ a: [Int], _ b: [Int]) -> Double {
    var inter = 0, uni = 0
    for i in 0..<min(a.count, b.count) { inter += min(a[i], b[i]); uni += max(a[i], b[i]) }
    return uni == 0 ? 1 : Double(inter) / Double(uni)
}

// MARK: - Artwork: colored SVG and its check

/// An SVG of colored artwork: each fill keeps its own color and opacity; runs of fills with the same
/// paint are merged into one path element. `height` is the page height, for flipping y.
public func coloredSVG(_ fills: [Fill], width: CGFloat, height: CGFloat, decimals: Int = 2) -> String {
    var elements: [(style: String, d: String)] = []
    for fill in fills {
        let style = " fill=\"\(fill.color.hex)\"" + (fill.opacity < 0.995 ? " fill-opacity=\"\(num(fill.opacity))\"" : "")
            + (fill.evenOdd ? " fill-rule=\"evenodd\"" : "")
        let d = svgPathData(fill.path, height: height, decimals: decimals)
        if let last = elements.last, last.style == style { elements[elements.count - 1].d += d } else { elements.append((style, d)) }
    }
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 \(num(width)) \(num(height))\">"
        + elements.map { "<path\($0.style) d=\"\($0.d)\"/>" }.joined() + "</svg>"
}

/// RGBA pixels (premultiplied, sRGB) of a drawing.
public func rgbaPixels(_ w: Int, _ h: Int, _ draw: (CGContext) -> Void) -> [UInt8] {
    var px = [UInt8](repeating: 0, count: w * h * 4)
    let ctx = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                        space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    draw(ctx)
    return px
}

/// Draws an SVG written by `coloredSVG` (or `svgDocument`, in black) into a y-up context of its size.
public func drawColoredSVG(_ svg: String, in ctx: CGContext, height: CGFloat) {
    ctx.saveGState()
    ctx.translateBy(x: 0, y: height); ctx.scaleBy(x: 1, y: -1)
    let re = try! NSRegularExpression(pattern: ##"<path(?: fill="#([0-9a-f]{6})")?(?: fill-opacity="([\d.]+)")?( fill-rule="evenodd")? d="([^"]*)"/>"##)
    for m in re.matches(in: svg, range: NSRange(svg.startIndex..., in: svg)) {
        let hex = Range(m.range(at: 1), in: svg).flatMap { Int(svg[$0], radix: 16) } ?? 0
        let alpha = Range(m.range(at: 2), in: svg).flatMap { Double(svg[$0]) } ?? 1
        ctx.setFillColor(CGColor(srgbRed: CGFloat(hex >> 16) / 255, green: CGFloat((hex >> 8) & 255) / 255, blue: CGFloat(hex & 255) / 255, alpha: alpha))
        ctx.addPath(parsePathData(String(svg[Range(m.range(at: 4), in: svg)!])))
        ctx.fillPath(using: m.range(at: 3).location != NSNotFound ? .evenOdd : .winding)
    }
    ctx.restoreGState()
}

public struct ArtworkCheck {
    public var overlap: Double      // intersection over union of coverage, 1 is identical
    public var colorError: Double   // mean RGB difference where both are opaque, 0 to 255
    public var inkPixels: Int       // pixels the SVG covers at all
}

/// Compares an SVG with the PDF page it came from, both drawn at `scale`.
public func compareArtwork(_ svg: String, page: CGPDFPage, scale: CGFloat = 4) -> ArtworkCheck {
    let box = page.getBoxRect(.mediaBox)
    let w = Int((box.width * scale).rounded(.up)), h = Int((box.height * scale).rounded(.up))
    let ref = rgbaPixels(w, h) { ctx in ctx.scaleBy(x: scale, y: scale); ctx.translateBy(x: -box.minX, y: -box.minY); ctx.drawPDFPage(page) }
    let mine = rgbaPixels(w, h) { ctx in ctx.scaleBy(x: scale, y: scale); drawColoredSVG(svg, in: ctx, height: box.height) }
    let a = stride(from: 3, to: ref.count, by: 4).map { Int(ref[$0]) }
    let b = stride(from: 3, to: mine.count, by: 4).map { Int(mine[$0]) }
    var err = 0.0, n = 0
    for i in 0..<(w * h) where a[i] > 200 && b[i] > 200 {
        for c in 0..<3 { err += abs(Double(ref[i * 4 + c]) - Double(mine[i * 4 + c])) }
        n += 1
    }
    return ArtworkCheck(overlap: overlapScore(a, b), colorError: n == 0 ? 0 : err / Double(n * 3), inkPixels: b.filter { $0 > 0 }.count)
}
