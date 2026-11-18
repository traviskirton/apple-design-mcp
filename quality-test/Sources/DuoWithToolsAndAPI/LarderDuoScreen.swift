// Larder for iPhone Duo. Rules applied (HIG: Designing for iPhone Duo, Layout, Toolbars, Tab bars, Split views):
// 1. Standard TabView + NavigationSplitView + toolbar(content:), so the system moves bars to the side on the outer
//    display and in inner landscape and keeps them horizontal in inner portrait. No bar placement is overridden.
// 2. Same hierarchy and state on both displays: list OR recipe when closed (compact), list AND recipe when open.
// 3. Layout comes from size classes, safe areas, margins and container size; no idiom, orientation or screen checks.
// 4. Book pose: the split view adapts to the fold by itself. If the recipe pane spans the fold, ReservedRegion
//    (.division) puts ingredients and method on either side of it; the same spread is used flat, so nothing jumps.
// 5. Every toolbar item has a title and a symbol, related items are grouped, and Back/Close come before actions.
// 6. visibilityPriority keeps Start Cooking, Favorite and New Recipe visible longest. Edit and Delete go in the
//    system ToolbarOverflowMenu (no custom ellipsis menu), and the Filter menu has its own symbol.
// 7. Cooking mode keeps navigation outside an ArrangementView (.split): step and ingredients sit beside the fold.
// 8. Hero extends under side bars (backgroundExtensionEffect), delete is confirmed, Dynamic Type and VoiceOver work.
#if os(iOS)
import SwiftUI

// MARK: - Model

private struct LarderIngredient: Identifiable, Hashable {
    var id = UUID()
    var name: String
    var amount: String
}

private struct LarderStep: Identifiable, Hashable {
    var id = UUID()
    var text: String
}

private struct LarderRecipe: Identifiable, Hashable {
    var id = UUID()
    var name: String
    var summary: String
    var minutes: Int
    var servings: Int
    var symbol: String
    var tint: Color
    var isFavorite = false
    var ingredients: [LarderIngredient]
    var steps: [LarderStep]

    var shareText: String {
        let ingredientLines = ingredients.map { "• \($0.amount) \($0.name)" }
        let stepLines = steps.enumerated().map { "\($0.offset + 1). \($0.element.text)" }
        let lines = [name, summary, "", "Ingredients"] + ingredientLines + ["", "Method"] + stepLines
        return lines.joined(separator: "\n")
    }

    static var blank: LarderRecipe {
        LarderRecipe(
            name: "", summary: "", minutes: 30, servings: 2, symbol: "fork.knife", tint: .orange,
            ingredients: [LarderIngredient(name: "", amount: "")],
            steps: [LarderStep(text: "")]
        )
    }
}

private extension LarderRecipe {
    init(
        _ name: String, summary: String, minutes: Int, servings: Int, symbol: String, tint: Color,
        favorite: Bool = false, ingredients: [(String, String)], steps: [String]
    ) {
        self.init(
            name: name, summary: summary, minutes: minutes, servings: servings, symbol: symbol, tint: tint,
            isFavorite: favorite,
            ingredients: ingredients.map { LarderIngredient(name: $0.0, amount: $0.1) },
            steps: steps.map { LarderStep(text: $0) }
        )
    }

