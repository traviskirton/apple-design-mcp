// extract-frames: writes server/src/pack/frames.js, the Simulator's device frames as SVG.
//
//   swift run -c release extract-frames               write the pack
//   swift run -c release extract-frames --verify      also compare every frame with Xcode's own art
//   DIFF_DIR=/some/folder ...                         write a PNG per frame: Xcode's art | the SVG
//
// Xcode keeps one frame ("chrome") per device design in /Library/Developer/DeviceKit/Chrome. A chrome
// is either nine slices (four corners, four edges that stretch) or, for the newest designs, one
// composite drawing. chrome.json gives the bezel widths around the screen (`sizing`), extra room
// for buttons (`devicePadding`) and button positions (`inputs`). Each device in the device pack
// names its chrome per screen, so a frame is built for each chrome and screen size.
import AppKit
import PDFVector

let args = CommandLine.arguments
let verify = args.contains("--verify")
let diffDir = ProcessInfo.processInfo.environment["DIFF_DIR"]
let repo = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
    .deletingLastPathComponent().deletingLastPathComponent()
let devicesURL = repo.appendingPathComponent("server/src/pack/devices.js")
let outURL = repo.appendingPathComponent("server/src/pack/frames.js")
let chromeDir = URL(fileURLWithPath: "/Library/Developer/DeviceKit/Chrome")

func run(_ cmd: String, _ arguments: [String]) -> Data {
    let p = Process()
    p.executableURL = URL(fileURLWithPath: "/usr/bin/env")
    p.arguments = [cmd] + arguments
    let pipe = Pipe()
    p.standardOutput = pipe
    try! p.run()
    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    p.waitUntilExit()
    return data
}

func plist(_ url: URL) -> [String: Any] {
    guard let data = try? Data(contentsOf: url) else { return [:] }
    return (try? PropertyListSerialization.propertyList(from: data, format: nil)) as? [String: Any] ?? [:]
}

func cg(_ v: Any?) -> CGFloat? { (v as? NSNumber).map { CGFloat($0.doubleValue) } ?? (v as? String).flatMap(Double.init).map { CGFloat($0) } }

// MARK: - Devices

struct ScreenSpec {
    var width: CGFloat, height: CGFloat
    /// top-left, top-right, bottom-left, bottom-right, in points with the screen in portrait.
    var radii: [CGFloat]
    var chrome: String
}

struct DeviceSpec { var id: String; var name: String; var screens: [ScreenSpec] }

func loadDevices() -> [DeviceSpec] {
    var text = try! String(contentsOf: devicesURL, encoding: .utf8)
    text = String(text[text.firstIndex(of: "{")!...]).trimmingCharacters(in: .whitespacesAndNewlines)
    if text.hasSuffix(";") { text.removeLast() }
    let pack = try! JSONSerialization.jsonObject(with: Data(text.utf8)) as! [String: Any]
    let types = (try! JSONSerialization.jsonObject(with: run("xcrun", ["simctl", "list", "devicetypes", "-j"])) as! [String: Any])["devicetypes"] as! [[String: Any]]
    let bundles = Dictionary(types.map { (($0["identifier"] as! String).replacingOccurrences(of: "com.apple.CoreSimulator.SimDeviceType.", with: ""), $0["bundlePath"] as! String) }) { a, _ in a }

    var out: [DeviceSpec] = []
    for d in pack["devices"] as! [[String: Any]] {
        let family = d["family"] as? String ?? ""
        guard d["current"] as? Bool == true, family != "vision", let id = d["id"] as? String, let bundle = bundles[id] else { continue }
        let resources = URL(fileURLWithPath: bundle).appendingPathComponent("Contents/Resources")
        let profile = plist(resources.appendingPathComponent("profile.plist"))
        let caps = plist(resources.appendingPathComponent("capabilities.plist"))["capabilities"] as? [String: Any] ?? [:]
        let displays = (caps["displays"] as? [[String: Any]] ?? []).filter { ($0["displayType"] as? String) == "integrated" }
        var screens: [ScreenSpec] = []
        for (i, s) in (d["screens"] as! [[String: Any]]).enumerated() {
            let chromeID = (i < displays.count ? displays[i]["chromeIdentifier"] as? String : nil) ?? profile["chromeIdentifier"] as? String
            guard let chromeID else { continue }
            let r: [CGFloat]
            if let n = cg(s["corner_radius_pt"]) { r = [n, n, n, n] }
            else if let c = s["corner_radius_pt"] as? [String: Any] {
                r = ["top_left", "top_right", "bottom_left", "bottom_right"].map { cg(c[$0]) ?? 0 }
            } else { r = [0, 0, 0, 0] }
            screens.append(ScreenSpec(width: cg(s["width_pt"])!, height: cg(s["height_pt"])!, radii: r,
                                      chrome: chromeID.replacingOccurrences(of: "com.apple.dt.devicekit.chrome.", with: "")))
        }
        if screens.count == (d["screens"] as! [Any]).count { out.append(DeviceSpec(id: id, name: d["name"] as! String, screens: screens)) }
    }
    return out
}

