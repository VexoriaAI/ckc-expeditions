/* ====================================================================
// CORE: main.js
// UPDATE: Adiciona listeners para o botão "Store" e 
// navegação de volta da loja.
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData, resetState, INITIAL_STATE } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 

function initializeApp() {
    console.log('--- Phase 2: Initializing CyberKidz - Wasteland Expeditions ---');
    console.log('ES6 Modular Architecture Active.');

    UIManager.init(); 

    window.onGameStateChange = (newState) => {
        UIManager.renderScreen(newState);
    };

    const initialState = getState();
    setCurrentScreen(initialState.currentScreen);
    
    // Attach Global Listeners
    const appRoot = document.getElementById('app-root');
    appRoot.addEventListener('click', handleGlobalClick);
    appRoot.addEventListener('input', handleGlobalInput);
    appRoot.addEventListener('change', handleGlobalChange);
    
    console.log('Total Materials Loaded:', Object.keys(MATERIALS_DB).length);
}

/**
 * Handles all CLICK events.
 */
function handleGlobalClick(event) {
    const target = event.target;
    const currentState = getState();
    
    // --- 1. Global Header Logic ---
    if (target.id === 'btn-logout') {
        resetState(); 
        return; 
    }
    // (NOVO) Botão da Loja
    if (target.id === 'btn-store') {
        // Armazena a tela atual para podermos voltar
        updateState({ previousScreen: currentState.currentScreen }); 
        setCurrentScreen('store-screen');
        return;
    }
    
    // --- 2. logged-out-screen Logic ---
    if (currentState.currentScreen === 'logged-out-screen') {
        if (target.id === 'btn-connect-wallet' || target.id === 'btn-play-demo') {
            loadDemoData(); 
            setCurrentScreen('hub-selection-screen'); 
        }
    } 
    
    // --- 3. hub-selection-screen Logic ---
    else if (currentState.currentScreen === 'hub-selection-screen') {
        // Select Kid
        if (target.id === 'btn-select-kid') {
            const selectedKidId = target.closest('.kid-card').dataset.kidId; 
            if (selectedKidId) {
                updateState({ currentPlayerKidId: selectedKidId });
                setCurrentScreen('hub-preparation-screen'); 
            }
        }
        // Pagination
        else if (target.id === 'btn-page-next') {
            const filters = currentState.hubSelectionFilters;
            updateState({ hubSelectionFilters: { currentPage: filters.currentPage + 1 } });
        }
        else if (target.id === 'btn-page-prev') {
            const filters = currentState.hubSelectionFilters;
            updateState({ hubSelectionFilters: { currentPage: filters.currentPage - 1 } });
        }
        // Filter Reset
        else if (target.id === 'btn-filter-reset') {
            updateState({ hubSelectionFilters: INITIAL_STATE.hubSelectionFilters });
        }
    }
    
    // --- 4. hub-preparation-screen Logic ---
    else if (currentState.currentScreen === 'hub-preparation-screen') {
        
        // A. Page Actions
        if (target.id === 'btn-back-to-selection') {
            setCurrentScreen('hub-selection-screen');
        } else if (target.id === 'btn-start-expedition') {
            setCurrentScreen('game-screen');
        }
        
        // B. Equipment Actions
        else if (target.id === 'btn-auto-equip') {
            EquipmentSystem.autoEquip();
        } 
        
        // C. Workshop: Tab Switching
        else if (target.closest('#workshop-tabs .tab-btn')) {
             const tabId = target.dataset.tab;
             if (tabId !== currentState.activeWorkshopTab) {
                 updateState({ activeWorkshopTab: tabId });
             }
        }
        // D. Inventory: Tab Switching
        else if (target.closest('#inventory-tabs .tab-btn')) {
             const tabId = target.dataset.tab;
             if (tabId !== currentState.activeInventoryTab) {
                 updateState({ activeInventoryTab: tabId });
             }
        }

        // E. Workshop: Actions
        else if (target.id === 'btn-execute-refine') {
            const recipeId = target.dataset.recipeId;
            if (recipeId && !target.disabled) {
                const result = CraftingSystem.processRefineAction(recipeId);
                alert(result.message); 
            }
        }
        else if (target.id === 'btn-execute-craft') {
            const recipeId = target.dataset.recipeId;
            if (recipeId && !target.disabled) {
                const result = CraftingSystem.processCraftAction(recipeId, 'COMMON'); 
                alert(result.message); 
            }
        }
    }

    // --- 5. game-screen Logic ---
    else if (currentState.currentScreen === 'game-screen') {
        if (target.id === 'btn-end-expedition') {
            setCurrentScreen('hub-selection-screen'); 
        }
    }
    
    // --- 6. (NOVO) store-screen Logic ---
    else if (currentState.currentScreen === 'store-screen') {
        if (target.id === 'btn-back-to-hub') {
            // Volta para a tela anterior (Hub Selection ou Hub Prep)
            setCurrentScreen(currentState.previousScreen || 'hub-selection-screen'); 
        }
    }
}

/**
 * Handles INPUT events (e.g., typing in search bar)
 */
function handleGlobalInput(event) {
    const target = event.target;
    if (target.id === 'filter-search-name') {
        updateState({ 
            hubSelectionFilters: { searchQuery: target.value, currentPage: 1 } 
        });
    }
}

/**
 * Handles CHANGE events (e.g., select dropdowns)
 */
function handleGlobalChange(event) {
    const target = event.target;
    const currentState = getState(); 

    if (target.id === 'filter-sort-by') {
        updateState({ 
            hubSelectionFilters: { sortBy: target.value, currentPage: 1 } 
        });
    } 
    else if (target.id === 'filter-items-per-page') {
        updateState({ 
            hubSelectionFilters: { itemsPerPage: parseInt(target.value, 10), currentPage: 1 } 
        });
    }
    else if (target.id === 'filter-tribe') {
        const selectedOptions = Array.from(target.selectedOptions).map(option => option.value);
        updateState({ 
            hubSelectionFilters: { selectedTribes: selectedOptions, currentPage: 1 } 
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
