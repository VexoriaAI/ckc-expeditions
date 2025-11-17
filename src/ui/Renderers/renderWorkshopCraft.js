/* ====================================================================
// (NOVO) RENDERER: renderWorkshopCraft.js
// Renderiza a aba 'Craft' (Livro de Receitas / Blueprints).
// ==================================================================== */

import { RECIPES_DB } from '../../../database/recipes.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { MOCK_KNOWN_BLUEPRINTS } from '../../../database/mock_wallet.js'; // A "lista de receitas conhecidas"

/**
 * Renderiza a aba de Crafting (Craft)
 * @param {object} state - O GameState completo
 * @returns {string} HTML para a aba de Craft
 */
export const renderCraftTab = (state) => {
    const { playerInventory, uiState } = state;
    const { craftFilterType, craftFilterTribe } = uiState;
    
    // 1. Filtra as receitas baseadas nos Blueprints que o jogador conhece
    let knownRecipes = MOCK_KNOWN_BLUEPRINTS
        .map(recipeId => RECIPES_DB[recipeId])
        .filter(Boolean); // Filtra (remove) receitas indefinidas

    // 2. Aplica os filtros da UI (Type e Tribe)
    // (Filtro de Tipo - 'equipment' ou 'component')
    if (craftFilterType !== 'all') {
        knownRecipes = knownRecipes.filter(recipe => {
            const outputItem = EQUIPMENT_DB[recipe.output.itemId] || COMPONENTS_DB[recipe.output.itemId];
            if (craftFilterType === 'equipment') return !!EQUIPMENT_DB[recipe.output.itemId];
            if (craftFilterType === 'component') return !!COMPONENTS_DB[recipe.output.itemId];
            return false;
        });
    }
    // (Filtro de Tribo - A ser implementado. Requer que as receitas tenham uma 'tribe' associada)
    // if (craftFilterTribe !== 'all') { ... }


    // 3. Renderiza os Filtros da UI
    const filterHTML = `
        <div class="inventory-filters">
            <div class="filter-group">
                <label>Filter Type:</label>
                <select id="craft-filter-type">
                    <option value="all" ${craftFilterType === 'all' ? 'selected' : ''}>All</option>
                    <option value="equipment" ${craftFilterType === 'equipment' ? 'selected' : ''}>Equipment</option>
                    <option value="component" ${craftFilterType === 'component' ? 'selected' : ''}>Components</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Filter Tribe:</label>
                <select id="craft-filter-tribe">
                    <option value="all" ${craftFilterTribe === 'all' ? 'selected' : ''}>All Tribes</option>
                    <option value="nocturnals" disabled>Nocturnals</option>
                    <option value="volcanics" disabled>Volcanics</option>
                </select>
            </div>
        </div>
    `;

    // 4. Renderiza os Cards de Receita
    let recipesHTML = '';
    if (knownRecipes.length === 0) {
        recipesHTML = '<p>No matching blueprints found.</p>';
    } else {
        recipesHTML = knownRecipes.map(recipe => {
            const outputItemData = EQUIPMENT_DB[recipe.output.itemId] || COMPONENTS_DB[recipe.output.itemId];
            const outputIconPath = outputItemData ? outputItemData.iconPath : 'assets/ui/icon_unknown.png';
            let allInputsAvailable = true;

            // Checa Materiais
            const inputMaterialsHTML = Object.keys(recipe.inputMaterials).map(matId => {
                const required = recipe.inputMaterials[matId];
                const owned = playerInventory.materials[matId] || 0;
                const matData = MATERIALS_DB[matId];
                const isAvailable = owned >= required;
                if (!isAvailable) allInputsAvailable = false;
                return `<span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">${matData.name} (${owned}/${required})</span>`;
            }).join('<br>');
            
            // Checa Componentes
            const inputComponentsHTML = Object.keys(recipe.inputComponents).map(compId => {
                const required = recipe.inputComponents[compId];
                const owned = playerInventory.components.filter(c => c.item_id === compId).length;
                const compData = COMPONENTS_DB[compId];
                const isAvailable = owned >= required;
                if (!isAvailable) allInputsAvailable = false;
                return `<span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">${compData.name} (${owned}/${required})</span>`;
            }).join('<br>');

            return `
                <div class="recipe-card craft-recipe" data-recipe-id="${recipe.recipeId}">
                    <h4>${recipe.name}</h4>
                    <div class="recipe-io">
                        <div class="input-section">
                            ${inputMaterialsHTML}
                            ${inputComponentsHTML}
                        </div>
                        <span class="arrow-separator">→</span>
                        <div class="output-section">
                            <img src="${outputIconPath}" alt="${outputItemData.name}" title="${outputItemData.name}">
                            <span>${outputItemData.name} (x${recipe.output.amount})</span>
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
        }).join('');
    }

    return `
        ${filterHTML}
        <div class="craft-list">${recipesHTML}</div>
    `;
};
