/* ====================================================================
// DATABASE: MAP TEMPLATE - WASTELAND
// O Hub central. Conecta todos os outros biomas.
// ==================================================================== */

export const WASTELAND_TEMPLATE = {
    id: 'WASTELAND',
    name: 'The Wasteland',
    description: 'O deserto central que conecta todas as regiões.',
    difficultyTier: 0,
    
    nodes: [
        // 1. Acampamento Central (Spawn Comum)
        {
            id: 'wl_central_camp',
            name: 'Scavenger Camp',
            type: 'START', // Seguro
            subtype: 'SCRAP_YARD',
            description: 'Um acampamento neutro de troca.',
            x: 50, y: 50, // Centro exato
            connections: ['wl_great_crater', 'wl_transit_swamp', 'wl_transit_metro']
        },

        // 2. A Grande Cratera (Combate/Recurso)
        {
            id: 'wl_great_crater',
            name: 'Impact Crater',
            type: 'COMBAT',
            subtype: 'CRATER',
            description: 'O local de um antigo impacto. Rico em metal.',
            x: 40, y: 30, // Noroeste do centro
            connections: ['wl_central_camp', 'wl_transit_burning', 'wl_transit_mines']
        },

        // --- TRÂNSITOS (Saídas para outros Biomas) ---
        
        // 3. Saída para Vulcão (Noroeste)
        {
            id: 'wl_transit_burning',
            name: 'Road to Ridge',
            type: 'TRANSIT',
            subtype: 'HIGHWAY',
            description: 'O calor aumenta nesta direção.',
            x: 20, y: 15, 
            connections: ['wl_great_crater'], 
            targetBiome: 'BURNING_RIDGE'
        },

        // 4. Saída para Metrópole (Sudoeste)
        {
            id: 'wl_transit_metro',
            name: 'Road to Ruins',
            type: 'TRANSIT',
            subtype: 'HIGHWAY',
            description: 'Prédios distantes aparecem na neblina.',
            x: 15, y: 80, 
            connections: ['wl_central_camp'], 
            targetBiome: 'ANCIENT_METROPOLIS'
        },

        // 5. Saída para Minas (Oeste)
        {
            id: 'wl_transit_mines',
            name: 'Mine Path',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'Trilhas rochosas.',
            x: 10, y: 45, 
            connections: ['wl_great_crater'], 
            targetBiome: 'ABANDONED_MINES'
        },

        // 6. Saída para Pântano (Leste)
        {
            id: 'wl_transit_swamp',
            name: 'Muddy Road',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'O ar fica úmido e pesado.',
            x: 85, y: 55, 
            connections: ['wl_central_camp'], 
            targetBiome: 'COVENANT_SWAMP'
        },

        // 7. Saída para Lago Rancid (Nordeste)
        {
            id: 'wl_transit_rancid',
            name: 'Toxic Path',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'Aviso: Radiação detectada.',
            x: 75, y: 20, 
            connections: ['wl_central_camp'], // Conecta indiretamente via centro
            targetBiome: 'LAKE_RANCID'
        }
    ]
};
