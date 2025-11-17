/* ====================================================================
// SYSTEM: ExpeditionManager.js
// UPDATE: Adiciona a lógica da ação 'searchForEnemy()'.
// (Consome 2 AP, lê enemies.js e simula um combate).
// ==================================================================== */

import { getState, updateState, setCurrentScreen } from '../core/GameState.js';
import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 
import { STATIC_MAP_DATA, MAP_BIOMES } from '../../database/maps.js';
import { DROP_TABLES } from '../../database/drops.js'; 
import { SPAWN_LOGIC } from '../../database/spawn_logic.js';
import { ENEMIES_BY_BIOME } from '../../database/enemies.js'; // (NOVO) Importa Inimigos
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
             expedition.log.unshift(lootFoundLog.slice(0, -2)); 
        }
        updateState({ expedition: expedition });
    },

    /**
     * Executa a ação "Investigate".
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
        const eventRoll = rollDice(1, 100) + luck; 

        let eventResult = eventTable[eventTable.length - 1]; 
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
                const lootTable = DROP_TABLES[biomeKey]?.investigate;
                if (!lootTable) {
                     expedition.log.unshift("Found a quiet spot... but nothing of value.");
                     updateState({ expedition: expedition });
                     return;
                }
                
                const lootRoll = rollDice(1, 100) + luck; 
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
                    const { item, quantity } = lootResult;
                    const amountFound = rollDice(quantity[0], quantity[1]);
                    
                    if (amountFound > 0) {
                        expedition.foundLoot.materials[item] = (expedition.foundLoot.materials[item] || 0) + amountFound;
                        expedition.log.unshift(`Success! Found ${amountFound}x ${item} (${lootResult.type})!`);
                    }
                    updateState({ expedition: expedition });
                }
                break;
        }
    },

    /**
     * (NOVO) Executa a ação "Search For Enemy".
     * Consome 2 AP e garante um combate.
     */
    searchForEnemy: function() {
        const state = getState();
        let { expedition } = state;

        // 1. Checagem de Custo de AP
        if (expedition.currentAP < 2) { // Custo de 2 AP
            expedition.log.unshift(`Not enough AP to search for enemies.`);
            updateState({ expedition: expedition });
            return;
        }
        expedition.currentAP -= 2; // Paga o custo

        // 2. Lógica de Spawn (Garante um inimigo comum)
        const biomeKey = getCurrentBiomeKey(expedition.position);
        const enemyTable = ENEMIES_BY_BIOME[biomeKey];
        
        if (!enemyTable || !enemyTable.common) {
            console.error(`SearchEnemy: Nenhuma tabela 'common' encontrada para o bioma ${biomeKey} em enemies.js.`);
            expedition.log.unshift(`The area seems quiet... for now.`);
            updateState({ expedition: expedition });
            return;
        }
        
        // (Lógica simples: 'Search' sempre encontra um inimigo 'common')
        const enemyName = enemyTable.common.name;

        // 3. Atualiza o Log e Inicia o Combate (Simulado)
        expedition.log.unshift(`You found a ${enemyName}! Combat initiated.`);
        updateState({ expedition: expedition });

        // (Futuro: Chamar CombatManager.startCombat('common'))
        alert(`COMBATE INICIADO vs ${enemyName} (Placeholder)`);
    }

    /**
     * (NOVO) Finaliza o turno (dia) atual.
     * Restaura AP/MP. Se for o último dia, encerra a expedição.
     */
    endDay: function() {
        const state = getState();
        let { expedition } = state;

        // Verifica se é o último dia
        if (expedition.currentDay >= expedition.maxDays) {
            expedition.log.unshift("This was the final day. The expedition is ending.");
            updateState({ expedition: expedition }); // Atualiza o log antes de encerrar
            this.endExpedition(); // Chama a função de encerramento
            return;
        }

        // Avança o dia e restaura AP/MP
        expedition.currentDay += 1;
        expedition.currentAP = expedition.maxAP;
        expedition.currentMP = expedition.maxMP;
        expedition.log.unshift(`Day ${expedition.currentDay}: AP and MP have been restored.`);
        
        updateState({ expedition: expedition });
    },

    /**
     * (NOVO) Encerra a expedição manualmente.
     * Salva o loot encontrado no inventário principal e retorna ao Hub.
     */
    endExpedition: function() {
        const state = getState();
        let { expedition, playerInventory } = state;

        if (!expedition) return; // Proteção

        // 1. Salva o Loot (Materiais)
        for (const matId in expedition.foundLoot.materials) {
            const amount = expedition.foundLoot.materials[matId];
            playerInventory.materials[matId] = (playerInventory.materials[matId] || 0) + amount;
        }

        // 2. Salva o Loot (Equipamentos e Componentes)
        playerInventory.equipment = playerInventory.equipment.concat(expedition.foundLoot.equipment);
        playerInventory.components = playerInventory.components.concat(expedition.foundLoot.components);

        // 3. Prepara o log
        const lootCount = Object.keys(expedition.foundLoot.materials).length;
        const logMessage = lootCount > 0 ? "Expedition ended. Loot secured in main inventory." : "Expedition ended. No loot found.";
        alert(logMessage); // Feedback temporário

        // 4. Reseta o estado da expedição e retorna ao Hub
        updateState({ 
            playerInventory: playerInventory,
            expedition: INITIAL_STATE.expedition // Reseta o objeto expedition
        });
        setCurrentScreen('hub-preparation-screen');
    }
};
