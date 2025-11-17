/* ====================================================================
// SYSTEM: StatCalculationSystem.js
// UPDATE: (CORREÇÃO DE LÓGICA)
// Fórmula do 'calculatePowerScore' atualizada para incluir
// 'attack', 'critDamage', e 'attackSpeed'.
// ==================================================================== */

import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';

/**
 * Define o conjunto completo de atributos que um Kid pode ter.
 */
const STATS_SCHEMA = {
    maxHP: 0, currentHP: 0, attack: 0, defense: 0, speed: 0, 
    AP: 0, luck: 0, critChance: 0, critDamage: 0, attackSpeed: 0, hpRegen: 0,
};

/**
 * Calcula os atributos finais de um Kid (Base + Equipamentos + Componentes).
 */
export const calculateFinalStats = (kidData, equippedItems) => {
    let finalStats = { ...STATS_SCHEMA, ...kidData.baseStats };
    finalStats.currentHP = finalStats.maxHP;

    for (const itemInstance of equippedItems) {
        const itemStaticData = EQUIPMENT_DB[itemInstance.item_id];
        if (!itemStaticData) {
            console.error(`StatSystem Error: Equipment ID not found: ${itemInstance.item_id}`);
            continue;
        }
        // A. Stats Base do Equipamento
        for (const stat in itemStaticData.base_stats) {
            finalStats[stat] = (finalStats[stat] || 0) + itemStaticData.base_stats[stat];
        }
        // B. Stats dos Componentes
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
 * (ATUALIZADO) Calcula o "Power Score" de um conjunto de stats.
 * Agora inclui todos os stats ofensivos.
 */
export const calculatePowerScore = (stats) => {
    let score = 0;
    score += (stats.maxHP || 0); 
    score += (stats.attack || 0) * 5;     // (Usa 'attack')
    score += (stats.defense || 0) * 3;    
    score += (stats.speed || 0) * 2;      
    score += (stats.AP || 0) * 10;        
    score += (stats.critChance || 0) * 4;
    score += (stats.critDamage || 0) * 2; // (NOVO)
    score += (stats.attackSpeed || 0) * 2; // (NOVO)
    score += (stats.luck || 0) * 1;
    return Math.floor(score);
};

/**
 * Calcula o Power Score de UMA Instância de Equipamento (Base + Componentes).
 * Esta é a função usada pelo AutoEquip e pelo Sort By.
 * @param {object} itemInstance - Uma Instância de item do playerInventory.equipment.
 * @returns {number} O Power Score calculado.
 */
export const getEquipmentPowerScore = (itemInstance) => {
    const itemStaticData = EQUIPMENT_DB[itemInstance.item_id];
    if (!itemStaticData) return 0;

    // Começa com os stats base do item
    let combinedStats = { ...itemStaticData.base_stats };

    // Adiciona os stats dos componentes embutidos
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
    // Retorna o Power Score dos stats combinados
    return calculatePowerScore(combinedStats);
};
