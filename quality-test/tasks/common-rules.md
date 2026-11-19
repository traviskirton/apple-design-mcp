Output rules (identical for every run):

- Write exactly one self-contained SwiftUI source file. No third-party packages, no image assets: use SF Symbols, system colors and system materials only. Put sample data inline.
- Wrap the whole file in the platform check named in the task (`#if os(iOS)` or `#if os(macOS)`) ending with `#endif`.
- Name the top-level view exactly as the task says and include at least one `#Preview`.
- Start the file with a comment of at most 12 lines listing the Apple design rules and platform conventions you applied.
- The code must compile against the stated deployment target with the SDK that ships for it. Do not invent APIs.
