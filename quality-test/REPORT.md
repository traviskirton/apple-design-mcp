# Quality test report

Run on 2026-11-18. Seven SwiftUI files, one per fresh agent, across three tasks. See [README.md](README.md) for the setup.

## Result

The material made a large difference on one task and a small one on the other two.

| Task | What the material changed | Size of difference |
| --- | --- | --- |
| 1. iPhone Duo recipes app | Without it the model has no knowledge of iPhone Duo and designs against Apple's guidance. With the HIG it follows the guidance. With the API docs it also uses the Duo APIs. | Large |
| 2. Podcast settings | Same structure and controls in both. The HIG run adds refinements. | Small |
| 3. macOS notes window | Same structure in both. The HIG run adds menu bar commands and drops one sidebar control. | Small |

iPhone Duo and its guidance were published on 2026-09-09, after the model's training data ends. Tasks 2 and 3 use patterns the model already knows. The material earns its place where Apple's content is newer than the model, and adds little where it is not.

## Task 1: iPhone Duo

**Plain.** The file's own header says: "No hinge or posture API is called: none is assumed to exist, so layout is inferred from available space only." It guessed, and several guesses contradict the Duo page of the HIG:

- It assumes the fold sits at the middle of its own view and hand-builds a 40 pt gutter there. On Duo the system moves toolbars and tab bars to one side, so the content area is asymmetrical and its middle is not the fold.
- It overrides the split view's column width to half the measured width. The HIG says standard split views already adjust to the fold and to avoid fixed widths.
- It adds its own "More" menu with the ellipsis symbol. The HIG says to use the system overflow menu and reserve the ellipsis for it.
- It does not detect the partly folded pose at all.

**With HIG and symbol search.** It read the Duo page and followed it: a standard tab view and split view with no fixed widths and no pose checks, state kept across open, close and rotate, toolbar items declared in the order the Duo page gives, every item with a title and a symbol, Edit and Delete in the system overflow, and system sheets and dialogs because the HIG says those move for the fold. Its limit, in its own words: "The HIG names ArrangementView, ReservedRegion, ToolbarItemVisibilityPriority, ToolbarVerticalCompressionBehavior and ToolbarOverflowMenu, but gives no signatures. I did not guess them." Fold handling is left to system defaults.

**With HIG, symbol search and API docs.** It uses the Duo APIs the way the documentation's examples do: `reservedRegions(kind: .division, ...)` to put the recipe overview and method on either side of the fold, `.visibilityPriority(.high)` on Start Cooking and Favorite, `ToolbarOverflowMenu` for Edit and Delete, and an `ArrangementView` in split style for cooking mode. I compared these calls with the documentation pages and they match the documented signatures. Whether they compile is untested.

## Task 2: settings

Both runs produced a grouped form with the same seven sections, switches, menu pickers and drill-in rows, and both default recommendations and analytics to off. Differences in the HIG run:

- It noticed the HIG's Dark Mode page discourages an app-only appearance setting, kept the setting because the brief requires it, and said so in the header.
- Icon tiles use six tints chosen for contrast under a white glyph, where the plain run uses eight.
- Rows that leave the app have a trailing arrow and a VoiceOver hint.
- The account row restacks at accessibility text sizes.

## Task 3: macOS notes window

Both runs produced a three-column split view with an inspector, search on the note list, and formatting controls in a bar above the editor. Differences in the HIG run:

- Every toolbar action is also a menu bar command with a standard shortcut.
- The plain run pins a New Folder button to the bottom of the sidebar; the HIG run does not, citing the sidebar guidance.

Both wrote the rich-text editor from memory of the macOS 26 API and both flagged it as their biggest compile risk. The HIG has no page for inspectors.

## SF Symbols

Every symbol name in all seven files exists and is available on its deployment target, including the three plain files (67 names between them). Checked against SF Symbols 7.2 metadata with `tools/symbols.py`. The symbol search did not prevent a single error in this test, because the plain runs made none.

Two limits on that: the newest symbol any run used dates from iOS 16, and the metadata is from SF Symbols 7.2, so nothing here tests symbols added in SF Symbols 27.

## Cost

| Run | Tokens | Tool calls | Minutes |
| --- | --- | --- | --- |
| Duo, plain | 86k | 1 | 5 |
| Duo, with tools | 180k | 26 | 8 |
| Duo, with tools and API docs | 200k | 26 | 11 |
| Settings, plain | 79k | 1 | 4 |
| Settings, with tools | 223k | 29 | 7 |
| macOS, plain | 103k | 1 | 8 |
| macOS, with tools | 276k | not recorded | not recorded |

The runs with tools read 9 to 27 whole HIG pages each and used two to three times the tokens.

## What this means for the build plan

1. **HIG tools come before symbol tools.** The plan builds `search_symbols` and `get_symbol` first. In this test the HIG changed the output and symbol search did not.
2. **API documentation belongs in the server for new platforms.** The plan leaves API docs to Xcode's own MCP bridge, which only exists on a Mac with Xcode. The Duo task shows the HIG alone tells the model what to design but not which calls to write, and people on claude.ai or chatgpt.com have no Xcode bridge. A narrow tool that returns the developer pages the HIG links to would cover it.
3. **Return sections, not whole pages.** `get_hig_page` should take a section name and `search_hig` should return short passages, to cut the token cost above.
4. **Symbol search needs more than Apple's keywords.** Apple's keyword file covers 3,189 of 9,184 symbols. Queries such as "storage", "subscription" and "analytics" return nothing.
5. **Color values are not in the HIG.** Its system color tables are images. One run computed contrast from remembered values. `get_design_values` has to take colors from AppKit or the UI kits.

## Limits of this test

- Nothing was compiled or rendered. All judgments are from reading the code.
- One run per condition. A second run of the same condition would differ.
- I wrote the tasks, knew which file was which, and am the same model as the agents.
- The iPhone Duo task was chosen because it is new, so it shows the best case for the material.
