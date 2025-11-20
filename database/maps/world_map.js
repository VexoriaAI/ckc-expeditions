/* ====================================================================
// DATABASE: WORLD MAP (Fase 4.0)
// Define a topologia global do mundo: Quais biomas existem e 
// quais se conectam entre si (Vizinhança).
// ==================================================================== */

export const WORLD_BIOMES = {
    'BURNING_RIDGE': {
        id: 'BURNING_RIDGE',
        name: 'Burning Ridge',
        tribe: 'VOLCANICS',
        description: 'Picos vulcânicos e rios de lava. O calor é sufocante.',
        difficultyTier: 1,
        // Vizinhos: Conecta com Ruínas (Sul), Wasteland (Sudeste), Minas (Leste)
        neighbors: ['ANCIENT_METROPOLIS', 'WASTELAND', 'ABANDONED_MINES']
    },
    
    'ANCIENT_METROPOLIS': {
        id: 'ANCIENT_METROPOLIS',
        name: 'Ancient Metropolis',
        tribe: 'NOCTURNALS',
        description: 'Arranha-céus em ruínas mergulhados em sombras eternas.',
        difficultyTier: 1,
        // Vizinhos: Conecta com Vulcão (Norte), Wasteland (Leste)
        neighbors: ['BURNING_RIDGE', 'WASTELAND']
    },

    'WASTELAND': {
        id: 'WASTELAND',
        name: 'The Wasteland',
        tribe: null, // Bioma Neutro / Central
        description: 'O deserto central. Ponto de conexão para todas as tribos.',
        difficultyTier: 0, // Área inicial segura/padrão
        // Vizinhos: O "Hub" central que conecta quase tudo
        neighbors: ['BURNING_RIDGE', 'ANCIENT_METROPOLIS', 'ABANDONED_MINES', 'COVENANT_SWAMP']
    },

    'ABANDONED_MINES': {
        id: 'ABANDONED_MINES',
        name: 'Abandoned Mines', // (The Dead Lake area)
        tribe: 'UNDERGROUNDERS',
        description: 'Túneis profundos e lagos subterrâneos ácidos.',
        difficultyTier: 2,
        // Vizinhos: Conecta com Vulcão (Oeste), Wasteland (Sul), Lago (Leste)
        neighbors: ['BURNING_RIDGE', 'WASTELAND', 'LAKE_RANCID']
    },

    'LAKE_RANCID': {
        id: 'LAKE_RANCID',
        name: 'Lake Rancid',
        tribe: 'RADIOACTIVES',
        description: 'Águas tóxicas e mutações extremas.',
        difficultyTier: 2,
        // Vizinhos: Conecta com Minas (Oeste), Pântano (Sul)
        neighbors: ['ABANDONED_MINES', 'COVENANT_SWAMP']
    },

    'COVENANT_SWAMP': {
        id: 'COVENANT_SWAMP',
        name: 'Covenant Swamp',
        tribe: 'REPTILIANS',
        description: 'Selva densa e úmida, cheia de predadores.',
        difficultyTier: 2,
        // Vizinhos: Conecta com Wasteland (Oeste), Lago (Norte)
        neighbors: ['WASTELAND', 'LAKE_RANCID']
    },

    'CYBERCITY': {
        id: 'CYBERCITY',
        name: 'Cyber City',
        tribe: 'AI',
        description: 'A fortaleza impenetrável. O objetivo final.',
        difficultyTier: 99,
        neighbors: [] // Acesso restrito (Evento final)
    }
};
