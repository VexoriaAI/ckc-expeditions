/* ====================================================================
// DATABASE: maps.js
// UPDATE: (Refatoração de Mapa - Node-Based)
// Define os BIOMAS e os NÓS do mapa, com suas coordenadas e conexões.
// ==================================================================== */

// --- 1. Definições de Biomas ---
// Estes biomas são usados para lógica de drops, inimigos, etc.
export const MAP_BIOMES = {
    WASTELAND: {
        id: 'WASTELAND',
        name: 'Wasteland',
        description: 'Um deserto árido e perigoso.',
        color: '#a0522d' // Sienna
    },
    RUINS: {
        id: 'RUINS',
        name: 'Ruínas da Cidade',
        description: 'Os destroços de uma antiga metrópole.',
        color: '#696969' // DimGray
    },
    BURNING_RIDGE: {
        id: 'BURNING_RIDGE',
        name: 'Cordilheira Ardente',
        description: 'Montanhas vulcânicas com fluxos de lava.',
        color: '#b22222' // FireBrick
    },
    SWAMP: {
        id: 'SWAMP',
        name: 'Pântano Contaminado',
        description: 'Um pântano tóxico e cheio de perigos ocultos.',
        color: '#556b2f' // DarkOliveGreen
    },
    FOREST: {
        id: 'FOREST',
        name: 'Floresta Antiga',
        description: 'Uma floresta densa e misteriosa.',
        color: '#228b22' // ForestGreen
    }
};

// --- 2. Dados dos NÓS do Mapa ---
// Cada objeto representa um ponto de interesse clicável no mapa.
// 'x' e 'y' são coordenadas percentuais para posicionar o nó visualmente no mapa.
export const MAP_NODES = [
    // --- NÓS DO BIOMA: WASTELAND ---
    {
        id: 'wasteland_crossroads',
        name: 'Wasteland Crossroads',
        biome: 'WASTELAND',
        x: 50, y: 50, // Posição central no mapa
        connections: ['ruins_outskirts', 'burning_entrance', 'swamp_edge']
    },
    {
        id: 'wasteland_camp',
        name: 'Isolated Camp',
        biome: 'WASTELAND',
        x: 60, y: 65,
        connections: ['wasteland_crossroads', 'forest_path']
    },
    {
        id: 'wasteland_old_dump',
        name: 'Old Dump Site',
        biome: 'WASTELAND',
        x: 35, y: 60,
        connections: ['wasteland_crossroads', 'ruins_outskirts']
    },
    // --- NÓS DO BIOMA: RUINS ---
    {
        id: 'ruins_outskirts',
        name: 'Ruins Outskirts',
        biome: 'RUINS',
        x: 25, y: 70,
        connections: ['wasteland_crossroads', 'wasteland_old_dump', 'city_center']
    },
    {
        id: 'city_center',
        name: 'City Center',
        biome: 'RUINS',
        x: 15, y: 80,
        connections: ['ruins_outskirts', 'abandoned_market']
    },
    {
        id: 'abandoned_market',
        name: 'Abandoned Market',
        biome: 'RUINS',
        x: 20, y: 88,
        connections: ['city_center']
    },
    // --- NÓS DO BIOMA: BURNING_RIDGE ---
    {
        id: 'burning_entrance',
        name: 'Ridge Entrance',
        biome: 'BURNING_RIDGE',
        x: 40, y: 35,
        connections: ['wasteland_crossroads', 'volcano_base']
    },
    {
        id: 'volcano_base',
        name: 'Volcano Base',
        biome: 'BURNING_RIDGE',
        x: 25, y: 20,
        connections: ['burning_entrance', 'lava_river']
    },
    {
        id: 'lava_river',
        name: 'Lava River',
        biome: 'BURNING_RIDGE',
        x: 35, y: 15,
        connections: ['volcano_base']
    },
    // --- NÓS DO BIOMA: SWAMP ---
    {
        id: 'swamp_edge',
        name: 'Swamp Edge',
        biome: 'SWAMP',
        x: 70, y: 40,
        connections: ['wasteland_crossroads', 'murky_waters']
    },
    {
        id: 'murky_waters',
        name: 'Murky Waters',
        biome: 'SWAMP',
        x: 80, y: 25,
        connections: ['swamp_edge', 'ancient_sanctuary']
    },
    {
        id: 'ancient_sanctuary',
        name: 'Ancient Sanctuary',
        biome: 'SWAMP',
        x: 88, y: 35,
        connections: ['murky_waters']
    },
    // --- NÓS DO BIOMA: FOREST ---
    {
        id: 'forest_path',
        name: 'Forest Path',
        biome: 'FOREST',
        x: 75, y: 70,
        connections: ['wasteland_camp', 'deep_forest']
    },
    {
        id: 'deep_forest',
        name: 'Deep Forest',
        biome: 'FOREST',
        x: 85, y: 80,
        connections: ['forest_path', 'crystal_cave']
    },
    {
        id: 'crystal_cave',
        name: 'Crystal Cave',
        biome: 'FOREST',
        x: 90, y: 65,
        connections: ['deep_forest']
    }
];

// O ponto de spawn padrão para novas expedições
export const SPAWN_NODE_ID = 'wasteland_crossroads';