// MARK: - Frame building

struct Placed {
    var page: CGPDFPage
    var transform: CGAffineTransform // page space -> frame space (y up)
    var clip: CGRect                 // in frame space
}

struct Button { var name: String; var rect: CGRect; var placed: Placed?; var onTop: Bool }

struct BuiltFrame {
    var id: String
    var width: CGFloat, height: CGFloat
    var screen: CGRect            // frame space, y up
    var screenRadii: [CGFloat]
    var cornerRadius: CGFloat?
    var body: [Placed]
    var buttons: [Button]
    var approximations: [String] = []
}

func page(_ url: URL) -> CGPDFPage? { CGPDFDocument(url as CFURL)?.page(at: 1) }

func place(_ p: CGPDFPage, in dest: CGRect) -> Placed {
    let box = p.getBoxRect(.mediaBox)
    let t = CGAffineTransform(translationX: -box.minX, y: -box.minY)
        .concatenating(CGAffineTransform(scaleX: dest.width / box.width, y: dest.height / box.height))
        .concatenating(CGAffineTransform(translationX: dest.minX, y: dest.minY))
    return Placed(page: p, transform: t, clip: dest)
}

/// True for the placeholder slices that newer chromes ship ("unused" text in place of art).
func isPlaceholder(_ p: CGPDFPage) -> Bool { readPage(p).unsupported.contains("text") }

