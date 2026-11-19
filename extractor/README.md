# extractor

Reads SF Symbols from this Mac and writes the server's symbol data:

- `server/src/pack/symbols.js`: every symbol's name, release year, categories, Apple's search keywords,
  usage restriction, the year-to-OS table, the category list and renamed symbols, in the shape of
  `server/src/pack/symbols.d.ts`. This file is committed.
- `server/assets/symbols/NAME.svg`: one SVG per symbol, regular weight, medium scale, monochrome.
  These are deployed with the Worker as static files and are not committed (`assets/symbols/` is ignored).

Needs macOS 14 or later with Xcode's Swift. The SF Symbols app (`/Applications/SF Symbols.app`) adds
category labels; without it the system's copy of the metadata is used.

```bash
cd extractor
swift run -c release extract-symbols                   # pack and all SVGs (a few minutes)
swift run -c release extract-symbols --verify 60       # the same, then compare 60 SVGs with the system's drawing
swift run -c release extract-symbols --verify-only 60  # compare only, write nothing
swift run -c release extract-symbols --only heart,wifi # just these SVGs; the pack is rewritten from what is on disk
```

Run it again after a macOS or SF Symbols update, then deploy the server.

## How a shape is made

1. SwiftUI's `ImageRenderer` draws `Image(systemName:)` at a 100-point font into a one-page PDF.
   That PDF is vector: filled paths, with cut-outs (the heart inside `heart.circle.fill`, the gap beside
   a slash) drawn as soft masks.
2. `PDFToSVG.swift` reads the PDF's operators with `CGPDFScanner`: paths, transforms (`cm`, form
   matrices), clips and form bounding boxes, opacity, and soft masks. Each mask is applied as path
   subtraction with Core Graphics' boolean path operations, so the SVG holds plain paths.
3. Coordinates are flipped to SVG's top-left origin and rounded to 2 decimals. The viewBox is the
   rendered size. Fills use `currentColor`; even-odd fills carry `fill-rule="evenodd"`; the few layers
   Apple draws translucent even in monochrome carry `fill-opacity`.

`--verify` rasterizes each SVG and the system's PDF at 2x and reports the overlap of their coverage
(intersection over union, 1.0 is identical). Set `DIFF_DIR=/some/folder` to also write a PNG per
symbol: gray where both draw, red where only the system draws, blue where only the SVG does.
