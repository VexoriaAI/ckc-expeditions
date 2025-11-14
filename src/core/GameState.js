/* ====================================================================
// CORE: GameState.js
// ATUALIZAÇÃO: Adiciona função para carregar dados mock (demo).
// ==================================================================== */

import { MOCK_INVENTORY, MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; // Importa dados mock

// Estado inicial... (estrutura idêntica ao passo anterior)
const INITIAL_STATE = {
    // ... (restante do INITIAL_STATE)
    isWalletConnected: false,
    currentPlayerKidId: null, 
    playerInventory: {
        materials: {}, 
        equipment: [], 
        components: [], 
        shopItems: {}, 
    },
    // ...
};

// ... (definição de gameState, getState, updateState, setCurrentScreen, resetState)

/**
 * Carrega dados de demonstração (MOCK) para simular um jogador logado.
 */
export const loadDemoData = () => {
    console.log('GameState: Carregando dados de DEMONSTRAÇÃO (MOCK_WALLET).');
    
    // 1. Adiciona os Kids (NFTs) à uma nova propriedade do estado.
    // Isso simula os NFTs que o jogador possui.
    gameState.playerKidz = MOCK_KIDZ_NFTS;

    // 2. Carrega o inventário inicial
    gameState.playerInventory = MOCK_INVENTORY;

    // 3. Define o primeiro Kid da lista como o Kid inicialmente selecionado para a tela de Seleção
    // NOTA: O GDD diz que a tela deve ser 'hub-selection-screen' primeiro. 
    // Vamos manter o currentPlayerKidId como null, e setar 'isWalletConnected' para true.
    gameState.isWalletConnected = true;

    // A notificação ao UIManager será feita pelo setCurrentScreen em main.js
};
