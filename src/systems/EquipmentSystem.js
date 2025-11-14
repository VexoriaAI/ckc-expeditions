/* ====================================================================
// SYSTEM: EquipmentSystem.js
// Logic for managing equipment, including equipping/unequipping items 
// and the critical 'Auto Equip' function.
// Language: English
// ==================================================================== */

// IMPORTS CORRIGIDOS: Verifique se o caminho ../core/GameState.js está correto 
// e se as exportações no GameState.js estão intactas.
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

    // Start with base stats
    let combinedStats = { ...itemStaticData.base_stats };

    // Add component stats
    for (const slot of itemInstance.slots) {
        if (slot.component_id) {
            const componentStaticData = COMPONENTS_DB[slot.component_id];
            for (const stat in componentStaticData.stats) {
                combinedStats[stat] = (combinedStats[stat] || 0) + componentStaticData.stats[stat];
            }
        }
    }

    // Calculate Power Score based on combined stats
    return calculatePowerScore(combinedStats);
};

export const EquipmentSystem = {

    /**
     * Attempts to automatically equip the highest Power Score item 
     * for each slot from the player's inventory. (GDD Requirement)
     * Mutates the GameState.
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
        
        // 1. Unequip everything first to clear the slate and prepare for new equipment.
        equipmentInventory.forEach(item => {
            item.isEquipped = false;
        });

        // Object to track the best item found for each slot
        const bestItemBySlot = {};

        // 2. Find the best item for each slot
        for (const slotType of EQUIPMENT_SLOTS) {
            let bestScore = -1;
            let bestItem = null;

            // Filter items that match the current slot type
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
                console.log(`Equipped ${itemToEquip.item_id} in ${slotType} with score ${getEquipmentPowerScore(itemToEquip)}`);
            }
        }

        // 4. Update the GameState if changes occurred
        if (changesMade) {
            // Must update the entire playerInventory to ensure immutability standards
            updateState({ 
                playerInventory: { 
                    ...state.playerInventory, 
                    equipment: equipmentInventory // Pass the modified array
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
        return state.playerInventory.equipment.filter(item => item.isEquipped);
    },

    // Future methods: equipItem(instanceId, slotType), unequipItem(instanceId)
};
