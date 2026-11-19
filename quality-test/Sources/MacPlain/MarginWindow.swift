// Margin: main window for macOS. Apple design rules and platform conventions applied:
// 1. Three-column NavigationSplitView (source list > note list > editor); the system draws the sidebar
//    material, the Liquid Glass toolbar and the sidebar toggle, so none of that chrome is custom.
// 2. Sidebar is a .sidebar List of Labels with outline SF Symbols, section headers and count badges.
// 3. Toolbar holds only frequent, window-level actions as icon buttons with labels and tooltips; related
//    items share a group, ToolbarSpacer separates groups, the inspector toggle sits at the trailing edge.
// 4. Full-height, resizable trailing inspector (.inspector) built from a grouped Form of LabeledContent.
// 5. macOS text styles only (title, headline, body, subheadline, callout); no fixed point sizes.
// 6. Semantic colors and hierarchical styles (.secondary, .tertiary, .fill, textBackgroundColor), so
//    light/dark mode, increased contrast and the user's accent color all work without extra code.
// 7. Formatting controls are an accessory bar in the editor (.accessoryBar buttons), not window toolbar.
// 8. Recoverable delete has no alert; only permanent deletion asks. Empty states use ContentUnavailableView.

#if os(macOS)
import SwiftUI
import AppKit

// MARK: - Model

private struct MarginFolder: Identifiable, Hashable {
    let id: UUID
    var name: String
}

private struct MarginNote: Identifiable, Equatable {
    let id: UUID
    var title: String
    var body: AttributedString
    var folderID: MarginFolder.ID?
    var tags: Set<String>
    var isFavorite = false
    var isDeleted = false
    var created: Date
    var modified: Date

    var plainText: String { String(body.characters) }

    var displayTitle: String { title.isEmpty ? "New Note" : title }

    var snippet: String {
        let firstLine = plainText
            .split(whereSeparator: \.isNewline)
            .first
            .map(String.init) ?? ""
        return firstLine.isEmpty ? "No additional text" : firstLine
    }

    var wordCount: Int {
        plainText
            .split(whereSeparator: \.isWhitespace)
            .filter { word in word.contains(where: { $0.isLetter || $0.isNumber }) }
            .count
    }

    var shareText: String { displayTitle + "\n\n" + plainText }
}

private enum MarginSidebarItem: Hashable {
    case allNotes
    case favorites
    case recentlyDeleted
    case folder(MarginFolder.ID)
    case tag(String)
}

private enum MarginListKind {
    case bulleted
    case numbered
    case checklist
}

// MARK: - Sample data

private enum MarginSampleData {
    static let personal = MarginFolder(id: UUID(), name: "Personal")
    static let work = MarginFolder(id: UUID(), name: "Work")
    static let travel = MarginFolder(id: UUID(), name: "Travel")

    static let folders = [personal, work, travel]
    static let tags = ["ideas", "meetings", "reading", "recipes", "todo"]

    static func hoursAgo(_ hours: Double) -> Date {
        Date.now.addingTimeInterval(-hours * 3600)
    }

    static func styled(heading: String, rest: String) -> AttributedString {
        var head = AttributedString(heading)
        head.swiftUI.font = Font.body.bold()
        return head + AttributedString(rest)
    }

