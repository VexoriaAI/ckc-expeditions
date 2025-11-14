/* ====================================================================
// CORE: main.js
// The Brain - Entry point of the application.
// Responsible for: Initializing modules, coordinating screen flow, and attaching listeners.
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

    // 1. Initialize UIManager (The Arms/Eyes)
    UIManager.init(); 

    // 2. Attach the state change notification mechanism (State -> UI)
    window.onGameStateChange = (newState) => {
        console.log(`State Changed. New Screen: ${newState.currentScreen} | Kid ID: ${newState.currentPlayerKidId}`);
        UIManager.renderScreen(newState);
    };

    // 3. Set the initial screen (triggers the first render cycle)
    const initialState = getState();
    setCurrentScreen(initialState.currentScreen);
    
    // 4. Attach Global Event Listener (Event Delegation)
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
        
        // A. Equipment Actions
        if (target.id === 'btn-auto-equip') {
            EquipmentSystem.autoEquip();
        } else if (target.id === 'btn-remove-all') {
            console.log('Click: Remove All (Logic to be implemented).');
        } else if (target.id === 'btn-start-expedition') {
            setCurrentScreen('game-screen');
        } else if (target.closest('.mannequin-slot')) {
            const slotElement = target.closest('.mannequin-slot');
            const slotType = slotElement.dataset.slotType;
            console.log(`Click: Slot ${slotType} (Open Item Selection Modal).`);
        }
        
        // B. Workshop Actions (Refine Tab)
        else if (target.id === 'btn-execute-refine') {
            const recipeId = target.dataset.recipeId;
            if (recipeId) {
                const result = CraftingSystem.processRefineAction(recipeId);
                
                // Temporary feedback
                if (result.success) {
                    alert(`SUCCESS: ${result.message}`);
                } else {
                    alert(`FAILURE: ${result.message}`);
                }
            }
        }

        // C. Tab Switching Logic (Future: to manage activeWorkshopTab in GameState)
        else if (target.closest('#workshop-tabs a')) {
             const tabId = target.dataset.tab;
             // Future: updateState({ activeWorkshopTab: tabId });
             console.log(`Switching Workshop Tab to: ${tabId} (Not yet fully implemented)`);
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
