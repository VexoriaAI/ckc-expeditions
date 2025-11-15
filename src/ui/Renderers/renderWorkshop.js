/* ====================================================================
// RENDERER: renderWorkshop.js
// UPDATE: Corrige a lógica de ativação do botão 'Embed Component'.
// ==================================================================== */

import { RECIPES_DB } from '../../../database/recipes.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js';
// (Removidas importações desnecessárias de stats/kidz)

// --- RENDER UTILITY: Refine Tab ---
export const renderRefineTab = (state) => {
    // ... (código do renderRefineTab - sem alteração) ...
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
    // ... (código do renderCraftTab - sem alteração) ...
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
export const renderEmbedTab = (state) => {
    const { 
        embedTargetEquipmentId, 
        embedTargetComponentId,
        playerInventory 
    } = state;

    let equipmentSlotHTML = '';
    let componentSlotHTML = '';
    let previewHTML = '';
    
    // (CORREÇÃO P1) Habilita o botão apenas se AMBOS os slots estiverem preenchidos
    const executeButtonDisabled = !(embedTargetEquipmentId && embedTargetComponentId);

    // --- 1. Renderiza o Slot de Equipamento ---
    if (embedTargetEquipmentId) {
        const item = playerInventory.equipment.find(e => e.instance_id === embedTargetEquipmentId);
        const itemData = EQUIPMENT_DB[item.item_id];
        equipmentSlotHTML = `
            <div class="embed-item-card panel" data-instance-id="${item.instance_id}">
                <img src="${itemData.iconPath}" alt="${itemData.name}">
                <h4>${itemData.name}</h4>
                <p>${itemData.description}</p>
                <button id="btn-remove-embed-equip" class="action-btn btn-xs btn-primary">REMOVE</button>
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
        componentSlotHTML = `
            <div class="embed-item-card panel" data-instance-id="${item.instance_id}">
                <img src="${itemData.iconPath}" alt="${itemData.name}">
                <h4>${itemData.name}</h4>
                <p>${itemData.description}</p>
                <button id="btn-remove-embed-comp" class="action-btn btn-xs btn-primary">REMOVE</button>
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
    
    // --- 3. Renderiza o Preview (Lógica de Stats removida por enquanto) ---
    if (!executeButtonDisabled) {
        previewHTML = `
            <div class="embed-preview panel">
                <h4>Ready to Embed!</h4>
                <p>Clicking 'Embed Component' will consume the component and permanently socket it into the equipment.</p>
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
