/* ====================================================================
// RENDERER: renderHeader.js
// PATH CORRECTION: ../../database/
// ==================================================================== */

import { MOCK_TEZERIUM_BALANCE } from '../../database/mock_wallet.js'; 

/**
 * Renders the global header based on wallet connection state.
 * @param {object} state - The current GameState.
 * @returns {string} HTML content for the header.
 */
export const renderHeader = (state) => {
    let headerRight = '';
    let headerLeft = '';
    const tezeriumIcon = 'assets/ui/icon_tezerium.png'; 
    const storeIcon = 'assets/ui/icon_store.png'; 

    if (state.isWalletConnected) {
        // Logged In State
        headerLeft = `
            <div class="tezerium-display">
                <img src="${tezeriumIcon}" alt="Tezerium" class="tezerium-icon">
                Tezerium: <span>${MOCK_TEZERIUM_BALANCE || 1000}</span>
            </div>
            <button id="btn-store" class="action-btn btn-secondary btn-sm store-btn">
                <img src="${storeIcon}" alt="Store Icon">
                <span>Store</span>
            </button>
            `;
        headerRight = `
            <div class="wallet-info">
                <span class="wallet-status-label">Connected</span>
                <span class="wallet-address">KT1FjFG1QrqPCWqYvQcdC4rJz7dEY45eybmf</span>
            </div>
            <button id="btn-logout" class="action-btn btn-sm btn-primary">LOG OUT</button>`;
    } else {
        // Logged Out State
        headerRight = `
            <button id="btn-connect-wallet" class="action-btn btn-sm btn-primary">CONNECT WALLET</button>`;
    }

    return `
        <header class="main-header">
            <div class="header-left">
                ${headerLeft}
            </div>
            <div class="header-right">
                ${headerRight}
            </div>
        </header>`;
};
