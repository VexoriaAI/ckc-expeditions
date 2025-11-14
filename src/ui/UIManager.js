/* ====================================================================
// UI: UIManager.js
// ATUALIZAÇÃO: Adiciona a renderização da hub-preparation-screen.
// ==================================================================== */

let appRoot; 

export const UIManager = {
    init: function() {
        appRoot = document.getElementById('app-root');
        if (!appRoot) {
            console.error("Erro CRÍTICO: Não foi encontrado o elemento #app-root.");
        }
    },

    renderScreen: function(state) {
        if (!appRoot) return; 

        const screenId = state.currentScreen;
        let htmlContent = '';

        appRoot.innerHTML = '';
        
        switch (screenId) {
            case 'logged-out-screen':
                htmlContent = this.renderLoggedOutScreen(state);
                break;
            case 'hub-selection-screen':
                htmlContent = this.renderHubSelectionScreen(state);
                break;
            case 'hub-preparation-screen': // NOVA TELA
                htmlContent = this.renderHubPreparationScreen(state);
                break;
            case 'game-screen': // Placeholder
                htmlContent = this.renderGameScreen(state);
                break;
            default:
                htmlContent = `<h2>[ERRO] Tela não encontrada: ${screenId}</h2><p>Verifique o GameState.js.</p>`;
        }

        appRoot.innerHTML = htmlContent;
        appRoot.dataset.currentScreen = screenId;
    },

    // --- Funções de Renderização de Telas (omissão de logged-out-screen para brevidade) ---

    renderHubSelectionScreen: function(state) {
        // Usaremos um Kid ID de demonstração 'CKID-DEMO-001' para testar o fluxo.
        const DEMO_KID_ID = 'CKID-DEMO-001';
        
        return `
            <div class="screen hub-selection-screen">
                <h2>Selecione o CyberKid para Expedição</h2>
                <div class="kid-grid-container">
                    <div class="kid-card placeholder" data-kid-id="${DEMO_KID_ID}">
                        <img src="assets/characters/kid_combat_sprite.png" alt="Kid Placeholder">
                        <h3>CyberKid #${DEMO_KID_ID} (DEMO)</h3>
                        <p>Power Score: 85</p>
                        <button id="btn-select-kid" data-kid-id="${DEMO_KID_ID}" class="btn-select">SELECIONAR E PREPARAR</button>
                    </div>
                    
                    <div class="kid-card placeholder">
                        <p>NFT Card 2 (Vazio)</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderiza a Tela 3: hub-preparation-screen (Preparação de Equipamento/Workshop).
     */
    renderHubPreparationScreen: function(state) {
        // Puxa o ID do Kid do estado para mostrar no cabeçalho
        const kidId = state.currentPlayerKidId || 'ERRO: Kid Não Selecionado';
        
        return `
            <div class="screen hub-preparation-screen container-fluid">
                <h1>Preparação para Expedição - Kid #${kidId}</h1>
                <div class="row">
                    <div class="col-4 character-sheet-col">
                        <h3>Ficha do Kid</h3>
                        <p>DNA Ativo: [A ser implementado]</p>
                        
                        <div class="mannequin-slots">
                            <div class="slot" data-slot-type="helmet">[Capacete]</div>
                            <div class="slot" data-slot-type="weapon">[Arma]</div>
                            </div>
                        
                        <div class="stats-summary">
                            <h4>Atributos Totais:</h4>
                            <ul>
                                <li>HP: 100</li>
                                <li>Speed (MP): 5</li>
                                <li>Attack (AP): 2</li>
                            </ul>
                        </div>
                        
                        <button id="btn-start-expedition" class="btn-success btn-lg mt-3">INICIAR EXPEDIÇÃO</button>
                    </div>

                    <div class="col-8 inventory-workshop-col">
                        <div class="inventory-panel">
                            <ul class="nav nav-tabs" id="inventory-tabs">
                                <li class="nav-item"><a class="nav-link active" data-tab="equipments">Equipamentos</a></li>
                                <li class="nav-item"><a class="nav-link" data-tab="components">Componentes</a></li>
                                <li class="nav-item"><a class="nav-link" data-tab="materials">Materiais</a></li>
                                <li class="nav-item"><a class="nav-link" data-tab="shop-items">Itens Loja</a></li>
                            </ul>
                            <div id="inventory-content" class="tab-content">
                                <p class="mt-3">[Conteúdo do Inventário será renderizado aqui]</p>
                            </div>
                        </div>

                        <div class="workshop-panel mt-4">
                            <ul class="nav nav-tabs" id="workshop-tabs">
                                <li class="nav-item"><a class="nav-link active" data-tab="refine">Refinar</a></li>
                                <li class="nav-item"><a class="nav-link" data-tab="craft">Craftar</a></li>
                                <li class="nav-item"><a class="nav-link" data-tab="embed">Embutir (Embed)</a></li>
                            </ul>
                            <div id="workshop-content" class="tab-content">
                                <p class="mt-3">[Lógica do Workshop será renderizada aqui]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Placeholder para a tela de jogo
    renderGameScreen: function(state) {
        return `
            <div class="screen game-screen">
                <h2>Expedição em Andamento!</h2>
                <p>Kid: #${state.currentPlayerKidId} está no mapa.</p>
                <div class="map-placeholder"></div>
                <button id="btn-end-expedition" class="btn-danger">Voltar ao HUB</button>
            </div>
        `;
    }
};
