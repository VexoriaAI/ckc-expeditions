/* ====================================================================
// DATABASE: COMPONENTS
// Define os stats e o 'type' (sinergia) de cada componente.
// ATUALIZADO: Inclui 'description' e padroniza 'icon' para 'iconPath'.
// ==================================================================== */

export const COMPONENTS_DB = { 
    'comp_def_1': { 
        id: 'comp_def_1', 
        name: "Placa de Defesa", 
        description: "Reforço básico de blindagem.",
        type: "defense", 
        stats: { defense: 5 }, 
        iconPath: "assets/items/components/comp_def_1.png" 
    },
    'comp_hp_1': { 
        id: 'comp_hp_1', 
        name: "Matriz de HP", 
        description: "Aumenta a capacidade de vida máxima.",
        type: "defense", 
        stats: { hp: 20 }, 
        iconPath: "assets/items/components/comp_hp_1.png" 
    },
    'comp_dmg_1': { 
        id: 'comp_dmg_1', 
        name: "Núcleo Vulcânico", 
        description: "Aumenta o poder de ataque base.",
        type: "damage", 
        stats: { damage: 5 }, 
        iconPath: "assets/items/components/comp_dmg_1.png" 
    },
    'comp_crit_1': { 
        id: 'comp_crit_1', 
        name: "Lente de Precisão", 
        description: "Melhora a chance de acerto crítico.",
        type: "damage", 
        stats: { critChance: 3 }, 
        iconPath: "assets/items/components/comp_crit_1.png" 
    },
    'comp_spd_1': { 
        id: 'comp_spd_1', 
        name: "Injetor de Velocidade", 
        description: "Melhora a agilidade e pontos de movimento.",
        type: "speed", 
        stats: { speed: 3 }, 
        iconPath: "assets/items/components/comp_spd_1.png" 
    },
    'comp_regen_1': { 
        id: 'comp_regen_1', 
        name: "Matriz de Regeneração", 
        description: "Adiciona regeneração de HP por turno/hora.",
        type: "heal", 
        stats: { hpRegen: 2 }, 
        iconPath: "assets/items/components/comp_regen_1.png" 
    },
    'comp_luck_1': { 
        id: 'comp_luck_1', 
        name: "Trevo da Sorte", 
        description: "Aumenta a chance de loot raro.",
        type: "universal", 
        stats: { luck: 3 }, 
        iconPath: "assets/items/components/comp_luck_1.png" 
    },
    'comp_ap_1': { 
        id: 'comp_ap_1', 
        name: "Bateria de AP", 
        description: "Aumenta o número de Pontos de Ação (AP) disponíveis.",
        type: "universal", 
        stats: { ap: 1 }, 
        iconPath: "assets/items/components/comp_ap_1.png" 
    },

    // --- Boss/Core Drops ---
    'volcanics_core': { 
        id: 'volcanics_core', 
        name: "Núcleo Vulcânico", 
        description: "Essência de um inimigo Vulcânico, focado em Dano.",
        type: "damage", 
        stats: { damage: 1 }, 
        iconPath: "assets/items/components/volcanics_core.png" 
    },
    'undergrounders_core': { 
        id: 'undergrounders_core', 
        name: "Núcleo Subterrâneo", 
        description: "Essência de um inimigo Subterrâneo, focado em Defesa.",
        type: "defense", 
        stats: { defense: 1 }, 
        iconPath: "assets/items/components/undergrounders_core.png" 
    },
    'nocturnals_core': { 
        id: 'nocturnals_core', 
        name: "Núcleo Noturno", 
        description: "Essência de um inimigo Noturno, focado em Velocidade.",
        type: "speed", 
        stats: { speed: 1 }, 
        iconPath: "assets/items/components/nocturnals_core.png" 
    },
    'radioactives_core': { 
        id: 'radioactives_core', 
        name: "Núcleo Radioativo", 
        description: "Essência de um inimigo Radioativo, focado em Regeneração.",
        type: "heal", 
        stats: { hpRegen: 1 }, 
        iconPath: "assets/items/components/radioactives_core.png" 
    },
    'reptilians_core': { 
        id: 'reptilians_core', 
        name: "Núcleo Reptiliano", 
        description: "Essência de um inimigo Reptiliano, focado em HP.",
        type: "defense", 
        stats: { hp: 10 }, 
        iconPath: "assets/items/components/reptilians_core.png" 
    },
    'wasteland_core': { 
        id: 'wasteland_core', 
        name: "Núcleo Wasteland", 
        description: "Essência de um inimigo genérico, oferece Sorte.",
        type: "universal", 
        stats: { luck: 1 }, 
        iconPath: "assets/items/components/wasteland_core.png" 
    }
};
