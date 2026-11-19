// swift-tools-version:5.9
// Extracts SF Symbols from this Mac into the server's symbol pack and SVG files.
// Run from this folder: swift run -c release extract-symbols   (see README.md)
import PackageDescription

let package = Package(
    name: "extractor",
    platforms: [.macOS(.v14)],
    targets: [
        .executableTarget(name: "extract-symbols", path: "Sources/extract-symbols"),
    ]
)
