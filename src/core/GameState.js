/* ====================================================================
// CORE: GameState.js
// UPDATE: (Passo 3.2 - Fix End Expedition)
// Atualiza a estrutura do 'expedition' no INITIAL_STATE para evitar
// crash ao resetar a expedição (adiciona position e foundLoot).
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

    // 4. (ATUALIZADO) Expedition Data (Schema Correto)
    expedition: {
        kidStats: null, 
        
        currentHP: 0, maxHP: 0,
        currentAP: 0, maxAP: 0,
        currentMP: 0, maxMP: 0,
        
        currentDay: 1, 
        maxDays: 10,
        
        // (FIX) Inicializa position e nodeId para evitar crash no reset
        position: { nodeId: null }, 
        
        log: [],
        
        // (FIX) Inicializa foundLoot
        foundLoot: { 
            materials: {},
            components: [],
            equipment: []
        }
    },
    
    // 5. UI State
    uiState: {
        activeInventoryTab: 'equipments',
        activeWorkshopTab: 'craft', 
        inventoryEquipmentFilter: 'all', 
        inventoryEquipmentSort: 'power',  
        craftFilterType: 'all', 
        craftFilterTribe: 'all',
        skipAnimations: false 
    },
    
    // 6. UI State para o Workshop EMBED
    embedTargetEquipmentId: null, 
    embedTargetComponentId: null, 
    embedTargetSlotIndex: null,

    // 7. Estado do Modal Global
    isModalOpen: false,
    modalContent: null, 
    modalTargetSlot: null,
    modalData: null, 
    isModalAutoClose: false 
};

let gameState = { ...INITIAL_STATE };

export const getState = () => {
    return JSON.parse(JSON.stringify(gameState));
};

export const updateState = (updates) => {
    // Deep merge para objetos de estado aninhados
    if (updates.hubSelectionFilters) {
        gameState.hubSelectionFilters = {
            ...gameState.hubSelectionFilters,
            ...updates.hubSelectionFilters
        };
        delete updates.hubSelectionFilters;
    }
    if (updates.uiState) { 
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

export const openModal = (contentId, data = null, autoClose = false) => {
    updateState({
        isModalOpen: true,
        modalContent: contentId,
        modalData: data,
        isModalAutoClose: autoClose
    });
};

export const closeModal = () => {
    updateState({
        isModalOpen: false,
        modalContent: null,
        modalData: null,
        isModalAutoClose: false,
        embedTargetEquipmentId: null,
        embedTargetComponentId: null,
        embedTargetSlotIndex: null,
        modalTargetSlot: null
    });
};
