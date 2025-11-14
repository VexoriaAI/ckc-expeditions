/* ====================================================================
// UI: UIManager.js
// Os Braços/Olhos - Único módulo autorizado a manipular o DOM.
// Mapeia o estado (state.currentScreen) para o conteúdo HTML da tela.
// ==================================================================== */

let appRoot; // Referência à div <main id="app-root">

/**
 * Inicializa o UIManager, buscando o container principal da aplicação.
 */
export const UIManager = {
    init: function() {
        appRoot = document.getElementById('app-root');
        if (!appRoot) {
            console.error("Erro CRÍTICO: Não foi encontrado o elemento #app-root.");
        }
    },

    /**
     * Limpa o container principal e renderiza o conteúdo da tela baseado no estado.
     * @param {object} state - O estado atual do jogo (retorno de GameState.getState()).
     */
    renderScreen: function(state) {
        if (!appRoot) return; // Proteção

        const screenId = state.currentScreen;
        let htmlContent = '';

        // Limpa o conteúdo anterior
        appRoot.innerHTML = '';
        
        switch (screenId) {
            case 'logged-out-screen':
                htmlContent = this.renderLoggedOutScreen(state);
                break;
            case 'hub-selection-screen':
                htmlContent = this.renderHubSelectionScreen(state);
                break;
            // Outras telas virão aqui: hub-preparation-screen, game-screen
            default:
                htmlContent = `<h2>[ERRO] Tela não encontrada: ${screenId}</h2><p>Verifique o GameState.js.</p>`;
        }

        // Insere o novo conteúdo no DOM e anexa a tela atual como um data-attribute.
        appRoot.innerHTML = htmlContent;
        appRoot.dataset.currentScreen = screenId;
    },

    // --- Funções de Renderização de Telas ---

    /**
     * Renderiza a Tela 1: logged-out-screen (Conexão e Demonstração).
     */
    renderLoggedOutScreen: function(state) {
        const status = state.isWalletConnected ? 'Conectada' : 'Desconectada';
        return `
            <div class="screen logged-out-screen">
                <img src="assets/ui/game-logo.png" alt="CyberKidz Logo" class="logo">
                <h1>CyberKidz Club - Expedições</h1>
                <p>Status da Carteira: <strong>${status}</strong> (Tezos)</p>
                <button id="btn-connect-wallet" class="btn-primary">Connect Wallet</button>
                <button id="btn-play-demo" class="btn-secondary">Play Demo</button>
            </div>
        `;
    },

    /**
     * Renderiza a Tela 2: hub-selection-screen (Seleção do Kid).
     */
    renderHubSelectionScreen: function(state) {
        // NOTA: Aqui, no futuro, buscaremos os dados reais de inventário (playerInventory.equipment)
        // e usaremos o MockWallet.js para mostrar os NFTs do jogador.
        
        // Exemplo simples para a Fase 2 (Apenas um placeholder)
        return `
            <div class="screen hub-selection-screen">
                <h2>Selecione o CyberKid para Expedição</h2>
                <div class="kid-grid-container">
                    <div class="kid-card placeholder" data-kid-id="DEMO_KID_ID">
                        <img src="assets/characters/kid_combat_sprite.png" alt="Kid Placeholder">
                        <h3>CyberKid #1234 (Volcanic)</h3>
                        <p>Power Score: 85</p>
                        <button id="btn-select-kid" data-kid-id="DEMO_KID_ID" class="btn-select">SELECIONAR E PREPARAR</button>
                    </div>
                    
                    <div class="kid-card placeholder">
                        <p>NFT Card 2 (Vazio)</p>
                    </div>
                </div>
                <button id="btn-back-to-login" onclick="window.location.reload()" class="btn-secondary mt-4">VOLTAR</button>
            </div>
        `;
    }
};
