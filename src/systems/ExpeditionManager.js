/* ====================================================================
// SYSTEM: ExpeditionManager.js
// UPDATE: Adiciona a lógica da ação 'investigate()'.
// (Consome AP, lê spawn_logic.js, aplica Luck, rola drops.js).
// ==================================================================== */

import { getState, updateState, setCurrentScreen } from '../core/GameState.js';
import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 
import { STATIC_MAP_DATA, MAP_BIOMES } from '../../database/maps.js';
import { DROP_TABLES } from '../../database/drops.js';
import { SPAWN_LOGIC } from '../../database/spawn_logic.js'; // (NOVO) Importa as regras de Risco
import { EquipmentSystem } from './EquipmentSystem.js';
import { calculateFinalStats } from './StatCalculationSystem.js';

/**
 * (Helper) Encontra os dados estáticos do Kid selecionado.
 */
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * (Helper) Encontra o local de spawn inicial no mapa (WASTELAND).
 */
const getSpawnPoint = () => {
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
     */
    collectResources: function() {
        const state = getState();
        let { expedition } = state; 

        // 1. Checagem de Custo de AP
        if (expedition.currentAP < 1) {
            expedition.log.unshift(`Not enough AP to collect.`);
            updateState({ expedition: expedition });
            return;
        }
        expedition.currentAP -= 1; // Paga o custo

        // 2. Lógica de Loot
        const biomeKey = getCurrentBiomeKey(expedition.position);
        const lootTable = DROP_TABLES[biomeKey]?.collect;

        if (!lootTable || lootTable.length === 0) {
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
    },

    /**
     * (NOVO) Executa a ação "Investigate".
     * Consome 1 AP, rola a tabela de Risco (spawn_logic) e depois a tabela de Loot (drops).
     */
    investigate: function() {
        const state = getState();
        let { expedition } = state;

        // 1. Checagem de Custo de AP
        if (expedition.currentAP < 1) {
            expedition.log.unshift(`Not enough AP to investigate.`);
            updateState({ expedition: expedition });
            return;
        }
        expedition.currentAP -= 1;

        // 2. Lógica de Evento (Risco)
        const biomeKey = getCurrentBiomeKey(expedition.position);
        const eventTable = SPAWN_LOGIC[biomeKey]?.investigate;
        
        if (!eventTable) {
             console.error(`Investigate: Nenhuma tabela 'investigate' encontrada para o bioma ${biomeKey} em spawn_logic.js.`);
             return;
        }

        const luck = expedition.kidStats.luck || 0;
        const eventRoll = rollDice(1, 100) + luck; // Aplica Sorte

        let eventResult = eventTable[eventTable.length - 1]; // Assume o pior caso (ou 'loot')
        for (const event of eventTable) {
            if (eventRoll <= event.chance) {
                eventResult = event;
                break;
            }
        }

        // 3. Processa o Resultado do Evento
        switch (eventResult.type) {
            case "nothing":
                expedition.log.unshift("Investigated the area... but found nothing.");
                updateState({ expedition: expedition });
                break;
            
            case "ambush":
                expedition.log.unshift(`Ambush! A ${eventResult.enemyRarity} enemy attacks!`);
                updateState({ expedition: expedition });
                // (Futuro: Chamar CombatManager.startCombat(eventResult.enemyRarity))
                alert("COMBATE INICIADO (Placeholder)");
                break;

            case "loot":
                // Se o evento for "loot", nós AGORA rolamos na tabela de loot
                const lootTable = DROP_TABLES[biomeKey]?.investigate;
                if (!lootTable) {
                     expedition.log.unshift("Found a quiet spot... but nothing of value.");
                     updateState({ expedition: expedition });
                     return;
                }
                
                const lootRoll = rollDice(1, 100) + luck; // Sorte se aplica ao loot também
                let lootResult = lootTable[lootTable.length - 1];
                for (const loot of lootTable) {
                    if (lootRoll <= loot.chance) {
                        lootResult = loot;
                        break;
                    }
                }

                if (lootResult.type === 'nothing') {
                    expedition.log.unshift("Found a hidden cache... but it was empty.");
                    updateState({ expedition: expedition });
                } else {
                    // Encontrou loot!
                    const { item, quantity } = lootResult;
                    const amountFound = rollDice(quantity[0], quantity[1]);
                    
                    if (amountFound > 0) {
                        // (Assume que 'investigate' só dropa materiais por enquanto)
                        expedition.foundLoot.materials[item] = (expedition.foundLoot.materials[item] || 0) + amountFound;
                        expedition.log.unshift(`Success! Found ${amountFound}x ${item} (${lootResult.type})!`);
                    }
                    updateState({ expedition: expedition });
                }
                break;
        }
    }

    // (Futuro: searchForEnemy())
    // (Futuro: endDay())
    // (Futuro: endExpedition())
};
