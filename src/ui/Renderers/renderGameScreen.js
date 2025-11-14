/* ====================================================================
// RENDERER: renderGameScreen.js
// Exporta a função para renderizar a tela da expedição (placeholder).
// ==================================================================== */

/**
 * Renders the Game screen (Expedition placeholder).
 * @param {object} state - The current GameState.
 * @returns {string} HTML content for the screen.
 */
export const renderGameScreen = (state) => {
    return `
        <div class="screen game-screen">
            <h2>Expedition in Progress!</h2>
            <p>Kid: #${state.currentPlayerKidId} is on the map.</p>
            <button id="btn-end-expedition" class="action-btn btn-primary">Return to HUB</button>
        </div>
    `;
};
