/* ====================================================================
// DATABASE: COMPONENTS
// UPDATE: (Etapa 1.2 - Atributos de Combate)
// - Adiciona novos componentes T1/T2 para (Block, Dodge, Resist, etc.)
// - Padroniza 'damage' para 'attack'.
// ==================================================================== */

export const COMPONENTS_DB = { 
    // --- TIER 1 COMPONENTS (Atributos Primários) ---
    'comp_hp_1': { 
        id: 'comp_hp_1', 
        name: "HP Matrix T1", 
        description: "Increases the maximum life capacity of the user.",
        type: "defense", 
        stats: { hp: 20 }, 
        iconPath: "assets/items/components/comp_hp_1.png" 
    },
    'comp_atk_1': { // (ID Padronizado de comp_dmg_1)
        id: 'comp_atk_1', 
        name: "Attack Core T1", 
        description: "Enhances base attack power.",
        type: "damage", 
        stats: { attack: 5 }, // (Padronizado)
        iconPath: "assets/items/components/comp_dmg_1.png" 
    },
    'comp_def_1': { 
        id: 'comp_def_1', 
        name: "Defense Plate T1", 
        description: "Basic reinforcement plate for basic armor shielding.",
        type: "defense", 
        stats: { defense: 5 }, 
        iconPath: "assets/items/components/comp_def_1.png" 
    },
    'comp_spd_1': { 
        id: 'comp_spd_1', 
        name: "Speed Injector T1", 
        description: "Boosts agility and Movement Points (MP).",
        type: "speed", 
        stats: { speed: 3 }, 
        iconPath: "assets/items/components/comp_spd_1.png" 
    },
    'comp_crit_1': { 
        id: 'comp_crit_1', 
        name: "Precision Lens T1", 
        description: "Improves focus and overall chance of critical hits.",
        type: "damage", 
        stats: { critChance: 3 }, 
        iconPath: "assets/items/components/comp_crit_1.png" 
    },
    'comp_ap_1': { 
        id: 'comp_ap_1', 
        name: "AP Battery T1", 
        description: "Increases the number of available Action Points (AP).",
        type: "universal", 
        stats: { ap: 1 }, 
        iconPath: "assets/items/components/comp_ap_1.png" 
    },

    // --- (NOVOS) TIER 1 COMPONENTS (Atributos Secundários) ---
    'comp_block_1': {
        id: 'comp_block_1',
        name: 'Barrier Matrix T1',
        description: 'Um módulo simples que projeta um escudo de baixa energia.',
        type: 'defense',
        stats: { blockChance: 3 },
        iconPath: 'assets/items/components/comp_block_1.png'
    },
    'comp_dodge_1': {
        id: 'comp_dodge_1',
        name: 'Phase Coil T1',
        description: 'Uma bobina que gera flutuações de fase, aumentando a esquiva.',
        type: 'speed',
        stats: { dodgeChance: 2 },
        iconPath: 'assets/items/components/comp_dodge_1.png'
    },
    'comp_lifesteal_1': {
        id: 'comp_lifesteal_1',
        name: 'Vampiric Siphon T1',
        description: 'Drena uma pequena quantidade de vitalidade no impacto.',
        type: 'damage',
        stats: { lifesteal: 1 },
        iconPath: 'assets/items/components/comp_lifesteal_1.png'
    },
    'comp_thorns_1': {
        id: 'comp_thorns_1',
        name: 'Spike Coating T1',
        description: 'Retorna dano físico leve a atacantes corpo a corpo.',
        type: 'defense',
        stats: { thorns: 5 },
        iconPath: 'assets/items/components/comp_thorns_1.png'
    },
    'comp_stun_1': {
        id: 'comp_stun_1',
        name: 'Concussion Module T1',
        description: 'Um módulo de impacto pesado com uma pequena chance de atordoar.',
        type: 'damage',
        stats: { stunChance: 1 },
        iconPath: 'assets/items/components/comp_stun_1.png'
    },

    // --- TIER 1 COMPONENTS (Resistências) ---
    'comp_fire_resist_1': {
        id: 'comp_fire_resist_1',
        name: 'Volcanic Insulation T1',
        description: 'Revestimento isolante que protege contra calor extremo.',
        type: 'defense',
        stats: { fireResist: 10 },
        iconPath: 'assets/items/components/comp_fire_resist_1.png'
    },
    'comp_toxin_resist_1': {
        id: 'comp_toxin_resist_1',
        name: 'Toxin Filter T1',
        description: 'Um filtro biológico que neutraliza venenos e radiação.',
        type: 'defense',
        stats: { toxinResist: 10 },
        iconPath: 'assets/items/components/comp_toxin_resist_1.png'
    },
    'comp_energy_resist_1': {
        id: 'comp_energy_resist_1',
        name: 'Energy Shield T1',
        description: 'Dissipa ataques de energia recebidos.',
        type: 'defense',
        stats: { energyResist: 10 },
        iconPath: 'assets/items/components/comp_energy_resist_1.png'
    },
    
    // --- TIER 1 CORE COMPONENTS (Boss Drops) ---
    'volcanics_core': { 
        id: 'volcanics_core', 
        name: "Volcanics Core", 
        description: "Essence from a Volcanic enemy, focused on Damage.",
        type: "damage", 
        stats: { attack: 1, fireDamage: 2 }, // (Padronizado e Melhorado)
        iconPath: "assets/items/components/volcanics_core.png" 
    },
    'undergrounders_core': { 
        id: 'undergrounders_core', 
        name: "Undergrounders Core", 
        description: "Essence from an Undergrounder enemy, focused on Defense.",
        type: "defense", 
        stats: { defense: 1, blockAmount: 5 }, // (Melhorado)
        iconPath: "assets/items/components/undergrounders_core.png" 
    },
    'nocturnals_core': { 
        id: 'nocturnals_core', 
        name: "Nocturnals Core", 
        description: "Essence from a Nocturnal enemy, focused on Speed.",
        type: "speed", 
        stats: { speed: 1, energyResist: 3 }, // (Melhorado)
        iconPath: "assets/items/components/nocturnals_core.png" 
    },
    'radioactives_core': { 
        id: 'radioactives_core', 
        name: "Radioactives Core", 
        description: "Essence from a Radioactive enemy, focused on Regeneration.",
        type: "heal", 
        stats: { hpRegen: 1, toxinResist: 3 }, // (Melhorado)
        iconPath: "assets/items/components/radioactives_core.png" 
    },
    'reptilians_core': { 
        id: 'reptilians_core', 
        name: "Reptilians Core", 
        description: "Essence from a Reptilian enemy, focused on maximum HP.",
        type: "defense", 
        stats: { hp: 10, hpRegen: 1 }, // (Melhorado)
        iconPath: "assets/items/components/reptilians_core.png" 
    },

    // =================================================
    // --- TIER 2 COMPONENTS (Primários) ---
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
    },

    // --- (NOVOS) TIER 2 COMPONENTS (Secundários/Utilidade) ---
    'comp_block_2': {
        id: 'comp_block_2',
        name: 'Barrier Matrix T2',
        description: 'Um módulo de escudo aprimorado que absorve dano significativo.',
        type: 'defense',
        stats: { blockChance: 5, blockAmount: 20 },
        iconPath: 'assets/items/components/comp_block_2.png'
    },
    'comp_cooldown_2': {
        id: 'comp_cooldown_2',
        name: 'Overclocker T2',
        description: 'Reduz o tempo de recarga de habilidades ativas.',
        type: 'universal',
        stats: { cooldownReduction: 3 },
        iconPath: 'assets/items/components/comp_cooldown_2.png'
    },
};
