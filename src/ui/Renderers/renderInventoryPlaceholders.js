/* ====================================================================
// (NOVO) RENDERER: renderInventoryPlaceholders.js
// Renderiza os placeholders para as abas de Componentes, Materiais, etc.
// ==================================================================== */

import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js';

/**
 * Renderiza a aba de Componentes (Formato de Lista Simples)
 */
export const renderInventoryComponents = (state) => {
    const components = state.playerInventory.components;
    if (components.length === 0) return '<p>No Components in inventory.</p>';
    
    const itemsHTML = components.map(item => {
        const itemData = COMPONENTS_DB[item.item_id];
        return `<div class="inventory-list-item"><span>${itemData.name}</span><span>(ID: ${item.instance_id})</span></div>`;
    }).join('');
    
    return `<div class="inventory-list-container">${itemsHTML}</div>`;
};

/**
 * Renderiza a aba de Materiais (Formato de Lista Simples)
 */
export const renderInventoryMaterials = (state) => {
    const materials = state.playerInventory.materials;
    const keys = Object.keys(materials);
    if (keys.length === 0) return '<p>No Materials in inventory.</p>';
    
    const itemsHTML = keys.map(matId => {
        const itemData = MATERIALS_DB[matId];
        const quantity = materials[matId];
        return `<div class="inventory-list-item"><span>${itemData.name}</span><span>x ${quantity}</span></div>`;
    }).join('');

    return `<div class="inventory-list-container">${itemsHTML}</div>`;
};

/**
 * Renderiza a aba de Itens da Loja (Formato de Lista Simples)
 */
export const renderInventoryShopItems = (state) => {
    const shopItems = state.playerInventory.shopItems;
    const keys = Object.keys(shopItems);
    if (keys.length === 0) return '<p>No Shop Items in inventory.</p>';
    
    const itemsHTML = keys.map(itemId => {
        const itemData = SHOP_ITEMS_DB[itemId];
        const quantity = shopItems[itemId];
        return `<div class="inventory-list-item"><span>${itemData.name}</span><span>x ${quantity}</span></div>`;
    }).join('');

    return `<div class="inventory-list-container">${itemsHTML}</div>`;
};