    static let notes: [MarginNote] = [
        MarginNote(
            id: UUID(),
            title: "Quarterly planning",
            body: styled(
                heading: "Goals for the quarter\n",
                rest: "• Ship the new sync engine\n• Cut cold launch time in half\n• Hire two designers\n\nOpen questions\n1. Who owns the migration plan?\n2. When do we freeze the roadmap?"
            ),
            folderID: work.id,
            tags: ["meetings", "todo"],
            isFavorite: true,
            created: hoursAgo(240),
            modified: hoursAgo(0.5)
        ),
        MarginNote(
            id: UUID(),
            title: "Lisbon in spring",
            body: AttributedString("Flights land Thursday evening. Book the tram museum for Saturday.\n\n☐ Renew passport\n☐ Reserve dinner in Alfama\n☑ Find a place near the river"),
            folderID: travel.id,
            tags: ["todo"],
            created: hoursAgo(700),
            modified: hoursAgo(5)
        ),
        MarginNote(
            id: UUID(),
            title: "Sourdough, version four",
            body: AttributedString("75% hydration worked better than 80%. Longer cold proof, about 16 hours.\n\n1. Mix flour and water, rest 45 minutes\n2. Add starter and salt\n3. Four folds, 30 minutes apart\n4. Shape, then proof overnight in the fridge"),
            folderID: personal.id,
            tags: ["recipes"],
            isFavorite: true,
            created: hoursAgo(1200),
            modified: hoursAgo(28)
        ),
        MarginNote(
            id: UUID(),
            title: "Reading list",
            body: AttributedString("• The Design of Everyday Things\n• A Pattern Language\n• How Buildings Learn\n• Thinking in Systems"),
            folderID: personal.id,
            tags: ["reading", "ideas"],
            created: hoursAgo(2000),
            modified: hoursAgo(75)
        ),
        MarginNote(
            id: UUID(),
            title: "Margin notes on margins",
            body: AttributedString("A wide margin is an invitation. Leave room for the reader to write back.\n\nIdea: show backlinks in the trailing margin instead of a separate pane."),
            folderID: nil,
            tags: ["ideas"],
            created: hoursAgo(90),
            modified: hoursAgo(80)
        ),
        MarginNote(
            id: UUID(),
            title: "Old standup notes",
            body: AttributedString("Nothing blocked. Reviews are caught up. Demo moved to Friday."),
            folderID: work.id,
            tags: ["meetings"],
            isDeleted: true,
            created: hoursAgo(400),
            modified: hoursAgo(120)
        )
    ]
}

// MARK: - Window

struct MarginWindow: View {
    @State private var notes: [MarginNote] = MarginSampleData.notes
    @State private var folders: [MarginFolder] = MarginSampleData.folders
    @State private var tags: [String] = MarginSampleData.tags
    @State private var sidebarSelection: MarginSidebarItem? = .allNotes
    @State private var selectedNoteID: MarginNote.ID? = MarginSampleData.notes.first?.id
    @State private var searchText = ""
    @State private var isInspectorPresented = true
    @State private var pendingPermanentDeletion: MarginNote.ID?

    var body: some View {
        NavigationSplitView {
            MarginSidebar(
                selection: $sidebarSelection,
                folders: folders,
                tags: tags,
                count: { item in notes(in: item).count },
                onNewFolder: addFolder
            )
            .navigationSplitViewColumnWidth(min: 180, ideal: 220, max: 300)
        } content: {
            MarginNoteList(
                notes: visibleNotes,
                selection: $selectedNoteID,
                searchText: searchText,
                onToggleFavorite: toggleFavorite,
                onDelete: requestDelete,
                onRecover: recover
            )
            .navigationSplitViewColumnWidth(min: 240, ideal: 290, max: 420)
            .navigationTitle(listTitle)
            .navigationSubtitle(listSubtitle)
            .searchable(text: $searchText, prompt: "Search")
            .toolbar {
                ToolbarItem {
                    Button("New Note", systemImage: "square.and.pencil", action: addNote)
                        .help("New Note")
                }
            }
        } detail: {
            detail
                .toolbar {
                    ToolbarItemGroup {
                        ShareLink(
                            item: selectedNote?.shareText ?? "",
                            subject: Text(selectedNote?.displayTitle ?? "")
                        ) {
                            Label("Share", systemImage: "square.and.arrow.up")
                        }
                        .disabled(selectedNote == nil)
                        .help("Share Note")

                        Button("Delete", systemImage: "trash") {
                            if let selectedNoteID { requestDelete(selectedNoteID) }
                        }
                        .disabled(selectedNote == nil)
                        .help(selectedNote?.isDeleted == true ? "Delete Permanently" : "Delete Note")
                    }

                    ToolbarSpacer(.fixed)

                    ToolbarItem {
                        Button("Inspector", systemImage: "sidebar.trailing") {
                            isInspectorPresented.toggle()
                        }
                        .help(isInspectorPresented ? "Hide Inspector" : "Show Inspector")
                    }
                }
        }
        .inspector(isPresented: $isInspectorPresented) {
            MarginNoteInspector(
                note: selectedNote,
                folderName: folderName(for: selectedNote),
                allTags: tags,
                onToggleTag: toggleTagOnSelectedNote
            )
            .inspectorColumnWidth(min: 220, ideal: 260, max: 360)
        }
        .confirmationDialog(
            "Are you sure you want to permanently delete this note?",
            isPresented: isConfirmingPermanentDeletion
        ) {
            Button("Delete", role: .destructive, action: deletePermanently)
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("You can’t undo this action.")
        }
        .onChange(of: sidebarSelection) {
            selectedNoteID = visibleNotes.first?.id
        }
        .onChange(of: searchText) {
            if !visibleNotes.contains(where: { $0.id == selectedNoteID }) {
                selectedNoteID = visibleNotes.first?.id
            }
        }
        .frame(minWidth: 940, minHeight: 540)
    }

