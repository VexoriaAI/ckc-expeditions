/* ====================================================================
// UI: UIManager.js
// VERSÃO COMPLETA (CORRIGIDA)
// Funde a lógica de Filtro/Paginação com todas as funções auxiliares 
// (Refine, Craft, Mannequin) e correções de layout.
// ==================================================================== */

import { MOCK_KIDZ_NFTS, MOCK_TEZERIUM_BALANCE } from '../../database/mock_wallet.js'; 
import { calculateFinalStats, calculatePowerScore } from '../systems/StatCalculationSystem.js';
import { EquipmentSystem } from '../systems/EquipmentSystem.js';
import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../database/equipment.js';
import { RECIPES_DB } from '../../database/recipes.js';
import { MATERIALS_DB } from '../../database/materials.js';
import { COMPONENTS_DB } from '../../database/components.js';
import { SHOP_ITEMS_DB } from '../../database/crafting_rules.js';

let appRoot; 

const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

// --- RENDER UTILITY: Mannequin (CORRIGIDO P/ ICON 32x32) ---
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
        
        if (item) {
            // Slot Equipado
            const itemData = EQUIPMENT_DB[item.item_id];
            slotsHTML += `
                <div class="mannequin-slot equipped-slot" data-slot-type="${slotType}" data-equipped-instance-id="${item.instance_id}">
                    <img src="${itemData.iconPath}" alt="${itemData.name}">
                    <span class="slot-name">${itemData.name}</span>
                </div>
            `;
        } else {
            // Slot Vazio (Placeholder)
            const placeholderIcon = `assets/ui/icon_${slotType}.png`;
            const placeholderName = `Empty (${slotType.toUpperCase()})`;
            slotsHTML += `
                <div class="mannequin-slot empty-slot" data-slot-type="${slotType}">
                    <img src="${placeholderIcon}" alt="${placeholderName}">
                    <span class="slot-name">${placeholderName}</span>
                </div>
            `;
        }
    }
    return slotsHTML;
};

// --- RENDER UTILITY: Refine Tab ---
const renderRefineTab = (state) => {
    const recipes = Object.values(RECIPES_DB).filter(r => r.type === 'REFINE');
    const playerInventory = state.playerInventory;
    let recipesHTML = '';

    for (const recipe of recipes) {
        const outputItemData = MATERIALS_DB[recipe.output.itemId] || COMPONENTS_DB[recipe.output.itemId];
        const outputIconPath = outputItemData ? outputItemData.iconPath : 'assets/ui/icon_unknown.png';
        
        let allInputsAvailable = true;
        
        const inputHTML = Object.keys(recipe.inputMaterials).map(matId => {
            const required = recipe.inputMaterials[matId];
            const owned = playerInventory.materials[matId] || 0;
            const matData = MATERIALS_DB[matId];
            const isAvailable = owned >= required;
            if (!isAvailable) allInputsAvailable = false;
            
            return `
                <span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">
                    <img src="${matData.iconPath}" alt="${matData.name}" title="${matData.name}">
                    ${owned}/${required}
                </span>
            `;
        }).join(' + ');
        
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
                    class="btn-sm action-btn btn-primary ${allInputsAvailable ? '' : 'disabled'}"
                    ${allInputsAvailable ? '' : 'disabled'}
                >
                    REFINE
                </button>
            </div>
        `;
    }

    return `<div class="refine-list">${recipesHTML}</div>`;
};

// --- RENDER UTILITY: Craft Tab ---
const renderCraftTab = (state) => {
    const recipes = Object.values(RECIPES_DB).filter(r => r.type === 'CRAFT');
    const playerInventory = state.playerInventory;
    let recipesHTML = '';

    for (const recipe of recipes) {
        const outputItemData = EQUIPMENT_DB[recipe.output.itemId];
        const outputIconPath = outputItemData ? outputItemData.iconPath : 'assets/ui/icon_unknown.png';
        
        let allInputsAvailable = true;
        const inputSections = [];

        // 1. Render Material Inputs
        const materialInputs = Object.keys(recipe.inputMaterials).map(matId => {
            const required = recipe.inputMaterials[matId];
            const owned = playerInventory.materials[matId] || 0;
            const matData = MATERIALS_DB[matId];
            const isAvailable = owned >= required;
            if (!isAvailable) allInputsAvailable = false;
            
            return `<span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">${matData.name}: ${owned}/${required}</span>`;
        }).join(' + ');
        if (materialInputs) inputSections.push(materialInputs);

        // 2. Render Shop Item Inputs 
        const shopItemInputs = Object.keys(recipe.inputShopItems).map(itemId => {
            const required = recipe.inputShopItems[itemId];
            const owned = playerInventory.shopItems[itemId] || 0;
            const itemData = SHOP_ITEMS_DB[itemId];
            const isAvailable = owned >= required;
            if (!isAvailable) allInputsAvailable = false;
            
            return `<span class="recipe-input-item ${isAvailable ? 'available' : 'missing'}">${itemData.name}: ${owned}/${required}</span>`;
        }).join(' + ');
        if (shopItemInputs) inputSections.push(shopItemInputs);


        const inputHTML = inputSections.join('<br>'); 

        recipesHTML += `
            <div class="recipe-card craft-recipe" data-recipe-id="${recipe.recipeId}">
                <h4>${recipe.name}</h4>
                <div class="recipe-io">
                    <div class="input-section">${inputHTML}</div>
                    <span class="arrow-separator">→</span>
                    <div class="output-section">
                        <img src="${outputIconPath}" alt="${outputItemData.name}" title="${outputItemData.name}">
                        <span>${outputItemData.name} (${recipe.output.rarity || 'Common'})</span>
                    </div>
                </div>
                
                <button 
                    id="btn-execute-craft" 
                    data-recipe-id="${recipe.recipeId}"
                    class="btn-sm action-btn btn-success ${allInputsAvailable ? '' : 'disabled'}"
                    ${allInputsAvailable ? '' : 'disabled'}
                >
                    CRAFT
                </button>
            </div>
        `;
    }

    return `<div class="craft-list">${recipesHTML}</div>`;
};

