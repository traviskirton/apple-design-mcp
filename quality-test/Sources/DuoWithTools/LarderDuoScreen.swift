// Larder for iPhone Duo. Apple design rules applied (HIG: Designing for iPhone Duo, Layout, Split views, Tab bars, Toolbars):
// 1. Only standard containers (TabView around NavigationSplitView), so the system moves the tab bar and toolbars to the
//    side on the outer display and in inner landscape, keeps horizontal bars in inner portrait, and fits the columns to the fold.
// 2. One hierarchy on both displays: compact width (closed) shows the list OR a recipe, regular width (open) shows both.
//    Tab, selection and cooking progress live above the layout and survive opening, closing, rotating and folding.
// 3. No fixed widths, no device, orientation or pose checks, no custom bar placement and no custom "more" menu.
// 4. Toolbar items are declared in priority order (prominent Start Cooking first, so it overflows last); Edit and Delete
//    go to the system overflow menu (.secondaryAction); related items share a ToolbarItemGroup instead of manual spacing.
// 5. Every bar item is a Label with a title and an SF Symbol (symbols, not text buttons); the list filter stays in the list pane.
// 6. Modals are system sheets and a confirmation dialog, which the system repositions around the fold; Delete is
//    destructive, listed last and confirmed; context menu and swipe actions repeat actions that the main UI also offers.
// 7. System colors, text styles and Dynamic Type-friendly rows (LabeledContent, ViewThatFits); VoiceOver labels on icons.

#if os(iOS)
import SwiftUI

// MARK: - Model

struct LarderIngredient: Identifiable, Hashable {
    let id = UUID()
    var name: String
    var quantity: String
}

struct LarderRecipe: Identifiable, Hashable {
    var id: String
    var title: String
    var summary: String
    var minutes: Int
    var servings: Int
    var symbol: String
    var isFavorite = false
    var ingredients: [LarderIngredient]
    var steps: [String]

    var shareText: String {
        let ingredientLines = ingredients.map { "• \($0.quantity) \($0.name)" }
        let stepLines = steps.enumerated().map { "\($0.offset + 1). \($0.element)" }
        return ([title, summary, ""] + ingredientLines + [""] + stepLines).joined(separator: "\n")
    }
}

enum LarderDestination: String, Hashable {
    case recipes, mealPlan, shoppingList, settings
}

enum LarderRecipeAction {
    case startCooking, toggleFavorite, toggleShoppingList, edit, delete
}

// MARK: - Top-level screen

struct LarderDuoScreen: View {
    // Scene storage keeps the destination when the app moves between the outer and inner display.
    @SceneStorage("larder.destination") private var destination = LarderDestination.recipes
    @State private var recipes = LarderRecipe.samples
    @State private var shoppingRecipeIDs: Set<LarderRecipe.ID> = []

    private var shoppingItemCount: Int {
        recipes
            .filter { shoppingRecipeIDs.contains($0.id) }
            .reduce(0) { $0 + $1.ingredients.count }
    }

    var body: some View {
        // A standard tab view: the system decides whether the bar is horizontal or on the side.
        TabView(selection: $destination) {
            Tab("Recipes", systemImage: "book", value: LarderDestination.recipes) {
                LarderRecipesView(recipes: $recipes, shoppingRecipeIDs: $shoppingRecipeIDs)
            }
            Tab("Meal Plan", systemImage: "calendar", value: LarderDestination.mealPlan) {
                LarderPlaceholderView(
                    title: "Meal Plan",
                    headline: "No Meals Planned",
                    systemImage: "calendar",
                    message: "Recipes you schedule for the week appear here."
                )
            }
            Tab("Shopping List", systemImage: "cart", value: LarderDestination.shoppingList) {
                LarderPlaceholderView(
                    title: "Shopping List",
                    headline: shoppingItemCount == 0 ? "Nothing to Buy" : "\(shoppingItemCount) Ingredients to Buy",
                    systemImage: "cart",
                    message: shoppingItemCount == 0
                        ? "Ingredients you add from a recipe appear here."
                        : "Added from your recipes."
                )
            }
            Tab("Settings", systemImage: "gearshape", value: LarderDestination.settings) {
                LarderPlaceholderView(
                    title: "Settings",
                    headline: "Settings",
                    systemImage: "gearshape",
                    message: "Units, dietary preferences and other options appear here."
                )
            }
        }
    }
}