    static let samples: [LarderRecipe] = [
        LarderRecipe(
            "Lemon Ricotta Pasta", summary: "Bright, creamy and ready before the water cools.",
            minutes: 25, servings: 4, symbol: "fork.knife", tint: .yellow, favorite: true,
            ingredients: [
                ("Spaghetti", "400 g"), ("Ricotta", "250 g"), ("Lemon", "1"),
                ("Parmesan, grated", "40 g"), ("Olive oil", "2 tbsp"), ("Black pepper", "to taste"),
            ],
            steps: [
                "Boil the spaghetti in well-salted water until just tender. Keep a cup of the cooking water.",
                "Whisk the ricotta with the lemon zest, lemon juice, olive oil and half of the parmesan.",
                "Toss the drained pasta with the ricotta, loosening it with splashes of cooking water.",
                "Serve with the remaining parmesan and plenty of black pepper.",
            ]
        ),
        LarderRecipe(
            "Roasted Carrot Soup", summary: "Sweet roasted carrots blended with ginger.",
            minutes: 45, servings: 4, symbol: "carrot", tint: .orange,
            ingredients: [
                ("Carrots", "800 g"), ("Onion", "1"), ("Fresh ginger", "20 g"),
                ("Vegetable stock", "1 l"), ("Olive oil", "2 tbsp"), ("Yogurt", "4 tbsp"),
            ],
            steps: [
                "Heat the oven to 220°C. Roast the carrots and onion with the oil for 25 minutes.",
                "Simmer the roasted vegetables with the ginger and stock for 10 minutes.",
                "Blend until smooth and season to taste.",
                "Ladle into bowls and finish each one with a spoonful of yogurt.",
            ]
        ),
        LarderRecipe(
            "Miso Glazed Salmon", summary: "Sticky, savory fillets with a quick glaze.",
            minutes: 30, servings: 2, symbol: "fish", tint: .pink, favorite: true,
            ingredients: [
                ("Salmon fillets", "2"), ("White miso", "2 tbsp"), ("Honey", "1 tbsp"),
                ("Soy sauce", "1 tbsp"), ("Rice vinegar", "1 tsp"), ("Spring onions", "2"),
            ],
            steps: [
                "Stir the miso, honey, soy sauce and vinegar into a smooth glaze.",
                "Coat the salmon with the glaze and rest it for 10 minutes.",
                "Grill on high heat for 8 minutes until the edges caramelize.",
                "Scatter with sliced spring onions and serve with rice.",
            ]
        ),
        LarderRecipe(
            "Herb Garden Salad", summary: "A crisp bowl of soft herbs and leaves.",
            minutes: 15, servings: 2, symbol: "leaf", tint: .green,
            ingredients: [
                ("Mixed leaves", "150 g"), ("Parsley", "1 handful"), ("Mint", "1 handful"),
                ("Cucumber", "1"), ("Lemon juice", "1 tbsp"), ("Olive oil", "3 tbsp"),
            ],
            steps: [
                "Wash and dry the leaves and herbs.",
                "Slice the cucumber into thin half moons.",
                "Shake the lemon juice and oil with a pinch of salt.",
                "Toss everything together just before serving.",
            ]
        ),
        LarderRecipe(
            "Olive Oil Cake", summary: "A tender, citrus-scented cake that keeps for days.",
            minutes: 60, servings: 8, symbol: "birthday.cake", tint: .brown,
            ingredients: [
                ("Plain flour", "250 g"), ("Sugar", "200 g"), ("Eggs", "3"),
                ("Olive oil", "180 ml"), ("Milk", "120 ml"), ("Orange", "1"), ("Baking powder", "2 tsp"),
            ],
            steps: [
                "Heat the oven to 175°C and line a 23 cm round tin.",
                "Whisk the eggs and sugar until pale, then stream in the oil, milk and orange zest.",
                "Fold in the flour and baking powder until just combined.",
                "Bake for 40 minutes, until a skewer comes out clean.",
                "Cool in the tin for 15 minutes before turning out.",
            ]
        ),
    ]
}

@Observable
private final class LarderStore {
    var recipes: [LarderRecipe] = LarderRecipe.samples
    var shoppingRecipeIDs: Set<LarderRecipe.ID> = []

    var shoppingItemCount: Int {
        recipes
            .filter { shoppingRecipeIDs.contains($0.id) }
            .reduce(0) { $0 + $1.ingredients.count }
    }

    func recipe(_ id: LarderRecipe.ID?) -> LarderRecipe? {
        guard let id else { return nil }
        return recipes.first { $0.id == id }
    }

    func isOnShoppingList(_ recipe: LarderRecipe) -> Bool {
        shoppingRecipeIDs.contains(recipe.id)
    }

    func toggleFavorite(_ recipe: LarderRecipe) {
        guard let index = recipes.firstIndex(where: { $0.id == recipe.id }) else { return }
        recipes[index].isFavorite.toggle()
    }

    func toggleShoppingList(_ recipe: LarderRecipe) {
        if shoppingRecipeIDs.contains(recipe.id) {
            shoppingRecipeIDs.remove(recipe.id)
        } else {
            shoppingRecipeIDs.insert(recipe.id)
        }
    }

