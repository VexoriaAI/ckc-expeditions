/* ====================================================================
// RENDERER: renderHubPreparation.js
// UPDATE: (CORREÇÃO DE IMPORTAÇÃO 404)
// Atualiza os caminhos para usar os novos arquivos modulares de
// Workshop (Refine, Craft, Embed) e Inventário (Equip, Comp, List, Shop).
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { calculateFinalStats, calculatePowerScore } from '../../systems/StatCalculationSystem.js';
import { EquipmentSystem } from '../../systems/EquipmentSystem.js';

import { renderMannequinSlots } from './renderMannequin.js';

// --- (CORREÇÃO) NOVOS IMPORTS MODULARES ---

// 1. Workshop Modules
import { renderRefineTab } from './renderWorkshopRefine.js';
import { renderCraftTab } from './renderWorkshopCraft.js';
import { renderEmbedTab } from './renderWorkshopEmbed.js';

// 2. Inventory Modules
import { renderInventoryEquipments } from './renderInventoryEquipments.js'; 
import { renderInventoryComponents } from './renderInventoryComponents.js';
import { renderInventoryMaterials } from './renderInventoryLists.js'; // (Lista simples para Materiais)
import { renderInventoryShopItems } from './renderInventoryShopItems.js';

// --- Fim dos Imports ---

const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

export const renderHubPreparationScreen = (state) => {
    const kidId = state.currentPlayerKidId;
    const kidStaticData = getKidDataById(kidId);
    if (!kidStaticData) return `<h2>Error: Kid Data not found for ID: ${kidId}</h2>`;

    const equippedItems = EquipmentSystem.getEquippedItems();
    const finalStats = calculateFinalStats(kidStaticData, equippedItems);
    const totalPowerScore = calculatePowerScore(finalStats);
    const mannequinHTML = renderMannequinSlots(equippedItems);

    const statsSummaryHTML = `
        <div class="stats-summary-card panel">
            <h4>FINAL STATS:</h4>
            <div class="power-score-badge">Power Score: <span>${totalPowerScore}</span></div>
            <ul class="stats-grid">
                <li>HP Max: <span>${finalStats.maxHP}</span></li>
                <li>Attack: <span>${finalStats.attack}</span></li>
                <li>Defense: <span>${finalStats.defense}</span></li>
                <li>Speed (MP): <span>${finalStats.speed}</span></li>
                <li>AP: <span>${finalStats.AP}</span></li>
                <li>Crit Chance: <span>${finalStats.critChance}%</span></li>
                <li>Luck: <span>${finalStats.luck}</span></li>
            </ul>
        </div>
    `;
    
    const kidInfoBoxHTML = `
        <div class="kid-info-box panel">
            <div class="kid-image"><img src="${kidStaticData.spritePath}" alt="${kidStaticData.name}"></div>
            <div class="kid-details">
                <input type="text" value="${kidStaticData.name}">
                <p>Tribe: <span>${kidStaticData.tribe}</span></p>
                <p>NFT ID: <span>${kidStaticData.id}</span></p>
                <p>Expeditions: <span>0</span> (placeholder)</p>
            </div>
        </div>
    `;
    
    const activeWorkshopTab = state.uiState.activeWorkshopTab || 'refine'; 
    const activeInventoryTab = state.uiState.activeInventoryTab || 'equipments';
    let workshopContent = '';
    let inventoryContent = '';
    
    // Renderiza Workshop (Modular)
    if (activeWorkshopTab === 'refine') {
        workshopContent = renderRefineTab(state);
    } else if (activeWorkshopTab === 'craft') {
        workshopContent = renderCraftTab(state);
    } else if (activeWorkshopTab === 'embed') {
        workshopContent = renderEmbedTab(state);
    }
    
    // Renderiza Inventário (Modular)
    switch (activeInventoryTab) {
        case 'equipments':
            inventoryContent = renderInventoryEquipments(state);
            break;
        case 'components':
            inventoryContent = renderInventoryComponents(state);
            break;
        case 'materials':
            inventoryContent = renderInventoryMaterials(state);
            break;
        case 'shop-items':
            inventoryContent = renderInventoryShopItems(state);
            break;
        default:
            inventoryContent = "<p>Erro: Aba de inventário desconhecida.</p>";
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
                        
                        ${inventoryContent}
                        
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