// MARK: - Placeholder destinations

private struct LarderPlaceholderView: View {
    let title: String
    let headline: String
    let systemImage: String
    let message: String

    var body: some View {
        NavigationStack {
            ContentUnavailableView(headline, systemImage: systemImage, description: Text(message))
                .navigationTitle(title)
        }
    }
}

// MARK: - Recipes destination

private struct LarderRecipesView: View {
    @Binding var recipes: [LarderRecipe]
    @Binding var shoppingRecipeIDs: Set<LarderRecipe.ID>

    @SceneStorage("larder.selectedRecipe") private var selectedID: String?
    @State private var showsFavoritesOnly = false
    @State private var editorDraft: LarderRecipe?
    @State private var cookingRecipe: LarderRecipe?
    @State private var pendingDeletion: LarderRecipe?

    private var visibleRecipes: [LarderRecipe] {
        showsFavoritesOnly ? recipes.filter(\.isFavorite) : recipes
    }

    private var selectedRecipe: LarderRecipe? {
        recipes.first { $0.id == selectedID }
    }

    var body: some View {
        // The split view collapses to one pane in compact width (outer display) and shows both panes in
        // regular width (inner display). The system sizes the two columns around the fold, so no widths are set.
        NavigationSplitView {
            recipeList
        } detail: {
            if let recipe = selectedRecipe {
                LarderRecipeDetail(
                    recipe: recipe,
                    isInShoppingList: shoppingRecipeIDs.contains(recipe.id)
                ) { action in
                    perform(action, on: recipe)
                }
                .id(recipe.id)
            } else {
                ContentUnavailableView(
                    "No Recipe Selected",
                    systemImage: "book",
                    description: Text("Choose a recipe to see its ingredients and steps.")
                )
            }
        }
        .navigationSplitViewStyle(.balanced)
        .sheet(item: $editorDraft) { draft in
            LarderRecipeEditor(recipe: draft) { updated in
                save(updated)
            }
        }
        .sheet(item: $cookingRecipe) { recipe in
            LarderCookingView(recipe: recipe)
        }
        .confirmationDialog(
            "Delete Recipe?",
            isPresented: Binding(
                get: { pendingDeletion != nil },
                set: { isPresented in
                    if !isPresented { pendingDeletion = nil }
                }
            ),
            titleVisibility: .visible,
            presenting: pendingDeletion
        ) { recipe in
            Button("Delete “\(recipe.title)”", role: .destructive) {
                delete(recipe)
            }
        } message: { _ in
            Text("This removes the recipe from Larder. You can’t undo this action.")
        }
        .sensoryFeedback(trigger: shoppingRecipeIDs) { old, new in
            new.count > old.count ? .success : nil
        }
    }

