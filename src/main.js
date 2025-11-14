/* ====================================================================
// CORE: main.js
// O Cérebro - Ponto de entrada da aplicação.
// Responsável por: Inicializar módulos, coordenar o fluxo de telas e anexar listeners.
// ==================================================================== */

import { getState, setCurrentScreen } from './core/GameState.js';
import { UIManager } from './ui/UIManager.js'; // Será criado no próximo passo
import { MATERIALS_DB } from '../database/materials.js'; // Exemplo de importação de um DB

/**
 * Função responsável por iniciar a aplicação.
 */
function initializeApp() {
    console.log('--- Fase 2: Inicializando CyberKidz - Wasteland Expeditions ---');
    console.log('Arquitetura Modular ES6 Ativa.');

    // 1. Inicializa o UIManager (Ele se prepara para desenhar)
    UIManager.init(); 

    // 2. Anexa o mecanismo de notificação de mudança de estado (Estado -> UI)
    // Usamos uma propriedade global para que o GameState.js possa chamar esta função 
    // sem criar uma dependência circular de módulos (GameState importando UIManager).
    window.onGameStateChange = (newState) => {
        console.log('Estado do Jogo Alterado. Nova Tela:', newState.currentScreen);
        UIManager.renderScreen(newState);
    };

    // 3. Define a primeira tela (inicia o ciclo de renderização)
    // O GameState.js já tem 'logged-out-screen' como padrão.
    const initialState = getState();
    setCurrentScreen(initialState.currentScreen);
    
    // 4. Anexa Event Listeners Globais (exemplo)
    document.getElementById('app-root').addEventListener('click', handleGlobalClick);

    // Exemplo de como usar os dados importados:
    console.log('Total de Materiais Carregados:', Object.keys(MATERIALS_DB).length);
}

/**
 * Trata eventos de clique em toda a aplicação. 
 * Esta é a principal forma como a UI interage com a Lógica/Estado.
 * @param {Event} event - O objeto do evento de clique.
 */
function handleGlobalClick(event) {
    const target = event.target;
    
    // Exemplo: Gerenciamento de cliques que mudam a tela (do logged-out-screen)
    if (target.id === 'btn-connect-wallet') {
        // Lógica futura: Tentar conectar a carteira
        console.log('Clique: Conectar Carteira');
        // Por enquanto, apenas simula a mudança para a próxima tela
        setCurrentScreen('hub-selection-screen'); 
    } else if (target.id === 'btn-play-demo') {
        console.log('Clique: Jogar Demonstração');
        // Lógica futura: Carregar dados de demonstração
        setCurrentScreen('hub-selection-screen');
    }
    
    // **Atenção:** Mais listeners específicos para outras telas serão anexados ou 
    // delegados conforme o UIManager renderiza os elementos.
}


// Inicia o aplicativo quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', initializeApp);
