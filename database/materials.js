/* ====================================================================
// DATABASE: MATERIALS
// Define os recursos brutos coletáveis.
// Todos os materiais são empilháveis (isStackable: true).
// ==================================================================== */

/**
 * @typedef {object} MaterialData
 * @property {string} name - Nome do Material.
 * @property {string} description - Descrição curta.
 * @property {string} iconPath - Caminho para o ícone do asset.
 * @property {boolean} isStackable - Indica se o item pode ser empilhado (sempre true para materiais).
 */

export const MATERIALS_DB = {
    // --- Volcanics (Burning Ridge) ---
    'mat_metal': { 
        name: "Metal Bruto", 
        description: "Matéria-prima de forja do Pico Flamejante.", 
        iconPath: "assets/items/materials/mat_metal.png",
        isStackable: true
    },
    'mat_magma': { 
        name: "Magma Solidificado", 
        description: "Fonte de calor e energia dos Vulcânicos.", 
        iconPath: "assets/items/materials/mat_magma.png",
        isStackable: true
    },
    'mat_volcanic_pumice_stone': { 
        name: "Pedra Pomes Vulcânica", 
        description: "Leve e resistente, usada em blindagens.", 
        iconPath: "assets/items/materials/mat_volcanic_pumice_stone.png",
        isStackable: true
    },
    'mat_obsidian_tears': { 
        name: "Lágrimas de Obsidiana", 
        description: "Fragmentos vítreos de extrema dureza.", 
        iconPath: "assets/items/materials/mat_obsidian_tears.png",
        isStackable: true
    },
    
    // --- Undergrounders (Mines) ---
    'mat_water': { 
        name: "Água Purificada", 
        description: "Recurso vital procurado nos subsolos.", 
        iconPath: "assets/items/materials/mat_water.png",
        isStackable: true
    },
    'mat_energized_crystals': { 
        name: "Cristais Energizados", 
        description: "Fonte de energia subterrânea, brilha no escuro.", 
        iconPath: "assets/items/materials/mat_energized_crystals.png",
        isStackable: true
    },
    'mat_thermal_water': { 
        name: "Água Termal", 
        description: "Água aquecida por veias de magma.", 
        iconPath: "assets/items/materials/mat_thermal_water.png",
        isStackable: true
    },
    'mat_special_clay': { 
        name: "Argila Especial", 
        description: "Usada na criação de isolamentos e filtros.", 
        iconPath: "assets/items/materials/mat_special_clay.png",
        isStackable: true
    },
    'mat_glass': { 
        name: "Caco de Vidro", 
        description: "Restos tecnológicos de uma antiga corporação.", 
        iconPath: "assets/items/materials/mat_glass.png",
        isStackable: true
    },
    
    // --- Nocturnals (Ancient Ruins) ---
    'mat_scrap': { 
        name: "Scrap (Sucata)", 
        description: "Restos de metal e plástico de construções antigas.", 
        iconPath: "assets/items/materials/mat_scrap.png",
        isStackable: true
    },
    'mat_polymer': { 
        name: "Polímero Sintético", 
        description: "Material leve, base para equipamentos táticos.", 
        iconPath: "assets/items/materials/mat_polymer.png",
        isStackable: true
    },
    'mat_nanochips': { 
        name: "Nanochips", 
        description: "Componentes eletrônicos minúsculos e essenciais.", 
        iconPath: "assets/items/materials/mat_nanochips.png",
        isStackable: true
    },
    'mat_cybernetic_implants': { 
        name: "Implantes Cibernéticos", 
        description: "Tecnologia avançada, resgatada das ruínas.", 
        iconPath: "assets/items/materials/mat_cybernetic_implants.png",
        isStackable: true
    },
    'mat_quantum_energy_core': { 
        name: "Núcleo de Energia Quântica", 
        description: "Fonte de energia rara e de alto potencial.", 
        iconPath: "assets/items/materials/mat_quantum_energy_core.png",
        isStackable: true
    },
    
    // --- Radioactives (Lake Rancid) ---
    'mat_strange_fluid': { 
        name: "Fluido Estranho", 
        description: "Líquido tóxico, base para armas biológicas.", 
        iconPath: "assets/items/materials/mat_strange_fluid.png",
        isStackable: true
    },
    'mat_parasitic_fungus': { 
        name: "Fungo Parasita", 
        description: "Cresce em animais e confere resistência.", 
        iconPath: "assets/items/materials/mat_parasitic_fungus.png",
        isStackable: true
    },
    'mat_venom_glands': { 
        name: "Glândulas de Veneno", 
        description: "Coletadas de criaturas mutantes do Lago Rancid.", 
        iconPath: "assets/items/materials/mat_venom_glands.png",
        isStackable: true
    },
    'mat_luminescent_algae': { 
        name: "Alga Luminescente", 
        description: "Emite luz, adaptada às águas tóxicas.", 
        iconPath: "assets/items/materials/mat_luminescent_algae.png",
        isStackable: true
    },
    
    // --- Reptilians (Covenant Swamp) ---
    'mat_food': { 
        name: "Ração Bruta", 
        description: "Alimento base, essência da vida no Pântano.", 
        iconPath: "assets/items/materials/mat_food.png",
        isStackable: true
    },
    'mat_healing_plants': { 
        name: "Plantas Curativas", 
        description: "Ervas usadas para primeiros socorros.", 
        iconPath: "assets/items/materials/mat_healing_plants.png",
        isStackable: true
    },
    'mat_hallucinogenic_fungi': { 
        name: "Fungo Alucinógeno", 
        description: "Usado pelos xamãs em rituais tribais.", 
        iconPath: "assets/items/materials/mat_hallucinogenic_fungi.png",
        isStackable: true
    },
    'mat_animal_skin': { 
        name: "Pele de Animal", 
        description: "Usada para confecção de vestimentas e armaduras leves.", 
        iconPath: "assets/items/materials/mat_animal_skin.png",
        isStackable: true
    },
    'mat_reptilian_blood': { 
        name: "Sangue Reptiliano", 
        description: "Possui fortes propriedades adaptativas.", 
        iconPath: "assets/items/materials/mat_reptilian_blood.png",
        isStackable: true
    }
};
