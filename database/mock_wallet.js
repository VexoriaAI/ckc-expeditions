/* ====================================================================
// DATABASE: MOCK_WALLET
// Simula o conteúdo da carteira Tezos do jogador (NFTs, Inventário inicial, Token Tezerium).
// Exporta todos os dados como 'const' conforme o GDD.
// ==================================================================== */

// --- Estruturas de Dados Essenciais ---

/**
 * @typedef {object} KidNFT - Simula um NFT do CyberKidz.
 * @property {string} id - O ID da instância NFT (Token ID).
 * @property {string} name - Nome ou Título do Kid.
 * @property {string} tribe - Tribo à qual pertence (VOLCANICS, NOCTURNALS, etc.).
 * @property {number} level - Nível de experiência.
 * @property {string} spritePath - Caminho para a imagem visual do Kid.
 * @property {object} baseStats - Atributos iniciais do Kid (sem equipamento).
 */

/**
 * @typedef {object} InventoryItem - Simula um item único com estado (Equipamento ou Componente).
 * @property {number} instance_id - ID único da instância no inventário (não é o Token ID da NFT).
 * @property {string} item_id - Referência ao ID no database correspondente (ex: 'eq_rust_helmet').
 * @property {object} [slots] - Apenas para Equipamentos: Estado dos slots de embed.
 */


// --- Mock Data ---

// 1. DADOS MOCK: Lista de CyberKidz NFTs
export const MOCK_KIDZ_NFTS = [
    {
        id: 'CKID-DEMO-001',
        name: 'Cypher (Protótipo)',
        tribe: 'NOCTURNALS',
        level: 10,
        spritePath: 'assets/characters/nocturnals_kid_1.png',
        baseStats: {
            maxHP: 100,
            attack: 8,
            defense: 5,
            speed: 5, // Usado para MP (Movimento)
            AP: 2,    // Ações por turno/rodada
        }
    },
    {
        id: 'CKID-DEMO-002',
        name: 'Vulk (Forja)',
        tribe: 'VOLCANICS',
        level: 8,
        spritePath: 'assets/characters/volcanics_kid_2.png',
        baseStats: {
            maxHP: 120,
            attack: 6,
            defense: 10,
            speed: 3,
            AP: 2,
        }
    }
];

// 2. DADOS MOCK: Inventário Inicial
export const MOCK_INVENTORY = {
    // Materiais: Usam a estrutura { item_id: quantidade }
    materials: {
        'mat_scrap': 150,
        'mat_metal': 25,
        'mat_polymer': 50,
        'mat_water': 10
    },

    // Equipamentos: Usam a estrutura [ { instance_id, item_id, slots } ]
    equipment: [
        {
            instance_id: 101, 
            item_id: 'eq_rust_helmet', // Exemplo de item (A ser definido em equipment.js)
            slots: [ // 3 slots (GDD)
                { component_id: null, isLocked: false, isUnlockable: false }, // Slot 1: Vazio e Destravado
                { component_id: 'comp_def_1', isLocked: false, isUnlockable: false }, // Slot 2: Preenchido (A ser definido em components.js)
                { component_id: null, isLocked: true, isUnlockable: true } // Slot 3: Travado, mas pode ser destravado
            ]
        },
        {
            instance_id: 102, 
            item_id: 'eq_proto_weapon', // Exemplo de arma
            slots: [
                { component_id: null, isLocked: false, isUnlockable: false },
                { component_id: null, isLocked: true, isUnlockable: false },
                { component_id: null, isLocked: true, isUnlockable: false }
            ]
        }
    ],

    // Componentes: Usam a estrutura [ { instance_id, item_id } ]
    components: [
        { instance_id: 201, item_id: 'comp_def_1' }, 
        { instance_id: 202, item_id: 'comp_dmg_2' },
        { instance_id: 203, item_id: 'comp_def_1' } // Componentes duplicados usam instance_id diferentes
    ],

    // Itens de Loja (Consumíveis): Usam a estrutura { item_id: quantidade }
    shopItems: {
        'ap_refill': 3,
        'slot_unlock_token': 1
    },

};

// 3. DADOS MOCK: Saldo de Token Tezerium (Moeda de Consumo)
export const MOCK_TEZERIUM_BALANCE = 500;
