/* ====================================================================
// (NOVO) RENDERER: renderWorldMap.js
// Renderiza o Mapa Mundi (Global) dentro de um modal.
// Mostra a localização atual do jogador e os biomas vizinhos.
// ==================================================================== */

import { WORLD_BIOMES } from '../../../database/maps/world_map.js';

// Coordenadas visuais aproximadas para os biomas no mapa global (0-100%)
const BIOME_COORDINATES = {
    'BURNING_RIDGE': { x: 20, y: 20 },
    'LAKE_RANCID': { x: 67, y: 18 },
    'ABANDONED_MINES': { x: 35, y: 45 },
    'ANCIENT_METROPOLIS': { x: 17, y: 79 },
    'WASTELAND': { x: 55, y: 70 },
    'COVENANT_SWAMP': { x: 90, y: 45 },
    'CYBERCITY': { x: 50, y: 95 }
};

export const renderWorldMap = (state) => {
    const { expedition } = state;
    
    // Identifica o bioma atual
    const currentBiomeId = expedition.currentMap ? expedition.currentMap.id : 'WASTELAND';
    const currentBiomeData = WORLD_BIOMES[currentBiomeId];

    // Renderiza os pontos dos biomas
    const biomePointsHTML = Object.values(WORLD_BIOMES).map(biome => {
        const coords = BIOME_COORDINATES[biome.id] || { x: 50, y: 50 };
        let statusClass = '';
        let label = biome.name;

        if (biome.id === currentBiomeId) {
            statusClass = 'current-biome';
            label += ' (You)';
        } else if (currentBiomeData && currentBiomeData.neighbors.includes(biome.id)) {
            statusClass = 'neighbor-biome';
        } else {
            statusClass = 'distant-biome';
        }

        return `
            <div class="world-map-point ${statusClass}" 
                 style="top: ${coords.y}%; left: ${coords.x}%;"
                 title="${biome.description}">
                <div class="point-marker"></div>
                <span class="point-label">${label}</span>
            </div>
        `;
    }).join('');

    return `
        <h2>World Map</h2>
        <div class="world-map-container">
            <img src="assets/maps/wasteland_map_full.png" alt="World Map" class="world-map-image">
            <div class="world-map-overlay">
                ${biomePointsHTML}
            </div>
        </div>
        <div class="world-map-footer">
            <p>Current Region: <strong>${currentBiomeData ? currentBiomeData.name : 'Unknown'}</strong></p>
            <p class="hint-text">Travel between biomes requires finding a Transit Point.</p>
        </div>
    `;
};
