// swift-tools-version: 6.0
// Opens the quality-test results in Xcode so each file's #Preview can be compared.
// One target per result, because the paired files define views with the same names.
import PackageDescription

let results = [
    "DuoPlain", "DuoWithTools", "DuoWithToolsAndAPI",
    "SettingsPlain", "SettingsWithTools",
    "MacPlain", "MacWithTools",
]

let package = Package(
    name: "QualityTest",
    platforms: [.iOS("27.1"), .macOS("27.0")],
    products: results.map { .library(name: $0, targets: [$0]) },
    targets: results.map { .target(name: $0, swiftSettings: [.swiftLanguageMode(.v5)]) }
)
