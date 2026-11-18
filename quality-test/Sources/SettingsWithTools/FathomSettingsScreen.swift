// Fathom — Settings (iPhone, iOS 27). Apple design rules applied:
// 1. Settings: few, general, rarely changed options with sensible defaults; marketing-style notifications and analytics start off.
// 2. Lists: grouped style with headers and footers; succinct title-case labels; a footer explains only what a setting does when on.
// 3. Toggles: switches appear only in list rows and keep the default green; each row's label gives the switch its context.
// 4. Short sets of exclusive values use pop-up (menu) pickers in place; longer content drills in with a disclosure indicator.
// 5. Options lists (app icon) mark the current choice with a checkmark, not with color alone.
// 6. Typography: built-in text styles only, Dynamic Type throughout, icons scale with text, profile row restacks at AX sizes.
// 7. Color: semantic label and grouped-background colors, system tints only, white glyphs on tiles that keep 3:1 contrast.
// 8. SF Symbols: one familiar symbol per row, weight matched to text, decorative tiles hidden from VoiceOver.
// 9. Subscription: plan and renewal date sit next to Manage Subscription, which opens the system management sheet.
// 10. Dark Mode: theme defaults to System (HIG discourages an app-only appearance switch; kept because the brief requires it).
// 11. Verb-first action rows; rows that leave the app carry an arrow and a VoiceOver hint; destructive removal asks to confirm.

#if os(iOS)
import SwiftUI
import StoreKit

// MARK: - Model

private enum AppTheme: String, CaseIterable, Identifiable {
    case system, light, dark

    var id: Self { self }

    var title: LocalizedStringKey {
        switch self {
        case .system: "System"
        case .light: "Light"
        case .dark: "Dark"
        }
    }

    /// `nil` hands control back to the systemwide appearance.
    var colorScheme: ColorScheme? {
        switch self {
        case .system: nil
        case .light: .light
        case .dark: .dark
        }
    }
}

private enum AppIconChoice: String, CaseIterable, Identifiable {
    case standard, deepSea, coral, slate

    var id: Self { self }

    var title: LocalizedStringKey {
        switch self {
        case .standard: "Default"
        case .deepSea: "Deep Sea"
        case .coral: "Coral"
        case .slate: "Slate"
        }
    }

    var color: Color {
        switch self {
        case .standard: .indigo
        case .deepSea: .blue
        case .coral: .pink
        case .slate: .gray
        }
    }
}

private enum SleepTimer: String, CaseIterable, Identifiable {
    case off, minutes5, minutes15, minutes30, minutes45, hour1, endOfEpisode

    var id: Self { self }

    private var minutes: Int? {
        switch self {
        case .minutes5: 5
        case .minutes15: 15
        case .minutes30: 30
        case .minutes45: 45
        case .hour1: 60
        case .off, .endOfEpisode: nil
        }
    }

    var title: String {
        if let minutes {
            return Duration.seconds(minutes * 60)
                .formatted(.units(allowed: [.hours, .minutes], width: .wide))
        }
        return self == .off ? String(localized: "Off") : String(localized: "End of Episode")
    }
}

private struct DownloadedShow: Identifiable, Hashable {
    let id = UUID()
    let title: String
    let episodeCount: Int
    let bytes: Int64

    static let samples: [DownloadedShow] = [
        DownloadedShow(title: "The Long Tide", episodeCount: 12, bytes: 1_120_000_000),
        DownloadedShow(title: "Signal & Static", episodeCount: 7, bytes: 640_000_000),
        DownloadedShow(title: "Field Notes Weekly", episodeCount: 5, bytes: 410_000_000),
        DownloadedShow(title: "Small Hours", episodeCount: 3, bytes: 230_000_000)
    ]
}

private struct Acknowledgement: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let license: String

    static let samples: [Acknowledgement] = [
        Acknowledgement(name: "Harbor Feed Parser", license: "MIT License"),
        Acknowledgement(name: "Lantern Cache", license: "BSD 3-Clause License"),
        Acknowledgement(name: "Tidewave Audio", license: "Apache License 2.0")
    ]
}

