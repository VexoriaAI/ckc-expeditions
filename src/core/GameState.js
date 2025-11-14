/* ====================================================================
// CORE: GameState.js
// UPDATE: Adds state for Hub Selection filters and pagination.
// ==================================================================== */

import { MOCK_INVENTORY, MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 

// Exportamos o INITIAL_STATE para uso na função Reset
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

    // (NOVO) UI State para o Workshop EMBED
    embedTargetEquipmentId: null, // Armazena o instance_id do equipamento selecionado
    embedTargetComponentId: null, // Armazena o instance_id do componente selecionado
    embedTargetSlotIndex: null, // Armazena o índice (0, 1, 2...) do slot selecionado
    
    // Hub Selection Filters
    hubSelectionFilters: {
        searchQuery: '',
        selectedTribes: [], // Array para 'select multiple'
        sortBy: 'level',    // 'level' ou 'power'
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
        // Remove it from the main update object to avoid overwriting
        delete updates.hubSelectionFilters;
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
