/* ====================================================================
// SYSTEM: EquipmentSystem.js
// UPDATE: Adiciona as funções 'equipItem' e 'unequipItem'.
// ==================================================================== */

import { getState, updateState } from '../core/GameState.js';
import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { calculateFinalStats, calculatePowerScore } from './StatCalculationSystem.js';

/**
 * Calcula o Power Score de uma única Instância de Equipamento (Base + Componentes).
 * @param {object} itemInstance - Uma Instância de item do playerInventory.equipment.
 * @returns {number} O Power Score calculado.
 */
const getEquipmentPowerScore = (itemInstance) => {
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

export const EquipmentSystem = {

    /**
     * Tenta equipar automaticamente o item de maior Power Score em cada slot.
     */
    autoEquip: function() {
        const state = getState();
        const equipmentInventory = state.playerInventory.equipment;
        const kidId = state.currentPlayerKidId;
        
        if (!kidId || equipmentInventory.length === 0) {
            console.warn("AutoEquip: No Kid selected or no equipment in inventory.");
            return;
        }

        let changesMade = false;
        
        // 1. Desequipa tudo primeiro
        equipmentInventory.forEach(item => {
            item.isEquipped = false;
        });

        const bestItemBySlot = {};

        // 2. Encontra o melhor item para cada slot
        for (const slotType of EQUIPMENT_SLOTS) {
            let bestScore = -1;
            let bestItem = null;

            const candidateItems = equipmentInventory.filter(item => {
                const staticData = EQUIPMENT_DB[item.item_id];
                return staticData && staticData.slot === slotType;
            });
            
            for (const item of candidateItems) {
                const score = getEquipmentPowerScore(item);
                if (score > bestScore) {
                    bestScore = score;
                    bestItem = item;
                }
            }

            if (bestItem) {
                bestItemBySlot[slotType] = bestItem;
            }
        }

        // 3. Equipa os melhores itens encontrados
        for (const slotType in bestItemBySlot) {
            const itemToEquip = bestItemBySlot[slotType];
            if (itemToEquip) {
                itemToEquip.isEquipped = true;
                changesMade = true;
            }
        }

        // 4. Atualiza o GameState
        if (changesMade) {
            updateState({ 
                playerInventory: { ...state.playerInventory, equipment: equipmentInventory } 
            });
        }
    },
    
    /**
     * Desequipa todos os itens atualmente em uso.
     */
    unequipAll: function() {
        const state = getState();
        const equipmentInventory = state.playerInventory.equipment;
        let changesMade = false;
        
        equipmentInventory.forEach(item => {
            if (item.isEquipped) {
                item.isEquipped = false;
                changesMade = true;
            }
        });

        if (changesMade) {
            updateState({ 
                playerInventory: { ...state.playerInventory, equipment: equipmentInventory } 
            });
        }
    },

    /**
     * (NOVO) Equipa um item específico em seu slot, desequipando qualquer item anterior.
     * @param {number} instanceId - O instance_id do item a ser equipado.
     */
    equipItem: function(instanceId) {
        const state = getState();
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        
        const itemToEquip = newInventory.equipment.find(item => item.instance_id === instanceId);
        if (!itemToEquip) {
            console.error(`equipItem: Instância ${instanceId} não encontrada.`);
            return;
        }

        const itemStaticData = EQUIPMENT_DB[itemToEquip.item_id];
        if (!itemStaticData) {
             console.error(`equipItem: Dados estáticos para ${itemToEquip.item_id} não encontrados.`);
            return;
        }
        
        const slotTypeToFill = itemStaticData.slot; // ex: 'helmet'

        // 1. Desequipa qualquer item que já esteja nesse slot
        newInventory.equipment.forEach(item => {
            const staticData = EQUIPMENT_DB[item.item_id];
            if (staticData && staticData.slot === slotTypeToFill && item.isEquipped) {
                item.isEquipped = false;
            }
        });

        // 2. Equipa o novo item
        itemToEquip.isEquipped = true;

        // 3. Atualiza o GameState
        updateState({ playerInventory: newInventory });
    },

    /**
     * (NOVO) Desequipa um item específico.
     * @param {number} instanceId - O instance_id do item a ser desequipado.
     */
    unequipItem: function(instanceId) {
        const state = getState();
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        
        const itemToUnequip = newInventory.equipment.find(item => item.instance_id === instanceId);
        
        if (itemToUnequip && itemToUnequip.isEquipped) {
            itemToUnequip.isEquipped = false;
            updateState({ playerInventory: newInventory });
        }
    },

    /**
     * Helper para obter todos os itens equipados.
     * @returns {Array<object>} Array de instâncias de itens equipados.
     */
    getEquippedItems: function() {
        const state = getState();
        if (!state.playerInventory || !state.playerInventory.equipment) return [];
        return state.playerInventory.equipment.filter(item => item.isEquipped);
    },
};
