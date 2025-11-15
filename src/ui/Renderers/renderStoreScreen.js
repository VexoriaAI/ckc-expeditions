/* ====================================================================
// (NOVO) RENDERER: renderStoreScreen.js
// Renderiza a página da Loja (Store), consumindo SHOP_ITEMS_DB.
// ==================================================================== */

import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js';

/**
 * Renderiza um único card de item para a loja.
 * @param {string} itemId - O ID do item (ex: 'unstable_ai_core')
 * @returns {string} HTML para o card do item.
 */
const renderStoreItemCard = (itemId) => {
    const itemData = SHOP_ITEMS_DB[itemId];
    if (!itemData) {
        return '<p>Error: Store Item not found.</p>';
    }

    return `
        <div class="store-item-card panel">
            <img src="${itemData.iconPath}" alt="${itemData.name}">
            <h4>${itemData.name}</h4>
            <p>${itemData.description}</p>
            <button id="btn-buy-item" data-item-id="${itemId}" class="action-btn btn-info">
                Buy (${itemData.price_tezerium} Tezerium)
            </button>
        </div>
    `;
};

/**
 * Renderiza a tela principal da Loja.
 * @param {object} state - O GameState completo.
 * @returns {string} HTML para a tela da Loja.
 */
export const renderStoreScreen = (state) => {

    // --- Seção 1: Item em Destaque (AI Core) ---
    const featuredItemHTML = `
        <div class="store-section featured-item panel">
            <img src="${SHOP_ITEMS_DB['unstable_ai_core'].iconPath}" class="featured-img">
            <div class="featured-details">
                <h2>Create Unique NFTs</h2>
                <p>Use the Unstable AI Core in the new 'AI Forge' (coming soon) along with rare materials to generate a unique, Mythic-tier piece of equipment. These items may become mintable NFTs in the future!</p>
                <button id="btn-buy-item" data-item-id="unstable_ai_core" class="action-btn btn-success">
                    Buy AI Core (${SHOP_ITEMS_DB['unstable_ai_core'].price_tezerium} Tezerium)
                </button>
            </div>
        </div>
    `;

    // --- Seção 2: Crafting & Upgrade ---
    const craftingItemsHTML = `
        <div class="store-section panel">
            <h3>Crafting & Upgrade</h3>
            <div class="store-grid">
                ${renderStoreItemCard('rarity_upgrade_token')}
                ${renderStoreItemCard('slot_unlock_token')}
                ${renderStoreItemCard('component_extractor')}
            </div>
        </div>
    `;
    
    // --- Seção 3: Expedition Utility ---
    const utilityItemsHTML = `
        <div class="store-section panel">
            <h3>Expedition Utility</h3>
            <div class="store-grid">
                ${renderStoreItemCard('ap_refill')}
                </div>
        </div>
    `;

    // --- Montagem Final ---
    return `
        <div class="screen store-screen">
            <div class="page-title-bar">
                <h1>Store</h1>
                <button id="btn-back-to-hub" class="action-btn btn-secondary btn-sm">Back to Hub</button>
            </div>
            
            ${featuredItemHTML}
            ${craftingItemsHTML}
            ${utilityItemsHTML}
        </div>
    `;
};
