// swift-tools-version:5.9
// Extracts SF Symbols and the Simulator's device frames from this Mac into the server's packs.
// Run from this folder: swift run -c release extract-symbols, or extract-frames (see README.md)
import PackageDescription

let package = Package(
    name: "extractor",
    platforms: [.macOS(.v14)],
    targets: [
        .target(name: "PDFVector", path: "Sources/PDFVector"),
        .executableTarget(name: "extract-symbols", dependencies: ["PDFVector"], path: "Sources/extract-symbols"),
        .executableTarget(name: "extract-frames", dependencies: ["PDFVector"], path: "Sources/extract-frames"),
        .executableTarget(name: "pdf-to-svg", dependencies: ["PDFVector"], path: "Sources/pdf-to-svg"),
    ]
)