func buildFrame(chrome: String, screen: ScreenSpec) -> BuiltFrame? {
    let res = chromeDir.appendingPathComponent("\(chrome).devicechrome/Contents/Resources")
    guard let data = try? Data(contentsOf: res.appendingPathComponent("chrome.json")),
          let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let images = json["images"] as? [String: Any] else { return nil }
    let sizing = images["sizing"] as? [String: Any] ?? [:]
    let pad = images["devicePadding"] as? [String: Any] ?? [:]
    let (sl, sr, st, sb) = (cg(sizing["leftWidth"]) ?? 0, cg(sizing["rightWidth"]) ?? 0, cg(sizing["topHeight"]) ?? 0, cg(sizing["bottomHeight"]) ?? 0)
    var (pl, pr, pt, pb) = (cg(pad["left"]) ?? 0, cg(pad["right"]) ?? 0, cg(pad["top"]) ?? 0, cg(pad["bottom"]) ?? 0)
    let bodyW = screen.width + sl + sr, bodyH = screen.height + st + sb
    var approximations: [String] = []

    func slice(_ key: String) -> CGPDFPage? { (images[key] as? String).flatMap { page(res.appendingPathComponent("\($0).pdf")) } }

    // Buttons first, so the canvas can grow to hold any that reach past the padding.
    var buttons: [(name: String, page: CGPDFPage?, size: CGSize, anchor: String, align: String, offset: CGPoint, onTop: Bool)] = []
    for input in json["inputs"] as? [[String: Any]] ?? [] {
        guard let name = input["name"] as? String, let image = input["image"] as? String,
              let offsets = (input["offsets"] as? [String: Any])?["normal"] as? [String: Any] else { continue }
        let p = page(res.appendingPathComponent("\(image).pdf"))
        let size = p?.getBoxRect(.mediaBox).size ?? CGSize(width: 16, height: 40)
        // A button lies along its edge: tall on the left or right, wide on the top or bottom. Some chromes
        // for screens that are naturally landscape give positions for the other orientation; leave those out.
        let anchor = input["anchor"] as? String ?? "left"
        let vertical = anchor == "left" || anchor == "right"
        if name != "home", vertical ? size.width > size.height : size.height > size.width {
            approximations.append("\(chrome): \(name) button left out (its position is given for the other orientation)")
            continue
        }
        buttons.append((name.replacingOccurrences(of: "-", with: " "), p, size, input["anchor"] as? String ?? "left",
                        input["align"] as? String ?? "leading", CGPoint(x: cg(offsets["x"]) ?? 0, y: cg(offsets["y"]) ?? 0), input["onTop"] as? Bool ?? false))
    }
    // A button's offset is its top-left corner from the frame's top-left corner; a negative offset
    // counts from the right or bottom edge (Simulator's chrome.json; inferred from the data).
    func buttonRect(_ b: (name: String, page: CGPDFPage?, size: CGSize, anchor: String, align: String, offset: CGPoint, onTop: Bool), W: CGFloat, H: CGFloat) -> CGRect {
        var x = b.offset.x, y = b.offset.y
        if b.align == "center", b.anchor == "top" || b.anchor == "bottom" { x = (W - b.size.width) / 2 + b.offset.x }
        else if b.align == "trailing", b.anchor == "top" || b.anchor == "bottom" { x = W + b.offset.x - b.size.width }
        if b.align == "center", b.anchor == "left" || b.anchor == "right" { y = (H - b.size.height) / 2 + b.offset.y }
        else if b.align == "trailing", b.anchor == "left" || b.anchor == "right" { y = H + b.offset.y - b.size.height }
        if b.anchor == "right" { x = W + b.offset.x - b.size.width / 2 }
        if b.anchor == "bottom" { y = H + b.offset.y }
        if b.anchor == "left" { x = b.offset.x - b.size.width / 2 }
        if b.anchor == "top" { y = b.offset.y - b.size.height / 2 }
        return CGRect(x: x, y: y, width: b.size.width, height: b.size.height) // y down
    }
    // Buttons are placed in the frame as chrome.json describes it; where one reaches past that
    // frame, the frame grows on that side and everything moves with the body.
    let W0 = bodyW + pl + pr, H0 = bodyH + pt + pb
    let rects0 = buttons.map { buttonRect($0, W: W0, H: H0) }
    let growL = max(0, -(rects0.map(\.minX).min() ?? 0)), growT = max(0, -(rects0.map(\.minY).min() ?? 0))
    let growR = max(0, (rects0.map(\.maxX).max() ?? W0) - W0), growB = max(0, (rects0.map(\.maxY).max() ?? H0) - H0)
    pl += growL; pt += growT; pr += growR; pb += growB
    let W = bodyW + pl + pr, H = bodyH + pt + pb
    let body = CGRect(x: pl, y: pb, width: bodyW, height: bodyH) // y up
    let screenRect = CGRect(x: pl + sl, y: pb + sb, width: screen.width, height: screen.height)

    var placed: [Placed] = []
    let corners = ["topLeft", "topRight", "bottomLeft", "bottomRight"].map(slice)
    let edges = ["top", "bottom", "left", "right"].map(slice)
    if let tl = corners[0], !isPlaceholder(tl), let tr = corners[1], let bl = corners[2], let br = corners[3],
       let top = edges[0], let bottom = edges[1], let left = edges[2], let right = edges[3] {
        let s = { (p: CGPDFPage) in p.getBoxRect(.mediaBox).size }
        let (tlS, trS, blS, brS) = (s(tl), s(tr), s(bl), s(br))
        placed.append(place(tl, in: CGRect(x: body.minX, y: body.maxY - tlS.height, width: tlS.width, height: tlS.height)))
        placed.append(place(tr, in: CGRect(x: body.maxX - trS.width, y: body.maxY - trS.height, width: trS.width, height: trS.height)))
        placed.append(place(bl, in: CGRect(x: body.minX, y: body.minY, width: blS.width, height: blS.height)))
        placed.append(place(br, in: CGRect(x: body.maxX - brS.width, y: body.minY, width: brS.width, height: brS.height)))
        placed.append(place(top, in: CGRect(x: body.minX + tlS.width, y: body.maxY - s(top).height, width: body.width - tlS.width - trS.width, height: s(top).height)))
        placed.append(place(bottom, in: CGRect(x: body.minX + blS.width, y: body.minY, width: body.width - blS.width - brS.width, height: s(bottom).height)))
        placed.append(place(left, in: CGRect(x: body.minX, y: body.minY + blS.height, width: s(left).width, height: body.height - blS.height - tlS.height)))
        placed.append(place(right, in: CGRect(x: body.maxX - s(right).width, y: body.minY + brS.height, width: s(right).width, height: body.height - brS.height - trS.height)))
    } else if let composite = slice("composite") {
        let size = composite.getBoxRect(.mediaBox).size
        if abs(size.width - body.width) > 0.5 || abs(size.height - body.height) > 0.5 {
            approximations.append(String(format: "%@: composite %.0f×%.0f scaled to %.0f×%.0f", chrome, size.width, size.height, body.width, body.height))
        }
        placed.append(place(composite, in: body))
    } else {
        return nil
    }

    let builtButtons = zip(buttons, rects0).map { b, r0 -> Button in
        let r = r0.offsetBy(dx: growL, dy: growT)
        let up = CGRect(x: r.minX, y: H - r.maxY, width: r.width, height: r.height)
        return Button(name: b.name, rect: up, placed: b.page.map { place($0, in: up) }, onTop: b.onTop)
    }
    let radius = ((json["paths"] as? [String: Any])?["simpleOutsideBorder"] as? [String: Any]).flatMap { cg($0["cornerRadiusX"]) }
    let id = "\(chrome)-\(num(screen.width))x\(num(screen.height))"
    if pl + pr + pt + pb > (cg(pad["left"]) ?? 0) + (cg(pad["right"]) ?? 0) + (cg(pad["top"]) ?? 0) + (cg(pad["bottom"]) ?? 0) + 0.5 {
        approximations.append(String(format: "%@: frame grown by %.1f, %.1f, %.1f, %.1f points (left, top, right, bottom) to hold its buttons", id,
                                     pl - (cg(pad["left"]) ?? 0), pt - (cg(pad["top"]) ?? 0), pr - (cg(pad["right"]) ?? 0), pb - (cg(pad["bottom"]) ?? 0)))
    }
    return BuiltFrame(id: id, width: W, height: H, screen: screenRect, screenRadii: screen.radii, cornerRadius: radius,
                      body: placed, buttons: builtButtons, approximations: approximations)
}

