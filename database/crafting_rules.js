/* ====================================================================
// DATABASE: CRAFTING_RULES
// Defines rules for complex mechanics: Embed Synergy and Rarity Multipliers.
// Language: English
// ==================================================================== */

/**
 * SYNERGY_MAP: Defines which Component 'type' can be embedded into which Equipment 'synergy'.
 * 'UNIVERSAL' synergy/type can always be mixed.
 */
export const SYNERGY_MAP = {
    // Equipment Synergy -> Allowed Component Types
    'defense': [
        'defense',   // Defense gear prefers Defense/HP components
        'heal',      // Supports healing/regen components
        'universal'
    ],
    'damage': [
        'damage',    // Damage gear prefers Damage/Crit components
        'speed',     // Also accepts speed for fast attacks
        'universal'
    ],
    'speed': [
        'speed',     // Speed gear prefers Speed/AP components
        'universal'
    ],
    'universal': [
        'defense', 
        'damage', 
        'speed', 
        'heal', 
        'universal'  // Universal slots accept any component type
    ]
};

/**
 * RARITY_MULTIPLIERS: Defines the stat bonus multiplier for each rarity level.
 * Used when crafting/upgrading an Equipment instance.
 */
export const RARITY_MULTIPLIERS = {
    'COMMON': {
        score_multiplier: 1.0,  // No bonus
        stat_bonus_min: 0,
        stat_bonus_max: 0
    },
    'UNCOMMON': {
        score_multiplier: 1.15, // 15% increase in stat score influence
        stat_bonus_min: 1,      // Adds small random bonus to 1-2 stats
        stat_bonus_max: 3
    },
    'RARE': {
        score_multiplier: 1.35, // 35% increase in stat score influence
        stat_bonus_min: 5,
        stat_bonus_max: 10
    },
    'MYTHIC': {
        score_multiplier: 1.6,  // 60% increase in stat score influence (Used for IA/Unique Weapons)
        stat_bonus_min: 15,
        stat_bonus_max: 25
    }
};

/**
 * UPGRADE_COSTS: Defines the standardized material cost to upgrade a Component or Equipment 
 * between tiers (e.g., T1 -> T2).
 */
export const UPGRADE_COSTS = {
    'T1_TO_T2_COMPONENT': {
        inputMaterials: { 'mat_metal': 50, 'mat_polymer': 50 },
        inputShopItems: { 'boost_token': 1 }
    },
    'T1_TO_T2_EQUIPMENT': {
        inputMaterials: { 'mat_metal': 100, 'mat_polymer': 100, 'mat_energized_crystals': 10 },
        inputShopItems: { 'slot_unlock_token': 1 }
    }
    // More tiers (T2->T3, etc.) can be added here
};

/**
 * SHOP_ITEMS_DB: Defines the properties of consumable items sold in the shop.
 * Used primarily by the crafting system.
 */
export const SHOP_ITEMS_DB = {
    'boost_token': {
        name: 'Crafting Boost Token',
        description: 'Increases the success rate or reduces material cost in certain recipes.',
        iconPath: 'assets/items/shop/boost_token.png',
        price_tezerium: 50 // Tezerium Token (GDD: VIII)
    },
    'slot_unlock_token': {
        name: 'Slot Unlock Token',
        description: 'Used to permanently unlock a locked component slot on equipment.',
        iconPath: 'assets/items/shop/slot_unlock_token.png',
        price_tezerium: 150
    },
    'ap_refill': {
        name: 'AP Refill Vial',
        description: 'Consumable item that instantly restores all Action Points during an expedition.',
        iconPath: 'assets/items/shop/ap_refill.png',
        price_tezerium: 20
    }
};
