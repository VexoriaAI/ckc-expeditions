/* ====================================================================
// SYSTEM: StatCalculationSystem.js
// Pura lógica para calcular os atributos finais de um CyberKid.
// Inclui a função utilitária para calcular o 'Power Score' do GDD.
// ==================================================================== */

import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';

/**
 * Define o conjunto completo de atributos que um Kid pode ter.
 * Usado para inicialização e agregação de stats.
 */
const STATS_SCHEMA = {
    maxHP: 0,
    currentHP: 0, // Adicionado para rastrear vida atual
    attack: 0,
    defense: 0,
    speed: 0, // Usado para Movement Points (MP)
    AP: 0,    // Action Points
    luck: 0,
    critChance: 0,
    critDamage: 0,
    attackSpeed: 0,
    hpRegen: 0,
    // Futuros stats podem ser adicionados aqui
};

/**
 * Calcula os atributos finais de um Kid, incluindo bônus de equipamento e componentes.
 * @param {object} kidData - O objeto KidNFT (com baseStats).
 * @param {Array<object>} equippedItems - Array de InventoryItem's equipados pelo Kid.
 * @returns {object} O objeto de atributos finais.
 */
export const calculateFinalStats = (kidData, equippedItems) => {
    // 1. Inicia o total com os baseStats do Kid.
    let finalStats = { 
        ...STATS_SCHEMA, 
        ...kidData.baseStats 
    };
    
    // Inicializa currentHP com maxHP
    finalStats.currentHP = finalStats.maxHP;

    // 2. Itera sobre os itens equipados
    for (const itemInstance of equippedItems) {
        const itemStaticData = EQUIPMENT_DB[itemInstance.item_id];

        if (!itemStaticData) {
            console.error(`StatSystem Error: Equipment ID not found: ${itemInstance.item_id}`);
            continue;
        }

        // A. Adiciona stats base do equipamento
        for (const stat in itemStaticData.base_stats) {
            finalStats[stat] = (finalStats[stat] || 0) + itemStaticData.base_stats[stat];
        }

        // B. Itera sobre os slots e adiciona stats dos componentes
        for (const slot of itemInstance.slots) {
            if (slot.component_id) {
                const componentStaticData = COMPONENTS_DB[slot.component_id];
                
                if (!componentStaticData) {
                    console.error(`StatSystem Error: Component ID not found: ${slot.component_id}`);
                    continue;
                }
                
                for (const stat in componentStaticData.stats) {
                    finalStats[stat] = (finalStats[stat] || 0) + componentStaticData.stats[stat];
                }
            }
        }
    }
    
    // 3. (Lógica Futura): Aplica modificadores de buff/debuff/tribo aqui.

    return finalStats;
};

/**
 * Calcula o "Power Score" de um item ou do Kid inteiro.
 * O GDD define: "Power Score" = soma simples de stats + stats de componentes.
 *
 * @param {object} stats - Um objeto de stats (baseStats ou finalStats).
 * @returns {number} O Power Score total.
 */
export const calculatePowerScore = (stats) => {
    let score = 0;
    
    // Prioriza stats de combate/vida.
    score += (stats.maxHP || 0); 
    score += (stats.attack || 0) * 5;     // Dano é mais valioso
    score += (stats.defense || 0) * 3;    // Defesa é intermediária
    score += (stats.speed || 0) * 2;      // Velocidade/MP é menor
    score += (stats.AP || 0) * 10;        // Action Points é muito valioso
    score += (stats.critChance || 0) * 4;
    score += (stats.luck || 0) * 1;
    
    // Opcional: Adicionar lógica de peso para balanceamento
    
    return Math.floor(score);
};

// NOTA: Para calcular o Power Score de um item (GDD item score), 
// basta passar os base_stats + component_stats do item para calculatePowerScore.