    // MARK: Detail

    @ViewBuilder
    private var detail: some View {
        if let note = selectedNote {
            MarginNoteEditor(note: binding(for: note), onRecover: { recover(note.id) })
                .id(note.id)
        } else {
            ContentUnavailableView(
                "No Note Selected",
                systemImage: "note.text",
                description: Text("Select a note from the list, or create a new one.")
            )
        }
    }

    // MARK: Derived state

    private var selectedNote: MarginNote? {
        notes.first { $0.id == selectedNoteID }
    }

    private var visibleNotes: [MarginNote] {
        let query = searchText.trimmingCharacters(in: .whitespaces)
        return notes(in: sidebarSelection ?? .allNotes)
            .filter { note in
                query.isEmpty
                    || note.title.localizedStandardContains(query)
                    || note.plainText.localizedStandardContains(query)
            }
            .sorted { $0.modified > $1.modified }
    }

    private var listTitle: String {
        switch sidebarSelection ?? .allNotes {
        case .allNotes:
            return "All Notes"
        case .favorites:
            return "Favorites"
        case .recentlyDeleted:
            return "Recently Deleted"
        case .folder(let id):
            return folders.first { $0.id == id }?.name ?? "Folder"
        case .tag(let tag):
            return "#" + tag
        }
    }

    private var listSubtitle: String {
        let count = visibleNotes.count
        return count == 1 ? "1 note" : "\(count) notes"
    }

    private var isConfirmingPermanentDeletion: Binding<Bool> {
        Binding(
            get: { pendingPermanentDeletion != nil },
            set: { isPresented in
                if !isPresented { pendingPermanentDeletion = nil }
            }
        )
    }

    private func notes(in item: MarginSidebarItem) -> [MarginNote] {
        switch item {
        case .allNotes:
            return notes.filter { !$0.isDeleted }
        case .favorites:
            return notes.filter { !$0.isDeleted && $0.isFavorite }
        case .recentlyDeleted:
            return notes.filter { $0.isDeleted }
        case .folder(let id):
            return notes.filter { !$0.isDeleted && $0.folderID == id }
        case .tag(let tag):
            return notes.filter { !$0.isDeleted && $0.tags.contains(tag) }
        }
    }

    private func folderName(for note: MarginNote?) -> String? {
        guard let folderID = note?.folderID else { return nil }
        return folders.first { $0.id == folderID }?.name
    }

    private func binding(for note: MarginNote) -> Binding<MarginNote> {
        let id = note.id
        return Binding(
            get: { notes.first { $0.id == id } ?? note },
            set: { newValue in
                guard let index = notes.firstIndex(where: { $0.id == id }) else { return }
                var updated = newValue
                if updated.title != notes[index].title || updated.body != notes[index].body {
                    updated.modified = .now
                }
                notes[index] = updated
            }
        )
    }

    // MARK: Actions

