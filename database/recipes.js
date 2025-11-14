/* ====================================================================
// DATABASE: RECIPES
// Define as receitas para criar equipamentos no Workshop.
// A chave deve corresponder ao 'id' do item em EQUIPMENT_DB.
// ==================================================================== */

export const RECIPES_DB = {
    // --- Rustic Set (Tier 1) ---
    "eq_rust_helmet": {
        cost: { "mat_scrap": 8, "mat_metal": 2 }
    },
    "eq_rust_weapon": {
        cost: { "mat_scrap": 10, "mat_metal": 1 }
    },
    
    // --- Nocturnals Set (Tier 2) ---
    // Exemplo de receitas futuras (descomente e ajuste quando quiser ativar)
    
    "eq_noct_weapon": {
        cost: { "mat_scrap": 15, "mat_metal": 5, "mat_nanochips": 2 }
    },
    "eq_noct_armor": {
        cost: { "mat_scrap": 20, "mat_metal": 5, "mat_polymer": 3 }
    }
    
};
