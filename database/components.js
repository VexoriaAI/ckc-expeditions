/* ====================================================================
// DATABASE: COMPONENTS
// UPDATE: Adiciona 5 novos componentes de Tier 2.
// ==================================================================== */

export const COMPONENTS_DB = { 
    // --- TIER 1 COMPONENTS ---
    'comp_def_1': { 
        id: 'comp_def_1', 
        name: "Defense Plate T1", 
        description: "Basic reinforcement plate for basic armor shielding.",
        type: "defense", 
        stats: { defense: 5 }, 
        iconPath: "assets/items/components/comp_def_1.png" 
    },
    'comp_hp_1': { 
        id: 'comp_hp_1', 
        name: "HP Matrix T1", 
        description: "Increases the maximum life capacity of the user.",
        type: "defense", 
        stats: { hp: 20 }, 
        iconPath: "assets/items/components/comp_hp_1.png" 
    },
    'comp_dmg_1': { 
        id: 'comp_dmg_1', 
        name: "Attack Core T1", // Nome padronizado
        description: "Enhances base attack power using stabilized magma.",
        type: "damage", 
        stats: { attack: 5 }, 
        iconPath: "assets/items/components/comp_dmg_1.png" 
    },
    'comp_crit_1': { 
        id: 'comp_crit_1', 
        name: "Precision Lens T1", 
        description: "Improves focus and overall chance of critical hits.",
        type: "damage", 
        stats: { critChance: 3 }, 
        iconPath: "assets/items/components/comp_crit_1.png" 
    },
    'comp_spd_1': { 
        id: 'comp_spd_1', 
        name: "Speed Injector T1", 
        description: "Boosts agility and Movement Points (MP).",
        type: "speed", 
        stats: { speed: 3 }, 
        iconPath: "assets/items/components/comp_spd_1.png" 
    },
    'comp_regen_1': { 
        id: 'comp_regen_1', 
        name: "Regen Matrix T1", 
        description: "Adds passive HP regeneration per turn/hour.",
        type: "heal", 
        stats: { hpRegen: 2 }, 
        iconPath: "assets/items/components/comp_regen_1.png" 
    },
    'comp_luck_1': { 
        id: 'comp_luck_1', 
        name: "Lucky Clover T1", 
        description: "Increases general luck and chance of rare loot drops.",
        type: "universal", 
        stats: { luck: 3 }, 
        iconPath: "assets/items/components/comp_luck_1.png" 
    },
    'comp_ap_1': { 
        id: 'comp_ap_1', 
        name: "AP Battery T1", 
        description: "Increases the number of available Action Points (AP).",
        type: "universal", 
        stats: { ap: 1 }, 
        iconPath: "assets/items/components/comp_ap_1.png" 
    },

    // --- CORE COMPONENTS (BOSS DROPS) ---
    'volcanics_core': { 
        id: 'volcanics_core', 
        name: "Volcanics Core", 
        description: "Essence from a Volcanic enemy, focused on Damage.",
        type: "damage", 
        stats: { attack: 1 }, 
        iconPath: "assets/items/components/volcanics_core.png" 
    },
    'undergrounders_core': { 
        id: 'undergrounders_core', 
        name: "Undergrounders Core", 
        description: "Essence from an Undergrounder enemy, focused on Defense.",
        type: "defense", 
        stats: { defense: 1 }, 
        iconPath: "assets/items/components/undergrounders_core.png" 
    },
    'nocturnals_core': { 
        id: 'nocturnals_core', 
        name: "Nocturnals Core", 
        description: "Essence from a Nocturnal enemy, focused on Speed.",
        type: "speed", 
        stats: { speed: 1 }, 
        iconPath: "assets/items/components/nocturnals_core.png" 
    },
    'radioactives_core': { 
        id: 'radioactives_core', 
        name: "Radioactives Core", 
        description: "Essence from a Radioactive enemy, focused on Regeneration.",
        type: "heal", 
        stats: { hpRegen: 1 }, 
        iconPath: "assets/items/components/radioactives_core.png" 
    },
    'reptilians_core': { 
        id: 'reptilians_core', 
        name: "Reptilians Core", 
        description: "Essence from a Reptilian enemy, focused on maximum HP.",
        type: "defense", 
        stats: { hp: 10 }, 
        iconPath: "assets/items/components/reptilians_core.png" 
    },
    'wasteland_core': { 
        id: 'wasteland_core', 
        name: "Wasteland Core", 
        description: "Essence from a generic enemy, granting minor Luck.",
        type: "universal", 
        stats: { luck: 1 }, 
        iconPath: "assets/items/components/wasteland_core.png" 
    },

    // =================================================
    // --- (NOVOS) TIER 2 COMPONENTS ---
    // =================================================
    'comp_hp_2': {
        id: 'comp_hp_2',
        name: "HP Matrix T2",
        description: "A high-capacity life matrix.",
        type: "defense",
        stats: { hp: 50 },
        iconPath: "assets/items/components/comp_hp_2.png" 
    },
    'comp_atk_2': {
        id: 'comp_atk_2',
        name: "Attack Module T2",
        description: "An overclocked attack processor.",
        type: "damage",
        stats: { attack: 10 },
        iconPath: "assets/items/components/comp_atk_2.png" 
    },
    'comp_def_2': {
        id: 'comp_def_2',
        name: "Defense Plate T2",
        description: "Processed polymer plates, surprisingly strong.",
        type: "defense",
        stats: { defense: 12 },
        iconPath: "assets/items/components/comp_def_2.png" 
    },
    'comp_spd_2': {
        id: 'comp_spd_2',
        name: "Speed Injector T2",
        description: "A refined crystal injector for rapid movement.",
        type: "speed",
        stats: { speed: 6 },
        iconPath: "assets/items/components/comp_spd_2.png" 
    },
    'comp_crit_2': {
        id: 'comp_crit_2',
        name: "Precision Lens T2",
        description: "A lens stabilized with a rare isotope.",
        type: "damage",
        stats: { critChance: 7 },
        iconPath: "assets/items/components/comp_crit_2.png" 
    }
};
