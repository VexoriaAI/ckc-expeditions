/* ====================================================================
// SYSTEM: StatCalculationSystem.js
// UPDATE: (Passo 1.3 - Fix AP)
// Padroniza 'AP' para 'ap' (minúsculo) para corresponder ao DB.
// ==================================================================== */

import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';

/**
 * Define o conjunto completo de atributos que um Kid pode ter.
 */
const STATS_SCHEMA = {
    // Base
    maxHP: 0, currentHP: 0, 
    attack: 0, defense: 0, speed: 0, 
    ap: 0, // (CORRIGIDO: minúsculo)
    luck: 0, hpRegen: 0,

    // Ofensivo Avançado
    critChance: 0, critDamage: 0, attackSpeed: 0,
    lifesteal: 0, fireDamage: 0, stunChance: 0,

    // Defensivo Avançado
    blockChance: 0, blockAmount: 0, dodgeChance: 0, thorns: 0,

    // Resistências
    fireResist: 0, toxinResist: 0, energyResist: 0,

    // Utilidade
    cooldownReduction: 0
};

/**
 * Calcula os atributos finais de um Kid (Base + Equipamentos + Componentes).
 */
export const calculateFinalStats = (kidData, equippedItems) => {
    // Inicializa com o Schema e os stats base do Kid
    let finalStats = { ...STATS_SCHEMA, ...kidData.baseStats };
    finalStats.currentHP = finalStats.maxHP; 

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

        // B. Adiciona stats dos componentes embutidos
        for (const slot of itemInstance.slots) {
            if (slot.component_id) {
                const componentStaticData = COMPONENTS_DB[slot.component_id];
                if (componentStaticData) {
                    for (const stat in componentStaticData.stats) {
                        finalStats[stat] = (finalStats[stat] || 0) + componentStaticData.stats[stat];
                    }
                }
            }
        }
    }
    return finalStats;
};

/**
 * Calcula o "Power Score" de um conjunto de stats.
 */
export const calculatePowerScore = (stats) => {
    let score = 0;

    // Base Stats
    score += (stats.maxHP || 0) * 1;
    score += (stats.attack || 0) * 5;
    score += (stats.defense || 0) * 3;
    score += (stats.speed || 0) * 2;
    score += (stats.ap || 0) * 10; // (CORRIGIDO: usa 'ap')
    score += (stats.hpRegen || 0) * 2;
    score += (stats.luck || 0) * 1;

    // Ofensivo Avançado
    score += (stats.critChance || 0) * 4;
    score += (stats.critDamage || 0) * 2;
    score += (stats.attackSpeed || 0) * 3;
    score += (stats.lifesteal || 0) * 5;   
    score += (stats.fireDamage || 0) * 3;  
    score += (stats.stunChance || 0) * 5;  

    // Defensivo Avançado
    score += (stats.blockChance || 0) * 3;
    score += (stats.blockAmount || 0) * 1;
    score += (stats.dodgeChance || 0) * 4; 
    score += (stats.thorns || 0) * 2;

    // Resistências
    score += (stats.fireResist || 0) * 1;
    score += (stats.toxinResist || 0) * 1;
    score += (stats.energyResist || 0) * 1;

    // Utilidade
    score += (stats.cooldownReduction || 0) * 4; 

    return Math.floor(score);
};

/**
 * Calcula o Power Score de UMA Instância de Equipamento.
 */
export const getEquipmentPowerScore = (itemInstance) => {
    const itemStaticData = EQUIPMENT_DB[itemInstance.item_id];
    if (!itemStaticData) return 0;

    let combinedStats = { ...itemStaticData.base_stats };

    for (const slot of itemInstance.slots) {
        if (slot.component_id) {
            const componentStaticData = COMPONENTS_DB[slot.component_id];
            if (componentStaticData) {
                for (const stat in componentStaticData.stats) {
                    combinedStats[stat] = (combinedStats[stat] || 0) + componentStaticData.stats[stat];
                }
            }
        }
    }
    return calculatePowerScore(combinedStats);
};
