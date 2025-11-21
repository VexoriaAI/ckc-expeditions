/* ====================================================================
// CORE: main.js
// UPDATE: (Fase 3.2 - Fix Filtros Final)
// - Corrige a lógica de atualização de estado dos filtros.
// - Garante cópia segura de objetos (Spread Operator).
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData, resetState, INITIAL_STATE, openModal, closeModal } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { ModalManager } from './ui/ModalManager.js'; 
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js'; 
import { Web3Manager } from './web3/Web3Manager.js'; 
import { ExpeditionManager } from './systems/ExpeditionManager.js';
import { MATERIALS_DB } from '../database/materials.js'; 
import { RANKING_FORGEMASTERS, RANKING_EXPLORERS, RANKING_SENTINELS } from '../database/rankings.js';

function initializeApp() {
    console.log('--- Phase 4.0: Initializing CyberKidz - Wasteland Expeditions ---');
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

function handleModalClick(event) {
    const target = event.target;
    const currentState = getState();

    if (target.closest('#btn-modal-close') || target.id === 'modal-overlay') {
        closeModal();
        return;
    }

    // (NOVO) Confirmação de Viagem
    if (target.id === 'btn-confirm-travel') {
        const targetBiomeId = target.dataset.targetBiome;
        ExpeditionManager.travelToBiome(targetBiomeId);
        closeModal();
    }
    
    // (CORREÇÃO) Ações do Modal de Confirmação de Embed
    if (target.id === 'btn-confirm-embed') {
        const { embedTargetEquipmentId, embedTargetComponentId } = currentState;
        const result = CraftingSystem.embedComponent(embedTargetEquipmentId, embedTargetComponentId);
        
        alert(result.message); 
        
        // (ORDEM IMPORTANTE)
        // 1. Fecha o modal (limpa o estado de modal)
        closeModal(); 

        // 2. Limpa a seleção do Embed (para resetar a UI do workshop)
        // Nota: closeModal já limpa algumas coisas, mas garantimos aqui
        updateState({ 
            isModalOpen: false, // Força fechamento
            embedTargetEquipmentId: null, 
            embedTargetComponentId: null 
        });
    }
    else if (target.id === 'btn-cancel-embed') {
        closeModal();
    }

    const selectButton = target.id === 'btn-modal-select-item' ? target : target.closest('.modal-item-card');
    if (selectButton) {
        const selectedInstanceId = parseInt(selectButton.dataset.instanceId, 10);
        if (currentState.modalContent === 'MODAL_SELECT_EQUIPMENT') {
            if (currentState.modalTargetSlot) {
                EquipmentSystem.equipItem(selectedInstanceId);
                closeModal(); 
            } else {
                updateState({ embedTargetEquipmentId: selectedInstanceId, isModalOpen: false, modalContent: null });
            }
        } 
        else if (currentState.modalContent === 'MODAL_SELECT_COMPONENT') {
            updateState({ embedTargetComponentId: selectedInstanceId, isModalOpen: false, modalContent: null });
        }
    }
}

function handleGlobalClick(event) {
    const target = event.target;
    const currentState = getState();
    
    if (target.id === 'btn-logout') { window.location.reload(); return; }
    if (target.id === 'btn-store') { updateState({ previousScreen: currentState.currentScreen }); setCurrentScreen('store-screen'); return; }
    if (target.id === 'btn-ranking') { updateState({ previousScreen: currentState.currentScreen }); setCurrentScreen('ranking-screen'); return; }
    
    if (currentState.currentScreen === 'logged-out-screen') {
        if (target.id === 'btn-connect-wallet' || target.id === 'btn-play-demo') { loadDemoData(); setCurrentScreen('hub-selection-screen'); }
    } 
    else if (currentState.currentScreen === 'hub-selection-screen') {
        if (target.id === 'btn-select-kid') {
            const selectedKidId = target.closest('.kid-card').dataset.kidId; 
            if (selectedKidId) { updateState({ currentPlayerKidId: selectedKidId }); setCurrentScreen('hub-preparation-screen'); }
        }
        else if (target.id === 'btn-page-next') { 
            const currentFilters = currentState.hubSelectionFilters || INITIAL_STATE.hubSelectionFilters;
            updateState({ hubSelectionFilters: { ...currentFilters, currentPage: currentFilters.currentPage + 1 } }); 
        }
        else if (target.id === 'btn-page-prev') { 
            const currentFilters = currentState.hubSelectionFilters || INITIAL_STATE.hubSelectionFilters;
            updateState({ hubSelectionFilters: { ...currentFilters, currentPage: currentFilters.currentPage - 1 } }); 
        }
        else if (target.id === 'btn-filter-reset') { 
            // (CORREÇÃO) Reset seguro usando spread
            updateState({ hubSelectionFilters: { ...INITIAL_STATE.hubSelectionFilters } }); 
        }
    }
    else if (currentState.currentScreen === 'hub-preparation-screen') {
        if (target.id === 'btn-back-to-selection') { setCurrentScreen('hub-selection-screen'); } 
        else if (target.id === 'btn-start-expedition') { ExpeditionManager.startExpedition(); }
        
        else if (target.id === 'btn-auto-equip') { EquipmentSystem.autoEquip(); } 
        else if (target.id === 'btn-remove-all') { EquipmentSystem.unequipAll(); }
        
        else if (target.id === 'btn-open-equip-modal') {
            const slotType = target.dataset.slotType;
            openModal('MODAL_SELECT_EQUIPMENT');
            updateState({ modalTargetSlot: slotType }); 
        }
        else if (target.id === 'btn-unequip-item') {
            const instanceId = parseInt(target.dataset.instanceId, 10);
            EquipmentSystem.unequipItem(instanceId);
        }
        
        else if (target.closest('#workshop-tabs .tab-btn')) {
             const tabId = target.dataset.tab;
             if (tabId !== currentState.uiState.activeWorkshopTab) { updateState({ uiState: { activeWorkshopTab: tabId } }); }
        }
        else if (target.closest('#inventory-tabs .tab-btn')) {
             const tabId = target.dataset.tab;
             if (tabId !== currentState.uiState.activeInventoryTab) { updateState({ uiState: { activeInventoryTab: tabId } }); }
        }

        else if (target.id === 'btn-execute-refine') { 
            const recipeId = target.dataset.recipeId;
            const result = CraftingSystem.processRefineAction(recipeId);
            alert(result.message);
        }
        else if (target.id === 'btn-execute-craft') {
             const recipeId = target.dataset.recipeId;
             const result = CraftingSystem.processCraftAction(recipeId);
             alert(result.message);
        }
        
        else if (target.id === 'btn-select-embed-equip') {
            openModal('MODAL_SELECT_EQUIPMENT');
            updateState({ modalTargetSlot: null }); 
        }
        else if (target.id === 'btn-select-embed-comp' && !target.classList.contains('disabled')) {
            openModal('MODAL_SELECT_COMPONENT');
        }
        else if (target.id === 'btn-remove-embed-equip') { updateState({ embedTargetEquipmentId: null, embedTargetComponentId: null }); }
        else if (target.id === 'btn-remove-embed-comp') { updateState({ embedTargetComponentId: null }); }
        else if (target.id === 'btn-execute-embed' && !target.disabled) {
            openModal('MODAL_CONFIRM_EMBED');
        }

        else if (target.id === 'btn-inv-equip') {
            const instanceId = parseInt(target.dataset.instanceId, 10);
            EquipmentSystem.equipItem(instanceId);
        }
        else if (target.id === 'btn-inv-unequip') {
            const instanceId = parseInt(target.dataset.instanceId, 10);
            EquipmentSystem.unequipItem(instanceId);
        }
        else if (target.id === 'btn-inv-filter') {
            const filterType = target.dataset.filterType;
            updateState({ uiState: { inventoryEquipmentFilter: filterType } });
        }
        else if (target.id === 'btn-inv-use-item') {
            const modalAction = target.dataset.modalAction;
            if (modalAction) openModal(modalAction);
        }
    }
    else if (currentState.currentScreen === 'game-screen') {
        if (target.id === 'btn-end-expedition') { ExpeditionManager.endExpedition(); }
        else if (target.id === 'btn-action-collect') { ExpeditionManager.collectResources(); }
        else if (target.id === 'btn-action-investigate') { ExpeditionManager.investigate(); }
        else if (target.id === 'btn-action-search') { ExpeditionManager.searchForEnemy(); }
        else if (target.id === 'btn-action-end-day') { ExpeditionManager.endDay(); }
        else if (target.id === 'btn-move-node') {
            const targetNodeId = target.dataset.nodeId;
            ExpeditionManager.moveToNode(targetNodeId);
        }
        // (NOVO) Abrir Mapa Mundi
        else if (target.id === 'btn-open-world-map') {
            openModal('MODAL_WORLD_MAP');
        }
        else if (target.id === 'btn-toggle-stats' || target.closest('#btn-toggle-stats')) {
            const currentOpen = currentState.uiState.isStatsAccordionOpen || false;
            updateState({ uiState: { isStatsAccordionOpen: !currentOpen } });
        }
    }
    else if (currentState.currentScreen === 'store-screen') {
        if (target.id === 'btn-back-to-hub') { setCurrentScreen(currentState.previousScreen || 'hub-selection-screen'); }
        else if (target.id === 'btn-buy-item') { /* ... */ }
    }
    else if (currentState.currentScreen === 'ranking-screen') {
        if (target.id === 'btn-back-to-hub') { setCurrentScreen(currentState.previousScreen || 'hub-selection-screen'); }
    }
}