    private var recipeList: some View {
        List(selection: $selectedID) {
            ForEach(visibleRecipes) { recipe in
                LarderRecipeRow(recipe: recipe)
                    .tag(recipe.id)
                    .swipeActions(edge: .leading) {
                        LarderActionButton(
                            action: .toggleFavorite,
                            recipe: recipe,
                            isInShoppingList: shoppingRecipeIDs.contains(recipe.id)
                        ) { perform($0, on: recipe) }
                        .tint(.pink)
                    }
                    .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                        // Not given the destructive role, so the row stays in place until the dialog confirms.
                        Button {
                            perform(.delete, on: recipe)
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                        .tint(.red)
                    }
                    .contextMenu {
                        let inList = shoppingRecipeIDs.contains(recipe.id)
                        LarderActionButton(action: .startCooking, recipe: recipe, isInShoppingList: inList) {
                            perform($0, on: recipe)
                        }
                        Divider()
                        LarderActionButton(action: .toggleFavorite, recipe: recipe, isInShoppingList: inList) {
                            perform($0, on: recipe)
                        }
                        LarderActionButton(action: .toggleShoppingList, recipe: recipe, isInShoppingList: inList) {
                            perform($0, on: recipe)
                        }
                        ShareLink(item: recipe.shareText) {
                            Label("Share", systemImage: "square.and.arrow.up")
                        }
                        LarderActionButton(action: .edit, recipe: recipe, isInShoppingList: inList) {
                            perform($0, on: recipe)
                        }
                        Divider()
                        LarderActionButton(action: .delete, recipe: recipe, isInShoppingList: inList) {
                            perform($0, on: recipe)
                        }
                    }
            }
        }
        .overlay {
            if visibleRecipes.isEmpty {
                ContentUnavailableView(
                    showsFavoritesOnly ? "No Favorites" : "No Recipes",
                    systemImage: showsFavoritesOnly ? "heart" : "book",
                    description: Text(
                        showsFavoritesOnly
                            ? "Recipes you mark as favorites appear here."
                            : "Recipes you save appear here."
                    )
                )
            }
        }
        .navigationTitle("Recipes")
        .toolbar {
            // This control filters the list, so it stays with the list pane.
            ToolbarItem(placement: .topBarTrailing) {
                Toggle(isOn: $showsFavoritesOnly) {
                    Label("Favorites Only", systemImage: "line.3.horizontal.decrease")
                }
            }
        }
    }

    private func perform(_ action: LarderRecipeAction, on recipe: LarderRecipe) {
        switch action {
        case .startCooking:
            cookingRecipe = recipe
        case .toggleFavorite:
            if let index = recipes.firstIndex(where: { $0.id == recipe.id }) {
                recipes[index].isFavorite.toggle()
            }
        case .toggleShoppingList:
            if shoppingRecipeIDs.contains(recipe.id) {
                shoppingRecipeIDs.remove(recipe.id)
            } else {
                shoppingRecipeIDs.insert(recipe.id)
            }
        case .edit:
            editorDraft = recipe
        case .delete:
            pendingDeletion = recipe
        }
    }

    private func save(_ updated: LarderRecipe) {
        if let index = recipes.firstIndex(where: { $0.id == updated.id }) {
            recipes[index] = updated
        }
    }

    private func delete(_ recipe: LarderRecipe) {
        withAnimation {
            if selectedID == recipe.id {
                selectedID = nil
            }
            shoppingRecipeIDs.remove(recipe.id)
            recipes.removeAll { $0.id == recipe.id }
        }
    }
}

// MARK: - Shared action button

/// One definition of each recipe action, so its title and symbol match in the toolbar, menus and swipe actions.
private struct LarderActionButton: View {
    let action: LarderRecipeAction
    let recipe: LarderRecipe
    let isInShoppingList: Bool
    /// In the toolbar, the heart shows the current state (filled when the recipe is a favorite).
    var showsCurrentState = false
    let perform: (LarderRecipeAction) -> Void

    var body: some View {
        Button(role: action == .delete ? .destructive : nil) {
            perform(action)
        } label: {
            Label(title, systemImage: symbol)
        }
    }

    private var title: String {
        switch action {
        case .startCooking:
            return "Start Cooking"
        case .toggleFavorite:
            return recipe.isFavorite ? "Unfavorite" : "Favorite"
        case .toggleShoppingList:
            return isInShoppingList ? "Remove from Shopping List" : "Add to Shopping List"
        case .edit:
            return "Edit"
        case .delete:
            return "Delete"
        }
    }

    private var symbol: String {
        switch action {
        case .startCooking:
            return "play.fill"
        case .toggleFavorite:
            guard recipe.isFavorite else { return "heart" }
            return showsCurrentState ? "heart.fill" : "heart.slash"
        case .toggleShoppingList:
            return isInShoppingList ? "cart.badge.minus" : "cart.badge.plus"
        case .edit:
            return "pencil"
        case .delete:
            return "trash"
        }
    }
}

// MARK: - Recipe list row

private struct LarderRecipeRow: View {
    let recipe: LarderRecipe

