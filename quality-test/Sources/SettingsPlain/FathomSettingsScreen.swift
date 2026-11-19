// Fathom — Settings. Apple design rules and platform conventions applied:
// 1. Grouped Form in a NavigationStack with a large title; system bars and materials are left untouched.
// 2. Related settings are grouped into titled sections; footers explain consequences instead of row subtitles.
// 3. Switches for on/off values that apply immediately (no Save button); labels name the "on" state.
// 4. Menu pickers for short option lists; pushes with a system chevron for longer or richer choices.
// 5. Rows that only act (sheet, App Store, Mail) are tinted buttons and links; rows that navigate are not.
// 6. Every row is a Label with an SF Symbol on a system-color tile; current values sit trailing in secondary.
// 7. Text styles only (Dynamic Type), @ScaledMetric for tiles, LabeledContent so values wrap at large sizes.
// 8. Semantic system colors only, so light, dark and Increase Contrast work; the app accent is inherited.
// 9. Destructive actions use the destructive role and ask for confirmation; delete also works by swipe/Edit.
// 10. Decorative glyphs are hidden from VoiceOver; composite rows are combined into one element.
// 11. Subscription management uses StoreKit's system sheet; rating deep-links to the App Store review page.

#if os(iOS)
import SwiftUI
import StoreKit

// MARK: - Model and sample data

private enum AppTheme: String, CaseIterable, Identifiable {
    case system, light, dark

    var id: Self { self }

    var title: LocalizedStringKey {
        switch self {
        case .system: return "System"
        case .light: return "Light"
        case .dark: return "Dark"
        }
    }

    var colorScheme: ColorScheme? {
        switch self {
        case .system: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }
}

private enum AppIconOption: String, CaseIterable, Identifiable {
    case deepSea, lagoon, sunrise, graphite

    var id: Self { self }

    var title: LocalizedStringKey {
        switch self {
        case .deepSea: return "Deep Sea"
        case .lagoon: return "Lagoon"
        case .sunrise: return "Sunrise"
        case .graphite: return "Graphite"
        }
    }

    var color: Color {
        switch self {
        case .deepSea: return .indigo
        case .lagoon: return .blue
        case .sunrise: return .orange
        case .graphite: return .gray
        }
    }
}

private enum SleepTimer: Int, CaseIterable, Identifiable {
    case off = 0
    case fiveMinutes = 5
    case fifteenMinutes = 15
    case thirtyMinutes = 30
    case fortyFiveMinutes = 45
    case oneHour = 60
    case endOfEpisode = -1

    var id: Self { self }

    var title: String {
        switch self {
        case .off:
            return String(localized: "Off")
        case .endOfEpisode:
            return String(localized: "End of Episode")
        default:
            return Duration.seconds(rawValue * 60)
                .formatted(.units(allowed: [.hours, .minutes], width: .wide))
        }
    }
}

private struct DownloadedShow: Identifiable {
    let id = UUID()
    let title: String
    let episodeCount: Int
    let bytes: Int64
    let color: Color

    static let samples: [DownloadedShow] = [
        DownloadedShow(title: "The Long Signal", episodeCount: 14, bytes: 986_000_000, color: .indigo),
        DownloadedShow(title: "Field Notes Daily", episodeCount: 9, bytes: 612_000_000, color: .orange),
        DownloadedShow(title: "Second Draft", episodeCount: 6, bytes: 447_000_000, color: .pink),
        DownloadedShow(title: "Low Tide Radio", episodeCount: 4, bytes: 301_000_000, color: .blue),
        DownloadedShow(title: "Small Hours", episodeCount: 2, bytes: 118_000_000, color: .gray)
    ]
}

private struct Acknowledgement: Identifiable {
    let id = UUID()
    let name: String
    let license: String

    static let samples: [Acknowledgement] = [
        Acknowledgement(name: "Brine Audio Kit", license: "MIT License"),
        Acknowledgement(name: "Kelp Feed Parser", license: "Apache License 2.0"),
        Acknowledgement(name: "Sounding Waveforms", license: "BSD 3-Clause License"),
        Acknowledgement(name: "Driftwood Cache", license: "MIT License")
    ]
}

private enum SampleAccount {
    static let name = "Maya Okafor"
    static let email = "maya.okafor@example.com"
    static let plan = "Fathom Plus"
    static let version = "2.4.1 (318)"
    static let reviewURL = URL(string: "https://apps.apple.com/app/id0000000000?action=write-review")!
    static let supportURL = URL(string: "mailto:support@fathom.example")!
}

// MARK: - Settings screen

struct FathomSettingsScreen: View {
    @AppStorage("playback.speed") private var playbackSpeed = 1.0
    @AppStorage("playback.skipForward") private var skipForward = 30
    @AppStorage("playback.skipBack") private var skipBack = 15
    @AppStorage("playback.continuousPlay") private var continuousPlay = true
    @AppStorage("playback.trimSilence") private var trimSilence = false
    @AppStorage("playback.sleepTimer") private var sleepTimer = SleepTimer.off