private enum Account {
    static let name = "Maya Okafor"
    static let email = "maya.okafor@example.com"
    static let plan = "Fathom Plus"
    static let renewalDate = Calendar.current.date(
        from: DateComponents(year: 2026, month: 12, day: 14)
    ) ?? .now
}

/// Section tints. Each keeps at least 3:1 contrast under a white glyph.
private enum Tint {
    static let account = Color.indigo
    static let playback = Color.purple
    static let downloads = Color.blue
    static let notifications = Color.red
    static let appearance = Color.pink
    static let neutral = Color.gray
}

private let skipIntervals = [10, 15, 30, 45, 60]
private let playbackSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

// MARK: - Settings screen

struct FathomSettingsScreen: View {
    // Playback
    @AppStorage("playback.speed") private var playbackSpeed = 1.0
    @AppStorage("playback.skipForward") private var skipForward = 30
    @AppStorage("playback.skipBack") private var skipBack = 15
    @AppStorage("playback.continuous") private var continuousPlay = true
    @AppStorage("playback.trimSilence") private var trimSilence = false
    @AppStorage("playback.sleepTimer") private var sleepTimer = SleepTimer.minutes30

    // Downloads
    @AppStorage("downloads.auto") private var autoDownload = true
    @AppStorage("downloads.cellular") private var downloadOverCellular = false
    @AppStorage("downloads.removePlayed") private var removePlayed = true

    // Notifications
    @AppStorage("notifications.newEpisodes") private var notifyNewEpisodes = true
    @AppStorage("notifications.recommendations") private var notifyRecommendations = false

    // Appearance. A shipping app also calls UIApplication.setAlternateIconName(_:) when the icon changes.
    @AppStorage("appearance.theme") private var theme = AppTheme.system
    @AppStorage("appearance.icon") private var appIcon = AppIconChoice.standard

    // Privacy
    @AppStorage("privacy.analytics") private var shareAnalytics = false

    @State private var downloads = DownloadedShow.samples
    @State private var isManagingSubscription = false

    @Environment(\.openURL) private var openURL

    private var storageUsed: Int64 {
        downloads.reduce(0) { $0 + $1.bytes }
    }

    var body: some View {
        NavigationStack {
            Form {
                accountSection
                playbackSection
                downloadsSection
                storageSection
                notificationsSection
                appearanceSection
                privacySection
                aboutSection
            }
            .navigationTitle("Settings")
        }
        .preferredColorScheme(theme.colorScheme)
        .manageSubscriptionsSheet(isPresented: $isManagingSubscription)
    }

    // MARK: Account

    private var accountSection: some View {
        Section {
            ProfileRow(name: Account.name, email: Account.email)

            Button {
                isManagingSubscription = true
            } label: {
                SettingsLabel(
                    "Manage Subscription",
                    systemImage: "creditcard.fill",
                    tint: Tint.account,
                    subtitle: Text("\(Account.plan) · Renews \(Account.renewalDate, format: .dateTime.day().month(.wide).year())")
                )
            }
        }
    }

    // MARK: Playback

    private var playbackSection: some View {
        Section {
            Picker(selection: $playbackSpeed) {
                ForEach(playbackSpeeds, id: \.self) { speed in
                    Text(speedTitle(speed)).tag(speed)
                }
            } label: {
                SettingsLabel("Playback Speed", systemImage: "speedometer", tint: Tint.playback)
            }
            .pickerStyle(.menu)

            Picker(selection: $skipForward) {
                ForEach(skipIntervals, id: \.self) { seconds in
                    Text(secondsTitle(seconds)).tag(seconds)
                }
            } label: {
                SettingsLabel("Skip Forward", systemImage: skipForwardSymbol(skipForward), tint: Tint.playback)
            }
            .pickerStyle(.menu)

            Picker(selection: $skipBack) {
                ForEach(skipIntervals, id: \.self) { seconds in
                    Text(secondsTitle(seconds)).tag(seconds)
                }
            } label: {
                SettingsLabel("Skip Back", systemImage: skipBackSymbol(skipBack), tint: Tint.playback)
            }
            .pickerStyle(.menu)

            Picker(selection: $sleepTimer) {
                ForEach(SleepTimer.allCases) { timer in
                    Text(timer.title).tag(timer)
                }
            } label: {
                SettingsLabel("Default Sleep Timer", systemImage: "moon.zzz.fill", tint: Tint.playback)
            }
            .pickerStyle(.menu)

            Toggle(isOn: $continuousPlay) {
                SettingsLabel("Continuous Play", systemImage: "infinity", tint: Tint.playback)
            }

            Toggle(isOn: $trimSilence) {
                SettingsLabel("Trim Silence", systemImage: "waveform.path.badge.minus", tint: Tint.playback)
            }
        } header: {
            Text("Playback")
        } footer: {
            Text("Continuous Play starts the next episode in the queue when one ends. Trim Silence shortens long pauses.")
        }
    }