    private func addNote() {
        var note = MarginNote(
            id: UUID(),
            title: "",
            body: AttributedString(""),
            folderID: nil,
            tags: [],
            created: .now,
            modified: .now
        )
        switch sidebarSelection ?? .allNotes {
        case .folder(let id):
            note.folderID = id
        case .tag(let tag):
            note.tags = [tag]
        case .favorites:
            note.isFavorite = true
        case .recentlyDeleted:
            sidebarSelection = .allNotes
        case .allNotes:
            break
        }
        notes.append(note)
        searchText = ""
        selectedNoteID = note.id
    }

    private func addFolder() {
        let existing = Set(folders.map(\.name))
        var name = "New Folder"
        var suffix = 2
        while existing.contains(name) {
            name = "New Folder \(suffix)"
            suffix += 1
        }
        let folder = MarginFolder(id: UUID(), name: name)
        folders.append(folder)
        sidebarSelection = .folder(folder.id)
    }

    private func toggleFavorite(_ id: MarginNote.ID) {
        guard let index = notes.firstIndex(where: { $0.id == id }) else { return }
        notes[index].isFavorite.toggle()
    }

    private func toggleTagOnSelectedNote(_ tag: String) {
        guard let index = notes.firstIndex(where: { $0.id == selectedNoteID }) else { return }
        if notes[index].tags.contains(tag) {
            notes[index].tags.remove(tag)
        } else {
            notes[index].tags.insert(tag)
        }
    }

    private func requestDelete(_ id: MarginNote.ID) {
        guard let index = notes.firstIndex(where: { $0.id == id }) else { return }
        if notes[index].isDeleted {
            pendingPermanentDeletion = id
        } else {
            notes[index].isDeleted = true
            if selectedNoteID == id {
                selectedNoteID = visibleNotes.first?.id
            }
        }
    }

    private func deletePermanently() {
        guard let id = pendingPermanentDeletion else { return }
        notes.removeAll { $0.id == id }
        pendingPermanentDeletion = nil
        if selectedNoteID == id {
            selectedNoteID = visibleNotes.first?.id
        }
    }

    private func recover(_ id: MarginNote.ID) {
        guard let index = notes.firstIndex(where: { $0.id == id }) else { return }
        notes[index].isDeleted = false
        if selectedNoteID == id {
            selectedNoteID = visibleNotes.first?.id
        }
    }
}

// MARK: - Sidebar

private struct MarginSidebar: View {
    @Binding var selection: MarginSidebarItem?
    let folders: [MarginFolder]
    let tags: [String]
    let count: (MarginSidebarItem) -> Int
    var onNewFolder: () -> Void

    var body: some View {
        List(selection: $selection) {
            Section {
                Label("All Notes", systemImage: "note.text")
                    .badge(count(.allNotes))
                    .tag(MarginSidebarItem.allNotes)
                Label("Favorites", systemImage: "star")
                    .badge(count(.favorites))
                    .tag(MarginSidebarItem.favorites)
                Label("Recently Deleted", systemImage: "trash")
                    .badge(count(.recentlyDeleted))
                    .tag(MarginSidebarItem.recentlyDeleted)
            }

            Section("Folders") {
                ForEach(folders) { folder in
                    Label(folder.name, systemImage: "folder")
                        .badge(count(.folder(folder.id)))
                        .tag(MarginSidebarItem.folder(folder.id))
                }
            }

            Section("Tags") {
                ForEach(tags, id: \.self) { tag in
                    Label(tag, systemImage: "tag")
                        .badge(count(.tag(tag)))
                        .tag(MarginSidebarItem.tag(tag))
                }
            }
        }
        .listStyle(.sidebar)
        .safeAreaInset(edge: .bottom, spacing: 0) {
            Button("New Folder", systemImage: "plus.circle", action: onNewFolder)
                .buttonStyle(.borderless)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
        }
    }
}

// MARK: - Note list

private struct MarginNoteList: View {
    let notes: [MarginNote]
    @Binding var selection: MarginNote.ID?
    let searchText: String
    var onToggleFavorite: (MarginNote.ID) -> Void
    var onDelete: (MarginNote.ID) -> Void
    var onRecover: (MarginNote.ID) -> Void

