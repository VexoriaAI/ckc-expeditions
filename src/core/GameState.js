/* ====================================================================
// SRC/CORE/GAMESTATE.JS (O Coração)
// Gerencia o estado de todo o jogo.
// ==================================================================== */

// Importa dados brutos para inicialização
import { MOCK_WALLET } from '../../database/mock_wallet.js';
import { EQUIPMENT_DB } from '../../database/equipment.js';

// Função auxiliar para gerar inventário inicial (baseada na V5.1)
function generateStartingInventory() {
    return Object.values(EQUIPMENT_DB).map((item, index) => {
        const slots = Array(item.slots_total || 3).fill({ component: null });
        return {
            instance_id: `inst_${index + 1000}`, item_id: item.id, name: item.name, level: 1,
            slot: item.slot, synergy: item.synergy, stats: { ...item.base_stats },
            icon: item.icon, embed_slots: slots, slots_unlocked: item.slots_unlocked || 1
        };
    });
}

// O estado inicial do jogo
const state = {
    currentScreen: 'logged-out-screen',
    player: {
        tezerium: 1000,
        inventory: {
            materials: { "mat_scrap": 100, "mat_water": 50 },
            components: { "comp_def_1": 2, "comp_dmg_1": 2 },
            equipment: [] // Preenchido no login
        },
        kidz: [] // Preenchido no login
    },
    hub: {
        activeKidId: null,
        pagination: { currentPage: 1, itemsPerPage: 10, totalPages: 1 },
        tabs: { activeMainTab: 'inventory', activeInvSubTab: 'inv-equipments', activeWsSubTab: 'ws-refine' },
        embed: { slotGear: null, slotComponent: null },
        itemModalContext: null
    },
    // ... (outros estados como 'expedition' e 'combat' virão aqui)
};

// --- Funções "Mutators" ---
// Funções públicas que o cérebro (main.js) pode chamar para MUDAR o estado

function initializeWallet() {
    state.player.kidz = JSON.parse(JSON.stringify(MOCK_WALLET)); // Clona a carteira
    state.player.inventory.equipment = generateStartingInventory(); // Gera equipamentos
    console.log("GameState: Wallet Initialized.", state.player);
}

function setScreen(screenId) {
    state.currentScreen = screenId;
    console.log(`GameState: Screen changed to ${screenId}`);
}

function getPlayerTezerium() {
    return state.player.tezerium;
}

// Exporta o estado (como 'getter') e as funções que podem mudá-lo
export const GameState = {
    state, // Acesso "somente leitura" ao estado
    
    // Funções de Ação
    initializeWallet,
    setScreen,
    getPlayerTezerium
    // ... (vamos adicionar mais funções como 'setActiveKid', 'startExpedition' aqui)
};
