// pdf-to-svg: converts one-page PDF artwork to SVG with its colors, and checks the result.
//
//   swift run -c release pdf-to-svg FILE.pdf [FILE.pdf ...]
//
// Prints one JSON line per file: {"file", "width", "height", "svg", "unsupported", "overlap",
// "color_error", "ink_pixels"}. The page size is the page's MediaBox. overlap compares the SVG with
// Core Graphics' own rendering of the PDF at 4x (1.0 is identical); ink_pixels 0 means the SVG is blank.
// Used by server/scripts/build-technology-pack.mjs.
import AppKit
import CoreGraphics
import Foundation
import PDFVector

for file in CommandLine.arguments.dropFirst() {
    var out: [String: Any] = ["file": file]
    if let page = CGPDFDocument(URL(fileURLWithPath: file) as CFURL)?.page(at: 1) {
        let box = page.getBoxRect(.mediaBox)
        let transform = CGAffineTransform(translationX: -box.minX, y: -box.minY)
        let (fills, unsupported) = readPage(page, transform: transform)
        let svg = coloredSVG(fills, width: box.width, height: box.height)
        let check = compareArtwork(svg, page: page)
        if let dir = ProcessInfo.processInfo.environment["DIFF_DIR"] {
            // The PDF's rendering and the SVG's, side by side on pink, at 4x.
            let s: CGFloat = 4, w = Int(box.width * s), h = Int(box.height * s)
            var px = rgbaPixels(w * 2 + 8, h) { ctx in
                ctx.setFillColor(CGColor(srgbRed: 1, green: 0.85, blue: 0.85, alpha: 1)); ctx.fill(CGRect(x: 0, y: 0, width: w * 2 + 8, height: h))
                ctx.saveGState(); ctx.scaleBy(x: s, y: s); ctx.translateBy(x: -box.minX, y: -box.minY); ctx.drawPDFPage(page); ctx.restoreGState()
                ctx.translateBy(x: CGFloat(w + 8), y: 0); ctx.scaleBy(x: s, y: s); drawColoredSVG(svg, in: ctx, height: box.height)
            }
            let ctx = CGContext(data: &px, width: w * 2 + 8, height: h, bitsPerComponent: 8, bytesPerRow: (w * 2 + 8) * 4,
                                space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
            let name = URL(fileURLWithPath: file).deletingPathExtension().lastPathComponent
            try? NSBitmapImageRep(cgImage: ctx.makeImage()!).representation(using: .png, properties: [:])?
                .write(to: URL(fileURLWithPath: dir).appendingPathComponent("\(name).png"))
        }
        out.merge(["width": box.width, "height": box.height, "svg": svg, "unsupported": unsupported.sorted(),
                   "overlap": check.overlap, "color_error": check.colorError, "ink_pixels": check.inkPixels]) { _, b in b }
    } else {
        out["error"] = "not a readable PDF"
    }
    let data = try! JSONSerialization.data(withJSONObject: out, options: [.sortedKeys, .withoutEscapingSlashes])
    print(String(decoding: data, as: UTF8.self))
}
