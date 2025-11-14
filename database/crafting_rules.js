/* ====================================================================
// DATABASE: CRAFTING RULES
// Define as regras de compatibilidade (sinergia) para o Embed.
// ==================================================================== */

// Define quais 'types' de componentes são permitidos em qual 'synergy' de equipamento
export const SYNERGY_MAP = {
    "defense": ["defense", "heal", "universal"],
    "damage": ["damage", "crit", "speed", "universal"],
    "speed": ["speed", "universal"],
    "universal": ["damage", "crit", "speed", "heal", "defense", "universal"]
    // Adicione mais sinergias (ex: "heal", "crit") se necessário
};
