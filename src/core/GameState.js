/* ====================================================================
// CORE: GameState.js
// UPDATE: (Arquitetura do Modal de Resultado)
// - Adiciona 'modalData' ao estado para armazenar o loot do resultado.
// - Atualiza 'openModal' para aceitar 'modalData' e 'autoClose'.
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
    expedition: {
        kidStats: null, 
        currentLocation: null,
        AP: 0, 
        MP: 0, 
        log: [],
    },
    
    // 5. UI State (Filtros de Inventário, Abas Ativas)
    uiState: {
        activeInventoryTab: 'equipments',
        activeWorkshopTab: 'craft', 
        inventoryEquipmentFilter: 'all', 
        inventoryEquipmentSort: 'power',  
        craftFilterType: 'all', 
        craftFilterTribe: 'all',
        skipAnimations: false // O checkbox da expedição
    },
    
    // 6. UI State para o Workshop EMBED
    embedTargetEquipmentId: null, 
    embedTargetComponentId: null, 
    embedTargetSlotIndex: null,

    // 7. (ATUALIZADO) Estado do Modal Global
    isModalOpen: false,
    modalContent: null, // ex: 'MODAL_SELECT_EQUIPMENT'
    modalTargetSlot: null,
    modalData: null, // (NOVO) Armazena dados para o modal (ex: loot encontrado)
    isModalAutoClose: false // (NOVO) Flag para o ModalManager saber se deve fechar sozinho
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

// --- (ATUALIZADO) Funções de Controle do Modal ---

/**
 * Abre o modal global e define seu conteúdo.
 * @param {string} contentId - O ID do conteúdo (ex: 'MODAL_SELECT_EQUIPMENT').
 * @param {object} [data=null] - Dados opcionais para o modal (ex: loot).
 * @param {boolean} [autoClose=false] - Se o modal deve fechar após 3s.
 */
export const openModal = (contentId, data = null, autoClose = false) => {
    updateState({
        isModalOpen: true,
        modalContent: contentId,
        modalData: data,
        isModalAutoClose: autoClose
    });
};

/**
 * Fecha o modal global.
 */
export const closeModal = () => {
    updateState({
        isModalOpen: false,
        modalContent: null,
        modalData: null,
        isModalAutoClose: false,
        // Limpa o estado temporário
        embedTargetEquipmentId: null,
        embedTargetComponentId: null,
        embedTargetSlotIndex: null,
        modalTargetSlot: null
    });
};