/// The screen as a path in frame space (y up), with its own corner radii.
func screenPath(_ f: BuiltFrame) -> CGPath {
    let r = f.screen
    let (tl, tr, bl, br) = (f.screenRadii[0], f.screenRadii[1], f.screenRadii[2], f.screenRadii[3])
    let p = CGMutablePath()
    p.move(to: CGPoint(x: r.minX + bl, y: r.minY))
    p.addLine(to: CGPoint(x: r.maxX - br, y: r.minY))
    p.addArc(tangent1End: CGPoint(x: r.maxX, y: r.minY), tangent2End: CGPoint(x: r.maxX, y: r.minY + br), radius: br)
    p.addLine(to: CGPoint(x: r.maxX, y: r.maxY - tr))
    p.addArc(tangent1End: CGPoint(x: r.maxX, y: r.maxY), tangent2End: CGPoint(x: r.maxX - tr, y: r.maxY), radius: tr)
    p.addLine(to: CGPoint(x: r.minX + tl, y: r.maxY))
    p.addArc(tangent1End: CGPoint(x: r.minX, y: r.maxY), tangent2End: CGPoint(x: r.minX, y: r.maxY - tl), radius: tl)
    p.addLine(to: CGPoint(x: r.minX, y: r.minY + bl))
    p.addArc(tangent1End: CGPoint(x: r.minX, y: r.minY), tangent2End: CGPoint(x: r.minX + bl, y: r.minY), radius: bl)
    p.closeSubpath()
    return p
}

/// Drawing order: buttons under the body, the body, buttons on top.
func layers(_ f: BuiltFrame) -> [(Placed?, Button?)] {
    f.buttons.filter { !$0.onTop }.map { ($0.placed, $0) } + f.body.map { ($0, nil) } + f.buttons.filter(\.onTop).map { ($0.placed, $0) }
}

