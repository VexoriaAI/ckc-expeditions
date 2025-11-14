/* ====================================================================
// SRC/CORE/GAMESTATE.JS (O Coração)
// Gerencia o estado de todo o jogo.
// ==================================================================== */

// Importa os dados brutos para inicialização
import { MOCK_WALLET } from '../../database/mock_wallet.js';
import { EQUIPMENT_DB } from '../../database/equipment.js';
import { COMPONENTS_DB } from '../../database/components.js';

// Função auxiliar para gerar inventário inicial
function generateStartingInventory() {
    if (!EQUIPMENT_DB) return [];
    return Object.values(EQUIPMENT_DB).map((item, index) => {
        const slots = Array(item.slots_total || 3).fill({ component: null });
        return {
            instance_id: `inst_${index + 1000}`, item_id: item.id, name: item.name, level: 1,
            slot: item.slot, synergy: item.synergy, stats: { ...item.base_stats },
            icon: item.icon, embed_slots: slots, slots_unlocked: item.slots_unlocked || 1
        };
    });
}

// O estado inicial privado
const state = {
    currentScreen: 'logged-out-screen',
    player: {
        tezerium: 1000,
        inventory: {
            materials: { "mat_scrap": 100, "mat_water": 50, "mat_metal": 10 },
            components: { "comp_def_1": 5, "comp_dmg_1": 5 },
            equipment: []
        },
        kidz: []
    },
    hub: {
        activeKidId: null,
        pagination: { currentPage: 1, itemsPerPage: 10, totalPages: 1, filteredKidz: [] },
        tabs: { activeMainTab: 'inventory', activeInvSubTab: 'inv-equipments', activeWsSubTab: 'ws-refine' },
        embed: { slotGear: null, slotComponent: null },
        itemModalContext: null
    },
    expedition: {
        // ... (será preenchido quando o jogo começar)
    },
    combat: {
        // ... (será preenchido quando o combate começar)
    }
};

// Funções públicas ("Mutations") que o Cérebro (main.js) pode chamar
const GameState = {
    // Getter para ler o estado
    get: () => state,

    // Função para inicializar os dados do jogador
    initializeWallet: () => {
        state.player.kidz = JSON.parse(JSON.stringify(MOCK_WALLET));
        state.player.inventory.equipment = generateStartingInventory();
        console.log("GameState: Carteira e Inventário inicializados.");
    },

    // Função para mudar de tela
    setScreen: (screenId) => {
        state.currentScreen = screenId;
    },
    
    // Função para definir o Kid ativo
    setActiveKid: (kidId) => {
        state.hub.activeKidId = kidId;
        console.log(`GameState: Kid Ativo definido como ${kidId}`);
    },
    
    // Getter para um dado específico
    getPlayerTezerium: () => {
        return state.player.tezerium;
    }
    
    // (Vamos adicionar mais funções aqui conforme necessário, 
    //  como 'startExpedition', 'endCombat', etc.)
};

// Exporta o módulo para que o Cérebro possa importá-lo
export default GameState;
