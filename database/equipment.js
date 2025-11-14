/* ====================================================================
// DATABASE: EQUIPMENT
// Define os stats base, slots e sinergia para cada equipamento.
// ATUALIZADO: Inclui 'description' e padroniza 'icon' para 'iconPath'.
// ==================================================================== */

// Enum/Lista de slots definidos no GDD (para validação)
export const EQUIPMENT_SLOTS = ["helmet", "armor", "weapon", "boots", "gloves", "implant", "accessory"];

export const EQUIPMENT_DB = {

    // --- RUSTIC SET (INICIAL) ---
    "eq_rust_helmet": { 
        id: "eq_rust_helmet", 
        name: "Capacete Rústico", 
        description: "Um capacete básico, levemente enferrujado, ideal para iniciantes.",
        slot: "helmet", 
        synergy: "defense", 
        base_stats: { hp: 10, defense: 2 }, 
        slots_total: 3, 
        slots_unlocked: 1, 
        iconPath: 'assets/items/equipment/eq_rust_helmet.png' 
    },
    // ... (Os demais equipamentos RÚSTICOS e NOCTURNALS devem ser atualizados 
    // com 'description' e 'iconPath' de forma similar) ...

    "eq_rust_armor": {
        id: "eq_rust_armor",
        name: "Armadura Rústica",
        description: "Peça de armadura básica, oferece proteção mínima.",
        slot: "armor",
        synergy: "defense",
        base_stats: { hp: 20, defense: 3 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_rust_armor.png'
    },
    "eq_rust_weapon": {
        id: "eq_rust_weapon",
        name: "Clava Rústica",
        description: "Arma primitiva, causa dano razoável.",
        slot: "weapon",
        synergy: "damage",
        base_stats: { damage: 7 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_rust_weapon.png'
    },
    "eq_rust_boots": {
        id: "eq_rust_boots",
        name: "Botas Rústicas",
        description: "Botas simples que dão um leve aumento na velocidade.",
        slot: "boots",
        synergy: "speed",
        base_stats: { hp: 5, defense: 1, speed: 2 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_rust_boots.png'
    },
    "eq_rust_gloves": {
        id: "eq_rust_gloves",
        name: "Luvas Rústicas",
        description: "Melhora sutilmente a precisão e o manuseio.",
        slot: "gloves",
        synergy: "damage",
        base_stats: { speed: 1, damage: 1, critChance: 1 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_rust_gloves.png'
    },
    "eq_rust_implant": {
        id: "eq_rust_implant",
        name: "Implante Rústico",
        description: "Um implante cibernético simples, aumenta HP e AP.",
        slot: "implant",
        synergy: "universal",
        base_stats: { hp: 5, ap: 1 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_rust_implant.png'
    },
    "eq_rust_accessory": {
        id: "eq_rust_accessory",
        name: "Acessório Rústico",
        description: "Item de sorte, pode melhorar a qualidade do loot.",
        slot: "accessory",
        synergy: "universal",
        base_stats: { luck: 2 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_rust_accessory.png'
    },

    // --- NOCTURNALS SET ---
    "eq_noct_helmet": {
        id: "eq_noct_helmet",
        name: "Viseira Noturna",
        description: "Otimiza a visão noturna e aumenta a chance de acerto crítico.",
        slot: "helmet",
        synergy: "defense",
        base_stats: { hp: 15, defense: 3, critChance: 2 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_noct_helmet.png'
    },
    "eq_noct_armor": {
        id: "eq_noct_armor",
        name: "Manto Noturno",
        description: "Leve e furtivo, oferece boa defesa sem comprometer a velocidade.",
        slot: "armor",
        synergy: "defense",
        base_stats: { hp: 30, defense: 4, speed: 2 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_noct_armor.png'
    },
    "eq_noct_weapon": {
        id: "eq_noct_weapon",
        name: "Adaga das Sombras",
        description: "Arma rápida e letal, focada em dano crítico.",
        slot: "weapon",
        synergy: "damage",
        base_stats: { damage: 8, critDamage: 10, attackSpeed: 2 }, // 'attackSpeed' é um novo stat
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_noct_weapon.png'
    },
    "eq_noct_boots": {
        id: "eq_noct_boots",
        name: "Passos Noturnos",
        description: "Garantem alta mobilidade e passos silenciosos.",
        slot: "boots",
        synergy: "speed",
        base_stats: { hp: 5, defense: 2, speed: 5 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_noct_boots.png'
    },
    "eq_noct_gloves": {
        id: "eq_noct_gloves",
        name: "Pegada Noturna",
        description: "Melhora o manuseio e aumenta drasticamente a chance de crítico.",
        slot: "gloves",
        synergy: "damage",
        base_stats: { speed: 3, critChance: 4 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_noct_gloves.png'
    },
    "eq_noct_implant": {
        id: "eq_noct_implant",
        name: "Implante Óptico",
        description: "Focado em precisão para maximizar o potencial de dano crítico.",
        slot: "implant",
        synergy: "universal",
        base_stats: { critChance: 5, ap: 1 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_noct_implant.png'
    },
    "eq_noct_accessory": {
        id: "eq_noct_accessory",
        name: "Amuleto Sombrio",
        description: "Aumenta ligeiramente o HP e a sorte geral nas expedições.",
        slot: "accessory",
        synergy: "universal",
        base_stats: { luck: 3, hp: 10 },
        slots_total: 3,
        slots_unlocked: 1,
        iconPath: 'assets/items/equipment/eq_noct_accessory.png'
    }
};
