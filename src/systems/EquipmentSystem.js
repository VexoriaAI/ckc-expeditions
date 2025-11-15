/* ====================================================================
// SYSTEM: EquipmentSystem.js
// UPDATE: Adiciona a função 'unequipAll'.
// ==================================================================== */

import { getState, updateState } from '../core/GameState.js';
import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { calculateFinalStats, calculatePowerScore } from './StatCalculationSystem.js';

// ... (getEquipmentPowerScore - sem alteração) ...
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
    autoEquip: function() {
        // ... (lógica do autoEquip - sem alteração) ...
        const state = getState();
        const equipmentInventory = state.playerInventory.equipment;
        const kidId = state.currentPlayerKidId;
        if (!kidId || equipmentInventory.length === 0) return;
        let changesMade = false;
        equipmentInventory.forEach(item => { item.isEquipped = false; });
        const bestItemBySlot = {};
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
            if (bestItem) bestItemBySlot[slotType] = bestItem;
        }
        for (const slotType in bestItemBySlot) {
            const itemToEquip = bestItemBySlot[slotType];
            if (itemToEquip) {
                itemToEquip.isEquipped = true;
                changesMade = true;
            }
        }
        if (changesMade) {
            updateState({ 
                playerInventory: { ...state.playerInventory, equipment: equipmentInventory } 
            });
        }
    },
    
    /**
     * (NOVO) Desequipa todos os itens.
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

    getEquippedItems: function() {
        // ... (lógica do getEquippedItems - sem alteração) ...
        const state = getState();
        if (!state.playerInventory || !state.playerInventory.equipment) return [];
        return state.playerInventory.equipment.filter(item => item.isEquipped);
    },
};
