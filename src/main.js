/* ====================================================================
// CORE: main.js
// ATUALIZAÇÃO: Integração com loadDemoData() do GameState.
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 
// Importaremos MOCK_KIDZ_NFTS em UIManager.js para renderização

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
            
            // CRÍTICO: Carrega os dados Mock no GameState
            loadDemoData(); 
            
            // Transiciona para a seleção de Kid
            setCurrentScreen('hub-selection-screen'); 
        }
    } 
    
    // --- 2. Lógica da hub-selection-screen (Seleção de Kid) ---
    else if (currentState.currentScreen === 'hub-selection-screen') {
        if (target.id === 'btn-select-kid') {
            // Usa .closest para garantir que estamos pegando o data-kid-id do card correto
            const selectedKidId = target.closest('.kid-card').dataset.kidId; 
            
            if (selectedKidId) {
                console.log(`Kid Selecionado: ${selectedKidId}. Mudando para preparação.`);
                
                updateState({ 
                    currentPlayerKidId: selectedKidId 
                });
                
                setCurrentScreen('hub-preparation-screen'); 
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