struct SVGResult { var svg: String; var notes: Set<String> }

func makeSVG(_ f: BuiltFrame, decimals: Int) -> SVGResult {
    let screen = screenPath(f)
    var notes = Set<String>()
    var fills: [Fill] = []
    for (placed, button) in layers(f) {
        var got: [Fill] = []
        if let placed {
            let (list, unsupported) = readPage(placed.page, transform: placed.transform, clip: CGPath(rect: placed.clip, transform: nil))
            got = list
            if unsupported.contains("images"), let button {
                // Older chromes draw some buttons as bitmaps: use a dark rounded bar of the same size.
                notes.insert("bitmap buttons drawn as flat dark bars")
                let r = button.rect
                got = [Fill(path: CGPath(roundedRect: r, cornerWidth: min(r.width, r.height) / 2, cornerHeight: min(r.width, r.height) / 2, transform: nil),
                            evenOdd: false, color: RGB(r: 0.23, g: 0.23, b: 0.23))]
            }
            notes.formUnion(unsupported.subtracting(["images"]))
        } else if let button {
            notes.insert("buttons without art drawn as flat dark bars")
            got = [Fill(path: CGPath(rect: button.rect, transform: nil), evenOdd: false, color: RGB(r: 0.23, g: 0.23, b: 0.23))]
        }
        fills += got
    }
    // Paint below 6% opacity (faint highlights) is invisible at frame sizes and costs bytes.
    if fills.contains(where: { $0.opacity < 0.06 }) { notes.insert("highlights under 6% opacity dropped") }
    fills = fills.filter { $0.opacity >= 0.06 }
    // Leave the screen empty.
    fills = fills.compactMap { fill in
        guard fill.path.boundingBox.intersects(f.screen) else { return fill }
        let cut = fill.path.subtracting(screen, using: fill.evenOdd ? .evenOdd : .winding)
        return cut.isEmpty ? nil : Fill(path: cut, evenOdd: false, opacity: fill.opacity, color: fill.color)
    }
    // Merge runs of paths with the same paint into one element.
    var elements: [(style: String, d: String)] = []
    for fill in fills {
        let style = " fill=\"\(fill.color.hex)\"" + (fill.opacity < 0.995 ? " fill-opacity=\"\(num(fill.opacity))\"" : "")
            + (fill.evenOdd ? " fill-rule=\"evenodd\"" : "")
        let d = svgPathData(fill.path, height: f.height, decimals: decimals)
        if let last = elements.last, last.style == style { elements[elements.count - 1].d += d } else { elements.append((style, d)) }
    }
    let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 \(num(f.width)) \(num(f.height))\">"
        + elements.map { "<path\($0.style) d=\"\($0.d)\"/>" }.joined() + "</svg>"
    return SVGResult(svg: svg, notes: notes)
}

// MARK: - Verification

func rgba(_ w: Int, _ h: Int, _ draw: (CGContext) -> Void) -> [UInt8] {
    var px = [UInt8](repeating: 0, count: w * h * 4)
    let ctx = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                        space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    draw(ctx)
    return px
}

struct Check { var overlap: Double; var colorError: Double; var screenInk: Int; var edgeCover: Double }

