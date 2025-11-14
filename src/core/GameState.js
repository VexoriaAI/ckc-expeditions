/* ====================================================================
// CORE: GameState.js
// O Coração - Singleton que armazena o estado atual de todo o jogo.
// É a única fonte de verdade (Single Source of Truth) para os dados dinâmicos.
// ==================================================================== */

// Estado inicial (Schema Base)
const INITIAL_STATE = {
    // 1. Controle de Fluxo
    currentScreen: 'logged-out-screen', // 
    isWalletConnected: false,

    // 2. Dados do Jogador
    currentPlayerKidId: null, // ID do Kid NFT selecionado (usado na hub-preparation-screen) [cite: 271]

    // 3. Inventário (Estrutura definida pelo GDD)
    playerInventory: {
        // Formato: { item_id: quantidade } (para materiais empilháveis)
        materials: {}, // [cite: 291]
        
        // Formato: [ { instance_id: 1, item_id: 'eq_id', slots: [...] } ] (para itens únicos com estado)
        equipment: [], // [cite: 291] 
        components: [], // [cite: 291]
        
        // Itens consumíveis (ex: AP Refill)
        shopItems: {}, // [cite: 291]
    },

    // 4. Dados da Expedição (Preenchidos ao iniciar a game-screen)
    expedition: {
        kidStats: null, // Stats calculados do Kid + Equipamentos
        currentLocation: null,
        AP: 0, // Pontos de Ação [cite: 316]
        MP: 0, // Pontos de Movimento [cite: 314]
        log: [],
    }
};

// A instância real do estado que será manipulada
let gameState = { ...INITIAL_STATE };

/**
 * Retorna uma cópia (apenas para leitura) do estado atual do jogo.
 * @returns {object} O estado atual.
 */
export const getState = () => {
    // Retorna uma cópia para evitar modificações acidentais fora das funções de update
    return JSON.parse(JSON.stringify(gameState));
};

/**
 * Atualiza o estado do jogo com novas propriedades.
 * Usado para modificações mais complexas (ex: adicionar um item ao inventário).
 * @param {object} updates - Objeto contendo as chaves e novos valores para o estado.
 */
export const updateState = (updates) => {
    // Lógica para mesclar o estado de forma profunda, se necessário.
    // Por enquanto, uma mesclagem rasa é suficiente:
    gameState = { ...gameState, ...updates };
    
    // CRÍTICO: Notificar o UIManager sobre a mudança de estado após qualquer update
    // (Esta função de notificação será anexada em main.js para evitar dependência circular)
    if (window.onGameStateChange) {
        window.onGameStateChange(gameState);
    }
};

/**
 * Função utilitária para mudar apenas a tela.
 * @param {string} screenId - O ID da nova tela (ex: 'hub-selection-screen').
 */
export const setCurrentScreen = (screenId) => {
    updateState({ currentScreen: screenId });
};

/**
 * Reinicia o estado para os valores iniciais (útil para logout ou fim de jogo).
 */
export const resetState = () => {
    gameState = { ...INITIAL_STATE };
    setCurrentScreen(INITIAL_STATE.currentScreen);
};