    // MARK: Downloads

    private var downloadsSection: some View {
        Section {
            Toggle(isOn: $autoDownload) {
                SettingsLabel("Auto-Download New Episodes", systemImage: "arrow.down.circle.fill", tint: Tint.downloads)
            }

            Toggle(isOn: $downloadOverCellular) {
                SettingsLabel("Download over Cellular", systemImage: "antenna.radiowaves.left.and.right", tint: Tint.downloads)
            }

            Toggle(isOn: $removePlayed) {
                SettingsLabel("Remove Played Episodes", systemImage: "trash.fill", tint: Tint.downloads)
            }
        } header: {
            Text("Downloads")
        } footer: {
            Text("Played episodes are removed from this iPhone 24 hours after they finish.")
        }
    }

    private var storageSection: some View {
        Section {
            NavigationLink {
                StorageScreen(shows: $downloads)
            } label: {
                LabeledContent {
                    Text(storageUsed.formatted(.byteCount(style: .file)))
                } label: {
                    SettingsLabel("Storage", systemImage: "internaldrive.fill", tint: Tint.downloads)
                }
            }
        }
    }

    // MARK: Notifications

    private var notificationsSection: some View {
        Section {
            Toggle(isOn: $notifyNewEpisodes) {
                SettingsLabel("New Episodes", systemImage: "bell.badge.fill", tint: Tint.notifications)
            }

            Toggle(isOn: $notifyRecommendations) {
                SettingsLabel("Recommendations", systemImage: "hand.thumbsup.fill", tint: Tint.notifications)
            }
        } header: {
            Text("Notifications")
        } footer: {
            Text("Recommendations are occasional suggestions for shows like the ones you follow.")
        }
    }

    // MARK: Appearance

    private var appearanceSection: some View {
        Section {
            Picker(selection: $theme) {
                ForEach(AppTheme.allCases) { theme in
                    Text(theme.title).tag(theme)
                }
            } label: {
                SettingsLabel("Theme", systemImage: "circle.lefthalf.filled", tint: Tint.appearance)
            }
            .pickerStyle(.menu)

            NavigationLink {
                AppIconScreen(selection: $appIcon)
            } label: {
                LabeledContent {
                    Text(appIcon.title)
                } label: {
                    SettingsLabel("App Icon", systemImage: "apps.iphone", tint: Tint.appearance)
                }
            }
        } header: {
            Text("Appearance")
        } footer: {
            Text("System matches the appearance set for this iPhone.")
        }
    }

    // MARK: Privacy

    private var privacySection: some View {
        Section {
            Toggle(isOn: $shareAnalytics) {
                SettingsLabel("Share Analytics", systemImage: "chart.bar.fill", tint: Tint.neutral)
            }
        } header: {
            Text("Privacy")
        } footer: {
            Text("Sends anonymous usage and crash data that helps improve Fathom. Analytics are never linked to an account.")
        }
    }

    // MARK: About

    private var aboutSection: some View {
        Section("About") {
            LabeledContent {
                Text("4.2 (318)")
            } label: {
                SettingsLabel("Version", systemImage: "info", tint: Tint.neutral)
            }

            NavigationLink {
                AcknowledgementsScreen()
            } label: {
                SettingsLabel("Acknowledgements", systemImage: "doc.text.fill", tint: Tint.neutral)
            }

            Button {
                open("https://apps.apple.com/app/id0000000000?action=write-review")
            } label: {
                ExternalActionLabel("Rate Fathom", systemImage: "star.fill", tint: Tint.neutral)
            }
            .accessibilityHint("Opens the App Store")

            Button {
                open("mailto:support@fathom.example")
            } label: {
                ExternalActionLabel("Contact Support", systemImage: "envelope.fill", tint: Tint.neutral)
            }
            .accessibilityHint("Opens Mail")
        }
    }