func check(_ f: BuiltFrame, svg: String) -> Check {
    let s: CGFloat = 2
    let w = Int((f.width * s).rounded(.up)), h = Int((f.height * s).rounded(.up))
    let screen = screenPath(f)
    // Xcode's art, placed the same way, with the screen cleared.
    let ref = rgba(w, h) { ctx in
        ctx.scaleBy(x: s, y: s)
        for (placed, _) in layers(f) {
            guard let placed else { continue }
            ctx.saveGState(); ctx.clip(to: placed.clip); ctx.concatenate(placed.transform); ctx.drawPDFPage(placed.page); ctx.restoreGState()
        }
        ctx.setBlendMode(.clear); ctx.addPath(screen); ctx.fillPath()
    }
    let mine = rgba(w, h) { ctx in
        ctx.scaleBy(x: s, y: s); ctx.translateBy(x: 0, y: f.height); ctx.scaleBy(x: 1, y: -1)
        let re = try! NSRegularExpression(pattern: ##"<path fill="#([0-9a-f]{6})"(?: fill-opacity="([\d.]+)")?( fill-rule="evenodd")? d="([^"]*)"/>"##)
        for m in re.matches(in: svg, range: NSRange(svg.startIndex..., in: svg)) {
            let hex = Int(svg[Range(m.range(at: 1), in: svg)!], radix: 16)!
            let alpha = Range(m.range(at: 2), in: svg).flatMap { Double(svg[$0]) } ?? 1
            ctx.setFillColor(CGColor(srgbRed: CGFloat(hex >> 16) / 255, green: CGFloat((hex >> 8) & 255) / 255, blue: CGFloat(hex & 255) / 255, alpha: alpha))
            ctx.addPath(parsePathData(String(svg[Range(m.range(at: 4), in: svg)!])))
            ctx.fillPath(using: m.range(at: 3).location != NSNotFound ? .evenOdd : .winding)
        }
    }
    let a = stride(from: 3, to: ref.count, by: 4).map { Int(ref[$0]) }
    let b = stride(from: 3, to: mine.count, by: 4).map { Int(mine[$0]) }
    var err = 0.0, n = 0
    for i in 0..<(w * h) where a[i] > 200 && b[i] > 200 {
        for c in 0..<3 { err += abs(Double(ref[i * 4 + c]) - Double(mine[i * 4 + c])) }
        n += 1
    }
    // Ink inside the screen (inset by 1 point) must be zero; the 1-point band just outside the
    // screen's straight edges must be covered, so the reported rectangle is the empty area exactly.
    var ink = 0, band = 0, covered = 0
    let r = f.screen, maxR = f.screenRadii.max() ?? 0
    let edge = screen.copy(strokingWithWidth: 2, lineCap: .butt, lineJoin: .miter, miterLimit: 10) // 1 point either side of the screen's outline
    for y in 0..<h {
        for x in 0..<w {
            let p = CGPoint(x: (CGFloat(x) + 0.5) / s, y: f.height - (CGFloat(y) + 0.5) / s) // y up
            let alpha = b[y * w + x]
            if screen.contains(p), !edge.contains(p), alpha > 0 { ink += 1 }
            let outside = r.insetBy(dx: -1, dy: -1).contains(p) && !r.contains(p)
            let straight = (p.x > r.minX + maxR && p.x < r.maxX - maxR) || (p.y > r.minY + maxR && p.y < r.maxY - maxR)
            if outside && straight { band += 1; if alpha > 128 { covered += 1 } }
        }
    }
    if let dir = diffDir {
        let both = rgba(w * 2 + 8, h) { ctx in
            for (img, x) in [(ref, 0), (mine, w + 8)] {
                var copy = img
                let c = CGContext(data: &copy, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                                  space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
                ctx.setFillColor(CGColor(srgbRed: 1, green: 0.85, blue: 0.85, alpha: 1)); ctx.fill(CGRect(x: x, y: 0, width: w, height: h))
                ctx.draw(c.makeImage()!, in: CGRect(x: x, y: 0, width: w, height: h))
            }
        }
        var px = both
        let c = CGContext(data: &px, width: w * 2 + 8, height: h, bitsPerComponent: 8, bytesPerRow: (w * 2 + 8) * 4,
                          space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
        try? NSBitmapImageRep(cgImage: c.makeImage()!).representation(using: .png, properties: [:])?
            .write(to: URL(fileURLWithPath: dir).appendingPathComponent("\(f.id).png"))
    }
    return Check(overlap: overlapScore(a, b), colorError: n == 0 ? 0 : err / Double(n * 3), screenInk: ink,
                 edgeCover: band == 0 ? 1 : Double(covered) / Double(band))
}

// MARK: - Main

func json(_ v: Any) -> String {
    String(decoding: try! JSONSerialization.data(withJSONObject: v, options: [.sortedKeys, .withoutEscapingSlashes, .fragmentsAllowed]), as: UTF8.self)
}

let devices = loadDevices()
var frames: [String: BuiltFrame] = [:]
var deviceMap: [String: [String]] = [:]
var skipped: [String] = []
for d in devices {
    var ids: [String] = []
    for s in d.screens {
        let key = "\(s.chrome)-\(num(s.width))x\(num(s.height))"
        if frames[key] == nil, let f = buildFrame(chrome: s.chrome, screen: s) { frames[key] = f }
        if frames[key] != nil { ids.append(key) }
    }
    if ids.count == d.screens.count { deviceMap[d.id] = ids } else { skipped.append(d.name) }
}

let xcode = String(decoding: run("xcodebuild", ["-version"]), as: UTF8.self).trimmingCharacters(in: .whitespacesAndNewlines)
    .replacingOccurrences(of: "\nBuild version ", with: " (") + ")"
var entries: [String] = []
var sizes: [(String, Int, Int)] = []
var notes = Set<String>()
var approximations: [String] = []
var checks: [(String, Check)] = []
for id in frames.keys.sorted() {
    let f = frames[id]!
    let full = makeSVG(f, decimals: 2)
    var result = full
    if full.svg.utf8.count > 15_000 { result = makeSVG(f, decimals: 1) }
    sizes.append((id, full.svg.utf8.count, result.svg.utf8.count))
    notes.formUnion(result.notes)
    approximations += f.approximations
    let flip = { (r: CGRect) in CGRect(x: r.minX, y: f.height - r.maxY, width: r.width, height: r.height) }
    let sr = flip(f.screen)
    var entry: [(String, Any)] = [("id", id), ("width", Double(num(f.width))!), ("height", Double(num(f.height))!)]
    if let r = f.cornerRadius { entry.append(("corner_radius", Double(num(r))!)) }
    entry.append(("screen", ["x": Double(num(sr.minX))!, "y": Double(num(sr.minY))!, "width": Double(num(sr.width))!, "height": Double(num(sr.height))!]))
    if !f.buttons.isEmpty {
        entry.append(("buttons", f.buttons.map { b -> [String: Any] in
            let r = flip(b.rect)
            return ["name": b.name, "x": Double(num(r.minX))!, "y": Double(num(r.minY))!, "width": Double(num(r.width))!, "height": Double(num(r.height))!]
        }))
    }
    entry.append(("svg", result.svg))
    entries.append("{" + entry.map { "\(json($0.0)):\(json($0.1))" }.joined(separator: ",") + "}")
    if verify { checks.append((id, check(f, svg: result.svg))) }
}

let now = ISO8601DateFormatter().string(from: Date())
let head = "\"pack_version\":\(json(String(now.prefix(10)))),\"generated_at\":\(json(now)),"
    + "\"source\":{\"name\":\"Xcode Simulator device frames\",\"version\":\(json(xcode)),\"frames\":\(frames.count)}"
let text = "export default {\(head),\n\"frames\":[\n" + entries.joined(separator: ",\n") + "\n],\n\"devices\":\(json(deviceMap))};\n"
try! text.write(to: outURL, atomically: true, encoding: .utf8)

print("Frames: \(frames.count) for \(deviceMap.count) devices from \(xcode), written to server/src/pack/frames.js (\(text.utf8.count / 1024) KB)")
if !skipped.isEmpty { print("  no frame for: \(skipped.joined(separator: ", "))") }
let finals = sizes.map(\.2)
print("  SVG sizes: largest \(finals.max() ?? 0) bytes (\(sizes.max { $0.2 < $1.2 }?.0 ?? "")), average \(finals.reduce(0, +) / max(1, finals.count)) bytes")
for (id, before, after) in sizes where before != after { print("  \(id): \(before) bytes at 2 decimals, \(after) at 1 decimal") }
for n in notes.sorted() { print("  approximated: \(n)") }
for a in approximations { print("  approximated: \(a)") }
if verify {
    checks.sort { $0.1.overlap < $1.1.overlap }
    print(String(format: "Verified %d frames: worst overlap %.4f, mean %.4f", checks.count, checks.first?.1.overlap ?? 0,
                 checks.map(\.1.overlap).reduce(0, +) / Double(max(1, checks.count))))
    for (id, c) in checks {
        print(String(format: "  %.4f overlap, color error %.1f/255, screen ink %d px, screen edge covered %.1f%%  %@",
                     c.overlap, c.colorError, c.screenInk, c.edgeCover * 100, id))
    }
}
