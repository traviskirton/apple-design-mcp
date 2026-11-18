// Margin — main window for macOS 27. Apple design rules and conventions applied:
// 1. Split view: sidebar > note list > editor, with the selection kept highlighted in every pane.
// 2. Sidebar: system sidebar list, two levels at most, short group titles, collapsible groups, outline
//    symbols in the accent color, counts as badges, hideable, nothing critical at its bottom edge.
// 3. Toolbar: standard borderless symbols in three trailing groups (create | note actions | inspector),
//    search field on the trailing side, window title names the current collection, not the app.
// 4. Every toolbar action is also a menu bar command with the standard shortcuts (MarginCommands).
// 5. Inspector: trailing pane that follows the selection; shown and hidden from the toolbar and View menu.
// 6. Formatting controls sit in the window body: toggles show B/I/U/S state, push buttons add list items.
// 7. macOS text styles (body 13 pt, nothing under 10 pt), semantic label styles, a standard material in the
//    content layer; Liquid Glass is left to system bars, with no custom tints or hard-coded colors.
// 8. Delete moves a note to Recently Deleted without an alert; only permanent deletion asks to confirm.

#if os(macOS)
import SwiftUI

// MARK: - Model

private typealias FontKey = AttributeScopes.SwiftUIAttributes.FontAttribute
private typealias UnderlineKey = AttributeScopes.SwiftUIAttributes.UnderlineStyleAttribute
private typealias StrikethroughKey = AttributeScopes.SwiftUIAttributes.StrikethroughStyleAttribute

private struct Folder: Identifiable, Hashable {
    let id = UUID()
    var name: String
}

private struct Note: Identifiable {
    let id = UUID()
    var text: AttributedString
    var folderID: Folder.ID
    var tags: [String]
    var created: Date
    var modified: Date
    var isFavorite = false
    var isDeleted = false

    var plainText: String { String(text.characters) }

    /// Like Notes, the first line of a note is its title.
    var title: String {
        let firstLine = plainText.split(whereSeparator: \.isNewline).first.map { String($0) } ?? ""
        let trimmed = firstLine.trimmingCharacters(in: .whitespaces)
        return trimmed.isEmpty ? "New Note" : trimmed
    }

    var preview: String {
        let lines = plainText.split(whereSeparator: \.isNewline)
        return lines.count > 1 ? String(lines[1]) : "No additional text"
    }

    var wordCount: Int {
        plainText
            .split(whereSeparator: \.isWhitespace)
            .filter { word in word.contains { $0.isLetter || $0.isNumber } }
            .count
    }
}

private enum SidebarItem: Hashable {
    case allNotes
    case favorites
    case recentlyDeleted
    case folder(Folder.ID)
    case tag(String)
}

private enum SampleData {
    static let personal = Folder(name: "Personal")
    static let work = Folder(name: "Work")
    static let travel = Folder(name: "Travel")
    static let folders = [personal, work, travel]

    static let notes: [Note] = [
        note("Launch checklist",
             "Final pass before we ship the spring release.\n☐ Freeze the build\n☐ Update screenshots\n☐ Write release notes",
             in: work, tags: ["planning", "release"], daysAgo: 0.1, isFavorite: true),
        note("Reading list",
             "Books to pick up this year.\n• The Design of Everyday Things\n• A Pattern Language\n• How Buildings Learn",
             in: personal, tags: ["books"], daysAgo: 1),
        note("Lisbon in May",
             "Flights are booked; the apartment is near the river.\n1. Renew passport\n2. Reserve the tram tour\n3. Find a bakery for the first morning",
             in: travel, tags: ["planning"], daysAgo: 3, isFavorite: true),
        note("Interview notes",
             "Strong on systems thinking and clear about trade-offs. Follow up about the migration project.",
             in: work, tags: ["hiring"], daysAgo: 6),
        note("Sourdough ratios",
             "500 g flour, 375 g water, 100 g starter, 10 g salt. Fold every 30 minutes for two hours.",
             in: personal, tags: ["recipes"], daysAgo: 12),
        note("Old meeting agenda",
             "Agenda for the January offsite. No longer needed.",
             in: work, tags: [], daysAgo: 20, isDeleted: true),
    ]

