/* ====================================================================
// SYSTEM: CraftingSystem.js
// UPDATE: (Correção de Bug - Passo 2.1)
// Garante que checkInventoryInputs e as funções principais sempre
// retornem um objeto { success, message } válido para evitar crashes.
// ==================================================================== */

import { getState, updateState } from '../core/GameState.js';
import { RECIPES_DB } from '../../database/recipes.js';
import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { MATERIALS_DB } from '../../database/materials.js';
import { 
    SYNERGY_MAP, 
    SLOTS_BY_RARITY, 
    SLOT_UNLOCK_RULES 
} from '../../database/crafting_rules.js';

/**
 * Gera um ID único para novas instâncias.
 */
const generateInstanceId = () => {
    return Date.now() + Math.floor(Math.random() * 100000);
};

/**
 * Verifica se o inventário tem os itens necessários para a receita.
 * Retorna SEMPRE um objeto { success: boolean, message: string }.
 */
const checkInventoryInputs = (playerInventory, recipe) => {
    if (!recipe) return { success: false, message: "Recipe not found." };

    const { inputMaterials, inputComponents, inputShopItems } = recipe;

    // 1. Materiais
    if (inputMaterials) {
        for (const matId in inputMaterials) {
            const requiredAmount = inputMaterials[matId];
            const ownedAmount = playerInventory.materials[matId] || 0;
            if (ownedAmount < requiredAmount) {
                const matName = MATERIALS_DB[matId]?.name || matId;
                return { success: false, message: `Missing Material: ${matName}. Need ${requiredAmount}, have ${ownedAmount}.` };
            }
        }
    }

    // 2. Itens de Loja
    if (inputShopItems) {
        for (const itemId in inputShopItems) {
            const requiredAmount = inputShopItems[itemId];
            const ownedAmount = playerInventory.shopItems[itemId] || 0;
            if (ownedAmount < requiredAmount) {
                return { success: false, message: `Missing Shop Item: ${itemId}. Need ${requiredAmount}, have ${ownedAmount}.` };
            }
        }
    }

    // 3. Componentes (Consumíveis na receita)
    if (inputComponents) {
        for (const compId in inputComponents) {
            const requiredAmount = inputComponents[compId];
            // Conta quantas instâncias desse componente o jogador tem
            const ownedInstances = playerInventory.components.filter(c => c.item_id === compId).length;
            if (ownedInstances < requiredAmount) {
                const compName = COMPONENTS_DB[compId]?.name || compId;
                return { success: false, message: `Missing Component: ${compName}. Need ${requiredAmount}, have ${ownedInstances}.` };
            }
        }
    }

    return { success: true, message: "Inputs check passed." };
};

/**
 * Consome os itens do inventário baseados na receita.
 */
const consumeInputs = (inventory, recipe) => {
    const { inputMaterials, inputComponents, inputShopItems } = recipe;

    // Consome Materiais
    if (inputMaterials) {
        for (const matId in inputMaterials) {
            inventory.materials[matId] -= inputMaterials[matId];
        }
    }

    // Consome Shop Items
    if (inputShopItems) {
        for (const itemId in inputShopItems) {
            inventory.shopItems[itemId] -= inputShopItems[itemId];
        }
    }

    // Consome Componentes
    if (inputComponents) {
        for (const compId in inputComponents) {
            let requiredAmount = inputComponents[compId];
            for (let i = 0; i < requiredAmount; i++) {
                const index = inventory.components.findIndex(c => c.item_id === compId);
                if (index !== -1) {
                    inventory.components.splice(index, 1);
                }
            }
        }
    }
};

// --- Sistema Exportado ---

