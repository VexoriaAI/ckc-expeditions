/* ====================================================================
// DATABASE: EQUIPMENT
// UPDATE: Remove 'slots_total' e 'slots_unlocked'.
// Adiciona 'tier' e 'base_rarity' para criação dinâmica de instâncias.
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
        base_stats: { hp: 10, defense: 2 }, 
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
        base_stats: { hp: 20, defense: 3 },
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
        base_stats: { damage: 7 },
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
        base_stats: { hp: 5, defense: 1, speed: 2 },
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
        base_stats: { speed: 1, damage: 1, critChance: 1 },
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
        base_stats: { hp: 15, defense: 3, critChance: 2 },
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_noct_helmet.png'
    },
    "eq_noct_armor": {
        id: "eq_noct_armor",
        name: "Nocturnal Cloak",
        description: "Lightweight and stealthy, offers good defense without compromising speed.",
        slot: "armor",
        synergy: "defense",
        base_stats: { hp: 30, defense: 4, speed: 2 },
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_noct_armor.png'
    },
    "eq_noct_weapon": {
        id: "eq_noct_weapon",
        name: "Shadow Dagger",
        description: "A fast, lethal weapon focused on maximizing critical damage output.",
        slot: "weapon",
        synergy: "damage",
        base_stats: { damage: 8, critDamage: 10, attackSpeed: 2 }, 
        tier: 1,
        base_rarity: "COMMON",
        iconPath: 'assets/items/equipment/eq_noct_weapon.png'
    },
    // (Os demais itens Nocturnals seguiriam o mesmo padrão)
};
