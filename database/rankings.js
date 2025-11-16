/* ====================================================================
// (NOVO) DATABASE: RANKINGS
// Contém os dados simulados (mock) para as tabelas de 
// classificação (Leaderboards).
// Language: English
// ==================================================================== */

/**
 * Estrutura de dados para uma entrada no ranking.
 * @typedef {object} RankingEntry
 * @property {number} rank - A posição (1, 2, 3...)
 * @property {string} playerName - Nome do jogador (ou Kid).
 * @property {string} walletAddress - Endereço da carteira (para Web3).
 * @property {number} score - A pontuação na categoria.
 */

// Categoria 1: Poder Econômico (Soma do Power Score de todos os itens)
export const RANKING_FORGEMASTERS = [
    { rank: 1, playerName: "Hephaestus", walletAddress: "tz1...aBc", score: 85200 },
    { rank: 2, playerName: "Vulcan", walletAddress: "tz1...dEf", score: 79100 },
    { rank: 3, playerName: "Goblin King", walletAddress: "tz1...gHi", score: 75000 },
    { rank: 4, playerName: "ScrapLord", walletAddress: "tz1...jKl", score: 68000 },
    { rank: 5, playerName: "T3-RR0R", walletAddress: "tz1...mNo", score: 65000 },
    { rank: 6, playerName: "Rust", walletAddress: "tz1...pQr", score: 50000 },
    { rank: 7, playerName: "Player 007", walletAddress: "tz1...sTu", score: 45000 },
    { rank: 8, playerName: "Cypher (Protótipo)", walletAddress: "CKID-DEMO-001", score: 40000 }, // Jogador local
    { rank: 9, playerName: "GearHead", walletAddress: "tz1...vWx", score: 30000 },
    { rank: 10, playerName: "Newbie", walletAddress: "tz1...yZ", score: 25000 },
];

// Categoria 2: Atividade de Jogo (Total de Materiais Raros T3+ coletados)
export const RANKING_EXPLORERS = [
    { rank: 1, playerName: "WastelandWanderer", walletAddress: "tz1...bCd", score: 15020 },
    { rank: 2, playerName: "Pathfinder", walletAddress: "tz1...eFg", score: 12500 },
    { rank: 3, playerName: "Scavenger", walletAddress: "tz1...hIj", score: 11000 },
    { rank: 4, playerName: "Rust", walletAddress: "tz1...pQr", score: 10500 },
    { rank: 5, playerName: "Nomad", walletAddress: "tz1...kLm", score: 9000 },
    { rank: 6, playerName: "Looky", walletAddress: "tz1...nOp", score: 8500 },
    { rank: 7, playerName: "Hephaestus", walletAddress: "tz1...aBc", score: 7000 },
    { rank: 8, playerName: "GearHead", walletAddress: "tz1...vWx", score: 5000 },
    { rank: 9, playerName: "Cypher (Protótipo)", walletAddress: "CKID-DEMO-001", score: 4200 }, // Jogador local
    { rank: 10, playerName: "Vulk (Forja)", walletAddress: "CKID-DEMO-002", score: 3000 }, // Jogador local
];

// Categoria 3: Engajamento Web3 (NFTs Míticos criados na AI Forge)
export const RANKING_SENTINELS = [
    { rank: 1, playerName: "The Architect", walletAddress: "tz1...cDe", score: 12 },
    { rank: 2, playerName: "Hephaestus", walletAddress: "tz1...aBc", score: 9 },
    { rank: 3, playerName: "AI-Whale", walletAddress: "tz1...fGh", score: 7 },
    { rank: 4, playerName: "MythicCrafter", walletAddress: "tz1...iJk", score: 5 },
    { rank: 5, playerName: "Player 007", walletAddress: "tz1...sTu", score: 3 },
    { rank: 6, playerName: "Vulcan", walletAddress: "tz1...dEf", score: 2 },
    { rank: 7, playerName: "Nomad", walletAddress: "tz1...kLm", score: 1 },
    { rank: 8, playerName: "ScrapLord", walletAddress: "tz1...jKl", score: 1 },
    { rank: 9, playerName: "Goblin King", walletAddress: "tz1...gHi", score: 1 },
    { rank: 10, playerName: "Cypher (Protótipo)", walletAddress: "CKID-DEMO-001", score: 0 }, // Jogador local
];
