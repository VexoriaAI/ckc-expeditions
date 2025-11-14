/* ====================================================================
// CORE: GameState.js
// UPDATE: Adds state for active tabs (Workshop/Inventory)
// ==================================================================== */

import { MOCK_INVENTORY, MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 

const INITIAL_STATE = {
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
    
    // 5. UI State (NOVO)
    activeWorkshopTab: 'refine',
    activeInventoryTab: 'equipments',
};

let gameState = { ...INITIAL_STATE };

export const getState = () => {
    return JSON.parse(JSON.stringify(gameState));
};

export const updateState = (updates) => {
    gameState = { ...gameState, ...updates };
    
    if (window.onGameStateChange) {
        window.onGameStateChange(gameState);
    }
};

export const setCurrentScreen = (screenId) => {
    updateState({ currentScreen: screenId });
};

export const resetState = () => {
    // Mantém os playerKidz se estiverem logados, mas reseta o resto
    const kidz = gameState.playerKidz;
    gameState = { ...INITIAL_STATE, playerKidz: kidz };
    
    // Se o logout for completo (sem kidz), use INITIAL_STATE puro
    if (kidz.length === 0) {
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
