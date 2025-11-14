/* ====================================================================
// DATABASE: COMPONENTS
// Define os stats e o 'type' (sinergia) de cada componente.
// Caminhos de ícones atualizados para a estrutura /assets/ (Fase 2)
// ==================================================================== */

export const COMPONENTS_DB = { 
    'comp_def_1': { 
        id: 'comp_def_1', 
        name: "Defense Plate", 
        type: "defense", 
        stats: { defense: 5 }, 
        icon: "assets/items/components/comp_def_1.png" 
    },
    'comp_hp_1': { 
        id: 'comp_hp_1', 
        name: "HP Matrix", 
        type: "defense", 
        stats: { hp: 20 }, 
        icon: "assets/items/components/comp_hp_1.png" 
    },
    'comp_dmg_1': { 
        id: 'comp_dmg_1', 
        name: "Volcanic Core", 
        type: "damage", 
        stats: { damage: 5 }, 
        icon: "assets/items/components/comp_dmg_1.png" 
    },
    'comp_crit_1': { 
        id: 'comp_crit_1', 
        name: "Precision Lens", 
        type: "damage", 
        stats: { critChance: 3 }, 
        icon: "assets/items/components/comp_crit_1.png" 
    },
    'comp_spd_1': { 
        id: 'comp_spd_1', 
        name: "Speed Injector", 
        type: "speed", 
        stats: { speed: 3 }, 
        icon: "assets/items/components/comp_spd_1.png" 
    },
    'comp_regen_1': { 
        id: 'comp_regen_1', 
        name: "Regen Matrix", 
        type: "heal", 
        stats: { hpRegen: 2 }, 
        icon: "assets/items/components/comp_regen_1.png" 
    },
    'comp_luck_1': { 
        id: 'comp_luck_1', 
        name: "Lucky Clover", 
        type: "universal", 
        stats: { luck: 3 }, 
        icon: "assets/items/components/comp_luck_1.png" 
    },
    'comp_ap_1': { 
        id: 'comp_ap_1', 
        name: "AP Battery", 
        type: "universal", 
        stats: { ap: 1 }, 
        icon: "assets/items/components/comp_ap_1.png" 
    },

    // --- Boss/Core Drops ---
    'volcanics_core': { 
        id: 'volcanics_core', 
        name: "Volcanics Core", 
        type: "damage", 
        stats: { damage: 1 }, 
        icon: "assets/items/components/volcanics_core.png" 
    },
    'undergrounders_core': { 
        id: 'undergrounders_core', 
        name: "Undergrounders Core", 
        type: "defense", 
        stats: { defense: 1 }, 
        icon: "assets/items/components/undergrounders_core.png" 
    },
    'nocturnals_core': { 
        id: 'nocturnals_core', 
        name: "Nocturnals Core", 
        type: "speed", 
        stats: { speed: 1 }, 
        icon: "assets/items/components/nocturnals_core.png" 
    },
    'radioactives_core': { 
        id: 'radioactives_core', 
        name: "Radioactives Core", 
        type: "heal", 
        stats: { hpRegen: 1 }, 
        icon: "assets/items/components/radioactives_core.png" 
    },
    'reptilians_core': { 
        id: 'reptilians_core', 
        name: "Reptilians Core", 
        type: "defense", 
        stats: { hp: 10 }, 
        icon: "assets/items/components/reptilians_core.png" 
    },
    'wasteland_core': { 
        id: 'wasteland_core', 
        name: "Wasteland Core", 
        type: "universal", 
        stats: { luck: 1 }, 
        icon: "assets/items/components/wasteland_core.png" 
    }
};
