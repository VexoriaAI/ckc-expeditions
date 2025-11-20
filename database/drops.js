/* ====================================================================
// DATABASE: DROPS (V3.0 - Node Types)
// UPDATE: Tabela de loot reestruturada por TIPO DE NÓ (Subtype).
// Isso permite que locais específicos do mapa tenham drops temáticos.
// ==================================================================== */

export const DROP_TABLES = {

    // =================================================
    // --- BIOMA: BURNING RIDGE (Detalhamento Tático) ---
    // =================================================

    // 1. Campos de Obsidiana (Foco: Crafting de Vidro/Pedra)
    'OBSIDIAN_FIELD': {
        "collect": [
            { item: "mat_volcanic_pumice_stone", quantity: [1, 3] } 
        ],
        "investigate": [
            { chance: 20, type: "nothing" },
            { chance: 60, type: "common", item: "mat_volcanic_pumice_stone", quantity: [2, 5] },
            { chance: 90, type: "uncommon", item: "mat_obsidian_tears", quantity: [1, 2] },
            { chance: 100, type: "rare", item: "mat_obsidian_core", quantity: [1, 1] } // T2 Material
        ]
    },

    // 2. Lagos de Magma (Foco: Energia/Calor)
    'MAGMA_POOL': {
        "collect": [
            { item: "mat_magma", quantity: [1, 2] } 
        ],
        "investigate": [
            { chance: 30, type: "nothing" },
            { chance: 70, type: "common", item: "mat_magma", quantity: [2, 4] },
            { chance: 95, type: "uncommon", item: "mat_metal", quantity: [1, 3] }, // Metal derretido
            { chance: 100, type: "rare", item: "mat_obsidian_core", quantity: [1, 1] }
        ]
    },

    // 3. Aberturas Vulcânicas (Alto Risco, Mistura de drops)
    'VOLCANIC_VENT': {
        "collect": [
            { item: "mat_metal", quantity: [1, 3] }
        ],
        "investigate": [
            { chance: 25, type: "nothing" },
            { chance: 60, type: "common", item: "mat_metal", quantity: [3, 6] },
            { chance: 85, type: "uncommon", item: "mat_magma", quantity: [2, 4] },
            { chance: 100, type: "rare", item: "volcanics_core", quantity: [1, 1] } // Boss drop raro
        ]
    },

    // 4. Pico do Vulcão (End-game do bioma)
    'VOLCANIC_PEAK': {
        "collect": [
            { item: "mat_obsidian_tears", quantity: [1, 1] } // Coleta difícil
        ],
        "investigate": [
            { chance: 10, type: "nothing" },
            { chance: 50, type: "common", item: "mat_obsidian_tears", quantity: [2, 4] },
            { chance: 90, type: "uncommon", item: "mat_obsidian_core", quantity: [1, 2] },
            { chance: 100, type: "rare", item: "volcanics_core", quantity: [1, 1] }
        ]
    },

    // 5. Ruínas Antigas (Lore + Materiais Tecnológicos)
    'RUINS': {
        "collect": [
            { item: "mat_scrap", quantity: [2, 5] }
        ],
        "investigate": [
            { chance: 40, type: "nothing" },
            { chance: 80, type: "common", item: "mat_scrap", quantity: [5, 10] },
            { chance: 95, type: "uncommon", item: "mat_nanochips", quantity: [1, 2] }, // Drop cruzado (Nocturnal)
            { chance: 100, type: "rare", item: "slot_unlock_token", quantity: [1, 1] } // Item muito raro
        ]
    },

    // 6. Pontos de Trânsito/Fronteira (Drops básicos de sobrevivência)
    'BORDER_CROSSING': {
        "collect": [
            { item: "mat_scrap", quantity: [1, 2] }
        ],
        "investigate": [
            { chance: 50, type: "nothing" },
            { chance: 90, type: "common", item: "mat_scrap", quantity: [2, 4] },
            { chance: 100, type: "uncommon", item: "mat_food", quantity: [1, 1] }
        ]
    },


    // =================================================
    // --- BIOMAS GENÉRICOS (Fallback para mapas não refatorados) ---
    // =================================================
    
    'ABANDONED_MINES': {
        "collect": [ { item: "mat_water", quantity: [1, 5] } ],
        "investigate": [
            { chance: 25, type: "nothing" },
            { chance: 70, type: "common", item: "mat_water", quantity: [8, 12] },
            { chance: 95, type: "uncommon", item: "mat_energized_crystals", quantity: [1, 3] },
            { chance: 100, type: "rare", item: "mat_crystal_lattice", quantity: [1, 1] }
        ]
    },

    'ANCIENT_RUINS': { // ANCIENT_METROPOLIS usa este ID
        "collect": [ { item: "mat_scrap", quantity: [1, 5] } ],
        "investigate": [
            { chance: 20, type: "nothing" },
            { chance: 60, type: "common", item: "mat_scrap", quantity: [5, 10] },
            { chance: 95, type: "uncommon", item: "mat_polymer", quantity: [3, 7] },
            { chance: 100, type: "rare", item: "mat_quantum_energy_core", quantity: [1, 1] }
        ]
    },
    
    'LAKE_RANCID': {
        "collect": [ { item: "mat_strange_fluid", quantity: [1, 5] } ],
        "investigate": [
            { chance: 10, type: "nothing" },
            { chance: 60, type: "common", item: "mat_strange_fluid", quantity: [5, 10] },
            { chance: 90, type: "uncommon", item: "mat_venom_glands", quantity: [1, 2] },
            { chance: 100, type: "rare", item: "mat_stable_isotope", quantity: [1, 1] }
        ]
    },

    'COVENANT_SWAMP': {
        "collect": [ { item: "mat_food", quantity: [1, 5] } ],
        "investigate": [
            { chance: 10, type: "nothing" },
            { chance: 60, type: "common", item: "mat_food", quantity: [5, 12] },
            { chance: 90, type: "uncommon", item: "mat_healing_plants", quantity: [1, 2] },
            { chance: 100, type: "rare", item: "mat_hardened_scales", quantity: [1, 1] }
        ]
    },

    'WASTELAND': {
        "collect": [ { item: "mat_scrap", quantity: [1, 3] } ],
        "investigate": [
            { chance: 50, type: "nothing" },
            { chance: 95, type: "common", item: "mat_scrap", quantity: [2, 6] },
            { chance: 100, type: "rare", item: "mat_food", quantity: [1, 2] }
        ]
    }
};
