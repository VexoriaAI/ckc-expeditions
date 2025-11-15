/* ====================================================================
// DATABASE: CRAFTING_RULES
// UPDATE: Adiciona o "Unstable AI Core" (item de craft de NFT)
// ao SHOP_ITEMS_DB.
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
    
    // --- (NOVO) Item de Crafting de IA ---
    'unstable_ai_core': {
        name: 'Unstable AI Core',
        description: 'Um núcleo de IA volátil. Necessário na "AI Forge" para gerar equipamentos únicos (NFTs).',
        iconPath: 'assets/items/shop/unstable_ai_core.png', // (Caminho placeholder)
        price_tezerium: 2500 // Item de alto valor
    },

    // --- Itens de Upgrade ---
    'rarity_upgrade_token': { 
        name: 'Rarity Upgrade Matrix',
        description: 'Consumable used to upgrade an item\'s rarity (e.g., Common to Uncommon).',
        iconPath: 'assets/items/shop/rarity_upgrade_token.png',
        price_tezerium: 500
    },
    'slot_unlock_token': {
        name: 'Slot Unlock Token',
        description: 'Used to instantly unlock the next available equipment slot.',
        iconPath: 'assets/items/shop/slot_unlock_token.png',
        price_tezerium: 150
    },
    'component_extractor': { // (Item da nossa discussão anterior)
        name: 'Component Extractor',
        description: 'Safely removes an embedded component from a slot without destroying it.',
        iconPath: 'assets/items/shop/component_extractor.png', // (Caminho placeholder)
        price_tezerium: 100
    },

    // --- Itens de Utilidade ---
    'ap_refill': {
        name: 'AP Refill Vial',
        description: 'Consumable that instantly restores all Action Points.',
        iconPath: 'assets/items/shop/ap_refill.png',
        price_tezerium: 20
    }
};