    // MARK: Helpers

    private func open(_ address: String) {
        guard let url = URL(string: address) else { return }
        openURL(url)
    }

    private func speedTitle(_ speed: Double) -> String {
        speed.formatted(.number.precision(.fractionLength(0...2))) + "×"
    }

    private func secondsTitle(_ seconds: Int) -> String {
        Duration.seconds(seconds).formatted(.units(allowed: [.seconds], width: .wide))
    }

    private func skipForwardSymbol(_ seconds: Int) -> String {
        switch seconds {
        case 10: "goforward.10"
        case 15: "goforward.15"
        case 30: "goforward.30"
        case 45: "goforward.45"
        case 60: "goforward.60"
        default: "goforward"
        }
    }

    private func skipBackSymbol(_ seconds: Int) -> String {
        switch seconds {
        case 10: "gobackward.10"
        case 15: "gobackward.15"
        case 30: "gobackward.30"
        case 45: "gobackward.45"
        case 60: "gobackward.60"
        default: "gobackward"
        }
    }
}

// MARK: - Row building blocks

/// A white SF Symbol on a tinted rounded tile. The tile and glyph scale with Dynamic Type.
private struct SettingsIcon: View {
    let systemImage: String
    let tint: Color

    @ScaledMetric(relativeTo: .body) private var side: CGFloat = 29

    var body: some View {
        RoundedRectangle(cornerRadius: side * 0.24, style: .continuous)
            .fill(tint)
            .frame(width: side, height: side)
            .overlay {
                Image(systemName: systemImage)
                    .font(.system(size: side * 0.55, weight: .medium))
                    .foregroundStyle(.white)
            }
            .accessibilityHidden(true)
    }
}

private struct SettingsLabel: View {
    private let title: LocalizedStringKey
    private let systemImage: String
    private let tint: Color
    private let subtitle: Text?

    init(_ title: LocalizedStringKey, systemImage: String, tint: Color, subtitle: Text? = nil) {
        self.title = title
        self.systemImage = systemImage
        self.tint = tint
        self.subtitle = subtitle
    }

    var body: some View {
        Label {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                if let subtitle {
                    subtitle
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }
        } icon: {
            SettingsIcon(systemImage: systemImage, tint: tint)
        }
    }
}

/// A row label for an action that leaves the app; the trailing arrow says so without relying on color.
private struct ExternalActionLabel: View {
    private let title: LocalizedStringKey
    private let systemImage: String
    private let tint: Color

    init(_ title: LocalizedStringKey, systemImage: String, tint: Color) {
        self.title = title
        self.systemImage = systemImage
        self.tint = tint
    }

    var body: some View {
        LabeledContent {
            Image(systemName: "arrow.up.forward")
                .font(.footnote.weight(.semibold))
                .foregroundStyle(.tertiary)
                .accessibilityHidden(true)
        } label: {
            SettingsLabel(title, systemImage: systemImage, tint: tint)
        }
    }
}

private struct ProfileRow: View {
    let name: String
    let email: String

    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @ScaledMetric(relativeTo: .title) private var avatarSide: CGFloat = 52

    var body: some View {
        // Stack the avatar above the text at accessibility sizes so the name and email keep their width.
        let layout = dynamicTypeSize.isAccessibilitySize
            ? AnyLayout(VStackLayout(alignment: .leading, spacing: 8))
            : AnyLayout(HStackLayout(spacing: 12))

        layout {
            Image(systemName: "person.crop.circle.fill")
                .font(.system(size: avatarSide))
                .symbolRenderingMode(.hierarchical)
                .foregroundStyle(.secondary)
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(.headline)
                Text(email)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
    }
}

// MARK: - Storage

private struct StorageScreen: View {
    @Binding var shows: [DownloadedShow]
    @State private var isConfirmingRemoveAll = false

    private var totalBytes: Int64 {
        shows.reduce(0) { $0 + $1.bytes }
    }

