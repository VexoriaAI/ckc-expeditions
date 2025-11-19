/* ====================================================================
// RENDERER: renderWorkshopRefine.js
// UPDATE: (Passo 2.3 - Fix Refine & Visual)
// - Adiciona proteções contra materiais indefinidos (evita crash).
// - Atualiza o visual para usar o padrão 'Rich Card' (.item-card).
// ==================================================================== */

import { RECIPES_DB } from '../../../database/recipes.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js';

/**
 * Renderiza a aba de Refinamento (Refine)
 * @param {object} state - O GameState completo
 * @returns {string} HTML para a aba de Refine
 */
export const renderRefineTab = (state) => {
    const recipes = Object.values(RECIPES_DB).filter(r => r.type === 'REFINE');
    const playerInventory = state.playerInventory;
    
    if (recipes.length === 0) {
        return '<div class="item-grid-container"><p>No refine recipes available.</p></div>';
    }

    const recipesHTML = recipes.map(recipe => {
        // 1. Identifica o Output (Pode ser Material ou Componente)
        const outputItemData = MATERIALS_DB[recipe.output.itemId] || COMPONENTS_DB[recipe.output.itemId];
        
        // Proteção: Se o item de saída não existir, pula a receita (evita crash)
        if (!outputItemData) {
            console.warn(`Refine: Output item '${recipe.output.itemId}' not found in DBs.`);
            return '';
        }

        const outputIconPath = outputItemData.iconPath || 'assets/ui/icon_unknown.png';
        const rarityClass = 'rarity-common'; // Refine geralmente é comum, ou podemos definir lógica futura

        // 2. Renderiza os Materiais de Entrada
        let allInputsAvailable = true;
        
        const inputHTML = Object.keys(recipe.inputMaterials).map(matId => {
            const required = recipe.inputMaterials[matId];
            const owned = playerInventory.materials[matId] || 0;
            const matData = MATERIALS_DB[matId];

            // Proteção: Se o material de entrada não existir
            if (!matData) {
                console.warn(`Refine: Input material '${matId}' not found in MATERIALS_DB.`);
                return `<span class="recipe-input-item missing">Unknown (${matId})</span>`;
            }

            const isAvailable = owned >= required;
            if (!isAvailable) allInputsAvailable = false;
            
            // Estilo visual de Badge para o ingrediente
            const colorStyle = isAvailable 
                ? 'color: var(--color-accent-green); border-color: var(--color-accent-green);' 
                : 'color: var(--color-accent-red); border-color: var(--color-accent-red);';

            return `
                <div class="recipe-input-item" style="border: 1px solid #444; padding: 4px; border-radius: 4px; ${colorStyle}" title="${matData.name}">
                    <img src="${matData.iconPath}" alt="${matData.name}" style="width: 20px; height: 20px; vertical-align: middle;">
                    <span style="font-size: 0.8em; font-weight: bold;">${owned}/${required}</span>
                </div>
            `;
        }).join('');

        // 3. Botão de Ação
        const btnClass = allInputsAvailable ? 'btn-success' : 'disabled';
        const btnAttr = allInputsAvailable ? '' : 'disabled';

        // 4. Montagem do Card (Rich Card Layout)
        return `
            <div class="recipe-card item-card ${rarityClass}" data-recipe-id="${recipe.recipeId}" style="padding: 0;">
                <div class="card-header">
                    <div class="card-icon-frame"><img src="${outputIconPath}" alt="${outputItemData.name}"></div>
                    <div class="card-header-text">
                        <h4>${recipe.name}</h4>
                        <span class="card-level">Refine</span>
                    </div>
                </div>
                
                <div class="recipe-content-wrapper" style="padding: 10px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <div class="recipe-inputs" style="display: flex; flex-wrap: wrap; gap: 5px; flex-grow: 1;">
                        ${inputHTML}
                    </div>
                    
                    <div class="arrow-separator" style="font-size: 1.2em; color: #666;">➔</div>

                    <button 
                        id="btn-execute-refine" 
                        data-recipe-id="${recipe.recipeId}"
                        class="action-btn btn-sm ${btnClass}"
                        ${btnAttr}
                        style="width: auto; min-width: 100px;"
                    >
                        REFINE
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Retorna dentro do grid container para manter o layout
    return `<div class="craft-list">${recipesHTML}</div>`;
};
