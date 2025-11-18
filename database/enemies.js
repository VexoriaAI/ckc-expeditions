/* ====================================================================
// DATABASE: ENEMIES
// UPDATE: (Etapa 1.3 - Atributos de Combate)
// - Padroniza 'strength' para 'attack'.
// - Adiciona os novos 11 atributos de combate (Block, Dodge, Resist, etc.).
// - Alinha Biomas com maps.js (ex: 'BURNING_RIDGE').
// ==================================================================== */

export const ENEMIES_BY_BIOME = {
    
    // --- (Antigo: volcanics) ---
    'BURNING_RIDGE': {
        "common": {
            "id": "vol_com_01",
            "name": "Magma Crawler",
            "sprite": "assets/enemies/magma_crawler.png",
            "stats": { "hp": 20, "attack": 6, "defense": 3, "speed": 5, "ap": 1, "critChance": 0, "fireResist": 20 },
            "rewards": { "mat_magma": { "chance": 80, "quantity": [ 1, 3 ] }, "mat_obsidian_tears": { "chance": 20, "quantity": [ 1, 1 ] } }
        },
        "elite": {
            "id": "vol_eli_02",
            "name": "Cinder Hulk",
            "sprite": "assets/enemies/cinder_hulk.png",
            "stats": { "hp": 50, "attack": 12, "defense": 8, "speed": 3, "ap": 1, "critChance": 0, "fireResist": 50, "thorns": 5 },
            "rewards": { "mat_magma": { "chance": 100, "quantity": [ 5, 10 ] }, "mat_obsidian_core": { "chance": 10, "quantity": [ 1, 1 ] } }
        },
        "boss": {
            "id": "vol_bos_03",
            "name": "Obsidian Golem",
            "sprite": "assets/enemies/obsidian_golem.png",
            "stats": { "hp": 120, "attack": 25, "defense": 15, "speed": 5, "ap": 2, "critChance": 5, "fireResist": 100, "fireDamage": 10, "thorns": 10 },
            "rewards": { "mat_obsidian_core": { "chance": 100, "quantity": [ 1, 3 ] }, "volcanics_core": { "chance": 100, "quantity": [ 1, 1 ] } }
        }
    },
    
    // --- (Antigo: undergrounders) ---
    'ABANDONED_MINES': {
        "common": {
            "id": "und_com_04",
            "name": "Cave Skitter",
            "sprite": "assets/enemies/cave_skitter.png",
            "stats": { "hp": 15, "attack": 5, "defense": 5, "speed": 8, "ap": 2, "critChance": 5, "dodgeChance": 5 },
            "rewards": { "mat_energized_crystals": { "chance": 50, "quantity": [ 1, 2 ] }, "mat_special_clay": { "chance": 50, "quantity": [ 1, 3 ] } }
        },
        "boss": {
            "id": "und_bos_06",
            "name": "Deep Rock Tyrant",
            "sprite": "assets/enemies/deep_rock_tyrant.png",
            "stats": { "hp": 100, "attack": 20, "defense": 20, "speed": 6, "ap": 1, "critChance": 0, "blockChance": 20, "blockAmount": 20 },
            "rewards": { "mat_crystal_lattice": { "chance": 100, "quantity": [ 1, 2 ] }, "undergrounders_core": { "chance": 100, "quantity": [ 1, 1 ] } }
        }
    },

    // --- (Antigo: nocturnals) ---
    'ANCIENT_RUINS': {
        "common": {
            "id": "noc_com_07",
            "name": "Glitch Bot",
            "sprite": "assets/enemies/glitch_bot.png",
            "stats": { "hp": 15, "attack": 7, "defense": 1, "speed": 15, "ap": 2, "critChance": 10, "dodgeChance": 10, "energyResist": 20 },
            "rewards": { "mat_scrap": { "chance": 80, "quantity": [ 1, 5 ] }, "mat_polymer": { "chance": 40, "quantity": [ 1, 2 ] } }
        },
        "boss": {
            "id": "noc_bos_09",
            "name": "Code-Wraith",
            "sprite": "assets/enemies/code_wraith.png",
            "stats": { "hp": 90, "attack": 22, "defense": 5, "speed": 25, "ap": 3, "critChance": 15, "dodgeChance": 20, "energyResist": 50, "lifesteal": 5 },
            "rewards": { "mat_nanochips": { "chance": 100, "quantity": [ 3, 5 ] }, "mat_processed_polymer": { "chance": 30, "quantity": [ 1, 2 ] }, "nocturnals_core": { "chance": 100, "quantity": [ 1, 1 ] } }
        }
    },

    // --- (Antigo: radioactives) ---
    'LAKE_RANCID': {
        "common": {
            "id": "rad_com_10",
            "name": "Goo Blob",
            "sprite": "assets/enemies/goo_blob.png",
            "stats": { "hp": 30, "attack": 4, "defense": 0, "speed": 3, "ap": 1, "critChance": 0, "toxinResist": 100, "hpRegen": 2 },
            "rewards": { "mat_strange_fluid": { "chance": 90, "quantity": [ 1, 4 ] } }
        },
        "boss": {
            "id": "rad_bos_12",
            "name": "Toxic Abomination",
            "sprite": "assets/enemies/toxic_abomination.png",
            "stats": { "hp": 150, "attack": 18, "defense": 5, "speed": 4, "ap": 1, "critChance": 0, "hpRegen": 10, "toxinResist": 100, "thorns": 10 },
            "rewards": { "mat_stable_isotope": { "chance": 100, "quantity": [ 1, 2 ] }, "radioactives_core": { "chance": 100, "quantity": [ 1, 1 ] } }
        }
    },

    // --- (Antigo: reptilians) ---
    'COVENANT_SWAMP': {
        "common": {
            "id": "rep_com_13",
            "name": "Swamp Lurker",
            "sprite": "assets/enemies/swamp_lurker.png",
            "stats": { "hp": 20, "attack": 6, "defense": 3, "speed": 7, "ap": 1, "critChance": 5, "toxinResist": 10 },
            "rewards": { "mat_animal_skin": { "chance": 50, "quantity": [ 1, 3 ] }, "mat_food": { "chance": 50, "quantity": [ 1, 2 ] } }
        },
        "boss": {
            "id": "rep_bos_15",
            "name": "Covenant Drake",
            "sprite": "assets/enemies/covenant_drake.png",
            "stats": { "hp": 110, "attack": 22, "defense": 10, "speed": 12, "ap": 2, "critChance": 10, "lifesteal": 10, "hpRegen": 3 },
            "rewards": { "mat_hardened_scales": { "chance": 100, "quantity": [ 1, 2 ] }, "reptilians_core": { "chance": 100, "quantity": [ 1, 1 ] } }
        }
    },
    
    // --- (Antigo: wasteland) ---
    'WASTELAND': {
        "common": {
            "id": "was_com_16",
            "name": "Scavenger Drone",
            "sprite": "assets/enemies/scavenger_drone.png",
            "stats": { "hp": 15, "attack": 5, "defense": 2, "speed": 12, "ap": 2, "critChance": 0, "energyResist": 5 },
            "rewards": { "mat_scrap": { "chance": 100, "quantity": [ 1, 5 ] } }
        },
        "boss": {
            "id": "was_bos_18",
            "name": "The Iron Warlord",
            "sprite": "assets/enemies/iron_warlord.png",
            "stats": { "hp": 100, "attack": 20, "defense": 12, "speed": 8, "ap": 2, "critChance": 5, "blockChance": 15, "blockAmount": 10 },
            "rewards": { "mat_scrap": { "chance": 100, "quantity": [ 20, 50 ] }, "mat_metal": { "chance": 100, "quantity": [ 5, 10 ] }, "wasteland_core": { "chance": 100, "quantity": [ 1, 1 ] } }
        }
    }
};