    @AppStorage("downloads.auto") private var autoDownload = true
    @AppStorage("downloads.cellular") private var downloadOverCellular = false
    @AppStorage("downloads.removePlayed") private var removePlayed = true

    @AppStorage("notifications.newEpisodes") private var notifyNewEpisodes = true
    @AppStorage("notifications.recommendations") private var notifyRecommendations = false

    @AppStorage("appearance.theme") private var theme = AppTheme.system
    @AppStorage("appearance.icon") private var appIcon = AppIconOption.deepSea

    @AppStorage("privacy.shareAnalytics") private var shareAnalytics = false

    @State private var downloads = DownloadedShow.samples
    @State private var isManagingSubscription = false

    private static let speeds: [Double] = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3]
    private static let skipIntervals: [Int] = [10, 15, 30, 45, 60]

    var body: some View {
        NavigationStack {
            Form {
                accountSection
                playbackSection
                downloadsSection
                notificationsSection
                appearanceSection
                privacySection
                aboutSection
            }
            .navigationTitle("Settings")
            .manageSubscriptionsSheet(isPresented: $isManagingSubscription)
        }
        .preferredColorScheme(theme.colorScheme)
    }

    // MARK: Sections

    private var accountSection: some View {
        Section {
            ProfileRow(name: SampleAccount.name, email: SampleAccount.email)

            Button {
                isManagingSubscription = true
            } label: {
                LabeledContent {
                    Text(SampleAccount.plan)
                        .foregroundStyle(Color.secondary)
                } label: {
                    SettingsLabel("Manage Subscription", systemImage: "creditcard", tint: .indigo)
                }
            }
        }
    }

    private var playbackSection: some View {
        Section {
            Picker(selection: $playbackSpeed) {
                ForEach(Self.speeds, id: \.self) { speed in
                    Text(Self.speedTitle(speed)).tag(speed)
                }
            } label: {
                SettingsLabel("Playback Speed", systemImage: "speedometer", tint: .orange)
            }

            Picker(selection: $skipForward) {
                ForEach(Self.skipIntervals, id: \.self) { seconds in
                    Text(Self.secondsTitle(seconds)).tag(seconds)
                }
            } label: {
                SettingsLabel(
                    "Skip Forward",
                    systemImage: Self.skipSymbol("goforward", seconds: skipForward),
                    tint: .blue
                )
            }

            Picker(selection: $skipBack) {
                ForEach(Self.skipIntervals, id: \.self) { seconds in
                    Text(Self.secondsTitle(seconds)).tag(seconds)
                }
            } label: {
                SettingsLabel(
                    "Skip Back",
                    systemImage: Self.skipSymbol("gobackward", seconds: skipBack),
                    tint: .blue
                )
            }

            Toggle(isOn: $continuousPlay) {
                SettingsLabel("Continuous Play", systemImage: "forward.end", tint: .green)
            }

            Toggle(isOn: $trimSilence) {
                SettingsLabel("Trim Silence", systemImage: "waveform", tint: .pink)
            }

            Picker(selection: $sleepTimer) {
                ForEach(SleepTimer.allCases) { timer in
                    Text(timer.title).tag(timer)
                }
            } label: {
                SettingsLabel("Default Sleep Timer", systemImage: "moon.zzz", tint: .indigo)
            }
        } header: {
            Text("Playback")
        } footer: {
            Text("Continuous Play starts the next episode in your queue. Trim Silence shortens long pauses without changing the pitch of voices.")
        }
    }

    private var downloadsSection: some View {
        Section {
            Toggle(isOn: $autoDownload) {
                SettingsLabel("Auto-Download New Episodes", systemImage: "arrow.down.circle", tint: .blue)
            }

            Toggle(isOn: $downloadOverCellular) {
                SettingsLabel(
                    "Download over Cellular",
                    systemImage: "antenna.radiowaves.left.and.right",
                    tint: .green
                )
            }

            Toggle(isOn: $removePlayed) {
                SettingsLabel("Remove Played Episodes", systemImage: "trash", tint: .red)
            }

            NavigationLink {
                StorageScreen(downloads: $downloads)
            } label: {
                LabeledContent {
                    Text(totalDownloadedBytes.formatted(.byteCount(style: .file)))
                } label: {
                    SettingsLabel("Storage Used", systemImage: "internaldrive", tint: .gray)
                }
            }
        } header: {
            Text("Downloads")
        } footer: {
            Text("Downloading over cellular may use your data plan. Played episodes are removed 24 hours after you finish them.")
        }
    }