    var body: some View {
        List(selection: $selection) {
            ForEach(notes) { note in
                MarginNoteRow(note: note)
                    .tag(note.id)
                    .contextMenu {
                        if note.isDeleted {
                            Button("Recover", systemImage: "arrow.uturn.backward") {
                                onRecover(note.id)
                            }
                            Button("Delete Permanently…", systemImage: "trash", role: .destructive) {
                                onDelete(note.id)
                            }
                        } else {
                            Button(
                                note.isFavorite ? "Remove from Favorites" : "Add to Favorites",
                                systemImage: note.isFavorite ? "star.slash" : "star"
                            ) {
                                onToggleFavorite(note.id)
                            }
                            Divider()
                            Button("Delete", systemImage: "trash", role: .destructive) {
                                onDelete(note.id)
                            }
                        }
                    }
            }
        }
        .listStyle(.inset)
        .onDeleteCommand {
            if let selection { onDelete(selection) }
        }
        .overlay {
            if notes.isEmpty {
                if searchText.isEmpty {
                    ContentUnavailableView(
                        "No Notes",
                        systemImage: "note.text",
                        description: Text("Notes you add here appear in this list.")
                    )
                } else {
                    ContentUnavailableView.search(text: searchText)
                }
            }
        }
    }
}

private struct MarginNoteRow: View {
    let note: MarginNote

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(spacing: 4) {
                Text(note.displayTitle)
                    .font(.headline)
                    .lineLimit(1)
                Spacer(minLength: 4)
                if note.isFavorite {
                    Image(systemName: "star.fill")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .accessibilityLabel("Favorite")
                }
            }
            HStack(spacing: 6) {
                Text(note.modified, format: .relative(presentation: .named))
                    .foregroundStyle(.secondary)
                    .layoutPriority(1)
                Text(note.snippet)
                    .foregroundStyle(.tertiary)
            }
            .font(.subheadline)
            .lineLimit(1)
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
    }
}

// MARK: - Editor

private struct MarginNoteEditor: View {
    @Binding var note: MarginNote
    var onRecover: () -> Void

    @State private var selection = AttributedTextSelection()

    var body: some View {
        VStack(spacing: 0) {
            if note.isDeleted {
                MarginDeletedBar(onRecover: onRecover)
            } else {
                MarginFormatBar(text: $note.body, selection: $selection)
            }
            Divider()

            TextField("Title", text: $note.title)
                .textFieldStyle(.plain)
                .font(.title)
                .fontWeight(.bold)
                .padding(.horizontal, 21)
                .padding(.top, 16)
                .padding(.bottom, 8)
                .disabled(note.isDeleted)

            TextEditor(text: $note.body, selection: $selection)
                .font(.body)
                .scrollContentBackground(.hidden)
                .padding(.horizontal, 16)
                .disabled(note.isDeleted)
                .accessibilityLabel("Note body")
        }
        .background(Color(nsColor: .textBackgroundColor))
    }
}

private struct MarginDeletedBar: View {
    var onRecover: () -> Void

    var body: some View {
        HStack(spacing: 8) {
            Label("This note is in Recently Deleted and can’t be edited.", systemImage: "trash")
                .font(.callout)
                .foregroundStyle(.secondary)
            Spacer()
            Button("Recover", action: onRecover)
                .controlSize(.small)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
    }
}

private struct MarginFormatBar: View {
    @Binding var text: AttributedString
    @Binding var selection: AttributedTextSelection

    @Environment(\.fontResolutionContext) private var fontResolutionContext

