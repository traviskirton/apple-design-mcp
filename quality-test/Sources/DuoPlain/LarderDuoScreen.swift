// Larder: Recipes main screen for iPhone Duo (iOS 27.1). Rules and conventions applied:
// 1. One adaptive hierarchy for every display and posture, driven by size class and measured width, never device checks.
// 2. Closed (compact width): tab bar plus a list that pushes the recipe. Open (regular width): list beside detail.
// 3. Nothing essential straddles the centre fold: the split divider and every two-page gutter sit at mid-width.
// 4. Continuity: tab, selection, search and sheets live above the layout, so fold, unfold and rotate keep context.
// 5. Standard components (TabView, NavigationSplitView, toolbars, swipe actions, context menus, ShareLink, sheets)
//    so the system supplies materials, placement and safe areas on each display.
// 6. One prominent primary action (Start Cooking); frequent actions in the toolbar; the rest in a More menu.
// 7. Delete is destructive, confirmed, and never the default; every action is also reachable from the list row.
// 8. Dynamic Type text styles, layouts that restack at accessibility sizes, 44 pt targets, VoiceOver labels.
// 9. Semantic system colors and SF Symbols only, so light, dark and increased contrast all work.
// 10. No hinge or posture API is called: none is assumed to exist, so layout is inferred from available space only.

#if os(iOS)
import SwiftUI
import UIKit

// MARK: - Model

struct Ingredient: Identifiable, Hashable {
    let id = UUID()
    var name: String
    var quantity: String
}

struct Recipe: Identifiable, Hashable {
    let id = UUID()
    var title: String
    var summary: String
    var minutes: Int
    var servings: Int
    var symbol: String
    var tint: Color
    var isFavorite: Bool = false
    var ingredients: [Ingredient]
    var steps: [String]

    var shareText: String {
        var lines = [title, summary, "", "Ingredients"]
        lines += ingredients.map { "- \($0.quantity) \($0.name)" }
        lines += ["", "Steps"]
        lines += steps.enumerated().map { "\($0.offset + 1). \($0.element)" }
        return lines.joined(separator: "\n")
    }

