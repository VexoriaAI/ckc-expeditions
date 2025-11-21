/* ====================================================================
// DATABASE: MAP TEMPLATE - BURNING RIDGE
// UPDATE: (Fase 4.0 - Fix Nodes Position)
// Reposiciona os nós para ocuparem 100% da área do mapa local.
// Distribuição espalhada para melhor UX.
// ==================================================================== */

export const BURNING_RIDGE_TEMPLATE = {
    id: 'BURNING_RIDGE',
    name: 'Burning Ridge',
    description: 'Picos vulcânicos instáveis e rios de magma.',
    difficultyTier: 1,
    
    nodes: [
        // 1. Ponto de Trânsito (Fronteira com Wasteland - Canto Inferior Direito)
        {
            id: 'br_transit_wasteland',
            name: 'Ash Border',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'A fronteira de cinzas que leva ao deserto.',
            x: 85, y: 85, // Canto Inferior Direito
            connections: ['br_obsidian_field', 'br_magma_pool'], 
            targetBiome: 'WASTELAND'
        },

        // 2. Campo de Recursos (Centro-Direita)
        {
            id: 'br_obsidian_field',
            name: 'Obsidian Fields',
            type: 'RESOURCE',
            subtype: 'OBSIDIAN_FIELD',
            description: 'Vidro vulcânico afiado.',
            x: 50, y: 50, // Meio-Direita
            connections: ['br_transit_wasteland', 'br_vents', 'br_magma_pool']
        },

        // 3. Lago de Magma (Centro-Inferior)
        {
            id: 'br_magma_pool',
            name: 'Bubbling Magma Pool',
            type: 'RESOURCE', 
            subtype: 'MAGMA_POOL',
            description: 'Lagos de rocha derretida.',
            x: 42, y: 76, // Centro-Baixo
            connections: ['br_transit_wasteland', 'br_old_forge', 'br_obsidian_field']
        },

        // 4. Aberturas de Vapor (Centro-Esquerda)
        {
            id: 'br_vents',
            name: 'Sulfur Vents',
            type: 'COMBAT',
            subtype: 'VOLCANIC_VENT',
            description: 'Gases tóxicos.',
            x: 60, y: 20, // (CORREÇÃO: Vírgula adicionada aqui)
            connections: ['br_obsidian_field', 'br_peak_crater']
        },

        // 5. Cratera do Pico (Canto Superior Esquerdo - Boss Area)
        {
            id: 'br_peak_crater',
            name: 'The Summit Crater',
            type: 'COMBAT',
            subtype: 'VOLCANIC_PEAK', 
            description: 'O ponto mais alto e perigoso.',
            x: 25, y: 18, // Canto Superior Esquerdo
            connections: ['br_vents']
        },
        
        // 6. Ruína Antiga (Canto Inferior Esquerdo)
        {
            id: 'br_old_forge',
            name: 'Ancient Forge Ruins',
            type: 'EVENT',
            subtype: 'RUINS',
            description: 'Forja antiga.',
            x: 20, y: 63, // Canto Inferior Esquerdo
            connections: ['br_magma_pool']
        }
    ]
};