    private var notificationsSection: some View {
        Section {
            Toggle(isOn: $notifyNewEpisodes) {
                SettingsLabel("New Episodes", systemImage: "bell.badge", tint: .red)
            }

            Toggle(isOn: $notifyRecommendations) {
                SettingsLabel("Recommendations", systemImage: "sparkles", tint: .purple)
            }
        } header: {
            Text("Notifications")
        } footer: {
            Text("Get notified when shows you follow publish, and when Fathom finds something you might like.")
        }
    }

    private var appearanceSection: some View {
        Section {
            Picker(selection: $theme) {
                ForEach(AppTheme.allCases) { theme in
                    Text(theme.title).tag(theme)
                }
            } label: {
                SettingsLabel("Theme", systemImage: "circle.lefthalf.filled", tint: .indigo)
            }

            NavigationLink {
                AppIconScreen(selection: $appIcon)
            } label: {
                LabeledContent {
                    Text(appIcon.title)
                } label: {
                    SettingsLabel("App Icon", systemImage: "apps.iphone", tint: .blue)
                }
            }
        } header: {
            Text("Appearance")
        }
    }

    private var privacySection: some View {
        Section {
            Toggle(isOn: $shareAnalytics) {
                SettingsLabel("Share Analytics", systemImage: "chart.bar", tint: .blue)
            }
        } header: {
            Text("Privacy")
        } footer: {
            Text("Help improve Fathom by sharing anonymous usage and crash data. Your listening history is never shared.")
        }
    }

    private var aboutSection: some View {
        Section {
            LabeledContent {
                Text(verbatim: SampleAccount.version)
                    .textSelection(.enabled)
            } label: {
                SettingsLabel("Version", systemImage: "info.circle", tint: .gray)
            }

            NavigationLink {
                AcknowledgementsScreen()
            } label: {
                SettingsLabel("Acknowledgements", systemImage: "doc.text", tint: .gray)
            }

            Link(destination: SampleAccount.reviewURL) {
                SettingsLabel("Rate Fathom", systemImage: "star", tint: .orange)
            }

            Link(destination: SampleAccount.supportURL) {
                SettingsLabel("Contact Support", systemImage: "envelope", tint: .green)
            }
        } header: {
            Text("About")
        }
    }

    // MARK: Helpers

    private var totalDownloadedBytes: Int64 {
        downloads.reduce(0) { $0 + $1.bytes }
    }

    private static func speedTitle(_ speed: Double) -> String {
        speed.formatted(.number.precision(.fractionLength(0...2))) + "×"
    }

    private static func secondsTitle(_ seconds: Int) -> String {
        Duration.seconds(seconds).formatted(.units(allowed: [.seconds], width: .wide))
    }

    /// Numbered skip symbols exist only for the offered intervals; fall back to the plain glyph otherwise.
    private static func skipSymbol(_ base: String, seconds: Int) -> String {
        skipIntervals.contains(seconds) ? "\(base).\(seconds)" : base
    }
}

// MARK: - Row building blocks

/// A standard list Label whose icon is an SF Symbol on a system-color tile.
private struct SettingsLabel: View {
    private let title: LocalizedStringKey
    private let systemImage: String
    private let tint: Color

    init(_ title: LocalizedStringKey, systemImage: String, tint: Color) {
        self.title = title
        self.systemImage = systemImage
        self.tint = tint
    }

    var body: some View {
        Label {
            Text(title)
        } icon: {
            GlyphTile(systemImage: systemImage, fill: tint)
        }
    }
}

/// A rounded tile with a white glyph. Scales with Dynamic Type and is decorative for VoiceOver.
private struct GlyphTile: View {
    private let systemImage: String
    private let fill: Color
    @ScaledMetric private var side: CGFloat

    init(systemImage: String, fill: Color, side: CGFloat = 30) {
        self.systemImage = systemImage
        self.fill = fill
        _side = ScaledMetric(wrappedValue: side, relativeTo: .body)
    }

