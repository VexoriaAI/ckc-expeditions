/* ====================================================================
// CORE: GameState.js
// The Heart - Singleton that stores the current state of the entire game.
// It is the single source of truth for dynamic data.
// Language: English
// ==================================================================== */

// NOTE: The path must be '../../' (two steps up) to get from src/core/ to the root, then database/
import { MOCK_INVENTORY, MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 

// Initial State (Base Schema)
const INITIAL_STATE = {
    // 1. Flow Control
    currentScreen: 'logged-out-screen', 
    isWalletConnected: false,

    // 2. Player Data
    currentPlayerKidId: null, 
    playerKidz: [], // Array to store the player's Kid NFTs

    // 3. Inventory (GDD Structure)
    playerInventory: {
        materials: {}, 
        equipment: [], 
        components: [], 
        shopItems: {}, 
    },

    // 4. Expedition Data (Filled when game-screen starts)
    expedition: {
        kidStats: null, 
        currentLocation: null,
        AP: 0, 
        MP: 0, 
        log: [],
    }
};

// The actual state instance that will be manipulated
let gameState = { ...INITIAL_STATE };

/**
 * Returns a (read-only) copy of the current game state.
 * @returns {object} The current state.
 */
export const getState = () => {
    // Returns a deep copy to prevent accidental modification outside of update functions
    return JSON.parse(JSON.stringify(gameState));
};

/**
 * Updates the game state with new properties.
 * This is the main function for mutating state.
 * @param {object} updates - Object containing the keys and new values for the state.
 */
export const updateState = (updates) => {
    // Merge the new updates into the current state
    gameState = { ...gameState, ...updates };
    
    // CRITICAL: Notify the UIManager (via main.js) about the state change
    if (window.onGameStateChange) {
        window.onGameStateChange(gameState);
    }
};

/**
 * Utility function to change only the screen.
 * @param {string} screenId - The ID of the new screen (e.g., 'hub-selection-screen').
 */
export const setCurrentScreen = (screenId) => {
    updateState({ currentScreen: screenId });
};

/**
 * Resets the state to initial values (useful for logout or game end).
 */
export const resetState = () => {
    gameState = { ...INITIAL_STATE };
    setCurrentScreen(INITIAL_STATE.currentScreen);
};

/**
 * Loads demo (MOCK) data to simulate a logged-in player.
 */
export const loadDemoData = () => {
    console.log('GameState: Loading DEMO data (MOCK_WALLET) and initializing dynamic keys.');
    
    // 1. Load Kid NFTs
    gameState.playerKidz = MOCK_KIDZ_NFTS;

    // 2. Pre-process and Load Inventory
    const processedInventory = {
        materials: MOCK_INVENTORY.materials,
        components: MOCK_INVENTORY.components,
        shopItems: MOCK_INVENTORY.shopItems,
        
        // CRITICAL: Process equipment to add the dynamic 'isEquipped: false' key
        equipment: MOCK_INVENTORY.equipment.map(item => ({
            ...item,
            isEquipped: false 
        }))
    };
    
    // Demo Simulation: Equip the first helmet found
    if (processedInventory.equipment.length > 0) {
        const helmetIndex = processedInventory.equipment.findIndex(item => item.item_id.includes('helmet'));
        if (helmetIndex !== -1) {
             processedInventory.equipment[helmetIndex].isEquipped = true;
        }
    }
    
    gameState.playerInventory = processedInventory;

    // 3. Simulate wallet connection
    gameState.isWalletConnected = true;

    // The notification to UIManager will be triggered by setCurrentScreen in main.js
};
