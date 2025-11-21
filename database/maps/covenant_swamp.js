/* ====================================================================
// DATABASE: MAP TEMPLATE - COVENANT SWAMP
// Bioma dos Reptilians. Selva densa e perigosa.
// ==================================================================== */

export const COVENANT_SWAMP_TEMPLATE = {
    id: 'COVENANT_SWAMP',
    name: 'Covenant Swamp',
    description: 'Um labirinto de raízes e água parada.',
    difficultyTier: 2,
    
    nodes: [
        // 1. Ponto de Trânsito (Saída para Wasteland - Oeste)
        {
            id: 'cs_transit_wasteland',
            name: 'Muddy Banks',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'A lama seca que leva de volta ao deserto.',
            x: 10, y: 50, // Oeste
            connections: ['cs_mud_pits', 'cs_ancient_tree'], 
            targetBiome: 'WASTELAND'
        },

        // 2. Ponto de Trânsito (Saída para Lake Rancid - Norte)
        {
            id: 'cs_transit_rancid',
            name: 'Toxic Delta',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'Onde o pântano encontra o lago tóxico.',
            x: 40, y: 10, // Norte
            connections: ['cs_ancient_tree'], 
            targetBiome: 'LAKE_RANCID'
        },

        // 3. Poços de Lama (Combate)
        {
            id: 'cs_mud_pits',
            name: 'Festering Mud Pits',
            type: 'COMBAT',
            subtype: 'MUD_PIT',
            description: 'Solo instável onde predadores espreitam.',
            x: 30, y: 70, // Sudoeste
            connections: ['cs_transit_wasteland', 'cs_serpent_shrine']
        },

        // 4. Árvore Antiga (Recurso/Evento)
        {
            id: 'cs_ancient_tree',
            name: 'The Elder Mangrove',
            type: 'RESOURCE',
            subtype: 'ANCIENT_TREE',
            description: 'Uma árvore gigante que serve de refúgio.',
            x: 60, y: 40, // Centro
            connections: ['cs_transit_wasteland', 'cs_transit_rancid', 'cs_serpent_shrine']
        },

        // 5. Santuário da Serpente (Boss)
        {
            id: 'cs_serpent_shrine',
            name: 'Serpent Shrine',
            type: 'COMBAT',
            subtype: 'DENSE_JUNGLE',
            description: 'O coração do território reptiliano.',
            x: 85, y: 60, // Sudeste (Profundo)
            connections: ['cs_mud_pits', 'cs_ancient_tree']
        }
    ]
};
