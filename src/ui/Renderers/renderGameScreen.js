/* ====================================================================
// RENDERER: renderGameScreen.js
// UPDATE: (Refatoração de Layout V2)
// - Move 'Loot Found' para a Coluna 3.
// - Adiciona 'Consumables' (Shop Items) à Coluna 1.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { STATIC_MAP_DATA, MAP_BIOMES } from '../../../database/maps.js';
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js'; // (NOVO) Importa Shop Items

// Helper local
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * Helper para renderizar a lista de Loot Encontrado
 */
const renderLootList = (loot) => {
    const materials = Object.keys(loot.materials);
    // (Futuro: Adicionar components e equipment)
    
    if (materials.length === 0) {
        return '<li>No loot found yet.</li>';
    }
    
    return materials.map(matId => {
        const itemData = MATERIALS_DB[matId];
        const quantity = loot.materials[matId];
        return `
            <li class="loot-item">
                <img src="${itemData.iconPath}" alt="${itemData.name}">
                <span>${itemData.name}</span>
                <span class="loot-quantity">x ${quantity}</span>
            </li>
        `;
    }).join('');
};

/**
 * (NOVO) Helper para renderizar a lista de Consumíveis (Shop Items)
 */
const renderConsumablesList = (state) => {
    const shopItems = state.playerInventory.shopItems; // Pega do inventário principal
    const keys = Object.keys(shopItems);
    
    if (keys.length === 0) {
        return '<li>No consumables available.</li>';
    }

    return keys.map(itemId => {
        const itemData = SHOP_ITEMS_DB[itemId];
        const quantity = shopItems[itemId];
        if (!itemData) return '';
        
        // (Placeholder para itens não usáveis aqui)
        const useButton = (itemId === 'ap_refill') 
            ? `<button id="btn-use-consumable" data-item-id="${itemId}" class="action-btn btn-xs btn-info">USE</button>`
            : '';

        return `
            <li class="consumable-item">
                <img src="${itemData.iconPath}" alt="${itemData.name}" title="${itemData.description}">
                <div class="consumable-details">
                    <span>${itemData.name} (x${quantity})</span>
                    <p>${itemData.description}</p>
                </div>
                ${useButton}
            </li>
        `;
    }).join('');
};

/**
 * Renderiza a tela principal da Expedição (Game Screen).
 * @param {object} state - O GameState completo.
 * @returns {string} HTML para a tela do jogo.
 */
