/* ====================================================================
// RENDERER: renderHubSelection.js
// UPDATE: Reorganiza o layout do Kid Card (Nome, ID, Stats, Tribe)
// e adiciona o link externo para o Objkt.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';

/**
 * Renders the Hub Selection screen (Kid NFT grid, filters, pagination).
 * @param {object} state - The current GameState.
 * @returns {string} HTML content for the screen.
 */
export const renderHubSelectionScreen = (state) => {
    const kidzData = state.playerKidz || []; 
    const filters = state.hubSelectionFilters;
    
    // 1. Lógica de Filtro e Ordenação
    let filteredKidz = [...kidzData]; 

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
            
            <a href="https://objkt.com/collections/cyberkidzclub_btd" target="_blank" class="kid-card-link" title="View on Objkt.com">
                <img src="assets/ui/icon_external_link.png" alt="External Link">
            </a>

            <img src="${kid.spritePath}" alt="${kid.name}" class="kid-card-image">
            
            <div class="kid-card-content">
                <h4>${kid.name}</h4>
                <p class="kid-card-id">ID: ${kid.id}</p>
                
                <div class="kid-card-stats">
                    <div class="stat-badge level-badge">
                        Level: <span>${kid.level}</span>
                    </div>
                    <div class="stat-badge power-badge">
                        Power: <span>${calculatePowerScore(kid.baseStats)}</span>
                    </div>
                </div>
                
                <p class="kid-card-tribe">Tribe: <strong>${kid.tribe}</strong></p>
            </div>
            
            <button id="btn-select-kid" class="action-btn btn-primary">SELECT AND PREPARE</button>
        </div>
    `).join('');

    // 4. Renderização dos Controles de Filtro
    const filterControlsHTML = `
        <div class="filter-toolbar">
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
                <option value="10" ${filters.itemsPerPage == 10 ? 'selected' : ''}>10 per page</option>
                <option value="20" ${filters.itemsPerPage == 20 ? 'selected' : ''}>20 per page</option>
                <option value="50" ${filters.itemsPerPage == 50 ? 'selected' : ''}>50 per page</option>
            </select>
            
            <button id="btn-filter-reset" class="action-btn btn-secondary btn-sm">Reset</button>
        </div>
    `;
    
    // 5. Renderização dos Controles de Paginação
    const paginationControlsHTML = `
        <div class="pagination-controls">
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
};