    static let samples: [Recipe] = [
        Recipe(
            title: "Lemon Herb Risotto",
            summary: "Creamy arborio rice finished with lemon zest and soft herbs.",
            minutes: 40, servings: 4, symbol: "leaf", tint: .green, isFavorite: true,
            ingredients: [
                Ingredient(name: "Arborio rice", quantity: "300 g"),
                Ingredient(name: "Vegetable stock", quantity: "1 l"),
                Ingredient(name: "Shallots", quantity: "2"),
                Ingredient(name: "Dry white wine", quantity: "120 ml"),
                Ingredient(name: "Lemon", quantity: "1"),
                Ingredient(name: "Parmesan", quantity: "50 g"),
                Ingredient(name: "Parsley and chives", quantity: "1 handful")
            ],
            steps: [
                "Warm the stock in a saucepan and keep it at a gentle simmer.",
                "Soften the chopped shallots in olive oil over medium heat for 4 minutes.",
                "Add the rice and stir for 2 minutes until the edges turn translucent.",
                "Pour in the wine and stir until it has been absorbed.",
                "Add the stock a ladle at a time, stirring, until the rice is tender, about 20 minutes.",
                "Stir in the parmesan, lemon zest, lemon juice and herbs. Rest for 2 minutes, then serve."
            ]
        ),
        Recipe(
            title: "Smoky Chili",
            summary: "A slow-simmered bean chili with chipotle and dark chocolate.",
            minutes: 75, servings: 6, symbol: "flame", tint: .red,
            ingredients: [
                Ingredient(name: "Kidney beans", quantity: "2 cans"),
                Ingredient(name: "Chopped tomatoes", quantity: "2 cans"),
                Ingredient(name: "Onion", quantity: "1 large"),
                Ingredient(name: "Chipotle paste", quantity: "2 tbsp"),
                Ingredient(name: "Ground cumin", quantity: "2 tsp"),
                Ingredient(name: "Dark chocolate", quantity: "20 g")
            ],
            steps: [
                "Cook the diced onion in oil until golden, about 8 minutes.",
                "Stir in the cumin and chipotle paste and cook for 1 minute.",
                "Add the tomatoes and drained beans, then simmer on low heat for 50 minutes.",
                "Melt in the chocolate, season to taste and serve."
            ]
        ),
        Recipe(
            title: "Miso Glazed Salmon",
            summary: "Broiled salmon with a sweet and salty miso glaze.",
            minutes: 25, servings: 2, symbol: "fish", tint: .orange, isFavorite: true,
            ingredients: [
                Ingredient(name: "Salmon fillets", quantity: "2"),
                Ingredient(name: "White miso", quantity: "2 tbsp"),
                Ingredient(name: "Mirin", quantity: "1 tbsp"),
                Ingredient(name: "Soy sauce", quantity: "1 tbsp"),
                Ingredient(name: "Sesame seeds", quantity: "1 tsp")
            ],
            steps: [
                "Whisk the miso, mirin and soy sauce into a smooth glaze.",
                "Coat the salmon and leave it to marinate for 10 minutes.",
                "Broil on high for 8 to 10 minutes until the glaze caramelizes.",
                "Scatter with sesame seeds and serve with rice."
            ]
        ),
        Recipe(
            title: "Olive Oil Cake",
            summary: "A tender citrus cake that keeps well for days.",
            minutes: 60, servings: 8, symbol: "birthday.cake", tint: .pink,
            ingredients: [
                Ingredient(name: "Plain flour", quantity: "250 g"),
                Ingredient(name: "Sugar", quantity: "200 g"),
                Ingredient(name: "Eggs", quantity: "3"),
                Ingredient(name: "Olive oil", quantity: "180 ml"),
                Ingredient(name: "Orange", quantity: "1"),
                Ingredient(name: "Baking powder", quantity: "2 tsp")
            ],
            steps: [
                "Heat the oven to 175 °C and line a 23 cm cake pan.",
                "Whisk the eggs and sugar until pale and thick, about 3 minutes.",
                "Slowly whisk in the olive oil, orange zest and orange juice.",
                "Fold in the flour and baking powder until just combined.",
                "Bake for 40 to 45 minutes, then cool in the pan before slicing."
            ]
        ),
        Recipe(
            title: "Spiced Chai",
            summary: "Black tea simmered with fresh ginger and whole spices.",
            minutes: 15, servings: 2, symbol: "cup.and.saucer", tint: .brown,
            ingredients: [
                Ingredient(name: "Black tea", quantity: "2 tsp"),
                Ingredient(name: "Milk", quantity: "250 ml"),
                Ingredient(name: "Fresh ginger", quantity: "3 slices"),
                Ingredient(name: "Cardamom pods", quantity: "4"),
                Ingredient(name: "Cinnamon stick", quantity: "1")
            ],
            steps: [
                "Simmer the spices and ginger in 250 ml of water for 5 minutes.",
                "Add the tea and simmer for 2 more minutes.",
                "Pour in the milk, bring back to a simmer, then strain into cups."
            ]
        )
    ]
}

@Observable
final class LarderStore {
    var recipes: [Recipe] = Recipe.samples
    var shoppingList: [Ingredient] = []
    var recipesInShoppingList: Set<Recipe.ID> = []

    func recipe(withID id: Recipe.ID?) -> Recipe? {
        guard let id else { return nil }
        return recipes.first { $0.id == id }
    }

    func toggleFavorite(_ id: Recipe.ID) {
        guard let index = recipes.firstIndex(where: { $0.id == id }) else { return }
        recipes[index].isFavorite.toggle()
    }

