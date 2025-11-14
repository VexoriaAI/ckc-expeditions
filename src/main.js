/* ====================================================================
// SRC/MAIN.JS (O Cérebro)
// Ponto de entrada. Anexa listeners e coordena os módulos.
// ==================================================================== */

// Importa o Coração (Estado) e os Braços (UI)
import GameState from './core/GameState.js';
import UIManager from './ui/UIManager.js';

// --- 1. CACHE DO DOM ---
// Cacheia apenas elementos GLOBAIS e o 'palco'
const DOM = {
    header: {
        headerConnectBtn: document.getElementById('header-connect-btn')
    },
    appRoot: document.getElementById('app-root'),
    modals: {
        // (Vamos cachear os modais aqui)
    }
};

/* ==================================================================== */
/* 2. HANDLERS (O que os cliques fazem)
/* ==================================================================== */

function handleConnectWallet() {
    console.log("Handler: Connect Wallet");
    
    // 1. Atualiza o Estado
    GameState.initializeWallet();
    GameState.setScreen('hub-selection-screen');
    
    // 2. Atualiza a UI
    UIManager.updateHeader();
    UIManager.renderCurrentScreen();
    
    // 3. Anexa listeners para a NOVA tela (Delegação)
    attachHubSelectionListeners();
}

function handleDemoGame() {
    console.log("Handler: Play Demo");
    GameState.initializeWallet();
    
    // (Lógica futura para encontrar o Kid Demo)
    const demoKidId = GameState.get().player.kidz[0].id; 
    
    GameState.setActiveKid(demoKidId);
    GameState.setScreen('game-screen'); // Pula direto para o jogo
    
    UIManager.updateHeader();
    UIManager.renderCurrentScreen();
    // (Anexar listeners da tela de Jogo)
}

function handleKidSelect(kidId) {
    console.log(`Handler: Kid ${kidId} selecionado`);
    
    // 1. Atualiza o Estado
    GameState.setActiveKid(kidId);
    GameState.setScreen('hub-preparation-screen');
    
    // 2. Renderiza
    UIManager.renderCurrentScreen(); 
    // (Anexar listeners da tela de Preparação)
}


/* ==================================================================== */
/* 3. ANEXAÇÃO DE LISTENERS (Onde a mágica acontece)
/* ==================================================================== */

// Anexa listeners globais que existem desde o início
function attachGlobalListeners() {
    DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet);
    
    // O appRoot "ouve" cliques em botões que ainda não existem
    DOM.appRoot.addEventListener('click', (e) => {
        // Botões da Tela de Login
        if (e.target.id === 'body-connect-btn') handleConnectWallet();
        if (e.target.id === 'demo-game-btn') handleDemoGame();
    });
}

// Anexa listeners específicos da Tela de Seleção
function attachHubSelectionListeners() {
    const grid = document.getElementById('nft-selection-grid');
    if (!grid) return;
    
    // Delegação de evento: Ouve cliques no grid
    grid.addEventListener('click', (e) => {
        const kidButton = e.target.closest('.select-kid-btn');
        if (kidButton) {
            handleKidSelect(kidButton.dataset.kidId);
        }
    });
    
    // (Anexar listeners dos filtros aqui)
}


/* ==================================================================== */
/* 4. INICIALIZAÇÃO
/* ==================================================================== */

function initialize() {
    console.log("Main.js: Anexando listeners globais...");
    attachGlobalListeners();
    
    // Renderiza a primeira tela (Login)
    UIManager.renderCurrentScreen();
    
    console.log("Game V2 (Modular) Inicializado.");
}

// Inicia o jogo!
initialize();
