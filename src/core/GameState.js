/* ====================================================================
// CORE: GameState.js
// UPDATE: Altera a aba padrão do Workshop de 'refine' para 'craft'.
// ==================================================================== */

import { MOCK_INVENTORY, MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 

export const INITIAL_STATE = {
    // 1. Flow Control
    currentScreen: 'logged-out-screen', 
    isWalletConnected: false,

    // 2. Player Data
    currentPlayerKidId: null, 
    playerKidz: [], 

    // 3. Inventory
    playerInventory: {
        materials: {}, 
        equipment: [], 
        components: [], 
        shopItems: {}, 
    },

    // 4. Expedition Data
    expedition: { /* ... */ },
    
    // 5. UI State
    uiState: {
        activeInventoryTab: 'equipments',
        activeWorkshopTab: 'craft', // (ATUALIZADO - 'craft' é a nova aba principal)
        
        inventoryEquipmentFilter: 'all', 
        inventoryEquipmentSort: 'power',  
        
        craftFilterType: 'all', 
        craftFilterTribe: 'all'
    },
    
    // 6. UI State para o Workshop EMBED
    embedTargetEquipmentId: null, 
    embedTargetComponentId: null, 
    embedTargetSlotIndex: null,

    // 7. Estado do Modal Global
    isModalOpen: false,
    modalContent: null,
    modalTargetSlot: null,
    
    // 8. Hub Selection Filters
    hubSelectionFilters: { /* ... */ }
};

let gameState = { ...INITIAL_STATE };

export const getState = () => {
    return JSON.parse(JSON.stringify(gameState));
};

export const updateState = (updates) => {
    // Deep merge para objetos de estado aninhados (Filtros e UI State)
    if (updates.hubSelectionFilters) {
        gameState.hubSelectionFilters = {
            ...gameState.hubSelectionFilters,
            ...updates.hubSelectionFilters
        };
        delete updates.hubSelectionFilters;
    }
    if (updates.uiState) { // (NOVO) Deep merge para uiState
        gameState.uiState = {
            ...gameState.uiState,
            ...updates.uiState
        };
        delete updates.uiState;
    }

    gameState = { ...gameState, ...updates };
    
    if (window.onGameStateChange) {
        window.onGameStateChange(gameState);
    }
};

export const setCurrentScreen = (screenId) => {
    updateState({ currentScreen: screenId });
};

export const resetState = () => {
    const kidz = gameState.playerKidz;
    // Preserva os Kidz e o status da carteira, reseta o resto
    gameState = { 
        ...INITIAL_STATE, 
        playerKidz: kidz, 
        isWalletConnected: gameState.isWalletConnected 
    };
    
    if (!gameState.isWalletConnected) {
        gameState = { ...INITIAL_STATE };
    }
    
    setCurrentScreen(gameState.currentScreen);
};

export const loadDemoData = () => {
    console.log('GameState: Loading DEMO data (MOCK_WALLET) and initializing dynamic keys.');
    
    gameState.playerKidz = MOCK_KIDZ_NFTS;

    const processedInventory = {
        materials: { ...MOCK_INVENTORY.materials },
        components: [ ...MOCK_INVENTORY.components ],
        shopItems: { ...MOCK_INVENTORY.shopItems },
        equipment: MOCK_INVENTORY.equipment.map(item => ({
            ...item,
            isEquipped: false 
        }))
    };
    
    if (processedInventory.equipment.length > 0) {
        const helmetIndex = processedInventory.equipment.findIndex(item => item.item_id.includes('helmet'));
        if (helmetIndex !== -1) {
             processedInventory.equipment[helmetIndex].isEquipped = true;
        }
    }
    
    gameState.playerInventory = processedInventory;
    gameState.isWalletConnected = true;
};

// --- Funções de Controle do Modal ---

export const openModal = (contentId) => {
    updateState({
        isModalOpen: true,
        modalContent: contentId
    });
};

export const closeModal = () => {
    updateState({
        isModalOpen: false,
        modalContent: null,
        // Limpa o estado temporário
        embedTargetEquipmentId: null,
        embedTargetComponentId: null,
        embedTargetSlotIndex: null,
        modalTargetSlot: null
    });
};