    static func note(
        _ title: String, _ body: String, in folder: Folder, tags: [String],
        daysAgo: Double, isFavorite: Bool = false, isDeleted: Bool = false
    ) -> Note {
        var heading = AttributedString(title + "\n")
        heading[FontKey.self] = Font.title2.bold()
        var content = AttributedString(body)
        content[FontKey.self] = Font.body
        let modified = Date.now.addingTimeInterval(-daysAgo * 86_400)
        return Note(
            text: heading + content, folderID: folder.id, tags: tags,
            created: modified.addingTimeInterval(-4 * 86_400), modified: modified,
            isFavorite: isFavorite, isDeleted: isDeleted)
    }
}

// MARK: - Window

struct MarginWindow: View {
    private let folders = SampleData.folders
    @State private var notes = SampleData.notes
    @State private var sidebarSelection: SidebarItem? = .allNotes
    @State private var selectedNoteID: Note.ID? = SampleData.notes.first?.id
    @State private var searchText = ""
    @State private var isInspectorPresented = true
    @State private var isFoldersExpanded = true
    @State private var isTagsExpanded = true
    @State private var notePendingPermanentDeletion: Note.ID?

    var body: some View {
        NavigationSplitView {
            sidebar
        } content: {
            noteList
        } detail: {
            detail
        }
        .searchable(text: $searchText, placement: .toolbar, prompt: Text("Search \(title(for: currentItem))"))
        .frame(minWidth: 880, minHeight: 480)
        .onChange(of: sidebarSelection) {
            selectedNoteID = visibleNotes.first?.id
        }
        .alert(
            "Delete this note permanently?",
            isPresented: isConfirmingPermanentDeletion,
            presenting: notePendingPermanentDeletion
        ) { id in
            Button("Delete", role: .destructive) { deletePermanently(id) }
            Button("Cancel", role: .cancel) {}
        } message: { _ in
            Text("You can’t undo this action.")
        }
        .focusedSceneValue(\.marginNoteActions, noteActions)
    }

    // MARK: Sidebar

    private var sidebar: some View {
        List(selection: $sidebarSelection) {
            Section {
                sidebarRow("All Notes", symbol: "note.text", item: .allNotes)
                sidebarRow("Favorites", symbol: "star", item: .favorites)
                sidebarRow("Recently Deleted", symbol: "trash", item: .recentlyDeleted)
            }
            Section("Folders", isExpanded: $isFoldersExpanded) {
                ForEach(folders) { folder in
                    sidebarRow(folder.name, symbol: "folder", item: .folder(folder.id))
                }
            }
            Section("Tags", isExpanded: $isTagsExpanded) {
                ForEach(allTags, id: \.self) { tag in
                    sidebarRow(tag, symbol: "tag", item: .tag(tag))
                }
            }
        }
        .listStyle(.sidebar)
        .navigationSplitViewColumnWidth(min: 180, ideal: 210, max: 300)
    }

    private func sidebarRow(_ title: String, symbol: String, item: SidebarItem) -> some View {
        Label(title, systemImage: symbol)
            .badge(count(for: item))
            .tag(item)
    }

    // MARK: Note list

    private var noteList: some View {
        List(visibleNotes, selection: $selectedNoteID) { note in
            NoteRow(note: note)
        }
        .contextMenu(forSelectionType: Note.ID.self) { ids in
            if let id = ids.first, let note = note(with: id) {
                rowMenu(for: note)
            }
        }
        .onDeleteCommand {
            if let id = selectedNoteID { delete(id) }
        }
        .overlay { listEmptyState }
        .navigationTitle(title(for: currentItem))
        .navigationSubtitle(Text("^[\(visibleNotes.count) note](inflect: true)"))
        .navigationSplitViewColumnWidth(min: 240, ideal: 290, max: 420)
    }

    @ViewBuilder
    private var listEmptyState: some View {
        if visibleNotes.isEmpty {
            if searchText.isEmpty {
                ContentUnavailableView(
                    "No Notes", systemImage: "note.text",
                    description: Text("Notes in \(title(for: currentItem)) appear here."))
            } else {
                ContentUnavailableView.search(text: searchText)
            }
        }
    }