/**
 * (CORRIGIDO) Lida com eventos de INPUT (Ex: barra de busca)
 */
function handleGlobalInput(event) {
    const target = event.target;
    const currentState = getState();

    if (target.id === 'filter-search-name') {
        // Garante que hubSelectionFilters exista no estado antes de acessar
        const currentFilters = currentState.hubSelectionFilters || INITIAL_STATE.hubSelectionFilters;
        updateState({ 
            hubSelectionFilters: { 
                ...currentFilters,
                searchQuery: target.value, 
                currentPage: 1 
            } 
        });
    }
}

/**
 * (CORRIGIDO) Lida com eventos de CHANGE (Ex: select dropdowns)
 */
function handleGlobalChange(event) {
    const target = event.target;
    const currentState = getState();

    // Helper para pegar filtros atuais com segurança
    const currentFilters = currentState.hubSelectionFilters || INITIAL_STATE.hubSelectionFilters;

    // Filtros do Hub Selection
    if (target.id === 'filter-sort-by') {
        updateState({ 
            hubSelectionFilters: { ...currentFilters, sortBy: target.value, currentPage: 1 } 
        });
    } 
    else if (target.id === 'filter-items-per-page') {
        updateState({ 
            hubSelectionFilters: { ...currentFilters, itemsPerPage: parseInt(target.value, 10), currentPage: 1 } 
        });
    }
    else if (target.id === 'filter-tribe') {
        const selectedValue = target.value;
        // Garante que passamos um array para o state (ou 'all' dentro de um array para manter consistência)
        const tribesArray = selectedValue === 'all' ? ['all'] : [selectedValue];
        
        updateState({ 
            hubSelectionFilters: { ...currentFilters, selectedTribes: tribesArray, currentPage: 1 } 
        });
    }
    
    // Filtros do Inventário
    else if (target.id === 'inventory-sort-by') {
        updateState({ uiState: { inventoryEquipmentSort: target.value } });
    }
    
    // Filtros do Workshop > Craft
    else if (target.id === 'craft-filter-type') {
        updateState({ uiState: { craftFilterType: target.value } });
    }
    else if (target.id === 'craft-filter-tribe') {
        updateState({ uiState: { craftFilterTribe: target.value } });
    }

    // Checkbox da Tela de Expedição
    else if (target.id === 'chk-skip-animations') {
        updateState({ uiState: { skipAnimations: target.checked } });
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
