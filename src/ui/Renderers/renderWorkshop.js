/* ====================================================================
// RENDERER: renderWorkshop.js
// UPDATE: (CORREÇÃO DE ARQUITETURA E CSS)
// A função 'renderEmbedTab' agora renderiza o 'item-card' (Rich Card)
// completo, corrigindo o visual quebrado.
// ==================================================================== */

import { RECIPES_DB } from '../../../database/recipes.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { SHOP_ITEMS_DB, SLOT_UNLOCK_RULES } from '../../../database/crafting_rules.js';
// (Importações removidas que não são mais necessárias aqui)

// --- Helper (Copiado do renderInventoryEquipments) ---
const renderItemSlotsHTML = (itemInstance) => {
    let slotsHTML = '';
    const itemTier = itemInstance.tier;
    itemInstance.slots.forEach((slot, index) => {
        const requiredTier = SLOT_UNLOCK_RULES[index];
        if (slot.component_id) {
            const compData = COMPONENTS_DB[slot.component_id];
            slotsHTML += `
                <div class="item-slot-row filled">
                    <img src="${compData.iconPath}" class="slot-bar-icon">
                    <span class="slot-bar-text">${compData.name}</span>
                    <span class="slot-bar-bonus">(+${Object.values(compData.stats)[0]} ${Object.keys(compData.stats)[0]})</span>
                </div>
            `;
        } else if (itemTier >= requiredTier) {
            slotsHTML += `<div class="item-slot-row empty"><span class="slot-bar-icon">+</span><span class="slot-bar-text">Empty Slot</span></div>`;
        } else {
            slotsHTML += `<div class="item-slot-row locked"><span class="slot-bar-icon">🔒</span><span class="slot-bar-text">Locked (Requires Tier ${requiredTier})</span></div>`;
        }
    });
    return slotsHTML;
};
// --- Fim do Helper ---

// --- RENDER UTILITY: Refine Tab ---
export const renderRefineTab = (state) => {
    const recipes = Object.values(RECIPES_DB).filter(r => r.type === 'REFINE');
    const playerInventory = state.playerInventory;
    let recipesHTML = '';

    for (const recipe of recipes) {
        const outputItemData = MATERIALS_DB[recipe.output.itemId] || COMPONENTS_DB[recipe.output.itemId];
        const outputIconPath = outputItemData ? outputItemData.iconPath : 'assets/ui/icon_unknown.png';
        let allInputsAvailable = true;
        
        const inputHTML = Object.keys(recipe.inputMaterials).map(matId => {
            const required = recipe.inputMaterials[matId];
            const owned = playerInventory.materials[matId] || 0;
            const matData = MATERIALS_DB[matId];
            const isAvailable = owned >= required;
            if (!isAvailable) allInputsAvailable = false;
            
            return `
                <span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">
                    <img src="${matData.iconPath}" alt="${matData.name}" title="${matData.name}">
                    ${owned}/${required}
                </span>
            `;
        }).join(' + ');
        
        recipesHTML += `
            <div class="recipe-card refine-recipe" data-recipe-id="${recipe.recipeId}">
                <h4>${recipe.name}</h4>
                <div class="recipe-io">
                    <div class="input-section">${inputHTML}</div>
                    <span class="arrow-separator">→</span>
                    <div class="output-section">
                        <img src="${outputIconPath}" alt="${outputItemData.name}" title="${outputItemData.name}">
                        <span>${recipe.output.amount}x ${outputItemData.name}</span>
                    </div>
                </div>
                <button 
                    id="btn-execute-refine" 
                    data-recipe-id="${recipe.recipeId}"
                    class="btn-sm action-btn btn-primary ${allInputsAvailable ? '' : 'disabled'}"
                    ${allInputsAvailable ? '' : 'disabled'}
                >REFINE</button>
            </div>
        `;
    }
    return `<div class="refine-list">${recipesHTML}</div>`;
};

// --- RENDER UTILITY: Craft Tab ---
export const renderCraftTab = (state) => {
    const recipes = Object.values(RECIPES_DB).filter(r => r.type === 'CRAFT');
    const playerInventory = state.playerInventory;
    let recipesHTML = '';

    for (const recipe of recipes) {
        const outputItemData = EQUIPMENT_DB[recipe.output.itemId];
        const outputIconPath = outputItemData ? outputItemData.iconPath : 'assets/ui/icon_unknown.png';
        let allInputsAvailable = true;
        const inputSections = [];

        const materialInputs = Object.keys(recipe.inputMaterials).map(matId => {
            const required = recipe.inputMaterials[matId];
            const owned = playerInventory.materials[matId] || 0;
            const matData = MATERIALS_DB[matId];
            const isAvailable = owned >= required;
            if (!isAvailable) allInputsAvailable = false;
            return `<span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">${matData.name}: ${owned}/${required}</span>`;
        }).join(' + ');
        if (materialInputs) inputSections.push(materialInputs);

        const shopItemInputs = Object.keys(recipe.inputShopItems).map(itemId => {
            const required = recipe.inputShopItems[itemId];
            const owned = playerInventory.shopItems[itemId] || 0;
            const itemData = SHOP_ITEMS_DB[itemId];
            const isAvailable = owned >= required;
            if (!isAvailable) allInputsAvailable = false;
            return `<span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">${itemData.name}: ${owned}/${required}</span>`;
        }).join(' + ');
        if (shopItemInputs) inputSections.push(shopItemInputs);

        const inputHTML = inputSections.join('<br>'); 

        recipesHTML += `
            <div class="recipe-card craft-recipe" data-recipe-id="${recipe.recipeId}">
                <h4>${recipe.name}</h4>
                <div class="recipe-io">
                    <div class="input-section">${inputHTML}</div>
                    <span class="arrow-separator">→</span>
                    <div class="output-section">
                        <img src="${outputIconPath}" alt="${outputItemData.name}" title="${outputItemData.name}">
                        <span>${outputItemData.name} (${recipe.output.rarity || 'Common'})</span>
                    </div>
                </div>
                <button 
                    id="btn-execute-craft" 
                    data-recipe-id="${recipe.recipeId}"
                    class="btn-sm action-btn btn-success ${allInputsAvailable ? '' : 'disabled'}"
                    ${allInputsAvailable ? '' : 'disabled'}
                >CRAFT</button>
            </div>
        `;
    }
    return `<div class="craft-list">${recipesHTML}</div>`;
};