    func save(_ recipe: LarderRecipe) {
        if let index = recipes.firstIndex(where: { $0.id == recipe.id }) {
            recipes[index] = recipe
        } else {
            recipes.insert(recipe, at: 0)
        }
    }

    func delete(_ recipe: LarderRecipe) {
        recipes.removeAll { $0.id == recipe.id }
        shoppingRecipeIDs.remove(recipe.id)
    }
}

// MARK: - Root

private enum LarderDestination: Hashable {
    case recipes, mealPlan, shoppingList, settings
}

struct LarderDuoScreen: View {
    @State private var store = LarderStore()
    @State private var destination = LarderDestination.recipes

    var body: some View {
        // A standard tab view: the system decides whether the tab bar is horizontal or on the side.
        TabView(selection: $destination) {
            Tab("Recipes", systemImage: "book", value: LarderDestination.recipes) {
                RecipesDestination(store: store)
            }
            Tab("Meal Plan", systemImage: "calendar", value: LarderDestination.mealPlan) {
                PlaceholderDestination(
                    title: "Meal Plan", systemImage: "calendar",
                    message: "Plan a week of meals from your recipes here."
                )
            }
            Tab("Shopping List", systemImage: "cart", value: LarderDestination.shoppingList) {
                PlaceholderDestination(
                    title: "Shopping List", systemImage: "cart",
                    message: store.shoppingItemCount == 0
                        ? "Ingredients you add from a recipe appear here."
                        : "\(store.shoppingItemCount) ingredients from your recipes are waiting here."
                )
            }
            Tab("Settings", systemImage: "gearshape", value: LarderDestination.settings) {
                PlaceholderDestination(
                    title: "Settings", systemImage: "gearshape",
                    message: "Units, dietary preferences and sync options appear here."
                )
            }
        }
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

private enum RecipeFilter: String, CaseIterable, Identifiable {
    case all = "All Recipes"
    case favorites = "Favorites"
    var id: Self { self }
}

private struct RecipeEditorDraft: Identifiable {
    var recipe: LarderRecipe
    var isNew: Bool
    var id: LarderRecipe.ID { recipe.id }
}

/// The six recipe actions, shared by the detail toolbar and the list's context menu.
private struct RecipeActions {
    var isOnShoppingList: (LarderRecipe) -> Bool
    var toggleFavorite: (LarderRecipe) -> Void
    var toggleShoppingList: (LarderRecipe) -> Void
    var startCooking: (LarderRecipe) -> Void
    var edit: (LarderRecipe) -> Void
    var delete: (LarderRecipe) -> Void
}

private struct RecipesDestination: View {
    let store: LarderStore

    @State private var selection: LarderRecipe.ID?
    @State private var searchText = ""
    @State private var filter = RecipeFilter.all
    @State private var editorDraft: RecipeEditorDraft?
    @State private var cookingRecipe: LarderRecipe?
    @State private var pendingDeletion: LarderRecipe?

    private var visibleRecipes: [LarderRecipe] {
        store.recipes.filter { recipe in
            (filter == .all || recipe.isFavorite)
                && (searchText.isEmpty || recipe.name.localizedCaseInsensitiveContains(searchText))
        }
    }

    private var actions: RecipeActions {
        RecipeActions(
            isOnShoppingList: { store.isOnShoppingList($0) },
            toggleFavorite: { store.toggleFavorite($0) },
            toggleShoppingList: { store.toggleShoppingList($0) },
            startCooking: { cookingRecipe = $0 },
            edit: { editorDraft = RecipeEditorDraft(recipe: $0, isNew: false) },
            delete: { pendingDeletion = $0 }
        )
    }

    var body: some View {
        // Collapses to one pane on the outer display and shows list + recipe on the inner display.
        // Column widths are left to the system so it can match them to the fold.
        NavigationSplitView {
            recipeList
        } detail: {
            if let recipe = store.recipe(selection) {
                RecipeDetail(recipe: recipe, actions: actions)
                    .id(recipe.id)
            } else {
                ContentUnavailableView(
                    "Select a Recipe", systemImage: "book",
                    description: Text("Choose a recipe to see its ingredients and steps.")
                )
            }
        }
        .navigationSplitViewStyle(.balanced)
        .sensoryFeedback(.selection, trigger: store.shoppingRecipeIDs)
        .sheet(item: $editorDraft) { draft in
            RecipeEditor(draft: draft) { saved in
                store.save(saved)
                if draft.isNew { selection = saved.id }
            }
        }
        .fullScreenCover(item: $cookingRecipe) { recipe in
            CookingView(recipe: recipe)
        }
        .confirmationDialog(
            pendingDeletion.map { "Delete “\($0.name)”?" } ?? "Delete Recipe?",
            isPresented: Binding(
                get: { pendingDeletion != nil },
                set: { if !$0 { pendingDeletion = nil } }
            ),
            titleVisibility: .visible,
            presenting: pendingDeletion
        ) { recipe in
            Button("Delete Recipe", role: .destructive) {
                if selection == recipe.id { selection = nil }
                store.delete(recipe)
            }
        } message: { _ in
            Text("This can’t be undone.")
        }
    }

    private var recipeList: some View {
        List(selection: $selection) {
            ForEach(visibleRecipes) { recipe in
                RecipeRow(recipe: recipe)
                    .contextMenu {
                        RecipeMenuItems(recipe: recipe, actions: actions)
                    }
                    .swipeActions(edge: .leading) {
                        Button {
                            store.toggleFavorite(recipe)
                        } label: {
                            Label(
                                recipe.isFavorite ? "Unfavorite" : "Favorite",
                                systemImage: recipe.isFavorite ? "heart.slash" : "heart"
                            )
                        }
                        .tint(.pink)
                    }
                    .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                        Button {
                            pendingDeletion = recipe
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                        .tint(.red)
                    }
            }
        }
        .overlay {
            if visibleRecipes.isEmpty {
                if !searchText.isEmpty {
                    ContentUnavailableView.search(text: searchText)
                } else if filter == .favorites {
                    ContentUnavailableView(
                        "No Favorites", systemImage: "heart",
                        description: Text("Recipes you mark as favorites appear here.")
                    )
                } else {
                    ContentUnavailableView(
                        "No Recipes", systemImage: "book",
                        description: Text("Add a recipe to start your collection.")
                    )
                }
            }
        }
        .navigationTitle("Recipes")
        .searchable(text: $searchText, prompt: "Search recipes")
        // List controls stay with the list pane rather than moving to the trailing side bar.
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    editorDraft = RecipeEditorDraft(recipe: .blank, isNew: true)
                } label: {
                    Label("New Recipe", systemImage: "plus")
                }
            }
            .visibilityPriority(.high)

            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    Picker("Show", selection: $filter) {
                        ForEach(RecipeFilter.allCases) { option in
                            Text(option.rawValue).tag(option)
                        }
                    }
                } label: {
                    Label("Filter", systemImage: "line.3.horizontal.decrease")
                }
            }
        }
    }
}