    var body: some View {
        HStack(spacing: 10) {
            HStack(spacing: 2) {
                Toggle("Bold", systemImage: "bold", isOn: boldBinding)
                    .help("Bold")
                Toggle("Italic", systemImage: "italic", isOn: italicBinding)
                    .help("Italic")
                Toggle("Underline", systemImage: "underline", isOn: underlineBinding)
                    .help("Underline")
                Toggle("Strikethrough", systemImage: "strikethrough", isOn: strikethroughBinding)
                    .help("Strikethrough")
            }

            Divider()
                .frame(height: 16)

            HStack(spacing: 2) {
                Button("Bulleted List", systemImage: "list.bullet") { toggleList(.bulleted) }
                    .help("Bulleted List")
                Button("Numbered List", systemImage: "list.number") { toggleList(.numbered) }
                    .help("Numbered List")
                Button("Checklist", systemImage: "checklist") { toggleList(.checklist) }
                    .help("Checklist")
            }

            Spacer(minLength: 0)
        }
        .toggleStyle(.button)
        .buttonStyle(.accessoryBar)
        .labelStyle(.iconOnly)
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Formatting")
    }

    // MARK: Character styles

    private var typingAttributes: AttributeContainer {
        selection.typingAttributes(in: text)
    }

    private var resolvedTypingFont: Font.Resolved {
        (typingAttributes.swiftUI.font ?? Font.body).resolve(in: fontResolutionContext)
    }

    private var boldBinding: Binding<Bool> {
        Binding(
            get: { resolvedTypingFont.isBold },
            set: { isOn in setFontTraits(bold: isOn, italic: nil) }
        )
    }

    private var italicBinding: Binding<Bool> {
        Binding(
            get: { resolvedTypingFont.isItalic },
            set: { isOn in setFontTraits(bold: nil, italic: isOn) }
        )
    }

    private var underlineBinding: Binding<Bool> {
        Binding(
            get: { typingAttributes.swiftUI.underlineStyle != nil },
            set: { isOn in
                text.transformAttributes(in: &selection) { container in
                    container.swiftUI.underlineStyle = isOn ? Text.LineStyle.single : nil
                }
            }
        )
    }

    private var strikethroughBinding: Binding<Bool> {
        Binding(
            get: { typingAttributes.swiftUI.strikethroughStyle != nil },
            set: { isOn in
                text.transformAttributes(in: &selection) { container in
                    container.swiftUI.strikethroughStyle = isOn ? Text.LineStyle.single : nil
                }
            }
        )
    }

    private func setFontTraits(bold: Bool?, italic: Bool?) {
        let context = fontResolutionContext
        text.transformAttributes(in: &selection) { container in
            let current = (container.swiftUI.font ?? Font.body).resolve(in: context)
            var font = Font.body
            if bold ?? current.isBold { font = font.bold() }
            if italic ?? current.isItalic { font = font.italic() }
            container.swiftUI.font = font
        }
    }

    // MARK: List styles

    private var caretIndex: AttributedString.Index {
        switch selection.indices(in: text) {
        case .insertionPoint(let index):
            return index
        case .ranges(let ranges):
            return ranges.ranges.first?.lowerBound ?? text.endIndex
        @unknown default:
            return text.endIndex
        }
    }

    /// Adds, swaps or removes the list marker at the start of the line that holds the insertion point.
    private func toggleList(_ kind: MarginListKind) {
        let characters = text.characters
        var lineStart = caretIndex
        while lineStart > characters.startIndex {
            let previous = characters.index(before: lineStart)
            if characters[previous].isNewline { break }
            lineStart = previous
        }

        let line = String(characters[lineStart...].prefix(while: { !$0.isNewline }))
        let existing = Self.marker(in: line)

        var replacement = ""
        if existing?.kind != kind {
            switch kind {
            case .bulleted:
                replacement = "• "
            case .checklist:
                replacement = "☐ "
            case .numbered:
                let before = String(characters[..<lineStart])
                let lines = before.split(omittingEmptySubsequences: false, whereSeparator: \.isNewline)
                let previousLine = lines.count >= 2 ? String(lines[lines.count - 2]) : ""
                let number = (Self.leadingNumber(in: previousLine) ?? 0) + 1
                replacement = "\(number). "
            }
        }

        let existingLength = existing?.length ?? 0
        guard existingLength > 0 || !replacement.isEmpty else { return }

        let lineOffset = characters.distance(from: characters.startIndex, to: lineStart)
        let markerEnd = characters.index(lineStart, offsetBy: existingLength)
        text.characters.replaceSubrange(lineStart..<markerEnd, with: replacement)

        // Indices from before the edit are no longer valid, so place the insertion point again.
        let updated = text.characters
        var lineEnd = updated.index(updated.startIndex, offsetBy: lineOffset)
        while lineEnd < updated.endIndex, !updated[lineEnd].isNewline {
            lineEnd = updated.index(after: lineEnd)
        }
        selection = AttributedTextSelection(range: lineEnd..<lineEnd)
    }

