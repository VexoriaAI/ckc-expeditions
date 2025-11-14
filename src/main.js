/* ====================================================================
// CORE: main.js
// UPDATE: Adiciona listener para o botão 'Auto Equip'.
// ==================================================================== */

import { getState, setCurrentScreen, updateState, loadDemoData } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; 
import { MATERIALS_DB } from '../database/materials.js'; 
import { EquipmentSystem } from './systems/EquipmentSystem.js'; // Importa o novo sistema

// ... (initializeApp é o mesmo)

function handleGlobalClick(event) {
    const target = event.target;
    const currentState = getState();
    
    // ... (Lógica da logged-out-screen e hub-selection-screen é a mesma) ...
    
    // --- 3. Lógica da hub-preparation-screen ---
    if (currentState.currentScreen === 'hub-preparation-screen') {
        
        // A. Lógica do botão AUTO EQUIP (GDD Requirement)
        if (target.id === 'btn-auto-equip') {
            console.log('Clique: AUTO EQUIP acionado.');
            EquipmentSystem.autoEquip();
        }
        
        // B. Lógica do botão START EXPEDITION
        else if (target.id === 'btn-start-expedition') {
            console.log('Clique: Iniciando Expedição!');
            // Futuramente, precisaríamos validar se o Kid está pronto.
            setCurrentScreen('game-screen');
        }
        
        // C. Lógica do botão REMOVE ALL (Futuro)
        else if (target.id === 'btn-remove-all') {
            console.log('Clique: Remove All (Lógica a ser implementada).');
        }
        
        // D. Lógica de clique no Mannequin Slot para abrir Modal (Futuro)
        else if (target.closest('.mannequin-slot')) {
            const slotElement = target.closest('.mannequin-slot');
            const slotType = slotElement.dataset.slotType;
            console.log(`Clique: Slot ${slotType} (Abrir Modal de Seleção de Item).`);
            // Lógica para abrir o modal de seleção e filtrar por slotType
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