    var body: some View {
        Group {
            if shows.isEmpty {
                ContentUnavailableView(
                    "No Downloads",
                    systemImage: "arrow.down.circle",
                    description: Text("Downloaded episodes appear here.")
                )
            } else {
                List {
                    Section {
                        LabeledContent("Downloads", value: totalBytes.formatted(.byteCount(style: .file)))
                    }

                    Section {
                        ForEach(shows) { show in
                            LabeledContent {
                                Text(show.bytes.formatted(.byteCount(style: .file)))
                            } label: {
                                Text(show.title)
                                Text("^[\(show.episodeCount) episode](inflect: true)")
                            }
                        }
                        .onDelete { offsets in
                            shows.remove(atOffsets: offsets)
                        }
                    } header: {
                        Text("Shows")
                    } footer: {
                        Text("Swipe a show or tap Edit to remove its downloaded episodes.")
                    }

                    Section {
                        Button("Remove All Downloads", systemImage: "trash", role: .destructive) {
                            isConfirmingRemoveAll = true
                        }
                    }
                }
                .listStyle(.insetGrouped)
            }
        }
        .navigationTitle("Storage")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if !shows.isEmpty {
                ToolbarItem(placement: .topBarTrailing) {
                    EditButton()
                }
            }
        }
        .confirmationDialog(
            "Remove all downloads?",
            isPresented: $isConfirmingRemoveAll,
            titleVisibility: .visible
        ) {
            Button("Remove All Downloads", role: .destructive) {
                shows.removeAll()
            }
        } message: {
            Text("Downloaded episodes are removed from this iPhone. They can be downloaded again at any time.")
        }
    }
}

// MARK: - App icon

private struct AppIconScreen: View {
    @Binding var selection: AppIconChoice

    var body: some View {
        List {
            Section {
                // The inline picker adds the checkmark and the selected trait for the current choice.
                Picker("App Icon", selection: $selection) {
                    ForEach(AppIconChoice.allCases) { choice in
                        HStack(spacing: 12) {
                            AppIconPreview(color: choice.color)
                            Text(choice.title)
                        }
                        .tag(choice)
                    }
                }
                .pickerStyle(.inline)
                .labelsHidden()
            } footer: {
                Text("The icon changes on the Home Screen and in the App Library.")
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle("App Icon")
        .navigationBarTitleDisplayMode(.inline)
    }
}

/// A drawn stand-in for an alternate icon: a tinted tile with the Fathom mark (SF Symbols can't appear in app icons).
private struct AppIconPreview: View {
    let color: Color

    @ScaledMetric(relativeTo: .body) private var side: CGFloat = 44

    var body: some View {
        RoundedRectangle(cornerRadius: side * 0.225, style: .continuous)
            .fill(color.gradient)
            .frame(width: side, height: side)
            .overlay {
                FathomMark()
                    .fill(.white)
                    .padding(side * 0.24)
            }
            .accessibilityHidden(true)
    }
}

/// Five rounded bars, tallest in the middle: a sounding line read as audio levels.
private struct FathomMark: Shape {
    func path(in rect: CGRect) -> Path {
        let heights: [CGFloat] = [0.35, 0.7, 1, 0.7, 0.35]
        let slot = rect.width / CGFloat(heights.count)
        let barWidth = slot * 0.55
        var path = Path()
        for (index, height) in heights.enumerated() {
            let barHeight = rect.height * height
            let bar = CGRect(
                x: rect.minX + slot * CGFloat(index) + (slot - barWidth) / 2,
                y: rect.midY - barHeight / 2,
                width: barWidth,
                height: barHeight
            )
            path.addRoundedRect(in: bar, cornerSize: CGSize(width: barWidth / 2, height: barWidth / 2))
        }
        return path
    }
}

// MARK: - Acknowledgements

private struct AcknowledgementsScreen: View {
    var body: some View {
        List {
            Section {
                ForEach(Acknowledgement.samples) { item in
                    LabeledContent(item.name, value: item.license)
                }
            } footer: {
                Text("Fathom is built with the help of these open-source projects.")
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle("Acknowledgements")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Previews

#Preview("Settings") {
    FathomSettingsScreen()
}

#Preview("Dark, Larger Text") {
    FathomSettingsScreen()
        .preferredColorScheme(.dark)
        .dynamicTypeSize(.accessibility2)
}
#endif
