/* ====================================================================
// DATABASE: EQUIPMENT
// UPDATE: (Etapa 1.1 - Atributos de Combate)
// Adiciona os novos atributos de combate (Block, Dodge, Resist, 
// Lifesteal, Thorns, etc.) ao base_stats dos itens.
// ==================================================================== */

export const EQUIPMENT_SLOTS = ["helmet", "armor", "weapon", "boots", "gloves", "implant", "accessory"];

export const EQUIPMENT_DB = {

    // --- RUSTIC SET (TIER 1) ---
    "eq_rust_helmet": { 
        id: "eq_rust_helmet", 
        name: "Rustic Helmet", 
        description: "A basic, slightly rusty helmet, ideal for beginners.",
        slot: "helmet", 
        synergy: "defense", 
        base_stats: { hp: 10, defense: 2, blockChance: 1 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rust_helmet.png' 
    },
    "eq_rust_armor": {
        id: "eq_rust_armor",
        name: "Rustic Armor",
        description: "A simple armor piece, offering minimal body protection.",
        slot: "armor",
        synergy: "defense",
        base_stats: { hp: 20, defense: 3, thorns: 3 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rust_armor.png'
    },
    "eq_rust_weapon": {
        id: "eq_rust_weapon",
        name: "Rustic Club",
        description: "A primitive, heavy-duty club that delivers reasonable damage.",
        slot: "weapon",
        synergy: "damage",
        base_stats: { attack: 7, stunChance: 1 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rust_weapon.png'
    },
    "eq_rust_boots": {
        id: "eq_rust_boots",
        name: "Rustic Boots",
        description: "Simple boots that grant a slight increase in speed and mobility.",
        slot: "boots",
        synergy: "speed",
        base_stats: { hp: 5, defense: 1, speed: 2, dodgeChance: 1 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rust_boots.png'
    },
    "eq_rust_gloves": {
        id: "eq_rust_gloves",
        name: "Rustic Gloves",
        description: "Improves precision and handling slightly, increasing crit chance.",
        slot: "gloves",
        synergy: "damage",
        base_stats: { speed: 1, attack: 1, critChance: 1 }, 
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rust_gloves.png'
    },
    "eq_rust_implant": {
        id: "eq_rust_implant",
        name: "Rustic Implant",
        description: "A simple cybernetic implant, boosts HP and Action Points (AP).",
        slot: "implant",
        synergy: "universal",
        base_stats: { hp: 5, ap: 1 },
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rust_implant.png'
    },
    "eq_rust_accessory": {
        id: "eq_rust_accessory",
        name: "Rustic Accessory",
        description: "A lucky charm that can improve the quality of expedition loot.",
        slot: "accessory",
        synergy: "universal",
        base_stats: { luck: 2 },
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rust_accessory.png'
    },

    // --- NOCTURNALS SET (TIER 1) ---
    "eq_noct_helmet": {
        id: "eq_noct_helmet",
        name: "Nocturnal Visor",
        description: "Optimizes night vision and significantly increases critical hit chance.",
        slot: "helmet",
        synergy: "defense",
        base_stats: { hp: 15, defense: 3, critChance: 2, dodgeChance: 2 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_noct_helmet.png'
    },
    "eq_noct_weapon": {
        id: "eq_noct_weapon",
        name: "Shadow Dagger",
        description: "A fast, lethal weapon focused on maximizing critical damage output.",
        slot: "weapon",
        synergy: "damage",
        base_stats: { attack: 8, critDamage: 10, attackSpeed: 2, lifesteal: 1 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_noct_weapon.png'
    },

    // --- VOLCANIC SET (TIER 1) ---
    "eq_volc_helmet": {
        id: "eq_volc_helmet",
        name: "Volcanic Helm",
        description: "A helm forged in magma, offering solid protection and offensive capability.",
        slot: "helmet",
        synergy: "defense",
        base_stats: { attack: 2, defense: 3, fireResist: 5 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_volc_helmet.png'
    },
    "eq_volc_armor": {
        id: "eq_volc_armor",
        name: "Volcanic Plate",
        description: "Obsidian plating that withstands high temperatures and heavy blows.",
        slot: "armor",
        synergy: "defense",
        base_stats: { hp: 15, defense: 5, thorns: 5 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_volc_armor.png'
    },
    "eq_volc_weapon": {
        id: "eq_volc_weapon",
        name: "Magma Hammer",
        description: "A slow but devastating hammer, infused with magma.",
        slot: "weapon",
        synergy: "damage",
        base_stats: { attack: 9, speed: -1, fireDamage: 3 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_volc_weapon.png'
    },

    // --- RADIOACTIVE SET (TIER 1) ---
    "eq_rad_mask": {
        id: "eq_rad_mask",
        name: "Radioactive Mask",
        description: "A leaking gas mask that seems to... regenerate the wearer?",
        slot: "helmet",
        synergy: "defense",
        base_stats: { hp: 10, hpRegen: 1, toxinResist: 10 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rad_mask.png'
    },
    "eq_rad_plating": {
        id: "eq_rad_plating",
        name: "Radioactive Plating",
        description: "Unstable isotopes fused into armor plating. Heavy and tough.",
        slot: "armor",
        synergy: "defense",
        base_stats: { hp: 25, defense: 2, toxinResist: 5 }, // (NOVO)
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_rad_plating.png'
    },

    // --- TECH SET (TIER 3 / RARE) ---
    "eq_tech_helmet": {
        id: "eq_tech_helmet",
        name: "Tech Helmet",
        description: "An advanced helmet with a tactical HUD, improving reaction time.",
        slot: "helmet",
        synergy: "universal",
        base_stats: { defense: 10, speed: 3, ap: 1, cooldownReduction: 1 }, // (NOVO)
        tier: 3,
        base_rarity: "RARE",
        iconPath: 'assets/items/equipment/eq_tech_helmet.png'
    },
    "eq_tech_rig": {
        id: "eq_tech_rig",
        name: "Tech Rig",
        description: "A light combat rig with micro-servos for enhanced mobility.",
        slot: "armor",
        synergy: "defense",
        base_stats: { hp: 40, defense: 8, speed: 2, blockAmount: 10 }, // (NOVO)
        tier: 3,
        base_rarity: "RARE",
        iconPath: 'assets/items/equipment/eq_tech_rig.png'
    },
    "eq_tech_gauntlet": {
        id: "eq_tech_gauntlet",
        name: "Tech Gauntlet",
        description: "A high-frequency blade attached to a gauntlet.",
        slot: "weapon",
        synergy: "damage",
        base_stats: { attack: 12, critChance: 5, lifesteal: 3, stunChance: 2 }, // (NOVO)
        tier: 3,
        base_rarity: "RARE",
        iconPath: 'assets/items/equipment/eq_tech_gauntlet.png'
    }
};