// --- (ATUALIZADO) RENDER UTILITY: Embed Tab ---
/**
 * Renderiza a UI para a aba "Embed" (componente).
 * @param {object} state - O GameState completo.
 * @returns {string} HTML para a aba Embed.
 */
export const renderEmbedTab = (state) => {
    const { 
        embedTargetEquipmentId, 
        embedTargetComponentId,
        playerInventory 
    } = state;

    let equipmentSlotHTML = '';
    let componentSlotHTML = '';
    let previewHTML = '';
    
    const executeButtonDisabled = !(embedTargetEquipmentId && embedTargetComponentId);

    // --- 1. Renderiza o Slot de Equipamento ---
    if (embedTargetEquipmentId) {
        const item = playerInventory.equipment.find(e => e.instance_id === embedTargetEquipmentId);
        const itemData = EQUIPMENT_DB[item.item_id];
        const itemStats = itemData.base_stats;
        
        const statsHTML = Object.keys(itemStats).map(statKey => `
            <div class="card-stat-row">
                <span>${statKey.toUpperCase()}</span>
                <span class="card-stat-val">+${itemStats[statKey]}</span>
            </div>
        `).join('');

        const slotsHTML = renderItemSlotsHTML(item);
        const rarityClass = `rarity-${item.rarity.toLowerCase()}`;
        
        equipmentSlotHTML = `
            <div class="item-card ${rarityClass}">
                <button id="btn-remove-embed-equip" class="unequip-btn">&times;</button>
                <div class="card-header">
                    <div class="card-icon-frame"><img src="${itemData.iconPath}" alt="${itemData.name}"></div>
                    <div class="card-header-text">
                        <h4>${itemData.name}</h4>
                        <span class="card-level">Tier ${item.tier} (${item.rarity})</span>
                    </div>
                </div>
                <div class="card-body">
                    ${statsHTML}
                </div>
                <div class="card-footer">
                    ${slotsHTML}
                </div>
            </div>
        `;
    } else {
        equipmentSlotHTML = `
            <div id="btn-select-embed-equip" class="embed-slot-placeholder panel">
                <span class="embed-plus">+</span>
                <span class="embed-title">Select Equipment</span>
                <p class="embed-desc">Choose an item from your inventory to modify.</p>
            </div>
        `;
    }

    // --- 2. Renderiza o Slot de Componente ---
    const isComponentSlotDisabled = !embedTargetEquipmentId;
    
    if (embedTargetComponentId) {
        const item = playerInventory.components.find(c => c.instance_id === embedTargetComponentId);
        const itemData = COMPONENTS_DB[item.item_id];
        
        const statsHTML = Object.keys(itemData.stats).map(statKey => `
            <div class="card-stat-row">
                <span>${statKey.toUpperCase()}</span>
                <span class="card-stat-val">+${itemData.stats[statKey]}</span>
            </div>
        `).join('');

        componentSlotHTML = `
            <div class="item-card rarity-common"> <button id="btn-remove-embed-comp" class="unequip-btn">&times;</button>
                <div class="card-header">
                    <div class="card-icon-frame"><img src="${itemData.iconPath}" alt="${itemData.name}"></div>
                    <div class="card-header-text">
                        <h4>${itemData.name}</h4>
                        <span class="card-level">Type: ${itemData.type}</span>
                    </div>
                </div>
                <div class="card-body">
                    ${statsHTML}
                </div>
            </div>
        `;
    } else {
        componentSlotHTML = `
            <div id="btn-select-embed-comp" class="embed-slot-placeholder panel ${isComponentSlotDisabled ? 'disabled' : ''}">
                <span class="embed-plus">+</span>
                <span class="embed-title">Select Component</span>
                <p class="embed-desc">${isComponentSlotDisabled ? 'Select equipment first' : 'Choose a component to embed'}</p>
            </div>
        `;
    }
    
    // --- 3. Renderiza o Preview (se ambos estiverem selecionados) ---
    if (!executeButtonDisabled) {
        // (Lógica de Stats "Antes e Depois" - Simplificada por enquanto)
        previewHTML = `
            <div class="embed-preview panel">
                <h4>Ready to Embed!</h4>
                <p>Clicking 'Embed Component' will consume the component and permanently socket it into the first available, unlocked slot.</p>
            </div>
        `;
    }
    
    // --- 4. Montagem Final ---
    return `
        <div class="embed-ui">
            ${equipmentSlotHTML}
            <span class="arrow-separator">+</span>
            ${componentSlotHTML}
        </div>
        ${previewHTML}
        <button 
            id="btn-execute-embed" 
            class="action-btn btn-success"
            ${executeButtonDisabled ? 'disabled' : ''}
        >
            Embed Component
        </button>
    `;
};
