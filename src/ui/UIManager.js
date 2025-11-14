/* ====================================================================
// UI: UIManager.js
// ATUALIZAÇÃO: Renderiza Kids NFTs dinamicamente na tela de seleção.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; // Importa dados estáticos dos Kids

let appRoot; 

export const UIManager = {
    // ... (init e renderScreen são os mesmos)

    // ... (renderLoggedOutScreen é o mesmo)

    /**
     * Renderiza a Tela 2: hub-selection-screen (Seleção do Kid).
     */
    renderHubSelectionScreen: function(state) {
        // Usa o MOCK_KIDZ_NFTS para simular os NFTs do jogador.
        const kidzData = MOCK_KIDZ_NFTS; 
        
        // 1. Gera o HTML dos cards de Kids
        const kidCardsHTML = kidzData.map(kid => `
            <div class="kid-card" data-kid-id="${kid.id}">
                <img src="${kid.spritePath}" alt="${kid.name}">
                <h3>${kid.name} (#${kid.id})</h3>
                <p>Tribo: <strong>${kid.tribe}</strong> | Nível: ${kid.level}</p>
                <p>HP Base: ${kid.baseStats.maxHP} | Velocidade: ${kid.baseStats.speed}</p>
                <button id="btn-select-kid" class="btn-select">SELECIONAR E PREPARAR</button>
            </div>
        `).join('');

        // 2. Monta o layout da tela
        return `
            <div class="screen hub-selection-screen">
                <h2>Selecione o CyberKid para Expedição</h2>
                <div class="controls-panel">
                    <input type="text" placeholder="Buscar por Kid ID, Nome ou Traço...">
                    <select><option>Filtro por Tribo</option></select>
                </div>
                
                <div class="kid-grid-container">
                    ${kidCardsHTML}
                </div>
                
                <button id="btn-back-to-login" onclick="window.location.reload()" class="btn-secondary mt-4">VOLTAR</button>
            </div>
        `;
    },

    // ... (renderHubPreparationScreen e renderGameScreen são os mesmos)
};
