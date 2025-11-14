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
    
    gameState.playerKidz = MOCK_KIDZ_NFTS;

    // 2. Pré-processa e Carrega o Inventário
    const processedInventory = {
        materials: MOCK_INVENTORY.materials,
        components: MOCK_INVENTORY.components,
        shopItems: MOCK_INVENTORY.shopItems,
        
        // CRÍTICO: Processa equipamentos para adicionar a chave dinâmica isEquipped: false
        equipment: MOCK_INVENTORY.equipment.map(item => ({
            ...item,
            isEquipped: false 
        }))
    };
    
    // Simulação de estado salvo: Equipar o primeiro item do inventário (Helmet)
    if (processedInventory.equipment.length > 0) {
        // Encontra o primeiro capacete na lista mock e o marca como equipado
        const helmetIndex = processedInventory.equipment.findIndex(item => item.item_id.includes('helmet'));
        if (helmetIndex !== -1) {
             processedInventory.equipment[helmetIndex].isEquipped = true;
             console.log(`Demo: Item ${processedInventory.equipment[helmetIndex].item_id} set as equipped for initial state.`);
        }
    }
    
    gameState.playerInventory = processedInventory;

    // 3. Simula conexão de carteira
    gameState.isWalletConnected = true;
};
