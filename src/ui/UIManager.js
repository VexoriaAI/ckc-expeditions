/* ====================================================================
// UI: UIManager.js
// The Arms/Eyes - The only module authorized to manipulate the DOM.
// Maps the state (state.currentScreen) to the HTML content.
// Language: English
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js';
import { calculateFinalStats, calculatePowerScore } from '../systems/StatCalculationSystem.js';
import { EquipmentSystem } from '../systems/EquipmentSystem.js';
import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../database/equipment.js';
import { RECIPES_DB } from '../../database/recipes.js';
import { MATERIALS_DB } from '../../database/materials.js';
import { COMPONENTS_DB } from '../../database/components.js';

let appRoot; 

// Helper function to find Kid data
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

// --- RENDER UTILITY: Mannequin ---
const renderMannequinSlots = (equippedItems) => {
    let slotsHTML = '';
    
    const equippedMap = equippedItems.reduce((map, item) => {
        const staticData = EQUIPMENT_DB[item.item_id];
        if (staticData) {
            map[staticData.slot] = item;
        }
        return map;
    }, {});

    for (const slotType of EQUIPMENT_SLOTS) {
        const item = equippedMap[slotType];
        // Placeholder icon path (assuming assets/ui/icon_type.png exists)
        const itemIconPath = item ? EQUIPMENT_DB[item.item_id].iconPath : `assets/ui/icon_${slotType}.png`;
        const itemName = item ? EQUIPMENT_DB[item.item_id].name : `Empty (${slotType.toUpperCase()})`;
        
        slotsHTML += `
            <div class="mannequin-slot" data-slot-type="${slotType}" data-equipped-instance-id="${item ? item.instance_id : ''}">
                <img src="${itemIconPath}" alt="${itemName}">
                <span class="slot-name">${itemName}</span>
            </div>
        `;
    }
    return slotsHTML;
};

// --- RENDER UTILITY: Refine Tab ---
const renderRefineTab = (state) => {
    const recipes = Object.values(RECIPES_DB).filter(r => r.type === 'REFINE');
    const playerMaterials = state.playerInventory.materials;
    let recipesHTML = '';

    for (const recipe of recipes) {
        const outputItemData = MATERIALS_DB[recipe.output.itemId] || COMPONENTS_DB[recipe.output.itemId];
        const outputIconPath = outputItemData ? outputItemData.iconPath : 'assets/ui/icon_unknown.png';
        
        const inputHTML = Object.keys(recipe.inputMaterials).map(matId => {
            const required = recipe.inputMaterials[matId];
            const owned = playerMaterials[matId] || 0;
            const matData = MATERIALS_DB[matId];
            const isAvailable = owned >= required;
            
            return `
                <span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">
                    <img src="${matData.iconPath}" alt="${matData.name}" title="${matData.name}">
                    ${owned}/${required}
                </span>
            `;
        }).join(' + ');
        
        // Determine if the recipe can be executed (simple check based on HTML class)
        const canRefine = !inputHTML.includes('missing');

        recipesHTML += `
            <div class="recipe-card refine-recipe" data-recipe-id="${recipe.recipeId}">
                <h4>${recipe.name}</h4>
                <div class="recipe-io">
                    <div class="input-section">${inputHTML}</div>
                    <span class="arrow-separator">→</span>
                    <div class="output-section">
                        <img src="${outputIconPath}" alt="${outputItemData.name}" title="${outputItemData.name}">
                        <span>${recipe.output.amount}x ${outputItemData.name}</span>
                    </div>
                </div>
                
                <button 
                    id="btn-execute-refine" 
                    data-recipe-id="${recipe.recipeId}"
                    class="btn-sm btn-primary ${canRefine ? '' : 'disabled'}"
                    ${canRefine ? '' : 'disabled'}
                >
                    REFINE
                </button>
            </div>
        `;
    }

    return `<div class="refine-list">${recipesHTML}</div>`;
};


// --- UIManager Public Interface ---

export const UIManager = {
    init: function() {
        appRoot = document.getElementById('app-root');
        if (!appRoot) {
            console.error("CRITICAL Error: #app-root element not found.");
        }
    },

    renderScreen: function(state) {
        if (!appRoot) return; 

        const screenId = state.currentScreen;
        let htmlContent = '';

        appRoot.innerHTML = '';
        
        switch (screenId) {
            case 'logged-out-screen':
                htmlContent = this.renderLoggedOutScreen(state);
                break;
            case 'hub-selection-screen':
                htmlContent = this.renderHubSelectionScreen(state);
                break;
            case 'hub-preparation-screen':
                htmlContent = this.renderHubPreparationScreen(state);
                break;
            case 'game-screen': 
                htmlContent = this.renderGameScreen(state);
                break;
            default:
                htmlContent = `<h2>[ERROR] Screen Not Found: ${screenId}</h2>`;
        }

        appRoot.innerHTML = htmlContent;
        appRoot.dataset.currentScreen = screenId;
    },

    renderLoggedOutScreen: function(state) {
        const status = state.isWalletConnected ? 'Connected' : 'Disconnected';
        return `
            <div class="screen logged-out-screen">
                <img src="assets/ui/game-logo.png" alt="CyberKidz Logo" class="logo">
                <h1>CyberKidz Club - Expeditions</h1>
                <p>Wallet Status: <strong>${status}</strong> (Tezos)</p>
                <button id="btn-connect-wallet" class="btn-primary">Connect Wallet</button>
                <button id="btn-play-demo" class="btn-secondary">Play Demo</button>
            </div>
        `;
    },

    renderHubSelectionScreen: function(state) {
        const kidzData = state.playerKidz || []; 
        
        const kidCardsHTML = kidzData.map(kid => `
            <div class="kid-card" data-kid-id="${kid.id}">
                <img src="${kid.spritePath}" alt="${kid.name}">
                <h3>${kid.name} (#${kid.id})</h3>
                <p>Tribe: <strong>${kid.tribe}</strong> | Level: ${kid.level}</p>
                <button id="btn-select-kid" class="btn-select">SELECT AND PREPARE</button>
            </div>
        `).join('');

        return `
            <div class="screen hub-selection-screen">
                <h2>Select CyberKid for Expedition</h2>
                <div class="kid-grid-container">
                    ${kidCardsHTML}
                </div>
            </div>
        `;
    },

    renderHubPreparationScreen: function(state) {
        const kidId = state.currentPlayerKidId;
        const kidStaticData = getKidDataById(kidId);

        if (!kidStaticData) {
            return `<h2>Error: Kid Data not found for ID: ${kidId}</h2>`;
        }

        const equippedItems = EquipmentSystem.getEquippedItems();
        const finalStats = calculateFinalStats(kidStaticData, equippedItems);
        const totalPowerScore = calculatePowerScore(finalStats);

        const mannequinHTML = renderMannequinSlots(equippedItems);

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
            </div>
        `;
        
        // Workshop Tab Logic
        const activeWorkshopTab = 'refine'; 
        let workshopContent = '';
        if (activeWorkshopTab === 'refine') {
            workshopContent = renderRefineTab(state);
        }

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
                            <h3>Inventory</h3>
                            <p>[Inventory Tabs and Item Lists to be implemented]</p>
                        </div>

                        <div class="workshop-panel mt-4">
                            <h3>Workshop</h3>
                            <ul class="nav nav-tabs" id="workshop-tabs">
                                <li class="nav-item"><a class="nav-link ${activeWorkshopTab === 'refine' ? 'active' : ''}" data-tab="refine">REFINE</a></li>
                                <li class="nav-item"><a class="nav-link ${activeWorkshopTab === 'craft' ? 'active' : ''}" data-tab="craft">CRAFT</a></li>
                                <li class="nav-item"><a class="nav-link ${activeWorkshopTab === 'embed' ? 'active' : ''}" data-tab="embed">EMBED</a></li>
                            </ul>
                            <div id="workshop-content" class="tab-content">
                                ${workshopContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderGameScreen: function(state) {
        return `
            <div class="screen game-screen">
                <h2>Expedition in Progress!</h2>
                <p>Kid: #${state.currentPlayerKidId} is on the map.</p>
                <button id="btn-end-expedition" class="btn-danger">Return to HUB</button>
            </div>
        `;
    }
};