private struct RecipeRow: View {
    let recipe: LarderRecipe

    var body: some View {
        HStack {
            Label {
                VStack(alignment: .leading, spacing: 2) {
                    Text(recipe.name)
                        .font(.headline)
                    Text("\(recipe.minutes) min · Serves \(recipe.servings)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            } icon: {
                Image(systemName: recipe.symbol)
                    .foregroundStyle(recipe.tint)
            }
            Spacer(minLength: 8)
            if recipe.isFavorite {
                Image(systemName: "heart.fill")
                    .foregroundStyle(.pink)
                    .accessibilityLabel("Favorite")
            }
        }
    }
}

private struct RecipeMenuItems: View {
    let recipe: LarderRecipe
    let actions: RecipeActions

    var body: some View {
        Button {
            actions.startCooking(recipe)
        } label: {
            Label("Start Cooking", systemImage: "frying.pan")
        }
        Button {
            actions.toggleFavorite(recipe)
        } label: {
            Label(
                recipe.isFavorite ? "Unfavorite" : "Favorite",
                systemImage: recipe.isFavorite ? "heart.slash" : "heart"
            )
        }
        Button {
            actions.toggleShoppingList(recipe)
        } label: {
            ShoppingListLabel(isListed: actions.isOnShoppingList(recipe))
        }
        ShareLink(item: recipe.shareText) {
            Label("Share", systemImage: "square.and.arrow.up")
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

private struct ShoppingListLabel: View {
    let isListed: Bool

    var body: some View {
        Label(
            isListed ? "Remove from Shopping List" : "Add to Shopping List",
            systemImage: isListed ? "cart.badge.minus" : "cart.badge.plus"
        )
    }
}

// MARK: - Recipe detail

private struct RecipeDetail: View {
    let recipe: LarderRecipe
    let actions: RecipeActions

    /// The narrowest page that still reads well; it grows with Dynamic Type.
    @ScaledMetric(relativeTo: .body) private var minimumPageWidth: CGFloat = 280

    private var isOnShoppingList: Bool { actions.isOnShoppingList(recipe) }

    var body: some View {
        GeometryReader { proxy in
            let photoHeight = min(max(proxy.size.height * 0.34, 120), 300)
            if let spread = bookSpread(in: proxy) {
                // The pane spans the fold: overview on one side, method on the other, nothing in the fold.
                HStack(spacing: 0) {
                    ScrollView {
                        overviewPage(photoHeight: photoHeight)
                    }
                    .frame(width: spread.leading)
                    Color.clear
                        .frame(width: spread.gutter)
                    ScrollView {
                        methodPage
                            .padding(.top)
                    }
                    .frame(width: spread.trailing)
                }
            } else {
                ScrollView {
                    VStack(spacing: 20) {
                        overviewPage(photoHeight: photoHeight)
                        methodPage
                    }
                }
            }
        }
        // The recipe name is the first heading in the content, so the bar's title area stays free for actions.
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    actions.startCooking(recipe)
                } label: {
                    Label("Start Cooking", systemImage: "frying.pan")
                }
                .buttonStyle(.glassProminent)
            }
            .visibilityPriority(.high)

            // Favorite shows status, so it stays visible longer than the other secondary actions.
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    actions.toggleFavorite(recipe)
                } label: {
                    Label(
                        recipe.isFavorite ? "Unfavorite" : "Favorite",
                        systemImage: recipe.isFavorite ? "heart.fill" : "heart"
                    )
                }
            }
            .visibilityPriority(.high)

            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    actions.toggleShoppingList(recipe)
                } label: {
                    ShoppingListLabel(isListed: isOnShoppingList)
                }
                ShareLink(item: recipe.shareText) {
                    Label("Share", systemImage: "square.and.arrow.up")
                }
            }

