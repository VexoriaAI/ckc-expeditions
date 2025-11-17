/* ====================================================================
// SYSTEM: ExpeditionManager.js
// UPDATE: (CORREÇÃO DE LÓGICA) Altera o 'getSpawnPoint()'
// de 'CYBERCITY' para 'WASTELAND' para alinhar com o drops.js.
// ==================================================================== */

import { getState, updateState, setCurrentScreen } from '../core/GameState.js';
import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 
import { STATIC_MAP_DATA, MAP_BIOMES } from '../../database/maps.js';
import { DROP_TABLES } from '../../database/drops.js'; 
import { EquipmentSystem } from './EquipmentSystem.js';
import { calculateFinalStats } from './StatCalculationSystem.js';

/**
 * (Helper) Encontra os dados estáticos do Kid selecionado.
 */
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * (Helper - CORRIGIDO) Encontra o local de spawn inicial no mapa.
 * (Procura o bioma 'WASTELAND' como ponto de partida).
 */
const getSpawnPoint = () => {
    // (CORRIGIDO) O jogador deve começar na Wasteland, não em CyberCity.
    let spawn = STATIC_MAP_DATA.find(tile => tile.biome === 'WASTELAND');
    if (!spawn) {
        spawn = STATIC_MAP_DATA[0]; // Fallback
    }
    return { q: spawn.q, r: spawn.r };
};

/**
 * (Helper) Retorna a entrada de bioma (ex: 'BURNING_RIDGE') para a posição atual.
 */
const getCurrentBiomeKey = (position) => {
    const tile = STATIC_MAP_DATA.find(t => t.q === position.q && t.r === position.r);
    return tile ? tile.biome : 'WASTELAND'; // Padrão para Wasteland se não encontrado
};

/**
 * (Helper) Rola um número aleatório (ex: para loot)
 */
const rollDice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const ExpeditionManager = {

    /**
     * Inicia uma nova expedição.
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
        const finalStats = calculateFinalStats(kidStaticData, equippedItems);
        
        // (CORRIGIDO) Pega o spawn point da Wasteland
        const startPosition = getSpawnPoint();
        const startBiomeKey = getCurrentBiomeKey(startPosition);

        const expeditionData = {
            kidStats: finalStats, 
            currentHP: finalStats.maxHP,
            maxHP: finalStats.maxHP,
            currentAP: finalStats.AP, 
            maxAP: finalStats.AP,
            currentMP: finalStats.speed, 
            maxMP: finalStats.speed,
            currentDay: 1, 
            maxDays: 10,
            position: startPosition, 
            log: [`Day 1: Expedition started in the ${MAP_BIOMES[startBiomeKey].name}.`],
            foundLoot: { 
                materials: {},
                components: [],
                equipment: []
            }
        };

        updateState({ expedition: expeditionData });
        setCurrentScreen('game-screen');
    },

    /**
     * Executa a ação "Collect Resources".
     * Consome 1 AP, rola a tabela de loot "collect" e atualiza o estado.
     */
    collectResources: function() {
        const state = getState();
        let { expedition } = state; // Pega uma cópia do objeto expedição

        // 1. Checagem de Custo de AP
        if (expedition.currentAP < 1) {
            console.warn("Collect: Not enough AP.");
            expedition.log.unshift(`Not enough AP to collect.`); // Adiciona ao log
            updateState({ expedition: expedition }); // Atualiza apenas o log
            return;
        }
        expedition.currentAP -= 1; // Paga o custo

        // 2. Lógica de Loot
        const biomeKey = getCurrentBiomeKey(expedition.position);
        const lootTable = DROP_TABLES[biomeKey]?.collect;

        if (!lootTable || lootTable.length === 0) {
            // (Esta é a mensagem de erro que você viu)
            console.error(`Collect: Nenhuma tabela 'collect' encontrada para o bioma ${biomeKey}.`);
            expedition.log.unshift(`Cannot collect here.`);
            updateState({ expedition: expedition });
            return;
        }

        let lootFoundLog = "Collected: ";
        
        // 3. Rola cada item na tabela de coleta
        lootTable.forEach(entry => {
            const { item, quantity } = entry;
            const amountFound = rollDice(quantity[0], quantity[1]);
            
            if (amountFound > 0) {
                // Adiciona ao inventário da expedição
                expedition.foundLoot.materials[item] = (expedition.foundLoot.materials[item] || 0) + amountFound;
                lootFoundLog += `${amountFound}x ${item}, `;
            }
        });

        // 4. Atualiza o Log e o Estado
        if (lootFoundLog === "Collected: ") {
             expedition.log.unshift("Collected... but found nothing.");
        } else {
             expedition.log.unshift(lootFoundLog.slice(0, -2)); // Remove a vírgula final
        }
        updateState({ expedition: expedition });
    }

    // (Futuro: investigate())
    // (Futuro: searchForEnemy())
    // (Futuro: endDay())
    // (Futuro: endExpedition())
};
