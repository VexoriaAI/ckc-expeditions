/* ====================================================================
// SYSTEM: StatCalculationSystem.js
// PATH CORRECTION: ../../database/ (para a raiz do projeto)
// ==================================================================== */

import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';

const STATS_SCHEMA = {
    maxHP: 0, currentHP: 0, attack: 0, defense: 0, speed: 0, 
    AP: 0, luck: 0, critChance: 0, critDamage: 0, attackSpeed: 0, hpRegen: 0,
};

export const calculateFinalStats = (kidData, equippedItems) => {
    let finalStats = { ...STATS_SCHEMA, ...kidData.baseStats };
    finalStats.currentHP = finalStats.maxHP;

    for (const itemInstance of equippedItems) {
        const itemStaticData = EQUIPMENT_DB[itemInstance.item_id];
        if (!itemStaticData) {
            console.error(`StatSystem Error: Equipment ID not found: ${itemInstance.item_id}`);
            continue;
        }
        for (const stat in itemStaticData.base_stats) {
            finalStats[stat] = (finalStats[stat] || 0) + itemStaticData.base_stats[stat];
        }
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

export const calculatePowerScore = (stats) => {
    let score = 0;
    score += (stats.maxHP || 0); 
    score += (stats.attack || 0) * 5;     
    score += (stats.defense || 0) * 3;    
    score += (stats.speed || 0) * 2;      
    score += (stats.AP || 0) * 10;        
    score += (stats.critChance || 0) * 4;
    score += (stats.luck || 0) * 1;
    return Math.floor(score);
};