    var body: some View {
        HStack {
            Label {
                VStack(alignment: .leading, spacing: 2) {
                    Text(recipe.title)
                        .font(.headline)
                    Text("\(recipe.minutes) min · Serves \(recipe.servings)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            } icon: {
                Image(systemName: recipe.symbol)
            }
            Spacer(minLength: 8)
            if recipe.isFavorite {
                Image(systemName: "heart.fill")
                    .foregroundStyle(.pink)
                    .accessibilityLabel("Favorite")
            }
        }
        .accessibilityElement(children: .combine)
    }
}

// MARK: - Recipe detail

private struct LarderRecipeDetail: View {
    let recipe: LarderRecipe
    let isInShoppingList: Bool
    let perform: (LarderRecipeAction) -> Void

    var body: some View {
        List {
            Section {
                LarderPhotoPlaceholder()
                    .listRowInsets(EdgeInsets())
                VStack(alignment: .leading, spacing: 8) {
                    Text(recipe.summary)
                    // Side by side when there is room, stacked at large text sizes or in a narrow pane.
                    ViewThatFits(in: .horizontal) {
                        HStack(spacing: 16) { facts }
                        VStack(alignment: .leading, spacing: 4) { facts }
                    }
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                }
            }

            Section {
                ForEach(recipe.ingredients) { ingredient in
                    LabeledContent(ingredient.name, value: ingredient.quantity)
                }
            } header: {
                Text("Ingredients")
            } footer: {
                if isInShoppingList {
                    Label("Added to Shopping List", systemImage: "checkmark.circle")
                }
            }

            Section("Steps") {
                ForEach(Array(recipe.steps.enumerated()), id: \.offset) { item in
                    Label {
                        Text(item.element)
                    } icon: {
                        Text("\(item.offset + 1)")
                            .font(.headline)
                            .monospacedDigit()
                            .foregroundStyle(.tint)
                            .accessibilityLabel("Step \(item.offset + 1)")
                    }
                }
            }
        }
        .navigationTitle(recipe.title)
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            // Declared in priority order. Items overflow from the end, so the main action stays visible longest.
            ToolbarItem(placement: .primaryAction) {
                LarderActionButton(
                    action: .startCooking,
                    recipe: recipe,
                    isInShoppingList: isInShoppingList,
                    perform: perform
                )
                .buttonStyle(.borderedProminent)
            }
            ToolbarItemGroup(placement: .topBarTrailing) {
                LarderActionButton(
                    action: .toggleFavorite,
                    recipe: recipe,
                    isInShoppingList: isInShoppingList,
                    showsCurrentState: true,
                    perform: perform
                )
                LarderActionButton(
                    action: .toggleShoppingList,
                    recipe: recipe,
                    isInShoppingList: isInShoppingList,
                    perform: perform
                )
                ShareLink(item: recipe.shareText) {
                    Label("Share", systemImage: "square.and.arrow.up")
                }
            }
            // Less frequent actions go to the system overflow menu; the destructive one is last.
            ToolbarItemGroup(placement: .secondaryAction) {
                LarderActionButton(
                    action: .edit,
                    recipe: recipe,
                    isInShoppingList: isInShoppingList,
                    perform: perform
                )
                LarderActionButton(
                    action: .delete,
                    recipe: recipe,
                    isInShoppingList: isInShoppingList,
                    perform: perform
                )
            }
        }
    }

    @ViewBuilder
    private var facts: some View {
        Label("\(recipe.minutes) min", systemImage: "clock")
        Label("Serves \(recipe.servings)", systemImage: "person.2")
    }
}

private struct LarderPhotoPlaceholder: View {
    var body: some View {
        ZStack {
            Rectangle()
                .fill(.quaternary)
            Image(systemName: "photo")
                .font(.largeTitle)
                .foregroundStyle(.secondary)
        }
        // Flexible width; the height is modest so content stays visible on the short outer display.
        .frame(maxWidth: .infinity)
        .frame(height: 180)
        .accessibilityElement()
        .accessibilityLabel("Recipe photo placeholder")
    }
}

// MARK: - Edit sheet

private struct LarderRecipeEditor: View {
    @Environment(\.dismiss) private var dismiss
    @State private var draft: LarderRecipe
    private let onSave: (LarderRecipe) -> Void

    init(recipe: LarderRecipe, onSave: @escaping (LarderRecipe) -> Void) {
        _draft = State(initialValue: recipe)
        self.onSave = onSave
    }

