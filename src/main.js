/* ====================================================================
// CORE: main.js
// UPDATE: Ativa o botão 'btn-execute-embed' para chamar
// o CraftingSystem.embedComponent.
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData, resetState, INITIAL_STATE, openModal, closeModal } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { ModalManager } from './ui/ModalManager.js'; 
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 
import { Web3Manager } from './web3/Web3Manager.js'; 

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

    // Lógica de Seleção de Item (Para Equipar ou Embutir)
    const selectButton = target.id === 'btn-modal-select-item' ? target : target.closest('.modal-item-card');
    
    if (selectButton) {
        const selectedInstanceId = parseInt(selectButton.dataset.instanceId, 10);
        
        if (currentState.modalContent === 'MODAL_SELECT_EQUIPMENT') {
            // Se o modal foi aberto pelo Mannequin, equipa o item
            if (currentState.modalTargetSlot) {
                EquipmentSystem.equipItem(selectedInstanceId);
                closeModal(); // Fecha o modal
            } else {
                // Se foi aberto pelo Embed, apenas define o ID
                updateState({ 
                    embedTargetEquipmentId: selectedInstanceId,
                    isModalOpen: false, 
                    modalContent: null 
                });
            }
        } 
        else if (currentState.modalContent === 'MODAL_SELECT_COMPONENT') {
            // Atualiza o GameState com o componente selecionado (para o Embed)
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
    if (target.id === 'btn-logout') {
        resetState(); 
        return; 
    }
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
            const filters = currentState.hubSelectionFilters;
            updateState({ hubSelectionFilters: { currentPage: filters.currentPage + 1 } });
        }
        else if (target.id === 'btn-page-prev') {
            const filters = currentState.hubSelectionFilters;
            updateState({ hubSelectionFilters: { currentPage: filters.currentPage - 1 } });
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
            updateState({ modalTargetSlot: null }); // NENHUM filtro de slot para o Embed
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
        // (ATUALIZADO) Executa o Embed
        else if (target.id === 'btn-execute-embed' && !target.disabled) {
            const { embedTargetEquipmentId, embedTargetComponentId } = currentState;
            const result = CraftingSystem.embedComponent(embedTargetEquipmentId, embedTargetComponentId);
            alert(result.message); // Feedback temporário
            
            // Limpa o estado da UI do Embed após a ação
            updateState({
                embedTargetEquipmentId: null,
                embedTargetComponentId: null
            });
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
}

/**
 * Lida com eventos de CHANGE (Ex: select dropdowns)
 */
function handleGlobalChange(event) {
    const target = event.target;

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

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', initializeApp);
