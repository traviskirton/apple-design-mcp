// Reads SF Symbols' names and search data from the SF Symbols app and from the copy
// macOS ships in CoreGlyphs.bundle, and writes them as server/src/pack/symbols.js
// (the shape is server/src/pack/symbols.d.ts).
import Foundation

let appMetadata = URL(fileURLWithPath: "/Applications/SF Symbols.app/Contents/Resources/Metadata")
let systemGlyphs = URL(fileURLWithPath:
    "/System/Library/PrivateFrameworks/SFSymbols.framework/Versions/A/Resources/CoreGlyphs.bundle/Contents/Resources")

/// A plist or .strings file as a Foundation object, or nil when it is missing.
func readPlist(_ url: URL) -> Any? {
    guard let data = try? Data(contentsOf: url) else { return nil }
    return try? PropertyListSerialization.propertyList(from: data, format: nil)
}

/// The same file from the system and the app, system first.
func both(_ file: String) -> [Any] {
    [systemGlyphs, appMetadata].compactMap { readPlist($0.appendingPathComponent(file)) }
}

struct Metadata {
    var names: [String] = []                       // in Apple's order
    var systemNames = Set<String>()                // the names this macOS ships
    var year: [String: String] = [:]
    var releases: [String: [String: String]] = [:]
    var categories: [(key: String, label: String)] = []
    var symbolCategories: [String: [String]] = [:]
    var keywords: [String: [String]] = [:]
    var restrictions: [String: String] = [:]
    var aliases: [String: String] = [:]
    var appVersion = "unknown"
    var macOSVersion = ProcessInfo.processInfo.operatingSystemVersionString

    static func load() -> Metadata {
        var m = Metadata()
        let info = readPlist(URL(fileURLWithPath: "/Applications/SF Symbols.app/Contents/Info.plist")) as? [String: Any]
        m.appVersion = info?["CFBundleShortVersionString"] as? String ?? "not installed"
        let v = ProcessInfo.processInfo.operatingSystemVersion
        m.macOSVersion = "\(v.majorVersion).\(v.minorVersion)" + (v.patchVersion > 0 ? ".\(v.patchVersion)" : "")

        // Names, release year of each, and what each year means in OS versions.
        for (i, plist) in both("name_availability.plist").enumerated() {
            guard let dict = plist as? [String: Any] else { continue }
            let symbols = dict["symbols"] as? [String: String] ?? [:]
            if i == 0 { m.systemNames = Set(symbols.keys) }
            for (name, year) in symbols where m.year[name] == nil { m.year[name] = year }
            for (year, oses) in dict["year_to_release"] as? [String: [String: String]] ?? [:] {
                m.releases[year, default: [:]].merge(oses) { a, _ in a }
            }
        }

        // Apple's order, then any other names alphabetically.
        var seen = Set<String>()
        for plist in both("symbol_order.plist") {
            for name in plist as? [String] ?? [] where m.year[name] != nil && seen.insert(name).inserted {
                m.names.append(name)
            }
        }
        m.names += m.year.keys.filter { !seen.contains($0) }.sorted()

        // Categories: the app's list has labels; "all" is not a real category.
        let catLists = both("categories.plist").compactMap { $0 as? [[String: Any]] }
        let labelled = catLists.last ?? []
        var labels: [String: String] = [:]
        for list in catLists { for c in list { if let k = c["key"] as? String, let l = c["label"] as? String { labels[k] = l } } }
        for c in labelled + (catLists.first ?? []) {
            guard let key = c["key"] as? String, key != "all", !m.categories.contains(where: { $0.key == key }) else { continue }
            m.categories.append((key, labels[key] ?? key))
        }
        for plist in both("symbol_categories.plist") {
            for (name, keys) in plist as? [String: [String]] ?? [:] where m.symbolCategories[name] == nil {
                m.symbolCategories[name] = keys
            }
        }

        for plist in both("symbol_search.plist") {
            for (name, words) in plist as? [String: [String]] ?? [:] {
                var list = m.keywords[name] ?? []
                for w in words where !list.contains(w) { list.append(w) }
                m.keywords[name] = list
            }
        }

        for plist in both("symbol_restrictions.strings") {
            for (name, text) in plist as? [String: String] ?? [:] where m.restrictions[name] == nil {
                m.restrictions[name] = text
            }
        }

        // Renames: old name -> current name. The files are not consistent about direction,
        // so the current name is whichever of the two is still a symbol.
        for file in ["name_aliases.strings", "legacy_aliases.strings"] {
            for plist in both(file) {
                for (a, b) in plist as? [String: String] ?? [:] {
                    let (old, new) = m.year[b] != nil && m.year[a] == nil ? (a, b) : (m.year[a] != nil && m.year[b] == nil ? (b, a) : (a, b))
                    if m.year[old] == nil, m.year[new] != nil, m.aliases[old] == nil { m.aliases[old] = new }
                }
            }
        }
        return m
    }
}

private func json(_ value: Any) -> String {
    let data = try! JSONSerialization.data(withJSONObject: value, options: [.sortedKeys, .withoutEscapingSlashes, .fragmentsAllowed])
    return String(decoding: data, as: UTF8.self)
}

/// Writes symbols.js: one line per symbol so that diffs stay readable.
func writePack(_ m: Metadata, shapes: Set<String>, to url: URL) throws {
    let categoryIndex = Dictionary(uniqueKeysWithValues: m.categories.enumerated().map { ($1.key, $0) })
    var lines: [String] = []
    var withKeywords = 0
    for name in m.names {
        var entry: [(String, Any)] = [("name", name)]
        if let y = m.year[name] { entry.append(("year", y)) }
        let cats = (m.symbolCategories[name] ?? []).compactMap { categoryIndex[$0] }
        if !cats.isEmpty { entry.append(("categories", cats)) }
        if let k = m.keywords[name], !k.isEmpty { entry.append(("keywords", k)); withKeywords += 1 }
        if let r = m.restrictions[name] { entry.append(("restriction", r)) }
        lines.append("{" + entry.map { "\(json($0.0)):\(json($0.1))" }.joined(separator: ",") + "}")
    }
    let now = ISO8601DateFormatter().string(from: Date())
    let source: [String: Any] = [
        "name": "SF Symbols",
        "version": "\(m.appVersion) (macOS \(m.macOSVersion))",
        "symbols": m.names.count,
        "with_keywords": withKeywords,
        "with_shapes": m.names.filter { shapes.contains($0) }.count,
    ]
    let head = [
        "\"pack_version\":\(json(String(now.prefix(10))))",
        "\"generated_at\":\(json(now))",
        "\"source\":{" + ["name", "version", "symbols", "with_keywords", "with_shapes"].map { "\(json($0)):\(json(source[$0]!))" }.joined(separator: ",") + "}",
    ].joined(separator: ",")
    let text = "export default {\(head),\n"
        + "\"releases\":\(json(m.releases)),\n"
        + "\"categories\":\(json(m.categories.map { ["key": $0.key, "label": $0.label] })),\n"
        + "\"symbols\":[\n" + lines.joined(separator: ",\n") + "\n],\n"
        + "\"aliases\":\(json(m.aliases))};\n"
    try text.write(to: url, atomically: true, encoding: .utf8)
}