    private var hasName: Bool {
        !draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Details") {
                    TextField("Name", text: $draft.title)
                    TextField("Summary", text: $draft.summary, axis: .vertical)
                        .lineLimit(2...5)
                }
                Section("Servings and Time") {
                    Stepper("Serves \(draft.servings)", value: $draft.servings, in: 1...24)
                    Stepper("\(draft.minutes) min", value: $draft.minutes, in: 5...480, step: 5)
                }
            }
            .navigationTitle("Edit Recipe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(role: .cancel) {
                        dismiss()
                    } label: {
                        Label("Cancel", systemImage: "xmark")
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        onSave(draft)
                        dismiss()
                    } label: {
                        Label("Done", systemImage: "checkmark")
                    }
                    .disabled(!hasName)
                }
            }
        }
    }
}

// MARK: - Cooking sheet

private struct LarderCookingView: View {
    @Environment(\.dismiss) private var dismiss
    let recipe: LarderRecipe
    @State private var stepIndex = 0

    private var isLastStep: Bool {
        stepIndex >= recipe.steps.count - 1
    }

    var body: some View {
        NavigationStack {
            Group {
                if recipe.steps.indices.contains(stepIndex) {
                    VStack(spacing: 0) {
                        ScrollView {
                            VStack(alignment: .leading, spacing: 16) {
                                ProgressView(value: Double(stepIndex + 1), total: Double(recipe.steps.count))
                                    .accessibilityHidden(true)
                                Text("Step \(stepIndex + 1) of \(recipe.steps.count)")
                                    .font(.headline)
                                    .foregroundStyle(.secondary)
                                Text(recipe.steps[stepIndex])
                                    .font(.title2)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding()
                        }
                        // Same size for both buttons; style marks the preferred one.
                        HStack(spacing: 12) {
                            Button {
                                withAnimation { stepIndex -= 1 }
                            } label: {
                                Text("Previous")
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
                                Text(isLastStep ? "Finish" : "Next")
                                    .frame(maxWidth: .infinity)
                            }
                            .buttonStyle(.borderedProminent)
                        }
                        .controlSize(.large)
                        .padding()
                    }
                } else {
                    ContentUnavailableView(
                        "No Steps",
                        systemImage: "list.bullet",
                        description: Text("This recipe doesn’t have any steps yet.")
                    )
                }
            }
            .navigationTitle(recipe.title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Label("Close", systemImage: "xmark")
                    }
                }
            }
        }
    }
}

// MARK: - Sample data