    /// Context menus show only what applies to the row; every item is also in the Note menu.
    @ViewBuilder
    private func rowMenu(for note: Note) -> some View {
        if note.isDeleted {
            Button("Recover", systemImage: "arrow.up.trash") { recover(note.id) }
            Button("Delete Permanently…", systemImage: "trash") { delete(note.id) }
        } else {
            Button(
                note.isFavorite ? "Remove from Favorites" : "Add to Favorites",
                systemImage: note.isFavorite ? "star.slash" : "star"
            ) { toggleFavorite(note.id) }
            ShareLink(item: note.plainText)
            Divider()
            Button("Delete", systemImage: "trash") { delete(note.id) }
        }
    }

    // MARK: Editor, toolbar and inspector

    private var detail: some View {
        Group {
            if let note = selectedNote {
                NoteEditor(text: textBinding(for: note.id), isEditable: !note.isDeleted)
                    .id(note.id)
            } else {
                ContentUnavailableView(
                    "No Note Selected", systemImage: "note.text",
                    description: Text("Select a note in the list, or create a new one."))
            }
        }
        .frame(minWidth: 340)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button("New Note", systemImage: "square.and.pencil") { newNote() }
                    .help("Create a note")
            }
            ToolbarSpacer(.fixed, placement: .primaryAction)
            ToolbarItemGroup(placement: .primaryAction) {
                ShareLink(item: selectedNote?.plainText ?? "")
                    .disabled(selectedNote == nil)
                    .help("Share this note")
                Button("Delete", systemImage: "trash") {
                    if let id = selectedNoteID { delete(id) }
                }
                .disabled(selectedNote == nil)
                .help(selectedNote?.isDeleted == true ? "Delete this note permanently" : "Move this note to Recently Deleted")
            }
            ToolbarSpacer(.fixed, placement: .primaryAction)
            ToolbarItem(placement: .primaryAction) {
                Button(isInspectorPresented ? "Hide Inspector" : "Show Inspector", systemImage: "sidebar.trailing") {
                    isInspectorPresented.toggle()
                }
                .help("Show or hide note information")
            }
        }
        .inspector(isPresented: $isInspectorPresented) {
            inspectorContent
                .inspectorColumnWidth(min: 220, ideal: 260, max: 340)
        }
    }

    @ViewBuilder
    private var inspectorContent: some View {
        if let note = selectedNote {
            NoteInspector(
                note: note,
                folderName: folders.first { $0.id == note.folderID }?.name ?? "Notes",
                onAddTag: { addTag($0, to: note.id) },
                onRemoveTag: { removeTag($0, from: note.id) })
        } else {
            Text("No Selection")
                .font(.title3)
                .foregroundStyle(.secondary)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    // MARK: Derived state

    private var currentItem: SidebarItem { sidebarSelection ?? .allNotes }

    private var selectedNote: Note? {
        guard let selectedNoteID else { return nil }
        return note(with: selectedNoteID)
    }

    private var visibleNotes: [Note] {
        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        return notes
            .filter { matches($0, currentItem) }
            .filter { query.isEmpty || $0.plainText.localizedStandardContains(query) }
            .sorted { $0.modified > $1.modified }
    }

    private var allTags: [String] {
        Set(notes.filter { !$0.isDeleted }.flatMap(\.tags)).sorted()
    }

    private var isConfirmingPermanentDeletion: Binding<Bool> {
        Binding {
            notePendingPermanentDeletion != nil
        } set: { isPresented in
            if !isPresented { notePendingPermanentDeletion = nil }
        }
    }

    private var noteActions: MarginNoteActions {
        let note = selectedNote
        let id = note?.id
        return MarginNoteActions(
            hasSelection: note != nil,
            isFavorite: note?.isFavorite ?? false,
            isInTrash: note?.isDeleted ?? false,
            shareText: note?.plainText ?? "",
            newNote: { newNote() },
            toggleFavorite: { if let id { toggleFavorite(id) } },
            delete: { if let id { delete(id) } },
            recover: { if let id { recover(id) } })
    }

    private func note(with id: Note.ID) -> Note? {
        notes.first { $0.id == id }
    }

    private func matches(_ note: Note, _ item: SidebarItem) -> Bool {
        switch item {
        case .allNotes: return !note.isDeleted
        case .favorites: return !note.isDeleted && note.isFavorite
        case .recentlyDeleted: return note.isDeleted
        case .folder(let id): return !note.isDeleted && note.folderID == id
        case .tag(let tag): return !note.isDeleted && note.tags.contains(tag)
        }
    }

    private func count(for item: SidebarItem) -> Int {
        notes.filter { matches($0, item) }.count
    }

    private func title(for item: SidebarItem) -> String {
        switch item {
        case .allNotes: return "All Notes"
        case .favorites: return "Favorites"
        case .recentlyDeleted: return "Recently Deleted"
        case .folder(let id): return folders.first { $0.id == id }?.name ?? "Folder"
        case .tag(let tag): return tag
        }
    }

    private func textBinding(for id: Note.ID) -> Binding<AttributedString> {
        Binding {
            note(with: id)?.text ?? AttributedString()
        } set: { newValue in
            guard let index = notes.firstIndex(where: { $0.id == id }), notes[index].text != newValue else { return }
            notes[index].text = newValue
            notes[index].modified = .now
        }
    }

    // MARK: Actions

    private func newNote() {
        guard let defaultFolder = folders.first else { return }
        var note = Note(text: AttributedString(), folderID: defaultFolder.id, tags: [], created: .now, modified: .now)
        switch currentItem {
        case .folder(let id): note.folderID = id
        case .tag(let tag): note.tags = [tag]
        case .favorites, .recentlyDeleted: sidebarSelection = .allNotes
        case .allNotes: break
        }
        searchText = ""
        notes.append(note)
        selectedNoteID = note.id
    }

    /// Moving a note to Recently Deleted is common and recoverable, so it doesn't interrupt with an alert.
    private func delete(_ id: Note.ID) {
        guard let index = notes.firstIndex(where: { $0.id == id }) else { return }
        if notes[index].isDeleted {
            notePendingPermanentDeletion = id
        } else {
            let next = neighbor(of: id)
            notes[index].isDeleted = true
            if selectedNoteID == id { selectedNoteID = next }
        }
    }

    private func deletePermanently(_ id: Note.ID) {
        let next = neighbor(of: id)
        notes.removeAll { $0.id == id }
        if selectedNoteID == id { selectedNoteID = next }
    }

    private func recover(_ id: Note.ID) {
        guard let index = notes.firstIndex(where: { $0.id == id }) else { return }
        let next = neighbor(of: id)
        notes[index].isDeleted = false
        if selectedNoteID == id { selectedNoteID = next }
    }

    private func toggleFavorite(_ id: Note.ID) {
        guard let index = notes.firstIndex(where: { $0.id == id }) else { return }
        notes[index].isFavorite.toggle()
    }

    private func addTag(_ rawTag: String, to id: Note.ID) {
        let ignored = CharacterSet.whitespacesAndNewlines.union(CharacterSet(charactersIn: "#"))
        let tag = rawTag.trimmingCharacters(in: ignored).lowercased()
        guard !tag.isEmpty, let index = notes.firstIndex(where: { $0.id == id }),
              !notes[index].tags.contains(tag) else { return }
        notes[index].tags.append(tag)
        notes[index].tags.sort()
    }

    private func removeTag(_ tag: String, from id: Note.ID) {
        guard let index = notes.firstIndex(where: { $0.id == id }) else { return }
        notes[index].tags.removeAll { $0 == tag }
    }

    /// The note to select after `id` leaves the visible list: the next one, otherwise the previous one.
    private func neighbor(of id: Note.ID) -> Note.ID? {
        let list = visibleNotes
        guard let index = list.firstIndex(where: { $0.id == id }) else { return nil }
        if index + 1 < list.count { return list[index + 1].id }
        return index > 0 ? list[index - 1].id : nil
    }
}

// MARK: - Note list row

private struct NoteRow: View {
    let note: Note

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text(note.title)
                    .font(.headline)
                    .lineLimit(1)
                Spacer(minLength: 4)
                if note.isFavorite {
                    Image(systemName: "star.fill")
                        .imageScale(.small)
                        .foregroundStyle(.secondary)
                        .accessibilityLabel("Favorite")
                }
            }
            HStack(alignment: .firstTextBaseline, spacing: 6) {
                Text(note.modified, format: .dateTime.month(.abbreviated).day())
                Text(note.preview)
                    .foregroundStyle(.secondary)
            }
            .font(.subheadline)
            .lineLimit(1)
        }
        .padding(.vertical, 2)
        .accessibilityElement(children: .combine)
    }
}

