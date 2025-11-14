/* ====================================================================
// CORE: GameState.js
// UPDATE: Adiciona lógica de pré-processamento para inicializar chaves dinâmicas
// (como isEquipped) nos itens do inventário mock.
// ==================================================================== */

import { MOCK_INVENTORY, MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 

// Estado inicial... (estrutura idêntica)
const INITIAL_STATE = {
    currentScreen: 'logged-out-screen',
    isWalletConnected: false,
    currentPlayerKidId: null,
    playerInventory: {
        materials: {}, 
        equipment: [], 
        components: [], 
        shopItems: {}, 
    },
    expedition: {
        kidStats: null, 
        currentLocation: null,
        AP: 0, 
        MP: 0, 
        log: [],
    },
    playerKidz: [], // Array para armazenar os NFTs Kidz do jogador
};

let gameState = { ...INITIAL_STATE };
// ... (getState, updateState, setCurrentScreen, resetState são os mesmos)

/**
 * Carrega dados de demonstração (MOCK) para simular um jogador logado.
 */
export const loadDemoData = () => {
    console.log('GameState: Loading DEMO data (MOCK_WALLET) and initializing dynamic keys.');
    
    // 1. Carrega Kids (NFTs)
    gameState.playerKidz = MOCK_KIDZ_NFTS;

    // 2. Pré-processa e Carrega o Inventário
    
    // Inicializa o novo objeto de inventário
    const processedInventory = {
        materials: MOCK_INVENTORY.materials,
        components: MOCK_INVENTORY.components,
        shopItems: MOCK_INVENTORY.shopItems,
        
        // CRÍTICO: Processa equipamentos para adicionar a chave dinâmica isEquipped
        equipment: MOCK_INVENTORY.equipment.map(item => ({
            ...item,
            // Adiciona a chave de estado dinâmico, sempre false ao carregar
            isEquipped: false 
        }))
    };
    
    gameState.playerInventory = processedInventory;

    // 3. Simula conexão de carteira
    gameState.isWalletConnected = true;

    // A notificação ao UIManager será disparada pelo setCurrentScreen em main.js
};
