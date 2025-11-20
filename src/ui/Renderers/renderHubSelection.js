/* ====================================================================
// RENDERER: renderHubSelection.js
// UPDATE: (Fase 3.0 - Fix Filtros V2 - Blindagem)
// - Adiciona valores padrão para evitar crashes (reading '0', undefined).
// - Garante que o filtro de Tribo funcione com array vazio ou string.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; 
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';

export const renderHubSelectionScreen = (state) => {
    const kidzData = state.playerKidz || []; 
    
    // (CORREÇÃO) Garante que o objeto filters e suas propriedades existam
    const filters = state.hubSelectionFilters || {};
    const searchQuery = filters.searchQuery || '';
    const selectedTribes = filters.selectedTribes || []; // Garante array
    const sortBy = filters.sortBy || 'level';
    const itemsPerPage = filters.itemsPerPage || 5;
    const currentPage = filters.currentPage || 1;
    
    // 1. Lógica de Filtro e Ordenação
    let filteredKidz = [...kidzData]; 

    // Search Query
    if (searchQuery) {
        filteredKidz = filteredKidz.filter(kid => 
            kid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(kid.id).toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Tribe (Lógica robusta: se tiver tribos selecionadas e não for 'all')
    if (selectedTribes.length > 0 && selectedTribes[0] !== 'all') {
        filteredKidz = filteredKidz.filter(kid => 
            selectedTribes.includes(kid.tribe)
        );
    }

    // Sort
    filteredKidz.sort((a, b) => {
        if (sortBy === 'power') {
            const powerA = calculatePowerScore(a.baseStats);
            const powerB = calculatePowerScore(b.baseStats);
            return powerB - powerA; 
        }
        // Default: 'level'
        return b.level - a.level; 
    });

    // 2. Lógica de Paginação
    const totalItems = filteredKidz.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
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
                    <div class="stat-badge level-badge">Level: <span>${kid.level}</span></div>
                    <div class="stat-badge power-badge">Power: <span>${calculatePowerScore(kid.baseStats)}</span></div>
                </div>
                <p class="kid-card-tribe">Tribe: <strong>${kid.tribe}</strong></p>
            </div>
            
            <button id="btn-select-kid" class="action-btn btn-primary">SELECT AND PREPARE</button>
        </div>
    `).join('');

    // Helper para verificar seleção (CORREÇÃO: Evita erro de índice)
    const currentTribe = (selectedTribes.length > 0) ? selectedTribes[0] : 'all';

    // 4. Renderização dos Controles de Filtro
    const filterControlsHTML = `
        <div class="filter-toolbar panel">
            <div class="filter-row search-row">
                <input type="text" id="filter-search-name" placeholder="Search by Name or ID..." value="${searchQuery}">
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
                    <option value="level" ${sortBy === 'level' ? 'selected' : ''}>Sort by Level</option>
                    <option value="power" ${sortBy === 'power' ? 'selected' : ''}>Sort by Power</option>
                </select>
                
                <select id="filter-items-per-page">
                    <option value="5" ${itemsPerPage == 5 ? 'selected' : ''}>5 per page</option>
                    <option value="10" ${itemsPerPage == 10 ? 'selected' : ''}>10 per page</option>
                    <option value="20" ${itemsPerPage == 20 ? 'selected' : ''}>20 per page</option>
                </select>

                <button id="btn-filter-reset" class="action-btn btn-secondary btn-sm">RESET</button>
            </div>
        </div>
    `;
    
    const paginationControlsHTML = `
        <div class="pagination-controls">
            <button id="btn-page-prev" class="action-btn btn-sm" ${currentPage === 1 ? 'disabled' : ''}>PREVIOUS</button>
            <span>Page ${currentPage} of ${totalPages} (${totalItems} items)</span>
            <button id="btn-page-next" class="action-btn btn-sm" ${currentPage >= totalPages ? 'disabled' : ''}>NEXT</button>
        </div>
    `;

    return `
        <div class="screen hub-selection-screen hub-container">
            <h2 class="page-title">SELECT YOUR MUTANT KID</h2>
            <p class="page-subtitle">Choose your mutant kid to manage their equipment and start an expedition.</p>
            ${filterControlsHTML}
            <div class="nft-grid">
                ${kidCardsHTML.length > 0 ? kidCardsHTML : '<p>No CyberKidz found matching filters.</p>'}
            </div>
            ${paginationControlsHTML}
        </div>
    `;
};