// MARK: - Editor

private struct NoteEditor: View {
    @Binding var text: AttributedString
    var isEditable: Bool

    @State private var selection = AttributedTextSelection()
    @Environment(\.fontResolutionContext) private var fontResolutionContext

    var body: some View {
        VStack(spacing: 0) {
            formatBar
            Divider()
            TextEditor(text: $text, selection: $selection)
                .font(.body)
                .contentMargins(.horizontal, 16, for: .scrollContent)
                .disabled(!isEditable)
                .accessibilityLabel("Note text")
        }
    }

    /// Lives in the window body, at the top of the editor, so the toolbar stays uncrowded. Style toggles
    /// show the state of the selection; list buttons are momentary actions, so the two sets stay separate.
    private var formatBar: some View {
        HStack(spacing: 12) {
            HStack(spacing: 4) {
                Toggle("Bold", systemImage: "bold", isOn: isBold)
                    .help("Make the selected text bold")
                Toggle("Italic", systemImage: "italic", isOn: isItalic)
                    .help("Italicize the selected text")
                Toggle("Underline", systemImage: "underline", isOn: isUnderlined)
                    .help("Underline the selected text")
                Toggle("Strikethrough", systemImage: "strikethrough", isOn: isStruckThrough)
                    .help("Strike through the selected text")
            }
            Divider()
                .frame(height: 16)
            HStack(spacing: 4) {
                Button("Bulleted List", systemImage: "list.bullet") { appendListItem("• ") }
                    .help("Add a bulleted item")
                Button("Numbered List", systemImage: "list.number") { appendListItem("\(nextListNumber). ") }
                    .help("Add a numbered item")
                Button("Checklist", systemImage: "checklist") { appendListItem("☐ ") }
                    .help("Add a checklist item")
            }
            Spacer(minLength: 0)
        }
        .toggleStyle(.button)
        .labelStyle(.iconOnly)
        .controlSize(.large)
        .disabled(!isEditable)
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(.bar)
    }

