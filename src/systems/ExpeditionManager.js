/* ====================================================================
// (NOVO) SYSTEM: ExpeditionManager.js
// Contém a lógica para iniciar, processar e terminar expedições.
// ==================================================================== */

import { getState, updateState, setCurrentScreen } from '../core/GameState.js';
import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; // Para obter dados base do Kid
import { STATIC_MAP_DATA } from '../../database/maps.js'; // Para encontrar o spawn
import { EquipmentSystem } from './EquipmentSystem.js';
import { calculateFinalStats } from './StatCalculationSystem.js';

/**
 * (Helper) Encontra os dados estáticos do Kid selecionado.
 */
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * (Helper) Encontra o local de spawn inicial no mapa.
 * (Procura o bioma 'CYBERCITY' ou o primeiro item do mapa).
 */
const getSpawnPoint = () => {
    let spawn = STATIC_MAP_DATA.find(tile => tile.biome === 'CYBERCITY');
    if (!spawn) {
        spawn = STATIC_MAP_DATA[0]; // Fallback
    }
    return { q: spawn.q, r: spawn.r };
};


export const ExpeditionManager = {

    /**
     * Inicia uma nova expedição.
     * Calcula os stats finais, define AP/MP e move para a 'game-screen'.
     */
    startExpedition: function() {
        const state = getState();
        const kidId = state.currentPlayerKidId;
        
        if (!kidId) {
            console.error("ExpeditionManager: Tentativa de iniciar expedição sem Kid selecionado.");
            return;
        }

        const kidStaticData = getKidDataById(kidId);
        const equippedItems = EquipmentSystem.getEquippedItems();
        
        // 1. Calcula os stats finais para a expedição
        const finalStats = calculateFinalStats(kidStaticData, equippedItems);

        // 2. Define a posição inicial (Spawn)
        const startPosition = getSpawnPoint();

        // 3. Define o objeto 'expedition' para o GameState
        const expeditionData = {
            kidStats: finalStats, // Stats completos (para combate)
            currentHP: finalStats.maxHP,
            maxHP: finalStats.maxHP,
            
            currentAP: finalStats.AP, // Pontos de Ação (Ações)
            maxAP: finalStats.AP,
            
            currentMP: finalStats.speed, // Pontos de Movimento (Movimento)
            maxMP: finalStats.speed,
            
            currentDay: 1, // Turno
            maxDays: 10,   // Regra do GDD
            
            position: startPosition, // Posição (q, r)
            
            log: [`Day 1: Expedition started in the ${STATIC_MAP_DATA.find(t => t.q === startPosition.q && t.r === startPosition.r).biome}.`],
            
            foundLoot: { // Loot acumulado
                materials: {},
                components: [],
                equipment: []
            }
        };

        // 4. Atualiza o GameState e muda a tela
        updateState({ expedition: expeditionData });
        setCurrentScreen('game-screen');
    }

    // (Futuro: movePlayer(q, r))
    // (Futuro: executeAction(actionType))
    // (Futuro: endDay())
    // (Futuro: endExpedition())
};
