/* ====================================================================
// DATABASE: MOCK_WALLET
// UPDATE: Adiciona os blueprints (IDs) do Rustic Set 
// ao 'MOCK_KNOWN_BLUEPRINTS'.
// ==================================================================== */

// --- Estruturas de Dados Essenciais ---
/** @typedef {object} KidNFT ... */
/** @typedef {object} InventoryItem ... */

// 1. DADOS MOCK: Lista de CyberKidz NFTs (Balanceados)
export const MOCK_KIDZ_NFTS = [
    {
        id: '#333',
        name: 'Cypher',
        tribe: 'NOCTURNALS',
        level: 1,
        spritePath: 'assets/characters/nocturnals_1.png',
        baseStats: { maxHP: 100, attack: 8, defense: 5, speed: 5, AP: 2 }
    },
    {
        id: '#104',
        name: 'Matildo',
        tribe: 'VOLCANICS',
        level: 3,
        spritePath: 'assets/characters/volcanics_2.png',
        baseStats: { maxHP: 115, attack: 11, defense: 9, speed: 3, AP: 2 }
    },
    {
        id: '#73',
        name: 'SpacePlug',
        tribe: 'NOCTURNALS',
        level: 7,
        spritePath: 'assets/characters/nocturnals_4.png',
        baseStats: { maxHP: 110, attack: 10, defense: 7, speed: 7, AP: 3 }
    },
    {
        id: '#303',
        name: 'Vaz',
        tribe: 'REPTILIANS',
        level: 4,
        spritePath: 'assets/characters/reptilians_1.png',
        baseStats: { maxHP: 125, attack: 10, defense: 7, speed: 4, AP: 2 }
    },
    {
        id: '#88',
        name: 'NerdFTeam',
        tribe: 'RADIOACTIVES',
        level: 9,
        spritePath: 'assets/characters/radioactives_4.png',
        baseStats: { maxHP: 150, attack: 7, defense: 12, speed: 2, AP: 2 }
    }
];

// 2. DADOS MOCK: Inventário Inicial
export const MOCK_INVENTORY = {
    materials: {
        'mat_scrap': 150,
        'mat_metal': 25,
        'mat_polymer': 50,
        'mat_water': 10,
        'mat_animal_skin': 20, // (Adicionado para as novas receitas)
        'mat_nanochips': 5,
        'mat_energized_crystals': 3,
    },
    equipment: [
        {
            instance_id: 101, 
            item_id: 'eq_rust_helmet', 
            rarity: 'COMMON',
            tier: 1,
            slots: [
                { component_id: 'comp_def_1', isLocked: false }, 
                { component_id: null, isLocked: true },
            ]
        },
        {
            instance_id: 102, 
            item_id: 'eq_rust_weapon', 
            rarity: 'COMMON',
            tier: 1,
            slots: [
                { component_id: null, isLocked: false }, 
                { component_id: null, isLocked: true },
            ]
        },
        {
            instance_id: 103, 
            item_id: 'eq_noct_helmet', 
            rarity: 'RARE',
            tier: 3,
            slots: [ 
                { component_id: null, isLocked: false }, 
                { component_id: null, isLocked: false }, 
                { component_id: null, isLocked: true },
            ]
        },
        {
            instance_id: 104, 
            item_id: 'eq_noct_weapon', 
            rarity: 'MYTHIC',
            tier: 8,
            slots: [ 
                { component_id: null, isLocked: false }, 
                { component_id: null, isLocked: false }, 
                { component_id: null, isLocked: false }, 
                { component_id: null, isLocked: false }, 
            ]
        },
    ],
    components: [
        { instance_id: 201, item_id: 'comp_def_1' }, 
        { instance_id: 202, item_id: 'comp_dmg_1' },
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

// ====================================================================
// 4. DADOS MOCK: Receitas Conhecidas (Blueprints)
// (ATUALIZADO: Contém todas as receitas do Rustic Set)
// ====================================================================
export const MOCK_KNOWN_BLUEPRINTS = [
    // --- Receitas de Componentes T1 (Iniciais) ---
    'refine_scrap_to_def1',
    'refine_magma_to_dmg1',
    'refine_water_to_spd1',
    'refine_plants_to_hp1',
    'refine_fluid_to_crit1',

    // --- Receitas de Equipamento T1 (Iniciais) ---
    'craft_rust_helmet',
    'craft_rust_armor',
    'craft_rust_weapon',
    'craft_rust_boots',
    'craft_rust_gloves',
    'craft_rust_implant',
    'craft_rust_accessory',
    
    // --- Receitas T2 (Raras - Simula um drop encontrado) ---
    'upgrade_def1_to_def2', // (Tipo 'UPGRADE', não aparecerá na aba 'CRAFT')
];