    private var typingAttributes: AttributeContainer {
        selection.typingAttributes(in: text)
    }

    private var typingFont: Font.Resolved {
        (typingAttributes[FontKey.self] ?? .body).resolve(in: fontResolutionContext)
    }

    private var isBold: Binding<Bool> {
        Binding {
            typingFont.isBold
        } set: { isOn in
            text.transformAttributes(in: &selection) { attributes in
                attributes[FontKey.self] = (attributes[FontKey.self] ?? .body).bold(isOn)
            }
        }
    }

    private var isItalic: Binding<Bool> {
        Binding {
            typingFont.isItalic
        } set: { isOn in
            text.transformAttributes(in: &selection) { attributes in
                attributes[FontKey.self] = (attributes[FontKey.self] ?? .body).italic(isOn)
            }
        }
    }

    private var isUnderlined: Binding<Bool> {
        Binding {
            typingAttributes[UnderlineKey.self] != nil
        } set: { isOn in
            text.transformAttributes(in: &selection) { attributes in
                attributes[UnderlineKey.self] = isOn ? Text.LineStyle.single : nil
            }
        }
    }

    private var isStruckThrough: Binding<Bool> {
        Binding {
            typingAttributes[StrikethroughKey.self] != nil
        } set: { isOn in
            text.transformAttributes(in: &selection) { attributes in
                attributes[StrikethroughKey.self] = isOn ? Text.LineStyle.single : nil
            }
        }
    }

    private var nextListNumber: Int {
        let numberedLines = String(text.characters).split(whereSeparator: \.isNewline).filter { line in
            let digits = line.prefix(while: \.isNumber)
            return !digits.isEmpty && line.dropFirst(digits.count).hasPrefix(". ")
        }
        return numberedLines.count + 1
    }

