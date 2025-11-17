/* ====================================================================
// DATABASE: MATERIALS
// UPDATE: Adiciona 5 novos materiais de Tier 2.
// ==================================================================== */

/**
 * @typedef {object} MaterialData
 * @property {string} name - Nome do Material.
 * @property {string} description - Descrição curta.
 * @property {string} iconPath - Caminho para o ícone do asset.
 * @property {boolean} isStackable - Indica se o item pode ser empilhado.
 */

export const MATERIALS_DB = {
    // --- TIER 1: Volcanics (Burning Ridge) ---
    'mat_metal': { 
        name: "Raw Metal", 
        description: "Raw forging material from the Burning Ridge.", 
        iconPath: "assets/items/materials/mat_metal.png",
        isStackable: true
    },
    'mat_magma': { 
        name: "Solidified Magma", 
        description: "Heat source and energy for Volcanics.", 
        iconPath: "assets/items/materials/mat_magma.png",
        isStackable: true
    },
    'mat_volcanic_pumice_stone': { 
        name: "Volcanic Pumice Stone", 
        description: "Lightweight and resistant, used in armor.", 
        iconPath: "assets/items/materials/mat_volcanic_pumice_stone.png",
        isStackable: true
    },
    'mat_obsidian_tears': { 
        name: "Obsidian Tears", 
        description: "Glassy fragments of extreme hardness.", 
        iconPath: "assets/items/materials/mat_obsidian_tears.png",
        isStackable: true
    },
    
    // --- TIER 1: Undergrounders (Mines) ---
    'mat_water': { 
        name: "Purified Water", 
        description: "Vital resource found in the deep underground.", 
        iconPath: "assets/items/materials/mat_water.png",
        isStackable: true
    },
    'mat_energized_crystals': { 
        name: "Energized Crystals", 
        description: "Underground power source, glows in the dark.", 
        iconPath: "assets/items/materials/mat_energized_crystals.png",
        isStackable: true
    },
    'mat_thermal_water': { 
        name: "Thermal Water", 
        description: "Water heated by magma veins.", 
        iconPath: "assets/items/materials/mat_thermal_water.png",
        isStackable: true
    },
    'mat_special_clay': { 
        name: "Special Clay", 
        description: "Used to create insulators and filters.", 
        iconPath: "assets/items/materials/mat_special_clay.png",
        isStackable: true
    },
    'mat_glass': { 
        name: "Glass Shard", 
        description: "Tech scraps from an ancient corporation.", 
        iconPath: "assets/items/materials/mat_glass.png",
        isStackable: true
    },
    
    // --- TIER 1: Nocturnals (Ancient Ruins) ---
    'mat_scrap': { 
        name: "Scrap", 
        description: "Remnants of metal and plastic from old ruins.", 
        iconPath: "assets/items/materials/mat_scrap.png",
        isStackable: true
    },
    'mat_polymer': { 
        name: "Synthetic Polymer", 
        description: "Lightweight material, base for tactical gear.", 
        iconPath: "assets/items/materials/mat_polymer.png",
        isStackable: true
    },
    'mat_nanochips': { 
        name: "Nanochips", 
        description: "Tiny and essential electronic components.", 
        iconPath: "assets/items/materials/mat_nanochips.png",
        isStackable: true
    },
    'mat_cybernetic_implants': { 
        name: "Cybernetic Implants", 
        description: "Advanced tech salvaged from the ruins.", 
        iconPath: "assets/items/materials/mat_cybernetic_implants.png",
        isStackable: true
    },
    'mat_quantum_energy_core': { 
        name: "Quantum Energy Core", 
        description: "A rare and high-potential energy source.", 
        iconPath: "assets/items/materials/mat_quantum_energy_core.png",
        isStackable: true
    },
    
    // --- TIER 1: Radioactives (Lake Rancid) ---
    'mat_strange_fluid': { 
        name: "Strange Fluid", 
        description: "Toxic liquid, base for biological weapons.", 
        iconPath: "assets/items/materials/mat_strange_fluid.png",
        isStackable: true
    },
    'mat_parasitic_fungus': { 
        name: "Parasitic Fungus", 
        description: "Grows on creatures and grants resistance.", 
        iconPath: "assets/items/materials/mat_parasitic_fungus.png",
        isStackable: true
    },
    'mat_venom_glands': { 
        name: "Venom Glands", 
        description: "Harvested from mutated creatures of Lake Rancid.", 
        iconPath: "assets/items/materials/mat_venom_glands.png",
        isStackable: true
    },
    'mat_luminescent_algae': { 
        name: "Luminescent Algae", 
        description: "Emits light, adapted to toxic waters.", 
        iconPath: "assets/items/materials/mat_luminescent_algae.png",
        isStackable: true
    },
    
    // --- TIER 1: Reptilians (Covenant Swamp) ---
    'mat_food': { 
        name: "Raw Rations", 
        description: "Base food, essence of life in the Swamp.", 
        iconPath: "assets/items/materials/mat_food.png",
        isStackable: true
    },
    'mat_healing_plants': { 
        name: "Healing Plants", 
        description: "Herbs used for first aid.", 
        iconPath: "assets/items/materials/mat_healing_plants.png",
        isStackable: true
    },
    'mat_hallucinogenic_fungi': { 
        name: "Hallucinogenic Fungi", 
        description: "Used by shamans in tribal rituals.", 
        iconPath: "assets/items/materials/mat_hallucinogenic_fungi.png",
        isStackable: true
    },
    'mat_animal_skin': { 
        name: "Animal Skin", 
        description: "Used for crafting light clothing and armor.", 
        iconPath: "assets/items/materials/mat_animal_skin.png",
        isStackable: true
    },
    'mat_reptilian_blood': { 
        name: "Reptilian Blood", 
        description: "Possesses strong adaptive properties.", 
        iconPath: "assets/items/materials/mat_reptilian_blood.png",
        isStackable: true
    },

    // =================================================
    // --- (NOVOS) TIER 2 MATERIALS ---
    // =================================================
    'mat_processed_polymer': {
        name: "Processed Polymer",
        description: "Scrap melted and reformed into lightweight ballistic plates.",
        iconPath: "assets/items/materials/mat_processed_polymer.png",
        isStackable: true
    },
    'mat_hardened_scales': {
        name: "Hardened Scales",
        description: "Scales from a swamp apex predator, far tougher than common skin.",
        iconPath: "assets/items/materials/mat_hardened_scales.png",
        isStackable: true
    },
    'mat_stable_isotope': {
        name: "Stable Isotope",
        description: "A rare isotope from Lake Rancid that emits pure, non-decaying energy.",
        iconPath: "assets/items/materials/mat_stable_isotope.png",
        isStackable: true
    },
    'mat_obsidian_core': {
        name: "Obsidian Core",
        description: "The center of an Obsidian Tear, pulsing with heat.",
        iconPath: "assets/items/materials/mat_obsidian_core.png",
        isStackable: true
    },
    'mat_crystal_lattice': {
        name: "Crystal Lattice",
        description: "Perfectly aligned crystals, ideal for conducting energy.",
        iconPath: "assets/items/materials/mat_crystal_lattice.png",
        isStackable: true
    }
};
