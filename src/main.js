/* ====================================================================
// CORE: main.js
// UPDATE: Adiciona a lógica do "Ranking Ticker" (setInterval)
// e o listener de clique para a nova tela de Ranking.
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData, resetState, INITIAL_STATE, openModal, closeModal } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { ModalManager } from './ui/ModalManager.js'; 
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js'; 
import { Web3Manager } from './web3/Web3Manager.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 
// (NOVO) Importa os dados do ranking
import { RANKING_FORGEMASTERS, RANKING_EXPLORERS, RANKING_SENTINELS } from '../database/rankings.js';

/**
 * Inicializa a aplicação, os gerentes de UI e os listeners.
 */
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
    
    // Anexa os listeners globais
    const appRoot = document.getElementById('app-root');
    appRoot.addEventListener('click', handleGlobalClick);
    appRoot.addEventListener('input', handleGlobalInput);
    appRoot.addEventListener('change', handleGlobalChange);
    
    document.getElementById('modal-root').addEventListener('click', handleModalClick);
    
    console.log('Total Materials Loaded:', Object.keys(MATERIALS_DB).length);

    // (NOVO) Inicia o Ranking Ticker
    startRankingTicker();
}

/**
 * (NOVO) Lógica para o letreiro animado do ranking no header.
 */
function startRankingTicker() {
    // Dados estáticos do Top 1 de cada categoria
    const tickerItems = [
        `Wasteland Forgemasters | Top #1 ${RANKING_FORGEMASTERS[0].playerName}`,
        `Legendary Explorers | Top #1 ${RANKING_EXPLORERS[0].playerName}`,
        `AI Sentinels | Top #1 ${RANKING_SENTINELS[0].playerName}`
    ];
    let currentItemIndex = 0;

    setInterval(() => {
        const tickerElement = document.getElementById('ranking-ticker');
        if (!tickerElement) return; // Pára se o header não estiver renderizado

        // Aplica fade-out
        tickerElement.classList.remove('fade-in');
        
        // Espera a animação de fade-out terminar para trocar o texto
        setTimeout(() => {
            // Atualiza o índice e o texto
            currentItemIndex = (currentItemIndex + 1) % tickerItems.length;
            tickerElement.innerHTML = `<span>${tickerItems[currentItemIndex]}</span>`;
            
            // Aplica fade-in
            tickerElement.classList.add('fade-in');
        }, 500); // 0.5s (deve corresponder ao tempo da transição no CSS)

    }, 5000); // Troca a cada 5 segundos
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

    // Lógica de Seleção de Item (Para Equipar ou Embutir)
    const selectButton = target.id === 'btn-modal-select-item' ? target : target.closest('.modal-item-card');
    
    if (selectButton) {
        const selectedInstanceId = parseInt(selectButton.dataset.instanceId, 10);
        
        if (currentState.modalContent === 'MODAL_SELECT_EQUIPMENT') {
            // Chama o sistema para equipar o item
            EquipmentSystem.equipItem(selectedInstanceId);
            closeModal(); // Fecha o modal
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
 * Lida com cliques APENAS dentro do #app-root
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
    // (NOVO) Botão de Ranking (abre a nova TELA de ranking)
    if (target.id === 'btn-ranking') {
        updateState({ previousScreen: currentState.currentScreen }); 
        setCurrentScreen('ranking-screen'); // Abre a nova tela
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
        
        // B. Equipment & Mannequin Actions
        else if (target.id === 'btn-auto-equip') {
            EquipmentSystem.autoEquip();
        } 
        else if (target.id === 'btn-remove-all') {
            EquipmentSystem.unequipAll();
        }
        else if (target.id === 'btn-open-equip-modal') {
            // Abre o modal de equipamento, filtrando pelo slot clicado
            const slotType = target.dataset.slotType;
            openModal('MODAL_SELECT_EQUIPMENT');
            updateState({ modalTargetSlot: slotType }); // Informa ao modal qual slot estamos preenchendo
        }
        else if (target.id === 'btn-unequip-item') {
            // Remove o item (clique no "X")
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
                alert(result.message); // Feedback temporário
            }
        }
        else if (target.id === 'btn-execute-craft') {
            const recipeId = target.dataset.recipeId;
            if (recipeId && !target.disabled) {
                const result = CraftingSystem.processCraftAction(recipeId); 
                alert(result.message); // Feedback temporário
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
        else if (target.id === 'btn-execute-embed' && !target.disabled) {
            const { embedTargetEquipmentId, embedTargetComponentId } = currentState;
            const result = CraftingSystem.embedComponent(embedTargetEquipmentId, embedTargetComponentId);
            alert(result.message); 
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
    
    // --- 7. (NOVO) ranking-screen Logic ---
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
        // Lida com 'select multiple'
        const selectedOptions = Array.from(target.selectedOptions).map(option => option.value);
        updateState({ 
            hubSelectionFilters: { selectedTribes: selectedOptions, currentPage: 1 } 
        });
    }
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', initializeApp);