extension LarderRecipe {
    static let samples: [LarderRecipe] = [
        LarderRecipe(
            id: "shakshuka",
            title: "Shakshuka",
            summary: "Eggs poached in a spiced tomato and pepper sauce. Serve with warm bread.",
            minutes: 30,
            servings: 4,
            symbol: "frying.pan",
            isFavorite: true,
            ingredients: [
                LarderIngredient(name: "Olive oil", quantity: "2 tbsp"),
                LarderIngredient(name: "Onion, sliced", quantity: "1"),
                LarderIngredient(name: "Red bell pepper, sliced", quantity: "1"),
                LarderIngredient(name: "Garlic cloves", quantity: "3"),
                LarderIngredient(name: "Ground cumin", quantity: "1 tsp"),
                LarderIngredient(name: "Crushed tomatoes", quantity: "800 g"),
                LarderIngredient(name: "Eggs", quantity: "6")
            ],
            steps: [
                "Heat the oil in a wide pan over medium heat. Cook the onion and pepper until soft, about 8 minutes.",
                "Stir in the garlic and cumin and cook for 1 minute.",
                "Add the tomatoes, season with salt and simmer for 10 minutes until thickened.",
                "Make six wells in the sauce and crack an egg into each one.",
                "Cover and cook for 5 to 7 minutes, until the whites are set. Serve straight from the pan."
            ]
        ),
        LarderRecipe(
            id: "miso-salmon",
            title: "Miso Salmon",
            summary: "Glazed salmon fillets that cook under the broiler in minutes.",
            minutes: 25,
            servings: 2,
            symbol: "fish",
            ingredients: [
                LarderIngredient(name: "Salmon fillets", quantity: "2"),
                LarderIngredient(name: "White miso", quantity: "2 tbsp"),
                LarderIngredient(name: "Mirin", quantity: "1 tbsp"),
                LarderIngredient(name: "Soy sauce", quantity: "1 tbsp"),
                LarderIngredient(name: "Scallions, sliced", quantity: "2")
            ],
            steps: [
                "Whisk the miso, mirin and soy sauce into a smooth glaze.",
                "Coat the salmon with the glaze and let it rest for 10 minutes.",
                "Broil on a lined tray for 8 to 10 minutes, until browned at the edges.",
                "Scatter with scallions and serve with rice."
            ]
        ),
        LarderRecipe(
            id: "carrot-salad",
            title: "Roast Carrot Salad",
            summary: "Sweet roasted carrots with herbs, lemon and toasted seeds.",
            minutes: 35,
            servings: 4,
            symbol: "carrot",
            ingredients: [
                LarderIngredient(name: "Carrots", quantity: "600 g"),
                LarderIngredient(name: "Olive oil", quantity: "3 tbsp"),
                LarderIngredient(name: "Lemon", quantity: "1"),
                LarderIngredient(name: "Parsley, chopped", quantity: "1 bunch"),
                LarderIngredient(name: "Pumpkin seeds", quantity: "30 g")
            ],
            steps: [
                "Heat the oven to 220°C (425°F).",
                "Toss the carrots with 2 tablespoons of oil and a pinch of salt. Roast for 25 minutes.",
                "Toast the seeds in a dry pan until they start to pop.",
                "Dress the warm carrots with lemon juice, the remaining oil, parsley and seeds."
            ]
        ),
        LarderRecipe(
            id: "olive-oil-cake",
            title: "Olive Oil Cake",
            summary: "A tender, citrus-scented cake that keeps well for days.",
            minutes: 60,
            servings: 8,
            symbol: "birthday.cake",
            isFavorite: true,
            ingredients: [
                LarderIngredient(name: "All-purpose flour", quantity: "250 g"),
                LarderIngredient(name: "Sugar", quantity: "200 g"),
                LarderIngredient(name: "Eggs", quantity: "3"),
                LarderIngredient(name: "Olive oil", quantity: "180 ml"),
                LarderIngredient(name: "Milk", quantity: "120 ml"),
                LarderIngredient(name: "Orange, zest and juice", quantity: "1"),
                LarderIngredient(name: "Baking powder", quantity: "2 tsp")
            ],
            steps: [
                "Heat the oven to 175°C (350°F) and line a 23 cm cake pan.",
                "Whisk the eggs and sugar until pale, then whisk in the oil, milk, zest and juice.",
                "Fold in the flour and baking powder until just combined.",
                "Bake for 40 to 45 minutes, until a skewer comes out clean.",
                "Cool in the pan for 10 minutes before turning out."
            ]
        ),
        LarderRecipe(
            id: "masala-chai",
            title: "Masala Chai",
            summary: "Black tea simmered with milk, ginger and whole spices.",
            minutes: 15,
            servings: 2,
            symbol: "cup.and.saucer",
            ingredients: [
                LarderIngredient(name: "Water", quantity: "250 ml"),
                LarderIngredient(name: "Milk", quantity: "250 ml"),
                LarderIngredient(name: "Black tea leaves", quantity: "2 tsp"),
                LarderIngredient(name: "Fresh ginger, sliced", quantity: "2 cm"),
                LarderIngredient(name: "Cardamom pods, crushed", quantity: "4"),
                LarderIngredient(name: "Sugar", quantity: "to taste")
            ],
            steps: [
                "Simmer the water with the ginger and cardamom for 3 minutes.",
                "Add the tea leaves and simmer for 2 minutes more.",
                "Pour in the milk and bring back to a gentle boil.",
                "Strain into cups and sweeten to taste."
            ]
        )
    ]
}

// MARK: - Previews

#Preview("Larder") {
    LarderDuoScreen()
}

#Preview("Larder, landscape", traits: .landscapeLeft) {
    LarderDuoScreen()
}

#endif
