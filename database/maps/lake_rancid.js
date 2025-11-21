/* ====================================================================
// DATABASE: MAP TEMPLATE - LAKE RANCID
// Bioma dos Radioactives. Águas tóxicas e estruturas abandonadas.
// ==================================================================== */

export const LAKE_RANCID_TEMPLATE = {
    id: 'LAKE_RANCID',
    name: 'Lake Rancid',
    description: 'Um lago vasto e tóxico, lar dos mutantes Radioativos.',
    difficultyTier: 2,
    
    nodes: [
        // 1. Ponto de Trânsito (Conecta com Wasteland - Sudoeste)
        {
            id: 'lr_transit_wasteland',
            name: 'Toxic Shoreline',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'A margem onde o deserto encontra o lodo tóxico.',
            x: 20, y: 80, // Canto Inferior Esquerdo (Sudoeste)
            connections: ['lr_mangrove', 'lr_oil_rig'], 
            targetBiome: 'WASTELAND'
        },

        // 2. Mangue na Orla (Recurso - Perto da costa)
        {
            id: 'lr_mangrove',
            name: 'Mutated Mangrove',
            type: 'RESOURCE',
            subtype: 'RADIOACTIVE_SWAMP', // (Novo subtipo para drops)
            description: 'Raízes retorcidas que brilham no escuro.',
            x: 35, y: 65, 
            connections: ['lr_transit_wasteland', 'lr_sunken_ruins']
        },

        // 3. Plataforma de Petróleo (Combate/Recurso - Centro do Lago)
        {
            id: 'lr_oil_rig',
            name: 'The Rusty Rig',
            type: 'COMBAT', 
            subtype: 'OIL_RIG',
            description: 'Uma antiga plataforma de extração, agora uma fortaleza.',
            x: 50, y: 45, // Centro
            connections: ['lr_transit_wasteland', 'lr_shipwreck', 'lr_island_cluster']
        },

        // 4. Carcaça de Navio (Evento/Loot - Leste)
        {
            id: 'lr_shipwreck',
            name: 'The Ghost Tanker',
            type: 'EVENT',
            subtype: 'SHIPWRECK',
            description: 'Um petroleiro encalhado, vazando fluidos estranhos.',
            x: 75, y: 55, // Meio-Direita
            connections: ['lr_oil_rig', 'lr_transit_swamp']
        },

        // 5. Ilhas (Recurso/Combate - Norte)
        {
            id: 'lr_island_cluster',
            name: 'Glowing Islands',
            type: 'RESOURCE',
            subtype: 'TOXIC_ISLAND', 
            description: 'Pequenas ilhas formadas por resíduos solidificados.',
            x: 50, y: 20, // Norte
            connections: ['lr_oil_rig']
        },
        
        // 6. Construções na Orla / Ruínas Submersas (Sul)
        {
            id: 'lr_sunken_ruins',
            name: 'Sunken Outpost',
            type: 'COMBAT',
            subtype: 'RUINS',
            description: 'Antigos laboratórios parcialmente submersos.',
            x: 45, y: 85, 
            connections: ['lr_mangrove', 'lr_transit_swamp']
        },

        // 7. Ponto de Trânsito (Conecta com Covenant Swamp - Sudeste)
        {
            id: 'lr_transit_swamp',
            name: 'Marshy Gate',
            type: 'TRANSIT',
            subtype: 'BORDER_CROSSING',
            description: 'Onde a água tóxica se mistura com a lama do pântano.',
            x: 80, y: 85, // Canto Inferior Direito
            connections: ['lr_sunken_ruins', 'lr_shipwreck'], 
            targetBiome: 'COVENANT_SWAMP'
        }
    ]
};