export const renderGameScreen = (state) => {
    const { expedition, currentPlayerKidId } = state;
    const kidStaticData = getKidDataById(currentPlayerKidId);

    if (!expedition || !kidStaticData) {
        return `<div class="screen game-screen"><h2>Error: Expedition data not found.</h2></div>`;
    }

    const { kidStats, currentHP, maxHP, currentAP, maxAP, currentMP, maxMP, currentDay, maxDays, log, position, foundLoot } = expedition;
    const currentTile = STATIC_MAP_DATA.find(t => t.q === position.q && t.r === position.r);
    const currentBiome = MAP_BIOMES[currentTile.biome];
    const totalPowerScore = calculatePowerScore(kidStats);
    
    // Lógica da Barra de HP
    const hpPercent = (currentHP / maxHP) * 100;
    let hpColorClass = 'hp-fill-green'; // 40-100%
    if (hpPercent < 40) hpColorClass = 'hp-fill-orange'; // 20-40%
    if (hpPercent < 20) hpColorClass = 'hp-fill-red';    // 0-20%


    // --- (ATUALIZADO) Coluna 1: Status do Kid ---
    const column1_Status = `
        <div class="game-column panel" id="game-col-status">
            
            <div class="kid-info-box panel">
                <div class="kid-image"><img src="${kidStaticData.spritePath}" alt="${kidStaticData.name}"></div>
                <div class="kid-details">
                    <h4>${kidStaticData.name}</h4>
                    <p>Tribe: <span>${kidStaticData.tribe}</span></p>
                    <p>NFT ID: <span>${kidStaticData.id}</span></p>
                    
                    <div class="kid-card-stats game-screen-stats">
                        <div class="stat-badge level-badge">
                            Level: <span>${kidStaticData.level}</span>
                        </div>
                        <div class="stat-badge power-badge">
                            Power: <span>${totalPowerScore}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="status-bars">
                <div class="stat-bar">
                    <span class="stat-label">HP</span>
                    <div class="bar-track">
                        <div class="bar-fill ${hpColorClass}" style="width: ${hpPercent}%"></div>
                    </div>
                    <span class="stat-value">${currentHP}/${maxHP}</span>
                </div>
            </div>

            <div class="expedition-stats-list panel">
                <h4>Final Attributes</h4>
                <ul>
                    <li>Attack: <span>${kidStats.attack}</span></li>
                    <li>Defense: <span>${kidStats.defense}</span></li>
                    <li>Speed: <span>${kidStats.speed}</span></li>
                    <li>Crit Chance: <span>${kidStats.critChance}%</span></li>
                    <li>Crit Damage: <span>+${kidStats.critDamage}%</span></li>
                    <li>HP Regen: <span>${kidStats.hpRegen}</span></li>
                    <li>Luck: <span>${kidStats.luck}</span></li>
                </ul>
            </div>
            
            <div class="consumables-display panel">
                <h4>Consumables</h4>
                <ul class="consumables-display-list">
                    ${renderConsumablesList(state)}
                </ul>
            </div>
        </div>
    `;

    // --- Coluna 2: Mapa e Ações ---
    const column2_Map = `
        <div class="game-column" id="game-col-map">
            
            <div class="map-container panel">
                <img src="assets/maps/wasteland_map_full.png" alt="Wasteland Map" class="map-background-image">
                <div class="kid-marker" style="top: 50%; left: 50%;">🧑‍🚀</div>
            </div>
            
            <div class="action-points-bar panel">
                <div class="stat-bar">
                    <span class="stat-label">AP</span>
                    <div class="bar-track">
                        <div class="bar-fill ap-fill" style="width: ${(currentAP / maxAP) * 100}%"></div>
                    </div>
                    <span class="stat-value">${currentAP}/${maxAP}</span>
                </div>
                <div class="stat-bar">
                    <span class="stat-label">MP</span>
                    <div class="bar-track">
                        <div class="bar-fill mp-fill" style="width: ${(currentMP / maxMP) * 100}%"></div>
                    </div>
                    <span class="stat-value">${currentMP}/${maxMP}</span>
                </div>
            </div>
            
            <div class="action-bar panel">
                <button id="btn-action-collect" class="action-btn btn-success" ${currentAP < 1 ? 'disabled' : ''}>
                    Collect (1 AP)
                </button>
                <button id="btn-action-investigate" class="action-btn btn-info" ${currentAP < 1 ? 'disabled' : ''}>
                    Investigate (1 AP)
                </button>
                <button id="btn-action-search" class="action-btn btn-primary" ${currentAP < 2 ? 'disabled' : ''}>
                    Search Enemy (2 AP)
                </button>
                <button id="btn-action-end-day" class="action-btn btn-secondary">
                    End Day (${currentDay}/${maxDays})
                </button>
            </div>
        </div>
    `;

    // --- (ATUALIZADO) Coluna 3: Log e Saída ---
    const column3_Log = `
        <div class="game-column panel" id="game-col-log">
            
            <div class="loot-display panel">
                <h4>Loot Found</h4>
                <ul class="loot-display-list">
                    ${renderLootList(foundLoot)}
                </ul>
            </div>

            <h3>Expedition Log (Day ${currentDay})</h3>
            <div class="log-window">
                ${log.map(entry => `<p>${entry}</p>`).join('')}
            </div>
            
            <button id="btn-end-expedition" class="action-btn btn-primary">
                Return to Hub
            </button>
        </div>
    `;

    // --- Montagem Final ---
    return `
        <div class="screen game-screen">
            <div class="page-title-bar">
                <h1>Expedition In Progress: ${currentBiome.name}</h1>
            </div>
            
            <div class="game-container">
                ${column1_Status}
                ${column2_Map}
                ${column3_Log}
            </div>
        </div>
    `;
};