    func addIngredientsToShoppingList(from id: Recipe.ID) {
        guard let recipe = recipe(withID: id), !recipesInShoppingList.contains(id) else { return }
        shoppingList.append(contentsOf: recipe.ingredients)
        recipesInShoppingList.insert(id)
    }

    func update(_ recipe: Recipe) {
        guard let index = recipes.firstIndex(where: { $0.id == recipe.id }) else { return }
        recipes[index] = recipe
    }

    func delete(_ id: Recipe.ID) {
        recipes.removeAll { $0.id == id }
        recipesInShoppingList.remove(id)
    }
}

// MARK: - Layout constants

private enum LarderLayout {
    /// A pane at least this wide is split into two equal pages with the gutter on its centre line.
    static let twoPageMinimumWidth: CGFloat = 640
    /// Space left empty along the centre line so no text or control sits on the fold.
    static let foldGutter: CGFloat = 40
    /// Longest comfortable line length for a single column.
    static let readableWidth: CGFloat = 640
}

// MARK: - Top level

private enum LarderTab: Hashable {
    case recipes, mealPlan, shoppingList, settings
}

struct LarderDuoScreen: View {
    @State private var store = LarderStore()
    @State private var selectedTab: LarderTab = .recipes

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Recipes", systemImage: "book.closed", value: LarderTab.recipes) {
                RecipesDestination(store: store)
            }
            Tab("Meal Plan", systemImage: "calendar", value: LarderTab.mealPlan) {
                PlaceholderDestination(
                    title: "Meal Plan",
                    systemImage: "calendar",
                    message: "Plan your week of meals here."
                )
            }
            Tab("Shopping List", systemImage: "cart", value: LarderTab.shoppingList) {
                PlaceholderDestination(
                    title: "Shopping List",
                    systemImage: "cart",
                    message: store.shoppingList.isEmpty
                        ? "Ingredients you add from recipes appear here."
                        : "\(store.shoppingList.count) ingredients added from recipes."
                )
            }
            .badge(store.shoppingList.count)
            Tab("Settings", systemImage: "gearshape", value: LarderTab.settings) {
                PlaceholderDestination(
                    title: "Settings",
                    systemImage: "gearshape",
                    message: "Units, dietary preferences and accounts go here."
                )
            }
        }
        // Gives the short outer display more room for the recipe while reading.
        .tabBarMinimizeBehavior(.onScrollDown)
    }
}

private struct PlaceholderDestination: View {
    let title: String
    let systemImage: String
    let message: String

    var body: some View {
        NavigationStack {
            ContentUnavailableView(title, systemImage: systemImage, description: Text(message))
                .navigationTitle(title)
        }
    }
}

// MARK: - Recipes destination

private struct RecipeActions {
    var toggleFavorite: (Recipe) -> Void
    var startCooking: (Recipe) -> Void
    var addToShoppingList: (Recipe) -> Void
    var edit: (Recipe) -> Void
    var delete: (Recipe) -> Void
}

private struct RecipesDestination: View {
    let store: LarderStore

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @State private var selection: Recipe.ID?
    @State private var searchText = ""
    @State private var containerWidth: CGFloat = 0
    @State private var recipeBeingEdited: Recipe?
    @State private var recipeBeingCooked: Recipe?
    @State private var recipePendingDeletion: Recipe?
    @State private var shoppingListFeedback = 0

    private var visibleRecipes: [Recipe] {
        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !query.isEmpty else { return store.recipes }
        return store.recipes.filter { $0.title.localizedCaseInsensitiveContains(query) }
    }

    /// Half of the open display, so the list is the left page and the recipe is the right page.
    private var listColumnWidth: CGFloat {
        min(max(containerWidth / 2, 280), 440)
    }

    private var actions: RecipeActions {
        RecipeActions(
            toggleFavorite: { recipe in store.toggleFavorite(recipe.id) },
            startCooking: { recipe in recipeBeingCooked = recipe },
            addToShoppingList: { recipe in
                store.addIngredientsToShoppingList(from: recipe.id)
                shoppingListFeedback += 1
            },
            edit: { recipe in recipeBeingEdited = recipe },
            delete: { recipe in recipePendingDeletion = recipe }
        )
    }

