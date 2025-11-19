/* ====================================================================
// RENDERER: renderWorkshopCraft.js
// UPDATE: (Passo 2.2 - Visual Rich Card)
// - Aplica as classes '.item-card' e '.rarity-...' aos cards de receita.
// - Mantém a lógica de filtros correta.
// ==================================================================== */

import { RECIPES_DB } from '../../../database/recipes.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { MOCK_KNOWN_BLUEPRINTS } from '../../../database/mock_wallet.js'; 

/**
 * Renderiza a aba de Crafting (Craft)
 * @param {object} state - O GameState completo
 * @returns {string} HTML para a aba de Craft
 */
export const renderCraftTab = (state) => {
    const { playerInventory, uiState } = state;
    const { craftFilterType, craftFilterTribe } = uiState;
    
    // 1. Pega TODOS os blueprints conhecidos
    let knownRecipes = MOCK_KNOWN_BLUEPRINTS
        .map(recipeId => RECIPES_DB[recipeId])
        .filter(Boolean); 

    // 2. Filtra APENAS pelos tipos 'CRAFT' ou 'UPGRADE'
    knownRecipes = knownRecipes.filter(recipe => recipe.type === 'CRAFT' || recipe.type === 'UPGRADE');

    // 3. Aplica os filtros da UI (Type)
    if (craftFilterType !== 'all') {
        knownRecipes = knownRecipes.filter(recipe => {
            if (craftFilterType === 'equipment') return recipe.type === 'CRAFT';
            if (craftFilterType === 'component') return recipe.type === 'UPGRADE';
            return false;
        });
    }

    // 4. Renderiza os Filtros da UI
    const filterHTML = `
        <div class="inventory-filters">
            <div class="filter-group">
                <label>Filter Type:</label>
                <select id="craft-filter-type">
                    <option value="all" ${craftFilterType === 'all' ? 'selected' : ''}>All Blueprints</option>
                    <option value="equipment" ${craftFilterType === 'equipment' ? 'selected' : ''}>Equipment</option>
                    <option value="component" ${craftFilterType === 'component' ? 'selected' : ''}>Components</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Filter Tribe:</label>
                <select id="craft-filter-tribe" disabled>
                    <option value="all" ${craftFilterTribe === 'all' ? 'selected' : ''}>All Tribes</option>
                </select>
            </div>
        </div>
    `;

    // 5. Renderiza os Cards de Receita (Rich Cards)
    let recipesHTML = '';
    if (knownRecipes.length === 0) {
        recipesHTML = '<p>No matching blueprints found.</p>';
    } else {
        recipesHTML = knownRecipes.map(recipe => {
            const outputItemData = EQUIPMENT_DB[recipe.output.itemId] || COMPONENTS_DB[recipe.output.itemId];
            if (!outputItemData) return ''; 

            const outputIconPath = outputItemData.iconPath || 'assets/ui/icon_unknown.png';
            
            // (NOVO) Determina a raridade para a borda do card
            const rarity = outputItemData.base_rarity || 'COMMON'; // Equipamentos tem base_rarity
            const rarityClass = `rarity-${rarity.toLowerCase()}`;

            // Lógica de Ingredientes (Materiais)
            const inputMaterialsHTML = Object.keys(recipe.inputMaterials).map(matId => {
                const required = recipe.inputMaterials[matId];
                const owned = playerInventory.materials[matId] || 0;
                const matData = MATERIALS_DB[matId];
                const isAvailable = owned >= required;
                // Visual de Badge para ingredientes
                const badgeClass = isAvailable ? 'available' : 'missing';
                const colorStyle = isAvailable ? 'color: var(--color-accent-green); border-color: var(--color-accent-green);' : 'color: var(--color-accent-red); border-color: var(--color-accent-red);';
                
                return `
                    <div class="recipe-input-item" style="border: 1px solid #444; padding: 4px; border-radius: 4px; ${colorStyle}">
                        <img src="${matData.iconPath}" alt="${matData.name}" style="width: 20px; height: 20px; vertical-align: middle;">
                        <span style="font-size: 0.8em; font-weight: bold;">${owned}/${required}</span>
                    </div>
                `;
            }).join('');
            
            // Lógica de Ingredientes (Componentes)
            const inputComponentsHTML = Object.keys(recipe.inputComponents).map(compId => {
                const required = recipe.inputComponents[compId];
                const owned = playerInventory.components.filter(c => c.item_id === compId).length;
                const compData = COMPONENTS_DB[compId];
                const isAvailable = owned >= required;
                const colorStyle = isAvailable ? 'color: var(--color-accent-green); border-color: var(--color-accent-green);' : 'color: var(--color-accent-red); border-color: var(--color-accent-red);';

                return `
                    <div class="recipe-input-item" style="border: 1px solid #444; padding: 4px; border-radius: 4px; ${colorStyle}">
                        <img src="${compData.iconPath}" alt="${compData.name}" style="width: 20px; height: 20px; vertical-align: middle;">
                        <span style="font-size: 0.8em; font-weight: bold;">${owned}/${required}</span>
                    </div>
                `;
            }).join('');

            // Botão de Ação
            const canCraft = Object.keys(recipe.inputMaterials).every(matId => (playerInventory.materials[matId] || 0) >= recipe.inputMaterials[matId]) &&
                             Object.keys(recipe.inputComponents).every(compId => playerInventory.components.filter(c => c.item_id === compId).length >= recipe.inputComponents[compId]);

            const btnClass = canCraft ? 'btn-success' : 'disabled';
            const btnAttr = canCraft ? '' : 'disabled';
            const btnLabel = recipe.type === 'CRAFT' ? 'CRAFT' : 'UPGRADE';

            // --- Montagem do Card (Usando classes item-card) ---
            return `
                <div class="recipe-card item-card ${rarityClass}" data-recipe-id="${recipe.recipeId}" style="padding: 0;">
                    <div class="card-header">
                        <div class="card-icon-frame"><img src="${outputIconPath}" alt="${outputItemData.name}"></div>
                        <div class="card-header-text">
                            <h4>${recipe.name}</h4>
                            <span class="card-level">${rarity} Output</span>
                        </div>
                    </div>
                    
                    <div class="recipe-content-wrapper" style="padding: 10px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                        <div class="recipe-inputs" style="display: flex; flex-wrap: wrap; gap: 5px; flex-grow: 1;">
                            ${inputMaterialsHTML}
                            ${inputComponentsHTML}
                        </div>
                        
                        <div class="arrow-separator" style="font-size: 1.2em; color: #666;">➔</div>

                        <button 
                            id="btn-execute-craft" 
                            data-recipe-id="${recipe.recipeId}"
                            class="action-btn btn-sm ${btnClass}"
                            ${btnAttr}
                            style="width: auto; min-width: 100px;"
                        >
                            ${btnLabel}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    return `
        ${filterHTML}
        <div class="craft-list">${recipesHTML}</div>
    `;
};