    /// Sample behavior: starts a new list line at the end of the note. A shipping editor would apply a
    /// paragraph style to the selected lines instead.
    private func appendListItem(_ marker: String) {
        let needsLineBreak = text.characters.last.map { !$0.isNewline } ?? false
        var item = AttributedString((needsLineBreak ? "\n" : "") + marker)
        item[FontKey.self] = Font.body
        text.append(item)
    }
}

// MARK: - Inspector

private struct NoteInspector: View {
    let note: Note
    let folderName: String
    var onAddTag: (String) -> Void
    var onRemoveTag: (String) -> Void

    @State private var newTag = ""

    var body: some View {
        Form {
            Section("Information") {
                LabeledContent("Created", value: note.created, format: Date.FormatStyle(date: .abbreviated, time: .shortened))
                LabeledContent("Modified", value: note.modified, format: Date.FormatStyle(date: .abbreviated, time: .shortened))
                LabeledContent("Words", value: note.wordCount, format: .number)
                LabeledContent("Folder", value: folderName)
            }
            Section("Tags") {
                if note.tags.isEmpty {
                    Text("No Tags")
                        .foregroundStyle(.secondary)
                }
                ForEach(note.tags, id: \.self) { tag in
                    LabeledContent {
                        Button("Remove Tag", systemImage: "minus.circle") { onRemoveTag(tag) }
                            .buttonStyle(.borderless)
                            .labelStyle(.iconOnly)
                            .help("Remove this tag from the note")
                    } label: {
                        Label(tag, systemImage: "tag")
                    }
                }
                TextField("New Tag", text: $newTag, prompt: Text("Add Tag"))
                    .labelsHidden()
                    .onSubmit {
                        onAddTag(newTag)
                        newTag = ""
                    }
            }
            .disabled(note.isDeleted)
        }
        .formStyle(.grouped)
    }
}

// MARK: - Menu bar commands

/// What the menu bar needs from the frontmost Margin window.
fileprivate struct MarginNoteActions {
    var hasSelection: Bool
    var isFavorite: Bool
    var isInTrash: Bool
    var shareText: String
    var newNote: @MainActor () -> Void
    var toggleFavorite: @MainActor () -> Void
    var delete: @MainActor () -> Void
    var recover: @MainActor () -> Void
}

private struct MarginNoteActionsKey: FocusedValueKey {
    typealias Value = MarginNoteActions
}

extension FocusedValues {
    fileprivate var marginNoteActions: MarginNoteActions? {
        get { self[MarginNoteActionsKey.self] }
        set { self[MarginNoteActionsKey.self] = newValue }
    }
}

/// Mirrors the toolbar in the menu bar, because people can hide a toolbar.
/// Install on the app's scene: `WindowGroup { MarginWindow() }.commands { MarginCommands() }`.
struct MarginCommands: Commands {
    @FocusedValue(\.marginNoteActions) private var actions

    var body: some Commands {
        SidebarCommands()
        InspectorCommands()
        TextFormattingCommands()
        CommandGroup(replacing: .newItem) {
            Button("New Note", systemImage: "square.and.pencil") { actions?.newNote() }
                .keyboardShortcut("n")
                .disabled(actions == nil)
        }
        CommandMenu("Note") {
            Button(
                actions?.isFavorite == true ? "Remove from Favorites" : "Add to Favorites",
                systemImage: actions?.isFavorite == true ? "star.slash" : "star"
            ) { actions?.toggleFavorite() }
                .disabled(actions?.hasSelection != true || actions?.isInTrash == true)
            ShareLink(item: actions?.shareText ?? "")
                .disabled(actions?.hasSelection != true)
            Divider()
            Button("Recover", systemImage: "arrow.up.trash") { actions?.recover() }
                .disabled(actions?.isInTrash != true)
            Button("Delete", systemImage: "trash") { actions?.delete() }
                .keyboardShortcut(.delete)
                .disabled(actions?.hasSelection != true)
        }
    }
}

// MARK: - Previews

#Preview("Margin") {
    MarginWindow()
        .frame(width: 1180, height: 720)
}

#Preview("Margin, Dark") {
    MarginWindow()
        .frame(width: 1180, height: 720)
        .preferredColorScheme(.dark)
}

#endif