    private var deletionDialogIsPresented: Binding<Bool> {
        Binding(
            get: { recipePendingDeletion != nil },
            set: { isPresented in
                if !isPresented { recipePendingDeletion = nil }
            }
        )
    }

    var body: some View {
        NavigationSplitView {
            RecipeListColumn(
                recipes: visibleRecipes,
                selection: $selection,
                searchText: $searchText,
                actions: actions
            )
            .navigationSplitViewColumnWidth(min: 280, ideal: listColumnWidth, max: listColumnWidth)
        } detail: {
            if let recipe = store.recipe(withID: selection) {
                RecipeDetailView(
                    recipe: recipe,
                    isInShoppingList: store.recipesInShoppingList.contains(recipe.id),
                    actions: actions
                )
                .id(recipe.id)
            } else {
                ContentUnavailableView(
                    "Select a Recipe",
                    systemImage: "fork.knife",
                    description: Text("Choose a recipe from the list to see its ingredients and steps.")
                )
            }
        }
        .navigationSplitViewStyle(.balanced)
        .onGeometryChange(for: CGFloat.self) { proxy in
            proxy.size.width
        } action: { newWidth in
            containerWidth = newWidth
        }
        // Opening the device should never reveal an empty right-hand page.
        .onChange(of: horizontalSizeClass, initial: true) { _, sizeClass in
            if sizeClass == .regular, selection == nil {
                selection = store.recipes.first?.id
            }
        }
        .sheet(item: $recipeBeingEdited) { recipe in
            RecipeEditSheet(recipe: recipe) { edited in
                store.update(edited)
            }
        }
        .fullScreenCover(item: $recipeBeingCooked) { recipe in
            CookingModeView(recipe: recipe)
        }
        .confirmationDialog(
            "Delete Recipe?",
            isPresented: deletionDialogIsPresented,
            titleVisibility: .visible,
            presenting: recipePendingDeletion
        ) { recipe in
            Button("Delete “\(recipe.title)”", role: .destructive) {
                delete(recipe)
            }
        } message: { recipe in
            Text("“\(recipe.title)” will be removed from Larder. This can’t be undone.")
        }
        .sensoryFeedback(.success, trigger: shoppingListFeedback)
    }

    private func delete(_ recipe: Recipe) {
        withAnimation {
            store.delete(recipe.id)
        }
        if selection == recipe.id {
            selection = horizontalSizeClass == .regular ? store.recipes.first?.id : nil
        }
    }
}

// MARK: - Recipe list

private struct RecipeListColumn: View {
    let recipes: [Recipe]
    @Binding var selection: Recipe.ID?
    @Binding var searchText: String
    let actions: RecipeActions

    var body: some View {
        List(recipes, selection: $selection) { recipe in
            RecipeRow(recipe: recipe)
                .swipeActions(edge: .leading) {
                    Button {
                        actions.toggleFavorite(recipe)
                    } label: {
                        Label(
                            recipe.isFavorite ? "Unfavorite" : "Favorite",
                            systemImage: recipe.isFavorite ? "star.slash" : "star"
                        )
                    }
                    .tint(.yellow)
                }
                .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                    // Not given the destructive role: the row must stay until the confirmation is accepted.
                    Button {
                        actions.delete(recipe)
                    } label: {
                        Label("Delete", systemImage: "trash")
                    }
                    .tint(.red)
                    Button {
                        actions.edit(recipe)
                    } label: {
                        Label("Edit", systemImage: "pencil")
                    }
                }
                .contextMenu {
                    RecipeMenuItems(recipe: recipe, actions: actions, includesPrimaryActions: true)
                }
        }
        .overlay {
            if recipes.isEmpty {
                ContentUnavailableView.search(text: searchText)
            }
        }
        .navigationTitle("Recipes")
        .searchable(text: $searchText, prompt: "Search recipes")
    }
}

