# extractor

Reads SF Symbols from this Mac and writes the server's symbol data:

- `server/src/pack/symbols.js`: every symbol's name, release year, categories, Apple's search keywords,
  usage restriction, the year-to-OS table, the category list and renamed symbols, in the shape of
  `server/src/pack/symbols.d.ts`. This file is committed.
- `server/src/pack/symbol-index.js`: the search index over those names and keywords, written by
  `server/scripts/build-symbol-index.mjs` (the extractor runs it; Node 23.6 or later). Committed. The
  Worker reads it instead of building the index at startup, and builds it itself only if the index
  was made from another copy of symbols.js.
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

# extract-frames

Writes `server/src/pack/frames.js` (committed): the frame Xcode's Simulator draws around each current
device's screen, as SVG, with the screen's position, the body's corner radius and the buttons.

```bash
swift run -c release extract-frames            # write the pack (a few seconds)
swift run -c release extract-frames --verify   # also compare every frame with Xcode's own art
DIFF_DIR=/some/folder swift run -c release extract-frames --verify   # and write Xcode's art | the SVG as PNGs
```

Run it after `server/src/pack/devices.js` is rebuilt (it reads the device list from there).

## How a frame is made

- Each device in the device pack names a chrome per screen in its simulator profile
  (`capabilities.plist` displays, or `profile.plist`), in `/Library/Developer/DeviceKit/Chrome`.
  One frame is built per chrome and screen size; its id is the two together, such as `phone11-402x874`.
  Apple Vision Pro and Apple TV have no chrome and get no frame.
- `chrome.json` gives the bezel widths around the screen (`sizing`), extra room around the body for the
  buttons (`devicePadding`) and the buttons (`inputs`). The body is the screen plus the bezels; the
  frame is the body plus that room.
- Most chromes are nine slices: four corners drawn at their own size and four edges stretched along the
  body. The newest (`phone14`, `phone15`, the iPhone Duo) ship placeholder slices and one composite
  drawing, which is placed over the body (scaled where its size differs: `phone14`).
- Buttons are placed from `inputs`: the offset is the button's centre across its edge and its top or left
  along the edge, from the frame's top-left corner (negative values count from the right or bottom).
  This reading of chrome.json fits the data (buttons end at the frame's padding) but is inferred.
  Buttons whose art is drawn for the other orientation (the iPhone Duo's inner screen) are left out.
- The drawing is read with the same PDF reader as the symbols (`PDFVector`), which here also keeps fill
  and stroke colors, line widths and opacity; strokes become filled outlines. Paint below 6% opacity is
  dropped, a transparency group's opacity is applied to each path in it, and buttons drawn as bitmaps in
  older chromes become flat dark bars. The slices draw the same layers, each clipped to its own
  rectangle, so the n-th layer of all slices is united into one shape; that leaves no seams where
  pieces meet when a browser draws the SVG. The screen, with the corner radii from the device pack, is cut
  out of everything, so it is empty. Runs of paths with the same paint are merged into one element.
- Coordinates have 2 decimals, or 1 where that keeps an SVG near 15 KB.

`--verify` rasterizes each frame and Xcode's own art (placed the same way, with the screen cleared) at
2x and reports their overlap, the color difference where both draw, any ink inside the screen, and how
much of the 1-point band just outside the screen's straight edges is covered.

# measure-safe-areas.py

Measures the safe-area insets of the current iPhones and iPads in the iOS Simulator and writes them to
`server/scripts/safe-areas.json` (committed). `npm run pack:devices` in `server/` merges them into each
screen in `devices.js` as `safe_area: { portrait, landscape }`, and `get_device_metrics` lists them.

```bash
python3 extractor/measure-safe-areas.py                  # every distinct screen not yet measured
python3 extractor/measure-safe-areas.py --only iPhone-Air # one device (comma-separate several)
python3 extractor/measure-safe-areas.py --again          # measure again
```

- `safe-area-probe/` is a minimal UIKit app (one Swift file and an Info.plist with a launch screen,
  so it runs at the device's full size). The script compiles it with `xcrun swiftc` for the simulator.
  It prints its key window's `safeAreaInsets` and size in portrait, landscape-right and landscape-left
  as one JSON line, then exits.
- Devices are grouped by screen sizes, corner radii and Dynamic Island; one device per group is
  measured (plus a few named ones, to confirm that devices sharing a screen agree), and the result
  `applies_to` the whole group.
- Each measurement uses a temporary simulator named `apple-mcp-temp ...` on the newest installed iOS
  runtime that runs the device: created, booted, measured, shut down and deleted, one at a time. Only
  simulators with that prefix are ever touched. Device types no installed runtime runs are skipped;
  runtimes are never downloaded.
- About a minute per device. `--minutes` (default 45) stops starting new devices after that long.

# pdf-to-svg

Converts one-page PDF artwork to SVG with its colors and checks it; used by
`server/scripts/build-technology-pack.mjs` (`npm run pack:technologies`) for Apple's technology artwork.

```bash
swift run -c release pdf-to-svg FILE.pdf [FILE.pdf ...]          # one JSON line per file
DIFF_DIR=/some/folder swift run -c release pdf-to-svg FILE.pdf   # also write the PDF | SVG renderings as a PNG
```

Each line holds the page size (MediaBox), the SVG, anything the reader could not convert, and a
check against Core Graphics' own rendering of the PDF at 4x: coverage overlap (1.0 is identical), the
color difference where both are opaque, and the number of inked pixels (0 means blank).

The PDF reader (`PDFVector`) turns text into glyph outlines when the font program is embedded in the
PDF and the font is a simple one (Type 1, CFF or TrueType): character codes map to glyphs through the
font's `Differences`, else the standard names of printable ASCII, else the font's own character map.
That is how the Game Center symbols (set in SF Hello) and the Add Apple Watch Face button text
(SF Pro Text) become paths.
