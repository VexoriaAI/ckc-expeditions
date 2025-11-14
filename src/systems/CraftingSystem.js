/* ====================================================================
// SYSTEM: CraftingSystem.js
// UPDATE: processCraftAction agora usa SLOTS_BY_RARITY e 
// SLOT_UNLOCK_RULES para criar slots dinamicamente.
// ==================================================================== */

import { getState, updateState } from '../core/GameState.js';
import { RECIPES_DB } from '../../database/recipes.js';
import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { MATERIALS_DB } from '../../database/materials.js';
// Importa as novas regras de criação de slot
import { 
    RARITY_MULTIPLIERS, 
    SYNERGY_MAP, 
    SLOTS_BY_RARITY, 
    SLOT_UNLOCK_RULES 
} from '../../database/crafting_rules.js';

/**
 * Generates a globally unique ID for a new item instance.
 * @returns {number} A unique ID.
 */
const generateInstanceId = () => {
    return Date.now() + Math.floor(Math.random() * 100000);
};

/**
 * Checks if the player's inventory meets all requirements for a recipe.
 * @param {object} playerInventory - The current playerInventory object from GameState.
 * @param {object} recipe - The recipe object from RECIPES_DB.
 * @returns {object} { success: boolean, message: string }
 */
const checkInventoryInputs = (playerInventory, recipe) => {
    const { inputMaterials, inputComponents, inputShopItems } = recipe;
    // 1. Check Materials
    for (const matId in inputMaterials) {
        const requiredAmount = inputMaterials[matId];
        const ownedAmount = playerInventory.materials[matId] || 0;
        if (ownedAmount < requiredAmount) {
            return { success: false, message: `Missing required Material: ${MATERIALS_DB[matId]?.name || matId.toUpperCase()}. Required: ${requiredAmount}, Owned: ${ownedAmount}` };
        }
    }
    // 2. Check Shop Items
    for (const itemId in inputShopItems) {
        const requiredAmount = inputShopItems[itemId];
        const ownedAmount = playerInventory.shopItems[itemId] || 0;
        if (ownedAmount < requiredAmount) {
            return { success: false, message: `Missing required Shop Item: ${itemId.toUpperCase()}. Required: ${requiredAmount}, Owned: ${ownedAmount}` };
        }
    }
    // 3. Check Components
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
 * @param {object} playerInventory - The current playerInventory object (mutated by reference).
 * @param {object} recipe - The recipe object.
 */
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

// --- Main Exported Crafting System ---

export const CraftingSystem = {
    
    processRefineAction: function(recipeId) {
        const state = getState();
        const recipe = RECIPES_DB[recipeId];
        if (!recipe || recipe.type !== 'REFINE') {
            return { success: false, message: 'Invalid or non-REFINE recipe ID.' };
        }
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

    /**
     * Executes the 'CRAFT' action: creates a new unique Equipment instance.
     * (ATUALIZADO para usar as novas regras de Rarity/Tier/Slot)
     * @param {string} recipeId - ID of the recipe to execute.
     * @returns {object} { success: boolean, message: string }
     */
    processCraftAction: function(recipeId) {
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

        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);

        // --- (LÓGICA DE CRIAÇÃO ATUALIZADA) ---
        const baseRarity = equipmentStaticData.base_rarity || 'COMMON';
        const baseTier = equipmentStaticData.tier || 1;
        
        // 1. Define o total de slots baseado na raridade (ex: 'COMMON' -> 2)
        const totalSlots = SLOTS_BY_RARITY[baseRarity];
        
        // 2. Constrói os slots dinamicamente
        const initialSlots = [];
        for (let i = 0; i < totalSlots; i++) {
            // Verifica qual Tier é necessário para destravar este slot (índice i)
            const requiredTier = SLOT_UNLOCK_RULES[i]; // ex: Slot 1 (i=1) precisa de Tier 3
            
            initialSlots.push({
                component_id: null,
                // O slot está travado se o Tier base do item for MENOR que o Tier requerido
                isLocked: baseTier < requiredTier, 
            });
        }

        // 3. Cria a nova instância do item
        const newEquipment = {
            instance_id: generateInstanceId(),
            item_id: equipmentStaticData.id,
            isEquipped: false, 
            rarity: baseRarity, // Define a raridade inicial
            tier: baseTier,     // Define o tier inicial
            slots: initialSlots, // Adiciona os slots calculados
        };
        // --- Fim da Lógica Atualizada ---

        newInventory.equipment.push(newEquipment);
        updateState({ playerInventory: newInventory });
        
        return { 
            success: true, 
            message: `Successfully crafted new ${baseRarity} ${equipmentStaticData.name}!`, 
            newEquipment: newEquipment 
        };
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
        
        // (ATUALIZADO) Verifica se o slot está travado pelo TIER
        const requiredTier = SLOT_UNLOCK_RULES[slotIndex];
        if (equipment.tier < requiredTier) {
            return { success: false, message: `Slot is locked. Requires Item Tier ${requiredTier}.`};
        }
        
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
