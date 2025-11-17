/* ====================================================================
// (NOVO) RENDERER: renderInventoryLists.js
// Renderiza as abas de inventário em formato de lista (Materials).
// ==================================================================== */

import { MATERIALS_DB } from '../../../database/materials.js';

/**
 * Renderiza a aba de Materiais (Formato de Tabela/Lista Simples)
 * @param {object} state - O GameState completo
 * @returns {string} HTML para a aba de Materiais
 */
export const renderInventoryMaterials = (state) => {
    const materials = state.playerInventory.materials;
    const keys = Object.keys(materials);
    
    if (keys.length === 0) {
        return '<div class="inventory-list-container"><p>No Materials in inventory.</p></div>';
    }
    
    const itemsHTML = keys.map(matId => {
        const itemData = MATERIALS_DB[matId];
        const quantity = materials[matId];
        if (!itemData) return ''; // Proteção

        return `
            <div class="inventory-list-item">
                <div class="item-list-info">
                    <img src="${itemData.iconPath}" alt="${itemData.name}">
                    <span>${itemData.name}</span>
                </div>
                <span class="item-list-quantity">x ${quantity}</span>
            </div>
        `;
    }).join('');

    return `<div class="inventory-list-container">${itemsHTML}</div>`;
};