private struct RecipeRow: View {
    let recipe: Recipe

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: recipe.symbol)
                .font(.title3)
                .foregroundStyle(.white)
                .frame(width: 44, height: 44)
                .background(recipe.tint.gradient, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 2) {
                Text(recipe.title)
                    .font(.headline)
                Text("\(recipe.minutes) min · Serves \(recipe.servings)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer(minLength: 8)

            if recipe.isFavorite {
                Image(systemName: "star.fill")
                    .foregroundStyle(.yellow)
                    .accessibilityLabel("Favorite")
            }
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
    }
}

/// Shared by the row context menu and the detail More menu so both offer the same commands in the same order.
private struct RecipeMenuItems: View {
    let recipe: Recipe
    let actions: RecipeActions
    let includesPrimaryActions: Bool

    var body: some View {
        if includesPrimaryActions {
            Button {
                actions.startCooking(recipe)
            } label: {
                Label("Start Cooking", systemImage: "play.fill")
            }
            Button {
                actions.toggleFavorite(recipe)
            } label: {
                Label(
                    recipe.isFavorite ? "Remove from Favorites" : "Add to Favorites",
                    systemImage: recipe.isFavorite ? "star.slash" : "star"
                )
            }
            ShareLink(item: recipe.shareText, subject: Text(recipe.title)) {
                Label("Share", systemImage: "square.and.arrow.up")
            }
        }
        Button {
            actions.addToShoppingList(recipe)
        } label: {
            Label("Add Ingredients to Shopping List", systemImage: "cart.badge.plus")
        }
        Button {
            actions.edit(recipe)
        } label: {
            Label("Edit", systemImage: "pencil")
        }
        Divider()
        Button(role: .destructive) {
            actions.delete(recipe)
        } label: {
            Label("Delete", systemImage: "trash")
        }
    }
}

// MARK: - Recipe detail

private struct RecipeDetailView: View {
    let recipe: Recipe
    let isInShoppingList: Bool
    let actions: RecipeActions

    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @State private var paneWidth: CGFloat = 0

    /// Two equal pages (overview and ingredients | steps) once the pane is wide enough,
    /// which is the case when the list is hidden on the open display.
    private var usesTwoPages: Bool {
        paneWidth >= LarderLayout.twoPageMinimumWidth && !dynamicTypeSize.isAccessibilitySize
    }

    var body: some View {
        ScrollView {
            Group {
                if usesTwoPages {
                    HStack(alignment: .top, spacing: LarderLayout.foldGutter) {
                        VStack(alignment: .leading, spacing: 24) {
                            overview
                            IngredientsSection(ingredients: recipe.ingredients)
                        }
                        .frame(maxWidth: .infinity, alignment: .topLeading)

                        StepsSection(steps: recipe.steps)
                            .frame(maxWidth: .infinity, alignment: .topLeading)
                    }
                } else {
                    VStack(alignment: .leading, spacing: 24) {
                        overview
                        IngredientsSection(ingredients: recipe.ingredients)
                        StepsSection(steps: recipe.steps)
                    }
                    .frame(maxWidth: LarderLayout.readableWidth)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding()
        }
        .onGeometryChange(for: CGFloat.self) { proxy in
            proxy.size.width
        } action: { newWidth in
            paneWidth = newWidth
        }
        .navigationTitle(recipe.title)
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    actions.toggleFavorite(recipe)
                } label: {
                    Label(
                        recipe.isFavorite ? "Remove from Favorites" : "Add to Favorites",
                        systemImage: recipe.isFavorite ? "star.fill" : "star"
                    )
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                ShareLink(item: recipe.shareText, subject: Text(recipe.title)) {
                    Label("Share", systemImage: "square.and.arrow.up")
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    RecipeMenuItems(recipe: recipe, actions: actions, includesPrimaryActions: false)
                } label: {
                    Label("More", systemImage: "ellipsis")
                }
            }
        }
    }

