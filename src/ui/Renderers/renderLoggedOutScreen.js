/* ====================================================================
// RENDERER: renderLoggedOutScreen.js
// Exporta a função para renderizar a tela de login.
// ==================================================================== */

/**
 * Renders the Logged Out screen (Login/Demo).
 * @param {object} state - The current GameState.
 * @returns {string} HTML content for the screen.
 */
export const renderLoggedOutScreen = (state) => {
    return `
        <div class="screen logged-out-screen" id="logged-out-screen">
            <div class="landing-container panel">
                <img src="assets/ui/game-logo.png" alt="CyberKidz Logo" id="game-logo">
                <h2>CyberKidz Club - Expeditions</h2>
                <p>Wallet Status: <span id="connection-status">${state.isWalletConnected ? 'Connected' : 'Disconnected'}</span> (Tezos)</p>
                <div class="landing-actions">
                    <button id="btn-connect-wallet" class="action-btn btn-primary">Connect Wallet</button>
                    <button id="btn-play-demo" class="action-btn btn-info">Play Demo</button>
                </div>
            </div>
        </div>
    `;
};
