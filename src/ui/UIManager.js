/* ====================================================================
// UI: UIManager.js (Refatorado)
// UPDATE: Importa e chama o 'renderGameScreen' (Tela de Expedição).
// ==================================================================== */

// Importações dos Renderers
import { renderHeader } from './Renderers/renderHeader.js';
import { renderLoggedOutScreen } from './Renderers/renderLoggedOutScreen.js';
import { renderHubSelectionScreen } from './Renderers/renderHubSelection.js';
import { renderHubPreparationScreen } from './Renderers/renderHubPreparation.js';
import { renderGameScreen } from './Renderers/renderGameScreen.js'; // (ATUALIZADO)
import { renderStoreScreen } from './Renderers/renderStoreScreen.js';
import { renderRankingScreen } from './Renderers/renderRankingScreen.js'; 

let appRoot; 

export const UIManager = {
    init: function() {
        appRoot = document.getElementById('app-root');
        if (!appRoot) {
            console.error("CRITICAL Error: #app-root element not found.");
        }
    },

    /**
     * Ponto de entrada principal para renderização.
     * @param {object} state - O GameState completo.
     */
    renderScreen: function(state) {
        if (!appRoot) return; 

        const screenId = state.currentScreen;
        let htmlContent = '';
        
        appRoot.innerHTML = ''; 
        appRoot.innerHTML = renderHeader(state);

        switch (screenId) {
            case 'logged-out-screen':
                htmlContent = renderLoggedOutScreen(state);
                break;
            case 'hub-selection-screen':
                htmlContent = renderHubSelectionScreen(state);
                break;
            case 'hub-preparation-screen':
                htmlContent = renderHubPreparationScreen(state);
                break;
            
            case 'game-screen': // (ATUALIZADO)
                htmlContent = renderGameScreen(state);
                break;
            
            case 'store-screen':
                htmlContent = renderStoreScreen(state);
                break;
            case 'ranking-screen': 
                htmlContent = renderRankingScreen(state);
                break;

            default:
                htmlContent = `<h2>[ERROR] Screen Not Found: ${screenId}</h2>`;
        }
        
        appRoot.innerHTML += htmlContent; 
        appRoot.dataset.currentScreen = screenId;
    },
};
