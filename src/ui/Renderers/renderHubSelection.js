/* ====================================================================
// RENDERER: renderHubSelection.js
// PATH CORRECTION: ../../../database/ and ../../systems/
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';

export const renderHubSelectionScreen = (state) => {
    const kidzData = state.playerKidz || []; 
    const filters = state.hubSelectionFilters;
    let filteredKidz = [...kidzData]; 

    if (filters.searchQuery) {
        filteredKidz = filteredKidz.filter(kid => 
            kid.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
    }
    if (filters.selectedTribes.length > 0) {
        filteredKidz = filteredKidz.filter(kid => 
            filters.selectedTribes.includes(kid.tribe)
        );
    }

    filteredKidz.sort((a, b) => {
        if (filters.sortBy === 'power') {
            const powerA = calculatePowerScore(a.baseStats);
            const powerB = calculatePowerScore(b.baseStats);
            return powerB - powerA;
        }
        return b.level - a.level;
    });

    const totalItems = filteredKidz.length;
    const totalPages = Math.ceil(totalItems / filters.itemsPerPage);
    const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    const paginatedKidz = filteredKidz.slice(startIndex, endIndex);
    
    const kidCardsHTML = paginatedKidz.map(kid => `
        <div class="kid-card panel" data-kid-id="${kid.id}">
            <img src="${kid.spritePath}" alt="${kid.name}">
            <h4>${kid.name} (#${kid.id})</h4>
            <p>Tribe: <strong>${kid.tribe}</strong> | Level: ${kid.level}</p>
            <p>Power: ${calculatePowerScore(kid.baseStats)}</p>
            <button id="btn-select-kid" class="action-btn btn-primary">SELECT AND PREPARE</button>
        </div>
    `).join('');

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
    
    const paginationControlsHTML = `
        <div class="pagination-controls">
            <button id="btn-page-prev" class="action-btn btn-sm" ${filters.currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span>Page ${filters.currentPage} of ${totalPages} (${totalItems} items)</span>
            <button id="btn-page-next" class="action-btn btn-sm" ${filters.currentPage >= totalPages ? 'disabled' : ''}>Next</button>
        </div>
    `;

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
