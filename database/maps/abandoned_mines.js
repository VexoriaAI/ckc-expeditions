/* ====================================================================
// DATABASE: MAP TEMPLATE - ABANDONED MINES
// Bioma dos Undergrounders. Cavernas profundas e lagos ácidos.
// ==================================================================== */

export const ABANDONED_MINES_TEMPLATE = {
    id: 'ABANDONED_MINES',
    name: 'Abandoned Mines',
    description: 'Túneis escavados e lagos subterrâneos.',
    difficultyTier: 2,
    
    nodes: [
        // 1. Ponto de Trânsito (Saída para Wasteland - Sul)
        {
            id: 'um_transit_wasteland',
            name: 'Mine Entrance',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'A boca da mina que se abre para o deserto.',
            x: 50, y: 90, // Sul
            connections: ['um_dead_lake', 'um_crystal_cavern'], 
            targetBiome: 'WASTELAND'
        },

        // 2. Ponto de Trânsito (Saída para Burning Ridge - Oeste/Norte)
        {
            id: 'um_transit_burning',
            name: 'Thermal Vents',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'Túneis aquecidos que sobem para o vulcão.',
            x: 20, y: 20, // Noroeste
            connections: ['um_deep_shaft'], 
            targetBiome: 'BURNING_RIDGE'
        },

        // 3. O Lago Morto (Recurso Principal)
        {
            id: 'um_dead_lake',
            name: 'The Dead Lake',
            type: 'RESOURCE',
            subtype: 'ACID_LAKE', // (Novo subtipo)
            description: 'Um lago verde brilhante no centro da cratera.',
            x: 60, y: 50, // Centro-Leste
            connections: ['um_transit_wasteland', 'um_deep_shaft']
        },

        // 4. Caverna de Cristais (Recurso)
        {
            id: 'um_crystal_cavern',
            name: 'Crystal Grotto',
            type: 'RESOURCE',
            subtype: 'CRYSTAL_CAVE',
            description: 'Formações minerais energizadas.',
            x: 80, y: 70, // Sudeste
            connections: ['um_transit_wasteland', 'um_dead_lake']
        },

        // 5. Poço Profundo (Combate/Boss)
        {
            id: 'um_deep_shaft',
            name: 'Sector 7 Excavation',
            type: 'COMBAT',
            subtype: 'DEEP_SHAFT',
            description: 'Onde as máquinas antigas ainda operam sozinhas.',
            x: 40, y: 30, // Centro-Norte
            connections: ['um_transit_burning', 'um_dead_lake']
        }
    ]
};
