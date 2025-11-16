/* ====================================================================
// CORE: main.js
// UPDATE: Atualiza os listeners de clique das Abas para usar o 
// 'uiState' (ex: uiState.activeWorkshopTab).
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData, resetState, INITIAL_STATE, openModal, closeModal } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { ModalManager } from './ui/ModalManager.js'; 
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 
import { Web3Manager } from './web3/Web3Manager.js'; 
import { RANKING_FORGEMASTERS, RANKING_EXPLORERS, RANKING_SENTINELS } from '../database/rankings.js';

function initializeApp() {
    console.log('--- Phase 2: Initializing CyberKidz - Wasteland Expeditions ---');
    console.log('ES6 Modular Architecture Active.');

    UIManager.init();
    ModalManager.init(); 

    window.onGameStateChange = (newState) => {
        UIManager.renderScreen(newState);
        ModalManager.renderModal(newState); 
    };

    const initialState = getState();
    setCurrentScreen(initialState.currentScreen);
    
    const appRoot = document.getElementById('app-root');
    appRoot.addEventListener('click', handleGlobalClick);
    appRoot.addEventListener('input', handleGlobalInput);
    appRoot.addEventListener('change', handleGlobalChange);
    
    document.getElementById('modal-root').addEventListener('click', handleModalClick);
    
    console.log('Total Materials Loaded:', Object.keys(MATERIALS_DB).length);
    startRankingTicker();
}

function startRankingTicker() {
    const tickerItems = [
        `Wasteland Forgemasters | Top #1 ${RANKING_FORGEMASTERS[0].playerName}`,
        `Legendary Explorers | Top #1 ${RANKING_EXPLORERS[0].playerName}`,
        `AI Sentinels | Top #1 ${RANKING_SENTINELS[0].playerName}`
    ];
    let currentItemIndex = 0;
    setInterval(() => {
        const tickerElement = document.getElementById('ranking-ticker');
        if (!tickerElement) return; 
        tickerElement.classList.remove('fade-in');
        setTimeout(() => {
            currentItemIndex = (currentItemIndex + 1) % tickerItems.length;
            tickerElement.innerHTML = `<span>${tickerItems[currentItemIndex]}</span>`;
            tickerElement.classList.add('fade-in');
        }, 500); 
    }, 5000); 
}

/**
 * Lida com cliques dentro do #modal-root
 */
function handleModalClick(event) {
    const target = event.target;
    const currentState = getState();

    if (target.closest('#btn-modal-close') || target.id === 'modal-overlay') {
        closeModal();
        return;
    }

    const selectButton = target.id === 'btn-modal-select-item' ? target : target.closest('.modal-item-card');
    
    if (selectButton) {
        const selectedInstanceId = parseInt(selectButton.dataset.instanceId, 10);
        
        if (currentState.modalContent === 'MODAL_SELECT_EQUIPMENT') {
            if (currentState.modalTargetSlot) {
                EquipmentSystem.equipItem(selectedInstanceId);
                closeModal(); 
            } else {
                updateState({ 
                    embedTargetEquipmentId: selectedInstanceId,
                    isModalOpen: false, 
                    modalContent: null 
                });
            }
        } 
        else if (currentState.modalContent === 'MODAL_SELECT_COMPONENT') {
            updateState({ 
                embedTargetComponentId: selectedInstanceId,
                isModalOpen: false, 
                modalContent: null 
            });
        }
    }
}


/**
 * Lida com cliques dentro do #app-root
 */
