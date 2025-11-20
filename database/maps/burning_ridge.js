/* ====================================================================
// DATABASE: MAP TEMPLATE - BURNING RIDGE
// Define os nós estáticos e a topologia deste bioma específico.
// O MapGenerator usará isso para criar a instância da expedição.
// ==================================================================== */

export const BURNING_RIDGE_TEMPLATE = {
    id: 'BURNING_RIDGE',
    name: 'Burning Ridge',
    description: 'Picos vulcânicos instáveis e rios de magma. Lar dos Volcanics.',
    difficultyTier: 1,
    
    // Definição dos Nós (Template)
    // Tipos: 'START' (Spawn possível), 'RESOURCE' (Coleta), 'COMBAT' (Risco alto), 'TRANSIT' (Saída)
    nodes: [
        // 1. Ponto de Trânsito (Conecta com Wasteland)
        // Localizado na borda sudeste do bioma
        {
            id: 'br_transit_wasteland',
            name: 'Ash Border',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'A fronteira coberta de cinzas que leva ao deserto central.',
            x: 38, y: 38, 
            connections: ['br_obsidian_field'], // Conecta para dentro
            targetBiome: 'WASTELAND' // Para onde leva
        },

        // 2. Campo de Recursos (Fácil)
        // Localizado no sopé da montanha
        {
            id: 'br_obsidian_field',
            name: 'Obsidian Fields',
            type: 'RESOURCE',
            subtype: 'OBSIDIAN_FIELD', // Usado para drops específicos
            description: 'Campos vastos de vidro vulcânico afiado.',
            x: 28, y: 32,
            connections: ['br_transit_wasteland', 'br_magma_pool', 'br_vents']
        },

        // 3. Lago de Magma (Recurso/Combate)
        // Localizado mais ao centro
        {
            id: 'br_magma_pool',
            name: 'Bubbling Magma Pool',
            type: 'RESOURCE', // Pode ter combate também
            subtype: 'MAGMA_POOL',
            description: 'Pequenos lagos de rocha derretida. Muito quente.',
            x: 20, y: 40,
            connections: ['br_obsidian_field', 'br_old_forge']
        },

        // 4. Aberturas de Vapor (Risco Médio)
        // Localizado mais ao norte
        {
            id: 'br_vents',
            name: 'Sulfur Vents',
            type: 'COMBAT',
            subtype: 'VOLCANIC_VENT',
            description: 'Gases tóxicos e criaturas que se alimentam de enxofre.',
            x: 22, y: 20,
            connections: ['br_obsidian_field', 'br_peak_crater']
        },

        // 5. Cratera do Pico (Alto Risco/Recompensa)
        // Localizado no topo
        {
            id: 'br_peak_crater',
            name: 'The Summit Crater',
            type: 'COMBAT',
            subtype: 'VOLCANIC_PEAK', // Boss potential
            description: 'O ponto mais alto e perigoso. O calor é insuportável.',
            x: 15, y: 15,
            connections: ['br_vents']
        },
        
        // 6. Ruína Antiga (Lore/Loot)
        // Localizado a oeste
        {
            id: 'br_old_forge',
            name: 'Ancient Forge Ruins',
            type: 'EVENT',
            subtype: 'RUINS',
            description: 'Restos de uma forja antiga, talvez dos primeiros Volcanics.',
            x: 10, y: 35,
            connections: ['br_magma_pool']
        }
    ]
};
