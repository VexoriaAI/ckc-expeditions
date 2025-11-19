/* ====================================================================
// RENDERER: renderHubSelection.js
// UPDATE: (Passo 1.1 - Fix Filtros)
// - Transforma o filtro de Tribo em Dropdown simples.
// - Melhora o layout responsivo da toolbar.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';

export const renderHubSelectionScreen = (state) => {
    const kidzData = state.playerKidz || []; 
    
    const filters = state.hubSelectionFilters || {
        searchQuery: '',
        selectedTribes: [],
        sortBy: 'level',
        itemsPerPage: 5,
        currentPage: 1,
    };
    
    // 1. Lógica de Filtro e Ordenação
    let filteredKidz = [...kidzData]; 

    // Search Query
    if (filters.searchQuery) {
        filteredKidz = filteredKidz.filter(kid => 
            kid.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
    }

    // Tribe (Agora Single Select para mobile, mas a lógica suporta array)
    if (filters.selectedTribes && filters.selectedTribes.length > 0 && filters.selectedTribes[0] !== 'all') {
        filteredKidz = filteredKidz.filter(kid => 
            filters.selectedTribes.includes(kid.tribe)
        );
    }

    // Sort
    filteredKidz.sort((a, b) => {
        if (filters.sortBy === 'power') {
            const powerA = calculatePowerScore(a.baseStats);
            const powerB = calculatePowerScore(b.baseStats);
            return powerB - powerA; 
        }
        return b.level - a.level; 
    });

    // 2. Lógica de Paginação
    const totalItems = filteredKidz.length;
    const totalPages = Math.ceil(totalItems / filters.itemsPerPage);
    const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    const paginatedKidz = filteredKidz.slice(startIndex, endIndex);
    
    // 3. Renderização dos Cards
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

    // Helper para verificar seleção
    const currentTribe = filters.selectedTribes[0] || 'all';

    // 4. Renderização dos Controles de Filtro (Responsivo)
    const filterControlsHTML = `
        <div class="filter-toolbar panel">
            <div class="filter-row search-row">
                <input type="text" id="filter-search-name" placeholder="Search by Name or ID..." value="${filters.searchQuery}">
            </div>
            
            <div class="filter-row options-row">
                <select id="filter-tribe">
                    <option value="all" ${currentTribe === 'all' ? 'selected' : ''}>All Tribes</option>
                    <option value="VOLCANICS" ${currentTribe === 'VOLCANICS' ? 'selected' : ''}>Volcanics</option>
                    <option value="NOCTURNALS" ${currentTribe === 'NOCTURNALS' ? 'selected' : ''}>Nocturnals</option>
                    <option value="UNDERGROUNDERS" ${currentTribe === 'UNDERGROUNDERS' ? 'selected' : ''}>Undergrounders</option>
                    <option value="REPTILIANS" ${currentTribe === 'REPTILIANS' ? 'selected' : ''}>Reptilians</option>
                    <option value="RADIOACTIVES" ${currentTribe === 'RADIOACTIVES' ? 'selected' : ''}>Radioactives</option>
                </select>
                
                <select id="filter-sort-by">
                    <option value="level" ${filters.sortBy === 'level' ? 'selected' : ''}>Sort by Level</option>
                    <option value="power" ${filters.sortBy === 'power' ? 'selected' : ''}>Sort by Power</option>
                </select>
                
                <select id="filter-items-per-page">
                    <option value="5" ${filters.itemsPerPage == 5 ? 'selected' : ''}>5 per page</option>
                    <option value="10" ${filters.itemsPerPage == 10 ? 'selected' : ''}>10 per page</option>
                    <option value="20" ${filters.itemsPerPage == 20 ? 'selected' : ''}>20 per page</option>
                </select>

                <button id="btn-filter-reset" class="action-btn btn-secondary btn-sm">RESET</button>
            </div>
        </div>
    `;
    
    const paginationControlsHTML = `
        <div class="pagination-controls">
            <button id="btn-page-prev" class="action-btn btn-sm" ${filters.currentPage === 1 ? 'disabled' : ''}>PREVIOUS</button>
            <span>Page ${filters.currentPage} of ${totalPages} (${totalItems} items)</span>
            <button id="btn-page-next" class="action-btn btn-sm" ${filters.currentPage >= totalPages ? 'disabled' : ''}>NEXT</button>
        </div>
    `;

    return `
        <div class="screen hub-selection-screen hub-container">
            <h2 class="page-title">SELECT YOUR MUTANT KID</h2>
            <p class="page-subtitle">Choose your mutant kid to manage their equipment and start an expedition.</p>
            ${filterControlsHTML}
            <div class="nft-grid">
                ${kidCardsHTML.length > 0 ? kidCardsHTML : '<p>No CyberKidz found.</p>'}
            </div>
            ${paginationControlsHTML}
        </div>
    `;
};
