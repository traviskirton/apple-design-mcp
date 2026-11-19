// Turns the one-page PDF that SwiftUI draws for a symbol into SVG paths.
//
// SwiftUI draws a symbol as filled paths. Cut-outs (the heart inside heart.circle.fill, the gap
// beside a slash) are soft masks: a luminosity mask on a white backdrop with the cut-out shape
// filled in black. Those are applied here as path subtraction, so the SVG needs no masks.
import CoreGraphics
import Foundation

struct Fill {
    var path: CGPath
    var evenOdd: Bool
    /// Below 1 for the few symbols that draw a layer translucent even in monochrome.
    var opacity: CGFloat = 1
}

private struct GState {
    var ctm = CGAffineTransform.identity
    var alpha: CGFloat = 1
    /// Shape removed from (or, for a black-backdrop mask, kept from) every fill, in page space.
    var mask: CGPath?
    var maskSubtracts = true
    /// A soft mask hides everything outside its group's bounding box.
    var maskBounds: CGPath?
    /// The clip, in page space: a form's bounding box or a `W n` path.
    var clip: CGPath?
}

/// Reads the drawing operators of one content stream and collects its fills in page space.
private final class Interpreter {
    var state = GState()
    var stack: [GState] = []
    var path = CGMutablePath()
    var pendingClip: (CGPath, Bool)?
    var fills: [Fill] = []
    var unsupported = Set<String>()
    let contentStream: CGPDFContentStreamRef

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
        on("m") { sc, i in let s = me(i); let n = popNumbers(sc, 2); s.path.move(to: s.pt(n[0], n[1])) }
        on("l") { sc, i in let s = me(i); let n = popNumbers(sc, 2); s.path.addLine(to: s.pt(n[0], n[1])) }
        on("c") { sc, i in
            let s = me(i); let n = popNumbers(sc, 6)
            s.path.addCurve(to: s.pt(n[4], n[5]), control1: s.pt(n[0], n[1]), control2: s.pt(n[2], n[3]))
        }
        on("v") { sc, i in
            let s = me(i); let n = popNumbers(sc, 4)
            s.path.addCurve(to: s.pt(n[2], n[3]), control1: s.path.currentPoint, control2: s.pt(n[0], n[1]))
        }
        on("y") { sc, i in
            let s = me(i); let n = popNumbers(sc, 4)
            s.path.addCurve(to: s.pt(n[2], n[3]), control1: s.pt(n[0], n[1]), control2: s.pt(n[2], n[3]))
        }
        on("h") { _, i in me(i).path.closeSubpath() }
        on("re") { sc, i in
            let s = me(i); let n = popNumbers(sc, 4)
            s.path.move(to: s.pt(n[0], n[1])); s.path.addLine(to: s.pt(n[0] + n[2], n[1]))
            s.path.addLine(to: s.pt(n[0] + n[2], n[1] + n[3])); s.path.addLine(to: s.pt(n[0], n[1] + n[3])); s.path.closeSubpath()
        }
        for op in ["f", "F", "B", "b"] { on(op) { _, i in me(i).fill(evenOdd: false) } }
        for op in ["f*", "B*", "b*"] { on(op) { _, i in me(i).fill(evenOdd: true) } }
        on("W") { _, i in let s = me(i); s.pendingClip = (s.path.copy()!, false) }
        on("W*") { _, i in let s = me(i); s.pendingClip = (s.path.copy()!, true) }
        for op in ["n", "S", "s"] { on(op) { _, i in me(i).endPath() } }
        on("gs") { sc, i in
            let s = me(i)
            var name: UnsafePointer<CChar>?
            guard CGPDFScannerPopName(sc, &name), let name else { return }
            s.applyExtGState(String(cString: name))
        }
        on("Do") { sc, i in
            let s = me(i)
            var name: UnsafePointer<CChar>?
            guard CGPDFScannerPopName(sc, &name), let name else { return }
            s.drawForm(String(cString: name))
        }
        for op in ["BT", "Tj", "TJ", "BI", "sh", "d0", "d1"] {
            on(op) { _, i in me(i).unsupported.insert("text, image or shading") }
        }

