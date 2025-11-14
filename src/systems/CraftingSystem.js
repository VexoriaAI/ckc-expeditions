/* ====================================================================
// SYSTEM: CraftingSystem.js
// Core logic for all Workshop actions: Refine, Craft, and Embed.
// Includes inventory check, consumption, and item creation logic.
// Language: English
// ==================================================================== */

import { getState, updateState } from '../core/GameState.js';
import { RECIPES_DB } from '../../database/recipes.js';
import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { RARITY_MULTIPLIERS } from '../../database/crafting_rules.js';

/**
 * Generates a globally unique ID for a new item instance.
 * @returns {number} A unique ID.
 */
const generateInstanceId = () => {
    // Uses a combination of timestamp and a small random number for better uniqueness
    return Date.now() + Math.floor(Math.random() * 100000);
};

/**
 * Checks if the player's inventory meets all material, component, and shop item requirements 
 * for a given recipe.
 * @param {object} playerInventory - The current playerInventory object from GameState.
 * @param {object} recipe - The recipe object from RECIPES_DB.
 * @returns {object} { success: boolean, message: string }
 */
const checkInventoryInputs = (playerInventory, recipe) => {
    const { inputMaterials, inputComponents, inputShopItems } = recipe;

    // 1. Check Materials (Stackable Items in materials)
    for (const matId in inputMaterials) {
        const requiredAmount = inputMaterials[matId];
        const ownedAmount = playerInventory.materials[matId] || 0;
        if (ownedAmount < requiredAmount) {
            return { success: false, message: `Missing required Material: ${MATERIALS_DB[matId]?.name || matId.toUpperCase()}. Required: ${requiredAmount}, Owned: ${ownedAmount}` };
        }
    }

    // 2. Check Shop Items (Stackable Consumables in shopItems)
    for (const itemId in inputShopItems) {
        const requiredAmount = inputShopItems[itemId];
        const ownedAmount = playerInventory.shopItems[itemId] || 0;
        if (ownedAmount < requiredAmount) {
            return { success: false, message: `Missing required Shop Item: ${itemId.toUpperCase()}. Required: ${requiredAmount}, Owned: ${ownedAmount}` };
        }
    }

    // 3. Check Components (Requires finding component instances)
    for (const compId in inputComponents) {
        const requiredAmount = inputComponents[compId];
        const ownedInstances = playerInventory.components.filter(c => c.item_id === compId).length;
        if (ownedInstances < requiredAmount) {
            return { success: false, message: `Missing required Component: ${COMPONENTS_DB[compId]?.name || compId.toUpperCase()}. Required: ${requiredAmount}, Owned: ${ownedInstances}` };
        }
    }

    return { success: true, message: "Inputs check passed." };
};

/**
 * Mutates the player's inventory by subtracting all required inputs.
 * NOTE: This function modifies the passed playerInventory object by reference.
 * @param {object} playerInventory - The current playerInventory object (mutated by reference).
 * @param {object} recipe - The recipe object.
 */
const consumeInputs = (playerInventory, recipe) => {
    const { inputMaterials, inputComponents, inputShopItems } = recipe;
    
    // 1. Consume Materials
    for (const matId in inputMaterials) {
        playerInventory.materials[matId] -= inputMaterials[matId];
        if (playerInventory.materials[matId] < 0) {
            playerInventory.materials[matId] = 0; 
        }
    }

    // 2. Consume Shop Items
    for (const itemId in inputShopItems) {
        playerInventory.shopItems[itemId] -= inputShopItems[itemId];
        if (playerInventory.shopItems[itemId] <= 0) {
            delete playerInventory.shopItems[itemId];
        }
    }

    // 3. Consume Components (Removes the required number of component instances)
    for (const compId in inputComponents) {
        let requiredAmount = inputComponents[compId];
        
        // Remove from the inventory array
        for (let i = 0; i < requiredAmount; i++) {
            const instanceIndex = playerInventory.components.findIndex(c => c.item_id === compId);
            if (instanceIndex !== -1) {
                playerInventory.components.splice(instanceIndex, 1);
            }
        }
    }
};

// --- Main Exported Crafting System ---