    private var overview: some View {
        VStack(alignment: .leading, spacing: 16) {
            PhotoPlaceholder(recipe: recipe)

            Text(recipe.summary)
                .font(.body)
                .foregroundStyle(.secondary)

            ViewThatFits(in: .horizontal) {
                HStack(spacing: 16) {
                    facts
                }
                VStack(alignment: .leading, spacing: 8) {
                    facts
                }
            }
            .font(.subheadline)

            ViewThatFits(in: .horizontal) {
                HStack(spacing: 12) {
                    actionButtons
                }
                VStack(spacing: 12) {
                    actionButtons
                }
            }
        }
    }

    @ViewBuilder
    private var facts: some View {
        Label("\(recipe.minutes) minutes", systemImage: "timer")
        Label("Serves \(recipe.servings)", systemImage: "person.2")
        Label("\(recipe.ingredients.count) ingredients", systemImage: "basket")
    }

    @ViewBuilder
    private var actionButtons: some View {
        Button {
            actions.startCooking(recipe)
        } label: {
            Label("Start Cooking", systemImage: "play.fill")
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .controlSize(.large)

        Button {
            actions.addToShoppingList(recipe)
        } label: {
            Label(
                isInShoppingList ? "In Shopping List" : "Add to Shopping List",
                systemImage: isInShoppingList ? "checkmark" : "cart.badge.plus"
            )
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.bordered)
        .controlSize(.large)
        .disabled(isInShoppingList)
    }
}

private struct PhotoPlaceholder: View {
    let recipe: Recipe

    var body: some View {
        RoundedRectangle(cornerRadius: 24, style: .continuous)
            .fill(recipe.tint.gradient)
            .aspectRatio(16.0 / 9.0, contentMode: .fit)
            .overlay {
                Image(systemName: recipe.symbol)
                    .font(.system(size: 64))
                    .foregroundStyle(.white.opacity(0.9))
            }
            .accessibilityElement()
            .accessibilityLabel("Photo placeholder for \(recipe.title)")
            .accessibilityAddTraits(.isImage)
    }
}

private struct IngredientsSection: View {
    let ingredients: [Ingredient]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Ingredients")
                .font(.title2.bold())
                .accessibilityAddTraits(.isHeader)

            VStack(spacing: 0) {
                ForEach(ingredients) { ingredient in
                    LabeledContent(ingredient.name, value: ingredient.quantity)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .frame(minHeight: 44)
                    if ingredient.id != ingredients.last?.id {
                        Divider()
                            .padding(.leading, 16)
                    }
                }
            }
            .background(
                Color(uiColor: .secondarySystemBackground),
                in: RoundedRectangle(cornerRadius: 16, style: .continuous)
            )
        }
    }
}

private struct StepsSection: View {
    let steps: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Steps")
                .font(.title2.bold())
                .accessibilityAddTraits(.isHeader)

            ForEach(Array(steps.enumerated()), id: \.offset) { item in
                HStack(alignment: .firstTextBaseline, spacing: 12) {
                    Text("\(item.offset + 1)")
                        .font(.title3.bold())
                        .monospacedDigit()
                        .foregroundStyle(.secondary)
                        .frame(minWidth: 24, alignment: .leading)
                    Text(item.element)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("Step \(item.offset + 1). \(item.element)")
            }
        }
    }
}

// MARK: - Cooking mode

private struct CookingModeView: View {
    let recipe: Recipe

    @Environment(\.dismiss) private var dismiss
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @State private var stepIndex = 0
    @State private var paneWidth: CGFloat = 0

    private var usesTwoPages: Bool {
        paneWidth >= LarderLayout.twoPageMinimumWidth && !dynamicTypeSize.isAccessibilitySize
    }

    private var isLastStep: Bool {
        stepIndex >= recipe.steps.count - 1
    }