function handleGlobalClick(event) {
    const target = event.target;
    const currentState = getState();
    
    // --- 1. Global Header Logic ---
    if (target.id === 'btn-logout') { resetState(); return; }
    if (target.id === 'btn-store') {
        updateState({ previousScreen: currentState.currentScreen }); 
        setCurrentScreen('store-screen');
        return;
    }
    if (target.id === 'btn-ranking') {
        updateState({ previousScreen: currentState.currentScreen }); 
        setCurrentScreen('ranking-screen');
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
        
        if (target.id === 'btn-select-kid') {
            const selectedKidId = target.closest('.kid-card').dataset.kidId; 
            if (selectedKidId) {
                updateState({ currentPlayerKidId: selectedKidId });
                setCurrentScreen('hub-preparation-screen'); 
            }
        }
        else if (target.id === 'btn-page-next') {
            updateState({ hubSelectionFilters: { currentPage: currentState.hubSelectionFilters.currentPage + 1 } });
        }
        else if (target.id === 'btn-page-prev') {
            updateState({ hubSelectionFilters: { currentPage: currentState.hubSelectionFilters.currentPage - 1 } });
        }
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
        
        // B. Equipment & Mannequin Actions
        else if (target.id === 'btn-auto-equip') {
            EquipmentSystem.autoEquip();
        } 
        else if (target.id === 'btn-remove-all') {
            EquipmentSystem.unequipAll();
        }
        else if (target.id === 'btn-open-equip-modal') {
            const slotType = target.dataset.slotType;
            openModal('MODAL_SELECT_EQUIPMENT');
            updateState({ modalTargetSlot: slotType }); 
        }
        else if (target.id === 'btn-unequip-item') {
            const instanceId = parseInt(target.dataset.instanceId, 10);
            EquipmentSystem.unequipItem(instanceId);
        }
        
        // C. (ATUALIZADO) Workshop: Tab Switching
        else if (target.closest('#workshop-tabs .tab-btn')) {
             const tabId = target.dataset.tab;
             if (tabId !== currentState.uiState.activeWorkshopTab) {
                 updateState({ uiState: { activeWorkshopTab: tabId } });
             }
        }
        // D. (ATUALIZADO) Inventory: Tab Switching
        else if (target.closest('#inventory-tabs .tab-btn')) {
             const tabId = target.dataset.tab;
             if (tabId !== currentState.uiState.activeInventoryTab) {
                 updateState({ uiState: { activeInventoryTab: tabId } });
             }
        }

        // E. Workshop: Actions (REFINE/CRAFT)
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
                const result = CraftingSystem.processCraftAction(recipeId); 
                alert(result.message); 
            }
        }
        
        // F. Workshop: Ações do EMBED
        else if (target.id === 'btn-select-embed-equip') {
            openModal('MODAL_SELECT_EQUIPMENT');
            updateState({ modalTargetSlot: null }); 
        }
        else if (target.id === 'btn-select-embed-comp' && !target.classList.contains('disabled')) {
            openModal('MODAL_SELECT_COMPONENT');
        }
        else if (target.id === 'btn-remove-embed-equip') {
            updateState({ embedTargetEquipmentId: null, embedTargetComponentId: null });
        }
        else if (target.id === 'btn-remove-embed-comp') {
            updateState({ embedTargetComponentId: null });
        }
        else if (target.id === 'btn-execute-embed' && !target.disabled) {
            const { embedTargetEquipmentId, embedTargetComponentId } = currentState;
            const result = CraftingSystem.embedComponent(embedTargetEquipmentId, embedTargetComponentId);
            alert(result.message); 
            updateState({ embedTargetEquipmentId: null, embedTargetComponentId: null });
        }
    }

    // --- 5. game-screen Logic ---
    else if (currentState.currentScreen === 'game-screen') {
        if (target.id === 'btn-end-expedition') {
            setCurrentScreen('hub-selection-screen'); 
        }
    }
    
    // --- 6. store-screen Logic ---
    else if (currentState.currentScreen === 'store-screen') {
        if (target.id === 'btn-back-to-hub') {
            setCurrentScreen(currentState.previousScreen || 'hub-selection-screen'); 
        }
        else if (target.id === 'btn-buy-item') {
            const itemId = target.dataset.itemId;
            const result = Web3Manager.buyItem(itemId, 1);
            alert(result.message); 
        }
    }
    
    // --- 7. ranking-screen Logic ---
    else if (currentState.currentScreen === 'ranking-screen') {
        if (target.id === 'btn-back-to-hub') {
            setCurrentScreen(currentState.previousScreen || 'hub-selection-screen'); 
        }
        // (Futuro: Lógica das abas do ranking)
    }
}

/**
 * Lida com eventos de INPUT (Ex: barra de busca)
 */
function handleGlobalInput(event) {
    const target = event.target;
    if (target.id === 'filter-search-name') {
        updateState({ 
            hubSelectionFilters: { searchQuery: target.value, currentPage: 1 } 
        });
    }
    // (NOVO) Filtros de Inventário
    // else if (target.id === 'inventory-search-name') {
    //     updateState({ uiState: { inventorySearch: target.value } });
    // }
}

/**
 * Lida com eventos de CHANGE (Ex: select dropdowns)
 */
function handleGlobalChange(event) {
    const target = event.target;

    // Filtros do Hub Selection
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
    
    // (NOVO) Filtros do Inventário
    // else if (target.id === 'inventory-sort-by') {
    //     updateState({ uiState: { inventoryEquipmentSort: target.value } });
    // }
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', initializeApp);