            // Less frequent actions go straight into the system overflow menu.
            ToolbarOverflowMenu {
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
    }

    /// Page widths on either side of a vertical fold that crosses this view, or nil when one column fits better.
    /// Inactive regions are included so the layout is the same whether the device is flat or partly folded.
    private func bookSpread(in proxy: GeometryProxy) -> (leading: CGFloat, gutter: CGFloat, trailing: CGFloat)? {
        let folds = proxy.reservedRegions(kind: .division, options: .includeInactive)
        guard let fold = folds.first(where: { $0.frame.height > $0.frame.width })?.frame else { return nil }
        let leading = fold.minX
        let trailing = proxy.size.width - fold.maxX
        guard leading >= minimumPageWidth, trailing >= minimumPageWidth else { return nil }
        return (leading, fold.width, trailing)
    }

    private func overviewPage(photoHeight: CGFloat) -> some View {
        VStack(alignment: .leading, spacing: 20) {
            RecipePhotoPlaceholder(recipe: recipe)
                .frame(height: photoHeight)
                .backgroundExtensionEffect()

            VStack(alignment: .leading, spacing: 20) {
                header
                GroupBox {
                    VStack(spacing: 0) {
                        ForEach(recipe.ingredients) { ingredient in
                            HStack(alignment: .firstTextBaseline) {
                                Text(ingredient.name)
                                Spacer(minLength: 12)
                                Text(ingredient.amount)
                                    .foregroundStyle(.secondary)
                                    .multilineTextAlignment(.trailing)
                            }
                            .padding(.vertical, 8)
                            .accessibilityElement(children: .combine)
                            if ingredient.id != recipe.ingredients.last?.id {
                                Divider()
                            }
                        }
                    }
                } label: {
                    Label("Ingredients", systemImage: "basket")
                }
            }
            .padding(.horizontal)
        }
        .padding(.bottom)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(recipe.name)
                .font(.title.bold())
                .accessibilityAddTraits(.isHeader)
            if !recipe.summary.isEmpty {
                Text(recipe.summary)
                    .foregroundStyle(.secondary)
            }
            ViewThatFits(in: .horizontal) {
                HStack(spacing: 16) { facts }
                VStack(alignment: .leading, spacing: 4) { facts }
            }
            .font(.subheadline)
            .foregroundStyle(.secondary)
        }
    }

    @ViewBuilder private var facts: some View {
        Label("\(recipe.minutes) min", systemImage: "clock")
        Label("Serves \(recipe.servings)", systemImage: "person.2")
        if isOnShoppingList {
            Label("On Shopping List", systemImage: "cart")
        }
    }

    private var methodPage: some View {
        GroupBox {
            VStack(alignment: .leading, spacing: 14) {
                ForEach(Array(recipe.steps.enumerated()), id: \.element.id) { index, step in
                    Label {
                        Text(step.text)
                    } icon: {
                        Image(systemName: index < 50 ? "\(index + 1).circle.fill" : "circle.fill")
                            .foregroundStyle(.tint)
                            .accessibilityLabel("Step \(index + 1)")
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, 4)
        } label: {
            Label("Method", systemImage: "list.bullet")
        }
        .padding(.horizontal)
        .padding(.bottom)
    }
}

private struct RecipePhotoPlaceholder: View {
    let recipe: LarderRecipe

    var body: some View {
        Rectangle()
            .fill(recipe.tint.gradient)
            .overlay {
                Image(systemName: recipe.symbol)
                    .font(.largeTitle)
                    .imageScale(.large)
                    .foregroundStyle(.white)
            }
            .accessibilityHidden(true)
    }
}

// MARK: - Cooking mode

private struct CookingView: View {
    let recipe: LarderRecipe

    @Environment(\.dismiss) private var dismiss
    @State private var stepIndex = 0
    @State private var gathered: Set<LarderIngredient.ID> = []
    @State private var showsIngredients = false

    private var isLastStep: Bool { stepIndex >= recipe.steps.count - 1 }

    var body: some View {
        NavigationStack {
            // Side by side in landscape, stacked in portrait, and on separate sides of the fold when folded.
            ArrangementView {
                stepPane
            } secondary: {
                ingredientChecklist
            }
            .arrangementViewStyle(.split)
            .navigationTitle(recipe.name)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close", systemImage: "xmark", role: .close) {
                        dismiss()
                    }
                }
                // A split arrangement shows only the step when the closed device is in landscape,
                // so the ingredients stay reachable from the toolbar in every pose.
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showsIngredients = true
                    } label: {
                        Label("Ingredients", systemImage: "checklist")
                    }
                }
                .visibilityPriority(.high)
            }
            .navigationDestination(isPresented: $showsIngredients) {
                ingredientChecklist
                    .navigationTitle("Ingredients")
            }
        }
    }

    @ViewBuilder private var stepPane: some View {
        if recipe.steps.indices.contains(stepIndex) {
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    ProgressView(value: Double(stepIndex + 1), total: Double(recipe.steps.count))
                        .accessibilityHidden(true)
                    Text("Step \(stepIndex + 1) of \(recipe.steps.count)")
                        .font(.headline)
                        .foregroundStyle(.secondary)
                    Text(recipe.steps[stepIndex].text)
                        .font(.title2)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
            }
            .safeAreaInset(edge: .bottom) {
                HStack(spacing: 12) {
                    Button {
                        stepIndex -= 1
                    } label: {
                        Label("Previous", systemImage: "chevron.backward")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)
                    .disabled(stepIndex == 0)

                    Button {
                        if isLastStep {
                            dismiss()
                        } else {
                            stepIndex += 1
                        }
                    } label: {
                        Label(isLastStep ? "Finish" : "Next", systemImage: isLastStep ? "checkmark" : "chevron.forward")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                }
                .controlSize(.large)
                .padding()
            }
        } else {
            ContentUnavailableView(
                "No Steps Yet", systemImage: "list.bullet",
                description: Text("Edit this recipe to add its method.")
            )
        }
    }

    private var ingredientChecklist: some View {
        List {
            Section("Ingredients") {
                ForEach(recipe.ingredients) { ingredient in
                    let isGathered = gathered.contains(ingredient.id)
                    Button {
                        if isGathered {
                            gathered.remove(ingredient.id)
                        } else {
                            gathered.insert(ingredient.id)
                        }
                    } label: {
                        HStack(alignment: .firstTextBaseline) {
                            Image(systemName: isGathered ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(isGathered ? Color.accentColor : Color.secondary)
                            Text(ingredient.name)
                                .foregroundStyle(isGathered ? Color.secondary : Color.primary)
                            Spacer(minLength: 12)
                            Text(ingredient.amount)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .accessibilityAddTraits(isGathered ? .isSelected : [])
                }
            }
        }
    }
}

// MARK: - Editor

private struct RecipeEditor: View {
    let isNew: Bool
    let onSave: (LarderRecipe) -> Void
    private let original: LarderRecipe

    @Environment(\.dismiss) private var dismiss
    @State private var recipe: LarderRecipe
    @State private var isConfirmingDiscard = false

    init(draft: RecipeEditorDraft, onSave: @escaping (LarderRecipe) -> Void) {
        self.isNew = draft.isNew
        self.onSave = onSave
        self.original = draft.recipe
        self._recipe = State(initialValue: draft.recipe)
    }

    private var hasChanges: Bool { recipe != original }

    private var cleanedRecipe: LarderRecipe {
        var cleaned = recipe
        cleaned.name = recipe.name.trimmingCharacters(in: .whitespacesAndNewlines)
        cleaned.ingredients.removeAll { $0.name.trimmingCharacters(in: .whitespaces).isEmpty }
        cleaned.steps.removeAll { $0.text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
        return cleaned
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Details") {
                    TextField("Name", text: $recipe.name)
                    TextField("Short description", text: $recipe.summary, axis: .vertical)
                    Stepper("Serves \(recipe.servings)", value: $recipe.servings, in: 1...24)
                    Stepper("\(recipe.minutes) minutes", value: $recipe.minutes, in: 5...480, step: 5)
                }
                Section("Ingredients") {
                    ForEach($recipe.ingredients) { $ingredient in
                        HStack {
                            TextField("Ingredient", text: $ingredient.name)
                            TextField("Amount", text: $ingredient.amount)
                                .multilineTextAlignment(.trailing)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .onDelete { recipe.ingredients.remove(atOffsets: $0) }
                    Button("Add Ingredient", systemImage: "plus") {
                        recipe.ingredients.append(LarderIngredient(name: "", amount: ""))
                    }
                }
                Section("Method") {
                    ForEach($recipe.steps) { $step in
                        TextField("Describe this step", text: $step.text, axis: .vertical)
                    }
                    .onDelete { recipe.steps.remove(atOffsets: $0) }
                    Button("Add Step", systemImage: "plus") {
                        recipe.steps.append(LarderStep(text: ""))
                    }
                }
            }
            .navigationTitle(isNew ? "New Recipe" : "Edit Recipe")
            .navigationBarTitleDisplayMode(.inline)
            // Title + symbol on both buttons, so the system can show them in a vertical bar on the outer display.
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel", systemImage: "xmark", role: .cancel) {
                        if hasChanges {
                            isConfirmingDiscard = true
                        } else {
                            dismiss()
                        }
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save", systemImage: "checkmark") {
                        onSave(cleanedRecipe)
                        dismiss()
                    }
                    .disabled(recipe.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            .confirmationDialog("Discard your changes?", isPresented: $isConfirmingDiscard, titleVisibility: .visible) {
                Button("Discard Changes", role: .destructive) {
                    dismiss()
                }
                Button("Keep Editing", role: .cancel) {}
            }
        }
        .interactiveDismissDisabled(hasChanges)
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
