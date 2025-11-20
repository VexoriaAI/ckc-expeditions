/* ====================================================================
// DATABASE: RECIPES
// UPDATE: (CORREÇÃO DE ID)
// Atualiza 'comp_dmg_1' para 'comp_atk_1' para alinhar com components.js.
// ==================================================================== */

export const RECIPES_DB = {

    // --- TIER 1 REFINE RECIPES (Material -> Component) ---
    'refine_scrap_to_def1': {
        recipeId: 'refine_scrap_to_def1',
        name: 'Refine Scrap to Defense Plate',
        type: 'REFINE', 
        inputMaterials: { 'mat_scrap': 9 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'comp_def_1', amount: 1 } 
    },
    'refine_magma_to_atk1': { // (ID da receita atualizado para consistência)
        recipeId: 'refine_magma_to_atk1',
        name: 'Refine Magma to Attack Core', 
        type: 'REFINE',
        inputMaterials: { 'mat_magma': 9 },
        inputComponents: {}, inputShopItems: {},
        // (CORREÇÃO) ID do item atualizado para comp_atk_1
        output: { itemId: 'comp_atk_1', amount: 1 } 
    },
    'refine_water_to_spd1': {
        recipeId: 'refine_water_to_spd1',
        name: 'Refine Water to Speed Injector',
        type: 'REFINE',
        inputMaterials: { 'mat_water': 9 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'comp_spd_1', amount: 1 } 
    },
    'refine_plants_to_hp1': {
        recipeId: 'refine_plants_to_hp1',
        name: 'Refine Healing Plants to HP Matrix',
        type: 'REFINE',
        inputMaterials: { 'mat_healing_plants': 9 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'comp_hp_1', amount: 1 } 
    },
    'refine_fluid_to_crit1': {
        recipeId: 'refine_fluid_to_crit1',
        name: 'Refine Fluid to Precision Lens',
        type: 'REFINE',
        inputMaterials: { 'mat_strange_fluid': 9 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'comp_crit_1', amount: 1 } 
    },
    
    // --- TIER 1 CRAFT RECIPES (Rustic Set) ---
    'craft_rust_helmet': {
        recipeId: 'craft_rust_helmet',
        name: 'Craft Rustic Helmet',
        type: 'CRAFT',
        inputMaterials: { 'mat_scrap': 15, 'mat_polymer': 5 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'eq_rust_helmet', amount: 1 } 
    },
    'craft_rust_armor': {
        recipeId: 'craft_rust_armor',
        name: 'Craft Rustic Armor',
        type: 'CRAFT',
        inputMaterials: { 'mat_scrap': 25, 'mat_animal_skin': 10 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'eq_rust_armor', amount: 1 }
    },
    'craft_rust_weapon': {
        recipeId: 'craft_rust_weapon',
        name: 'Craft Rustic Club',
        type: 'CRAFT',
        inputMaterials: { 'mat_scrap': 20, 'mat_metal': 5 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'eq_rust_weapon', amount: 1 }
    },
    'craft_rust_boots': {
        recipeId: 'craft_rust_boots',
        name: 'Craft Rustic Boots',
        type: 'CRAFT',
        inputMaterials: { 'mat_animal_skin': 10, 'mat_scrap': 5 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'eq_rust_boots', amount: 1 }
    },
    'craft_rust_gloves': {
        recipeId: 'craft_rust_gloves',
        name: 'Craft Rustic Gloves',
        type: 'CRAFT',
        inputMaterials: { 'mat_animal_skin': 5, 'mat_polymer': 5 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'eq_rust_gloves', amount: 1 }
    },
    'craft_rust_implant': {
        recipeId: 'craft_rust_implant',
        name: 'Craft Rustic Implant',
        type: 'CRAFT',
        inputMaterials: { 'mat_nanochips': 3, 'mat_scrap': 10 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'eq_rust_implant', amount: 1 }
    },
    'craft_rust_accessory': {
        recipeId: 'craft_rust_accessory',
        name: 'Craft Rustic Accessory',
        type: 'CRAFT',
        inputMaterials: { 'mat_energized_crystals': 1, 'mat_metal': 5 },
        inputComponents: {}, inputShopItems: {},
        output: { itemId: 'eq_rust_accessory', amount: 1 }
    },
    
    // --- TIER 1 UPGRADE RECIPES (Component T1 -> T2) ---
    'upgrade_def1_to_def2': {
        recipeId: 'upgrade_def1_to_def2',
        name: 'Upgrade Defense Plate T1 to T2',
        type: 'UPGRADE',
        inputMaterials: { 'mat_metal': 20 },
        inputComponents: { 'comp_def_1': 3 }, 
        inputShopItems: { 'slot_unlock_token': 1 }, // (Exemplo ajustado)
        output: { itemId: 'comp_def_2', amount: 1 } 
    }
};
