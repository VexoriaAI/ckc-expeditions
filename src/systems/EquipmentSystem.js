/* ====================================================================
// SYSTEM: EquipmentSystem.js
// Logic for managing equipment, including equipping/unequipping items 
// and the critical 'Auto Equip' function.
// Language: English
// ==================================================================== */

// Using standard named imports. This will work if GameState.js is correct.
import { getState, updateState } from '../core/GameState.js';
import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { calculateFinalStats, calculatePowerScore } from './StatCalculationSystem.js';

/**
 * Calculates the Power Score of a single InventoryItem (Equipment).
 * This function considers the item's base stats PLUS the stats from its embedded components.
 * @param {object} itemInstance - An InventoryItem instance from playerInventory.equipment.
 * @returns {number} The calculated Power Score.
 */
const getEquipmentPowerScore = (itemInstance) => {
    const itemStaticData = EQUIPMENT_DB[itemInstance.item_id];
    if (!itemStaticData) return 0;

    let combinedStats = { ...itemStaticData.base_stats };

    for (const slot of itemInstance.slots) {
        if (slot.component_id) {
            const componentStaticData = COMPONENTS_DB[slot.component_id];
            for (const stat in componentStaticData.stats) {
                combinedStats[stat] = (combinedStats[stat] || 0) + componentStaticData.stats[stat];
            }
        }
    }
    return calculatePowerScore(combinedStats);
};

export const EquipmentSystem = {

    /**
     * Attempts to automatically equip the highest Power Score item 
     * for each slot from the player's inventory.
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
        
        // 1. Unequip everything first
        equipmentInventory.forEach(item => {
            item.isEquipped = false;
        });

        // Object to track the best item found for each slot
        const bestItemBySlot = {};

        // 2. Find the best item for each slot
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

        // 3. Equip the best found items
        for (const slotType in bestItemBySlot) {
            const itemToEquip = bestItemBySlot[slotType];
            if (itemToEquip) {
                itemToEquip.isEquipped = true;
                changesMade = true;
            }
        }

        // 4. Update the GameState if changes occurred
        if (changesMade) {
            updateState({ 
                playerInventory: { 
                    ...state.playerInventory, 
                    equipment: equipmentInventory 
                } 
            });
        }
    },
    
    /**
     * Helper to retrieve all currently equipped items for the active Kid.
     * @returns {Array<object>} Array of equipped InventoryItem instances.
     */
    getEquippedItems: function() {
        const state = getState();
        // Ensure equipment array exists before filtering
        if (!state.playerInventory || !state.playerInventory.equipment) {
            return [];
        }
        return state.playerInventory.equipment.filter(item => item.isEquipped);
    },
};
