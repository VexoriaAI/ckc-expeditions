/* ====================================================================
// CORE: main.js
// UPDATE: Adds listener for the 'CRAFT' action.
// Language: English
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 


/**
 * Function responsible for initializing the application.
 */
function initializeApp() {
    console.log('--- Phase 2: Initializing CyberKidz - Wasteland Expeditions ---');
    console.log('ES6 Modular Architecture Active.');

    UIManager.init(); 

    window.onGameStateChange = (newState) => {
        console.log(`State Changed. New Screen: ${newState.currentScreen} | Kid ID: ${newState.currentPlayerKidId}`);
        UIManager.renderScreen(newState);
    };

    const initialState = getState();
    setCurrentScreen(initialState.currentScreen);
    
    document.getElementById('app-root').addEventListener('click', handleGlobalClick);

    console.log('Total Materials Loaded:', Object.keys(MATERIALS_DB).length);
}

/**
 * Handles click events across the entire application using event delegation.
 * @param {Event} event - The click event object.
 */
function handleGlobalClick(event) {
    const target = event.target;
    const currentState = getState();
    
    // --- 1. logged-out-screen Logic ---
    if (currentState.currentScreen === 'logged-out-screen') {
        if (target.id === 'btn-connect-wallet' || target.id === 'btn-play-demo') {
            loadDemoData(); 
            setCurrentScreen('hub-selection-screen'); 
        }
    } 
    
    // --- 2. hub-selection-screen Logic ---
    else if (currentState.currentScreen === 'hub-selection-screen') {
        if (target.id === 'btn-select-kid') {
            const selectedKidId = target.closest('.kid-card').dataset.kidId; 
            
            if (selectedKidId) {
                updateState({ 
                    currentPlayerKidId: selectedKidId 
                });
                
                setCurrentScreen('hub-preparation-screen'); 
            }
        }
    }
    
    // --- 3. hub-preparation-screen Logic ---
    else if (currentState.currentScreen === 'hub-preparation-screen') {
        
        // A. Equipment Actions (Auto Equip / Start Expedition)
        if (target.id === 'btn-auto-equip') {
            EquipmentSystem.autoEquip();
        } else if (target.id === 'btn-start-expedition') {
            setCurrentScreen('game-screen');
        } 
        
        // B. Workshop Actions (REFINE)
        else if (target.id === 'btn-execute-refine') {
            const recipeId = target.dataset.recipeId;
            if (recipeId) {
                const result = CraftingSystem.processRefineAction(recipeId);
                
                if (result.success) {
                    alert(`SUCCESS: ${result.message}`);
                } else {
                    alert(`FAILURE: ${result.message}`);
                }
            }
        }

        // C. Workshop Actions (CRAFT) - NOVO LISTENER
        else if (target.id === 'btn-execute-craft') {
            const recipeId = target.dataset.recipeId;
            if (recipeId) {
                const result = CraftingSystem.processCraftAction(recipeId, 'RARE'); // Testando com raridade RARE
                
                if (result.success) {
                    alert(`SUCCESS: ${result.message} New Instance ID: ${result.newEquipment.instance_id}`);
                } else {
                    alert(`FAILURE: ${result.message}`);
                }
            }
        }
    }

    // --- 4. game-screen Logic ---
    else if (currentState.currentScreen === 'game-screen') {
        if (target.id === 'btn-end-expedition') {
            setCurrentScreen('hub-selection-screen'); 
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
