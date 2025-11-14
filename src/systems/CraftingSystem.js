/* ====================================================================
// SYSTEM: CraftingSystem.js
// PATH CORRECTION: ../../database/ (para a raiz do projeto)
// ==================================================================== */

import { getState, updateState } from '../core/GameState.js';
import { RECIPES_DB } from '../../database/recipes.js';
import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { MATERIALS_DB } from '../../database/materials.js';
import { RARITY_MULTIPLIERS, SYNERGY_MAP } from '../../database/crafting_rules.js';

const generateInstanceId = () => {
    return Date.now() + Math.floor(Math.random() * 100000);
};

const checkInventoryInputs = (playerInventory, recipe) => {
    const { inputMaterials, inputComponents, inputShopItems } = recipe;
    for (const matId in inputMaterials) {
        const requiredAmount = inputMaterials[matId];
        const ownedAmount = playerInventory.materials[matId] || 0;
        if (ownedAmount < requiredAmount) return { success: false, message: `Missing Material: ${MATERIALS_DB[matId]?.name || matId.toUpperCase()}` };
    }
    for (const itemId in inputShopItems) {
        const requiredAmount = inputShopItems[itemId];
        const ownedAmount = playerInventory.shopItems[itemId] || 0;
        if (ownedAmount < requiredAmount) return { success: false, message: `Missing Shop Item: ${itemId.toUpperCase()}` };
    }
    for (const compId in inputComponents) {
        const requiredAmount = inputComponents[compId];
        const ownedInstances = playerInventory.components.filter(c => c.item_id === compId).length;
        if (ownedInstances < requiredAmount) return { success: false, message: `Missing Component: ${COMPONENTS_DB[compId]?.name || compId.toUpperCase()}` };
    }
    return { success: true, message: "Inputs check passed." };
};

const consumeInputs = (playerInventory, recipe) => {
    const { inputMaterials, inputComponents, inputShopItems } = recipe;
    for (const matId in inputMaterials) playerInventory.materials[matId] -= inputMaterials[matId];
    for (const itemId in inputShopItems) playerInventory.shopItems[itemId] -= inputShopItems[itemId];
    for (const compId in inputComponents) {
        let requiredAmount = inputComponents[compId];
        for (let i = 0; i < requiredAmount; i++) {
            const instanceIndex = playerInventory.components.findIndex(c => c.item_id === compId);
            if (instanceIndex !== -1) playerInventory.components.splice(instanceIndex, 1);
        }
    }
};

export const CraftingSystem = {
    
    processRefineAction: function(recipeId) {
        const state = getState();
        const recipe = RECIPES_DB[recipeId];
        if (!recipe || recipe.type !== 'REFINE') return { success: false, message: 'Invalid or non-REFINE recipe ID.' };
        const check = checkInventoryInputs(state.playerInventory, recipe);
        if (!check.success) return check;

        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);
        const { itemId: outputItemId, amount: outputAmount } = recipe.output;
        
        if (MATERIALS_DB.hasOwnProperty(outputItemId) || outputItemId.startsWith('mat_')) {
             newInventory.materials[outputItemId] = (newInventory.materials[outputItemId] || 0) + outputAmount;
        } else if (COMPONENTS_DB.hasOwnProperty(outputItemId)) {
            for (let i = 0; i < outputAmount; i++) {
                 newInventory.components.push({ instance_id: generateInstanceId(), item_id: outputItemId });
            }
        } else {
             return { success: false, message: `Refine Output Item ID is invalid: ${outputItemId}` };
        }
        updateState({ playerInventory: newInventory });
        return { success: true, message: `Successfully refined ${outputAmount}x ${outputItemId}.` };
    },

    processCraftAction: function(recipeId, rarity = 'COMMON') {
        const state = getState();
        const recipe = RECIPES_DB[recipeId];
        if (!recipe || recipe.type !== 'CRAFT') return { success: false, message: 'Invalid or non-CRAFT recipe ID.' };
        const equipmentStaticData = EQUIPMENT_DB[recipe.output.itemId];
        if (!equipmentStaticData) return { success: false, message: 'Crafting output equipment ID not found in database.' };
        const check = checkInventoryInputs(state.playerInventory, recipe);
        if (!check.success) return check;

        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);
        const selectedRarity = rarity.toUpperCase();
        const rarityData = RARITY_MULTIPLIERS[selectedRarity] || RARITY_MULTIPLIERS.COMMON;
        const initialSlots = Array.from({ length: equipmentStaticData.slots_total }, (_, index) => ({
            component_id: null,
            isLocked: index >= equipmentStaticData.slots_unlocked,
            isUnlockable: index >= equipmentStaticData.slots_unlocked, 
        }));
        const newEquipment = {
            instance_id: generateInstanceId(),
            item_id: equipmentStaticData.id,
            isEquipped: false, 
            slots: initialSlots,
            rarity: selectedRarity, 
            rarity_bonus: rarityData.score_multiplier,
        };
        newInventory.equipment.push(newEquipment);
        updateState({ playerInventory: newInventory });
        return { success: true, message: `Successfully crafted new ${selectedRarity} ${equipmentStaticData.name}!`, newEquipment: newEquipment };
    },
    
    embedComponent: function(equipmentInstanceId, componentInstanceId, slotIndex) {
        const state = getState();
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        const equipment = newInventory.equipment.find(e => e.instance_id === equipmentInstanceId);
        const component = newInventory.components.find(c => c.instance_id === componentInstanceId);
        const componentIndex = newInventory.components.findIndex(c => c.instance_id === componentInstanceId);

        if (!equipment) return { success: false, message: 'Equipment instance not found in inventory.' };
        if (!component) return { success: false, message: 'Component instance not found in inventory.' };
        const targetSlot = equipment.slots[slotIndex];
        if (!targetSlot) return { success: false, message: 'Invalid slot index.' };
        if (targetSlot.isLocked) return { success: false, message: 'Slot is locked. Cannot embed.' };
        if (targetSlot.component_id !== null) return { success: false, message: 'Slot is already filled.' };

        const equipmentData = EQUIPMENT_DB[equipment.item_id];
        const componentData = COMPONENTS_DB[component.item_id];
        const equipmentSynergy = equipmentData.synergy; 
        const componentType = componentData.type; 
        const allowedTypes = SYNERGY_MAP[equipmentSynergy];

        if (!allowedTypes) return { success: false, message: `Internal Error: No synergy rule found for ${equipmentSynergy}.` };
        if (!allowedTypes.includes(componentType)) return { success: false, message: `Synergy Mismatch. ${equipmentSynergy} gear does not accept ${componentType} components.` };

        targetSlot.component_id = component.item_id;
        newInventory.components.splice(componentIndex, 1);
        updateState({ playerInventory: newInventory });
        return { success: true, message: `Successfully embedded ${componentData.name} into ${equipmentData.name}!` };
    },
};
