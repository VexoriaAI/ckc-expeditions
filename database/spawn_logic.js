/* ====================================================================
// (NOVO) DATABASE: SPAWN_LOGIC
// Define as tabelas de eventos (Risco) para a ação "Investigate".
// O sistema rolará um D100 (+ Luck) e pegará o primeiro resultado 
// que for MAIOR que a rolagem.
// =F================================================================== */

/* ESTRUTURA:
//
// "investigate": Tabela de Eventos Ponderada (Rolagem D100 + Luck).
//   - chance: O "teto" da rolagem. O sistema checa do menor para o maior.
//   - type: O evento que ocorre.
//     - "nothing": O jogador não encontra nada e perde o AP.
//     - "ambush": O jogador é emboscado (inicia combate).
//     - "loot": O jogador encontra loot (o sistema então rola na drops.js).
//   - enemyRarity: (Se type="ambush") Define a raridade do inimigo a spawnar.
//
*/

export const SPAWN_LOGIC = {

    // --- Bioma Padrão (Baixo Risco, Baixa Recompensa) ---
    'WASTELAND': {
        "investigate": [
            { chance: 40, type: "nothing" },         // 40% chance de Nada
            { chance: 60, type: "ambush", enemyRarity: "common" }, // 20% chance de Emboscada (Comum)
            { chance: 100, type: "loot" }             // 40% chance de Loot (Rola na drops.js)
        ]
    },

    // --- Bioma T1 (Volcanics) ---
    'BURNING_RIDGE': {
        "investigate": [
            { chance: 30, type: "nothing" },         // 30% Nada
            { chance: 65, type: "ambush", enemyRarity: "common" }, // 35% Emboscada (Comum)
            { chance: 100, type: "loot" }             // 35% Loot
        ]
    },

    // --- Bioma T1 (Radioactives) ---
    'LAKE_RANCID': {
         "investigate": [
            { chance: 25, type: "nothing" },         // 25% Nada
            { chance: 70, type: "ambush", enemyRarity: "common" }, // 45% Emboscada (Comum)
            { chance: 100, type: "loot" }             // 30% Loot
        ]
    },

    // --- Bioma T1 (Reptilians) ---
    'COVENANT_SWAMP': {
         "investigate": [
            { chance: 20, type: "nothing" },         // 20% Nada
            { chance: 60, type: "ambush", enemyRarity: "common" }, // 40% Emboscada (Comum)
            { chance: 100, type: "loot" }             // 40% Loot
        ]
    },

    // --- Bioma T1 (Undergrounders) ---
    'ABANDONED_MINES': {
         "investigate": [
            { chance: 35, type: "nothing" },         // 35% Nada
            { chance: 65, type: "ambush", enemyRarity: "common" }, // 30% Emboscada (Comum)
            { chance: 100, type: "loot" }             // 35% Loot
        ]
    },

    // --- Bioma T1 (Nocturnals - Alto Risco, Alta Recompensa) ---
    'ANCIENT_RUINS': {
         "investigate": [
            { chance: 30, type: "nothing" },         // 30% Nada
            { chance: 70, type: "ambush", enemyRarity: "common" }, // 40% Emboscada (Comum)
            { chance: 90, type: "ambush", enemyRarity: "elite" },  // 20% Emboscada (Elite)
            { chance: 100, type: "loot" }             // 10% Loot (Mas o loot em drops.js é melhor)
        ]
    },
    
    // --- Bioma Final (Placeholder) ---
    'CYBERCITY': {
         "investigate": [
            { chance: 100, type: "nothing" } // Não se pode investigar em CyberCity
        ]
    }
};
