/* ====================================================================
// UI: UIManager.js
// UPDATE: Integrates StatCalculationSystem and EquipmentSystem to render 
// the Character Sheet in the hub-preparation-screen.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js';
import { calculateFinalStats, calculatePowerScore } from '../systems/StatCalculationSystem.js';
import { EquipmentSystem } from '../systems/EquipmentSystem.js';
import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../database/equipment.js';

let appRoot; 
// ... (init, renderScreen, renderLoggedOutScreen, renderHubSelectionScreen são os mesmos)

// Helper function to find Kid data
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * Renders the Character Mannequin, showing equipped items.
 * @param {Array<object>} equippedItems - Array of equipped InventoryItem instances.
 * @returns {string} HTML for the Mannequin slots.
 */
const renderMannequinSlots = (equippedItems) => {
    let slotsHTML = '';
    
    // Map equipped items for easy lookup by slot type
    const equippedMap = equippedItems.reduce((map, item) => {
        const staticData = EQUIPMENT_DB[item.item_id];
        if (staticData) {
            map[staticData.slot] = item;
        }
        return map;
    }, {});

    for (const slotType of EQUIPMENT_SLOTS) {
        const item = equippedMap[slotType];
        const itemName = item ? EQUIPMENT_DB[item.item_id].name : `Empty (${slotType.toUpperCase()})`;
        const itemIconPath = item ? EQUIPMENT_DB[item.item_id].iconPath : `assets/ui/icon_${slotType}.png`;
        
        slotsHTML += `
            <div class="mannequin-slot" data-slot-type="${slotType}" data-equipped-instance-id="${item ? item.instance_id : ''}">
                <img src="${itemIconPath}" alt="${itemName}">
                <span class="slot-name">${itemName}</span>
            </div>
        `;
    }
    return slotsHTML;
};


/**
 * Renders the Tela 3: hub-preparation-screen (Equipment/Workshop Preparation).
 */
export const UIManager = {
    // ... (init, renderScreen, renderLoggedOutScreen, renderHubSelectionScreen)
    
    renderHubPreparationScreen: function(state) {
        const kidId = state.currentPlayerKidId;
        const kidStaticData = getKidDataById(kidId);

        if (!kidStaticData) {
            return `<h2>Error: Kid Data not found for ID: ${kidId}</h2>`;
        }

        // 1. Calculate final stats (Kid Base + Equipped Items + Components)
        const equippedItems = EquipmentSystem.getEquippedItems();
        const finalStats = calculateFinalStats(kidStaticData, equippedItems);
        const totalPowerScore = calculatePowerScore(finalStats);

        // 2. Render Mannequin (Equipped Items)
        const mannequinHTML = renderMannequinSlots(equippedItems);

        // 3. Render Stats Summary
        const statsSummaryHTML = `
            <div class="stats-summary-card">
                <h4>FINAL STATS:</h4>
                <div class="power-score-badge">Power Score: <span>${totalPowerScore}</span></div>
                <ul>
                    <li>HP Max: ${finalStats.maxHP}</li>
                    <li>Attack: ${finalStats.attack}</li>
                    <li>Defense: ${finalStats.defense}</li>
                    <li>Speed (MP): ${finalStats.speed}</li>
                    <li>Action Points (AP): ${finalStats.AP}</li>
                    <li>Crit Chance: ${finalStats.critChance}%</li>
                    <li>Luck: ${finalStats.luck}</li>
                </ul>
                <div class="base-stats-info">
                    Base: ${kidStaticData.baseStats.maxHP} HP / ${kidStaticData.baseStats.attack} ATK 
                </div>
            </div>
        `;

        return `
            <div class="screen hub-preparation-screen container-fluid">
                <h1>Expedition Prep - ${kidStaticData.name} (#${kidId})</h1>
                <div class="row">
                    <div class="col-4 character-sheet-col">
                        <h3>Character Sheet: ${kidStaticData.tribe}</h3>
                        
                        <div class="mannequin-container">
                            ${mannequinHTML}
                        </div>

                        ${statsSummaryHTML}
                        
                        <div class="d-flex justify-content-between mt-3">
                            <button id="btn-auto-equip" class="btn-info">AUTO EQUIP</button>
                            <button id="btn-remove-all" class="btn-warning">REMOVE ALL</button>
                        </div>
                        
                        <button id="btn-start-expedition" class="btn-success btn-lg mt-3">START EXPEDITION</button>
                    </div>

                    <div class="col-8 inventory-workshop-col">
                        <div class="inventory-panel">
                            <p class="mt-3">[Inventory Content will be rendered here]</p>
                        </div>

                        <div class="workshop-panel mt-4">
                            <p class="mt-3">[Workshop Logic will be rendered here]</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // ... (renderGameScreen é o mesmo)
};
