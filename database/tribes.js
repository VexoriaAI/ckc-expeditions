/* ====================================================================
// DATABASE: TRIBES
// Define as tribos disponíveis e os seus atributos base iniciais.
// ==================================================================== */

export const TRIBES = {
    VOLCANICS: { 
        name: "Volcanics", 
        biome: "volcanics", 
        baseStats: { 
            damage: 4, 
            critDamage: 5, 
            defense: 3, 
            blockChance: 3, 
            critChance: 2, 
            speed: 15, 
            attackSpeed: 1, 
            hpRegen: 1, 
            ap: 5, 
            hp: 110, 
            luck: 1 
        } 
    },
    UNDERGROUNDERS: { 
        name: "Undergrounders", 
        biome: "undergrounders", 
        baseStats: { 
            damage: 2, 
            critDamage: 2, 
            defense: 5, 
            blockChance: 5, 
            critChance: 1, 
            speed: 15, 
            attackSpeed: 2, 
            hpRegen: 2, 
            ap: 6, 
            hp: 120, 
            luck: 2 
        } 
    },
    NOCTURNALS: { 
        name: "Nocturnals", 
        biome: "nocturnals", 
        baseStats: { 
            damage: 3, 
            critDamage: 3, 
            defense: 2, 
            blockChance: 1, 
            critChance: 5, 
            speed: 15, 
            attackSpeed: 4, 
            hpRegen: 1, 
            ap: 6, 
            hp: 100, 
            luck: 3 
        } 
    },
    RADIOACTIVES: { 
        name: "Radioactives", 
        biome: "radioactives", 
        baseStats: { 
            damage: 2, 
            critDamage: 2, 
            defense: 1, 
            blockChance: 1, 
            critChance: 3, 
            speed: 20, 
            attackSpeed: 5, 
            hpRegen: 1, 
            ap: 7, 
            hp: 80, 
            luck: 5 
        } 
    },
    REPTILIANS: { 
        name: "Reptilians", 
        biome: "reptilians", 
        baseStats: { 
            damage: 3, 
            critDamage: 2, 
            defense: 3, 
            blockChance: 2, 
            critChance: 2, 
            speed: 13, 
            attackSpeed: 2, 
            hpRegen: 5, 
            ap: 5, 
            hp: 100, 
            luck: 2 
        } 
    }
};
