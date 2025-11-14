/* ====================================================================
// DATABASE: CRAFTING_RULES
// UPDATE: Adiciona SLOTS_BY_RARITY e SLOT_UNLOCK_RULES.
// Language: English
// ==================================================================== */

/**
 * SYNERGY_MAP: Define qual 'type' de Componente pode ir em qual 'synergy' de Equipamento.
 */
export const SYNERGY_MAP = {
    'defense': ['defense', 'heal', 'universal'],
    'damage': ['damage', 'speed', 'universal'],
    'speed': ['speed', 'universal'],
    'universal': ['defense', 'damage', 'speed', 'heal', 'universal']
};

/**
 * SLOTS_BY_RARITY: (NOVO) Define o NÚMERO TOTAL de slots de 
 * componente que um item tem baseado na sua Raridade.
 */
export const SLOTS_BY_RARITY = {
    'COMMON': 2,
    'UNCOMMON': 2,
    'RARE': 3,
    'MYTHIC': 4
};

/**
 * SLOT_UNLOCK_RULES: (NOVO) Define qual TIER de item é 
 * necessário para destravar cada slot (índice 0-based).
 */
export const SLOT_UNLOCK_RULES = {
    0: 1,  // Slot 1 (Índice 0) destrava no Tier 1
    1: 3,  // Slot 2 (Índice 1) destrava no Tier 3
    2: 5,  // Slot 3 (Índice 2) destrava no Tier 5 (Apenas Rare/Mythic)
    3: 8   // Slot 4 (Índice 3) destrava no Tier 8 (Apenas Mythic)
};


/**
 * RARITY_MULTIPLIERS: (Mantido) Define o multiplicador de stats.
 */
export const RARITY_MULTIPLIERS = {
    'COMMON': { score_multiplier: 1.0, stat_bonus_min: 0, stat_bonus_max: 0 },
    'UNCOMMON': { score_multiplier: 1.15, stat_bonus_min: 1, stat_bonus_max: 3 },
    'RARE': { score_multiplier: 1.35, stat_bonus_min: 5, stat_bonus_max: 10 },
    'MYTHIC': { score_multiplier: 1.6, stat_bonus_min: 15, stat_bonus_max: 25 }
};

/**
 * SHOP_ITEMS_DB: Define itens consumíveis da loja.
 */
export const SHOP_ITEMS_DB = {
    'boost_token': {
        name: 'Crafting Boost Token',
        description: 'Increases the success rate or reduces material cost.',
        iconPath: 'assets/items/shop/boost_token.png',
        price_tezerium: 50
    },
    'slot_unlock_token': {
        name: 'Slot Unlock Token',
        description: 'Used to instantly unlock the next available equipment slot.',
        iconPath: 'assets/items/shop/slot_unlock_token.png',
        price_tezerium: 150
    },
    'rarity_upgrade_token': { // (NOVO) Item para sua mecânica
        name: 'Rarity Upgrade Matrix',
        description: 'Consumable used to upgrade an item\'s rarity (e.g., Common to Uncommon).',
        iconPath: 'assets/items/shop/rarity_upgrade_token.png',
        price_tezerium: 500
    },
    'ap_refill': {
        name: 'AP Refill Vial',
        description: 'Consumable that instantly restores all Action Points.',
        iconPath: 'assets/items/shop/ap_refill.png',
        price_tezerium: 20
    }
};
