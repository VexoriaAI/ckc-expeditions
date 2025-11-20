/* ====================================================================
// RENDERER: renderGameScreen.js
// UPDATE: (Fix Final Stats)
// - Exibe a lista completa de atributos no acordeão.
// - Adiciona fallback de segurança para imagem do mapa.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { MAP_NODES, MAP_BIOMES, SPAWN_NODE_ID } from '../../../database/maps.js';
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js'; 

const getKidDataById = (kidId) => MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);

const renderLootList = (loot) => {
    const materials = Object.keys(loot.materials);
    if (materials.length === 0) return '<li>No loot found yet.</li>';
    return materials.map(matId => {
        const itemData = MATERIALS_DB[matId];
        if (!itemData) return '';
        const quantity = loot.materials[matId];
        return `<li class="loot-item"><img src="${itemData.iconPath}"><span>${itemData.name}</span><span class="loot-quantity">x${quantity}</span></li>`;
    }).join('');
};

const renderConsumablesList = (state) => {
    const shopItems = state.playerInventory.shopItems; 
    const keys = Object.keys(shopItems);
    if (keys.length === 0) return '<li>No consumables.</li>';
    return keys.map(itemId => {
        const itemData = SHOP_ITEMS_DB[itemId];
        const quantity = shopItems[itemId];
        if (!itemData) return '';
        const useButton = (itemId === 'ap_refill') ? `<button id="btn-use-consumable" data-item-id="${itemId}" class="action-btn btn-xs btn-info">USE</button>` : '';
        return `<li class="consumable-item"><img src="${itemData.iconPath}"><div class="consumable-details"><span>${itemData.name} (x${quantity})</span></div>${useButton}</li>`;
    }).join('');
};

const renderMapNodes = (state) => {
    const { expedition } = state;
    if (!expedition || !expedition.position || !expedition.position.nodeId) return '';
    const currentNodeId = expedition.position.nodeId; 
    const currentNode = MAP_NODES.find(n => n.id === currentNodeId);
    const reachableNodes = currentNode ? currentNode.connections : [];
    const NODE_ICONS = { 'START':'🏠', 'RESOURCE':'⛏️', 'COMBAT':'⚔️', 'EVENT':'❔', 'TRANSIT':'🚪' };

    return MAP_NODES.map(node => {
        const biome = MAP_BIOMES[node.biome];
        let statusClass = 'locked'; 
        let icon = NODE_ICONS[node.type] || '●';
        if (node.id === currentNodeId) { statusClass = 'current'; icon = '📍'; } 
        else if (reachableNodes.includes(node.id)) { statusClass = 'reachable'; }
        
        return `<div class="map-node ${statusClass}" id="btn-move-node" data-node-id="${node.id}" style="top: ${node.y}%; left: ${node.x}%;" title="${node.name} (${node.type})"><div class="node-icon">${icon}</div></div>`;
    }).join('');
};

export const renderGameScreen = (state) => {
    const { expedition, currentPlayerKidId, uiState } = state;
    
    if (!expedition || !expedition.position) return `<div class="screen game-screen"><h2>Loading...</h2></div>`;
    const kidStaticData = getKidDataById(currentPlayerKidId);
    if (!kidStaticData) return `<div class="screen game-screen"><h2>Error: Kid Data not found.</h2></div>`;

    const { kidStats, currentHP, maxHP, currentAP, maxAP, currentMP, maxMP, currentDay, maxDays, log, position, foundLoot } = expedition;
    
    // Mapa
    const targetNodeId = position.nodeId || SPAWN_NODE_ID;
    const currentNode = MAP_NODES.find(n => n.id === targetNodeId) || MAP_NODES[0];
    const currentBiome = MAP_BIOMES[currentNode.biome];
    
    const totalPowerScore = calculatePowerScore(kidStats);
    const hpPercent = (currentHP / maxHP) * 100;
    let hpColorClass = 'hp-fill-green'; 
    if (hpPercent < 40) hpColorClass = 'hp-fill-orange'; 
    if (hpPercent < 20) hpColorClass = 'hp-fill-red';    

    const isStatsOpen = uiState.isStatsAccordionOpen || false;
    const accordionArrow = isStatsOpen ? '▼' : '▶';
    const accordionContentStyle = isStatsOpen ? 'display: block;' : 'display: none;';

    const column1_Status = `
        <div class="game-column panel" id="game-col-status">
            <div class="kid-info-box">
                <div class="kid-image"><img src="${kidStaticData.spritePath}"></div>
                <div class="kid-details">
                    <h4>${kidStaticData.name}</h4>
                    <p>Tribe: <span>${kidStaticData.tribe}</span></p>
                    <div class="kid-card-stats game-screen-stats">
                        <div class="stat-badge level-badge">Lvl: <span>${kidStaticData.level}</span></div>
                        <div class="stat-badge power-badge">PWR: <span>${totalPowerScore}</span></div>
                    </div>
                </div>
            </div>
            <div class="status-bars">
                <div class="stat-bar"><span class="stat-label">HP</span><div class="bar-track"><div class="bar-fill ${hpColorClass}" style="width: ${hpPercent}%"></div></div><span class="stat-value">${currentHP}/${maxHP}</span></div>
            </div>
            <div class="expedition-stats-accordion">
                <div class="accordion-header" id="btn-toggle-stats"><h4>Final Stats</h4><span class="accordion-arrow">${accordionArrow}</span></div>
                <div class="accordion-content" style="${accordionContentStyle}">
                    <ul class="stats-list-grid">
                        <li>Attack: <span>${kidStats.attack}</span></li>
                        <li>Defense: <span>${kidStats.defense}</span></li>
                        <li>Speed: <span>${kidStats.speed}</span></li>
                        <li>Crit Chance: <span>${kidStats.critChance}%</span></li>
                        <li>Crit Dmg: <span>+${kidStats.critDamage}%</span></li>
                        <li>Atk Speed: <span>+${kidStats.attackSpeed}%</span></li>
                        <li>Block: <span>${kidStats.blockChance}%</span></li>
                        <li>Dodge: <span>${kidStats.dodgeChance}%</span></li>
                        <li>Lifesteal: <span>${kidStats.lifesteal}%</span></li>
                        <li>Thorns: <span>${kidStats.thorns}</span></li>
                        <li>Fire Res: <span>${kidStats.fireResist}%</span></li>
                        <li>Toxin Res: <span>${kidStats.toxinResist}%</span></li>
                    </ul>
                </div>
            </div>
            <div class="consumables-display"><h4>Consumables</h4><ul class="consumables-display-list">${renderConsumablesList(state)}</ul></div>
        </div>
    `;

    const column2_Map = `
        <div class="game-column" id="game-col-map">
            <div class="map-container panel">
                <img src="assets/maps/wasteland_map_full.png" alt="Wasteland Map" class="map-background-image">
                <div class="map-nodes-overlay">${renderMapNodes(state)}</div>
                <button id="btn-open-world-map" class="action-btn btn-xs btn-secondary" style="position: absolute; top: 10px; right: 10px; width: auto; z-index: 20;">World Map 🌍</button>
            </div>
            <div class="action-points-bar panel">
                <div class="stat-bar"><span class="stat-label">AP</span><div class="bar-track"><div class="bar-fill ap-fill" style="width: ${(currentAP / maxAP) * 100}%"></div></div><span class="stat-value">${currentAP}/${maxAP}</span></div>
                <div class="stat-bar"><span class="stat-label">MP</span><div class="bar-track"><div class="bar-fill mp-fill" style="width: ${(currentMP / maxMP) * 100}%"></div></div><span class="stat-value">${currentMP}/${maxMP}</span></div>
            </div>
            <div class="action-bar panel">
                <button id="btn-action-collect" class="action-btn btn-success" ${currentAP < 1 ? 'disabled' : ''}>Collect (1 AP)</button>
                <button id="btn-action-investigate" class="action-btn btn-info" ${currentAP < 1 ? 'disabled' : ''}>Investigate (1 AP)</button>
                <button id="btn-action-search" class="action-btn btn-primary" ${currentAP < 2 ? 'disabled' : ''}>Search Enemy (2 AP)</button>
                <button id="btn-action-end-day" class="action-btn btn-secondary">End Day (${currentDay}/${maxDays})</button>
            </div>
        </div>
    `;

    const column3_Log = `
        <div class="game-column panel" id="game-col-log">
            <div class="loot-display"><h4>Loot Found</h4><ul class="loot-display-list">${renderLootList(foundLoot)}</ul></div>
            <h3>Log (Day ${currentDay})</h3>
            <div class="log-window">${log.map(entry => `<p>${entry}</p>`).join('')}</div>
            <div class="skip-animations-toggle"><input type="checkbox" id="chk-skip-animations" ${uiState.skipAnimations ? 'checked' : ''}><label for="chk-skip-animations">Skip Modals</label></div>
            <button id="btn-end-expedition" class="action-btn btn-primary">End Expedition</button>
        </div>
    `;

    return `
        <div class="screen game-screen">
            <div class="page-title-bar"><h1>Expedition In Progress: ${currentNode.name} (${currentBiome.name})</h1></div>
            <div class="game-container">${column1_Status}${column2_Map}${column3_Log}</div>
        </div>
    `;
};
