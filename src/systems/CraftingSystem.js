/* ====================================================================
// SYSTEM: CraftingSystem.js
// Core logic for all Workshop actions: Refine, Craft, and Embed.
// Language: English
// ==================================================================== */

import { getState, updateState } from '../core/GameState.js';
import { RECIPES_DB } from '../../database/recipes.js';
import { COMPONENTS_DB } from '../../database/components.js';

/**
 * Checks if the player's inventory meets all material, component, and shop item requirements 
 * for a given recipe.
 * * @param {object} playerInventory - The current playerInventory object from GameState.
 * @param {object} recipe - The recipe object from RECIPES_DB.
 * @returns {object} { success: boolean, message: string }
 */
const checkInventoryInputs = (playerInventory, recipe) => {
    const { inputMaterials, inputComponents, inputShopItems } = recipe;

    // 1. Check Materials (Stackable Items)
    for (const matId in inputMaterials) {
        const requiredAmount = inputMaterials[matId];
        const ownedAmount = playerInventory.materials[matId] || 0;
        if (ownedAmount < requiredAmount) {
            return { success: false, message: `Not enough ${matId.toUpperCase()}. Required: ${requiredAmount}, Owned: ${ownedAmount}` };
        }
    }

    // 2. Check Shop Items (Stackable Consumables)
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
        // Counts how many instances of this component ID the player owns
        const ownedInstances = playerInventory.components.filter(c => c.item_id === compId).length;
        if (ownedInstances < requiredAmount) {
            return { success: false, message: `Not enough ${compId.toUpperCase()} components. Required: ${requiredAmount}, Owned: ${ownedInstances}` };
        }
    }

    return { success: true, message: "Inputs check passed." };
};

/**
 * Mutates the player's inventory by subtracting all required inputs.
 * NOTE: This function does NOT call updateState().
 * * @param {object} playerInventory - The current playerInventory object (mutated by reference).
 * @param {object} recipe - The recipe object.
 */
const consumeInputs = (playerInventory, recipe) => {
    const { inputMaterials, inputComponents, inputShopItems } = recipe;
    
    // 1. Consume Materials
    for (const matId in inputMaterials) {
        playerInventory.materials[matId] -= inputMaterials[matId];
        if (playerInventory.materials[matId] < 0) {
            playerInventory.materials[matId] = 0; // Should not happen if checkInventoryInputs() ran correctly
        }
    }

    // 2. Consume Shop Items
    for (const itemId in inputShopItems) {
        playerInventory.shopItems[itemId] -= inputShopItems[itemId];
        // Clean up: remove if amount reaches 0
        if (playerInventory.shopItems[itemId] <= 0) {
            delete playerInventory.shopItems[itemId];
        }
    }

    // 3. Consume Components (Removes instances from the array)
    for (const compId in inputComponents) {
        let requiredAmount = inputComponents[compId];
        
        // Remove the required number of component instances from the END of the array
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

        // 1. Check Inputs
        const check = checkInventoryInputs(state.playerInventory, recipe);
        if (!check.success) {
            return check;
        }

        // 2. Consume Inputs
        // Work on a copy of the state's inventory for safety, then pass it to updateState
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);

        // 3. Generate Output (Add stackable output)
        const { itemId: outputItemId, amount: outputAmount } = recipe.output;
        
        // Check if output is a Material (stackable in playerInventory.materials)
        if (state.playerInventory.materials.hasOwnProperty(outputItemId) || outputItemId.startsWith('mat_')) {
             newInventory.materials[outputItemId] = (newInventory.materials[outputItemId] || 0) + outputAmount;
        } 
        // Or if output is a Component (stackable as instances in playerInventory.components)
        else if (COMPONENTS_DB.hasOwnProperty(outputItemId)) {
            // Note: Components are handled as individual instances even if stackable in DB.
            for (let i = 0; i < outputAmount; i++) {
                 // For refinement, we don't need a unique instance_id yet, but for future consistency, 
                 // the component should be added as an object. We'll simplify here since components 
                 // are mostly consumed later.

                 // Revert: Components in the inventory must be instances for the Embed/Upgrade logic (instance_id)
                 // For now, Refine outputs stackable components/materials only if they don't need instance tracking.
                 // Since components NEED instance tracking (for upgrade/embed), we must simplify Refine outputs 
                 // to always be MATERIALS for now, or ensure all Components are created with instance IDs.

                 // CRITICAL DECISION: Assuming Component T1 output of Refine is ADDED to playerInventory.components 
                 // as a new instance.
                 
                 const newInstanceId = Date.now() + i; // Simple unique ID
                 newInventory.components.push({
                    instance_id: newInstanceId,
                    item_id: outputItemId,
                 });
            }
        } else {
             return { success: false, message: `Refine Output Item ID is invalid: ${outputItemId}` };
        }


        // 4. Update GameState
        updateState({ playerInventory: newInventory });
        
        console.log(`Refine successful! Used ${Object.values(inputMaterials)} to produce ${outputAmount}x ${outputItemId}.`);

        return { success: true, message: `Successfully refined ${outputAmount}x ${outputItemId}.`, outputItem: recipe.output };
    },

    // -----------------------------------------------------------
    // LÓGICA FUTURA: processCraftAction(recipeId)
    // LÓGICA FUTURA: processUpgradeAction(itemInstanceId, recipeId)
    // LÓGICA FUTURA: embedComponent(equipmentInstanceId, componentInstanceId, slotIndex)
    // LÓGICA FUTURA: createUniqueWeapon(materials, consumables)
    // -----------------------------------------------------------

};
