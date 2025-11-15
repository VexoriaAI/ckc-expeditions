/* ====================================================================
// CORE: main.js
// VERSÃO COMPLETA (V2.7)
// Gerencia todos os listeners de clique (App e Modal),
// lógica de filtros (Input/Change) e navegação.
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData, resetState, INITIAL_STATE, openModal, closeModal } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { ModalManager } from './ui/ModalManager.js'; 
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 

/**
 * Inicializa a aplicação, os gerentes de UI e os listeners.
 */
function initializeApp() {
    console.log('--- Phase 2: Initializing CyberKidz - Wasteland Expeditions ---');
    console.log('ES6 Modular Architecture Active.');

    UIManager.init();
    ModalManager.init(); 

    // O 'window.onGameStateChange' notifica AMBOS os gerentes (UI e Modal)
    window.onGameStateChange = (newState) => {
        UIManager.renderScreen(newState);
        ModalManager.renderModal(newState); 
    };

    // Define a tela inicial
    const initialState = getState();
    setCurrentScreen(initialState.currentScreen);
    
    // Anexa os listeners globais
    const appRoot = document.getElementById('app-root');
    appRoot.addEventListener('click', handleGlobalClick);
    appRoot.addEventListener('input', handleGlobalInput);
    appRoot.addEventListener('change', handleGlobalChange);
    
    document.getElementById('modal-root').addEventListener('click', handleModalClick);
    
    console.log('Total Materials Loaded:', Object.keys(MATERIALS_DB).length);
}

/**
 * Lida APENAS com cliques dentro do #modal-root (Overlay, Fechar, Seleção de Item)
 */
function handleModalClick(event) {
    const target = event.target;
    const currentState = getState();

    // Lógica de Fechar (Botão 'X' ou clique no Overlay)
    if (target.closest('#btn-modal-close') || target.id === 'modal-overlay') {
        closeModal();
        return;
    }

    // Lógica de Seleção de Item (Para Embed)
    if (target.id === 'btn-modal-select-item') {
        const selectedInstanceId = parseInt(target.dataset.instanceId, 10);
        
        if (currentState.modalContent === 'MODAL_SELECT_EQUIPMENT') {
            // Atualiza o GameState com o equipamento selecionado
            updateState({ 
                embedTargetEquipmentId: selectedInstanceId,
                isModalOpen: false, // Fecha o modal
                modalContent: null 
            });
        } 
        else if (currentState.modalContent === 'MODAL_SELECT_COMPONENT') {
            // Atualiza o GameState com o componente selecionado
            updateState({ 
                embedTargetComponentId: selectedInstanceId,
                isModalOpen: false, // Fecha o modal
                modalContent: null 
            });
        }
    }
}


/**
 * Lida com cliques APENAS dentro do #app-root (A aplicação principal)
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
    
    // --- 2. logged-out-screen Logic ---
    if (currentState.currentScreen === 'logged-out-screen') {
        if (target.id === 'btn-connect-wallet' || target.id === 'btn-play-demo') {
            loadDemoData(); 
            setCurrentScreen('hub-selection-screen'); 
        }
    } 
    
    // --- 3. hub-selection-screen Logic ---
    else if (currentState.currentScreen === 'hub-selection-screen') {
        
        // Selecionar Kid
        if (target.id === 'btn-select-kid') {
            const selectedKidId = target.closest('.kid-card').dataset.kidId; 
            if (selectedKidId) {
                updateState({ currentPlayerKidId: selectedKidId });
                setCurrentScreen('hub-preparation-screen'); 
            }
        }
        // Paginação
        else if (target.id === 'btn-page-next') {
            const filters = currentState.hubSelectionFilters;
            updateState({ hubSelectionFilters: { currentPage: filters.currentPage + 1 } });
        }
        else if (target.id === 'btn-page-prev') {
            const filters = currentState.hubSelectionFilters;
            updateState({ hubSelectionFilters: { currentPage: filters.currentPage - 1 } });
        }
        // Resetar Filtro
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
        else if (target.id === 'btn-remove-all') {
            EquipmentSystem.unequipAll();
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
                alert(result.message); // Feedback temporário
            }
        }
        else if (target.id === 'btn-execute-craft') {
            const recipeId = target.dataset.recipeId;
            if (recipeId && !target.disabled) {
                const result = CraftingSystem.processCraftAction(recipeId); // Raridade Padrão
                alert(result.message); // Feedback temporário
            }
        }
        
        // F. Workshop: Ações do EMBED
        else if (target.id === 'btn-select-embed-equip') {
            openModal('MODAL_SELECT_EQUIPMENT');
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
            // A lógica de `embedComponent` agora encontra o slot automaticamente
            const result = CraftingSystem.embedComponent(embedTargetEquipmentId, embedTargetComponentId);
            alert(result.message); // Feedback temporário
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
 * Lida com eventos de CHANGE (Ex: dropdowns de <select>)
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
        // Lida com 'select multiple'
        const selectedOptions = Array.from(target.selectedOptions).map(option => option.value);
        updateState({ 
            hubSelectionFilters: { selectedTribes: selectedOptions, currentPage: 1 } 
        });
    }
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', initializeApp);
