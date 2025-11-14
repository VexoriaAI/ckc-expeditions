/* ====================================================================
// DATABASE: EQUIPMENT
// Define os stats base, slots e sinergia para cada equipamento.
// ==================================================================== */

const EQUIPMENT_DB = {

    // --- RUSTIC SET (INICIAL) ---
    "eq_rust_helmet": { id: "eq_rust_helmet", name: "Rustic Helmet", slot: "helmet", synergy: "defense", base_stats: { hp: 10, defense: 2 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_helmet.png' },
    "eq_rust_armor": { id: "eq_rust_armor", name: "Rustic Armor", slot: "armor", synergy: "defense", base_stats: { hp: 20, defense: 3 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_armor.png' },
    "eq_rust_weapon": { id: "eq_rust_weapon", name: "Rustic Club", slot: "weapon", synergy: "damage", base_stats: { damage: 7 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_weapon.png' },
    "eq_rust_boots": { id: "eq_rust_boots", name: "Rustic Boots", slot: "boots", synergy: "speed", base_stats: { hp: 5, defense: 1, speed: 2 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_boots.png' },
    "eq_rust_gloves": { id: "eq_rust_gloves", name: "Rustic Gloves", slot: "gloves", synergy: "damage", base_stats: { speed: 1, damage: 1, critChance: 1 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_gloves.png' },
    "eq_rust_implant": { id: "eq_rust_implant", name: "Rustic Implant", slot: "implant", synergy: "universal", base_stats: { hp: 5, ap: 1 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_implant.png' },
    "eq_rust_accessory": { id: "eq_rust_accessory", name: "Rustic Accessory", slot: "accessory", synergy: "universal", base_stats: { luck: 2 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_accessory.png' },

    // --- NOCTURNALS SET (Foco: Crit & Speed) ---
    "eq_noct_helmet": { 
        id: "eq_noct_helmet", 
        name: "Nocturnal Visor", 
        slot: "helmet", 
        synergy: "defense", 
        base_stats: { hp: 15, defense: 3, critChance: 2 }, 
        slots_total: 3, 
        slots_unlocked: 1, 
        icon: 'images/icons/equipment/eq_noct_helmet.png' 
    },
    "eq_noct_armor": { 
        id: "eq_noct_armor", 
        name: "Nocturnal Cloak", 
        slot: "armor", 
        synergy: "defense", 
        base_stats: { hp: 30, defense: 4, speed: 2 }, 
        slots_total: 3, 
        slots_unlocked: 1, 
        icon: 'images/icons/equipment/eq_noct_armor.png' 
    },
    "eq_noct_weapon": { 
        id: "eq_noct_weapon", 
        name: "Shadow Dagger", 
        slot: "weapon", 
        synergy: "damage", 
        base_stats: { damage: 8, critDamage: 10, attackSpeed: 2 }, 
        slots_total: 3, 
        slots_unlocked: 1, 
        icon: 'images/icons/equipment/eq_noct_weapon.png' 
    },
    "eq_noct_boots": { 
        id: "eq_noct_boots", 
        name: "Nocturnal Treads", 
        slot: "boots", 
        synergy: "speed", 
        base_stats: { hp: 5, defense: 2, speed: 5 }, 
        slots_total: 3, 
        slots_unlocked: 1, 
        icon: 'images/icons/equipment/eq_noct_boots.png' 
    },
    "eq_noct_gloves": { 
        id: "eq_noct_gloves", 
        name: "Nocturnal Grips", 
        slot: "gloves", 
        synergy: "damage", 
        base_stats: { speed: 3, critChance: 4 }, 
        slots_total: 3, 
        slots_unlocked: 1, 
        icon: 'images/icons/equipment/eq_noct_gloves.png' 
    },
    "eq_noct_implant": { 
        id: "eq_noct_implant", 
        name: "Optical Implant", 
        slot: "implant", 
        synergy: "universal", 
        base_stats: { critChance: 5, ap: 1 }, 
        slots_total: 3, 
        slots_unlocked: 1, 
        icon: 'images/icons/equipment/eq_noct_implant.png' 
    },
    "eq_noct_accessory": { 
        id: "eq_noct_accessory", 
        name: "Shadow Amulet", 
        slot: "accessory", 
        synergy: "universal", 
        base_stats: { luck: 3, hp: 10 }, 
        slots_total: 3, 
        slots_unlocked: 1, 
        icon: 'images/icons/equipment/eq_noct_accessory.png' 
    }
};
