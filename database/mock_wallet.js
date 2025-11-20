/* ====================================================================
// DATABASE: MOCK_WALLET
// UPDATE: Adiciona 6 novos personagens e os novos itens ao inventário.
// ==================================================================== */

// 1. DADOS MOCK: Lista de CyberKidz NFTs
export const MOCK_KIDZ_NFTS = [
    // --- Originais ---
    {
        id: '#333',
        name: 'Cypher',
        tribe: 'NOCTURNALS',
        level: 1,
        spritePath: 'assets/characters/nocturnals_1.png',
        baseStats: { maxHP: 100, attack: 8, defense: 5, speed: 5, ap: 2, dodgeChance: 5, critChance: 5, critDamage: 50 }
    },
    {
        id: '#104',
        name: 'Matildo',
        tribe: 'VOLCANICS',
        level: 3,
        spritePath: 'assets/characters/volcanics_2.png',
        baseStats: { maxHP: 115, attack: 11, defense: 9, speed: 3, ap: 2, fireResist: 10, thorns: 3 }
    },
    {
        id: '#73',
        name: 'SpacePlug',
        tribe: 'NOCTURNALS',
        level: 7,
        spritePath: 'assets/characters/nocturnals_4.png',
        baseStats: { maxHP: 110, attack: 10, defense: 7, speed: 7, ap: 3, dodgeChance: 7, critChance: 8, critDamage: 60 }
    },
    {
        id: '#303',
        name: 'Vaz',
        tribe: 'REPTILIANS',
        level: 4,
        spritePath: 'assets/characters/reptilians_1.png',
        baseStats: { maxHP: 125, attack: 10, defense: 7, speed: 4, ap: 2, hpRegen: 2, lifesteal: 1 }
    },
    {
        id: '#88',
        name: 'NerdFTeam',
        tribe: 'RADIOACTIVES',
        level: 9,
        spritePath: 'assets/characters/radioactives_4.png',
        baseStats: { maxHP: 150, attack: 7, defense: 12, speed: 2, ap: 2, toxinResist: 20, hpRegen: 3 }
    },

    // --- (NOVOS) 6 Personagens Adicionais ---
    {
        id: '#404',
        name: 'Glitch',
        tribe: 'NOCTURNALS',
        level: 5,
        spritePath: 'assets/characters/nocturnals_2.png', // Placeholder visual
        baseStats: { maxHP: 105, attack: 9, defense: 6, speed: 6, ap: 2, dodgeChance: 6, critChance: 10, critDamage: 55 }
    },
    {
        id: '#99',
        name: 'Hazmat',
        tribe: 'RADIOACTIVES',
        level: 6,
        spritePath: 'assets/characters/radioactives_3.png', // Placeholder visual
        baseStats: { maxHP: 140, attack: 6, defense: 10, speed: 3, ap: 2, toxinResist: 25, hpRegen: 4 }
    },
    {
        id: '#777',
        name: 'Jackpot',
        tribe: 'UNDERGROUNDERS',
        level: 8,
        spritePath: 'assets/characters/undergrounders_1.png', // Placeholder visual (Undergrounder usa visual similar a Volcanic por enqto)
        baseStats: { maxHP: 130, attack: 8, defense: 15, speed: 2, ap: 2, blockChance: 10, blockAmount: 5, energyResist: 10 }
    },
    {
        id: '#101',
        name: 'Magma Boy',
        tribe: 'VOLCANICS',
        level: 4,
        spritePath: 'assets/characters/volcanics_5.png',
        baseStats: { maxHP: 120, attack: 12, defense: 8, speed: 3, ap: 2, fireResist: 15, thorns: 5 }
    },
    {
        id: '#55',
        name: 'Scalez',
        tribe: 'REPTILIANS',
        level: 7,
        spritePath: 'assets/characters/reptilians_4.png',
        baseStats: { maxHP: 135, attack: 12, defense: 8, speed: 5, ap: 2, hpRegen: 3, lifesteal: 2 }
    },
    {
        id: '#202',
        name: 'Techie',
        tribe: 'NOCTURNALS',
        level: 3,
        spritePath: 'assets/characters/nocturnals_1.png',
        baseStats: { maxHP: 95, attack: 9, defense: 4, speed: 6, ap: 2, dodgeChance: 4, critChance: 6, critDamage: 40 }
    }
];

// 2. DADOS MOCK: Inventário Inicial
export const MOCK_INVENTORY = {
    materials: {
        'mat_scrap': 150,
        'mat_metal': 25,
        'mat_polymer': 50,
        'mat_water': 10,
        'mat_animal_skin': 20,
        'mat_nanochips': 5,
        'mat_energized_crystals': 3,
        'mat_healing_plants': 10,
        'mat_strange_fluid': 10,
        'mat_magma': 10,
    },
    equipment: [
        { instance_id: 101, item_id: 'eq_rust_helmet', rarity: 'COMMON', tier: 1, slots: [{ component_id: 'comp_def_1', isLocked: false }, { component_id: null, isLocked: true }] },
        { instance_id: 102, item_id: 'eq_rust_weapon', rarity: 'COMMON', tier: 1, slots: [{ component_id: null, isLocked: false }, { component_id: null, isLocked: true }] },
        { instance_id: 103, item_id: 'eq_noct_helmet', rarity: 'RARE', tier: 3, slots: [{ component_id: null, isLocked: false }, { component_id: null, isLocked: false }, { component_id: null, isLocked: true }] },
        { instance_id: 104, item_id: 'eq_noct_weapon', rarity: 'MYTHIC', tier: 8, slots: [{ component_id: null, isLocked: false }, { component_id: null, isLocked: false }, { component_id: null, isLocked: false }, { component_id: null, isLocked: false }] },
        
        // --- (NOVOS) ITENS ADICIONADOS ---
        { 
            instance_id: 2001, 
            item_id: 'eq_volc_sword', // Obsidian Blade
            rarity: 'UNCOMMON', 
            tier: 2, 
            slots: [{ component_id: null, isLocked: false }, { component_id: null, isLocked: false }] 
        },
        { 
            instance_id: 2002, 
            item_id: 'eq_noct_implant', // Shadow Chip
            rarity: 'RARE', 
            tier: 2, 
            slots: [{ component_id: null, isLocked: false }, { component_id: null, isLocked: true }] 
        },
        { 
            instance_id: 2003, 
            item_id: 'eq_rad_accessory', // Isotope Pendant
            rarity: 'RARE', 
            tier: 2, 
            slots: [{ component_id: null, isLocked: false }, { component_id: null, isLocked: true }] 
        },
    ],
    components: [
        { instance_id: 201, item_id: 'comp_def_1' }, 
        { instance_id: 202, item_id: 'comp_atk_1' },
        { instance_id: 203, item_id: 'comp_def_1' } 
    ],
    shopItems: {
        'ap_refill': 3,
        'slot_unlock_token': 1,
        'unstable_ai_core': 1 
    },
};

// 3. DADOS MOCK: Saldo de Token Tezerium
export const MOCK_TEZERIUM_BALANCE = 1000;

// 4. DADOS MOCK: Receitas Conhecidas
export const MOCK_KNOWN_BLUEPRINTS = [
    'refine_scrap_to_def1',
    'refine_magma_to_atk1',
    'refine_water_to_spd1',
    'refine_plants_to_hp1',
    'refine_fluid_to_crit1',
    'craft_rust_helmet',
    'craft_rust_armor',
    'craft_rust_weapon',
    'craft_rust_boots',
    'craft_rust_gloves',
    'craft_rust_implant',
    'craft_rust_accessory',
    'upgrade_def1_to_def2',
];
