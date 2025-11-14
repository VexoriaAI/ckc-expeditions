/* ====================================================================
// SRC/MAIN.JS (O Cérebro)
// Ponto de entrada. Importa dados, inicializa o estado e anexa listeners.
// ==================================================================== */

// --- 1. IMPORTAÇÕES ---
// Importa o Coração (Estado)
import { GameState } from './core/GameState.js';

// (Importa os "Braços" - Vamos criar este arquivo no próximo passo)
// import { UIManager } from './ui/UIManager.js';

// (Importa os Dados - Apenas para logar, o GameState já os usou)
import { MOCK_WALLET } from '../database/mock_wallet.js';
console.log(`Main.js: ${MOCK_WALLET.length} Kidz carregados do DB.`);


// --- 2. CACHE DO DOM ---
// Pega referências dos elementos que NUNCA mudam (Header, Modais, etc)
const DOM = {
    header: {
        tezeriumDisplay: document.getElementById('tezerium-display'),
        tezeriumBalance: document.getElementById('tezerium-balance'),
        headerConnectBtn: document.getElementById('header-connect-btn'),
        connectionStatus: document.getElementById('connection-status')
    },
    // O "app-root" é onde vamos desenhar as telas
    appRoot: document.getElementById('app-root'),
    
    // Telas (Vamos gerenciá-las via UI Manager depois)
    // Por enquanto, vamos simular a lógica de login
};

console.log("Main.js: DOM Cacheado.");

/* ==================================================================== */
/* 3. LÓGICA DE NAVEGAÇÃO INICIAL (Temporária)
/* ==================================================================== */

// Esta é uma simulação do que o UIManager.js fará
// Isso é temporário para testar o fluxo de login
function renderCurrentScreen() {
    const screen = GameState.state.currentScreen;
    
    // Limpa a tela
    DOM.appRoot.innerHTML = ''; 
    
    if (screen === 'logged-out-screen') {
        // Desenha a tela de login (HTML injetado)
        DOM.appRoot.innerHTML = `
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
        `;
        // Anexa listeners para os botões que acabamos de criar
        document.getElementById('body-connect-btn').addEventListener('click', handleConnectWallet);
        document.getElementById('demo-game-btn').addEventListener('click', handleDemoGame);

    } else if (screen === 'hub-selection-screen') {
        // Desenha a tela de seleção (HTML injetado)
        DOM.appRoot.innerHTML = `
            <section id="hub-selection-screen" class="screen" style="display: block;">
                <div class="hub-container">
                    <h2>SELECT YOUR KID</h2>
                    <div class="nft-grid">
                        <div class="nft-card panel">Card de Kid 1 (WIP)</div>
                        <div class="nft-card panel">Card de Kid 2 (WIP)</div>
                    </div>
                </div>
            </section>
        `;
        // (Anexaríamos os cliques do grid aqui)
    }
}

/* ==================================================================== */
/* 4. HANDLERS (O que os botões fazem)
/* ==================================================================== */

function handleConnectWallet() {
    console.log("Handler: Connect Wallet Clicado");
    
    // 1. Lógica (Coração)
    GameState.initializeWallet();
    GameState.setScreen('hub-selection-screen');
    
    // 2. UI (Braços)
    DOM.header.tezeriumDisplay.style.visibility = 'visible';
    DOM.header.tezeriumBalance.textContent = GameState.getPlayerTezerium();
    DOM.header.headerConnectBtn.style.display = 'none';
    DOM.header.connectionStatus.style.display = 'inline';
    
    // 3. Renderizar a nova tela
    renderCurrentScreen(); 
}

function handleDemoGame() {
    console.log("Handler: Play Demo Clicado");
    // (Lógica futura)
    handleConnectWallet(); // Por enquanto, faz o mesmo que o login
}

/* ==================================================================== */
/* 5. INICIALIZAÇÃO
/* ==================================================================== */

function initialize() {
    console.log("Main.js: Anexando listeners...");

    // Anexa listeners aos botões PERMANENTES (do index.html)
    DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet);
    
    // Renderiza a primeira tela
    renderCurrentScreen();
    
    console.log("Game_V2 Inicializado.");
}

// Inicia o jogo!
initialize();
