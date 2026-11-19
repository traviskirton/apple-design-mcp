# Task 3: main window of a notes app for macOS

Design the main window of a note-taking app called Margin for macOS, in SwiftUI. Deployment target macOS 27.0. Platform check: `#if os(macOS)`. Top-level view name: `MarginWindow`.

The window has:

- A sidebar with smart items (All Notes, Favorites, Recently Deleted), folders, and tags.
- A note list for the selected sidebar item, with search.
- An editor area for the selected note, with formatting controls (bold, italic, underline, strikethrough, bulleted list, numbered list, checklist).
- An inspector that can be shown and hidden, with note info: created, modified, word count, tags.
- Toolbar actions: new note, share, delete, toggle inspector.

Use the correct macOS text styles, system colors and materials, and appropriate SF Symbols that exist on the deployment target. Follow Apple's design guidance for macOS windows, sidebars, toolbars and inspectors.