    var body: some View {
        NavigationStack {
            Group {
                if usesTwoPages {
                    // Ingredients on one page, the current step on the other; the gutter stays on the fold.
                    HStack(alignment: .top, spacing: LarderLayout.foldGutter) {
                        ScrollView {
                            IngredientsSection(ingredients: recipe.ingredients)
                                .padding(.vertical)
                        }
                        .frame(maxWidth: .infinity)

                        stepPage
                            .frame(maxWidth: .infinity)
                    }
                } else {
                    stepPage
                }
            }
            .padding(.horizontal)
            .safeAreaInset(edge: .bottom) {
                stepControls
            }
            .navigationTitle(recipe.title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close", systemImage: "xmark") {
                        dismiss()
                    }
                }
            }
        }
        .onGeometryChange(for: CGFloat.self) { proxy in
            proxy.size.width
        } action: { newWidth in
            paneWidth = newWidth
        }
        // Hands are busy while cooking, so keep the display awake for this mode only.
        .onAppear { UIApplication.shared.isIdleTimerDisabled = true }
        .onDisappear { UIApplication.shared.isIdleTimerDisabled = false }
    }

    private var stepPage: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                if recipe.steps.indices.contains(stepIndex) {
                    ProgressView(value: Double(stepIndex + 1), total: Double(recipe.steps.count))
                        .accessibilityHidden(true)
                    Text("Step \(stepIndex + 1) of \(recipe.steps.count)")
                        .font(.headline)
                        .foregroundStyle(.secondary)
                    Text(recipe.steps[stepIndex])
                        .font(.title)
                } else {
                    Text("This recipe has no steps yet.")
                        .font(.title3)
                        .foregroundStyle(.secondary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.vertical)
        }
    }

    /// Two equal buttons, one per half, so each is under a thumb when the open device is held in two hands.
    private var stepControls: some View {
        HStack(spacing: LarderLayout.foldGutter) {
            Button {
                withAnimation { stepIndex -= 1 }
            } label: {
                Label("Previous", systemImage: "chevron.left")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            .disabled(stepIndex == 0)

            Button {
                if isLastStep {
                    dismiss()
                } else {
                    withAnimation { stepIndex += 1 }
                }
            } label: {
                Label(isLastStep ? "Finish" : "Next", systemImage: isLastStep ? "checkmark" : "chevron.right")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
        }
        .controlSize(.large)
        .padding()
        .background(.bar)
    }
}

// MARK: - Edit sheet

private struct RecipeEditSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var draft: Recipe
    private let onSave: (Recipe) -> Void

    init(recipe: Recipe, onSave: @escaping (Recipe) -> Void) {
        _draft = State(initialValue: recipe)
        self.onSave = onSave
    }

    private var canSave: Bool {
        !draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Details") {
                    TextField("Title", text: $draft.title)
                    TextField("Summary", text: $draft.summary, axis: .vertical)
                    Stepper("Serves \(draft.servings)", value: $draft.servings, in: 1...24)
                    Stepper("\(draft.minutes) minutes", value: $draft.minutes, in: 5...480, step: 5)
                }
                Section("Ingredients") {
                    ForEach($draft.ingredients) { $ingredient in
                        HStack {
                            TextField("Ingredient", text: $ingredient.name)
                            TextField("Amount", text: $ingredient.quantity)
                                .multilineTextAlignment(.trailing)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                Section("Steps") {
                    ForEach(draft.steps.indices, id: \.self) { index in
                        TextField("Step \(index + 1)", text: $draft.steps[index], axis: .vertical)
                    }
                }
            }
            .navigationTitle("Edit Recipe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        onSave(draft)
                        dismiss()
                    }
                    .disabled(!canSave)
                }
            }
        }
    }
}

// MARK: - Previews

#Preview("Larder") {
    LarderDuoScreen()
}

#Preview("Larder, landscape", traits: .landscapeLeft) {
    LarderDuoScreen()
}

#endif