    var body: some View {
        RoundedRectangle(cornerRadius: side * 0.23, style: .continuous)
            .fill(fill.gradient)
            .frame(width: side, height: side)
            .overlay {
                Image(systemName: systemImage)
                    .symbolVariant(.fill)
                    .font(.system(size: side * 0.52, weight: .medium))
                    .foregroundStyle(.white)
                    .contentTransition(.symbolEffect(.replace))
            }
            .accessibilityHidden(true)
    }
}

private struct ProfileRow: View {
    let name: String
    let email: String
    @ScaledMetric(relativeTo: .title3) private var avatarSide: CGFloat = 56

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: "person.crop.circle.fill")
                .resizable()
                .scaledToFit()
                .frame(width: avatarSide, height: avatarSide)
                .symbolRenderingMode(.hierarchical)
                .foregroundStyle(.secondary)
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(.title3)
                    .fontWeight(.semibold)
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
    @Binding var downloads: [DownloadedShow]
    @State private var isConfirmingRemoveAll = false

    private var totalBytes: Int64 {
        downloads.reduce(0) { $0 + $1.bytes }
    }

    var body: some View {
        List {
            if !downloads.isEmpty {
                Section {
                    LabeledContent("Downloaded Episodes", value: totalBytes.formatted(.byteCount(style: .file)))
                }

                Section {
                    ForEach(downloads) { show in
                        DownloadedShowRow(show: show)
                    }
                    .onDelete { offsets in
                        downloads.remove(atOffsets: offsets)
                    }
                } header: {
                    Text("Shows")
                } footer: {
                    Text("Removing downloads frees space on this iPhone. Episodes stay in your library and can be downloaded again.")
                }

                Section {
                    Button("Remove All Downloads", role: .destructive) {
                        isConfirmingRemoveAll = true
                    }
                    .confirmationDialog(
                        "Remove all downloaded episodes?",
                        isPresented: $isConfirmingRemoveAll,
                        titleVisibility: .visible
                    ) {
                        Button("Remove All Downloads", role: .destructive) {
                            withAnimation {
                                downloads.removeAll()
                            }
                        }
                    } message: {
                        Text("This frees \(totalBytes.formatted(.byteCount(style: .file))) on this iPhone.")
                    }
                }
            }
        }
        .overlay {
            if downloads.isEmpty {
                ContentUnavailableView(
                    "No Downloads",
                    systemImage: "arrow.down.circle",
                    description: Text("Episodes you download appear here.")
                )
            }
        }
        .navigationTitle("Storage")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                EditButton()
                    .disabled(downloads.isEmpty)
            }
        }
    }
}

private struct DownloadedShowRow: View {
    let show: DownloadedShow

    var body: some View {
        HStack(spacing: 12) {
            GlyphTile(systemImage: "waveform", fill: show.color, side: 44)

            VStack(alignment: .leading, spacing: 2) {
                Text(show.title)
                Text("^[\(show.episodeCount) episode](inflect: true)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer(minLength: 8)

            Text(show.bytes.formatted(.byteCount(style: .file)))
                .foregroundStyle(.secondary)
        }
        .accessibilityElement(children: .combine)
    }
}

// MARK: - App icon

private struct AppIconScreen: View {
    @Binding var selection: AppIconOption

    var body: some View {
        Form {
            Section {
                // A shipping app also calls UIApplication.shared.setAlternateIconName(_:) when this changes.
                Picker("App Icon", selection: $selection) {
                    ForEach(AppIconOption.allCases) { option in
                        HStack(spacing: 16) {
                            GlyphTile(systemImage: "waveform", fill: option.color, side: 52)
                            Text(option.title)
                        }
                        .padding(.vertical, 4)
                        .tag(option)
                    }
                }
                .pickerStyle(.inline)
                .labelsHidden()
            } footer: {
                Text("The icon you choose appears on your Home Screen and in the App Library.")
            }
        }
        .navigationTitle("App Icon")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Acknowledgements

private struct AcknowledgementsScreen: View {
    var body: some View {
        List {
            Section {
                ForEach(Acknowledgement.samples) { item in
                    VStack(alignment: .leading, spacing: 2) {
                        Text(item.name)
                        Text(item.license)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .accessibilityElement(children: .combine)
                }
            } footer: {
                Text("Fathom is made possible by these open-source projects and the people who maintain them.")
            }
        }
        .navigationTitle("Acknowledgements")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Previews

#Preview("Settings") {
    FathomSettingsScreen()
}

#Preview("Storage") {
    NavigationStack {
        StorageScreen(downloads: .constant(DownloadedShow.samples))
    }
}

#endif
