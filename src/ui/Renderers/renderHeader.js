/* ====================================================================
// RENDERER: renderHeader.js
// UPDATE: (CORREÇÃO DE ARQUITETURA) Combina o ícone do Troféu e o
// Ticker (letreiro) em um único botão clicável.
// ==================================================================== */

import { MOCK_TEZERIUM_BALANCE } from '../../../database/mock_wallet.js'; 

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
    const rankingIcon = 'assets/ui/icon_ranking.png'; // Ícone do Troféu

    if (state.isWalletConnected) {
        // Estado Logado
        headerLeft = `
            <div class="tezerium-display">
                <img src="${tezeriumIcon}" alt="Tezerium" class="tezerium-icon">
                Tezerium: <span>${MOCK_TEZERIUM_BALANCE || 1000}</span>
            </div>
            <button id="btn-store" class="action-btn btn-secondary btn-sm store-btn">
                <img src="${storeIcon}" alt="Store Icon">
                <span>Store</span>
            </button>
            
            <button id="btn-ranking" class="action-btn btn-secondary btn-sm ranking-ticker-btn">
                <img src="${rankingIcon}" alt="Ranking Icon" class="ranking-icon">
                <div id="ranking-ticker" class="ranking-ticker">
                    <span>Loading rankings...</span>
                </div>
            </button>
            `;
            
        headerRight = `
            <div class="wallet-info">
                <span class="wallet-status-label">Connected</span>
                <span class="wallet-address">KT1FjFG1QrqPCWqYvQcdC4rJz7dEY45eybmf</span>
            </div>
            <button id="btn-logout" class="action-btn btn-sm btn-primary">LOG OUT</button>`;
    } else {
        // Estado Deslogado
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