        let scanner = CGPDFScannerCreate(contentStream, table, Unmanaged.passUnretained(self).toOpaque())
        CGPDFScannerScan(scanner)
        CGPDFScannerRelease(scanner)
        CGPDFOperatorTableRelease(table)
    }

    func pt(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x, y: y).applying(state.ctm) }

    func endPath() {
        if let (shape, evenOdd) = pendingClip { state.clip = clipped(state.clip, by: shape, evenOdd: evenOdd) }
        pendingClip = nil
        path = CGMutablePath()
    }

    func fill(evenOdd: Bool) {
        defer { endPath() }
        guard state.alpha > 0.001, !path.isEmpty else { return }
        let rule: CGPathFillRule = evenOdd ? .evenOdd : .winding
        var shape: CGPath = path
        var eo = evenOdd
        if let clip = state.clip, !contains(clip, shape) {
            shape = shape.intersection(clip, using: rule)
            eo = false // the result of a boolean operation fills correctly with the nonzero rule
        }
        if let mask = state.mask, mask.boundingBox.intersects(shape.boundingBox) {
            shape = state.maskSubtracts ? shape.subtracting(mask, using: eo ? .evenOdd : .winding) : shape.intersection(mask, using: eo ? .evenOdd : .winding)
            eo = false
        }
        if let bounds = state.maskBounds, !contains(bounds, shape) {
            shape = shape.intersection(bounds, using: eo ? .evenOdd : .winding)
            eo = false
        }
        if !shape.isEmpty { fills.append(Fill(path: shape, evenOdd: eo, opacity: state.alpha)) }
    }

    func dictionary(_ category: String, _ name: String) -> CGPDFDictionaryRef? {
        guard let obj = CGPDFContentStreamGetResource(contentStream, category, name) else { return nil }
        var dict: CGPDFDictionaryRef?
        if CGPDFObjectGetValue(obj, .dictionary, &dict) { return dict }
        var stream: CGPDFStreamRef?
        if CGPDFObjectGetValue(obj, .stream, &stream), let stream { return CGPDFStreamGetDictionary(stream) }
        return nil
    }

    func applyExtGState(_ name: String) {
        guard let gs = dictionary("ExtGState", name) else { return }
        var ca: CGPDFReal = 1
        if CGPDFDictionaryGetNumber(gs, "ca", &ca) { state.alpha = ca }
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
        let shapes = collectForm(group, state: maskState)
        state.maskBounds = formBBox(group).map { CGPath(rect: $0, transform: [formMatrix(group).concatenating(state.ctm)]) }
        guard !shapes.isEmpty else { state.mask = nil; return }
        var union: CGPath = shapes[0].path
        for f in shapes.dropFirst() { union = union.union(f.path) }
        state.mask = union
        state.maskSubtracts = white
    }

    func drawForm(_ name: String) {
        guard let obj = CGPDFContentStreamGetResource(contentStream, "XObject", name) else { return }
        var stream: CGPDFStreamRef?
        guard CGPDFObjectGetValue(obj, .stream, &stream), let stream else { return }
        guard let resources = formResources(stream) else { unsupported.insert("a form without resources"); return }
        var inner = state
        inner.ctm = formMatrix(stream).concatenating(state.ctm)
        if let bbox = formBBox(stream) { inner.clip = clipped(inner.clip, by: CGPath(rect: bbox, transform: [inner.ctm]), evenOdd: false) }
        let child = Interpreter(contentStream: CGPDFContentStreamCreateWithStream(stream, resources, contentStream), state: inner)
        child.run()
        fills += child.fills
        unsupported.formUnion(child.unsupported)
    }

    func collectForm(_ stream: CGPDFStreamRef, state: GState) -> [Fill] {
        guard let resources = formResources(stream) else { unsupported.insert("a mask without resources"); return [] }
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

private func formResources(_ stream: CGPDFStreamRef) -> CGPDFDictionaryRef? {
    var res: CGPDFDictionaryRef?
    if let dict = CGPDFStreamGetDictionary(stream) { CGPDFDictionaryGetDictionary(dict, "Resources", &res) }
    return res
}

/// The clip after intersecting it with `shape`.
private func clipped(_ clip: CGPath?, by shape: CGPath, evenOdd: Bool) -> CGPath {
    guard let clip else { return evenOdd ? shape.normalized(using: .evenOdd) : shape }
    if contains(shape, clip) { return clip }
    if contains(clip, shape) { return shape }
    return clip.intersection(shape, using: evenOdd ? .evenOdd : .winding)
}

/// True when `inner` lies inside `outer`, judged by bounding boxes; the clips here are rectangles.
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

struct PDFShape {
    var width: Int
    var height: Int
    var fills: [Fill]
    var unsupported: Set<String>
}

/// The fills of a one-page PDF, in page space (origin bottom left).
func readPDF(_ data: Data) -> PDFShape? {
    guard let provider = CGDataProvider(data: data as CFData), let doc = CGPDFDocument(provider), let page = doc.page(at: 1) else { return nil }
    let box = page.getBoxRect(.mediaBox)
    let interpreter = Interpreter(contentStream: CGPDFContentStreamCreateWithPage(page), state: GState())
    interpreter.run()
    return PDFShape(width: Int(box.width.rounded()), height: Int(box.height.rounded()), fills: interpreter.fills, unsupported: interpreter.unsupported)
}

private func num(_ v: CGFloat) -> String {
    var s = String(format: "%.2f", Double(v))
    while s.hasSuffix("0") { s.removeLast() }
    if s.hasSuffix(".") { s.removeLast() }
    return s == "-0" ? "0" : s
}

/// SVG path data with y flipped to SVG's top-left origin.
func svgPathData(_ path: CGPath, height: CGFloat) -> String {
    var d: [String] = []
    func p(_ pt: CGPoint) -> String { "\(num(pt.x)) \(num(height - pt.y))" }
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

func svgDocument(_ shape: PDFShape) -> String {
    let paths = shape.fills.map { f in
        "<path" + (f.evenOdd ? " fill-rule=\"evenodd\"" : "")
            + (f.opacity < 0.995 ? " fill-opacity=\"\(num(f.opacity))\"" : "") + " d=\"\(svgPathData(f.path, height: CGFloat(shape.height)))\"/>"
    }
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 \(shape.width) \(shape.height)\" fill=\"currentColor\">"
        + paths.joined() + "</svg>\n"
}
