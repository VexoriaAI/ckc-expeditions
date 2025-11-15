/* ====================================================================
// CORE: main.js
// UPDATE: Importa e inicializa o ModalManager.
// Adiciona listeners de clique para abrir/fechar modais.
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData, resetState, INITIAL_STATE, openModal, closeModal } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { ModalManager } from './ui/ModalManager.js'; // (NOVO) Importa o ModalManager
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 

function initializeApp() {
    console.log('--- Phase 2: Initializing CyberKidz - Wasteland Expeditions ---');
    console.log('ES6 Modular Architecture Active.');

    UIManager.init();
    ModalManager.init(); // (NOVO) Inicializa o ModalManager

    // Atualiza ambos os Gerentes (UI e Modal) quando o estado mudar
    window.onGameStateChange = (newState) => {
        UIManager.renderScreen(newState);
        ModalManager.renderModal(newState); // (NOVO) Renderiza o modal
    };

    const initialState = getState();
    setCurrentScreen(initialState.currentScreen);
    
    // Attach Global Listeners
    const appRoot = document.getElementById('app-root');
    appRoot.addEventListener('click', handleGlobalClick);
    appRoot.addEventListener('input', handleGlobalInput);
    appRoot.addEventListener('change', handleGlobalChange);
    
    // (NOVO) Adiciona listener de clique na raiz do Modal
    document.getElementById('modal-root').addEventListener('click', handleModalClick);
    
    console.log('Total Materials Loaded:', Object.keys(MATERIALS_DB).length);
}

/**
 * (NOVO) Lida APENAS com cliques dentro do #modal-root
 */
function handleModalClick(event) {
    const target = event.target;

    // Lógica de Fechar (Botão 'X' ou clique no Overlay)
    // Usamos .closest() para garantir que o clique no ícone dentro do botão feche
    if (target.closest('#btn-modal-close') || target.id === 'modal-overlay') {
        closeModal();
    }
    
    // (Futuro) Lógica de seleção de item dentro do modal
    // else if (target.closest('.modal-item-card')) {
    //     ...
    // }
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
                const result = CraftingSystem.processCraftAction(recipeId, 'COMMON'); 
                alert(result.message); 
            }
        }
        
        // F. (NOVO) Workshop: Ações do EMBED
        else if (target.id === 'btn-select-embed-equip') {
            // Abre o modal para selecionar Equipamento
            openModal('MODAL_SELECT_EQUIPMENT');
        }
        else if (target.id === 'btn-select-embed-comp' && !target.classList.contains('disabled')) {
            // Abre o modal para selecionar Componente (só abre se não estiver desabilitado)
            openModal('MODAL_SELECT_COMPONENT');
        }
        else if (target.id === 'btn-execute-embed') {
            // (Ainda desabilitado, mas pronto para a lógica de execução)
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
