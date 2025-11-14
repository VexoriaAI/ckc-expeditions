/* ====================================================================
// DATABASE: DROPS
// Define as tabelas de saque (loot tables) para as ações
// 'Collect Resource' e 'Investigate' em cada bioma,
// com base na planilha de materiais do usuário.
// ==================================================================== */

/* ESTRUTURA:
//
// "collect": Ação de coleta de baixo risco.
//   - item: O ID do material (ex: "mat_scrap").
//   - quantity: [min, max] - A quantidade garantida.
//
// "investigate": Ação de investigação de alto risco (Tabela de Saque Ponderada).
//   - chance: O teto da rolagem (de 1 a 100). O script verifica da menor para a maior.
//   - type: O resultado. "nothing", "common", "uncommon", "rare".
//   - item: (Opcional) O item ganho.
//   - quantity: (Opcional) [min, max] - A quantidade ganha.
//
*/

export const DROP_TABLES = {

    // --- BIOMA 1: VOLCANICS ---
    // Itens: mat_metal (C), mat_magma (U), mat_volcanic_pumice_stone (U), mat_obsidian_tears (R)
    "volcanics": {
        "collect": [
            { item: "mat_metal", quantity: [1, 5] } // Recurso base (Common)
        ],
        "investigate": [
            { chance: 30, type: "nothing" }, // 30% de chance de nada
            { chance: 70, type: "common", item: "mat_metal", quantity: [7, 12] }, // 30% de chance
            { chance: 85, type: "uncommon", item: "mat_magma", quantity: [1, 3] }, // 15% de chance
            { chance: 95, type: "uncommon", item: "mat_volcanic_pumice_stone", quantity: [1, 2] }, // 10% de chance
            { chance: 100, type: "rare", item: "mat_obsidian_tears", quantity: [1, 1] } // 5% de chance
        ]
    },

    // --- BIOMA 2: UNDERGROUNDERS ---
    // Itens: mat_water (C), mat_energized_crystals (U), mat_thermal_water (U), mat_special_clay (U), mat_glass (R)
    "undergrounders": {
        "collect": [
            { item: "mat_water", quantity: [1, 5] } // Recurso base (Common)
        ],
        "investigate": [
            { chance: 25, type: "nothing" }, // 25%
            { chance: 70, type: "common", item: "mat_water", quantity: [8, 12] }, // 30%
            { chance: 80, type: "uncommon", item: "mat_energized_crystals", quantity: [1, 3] }, // 10%
            { chance: 90, type: "uncommon", item: "mat_special_clay", quantity: [1, 3] }, // 10%
            { chance: 95, type: "uncommon", item: "mat_thermal_water", quantity: [1, 2] }, // 5%
            { chance: 100, type: "rare", item: "mat_glass", quantity: [1, 1] } // 5%
        ]
    },

    // --- BIOMA 3: NOCTURNALS ---
    // Itens: mat_scrap (C), mat_metal (C), mat_polymer (U), mat_nanochips (U), mat_cybernetic_implants (U), mat_quantum_energy_core (R)
    "nocturnals": {
        "collect": [
            { item: "mat_scrap", quantity: [1, 5] } // Recurso base (Common)
        ],
        "investigate": [
            { chance: 20, type: "nothing" }, // 20%
            { chance: 60, type: "common", item: "mat_scrap", quantity: [5, 10] }, // 20%
            { chance: 75, type: "common", item: "mat_metal", quantity: [3, 7] }, // 15%
            { chance: 85, type: "uncommon", item: "mat_polymer", quantity: [1, 3] }, // 10%
            { chance: 95, type: "uncommon", item: "mat_nanochips", quantity: [1, 2] }, // 10%
            { chance: 100, type: "rare", item: "mat_quantum_energy_core", quantity: [1, 1] } // 5%
            // Nota: mat_cybernetic_implants (U) foi deixado de fora para balanceamento, pode ser usado em receitas de Craft
        ]
    },
    
    // --- BIOMA 4: RADIOACTIVES ---
    // Itens: mat_scrap (C), mat_strange_fluid (C), mat_parasitic_fungus (U), mat_venom_glands (U), mat_luminescent_algae (R)
    "radioactives": {
        "collect": [
            { item: "mat_strange_fluid", quantity: [1, 5] } // Recurso base (Common)
        ],
        "investigate": [
            { chance: 10, type: "nothing" }, // 10%
            { chance: 60, type: "common", item: "mat_strange_fluid", quantity: [5, 10] }, // 20%
            { chance: 75, type: "common", item: "mat_scrap", quantity: [3, 7] }, // 15%
            { chance: 85, type: "uncommon", item: "mat_parasitic_fungus", quantity: [1, 3] }, // 10%
            { chance: 95, type: "uncommon", item: "mat_venom_glands", quantity: [1, 2] }, // 10%
            { chance: 100, type: "rare", item: "mat_luminescent_algae", quantity: [1, 1] } // 5%
        ]
    },

    // --- BIOMA 5: REPTILIANS ---
    // Itens: mat_food (C), mat_water (C), mat_healing_plants (U), mat_hallucinogenic_fungi (U), mat_animal_skin (U), mat_reptilian_blood (R)
    "reptilians": {
        "collect": [
            { item: "mat_food", quantity: [1, 5] } // Recurso base (Common)
        ],
        "investigate": [
            { chance: 5, type: "nothing" }, // 10%
            { chance: 60, type: "common", item: "mat_food", quantity: [5, 12] }, // 20%
            { chance: 75, type: "common", item: "mat_water", quantity: [3, 7] }, // 15%
            { chance: 85, type: "uncommon", item: "mat_animal_skin", quantity: [1, 3] }, // 10%
            { chance: 95, type: "uncommon", item: "mat_healing_plants", quantity: [1, 2] }, // 10%
            { chance: 100, type: "rare", item: "mat_reptilian_blood", quantity: [1, 1] } // 5%
            // Nota: mat_hallucinogenic_fungi (U) foi deixado de fora para balanceamento
        ]
    },

    // --- BIOMA 6: WASTELAND (Bioma Central) ---
    // Itens: (Nenhum item específico na planilha, usando os Padrões Comuns)
    "wasteland": {
        "collect": [
            { item: "mat_scrap", quantity: [1, 3] } // Padrão
        ],
        "investigate": [
            { chance: 1, type: "nothing" }, // 50%
            { chance: 5, type: "common", item: "mat_scrap", quantity: [2, 6] }, // 30%
            { chance: 20, type: "uncommon", item: "mat_water", quantity: [5, 5] }, // 10%
            { chance: 50, type: "rare", item: "mat_food", quantity: [5, 5] } // 10%
        ]
    }
};
