/* ====================================================================
// (NOVO) RENDERER: renderInventoryShopItems.js
// Renderiza a aba 'Shop Items' usando Rich Cards com botões "USE".
// ==================================================================== */

import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js';

/**
 * Renderiza a aba de Itens da Loja (Consumíveis)
 * @param {object} state - O GameState completo
 * @returns {string} HTML para a aba de Itens da Loja
 */
export const renderInventoryShopItems = (state) => {
    const { playerInventory } = state;
    const shopItems = playerInventory.shopItems;
    const keys = Object.keys(shopItems);
    
    if (keys.length === 0) {
        return `<div class="item-grid-container"><p>No Shop Items in inventory.</p></div>`;
    }

    const itemCardsHTML = keys.map(itemId => {
        const itemData = SHOP_ITEMS_DB[itemId];
        const quantity = shopItems[itemId];
        if (!itemData) return '';

        // (Sugestão Aprovada) Botão "USE"
        // Atribui uma ação de modal baseada no ID do item
        let actionId = '';
        if (itemId === 'rarity_upgrade_token') {
            actionId = 'MODAL_SELECT_EQUIPMENT_FOR_RARITY';
        } else if (itemId === 'slot_unlock_token') {
            actionId = 'MODAL_SELECT_EQUIPMENT_FOR_SLOT';
        } else if (itemId === 'component_extractor') {
            actionId = 'MODAL_SELECT_EQUIPMENT_FOR_EXTRACT';
        }
        
        const actionButton = actionId
            ? `<button id="btn-inv-use-item" data-item-id="${itemId}" data-modal-action="${actionId}" class="action-btn btn-sm btn-success">USE</button>`
            : `<span class="card-level">(Cannot be used from here)</span>`; // Ex: AP Refill

        return `
            <div class="item-card rarity-common">
                <div class="card-header">
                    <div class="card-icon-frame"><img src="${itemData.iconPath}" alt="${itemData.name}"></div>
                    <div class="card-header-text">
                        <h4>${itemData.name}</h4>
                        <span class="card-level">Owned: ${quantity}</span>
                    </div>
                </div>
                <div class="card-body">
                    <p>${itemData.description}</p>
                </div>
                <div class="card-actions">
                    ${actionButton}
                </div>
            </div>
        `;
    }).join('');

    return `<div class="item-grid-container">${itemCardsHTML}</div>`;
};
