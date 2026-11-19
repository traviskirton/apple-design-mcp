# Quality test

A test run before building the server: does Claude write better SwiftUI when it has the material the server's tools would return?

Three design tasks were each given to separate fresh agents that could not see each other's work. One agent per task worked from its own knowledge only ("plain"). Another could read Apple's Human Interface Guidelines as Markdown and run an SF Symbols search ("with tools"). The iPhone Duo task had a third run that could also read six developer documentation pages for the Duo SwiftUI APIs.

The findings are in [REPORT.md](REPORT.md). None of the code has been compiled; that needs Xcode.

## Look at the results in Xcode

Open `quality-test/Package.swift` in Xcode. Each result is its own target with `#Preview`s at the bottom of the file:

| Task | Plain | With tools | With tools and API docs |
| --- | --- | --- | --- |
| 1. Recipes app for iPhone Duo (iOS 27.1) | `Sources/DuoPlain` | `Sources/DuoWithTools` | `Sources/DuoWithToolsAndAPI` |
| 2. Podcast settings screen (iOS 27.0) | `Sources/SettingsPlain` | `Sources/SettingsWithTools` | |
| 3. Notes window for macOS (macOS 27.0) | `Sources/MacPlain` | `Sources/MacWithTools` | |

- Pick the target's scheme, then an iPhone Duo simulator for task 1, any iPhone for task 2 and My Mac for task 3.
- The package needs an Xcode with the iOS 27.1 SDK. `DuoWithToolsAndAPI` is the only target that uses iOS 27 APIs; for the others on an older Xcode, lower the versions in `Package.swift`.
- The package builds in Swift 5 language mode so that strict concurrency checking doesn't hide the differences that matter here.

Things worth judging by eye, since the report could not: which version looks more like an Apple app, how each Duo version behaves when the simulator is closed, opened, rotated and partly folded, and which compile errors each file has.

## Files

- `tasks/`: the three briefs and the output rules every run received.
- `Sources/`: the seven generated files, unedited.
- `tools/build_kit.py`: downloads the 171 HIG pages and the six API pages and converts them to Markdown (into `kit/`, not committed). This is the material the "with tools" runs read.
- `tools/docc2md.py`: converts one page of Apple's documentation JSON to Markdown.
- `tools/symbols.py`: `search` is the symbol search the runs used; `check` audits the symbol names in a Swift file. Both read the metadata inside `/Applications/SF Symbols.app`.

```sh
python3 quality-test/tools/build_kit.py
python3 quality-test/tools/symbols.py search "timer"
python3 quality-test/tools/symbols.py check quality-test/Sources/SettingsPlain/FathomSettingsScreen.swift --ios 27.0
```