export const CraftingSystem = {
    
    processRefineAction: function(recipeId) {
        const state = getState();
        const recipe = RECIPES_DB[recipeId];
        
        if (!recipe || recipe.type !== 'REFINE') {
            return { success: false, message: 'Invalid recipe for Refining.' };
        }

        const check = checkInventoryInputs(state.playerInventory, recipe);
        if (!check.success) return check;

        // Clona e altera o inventário
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);

        const { itemId: outputItemId, amount: outputAmount } = recipe.output;
        
        // Adiciona o resultado
        if (MATERIALS_DB[outputItemId] || outputItemId.startsWith('mat_')) {
             newInventory.materials[outputItemId] = (newInventory.materials[outputItemId] || 0) + outputAmount;
        } else if (COMPONENTS_DB[outputItemId]) {
            for (let i = 0; i < outputAmount; i++) {
                 newInventory.components.push({ instance_id: generateInstanceId(), item_id: outputItemId });
            }
        } else {
             return { success: false, message: `Unknown output item: ${outputItemId}` };
        }

        updateState({ playerInventory: newInventory });
        return { success: true, message: `Successfully refined ${outputAmount}x ${outputItemId}!` };
    },

    processCraftAction: function(recipeId) {
        const state = getState();
        const recipe = RECIPES_DB[recipeId];
        
        if (!recipe || recipe.type !== 'CRAFT') {
            return { success: false, message: 'Invalid recipe for Crafting.' };
        }

        const equipmentStaticData = EQUIPMENT_DB[recipe.output.itemId];
        if (!equipmentStaticData) {
            return { success: false, message: 'Crafting output equipment not found in database.' };
        }

        const check = checkInventoryInputs(state.playerInventory, recipe);
        if (!check.success) return check;

        // Clona e altera
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        consumeInputs(newInventory, recipe);

        // Cria o novo equipamento
        const baseRarity = equipmentStaticData.base_rarity || 'COMMON';
        const baseTier = equipmentStaticData.tier || 1;
        const totalSlots = SLOTS_BY_RARITY[baseRarity] || 2;
        
        const initialSlots = [];
        for (let i = 0; i < totalSlots; i++) {
            const requiredTier = SLOT_UNLOCK_RULES[i] || 99;
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
            // Copia skills base se houver, senão array vazio
            skills: equipmentStaticData.skills ? [...equipmentStaticData.skills] : []
        };

        newInventory.equipment.push(newEquipment);
        updateState({ playerInventory: newInventory });
        
        return { 
            success: true, 
            message: `Successfully crafted ${equipmentStaticData.name}!` 
        };
    },
    
    embedComponent: function(equipmentInstanceId, componentInstanceId) {
        const state = getState();
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        
        const equipment = newInventory.equipment.find(e => e.instance_id === equipmentInstanceId);
        const componentIndex = newInventory.components.findIndex(c => c.instance_id === componentInstanceId);
        const component = newInventory.components[componentIndex];

        if (!equipment) return { success: false, message: 'Equipment not found.' };
        if (!component) return { success: false, message: 'Component not found.' };
        
        // Encontra slot vago e destravado
        let targetSlot = null;
        for (let i = 0; i < equipment.slots.length; i++) {
            const slot = equipment.slots[i];
            if (slot.component_id === null && !slot.isLocked) {
                targetSlot = slot;
                break;
            }
        }
        
        if (!targetSlot) {
            return { success: false, message: 'No available/unlocked slots on this item.' };
        }

        // Verifica Sinergia
        const equipmentData = EQUIPMENT_DB[equipment.item_id];
        const componentData = COMPONENTS_DB[component.item_id];
        
        if (!equipmentData || !componentData) return { success: false, message: 'Data Error.' };

        const allowedTypes = SYNERGY_MAP[equipmentData.synergy];
        if (!allowedTypes || !allowedTypes.includes(componentData.type)) {
            return { success: false, message: `Synergy Mismatch: ${equipmentData.synergy} gear rejects ${componentData.type} component.` };
        }

        // Executa Embed
        targetSlot.component_id = component.item_id;
        newInventory.components.splice(componentIndex, 1); // Remove do inventário

        // Limpa seleção na UI também (deve ser feito pelo caller, mas garantimos o estado do inv aqui)
        updateState({ playerInventory: newInventory });

        return { success: true, message: `Successfully embedded ${componentData.name}!` };
    },
};
