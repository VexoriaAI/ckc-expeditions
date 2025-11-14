/* ====================================================================
// RENDERER: renderWorkshop.js
// Exporta as funções para renderizar as abas do Workshop (Refine, Craft).
// ==================================================================== */

import { RECIPES_DB } from '../../database/recipes.js';
import { MATERIALS_DB } from '../../database/materials.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { EQUIPMENT_DB } from '../../database/equipment.js';
import { SHOP_ITEMS_DB } from '../../database/crafting_rules.js';

/**
 * Renders the content of the Refine tab in the Workshop.
 * @param {object} state - The current GameState.
 * @returns {string} HTML content for the Refine tab.
 */
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
                >
                    REFINE
                </button>
            </div>
        `;
    }

    return `<div class="refine-list">${recipesHTML}</div>`;
};

/**
 * Renders the content of the Craft tab in the Workshop.
 * @param {object} state - The current GameState.
 * @returns {string} HTML content for the Craft tab.
 */
export const renderCraftTab = (state) => {
    const recipes = Object.values(RECIPES_DB).filter(r => r.type === 'CRAFT');
    const playerInventory = state.playerInventory;
    let recipesHTML = '';

    for (const recipe of recipes) {
        const outputItemData = EQUIPMENT_DB[recipe.output.itemId];
        const outputIconPath = outputItemData ? outputItemData.iconPath : 'assets/ui/icon_unknown.png';
        
        let allInputsAvailable = true;
        const inputSections = [];

        // 1. Render Material Inputs
        const materialInputs = Object.keys(recipe.inputMaterials).map(matId => {
            const required = recipe.inputMaterials[matId];
            const owned = playerInventory.materials[matId] || 0;
            const matData = MATERIALS_DB[matId];
            const isAvailable = owned >= required;
            if (!isAvailable) allInputsAvailable = false;
            
            return `<span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">${matData.name}: ${owned}/${required}</span>`;
        }).join(' + ');
        if (materialInputs) inputSections.push(materialInputs);

        // 2. Render Shop Item Inputs 
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
                >
                    CRAFT
                </button>
            </div>
        `;
    }

    return `<div class="craft-list">${recipesHTML}</div>`;
};
