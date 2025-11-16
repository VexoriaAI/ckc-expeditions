/* ====================================================================
// (NOVO) RENDERER: renderRankingScreen.js
// Renderiza a página de Ranking (Leaderboards) com abas.
// ==================================================================== */

import { RANKING_FORGEMASTERS, RANKING_EXPLORERS, RANKING_SENTINELS } from '../../../database/rankings.js';
import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js'; // Para a seção "My NFTs"

/**
 * Renderiza uma única lista de ranking (Top 10).
 * @param {Array<object>} rankingData - O array de dados (ex: RANKING_FORGEMASTERS).
 * @returns {string} HTML para a tabela de ranking.
 */
const renderRankingList = (rankingData) => {
    return rankingData.map(entry => {
        // Aplica classes de destaque para o Top 3
        let rankClass = 'rank-entry';
        if (entry.rank === 1) rankClass += ' rank-1';
        if (entry.rank === 2) rankClass += ' rank-2';
        if (entry.rank === 3) rankClass += ' rank-3';

        return `
            <div class="${rankClass}">
                <span class="rank-position">#${entry.rank}</span>
                <span class="rank-player">${entry.playerName}</span>
                <span class="rank-score">${entry.score.toLocaleString()}</span>
                <span class="rank-wallet">${entry.walletAddress}</span>
            </div>
        `;
    }).join('');
};

/**
 * Renderiza a seção "My NFTs" na tela de ranking.
 * @param {object} state - O GameState completo.
 * @returns {string} HTML para a seção.
 */
const renderMyNFTsRanking = (state) => {
    const myKidz = state.playerKidz || [];
    
    // (Simulação de busca da posição do jogador no ranking)
    const myForgemasterRank = RANKING_FORGEMASTERS.find(e => e.walletAddress === 'CKID-DEMO-001')?.rank || 'N/A';
    const myExplorerRank = RANKING_EXPLORERS.find(e => e.walletAddress === 'CKID-DEMO-001')?.rank || 'N/A';
    
    const kidCardsHTML = myKidz.map(kid => `
        <div class="my-nft-rank-card panel">
            <img src="${kid.spritePath}" alt="${kid.name}">
            <div class="my-nft-details">
                <h4>${kid.name} (#${kid.id})</h4>
                <ul>
                    <li>Forgemaster Rank: <strong>#${myForgemasterRank}</strong></li>
                    <li>Explorer Rank: <strong>#${myExplorerRank}</strong></li>
                    <li>Sentinel Rank: <strong>N/A</strong></li>
                </ul>
                <div class="my-nft-actions">
                    <button class="action-btn btn-sm btn-secondary" id="btn-share-nft">Share</button>
                    <button class="action-btn btn-sm btn-success" id="btn-sell-nft">Sell (Soon)</button>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="ranking-section panel">
            <h3>My NFT Rankings</h3>
            <div class="my-nft-grid">
                ${myKidz.length > 0 ? kidCardsHTML : '<p>You have no CyberKidz in your wallet.</p>'}
            </div>
        </div>
    `;
};


/**
 * Renderiza a tela principal de Ranking.
 * @param {object} state - O GameState completo.
 * @returns {string} HTML para a tela de Ranking.
 */
export const renderRankingScreen = (state) => {
    
    // (Futuro: Ler a aba ativa do GameState)
    const activeRankingTab = 'forgemasters'; 
    let rankingContentHTML = '';

    // Define qual lista de ranking exibir
    if (activeRankingTab === 'forgemasters') {
        rankingContentHTML = renderRankingList(RANKING_FORGEMASTERS);
    } else if (activeRankingTab === 'explorers') {
        rankingContentHTML = renderRankingList(RANKING_EXPLORERS);
    } else if (activeRankingTab === 'sentinels') {
        rankingContentHTML = renderRankingList(RANKING_SENTINELS);
    }

    // Renderiza a seção "My NFTs"
    const myNFTsHTML = renderMyNFTsRanking(state);

    // --- Montagem Final da Tela ---
    return `
        <div class="screen ranking-screen">
            
            <div class="page-title-bar">
                <h1>Leaderboards</h1>
                <button id="btn-back-to-hub" class="action-btn btn-secondary btn-sm">Back to Hub</button>
            </div>

            <div class="ranking-section panel">
                <div class="tabs" id="ranking-tabs">
                    <button class="tab-btn ${activeRankingTab === 'forgemasters' ? 'active' : ''}" data-tab="forgemasters">Wasteland Forgemasters</button>
                    <button class="tab-btn ${activeRankingTab === 'explorers' ? 'active' : ''}" data-tab="explorers">Legendary Explorers</button>
                    <button class="tab-btn ${activeRankingTab === 'sentinels' ? 'active' : ''}" data-tab="sentinels">AI Sentinels</button>
                </div>
                
                <div class="ranking-list-header">
                    <span>Rank</span>
                    <span>Player</span>
                    <span>Score</span>
                    <span>Wallet</span>
                </div>
                <div class="ranking-list-content">
                    ${rankingContentHTML}
                </div>
            </div>
            
            ${myNFTsHTML}

        </div>
    `;
};
