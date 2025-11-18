/* ====================================================================
// SYSTEM: StatCalculationSystem.js
// UPDATE: (Etapa 2.1 - Atributos de Combate)
// - Expande o STATS_SCHEMA com os novos 11 atributos.
// - Atualiza 'calculatePowerScore' com pesos para os novos stats.
// ==================================================================== */

import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';

/**
 * Define o conjunto completo de atributos que um Kid pode ter.
 * (Agora inclui Stats Defensivos, Ofensivos Avançados e Resistências)
 */
const STATS_SCHEMA = {
    // Base
    maxHP: 0, currentHP: 0, 
    attack: 0, defense: 0, speed: 0, AP: 0, 
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
    finalStats.currentHP = finalStats.maxHP; // Reseta HP ao máximo (para display no Hub)

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
 * (ATUALIZADO) Calcula o "Power Score" de um conjunto de stats.
 * Atribui pesos diferentes baseados na utilidade do atributo.
 */
export const calculatePowerScore = (stats) => {
    let score = 0;

    // Base Stats
    score += (stats.maxHP || 0) * 1;
    score += (stats.attack || 0) * 5;
    score += (stats.defense || 0) * 3;
    score += (stats.speed || 0) * 2;
    score += (stats.AP || 0) * 10; // AP é muito valioso
    score += (stats.hpRegen || 0) * 2;
    score += (stats.luck || 0) * 1;

    // Ofensivo Avançado
    score += (stats.critChance || 0) * 4;
    score += (stats.critDamage || 0) * 2;
    score += (stats.attackSpeed || 0) * 3;
    score += (stats.lifesteal || 0) * 5;   // Lifesteal é muito forte em Idle
    score += (stats.fireDamage || 0) * 3;  // Dano elemental puro
    score += (stats.stunChance || 0) * 5;  // Controle é valioso

    // Defensivo Avançado
    score += (stats.blockChance || 0) * 3;
    score += (stats.blockAmount || 0) * 1;
    score += (stats.dodgeChance || 0) * 4; // Negar dano é forte
    score += (stats.thorns || 0) * 2;

    // Resistências (Peso menor pois são situacionais)
    score += (stats.fireResist || 0) * 1;
    score += (stats.toxinResist || 0) * 1;
    score += (stats.energyResist || 0) * 1;

    // Utilidade
    score += (stats.cooldownReduction || 0) * 4; // Acelera skills

    return Math.floor(score);
};

/**
 * Calcula o Power Score de UMA Instância de Equipamento.
 * Usado pelo AutoEquip e Sort By.
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