    private static func marker(in line: String) -> (kind: MarginListKind, length: Int)? {
        if line.hasPrefix("• ") { return (.bulleted, 2) }
        if line.hasPrefix("☐ ") || line.hasPrefix("☑ ") { return (.checklist, 2) }
        let digits = line.prefix(while: { $0.isWholeNumber })
        if !digits.isEmpty, line.dropFirst(digits.count).hasPrefix(". ") {
            return (.numbered, digits.count + 2)
        }
        return nil
    }

    private static func leadingNumber(in line: String) -> Int? {
        let digits = line.prefix(while: { $0.isWholeNumber })
        guard !digits.isEmpty, line.dropFirst(digits.count).hasPrefix(". ") else { return nil }
        return Int(digits)
    }
}

// MARK: - Inspector

private struct MarginNoteInspector: View {
    let note: MarginNote?
    let folderName: String?
    let allTags: [String]
    var onToggleTag: (String) -> Void

    var body: some View {
        if let note {
            Form {
                Section("Information") {
                    LabeledContent("Created") {
                        Text(note.created.formatted(date: .abbreviated, time: .shortened))
                    }
                    LabeledContent("Modified") {
                        Text(note.modified.formatted(date: .abbreviated, time: .shortened))
                    }
                    LabeledContent("Words", value: note.wordCount, format: .number)
                        .monospacedDigit()
                    LabeledContent("Folder", value: folderName ?? "None")
                }

                Section("Tags") {
                    if note.tags.isEmpty {
                        Text("No Tags")
                            .foregroundStyle(.secondary)
                    } else {
                        MarginFlowLayout(spacing: 6) {
                            ForEach(note.tags.sorted(), id: \.self) { tag in
                                Text(tag)
                                    .font(.callout)
                                    .lineLimit(1)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 3)
                                    .background(.fill.tertiary, in: .capsule)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .accessibilityElement(children: .contain)
                    }

                    Menu("Edit Tags", systemImage: "tag") {
                        ForEach(allTags, id: \.self) { tag in
                            Toggle(
                                tag,
                                isOn: Binding(
                                    get: { note.tags.contains(tag) },
                                    set: { _ in onToggleTag(tag) }
                                )
                            )
                        }
                    }
                    .disabled(note.isDeleted)
                }
            }
            .formStyle(.grouped)
        } else {
            ContentUnavailableView(
                "No Selection",
                systemImage: "info.circle",
                description: Text("Select a note to see its details.")
            )
        }
    }
}

/// Lays chips out left to right and wraps to a new row when the inspector is too narrow.
private struct MarginFlowLayout: Layout {
    var spacing: CGFloat = 6

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        arrangement(for: subviews, maxWidth: proposal.width ?? .infinity).size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let origins = arrangement(for: subviews, maxWidth: bounds.width).origins
        for (subview, origin) in zip(subviews, origins) {
            subview.place(
                at: CGPoint(x: bounds.minX + origin.x, y: bounds.minY + origin.y),
                proposal: .unspecified
            )
        }
    }

    private func arrangement(for subviews: Subviews, maxWidth: CGFloat) -> (size: CGSize, origins: [CGPoint]) {
        var origins: [CGPoint] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0
        var width: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x > 0, x + size.width > maxWidth {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            origins.append(CGPoint(x: x, y: y))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
            width = max(width, x - spacing)
        }

        return (CGSize(width: width, height: y + rowHeight), origins)
    }
}

// MARK: - Preview

#Preview("Margin") {
    MarginWindow()
        .frame(width: 1180, height: 720)
}

#endif
