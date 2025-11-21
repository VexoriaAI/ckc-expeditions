/* ====================================================================
// DATABASE: MAP TEMPLATE - ANCIENT METROPOLIS
// Bioma dos Nocturnals. Ruínas de arranha-céus e tecnologia antiga.
// ==================================================================== */

export const ANCIENT_METROPOLIS_TEMPLATE = {
    id: 'ANCIENT_METROPOLIS',
    name: 'Ancient Metropolis',
    description: 'O esqueleto de uma metrópole, mergulhado em sombras eternas.',
    difficultyTier: 1,
    
    nodes: [
        // 1. Ponto de Trânsito (Saída para Wasteland - Leste)
        {
            id: 'am_transit_wasteland',
            name: 'Highway Exit',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'A velha rodovia que leva ao deserto.',
            x: 85, y: 50, // Leste
            connections: ['am_ruined_skyscraper', 'am_subway_station'], 
            targetBiome: 'WASTELAND'
        },

        // 2. Ponto de Trânsito (Saída para Burning Ridge - Norte)
        {
            id: 'am_transit_burning',
            name: 'North Bridge',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'Uma ponte quebrada que aponta para as montanhas.',
            x: 50, y: 10, // Norte
            connections: ['am_ruined_skyscraper'], 
            targetBiome: 'BURNING_RIDGE'
        },

        // 3. Arranha-céu Ruído (Combate/Loot)
        {
            id: 'am_ruined_skyscraper',
            name: 'Fallen Tower',
            type: 'COMBAT',
            subtype: 'RUINS', // Usa tabela de Ruins
            description: 'Um prédio tombado servindo de ponte entre quarteirões.',
            x: 50, y: 40, // Centro-Norte
            connections: ['am_transit_burning', 'am_transit_wasteland', 'am_shadow_market']
        },

        // 4. Estação de Metrô (Recurso/Evento)
        {
            id: 'am_subway_station',
            name: 'Subway Terminal',
            type: 'RESOURCE', 
            subtype: 'OLD_POWER_STATION', // (Novo subtipo sugerido)
            description: 'Túneis escuros onde tecnologia antiga ainda brilha.',
            x: 30, y: 75, // Sudoeste
            connections: ['am_transit_wasteland', 'am_shadow_market']
        },

        // 5. Mercado das Sombras (Boss/Elite)
        {
            id: 'am_shadow_market',
            name: 'The Shadow Altar',
            type: 'COMBAT',
            subtype: 'SHADOW_ALLEY', // (Novo subtipo sugerido)
            description: 'Onde os Nocturnals realizam seus rituais silenciosos.',
            x: 20, y: 30, // Noroeste (Profundo na cidade)
            connections: ['am_ruined_skyscraper', 'am_subway_station']
        }
    ]
};
