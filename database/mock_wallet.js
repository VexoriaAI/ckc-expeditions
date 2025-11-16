/* ====================================================================
// DATABASE: MOCK_WALLET
// UPDATE: baseStats balanceados conforme a Tribo e Nível.
// ==================================================================== */

// --- Estruturas de Dados Essenciais ---
/** @typedef {object} KidNFT ... */
/** @typedef {object} InventoryItem ... */

// --- Mock Data ---

// 1. DADOS MOCK: Lista de CyberKidz NFTs (Balanceados)
export const MOCK_KIDZ_NFTS = [
    {
        id: '333',
        name: 'Cypher',
        tribe: 'NOCTURNALS',
        level: 1,
        spritePath: 'assets/characters/nocturnals_1.png',
        // Stats Base (Nível 1) - Foco em Agilidade (Speed/AP)
        baseStats: { maxHP: 100, attack: 8, defense: 5, speed: 5, AP: 2 }
    },
    {
        id: '104',
        name: 'Matildo',
        tribe: 'VOLCANICS',
        level: 3,
        spritePath: 'assets/characters/volcanics_2.png',
        // Stats Lvl 3 - Foco em Força (Attack/Defense)
        baseStats: { maxHP: 115, attack: 11, defense: 9, speed: 3, AP: 2 }
    },
    {
        id: '73',
        name: 'SpacePlug',
        tribe: 'NOCTURNALS',
        level: 7,
        spritePath: 'assets/characters/nocturnals_4.png',
        // Stats Lvl 7 (Agilidade) - Note o AP e Speed mais altos
        baseStats: { maxHP: 110, attack: 10, defense: 7, speed: 7, AP: 3 }
    },
    {
        id: '303',
        name: 'Vaz',
        tribe: 'REPTILIANS',
        level: 4,
        spritePath: 'assets/characters/reptilians_1.png',
        // Stats Lvl 4 - Foco em Vitalidade (HP/Attack)
        baseStats: { maxHP: 125, attack: 10, defense: 7, speed: 4, AP: 2 }
    },
    {
        id: '88',
        name: 'NerdFTeam',
        tribe: 'RADIOACTIVES',
        level: 9,
        spritePath: 'assets/characters/radioactives_4.png',
        // Stats Lvl 9 (Tanque) - HP e Defesa altos, Speed baixa
        baseStats: { maxHP: 150, attack: 7, defense: 12, speed: 2, AP: 2 }
    }
];

// 2. DADOS MOCK: Inventário Inicial (com novos itens)
export const MOCK_INVENTORY = {
    materials: {
        'mat_scrap': 150,
        'mat_metal': 25,
        'mat_polymer': 50,
        'mat_water': 10
    },

    equipment: [
        // --- Item 1 (Common, T1, Equipado no mock) ---
        {
            instance_id: 101, 
            item_id: 'eq_rust_helmet', // Tier 1, Common
            rarity: 'COMMON',
            tier: 1,
            slots: [
                { component_id: 'comp_def_1', isLocked: false }, // T1 (Preenchido)
                { component_id: null, isLocked: true },         // T3
            ]
        },
        // --- Item 2 (Common, T1, Não Equipado) ---
        {
            instance_id: 102, 
            item_id: 'eq_rust_weapon', // Tier 1, Common
            rarity: 'COMMON',
            tier: 1,
            slots: [
                { component_id: null, isLocked: false }, // T1
                { component_id: null, isLocked: true },  // T3
            ]
        },
        // --- Item 3 (RARE, T3) ---
        {
            instance_id: 103, 
            item_id: 'eq_noct_helmet', // Tier 1 (mas vamos forçar T3 para teste)
            rarity: 'RARE',
            tier: 3,
            slots: [ // RARE tem 3 slots
                { component_id: null, isLocked: false }, // T1
                { component_id: null, isLocked: false }, // T3 (Destravado pois o item é T3)
                { component_id: null, isLocked: true },  // T5
            ]
        },
        // --- Item 4 (MYTHIC, T8) ---
        {
            instance_id: 104, 
            item_id: 'eq_noct_weapon', // Tier 1 (mas vamos forçar T8 para teste)
            rarity: 'MYTHIC',
            tier: 8,
            slots: [ // MYTHIC tem 4 slots
                { component_id: null, isLocked: false }, // T1
                { component_id: null, isLocked: false }, // T3
                { component_id: null, isLocked: false }, // T5
                { component_id: null, isLocked: false }, // T8 (Destravado)
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
