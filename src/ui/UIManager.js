/* ====================================================================
// UI: UIManager.js (Refatorado)
// UPDATE: Importa e chama 'renderStoreScreen'.
// ==================================================================== */

// Importações dos Renderers
import { renderHeader } from './Renderers/renderHeader.js';
import { renderLoggedOutScreen } from './Renderers/renderLoggedOutScreen.js';
import { renderHubSelectionScreen } from './Renderers/renderHubSelection.js';
import { renderHubPreparationScreen } from './Renderers/renderHubPreparation.js';
import { renderGameScreen } from './Renderers/renderGameScreen.js';
import { renderStoreScreen } from './Renderers/renderStoreScreen.js'; // (NOVO)

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
     * Limpa o appRoot, renderiza o Header e a Tela Atual.
     * @param {object} state - O GameState completo.
     */
    renderScreen: function(state) {
        if (!appRoot) return; 

        const screenId = state.currentScreen;
        let htmlContent = '';
        
        // Limpa a tela
        appRoot.innerHTML = ''; 
        
        // Renderiza o Header primeiro
        appRoot.innerHTML = renderHeader(state);

        // Renderiza o conteúdo da tela baseado no ID
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
            
            case 'game-screen': 
                htmlContent = renderGameScreen(state);
                break;
            
            case 'store-screen': // (ATUALIZADO)
                htmlContent = renderStoreScreen(state);
                break;

            default:
                htmlContent = `<h2>[ERROR] Screen Not Found: ${screenId}</h2>`;
        }
        
        // Adiciona o conteúdo da tela DEPOIS do header
        appRoot.innerHTML += htmlContent; 
        appRoot.dataset.currentScreen = screenId;
    },
};
