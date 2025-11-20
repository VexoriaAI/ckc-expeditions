/* ====================================================================
// RENDERER: renderGameScreen.js
// UPDATE: (Fase 4.0 - Passo 3.2)
// - Renderiza o mapa dinâmico lendo 'state.expedition.currentMap'.
// - Remove dependências de arquivos estáticos de mapa antigos.
// - Adiciona ícones visuais para tipos de nós (⚔️, ⛏️, 🚪).
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js'; 

const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

const renderLootList = (loot) => {
    const materials = Object.keys(loot.materials);
    if (materials.length === 0) {
        return '<li>No loot found yet.</li>';
    }
    
    return materials.map(matId => {
        const itemData = MATERIALS_DB[matId];
        // Proteção caso o item não exista no DB
        if (!itemData) return ''; 
        
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

const renderConsumablesList = (state) => {
    const shopItems = state.playerInventory.shopItems; 
    const keys = Object.keys(shopItems);
    
    if (keys.length === 0) {
        return '<li>No consumables available.</li>';
    }

    return keys.map(itemId => {
        const itemData = SHOP_ITEMS_DB[itemId];
        const quantity = shopItems[itemId];
        if (!itemData) return '';
        
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
 * (ATUALIZADO) Renderiza os Nós do Mapa Dinâmico
 * Lê diretamente de state.expedition.currentMap
 */
const renderMapNodes = (state) => {
    const { expedition } = state;
    
    // Proteção Crítica: Se não houver mapa gerado, não renderiza nós
    if (!expedition || !expedition.currentMap || !expedition.position) return '';

    const currentMap = expedition.currentMap;
    const currentNodeId = expedition.position.nodeId; 
    
    // Encontra o nó atual no mapa dinâmico
    const currentNode = currentMap.nodes.find(n => n.id === currentNodeId);
    const reachableNodes = currentNode ? currentNode.connections : [];

    // Ícones por tipo de nó
    const NODE_ICONS = {
        'START': '🏠',
        'RESOURCE': '⛏️',
        'COMBAT': '⚔️',
        'EVENT': '❔',
        'TRANSIT': '🚪'
    };

    return currentMap.nodes.map(node => {
        let statusClass = 'locked'; // Padrão
        let nodeTypeClass = `node-type-${node.type.toLowerCase()}`;
        let icon = NODE_ICONS[node.type] || '●';

        if (node.id === currentNodeId) {
            statusClass = 'current';
            icon = '📍'; // Ícone especial para "Você está aqui"
        } else if (reachableNodes.includes(node.id)) {
            statusClass = 'reachable';
        }

        // Tooltip com Nome e Tipo
        const title = `${node.name} (${node.type})`;

        return `
            <div 
                class="map-node ${statusClass} ${nodeTypeClass}" 
                id="btn-move-node"
                data-node-id="${node.id}"
                style="top: ${node.y}%; left: ${node.x}%;"
                title="${title}"
            >
                <div class="node-icon">${icon}</div>
            </div>
        `;
    }).join('');
};


