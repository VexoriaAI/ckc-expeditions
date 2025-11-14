/* ====================================================================
// RENDERER: renderWorkshop.js
// UPDATE: Adiciona a função 'renderEmbedTab' para a UI do Workshop.
// ==================================================================== */

import { RECIPES_DB } from '../../../database/recipes.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js';
import { getState } from '../../core/GameState.js'; // (NOVO) Importa getState para ler o inventário
import { calculateFinalStats, calculatePowerScore } from '../../systems/StatCalculationSystem.js';
import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; // (NOVO) Para o preview de stats

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


// --- (NOVO) RENDER UTILITY: Embed Tab ---
/**
 * Renders the UI for the Embed (component) tab.
 * @param {object} state - The current GameState.
 * @returns {string} HTML content for the Embed tab.
 */
export const renderEmbedTab = (state) => {
    const { 
        embedTargetEquipmentId, 
        embedTargetComponentId, 
        embedTargetSlotIndex,
        playerInventory 
    } = state;

    let equipmentSlotHTML = '';
    let componentSlotHTML = '';
    let previewHTML = '';
    let executeButtonDisabled = true;

    // --- 1. Renderiza o Slot de Equipamento ---
    if (embedTargetEquipmentId) {
        const item = playerInventory.equipment.find(e => e.instance_id === embedTargetEquipmentId);
        const itemData = EQUIPMENT_DB[item.item_id];
        equipmentSlotHTML = `
            <div class="embed-item-card panel" data-instance-id="${item.instance_id}">
                <img src="${itemData.iconPath}" alt="${itemData.name}">
                <h4>${itemData.name}</h4>
                <p>${itemData.description}</p>
                <button id="btn-remove-embed-equip" class="action-btn btn-xs btn-primary">Remove</button>
            </div>
        `;
    } else {
        equipmentSlotHTML = `
            <div id="btn-select-embed-equip" class="embed-slot-placeholder panel">
                +
                <span>Select Equipment</span>
                <p>Choose an item from your inventory to modify.</p>
            </div>
        `;
    }

    // --- 2. Renderiza o Slot de Componente ---
    // (O GDD diz: "O [Component Slot] deve estar desabilitado até que o [Gear Slot] esteja preenchido.")
    const isComponentSlotDisabled = !embedTargetEquipmentId;
    
    if (embedTargetComponentId) {
        const item = playerInventory.components.find(c => c.instance_id === embedTargetComponentId);
        const itemData = COMPONENTS_DB[item.item_id];
        componentSlotHTML = `
            <div class="embed-item-card panel" data-instance-id="${item.instance_id}">
                <img src="${itemData.iconPath}" alt="${itemData.name}">
                <h4>${itemData.name}</h4>
                <p>${itemData.description}</p>
                <button id="btn-remove-embed-comp" class="action-btn btn-xs btn-primary">Remove</button>
            </div>
        `;
    } else {
        componentSlotHTML = `
            <div id="btn-select-embed-comp" class="embed-slot-placeholder panel ${isComponentSlotDisabled ? 'disabled' : ''}">
                +
                <span>Select Component</span>
                <p>${isComponentSlotDisabled ? 'Select equipment first' : 'Choose a component to embed'}</p>
            </div>
        `;
    }
    
    // --- 3. Renderiza o Preview (Se ambos estiverem selecionados) ---
    if (embedTargetEquipmentId && embedTargetComponentId && embedTargetSlotIndex !== null) {
        executeButtonDisabled = false; // Habilita o botão
        
        // (Lógica de Stats "Antes e Depois")
        const kidData = MOCK_KIDZ_NFTS[0]; // Usa o primeiro Kid mockado para stats base
        const currentEquipped = [{ instance_id: embedTargetEquipmentId }]; // Simula o item equipado
        
        // "Antes"
        const statsBefore = calculateFinalStats(kidData, currentEquipped);

        // "Depois" (Simula o item com o componente)
        const itemAfter = JSON.parse(JSON.stringify(playerInventory.equipment.find(e => e.instance_id === embedTargetEquipmentId)));
        itemAfter.slots[embedTargetSlotIndex].component_id = COMPONENTS_DB[playerInventory.components.find(c => c.instance_id === embedTargetComponentId).item_id].id;
        const statsAfter = calculateFinalStats(kidData, [itemAfter]);
        
        previewHTML = `
            <div class="embed-preview panel">
                <h4>Stats Preview (Base: ${kidData.name})</h4>
                <div class="stats-comparison">
                    <div class="stats-col stats-before">
                        <strong>BEFORE</strong>
                        <p>HP: ${statsBefore.maxHP}</p>
                        <p>Attack: ${statsBefore.attack}</p>
                        <p>Defense: ${statsBefore.defense}</p>
                    </div>
                    <div class="stats-col stats-after">
                        <strong>AFTER</strong>
                        <p>HP: ${statsAfter.maxHP}</p>
                        <p>Attack: ${statsAfter.attack}</p>
                        <p>Defense: ${statsAfter.defense}</p>
                    </div>
                </div>
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
