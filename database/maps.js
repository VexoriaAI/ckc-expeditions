/* ====================================================================
// (NOVO) DATABASE: MAPS
// Define os biomas e a estrutura do grid para o mapa de expedição.
// ==================================================================== */

/**
 * Define os biomas (regiões) do mapa.
 * Os IDs (ex: 'WASTELAND') são usados para linkar com drops e inimigos.
 */
export const MAP_BIOMES = {
    'WASTELAND': { 
        name: 'Wasteland', 
        description: 'The barren plains outside CyberCity.' 
    },
    'BURNING_RIDGE': { 
        name: 'Burning Ridge', 
        description: 'Volcanic peaks, home of the Volcanics.' 
    },
    'LAKE_RANCID': { 
        name: 'Lake Rancid', 
        description: 'Toxic waters, home of the Radioactives.' 
    },
    'COVENANT_SWAMP': { 
        name: 'Covenant Swamp', 
        description: 'Dense, humid jungles, home of the Reptilians.' 
    },
    'ABANDONED_MINES': { 
        name: 'Abandoned Mines', 
        description: 'Deep tunnels, home of the Undergrounders.' 
    },
    'ANCIENT_RUINS': { 
        name: 'Ancient Ruins', 
        description: 'Shadowy remains of a metropolis, home of the Nocturnals.' 
    },
    'CYBERCITY': {
        name: 'CyberCity',
        description: 'The last bastion of the old world. (Inaccessible)'
    }
};

/**
 * (GDD: V, VI)
 * Define os dados estáticos do mapa (layout do grid).
 * Usamos um grid 2D simples para o protótipo.
 * Cada célula (hexágono) é um objeto com sua posição (q, r) e seu bioma.
 */
export const STATIC_MAP_DATA = [
    // Linha 0
    { q: 0, r: 0, biome: 'BURNING_RIDGE' },
    { q: 1, r: 0, biome: 'BURNING_RIDGE' },
    { q: 2, r: 0, biome: 'LAKE_RANCID' },
    { q: 3, r: 0, biome: 'LAKE_RANCID' },
    { q: 4, r: 0, biome: 'COVENANT_SWAMP' },
    
    // Linha 1
    { q: 0, r: 1, biome: 'BURNING_RIDGE' },
    { q: 1, r: 1, biome: 'ABANDONED_MINES' },
    { q: 2, r: 1, biome: 'LAKE_RANCID' }, // (Dead Lake no GDD, parte do Lake Rancid)
    { q: 3, r: 1, biome: 'WASTELAND' },
    { q: 4, r: 1, biome: 'COVENANT_SWAMP' },
    
    // Linha 2
    { q: 0, r: 2, biome: 'ANCIENT_RUINS' },
    { q: 1, r: 2, biome: 'ABANDONED_MINES' },
    { q: 2, r: 2, biome: 'WASTELAND' },
    { q: 3, r: 2, biome: 'WASTELAND' },
    { q: 4, r: 2, biome: 'COVENANT_SWAMP' },
    
    // Linha 3
    { q: 0, r: 3, biome: 'ANCIENT_RUINS' },
    { q: 1, r: 3, biome: 'ANCIENT_RUINS' },
    { q: 2, r: 3, biome: 'WASTELAND' },
    { q: 3, r: 3, biome: 'CYBERCITY' },
    { q: 4, r: 3, biome: 'WASTELAND' },
];
