/* ====================================================================
// SRC/UI/UIMANAGER.JS (Os Braços)
// Controla toda a renderização de HTML no DOM.
// ==================================================================== */

import GameState from '../core/GameState.js';
// Importa os DBs necessários para RENDERIZAR dados
import { TRIBES } from '../../database/tribes.js';

// Cache de elementos HTML que NUNCA mudam
const DOM = {
    appRoot: document.getElementById('app-root'),
    header: {
        tezeriumDisplay: document.getElementById('tezerium-display'),
        tezeriumBalance: document.getElementById('tezerium-balance'),
        headerConnectBtn: document.getElementById('header-connect-btn'),
        connectionStatus: document.getElementById('connection-status')
    }
    // (Vamos adicionar os Modais aqui depois)
};

// --- Templates de Tela (O HTML de cada tela) ---

const screens = {
    'logged-out-screen': () => `
        <section id="logged-out-screen" class="screen" style="display: block;">
            <div class="landing-container panel">
                <img src="images/game-logo.png" alt="Logo" id="game-logo">
                <h2>WELCOME</h2><p>Connect your wallet.</p>
                <div class="landing-actions">
                    <button id="body-connect-btn" class="action-btn">Connect Wallet</button>
                    <button id="demo-game-btn" class="action-btn demo-btn">Play Demo</button>
                </div>
            </div>
        </section>
    `,
    
    'hub-selection-screen': () => `
        <section id="hub-selection-screen" class="screen" style="display: block;">
            <div class="hub-container">
                <h2>SELECT YOUR KID</h2>
                <div class="filter-toolbar panel">
                    <input type="text" id="filter-search" placeholder="Search by Name or ID...">
                    <select id="filter-tribe"><option value="all">All Tribes</option></select>
                    <select id="filter-items-per-page"><option value="10">10</option></select>
                    <button id="filter-reset-btn" class="action-btn small-btn">Reset</button>
                </div>
                <div id="nft-selection-grid" class="nft-grid">
                    </div>
                <p id="nft-grid-placeholder" style="display: none;">No Kids found.</p>
                <div id="pagination-controls" class="pagination-controls panel">
                    <button id="pagination-prev" disabled>Prev</button>
                    <span id="pagination-info">Page 1 of 1</span>
                    <button id="pagination-next" disabled>Next</button>
                </div>
            </div>
        </section>
    `
    // (Vamos adicionar 'hub-preparation-screen' e 'game-screen' aqui)
};

// --- Funções de Renderização Específicas ---

function renderHubSelectionGrid() {
    const grid = document.getElementById('nft-selection-grid');
    if (!grid) return;

    const kids = GameState.get().player.kidz; // Pega os kids do estado
    grid.innerHTML = ''; // Limpa
    
    if (kids.length === 0) {
        document.getElementById('nft-grid-placeholder').style.display = 'block';
        return;
    }
    
    kids.forEach(kid => {
        const card = document.createElement('div');
        card.className = 'nft-card panel';
        const tribeName = kid.tribe ? kid.tribe.name : "Unknown";
        card.innerHTML = `
            <img src="${kid.placeholderImg}" onerror="this.src='images/kid-placeholder.png'">
            <h4>${kid.name}</h4><p>ID: ${kid.id}</p><p>${tribeName}</p>
            <button class="action-btn select-kid-btn" data-kid-id="${kid.id}">Manage</button>
        `;
        grid.appendChild(card);
    });
    
    // Popula o filtro de tribos (só precisa fazer isso uma vez)
    const tribeFilter = document.getElementById('filter-tribe');
    if (tribeFilter && tribeFilter.options.length <= 1) {
        Object.values(TRIBES).forEach(t => tribeFilter.innerHTML += `<option value="${t.name}">${t.name}</option>`);
    }
}

// --- Funções Públicas do Módulo ---

const UIManager = {
    // Função principal: Lida com a troca de telas
    renderCurrentScreen: () => {
        const screenId = GameState.get().currentScreen;
        
        // Pega o template HTML da tela
        const screenTemplate = screens[screenId];
        
        if (screenTemplate) {
            // Desenha o HTML no "palco"
            DOM.appRoot.innerHTML = screenTemplate();
            
            // Pós-renderização: Se a tela for o hub, preenche o grid
            if (screenId === 'hub-selection-screen') {
                renderHubSelectionGrid();
            }
        } else {
            DOM.appRoot.innerHTML = `<p>Erro: Tela "${screenId}" não encontrada.</p>`;
        }
    },
    
    // Atualiza o header (ex: Tezerium, status)
    updateHeader: () => {
        DOM.header.tezeriumDisplay.style.visibility = 'visible';
        DOM.header.tezeriumBalance.textContent = GameState.getPlayerTezerium();
        DOM.header.headerConnectBtn.style.display = 'none';
        DOM.header.connectionStatus.style.display = 'inline';
    }
};

export default UIManager;
