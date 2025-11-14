/* ====================================================================
// RENDERER: renderHubPreparation.js
// UPDATE: Importa e chama 'renderEmbedTab' do renderWorkshop.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { calculateFinalStats, calculatePowerScore } from '../../systems/StatCalculationSystem.js';
import { EquipmentSystem } from '../../systems/EquipmentSystem.js';

// Importa os renderers modulares
import { renderMannequinSlots } from './renderMannequin.js';
// (NOVO) Importa renderEmbedTab
import { renderRefineTab, renderCraftTab, renderEmbedTab } from './renderWorkshop.js';

// Helper local
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * Renders the Hub Preparation screen (Character Sheet, Workshop, Inventory).
 * @param {object} state - The current GameState.
 * @returns {string} HTML content for the screen.
 */
export const renderHubPreparationScreen = (state) => {
    const kidId = state.currentPlayerKidId;
    const kidStaticData = getKidDataById(kidId);

    if (!kidStaticData) {
        return `<h2>Error: Kid Data not found for ID: ${kidId}</h2>`;
    }

    // --- Cálculos de Stats ---
    const equippedItems = EquipmentSystem.getEquippedItems();
    const finalStats = calculateFinalStats(kidStaticData, equippedItems);
    const totalPowerScore = calculatePowerScore(finalStats);

    // --- Renderização dos Componentes da UI ---
    const mannequinHTML = renderMannequinSlots(equippedItems);

    const statsSummaryHTML = `
        <div class="stats-summary-card panel">
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
    
    const kidInfoBoxHTML = `
        <div class="kid-info-box panel">
            <div class="kid-image">
                <img src="${kidStaticData.spritePath}" alt="${kidStaticData.name}">
            </div>
            <div class="kid-details">
                <input type="text" value="${kidStaticData.name}">
                <p>Tribe: <span>${kidStaticData.tribe}</span></p>
                <p>NFT ID: <span>${kidStaticData.id}</span></p>
                <p>Expeditions: <span>0</span> (placeholder)</p>
            </div>
        </div>
    `;
    
    const activeWorkshopTab = state.activeWorkshopTab || 'refine'; 
    const activeInventoryTab = state.activeInventoryTab || 'equipments';
    let workshopContent = '';
    
    if (activeWorkshopTab === 'refine') {
        workshopContent = renderRefineTab(state);
    } else if (activeWorkshopTab === 'craft') {
        workshopContent = renderCraftTab(state);
    } else if (activeWorkshopTab === 'embed') {
        // (NOVO) Chama a função de renderização do Embed
        workshopContent = renderEmbedTab(state);
    }

    // --- Montagem Final da Tela ---
    return `
        <div class="screen hub-preparation-screen">
            
            <div class="page-title-bar">
                <h1>Expedition Prep</h1>
                <button id="btn-back-to-selection" class="action-btn btn-secondary btn-sm">Back to Selection</button>
            </div>

            <div class="preparation-container">
                <div class="character-sheet-col">
                    
                    ${kidInfoBoxHTML}

                    <div class="mannequin-controls">
                        <button id="btn-auto-equip" class="action-btn btn-info btn-sm">AUTO EQUIP</button>
                        <button id="btn-remove-all" class="action-btn btn-sm btn-primary">REMOVE ALL</button>
                    </div>
                    
                    <div class="equipment-mannequin">
                        ${mannequinHTML}
                    </div>

                    ${statsSummaryHTML}
                    
                    <button id="btn-start-expedition" class="action-btn btn-success">START EXPEDITION</button>
                </div>

                <div class="inventory-workshop-col">
                    
                    <div class="inventory-panel panel">
                        <h3>Inventory</h3>
                        <div class="tabs" id="inventory-tabs">
                            <button class="tab-btn ${activeInventoryTab === 'equipments' ? 'active' : ''}" data-tab="equipments">Equipments</button>
                            <button class="tab-btn ${activeInventoryTab === 'components' ? 'active' : ''}" data-tab="components">Components</button>
                            <button class="tab-btn ${activeInventoryTab === 'materials' ? 'active' : ''}" data-tab="materials">Materials</button>
                            <button class="tab-btn ${activeInventoryTab === 'shop-items' ? 'active' : ''}" data-tab="shop-items">Shop Items</button>
                        </div>
                        <div class="item-grid-container">
                            <p>[Inventory List (To be implemented)]</p>
                        </div>
                    </div>

                    <div class="workshop-panel panel">
                        <h3>Workshop</h3>
                        <div class="tabs" id="workshop-tabs">
                            <button class="tab-btn ${activeWorkshopTab === 'refine' ? 'active' : ''}" data-tab="refine">REFINE</button>
                            <button class="tab-btn ${activeWorkshopTab === 'craft' ? 'active' : ''}" data-tab="craft">CRAFT</button>
                            <button class="tab-btn ${activeWorkshopTab === 'embed' ? 'active' : ''}" data-tab="embed">EMBED</button>
                        </div>
                        <div id="workshop-content" class="tab-content">
                            ${workshopContent}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