// --- RENDER UTILITY: Header ---
const renderHeader = (state) => {
    let headerRight = '';
    let headerLeft = '';

    if (state.isWalletConnected) {
        // Logged In State
        headerLeft = `
            <div class="tezerium-display">
                Tezerium: <span>${MOCK_TEZERIUM_BALANCE || 500}</span>
            </div>`;
        headerRight = `
            <div class="wallet-info">
                <span>CKID-DEMO-001</span>
            </div>
            <button id="btn-logout" class="action-btn btn-sm btn-primary">LOG OUT</button>`;
    } else {
        // Logged Out State
        headerRight = `
            <button id="btn-connect-wallet" class="action-btn btn-sm btn-primary">CONNECT WALLET</button>`;
    }

    return `
        <header class="main-header">
            <div class="header-left">
                ${headerLeft}
            </div>
            <div class="header-right">
                ${headerRight}
            </div>
        </header>`;
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
        
        appRoot.innerHTML = ''; // Clear screen
        
        // Render the global header first
        appRoot.innerHTML = renderHeader(state);

        // Render the screen content
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
        
        appRoot.innerHTML += htmlContent; // Add screen content AFTER header
        appRoot.dataset.currentScreen = screenId;
    },

    renderLoggedOutScreen: function(state) {
        return `
            <div class="screen logged-out-screen" id="logged-out-screen">
                <div class="landing-container panel">
                    <img src="assets/ui/game-logo.png" alt="CyberKidz Logo" id="game-logo">
                    <h2>CyberKidz Club - Expeditions</h2>
                    <p>Wallet Status: <span id="connection-status">${state.isWalletConnected ? 'Connected' : 'Disconnected'}</span> (Tezos)</p>
                    <div class="landing-actions">
                        <button id="btn-connect-wallet" class="action-btn btn-primary">Connect Wallet</button>
                        <button id="btn-play-demo" class="action-btn btn-info">Play Demo</button>
                    </div>
                </div>
            </div>
        `;
    },

    // --- (ATUALIZADO) HUB SELECTION SCREEN (Com Filtros e Paginação) ---
    renderHubSelectionScreen: function(state) {
        const kidzData = state.playerKidz || []; 
        const filters = state.hubSelectionFilters;
        
        // 1. Lógica de Filtro e Ordenação
        let filteredKidz = kidzData;

        // Search Query
        if (filters.searchQuery) {
            filteredKidz = filteredKidz.filter(kid => 
                kid.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
            );
        }

        // Tribe (Multiple)
        if (filters.selectedTribes.length > 0) {
            filteredKidz = filteredKidz.filter(kid => 
                filters.selectedTribes.includes(kid.tribe)
            );
        }

        // Sort
        filteredKidz.sort((a, b) => {
            if (filters.sortBy === 'power') {
                const powerA = calculatePowerScore(a.baseStats);
                const powerB = calculatePowerScore(b.baseStats);
                return powerB - powerA; // Descending
            }
            // Default: 'level'
            return b.level - a.level; // Descending
        });

        // 2. Lógica de Paginação
        const totalItems = filteredKidz.length;
        const totalPages = Math.ceil(totalItems / filters.itemsPerPage);
        const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
        const endIndex = startIndex + filters.itemsPerPage;
        const paginatedKidz = filteredKidz.slice(startIndex, endIndex);
        
        // 3. Renderização dos Cards (Apenas itens paginados)
        const kidCardsHTML = paginatedKidz.map(kid => `
            <div class="kid-card panel" data-kid-id="${kid.id}">
                <img src="${kid.spritePath}" alt="${kid.name}">
                <h4>${kid.name} (#${kid.id})</h4>
                <p>Tribe: <strong>${kid.tribe}</strong> | Level: ${kid.level}</p>
                <p>Power: ${calculatePowerScore(kid.baseStats)}</p>
                <button id="btn-select-kid" class="action-btn btn-primary">SELECT AND PREPARE</button>
            </div>
        `).join('');

        // 4. Renderização dos Controles de Filtro
        const filterControlsHTML = `
            <div class="filter-toolbar panel">
                <input type="text" id="filter-search-name" placeholder="Search by name..." value="${filters.searchQuery}">
                
                <select id="filter-tribe" multiple>
                    <option value="VOLCANICS" ${filters.selectedTribes.includes('VOLCANICS') ? 'selected' : ''}>Volcanics</option>
                    <option value="NOCTURNALS" ${filters.selectedTribes.includes('NOCTURNALS') ? 'selected' : ''}>Nocturnals</option>
                    <option value="UNDERGROUNDERS" ${filters.selectedTribes.includes('UNDERGROUNDERS') ? 'selected' : ''}>Undergrounders</option>
                    <option value="REPTILIANS" ${filters.selectedTribes.includes('REPTILIANS') ? 'selected' : ''}>Reptilians</option>
                    <option value="RADIOACTIVES" ${filters.selectedTribes.includes('RADIOACTIVES') ? 'selected' : ''}>Radioactives</option>
                </select>
                
                <select id="filter-sort-by">
                    <option value="level" ${filters.sortBy === 'level' ? 'selected' : ''}>Sort by Level</option>
                    <option value="power" ${filters.sortBy === 'power' ? 'selected' : ''}>Sort by Power</option>
                </select>
                
                <select id="filter-items-per-page">
                    <option value="5" ${filters.itemsPerPage == 5 ? 'selected' : ''}>5 per page</option>
                    <option valueValue="10" ${filters.itemsPerPage == 10 ? 'selected' : ''}>10 per page</option>
                    <option value="20" ${filters.itemsPerPage == 20 ? 'selected' : ''}>20 per page</option>
                    <option value="50" ${filters.itemsPerPage == 50 ? 'selected' : ''}>50 per page</option>
                </select>
                
                <button id="btn-filter-reset" class="action-btn btn-secondary btn-sm">Reset</button>
            </div>
        `;
        
        // 5. Renderização dos Controles de Paginação
        const paginationControlsHTML = `
            <div class="pagination-controls panel">
                <button id="btn-page-prev" class="action-btn btn-sm" ${filters.currentPage === 1 ? 'disabled' : ''}>Previous</button>
                <span>Page ${filters.currentPage} of ${totalPages} (${totalItems} items)</span>
                <button id="btn-page-next" class="action-btn btn-sm" ${filters.currentPage >= totalPages ? 'disabled' : ''}>Next</button>
            </div>
        `;

        // 6. Montagem Final
        return `
            <div class="screen hub-selection-screen hub-container">
                ${filterControlsHTML}
                <div class="nft-grid">
                    ${kidCardsHTML.length > 0 ? kidCardsHTML : '<p>No CyberKidz found matching filters.</p>'}
                </div>
                ${paginationControlsHTML}
            </div>
        `;
    },

    // --- HUB PREPARATION SCREEN (Layout Corrigido) ---
    renderHubPreparationScreen: function(state) {
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
            workshopContent = "<h4>EMBED Interface (To be implemented)</h4>";
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
    },
    
    renderGameScreen: function(state) {
        return `
            <div class="screen game-screen">
                <h2>Expedition in Progress!</h2>
                <p>Kid: #${state.currentPlayerKidId} is on the map.</p>
                <button id="btn-end-expedition" class="action-btn btn-primary">Return to HUB</button>
            </div>
        `;
    }
};
