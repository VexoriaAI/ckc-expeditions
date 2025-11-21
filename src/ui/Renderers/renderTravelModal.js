/* ====================================================================
// (NOVO) RENDERER: renderTravelModal.js
// Renderiza o modal de confirmação de viagem entre biomas.
// ==================================================================== */

import { WORLD_BIOMES } from '../../../database/maps/world_map.js';

export const renderTravelModal = (modalData) => {
    const { targetBiomeId, currentMp } = modalData;
    const biomeData = WORLD_BIOMES[targetBiomeId];
    
    if (!biomeData) return '<h2>Error: Biome Data Not Found</h2>';

    const travelCost = 2;
    const canTravel = currentMp >= travelCost;
    const btnClass = canTravel ? 'btn-success' : 'disabled';
    const btnAttr = canTravel ? '' : 'disabled';
    const costColor = canTravel ? 'var(--color-accent-green)' : 'var(--color-accent-red)';

    // Tenta carregar imagem do bioma ou usa placeholder
    const bgImage = `assets/maps/${targetBiomeId}.png`; 

    return `
        <h2>Travel to ${biomeData.name}?</h2>
        
        <div class="travel-modal-content">
            <div class="travel-image-container">
                <img src="${bgImage}" onerror="this.src='assets/maps/wasteland_map_full.png'" class="travel-biome-image">
                <div class="travel-overlay-text">DIFFICULTY TIER: ${biomeData.difficultyTier}</div>
            </div>
            
            <div class="travel-info panel">
                <p>${biomeData.description}</p>
                <div class="travel-cost">
                    Travel Cost: <span style="color: ${costColor}">${travelCost} MP</span> (You have ${currentMp})
                </div>
                <p class="travel-warning">
                    WARNING: A new map will be generated. Current node progress will be reset.
                </p>
            </div>
        </div>

        <div class="modal-actions">
            <button id="btn-modal-close" class="action-btn btn-secondary">CANCEL</button>
            <button 
                id="btn-confirm-travel" 
                data-target-biome="${targetBiomeId}"
                class="action-btn ${btnClass}" 
                ${btnAttr}
            >
                CONFIRM TRAVEL
            </button>
        </div>
    `;
};
