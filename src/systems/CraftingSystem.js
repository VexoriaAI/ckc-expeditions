/* ====================================================================
// SYSTEM: CraftingSystem.js
// UPDATE: Refatora 'embedComponent' para encontrar automaticamente 
// o primeiro slot vago.
// ==================================================================== */

import { getState, updateState } from '../core/GameState.js';
import { RECIPES_DB } from '../../database/recipes.js';
import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { MATERIALS_DB } from '../../database/materials.js';
import { RARITY_MULTIPLIERS, SYNERGY_MAP, SLOT_UNLOCK_RULES } from '../../database/crafting_rules.js';

// ... (generateInstanceId, checkInventoryInputs, consumeInputs - sem alteração) ...
const generateInstanceId = () => { /* ... */ };
const checkInventoryInputs = (playerInventory, recipe) => { /* ... */ };
const consumeInputs = (playerInventory, recipe) => { /* ... */ };


export const CraftingSystem = {
    
    processRefineAction: function(recipeId) {
        // ... (lógica do processRefineAction - sem alteração) ...
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

    processCraftAction: function(recipeId) {
        // ... (lógica do processCraftAction - sem alteração) ...
        const state = getState();
        const recipe = RECIPES_DB[recipeId];
        if (!recipe || recipe.type !== 'CRAFT') return { success: false, message: 'Invalid or non-CRAFT recipe ID.' };
        const equipmentStaticData = EQUIPMENT_DB[recipe.output.itemId];
        if (!equipmentStaticData) return { success: false, message: 'Crafting output equipment ID not found in database.' };
        const check = checkInventoryInputs(state.playerInventory, recipe);
        if (!check.success) return check;
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);
        const baseRarity = equipmentStaticData.base_rarity || 'COMMON';
        const baseTier = equipmentStaticData.tier || 1;
        const totalSlots = SLOTS_BY_RARITY[baseRarity];
        const initialSlots = [];
        for (let i = 0; i < totalSlots; i++) {
            const requiredTier = SLOT_UNLOCK_RULES[i];
            initialSlots.push({
                component_id: null,
                isLocked: baseTier < requiredTier, 
            });
        }
        const newEquipment = {
            instance_id: generateInstanceId(),
            item_id: equipmentStaticData.id,
            isEquipped: false, 
            rarity: baseRarity,
            tier: baseTier,
            slots: initialSlots,
        };
        newInventory.equipment.push(newEquipment);
        updateState({ playerInventory: newInventory });
        return { success: true, message: `Successfully crafted new ${baseRarity} ${equipmentStaticData.name}!`, newEquipment: newEquipment };
    },
    
    /**
     * (ATUALIZADO) Executa o 'EMBED' no PRIMEIRO slot vago.
     * @param {number} equipmentInstanceId - O ID do equipamento.
     * @param {number} componentInstanceId - O ID do componente.
     * @returns {object} { success: boolean, message: string }
     */
    embedComponent: function(equipmentInstanceId, componentInstanceId) {
        const state = getState();
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        const equipment = newInventory.equipment.find(e => e.instance_id === equipmentInstanceId);
        const component = newInventory.components.find(c => c.instance_id === componentInstanceId);
        const componentIndex = newInventory.components.findIndex(c => c.instance_id === componentInstanceId);

        if (!equipment) return { success: false, message: 'Equipment instance not found in inventory.' };
        if (!component) return { success: false, message: 'Component instance not found in inventory.' };
        
        // (LÓGICA ATUALIZADA) Encontra o primeiro slot que está VAZIO (null) E DESTRAVADO (tier)
        let targetSlot = null;
        let targetSlotIndex = -1;

        for (let i = 0; i < equipment.slots.length; i++) {
            const slot = equipment.slots[i];
            const requiredTier = SLOT_UNLOCK_RULES[i];
            // Está vago? O tier do item é suficiente?
            if (slot.component_id === null && equipment.tier >= requiredTier) {
                targetSlot = slot;
                targetSlotIndex = i;
                break; // Encontra o primeiro e para
            }
        }
        
        if (!targetSlot) {
            return { success: false, message: 'No available slots (or all slots are locked by Tier).' };
        }

        const equipmentData = EQUIPMENT_DB[equipment.item_id];
        const componentData = COMPONENTS_DB[component.item_id];
        const equipmentSynergy = equipmentData.synergy; 
        const componentType = componentData.type; 
        const allowedTypes = SYNERGY_MAP[equipmentSynergy];

        if (!allowedTypes) return { success: false, message: `Internal Error: No synergy rule found for ${equipmentSynergy}.` };
        if (!allowedTypes.includes(componentType)) return { success: false, message: `Synergy Mismatch. ${equipmentSynergy} gear does not accept ${componentType} components.` };

        // Executa o Embed
        targetSlot.component_id = component.item_id;
        
        // Remove o componente
        newInventory.components.splice(componentIndex, 1);

        // Limpa o estado temporário da UI
        newInventory.embedTargetEquipmentId = null;
        newInventory.embedTargetComponentId = null;

        updateState({ 
            playerInventory: newInventory,
            embedTargetEquipmentId: null, // Limpa o estado da UI
            embedTargetComponentId: null
        });

        return { 
            success: true, 
            message: `Successfully embedded ${componentData.name} into ${equipmentData.name}!` 
        };
    },
};
