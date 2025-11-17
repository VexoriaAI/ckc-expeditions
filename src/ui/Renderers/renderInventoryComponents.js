/* ====================================================================
// (NOVO) RENDERER: renderInventoryComponents.js
// Renderiza a aba 'Components' usando Rich Cards.
// ==================================================================== */

import { COMPONENTS_DB } from '../../../database/components.js';

/**
 * Renderiza a aba de Componentes
 * @param {object} state - O GameState completo
 * @returns {string} HTML para a aba de Componentes
 */
export const renderInventoryComponents = (state) => {
    const { playerInventory } = state;
    
    // TODO: Adicionar Filtros e Ordenação para Componentes
    let filteredItems = [...playerInventory.components];

    if (filteredItems.length === 0) {
        return `<div class="item-grid-container"><p>No Components in inventory.</p></div>`;
    }

    const itemCardsHTML = filteredItems.map(item => {
        const itemData = COMPONENTS_DB[item.item_id];
        if (!itemData) return ''; // Proteção caso o item não exista

        const statsHTML = Object.keys(itemData.stats).map(statKey => `
            <div class="card-stat-row">
                <span>${statKey.toUpperCase()}</span>
                <span class="card-stat-val">+${itemData.stats[statKey]}</span>
            </div>
        `).join('');

        // (Futuro) Botão de Ação Rápida
        // const actionButton = `<button id="btn-inv-upgrade-comp" data-instance-id="${item.instance_id}" class="action-btn btn-sm btn-info">UPGRADE</button>`;
        const actionButton = ''; // Sem ações por enquanto

        return `
            <div class="item-card rarity-common">
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
                <div class="card-actions">
                    ${actionButton}
                </div>
            </div>
        `;
    }).join('');

    return `<div class="item-grid-container">${itemCardsHTML}</div>`;
};
