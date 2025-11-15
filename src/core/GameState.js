/* ====================================================================
// CORE: GameState.js
// UPDATE: Adiciona funções helper openModal() e closeModal() 
// para gerenciar o estado do modal.
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
    
    // 5. UI State
    activeWorkshopTab: 'refine',
    activeInventoryTab: 'equipments',
    
    // 6. UI State para o Workshop EMBED
    embedTargetEquipmentId: null, 
    embedTargetComponentId: null, 
    embedTargetSlotIndex: null,

    // 7. Estado do Modal Global
    isModalOpen: false,
    modalContent: null, // ex: 'MODAL_SELECT_EQUIPMENT'
    modalTargetSlot: null,
    
    // 8. Hub Selection Filters
    hubSelectionFilters: {
        searchQuery: '',
        selectedTribes: [],
        sortBy: 'level',
        itemsPerPage: 5,
        currentPage: 1,
    }
};

let gameState = { ...INITIAL_STATE };

export const getState = () => {
    return JSON.parse(JSON.stringify(gameState));
};

export const updateState = (updates) => {
    // Deep merge a nested state object like hubSelectionFilters
    if (updates.hubSelectionFilters) {
        gameState.hubSelectionFilters = {
            ...gameState.hubSelectionFilters,
            ...updates.hubSelectionFilters
        };
        delete updates.hubSelectionFilters;
    }

    gameState = { ...gameState, ...updates };
    
    // Notifica o UIManager E o ModalManager
    if (window.onGameStateChange) {
        window.onGameStateChange(gameState);
    }
};

export const setCurrentScreen = (screenId) => {
    updateState({ currentScreen: screenId });
};

export const resetState = () => {
    const kidz = gameState.playerKidz;
    gameState = { ...INITIAL_STATE, playerKidz: kidz, isWalletConnected: gameState.isWalletConnected };
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

// --- (NOVAS) Funções de Controle do Modal ---

/**
 * Abre o modal global e define seu conteúdo.
 * @param {string} contentId - O ID do conteúdo a ser renderizado (ex: 'MODAL_SELECT_EQUIPMENT').
 */
export const openModal = (contentId) => {
    updateState({
        isModalOpen: true,
        modalContent: contentId
    });
};

/**
 * Fecha o modal global.
 */
export const closeModal = () => {
    updateState({
        isModalOpen: false,
        modalContent: null,
        // Limpa o estado temporário do Embed ao fechar
        embedTargetEquipmentId: null,
        embedTargetComponentId: null,
        embedTargetSlotIndex: null
    });
};