export const CraftingSystem = {
    
    /**
     * Executes the 'REFINE' action: converts stacked materials into stacked components/materials.
     * @param {string} recipeId - ID of the recipe to execute.
     * @returns {object} { success: boolean, message: string, outputItem: object | null }
     */
    processRefineAction: function(recipeId) {
        const state = getState();
        const recipe = RECIPES_DB[recipeId];
        
        if (!recipe || recipe.type !== 'REFINE') {
            return { success: false, message: 'Invalid or non-REFINE recipe ID.' };
        }

        const check = checkInventoryInputs(state.playerInventory, recipe);
        if (!check.success) {
            return check;
        }

        // Work on a copy of the state's inventory for safety
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);

        // Generate Output
        const { itemId: outputItemId, amount: outputAmount } = recipe.output;
        
        // Add output to the corresponding inventory part
        if (newInventory.materials.hasOwnProperty(outputItemId) || outputItemId.startsWith('mat_')) {
             // Output is a Material (stackable)
             newInventory.materials[outputItemId] = (newInventory.materials[outputItemId] || 0) + outputAmount;
        } else if (COMPONENTS_DB.hasOwnProperty(outputItemId)) {
            // Output is a Component (must be added as instance)
            for (let i = 0; i < outputAmount; i++) {
                 newInventory.components.push({
                    instance_id: generateInstanceId(),
                    item_id: outputItemId,
                 });
            }
        } else {
             return { success: false, message: `Refine Output Item ID is invalid: ${outputItemId}` };
        }

        // Update GameState and trigger UI re-render
        updateState({ playerInventory: newInventory });
        
        return { 
            success: true, 
            message: `Successfully refined ${outputAmount}x ${outputItemId}.`, 
            outputItem: recipe.output 
        };
    },

    /**
     * Executes the 'CRAFT' action: creates a new unique Equipment instance.
     * @param {string} recipeId - ID of the recipe to execute.
     * @param {string} [rarity='COMMON'] - Desired rarity (influences generated stats/score).
     * @returns {object} { success: boolean, message: string, newEquipment: object | null }
     */
    processCraftAction: function(recipeId, rarity = 'COMMON') {
        const state = getState();
        const recipe = RECIPES_DB[recipeId];
        
        if (!recipe || recipe.type !== 'CRAFT') {
            return { success: false, message: 'Invalid or non-CRAFT recipe ID.' };
        }

        const equipmentStaticData = EQUIPMENT_DB[recipe.output.itemId];
        if (!equipmentStaticData) {
            return { success: false, message: 'Crafting output equipment ID not found in database.' };
        }

        const check = checkInventoryInputs(state.playerInventory, recipe);
        if (!check.success) {
            return check;
        }

        // 1. Consume Inputs
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);

        // 2. Generate New Equipment Instance
        const rarityData = RARITY_MULTIPLIERS[rarity] || RARITY_MULTIPLIERS.COMMON;
        const newInstanceId = generateInstanceId();
        
        // Build the base slots (all locked except the first one)
        const initialSlots = Array.from({ length: equipmentStaticData.slots_total }, (_, index) => ({
            component_id: null,
            isLocked: index >= equipmentStaticData.slots_unlocked,
            isUnlockable: index >= equipmentStaticData.slots_unlocked, // Future logic based on item level
        }));

        // Build the new item (InventoryItem schema)
        const newEquipment = {
            instance_id: newInstanceId,
            item_id: equipmentStaticData.id,
            isEquipped: false, // Always starts unequipped
            slots: initialSlots,
            // Dynamic stats/rarity (can be saved on the instance if needed for future logic)
            rarity: rarity, 
            rarity_bonus: rarityData.score_multiplier,
            // Custom stats logic (Future: implement stat_bonus_min/max randomness here)
        };

        // 3. Add to Inventory
        newInventory.equipment.push(newEquipment);

        // 4. Update GameState
        updateState({ playerInventory: newInventory });
        
        return { 
            success: true, 
            message: `Successfully crafted new ${rarity} ${equipmentStaticData.name}!`, 
            newEquipment: newEquipment 
        };
    },
    
    // -----------------------------------------------------------
    // LÓGICA FUTURA: embedComponent(equipmentInstanceId, componentInstanceId, slotIndex)
    // LÓGICA FUTURA: processUpgradeAction(itemInstanceId, recipeId)
    // LÓGICA FUTURA: createUniqueWeapon(materials, consumables) (IA/Mythic)
    // -----------------------------------------------------------
    
};