export const renderGameScreen = (state) => {
    const { expedition, currentPlayerKidId, uiState } = state;
    
    // Verificações de segurança
    if (!expedition) return `<div class="screen game-screen"><h2>Loading...</h2></div>`;
    
    // Se o mapa ainda não foi gerado (ex: bug no start), avisa
    if (!expedition.currentMap) {
         return `<div class="screen game-screen"><h2>Map Generation Error. Please restart expedition.</h2></div>`;
    }

    const kidStaticData = getKidDataById(currentPlayerKidId);
    if (!kidStaticData) return `<div class="screen game-screen"><h2>Kid Data Error.</h2></div>`;

    const { kidStats, currentHP, maxHP, currentAP, maxAP, currentMP, maxMP, currentDay, maxDays, log, position, foundLoot, currentMap } = expedition;
    
    // Encontra dados do nó atual para o título
    const currentNode = currentMap.nodes.find(n => n.id === position.nodeId);
    const locationName = currentNode ? currentNode.name : "Unknown Location";
    const biomeName = currentMap.name;

    const totalPowerScore = calculatePowerScore(kidStats);
    
    const hpPercent = (currentHP / maxHP) * 100;
    let hpColorClass = 'hp-fill-green'; 
    if (hpPercent < 40) hpColorClass = 'hp-fill-orange'; 
    if (hpPercent < 20) hpColorClass = 'hp-fill-red';    

    const isStatsOpen = uiState.isStatsAccordionOpen || false;
    const accordionArrow = isStatsOpen ? '▼' : '▶';
    const accordionContentStyle = isStatsOpen ? 'display: block;' : 'display: none;';

    // --- Coluna 1: Status do Kid ---
    const column1_Status = `
        <div class="game-column panel" id="game-col-status">
            <div class="kid-info-box panel">
                <div class="kid-image"><img src="${kidStaticData.spritePath}" alt="${kidStaticData.name}"></div>
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
                <div class="stat-bar">
                    <span class="stat-label">HP</span>
                    <div class="bar-track">
                        <div class="bar-fill ${hpColorClass}" style="width: ${hpPercent}%"></div>
                    </div>
                    <span class="stat-value">${currentHP}/${maxHP}</span>
                </div>
            </div>

            <div class="expedition-stats-accordion panel">
                <div class="accordion-header" id="btn-toggle-stats">
                    <h4>Final Stats</h4>
                    <span class="accordion-arrow">${accordionArrow}</span>
                </div>
                <div class="accordion-content" style="${accordionContentStyle}">
                    <ul class="stats-list-grid">
                        <li>Attack: <span>${kidStats.attack}</span></li>
                        <li>Defense: <span>${kidStats.defense}</span></li>
                        <li>Speed: <span>${kidStats.speed}</span></li>
                        <li>Crit Chance: <span>${kidStats.critChance}%</span></li>
                        <li>Block: <span>${kidStats.blockChance}%</span></li>
                        <li>Dodge: <span>${kidStats.dodgeChance}%</span></li>
                    </ul>
                </div>
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
                <img src="assets/maps/wasteland_map_full.png" alt="Map Background" class="map-background-image">
                
                <div class="map-nodes-overlay">
                    ${renderMapNodes(state)}
                </div>
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
                <button id="btn-action-collect" class="action-btn btn-success" ${currentAP < 1 ? 'disabled' : ''}>Collect (1 AP)</button>
                <button id="btn-action-investigate" class="action-btn btn-info" ${currentAP < 1 ? 'disabled' : ''}>Investigate (1 AP)</button>
                <button id="btn-action-search" class="action-btn btn-primary" ${currentAP < 2 ? 'disabled' : ''}>Search Enemy (2 AP)</button>
                <button id="btn-action-end-day" class="action-btn btn-secondary">End Day (${currentDay}/${maxDays})</button>
            </div>
        </div>
    `;

    // --- Coluna 3: Log e Saída ---
    const column3_Log = `
        <div class="game-column panel" id="game-col-log">
            <div class="loot-display panel">
                <h4>Loot Found</h4>
                <ul class="loot-display-list">
                    ${renderLootList(foundLoot)}
                </ul>
            </div>

            <h3>Log (Day ${currentDay})</h3>
            <div class="log-window">
                ${log.map(entry => `<p>${entry}</p>`).join('')}
            </div>
            
            <div class="skip-animations-toggle">
                <input type="checkbox" id="chk-skip-animations" ${uiState.skipAnimations ? 'checked' : ''}>
                <label for="chk-skip-animations">Skip Modals</label>
            </div>
            
            <button id="btn-end-expedition" class="action-btn btn-primary">End Expedition</button>
        </div>
    `;

    return `
        <div class="screen game-screen">
            <div class="page-title-bar">
                <h1>${biomeName}: ${locationName}</h1>
            </div>
            <div class="game-container">
                ${column1_Status}
                ${column2_Map}
                ${column3_Log}
            </div>
        </div>
    `;
};
