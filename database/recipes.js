/* ====================================================================
// DATABASE: RECIPES
// Defines all crafting, refining, and upgrade formulas.
// Language: English (for easy translation/localization)
// ==================================================================== */

export const RECIPES_DB = {

    // --- TIER 1 REFINE RECIPES (Material -> Component) ---
    // Rule: 9x T1 Material -> 1x T1 Component (Tribe Synergistic)

    // Nocturnals (Defense/HP focus)
    'refine_scrap_to_def1': {
        recipeId: 'refine_scrap_to_def1',
        name: 'Refine Scrap to Defense Plate',
        type: 'REFINE', // Action Type: Refine
        inputMaterials: { 'mat_scrap': 9 },
        inputComponents: {},
        inputShopItems: {},
        output: { itemId: 'comp_def_1', amount: 1 } // Output: Defense Plate (Component)
    },
    
    // Volcanics (Damage focus)
    'refine_magma_to_dmg1': {
        recipeId: 'refine_magma_to_dmg1',
        name: 'Refine Magma to Volcanic Core',
        type: 'REFINE',
        inputMaterials: { 'mat_magma': 9 },
        inputComponents: {},
        inputShopItems: {},
        output: { itemId: 'comp_dmg_1', amount: 1 } // Output: Volcanic Core (Component)
    },
    
    // Undergrounders (Speed focus)
    'refine_water_to_spd1': {
        recipeId: 'refine_water_to_spd1',
        name: 'Refine Water to Speed Injector',
        type: 'REFINE',
        inputMaterials: { 'mat_water': 9 },
        inputComponents: {},
        inputShopItems: {},
        output: { itemId: 'comp_spd_1', amount: 1 } // Output: Speed Injector (Component)
    },
    
    // Reptilians (Heal/HP focus - Uses Healing Plants)
    'refine_plants_to_hp1': {
        recipeId: 'refine_plants_to_hp1',
        name: 'Refine Healing Plants to HP Matrix',
        type: 'REFINE',
        inputMaterials: { 'mat_healing_plants': 9 },
        inputComponents: {},
        inputShopItems: {},
        output: { itemId: 'comp_hp_1', amount: 1 } // Output: HP Matrix (Component)
    },

    // Radioactives (Luck/Crit focus - Uses Strange Fluid)
    'refine_fluid_to_crit1': {
        recipeId: 'refine_fluid_to_crit1',
        name: 'Refine Fluid to Precision Lens',
        type: 'REFINE',
        inputMaterials: { 'mat_strange_fluid': 9 },
        inputComponents: {},
        inputShopItems: {},
        output: { itemId: 'comp_crit_1', amount: 1 } // Output: Precision Lens (Component)
    },
    
    // --- TIER 1 CRAFT RECIPES (Basic Equipment) ---
    // Example: Crafting a Rustic Helmet
    'craft_rustic_helmet': {
        recipeId: 'craft_rustic_helmet',
        name: 'Craft Rustic Helmet',
        type: 'CRAFT',
        inputMaterials: { 'mat_scrap': 15, 'mat_polymer': 5 },
        inputComponents: {},
        inputShopItems: {},
        output: { itemId: 'eq_rust_helmet', amount: 1, rarity: 'COMMON' } // Output: Equipment
    },
    
    // --- TIER 1 UPGRADE RECIPES (Component T1 -> T2) ---
    // Example: Upgrade Defense Component (Requires the item instance + cost)
    'upgrade_def1_to_def2': {
        recipeId: 'upgrade_def1_to_def2',
        name: 'Upgrade Defense Plate T1 to T2',
        type: 'UPGRADE',
        inputMaterials: { 'mat_metal': 20 },
        inputComponents: { 'comp_def_1': 3 }, // Consumes 3x T1 Component
        inputShopItems: { 'boost_token': 1 },
        output: { itemId: 'comp_def_2', amount: 1, consumeInstance: true } // Output: New T2 Component
    }
    
    // Mais receitas serão adicionadas...
};
