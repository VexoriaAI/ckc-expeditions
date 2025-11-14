/* ====================================================================
// CORE: main.js
// ATUALIZAÇÃO: Adiciona lógica para selecionar Kid e transicionar para a tela de preparação.
// ==================================================================== */

import { getState, setCurrentScreen, updateState } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 
// Importaremos MOCK_WALLET no próximo passo para ter um ID de Kid real

function initializeApp() {
    console.log('--- Fase 2: Inicializando CyberKidz - Wasteland Expeditions ---');
    console.log('Arquitetura Modular ES6 Ativa.');

    UIManager.init(); 

    window.onGameStateChange = (newState) => {
        console.log(`Estado do Jogo Alterado. Nova Tela: ${newState.currentScreen} | Kid ID: ${newState.currentPlayerKidId}`);
        UIManager.renderScreen(newState);
    };

    const initialState = getState();
    setCurrentScreen(initialState.currentScreen);
    
    document.getElementById('app-root').addEventListener('click', handleGlobalClick);

    console.log('Total de Materiais Carregados:', Object.keys(MATERIALS_DB).length);
}

function handleGlobalClick(event) {
    const target = event.target;
    const currentState = getState();
    
    // --- 1. Lógica da logged-out-screen (Login) ---
    if (currentState.currentScreen === 'logged-out-screen') {
        if (target.id === 'btn-connect-wallet' || target.id === 'btn-play-demo') {
            // Por enquanto, apenas avança para a seleção
            setCurrentScreen('hub-selection-screen'); 
        }
    } 
    
    // --- 2. Lógica da hub-selection-screen (Seleção de Kid) ---
    else if (currentState.currentScreen === 'hub-selection-screen') {
        if (target.id === 'btn-select-kid') {
            const selectedKidId = target.dataset.kidId; 
            
            if (selectedKidId) {
                console.log(`Kid Selecionado: ${selectedKidId}. Mudando para preparação.`);
                
                // 1. Atualiza o GameState com o Kid ID selecionado
                updateState({ 
                    currentPlayerKidId: selectedKidId 
                });
                
                // 2. Transiciona para a tela de preparação
                setCurrentScreen('hub-preparation-screen'); 
            }
        }
    }
    
    // NOTA: Os cliques da hub-preparation-screen (Workshop, Equipar, Start) serão adicionados aqui.
}

document.addEventListener('DOMContentLoaded', initializeApp);
