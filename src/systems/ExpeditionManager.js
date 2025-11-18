/* ====================================================================
// SYSTEM: ExpeditionManager.js
// UPDATE: (Refatoração de Mapa - Node-Based)
// - startExpedition() agora usa SPAWN_NODE_ID (em vez de {q,r}).
// - Adiciona a nova lógica 'moveToNode()'.
// ==================================================================== */

import { getState, updateState, setCurrentScreen, INITIAL_STATE } from '../core/GameState.js';
import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 
// (ATUALIZADO) Importa a nova arquitetura de Nós
import { MAP_NODES, MAP_BIOMES, SPAWN_NODE_ID } from '../../database/maps.js';
import { DROP_TABLES } from '../../database/drops.js'; 
import { SPAWN_LOGIC } from '../../database/spawn_logic.js';
import { ENEMIES_BY_BIOME } from '../../database/enemies.js'; 
import { EquipmentSystem } from './EquipmentSystem.js';
import { calculateFinalStats } from './StatCalculationSystem.js';

// --- Helpers (Atualizados para Nós) ---

const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * (ATUALIZADO) Retorna o ID do nó de spawn (Ex: 'wasteland_crossroads')
 */
const getSpawnNodeId = (kidTribe) => {
    // (Futuro: Lógica de spawn aleatório baseado na Tribo)
    // Por enquanto, todos começam no SPAWN_NODE_ID definido em maps.js
    return SPAWN_NODE_ID; 
};

/**
 * (ATUALIZADO) Retorna a chave do Bioma (ex: 'WASTELAND') para o Nó atual.
 */
const getCurrentBiomeKey = (nodeId) => {
    const node = MAP_NODES.find(n => n.id === nodeId);
    return node ? node.biome : 'WASTELAND'; // Padrão
};

/**
 * (Helper) Rola um número aleatório (ex: para loot)
 */
const rollDice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * (NOVO) Calcula o custo de MP entre dois nós.
 * (Por enquanto, o custo é sempre 1 MP, conforme sua regra).
 */
const calculateMPCost = (fromNodeId, toNodeId) => {
    // (Futuro: Podemos adicionar lógica de distância (x,y) aqui)
    return 1; // Custo fixo de 1 MP por movimento
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
        
        // (ATUALIZADO) Define o nó de spawn
        const startNodeId = getSpawnNodeId(kidStaticData.tribe);
        const startBiomeKey = getCurrentBiomeKey(startNodeId);

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
            
            position: { nodeId: startNodeId }, // (ATUALIZADO)
            
            log: [`Day 1: Expedition started at ${MAP_BIOMES[startBiomeKey].name}.`],
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
     * (NOVO) Move o jogador para um novo nó adjacente.
     * @param {string} targetNodeId - O ID do nó para onde mover.
     */
    moveToNode: function(targetNodeId) {
        const state = getState();
        let { expedition } = state; 

        const currentNode = MAP_NODES.find(n => n.id === expedition.position.nodeId);
        const targetNode = MAP_NODES.find(n => n.id === targetNodeId);

        // 1. O nó existe?
        if (!targetNode) {
            console.error(`MoveToNode: Nó alvo "${targetNodeId}" não encontrado.`);
            return;
        }

        // 2. O nó está conectado ao nó atual?
        if (!currentNode || !currentNode.connections.includes(targetNodeId)) {
            expedition.log.unshift(`Cannot move there directly.`);
            updateState({ expedition: expedition });
            return;
        }

        // 3. O jogador tem MP suficiente?
        const cost = calculateMPCost(currentNode.id, targetNodeId);
        if (expedition.currentMP < cost) {
            expedition.log.unshift(`Not enough MP to move. (Costs ${cost} MP)`);
            updateState({ expedition: expedition });
            return;
        }

        // 4. Paga o custo e move
        expedition.currentMP -= cost;
        expedition.position.nodeId = targetNodeId; // Atualiza a Posição
        
        const newBiome = MAP_BIOMES[targetNode.biome];
        expedition.log.unshift(`Moved to ${targetNode.name}. (Biome: ${newBiome.name})`);

        updateState({ expedition: expedition });
    },

    /**
     * Executa a ação "Collect Resources".
     */
    collectResources: function() {
        const state = getState();
        let { expedition, uiState } = state; 

        if (expedition.currentAP < 1) {
            expedition.log.unshift(`Not enough AP to collect.`);
            updateState({ expedition: expedition }); 
            return;
        }
        expedition.currentAP -= 1; 

        // (ATUALIZADO) Pega o bioma pelo ID do Nó
        const biomeKey = getCurrentBiomeKey(expedition.position.nodeId);
        const lootTable = DROP_TABLES[biomeKey]?.collect;

        if (!lootTable || lootTable.length === 0) {
            expedition.log.unshift(`Cannot collect here.`);
            updateState({ expedition: expedition });
            return;
        }

        let lootFoundLog = "Collected: ";
        let logMessage = "Collected... but found nothing."; 
        let itemsFound = []; 

        lootTable.forEach(entry => {
            const { item, quantity } = entry;
            const amountFound = rollDice(quantity[0], quantity[1]);
            
            if (amountFound > 0) {
                expedition.foundLoot.materials[item] = (expedition.foundLoot.materials[item] || 0) + amountFound;
                lootFoundLog += `${amountFound}x ${item}, `;
                itemsFound.push({ itemId: item, quantity: amountFound }); 
            }
        });

        if (lootFoundLog !== "Collected: ") {
             logMessage = lootFoundLog.slice(0, -2); 
        }
        
        expedition.log.unshift(logMessage);
        updateState({ expedition: expedition });
        
        if (!uiState.skipAnimations) {
            openModal(
                'MODAL_COLLECT_RESULT', 
                { type: 'collect_success', message: logMessage, items: itemsFound },
                true // Auto-fecha
            );
        }
    },

    /**
     * Executa a ação "Investigate".
     */
    investigate: function() {
        const state = getState();
        let { expedition, uiState } = state; 

        if (expedition.currentAP < 1) {
            expedition.log.unshift(`Not enough AP to investigate.`);
            updateState({ expedition: expedition });
            return;
        }
        expedition.currentAP -= 1;

        const biomeKey = getCurrentBiomeKey(expedition.position.nodeId);
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

        let logMessage = '';

        switch (eventResult.type) {
            case "nothing":
                logMessage = "Investigated the area... but found nothing.";
                expedition.log.unshift(logMessage);
                updateState({ expedition: expedition });
                
                if (!uiState.skipAnimations) {
                    openModal('MODAL_INVESTIGATE_RESULT', { type: 'investigate_nothing', message: logMessage, items: [] }, true);
                }
                break;
            
            case "ambush":
                logMessage = `Ambush! A ${eventResult.enemyRarity} enemy attacks!`;
                expedition.log.unshift(logMessage);
                updateState({ expedition: expedition });
                alert("COMBATE INICIADO (Placeholder)");
                break;

            case "loot":
                const lootTable = DROP_TABLES[biomeKey]?.investigate;
                if (!lootTable) {
                     logMessage = "Found a quiet spot... but nothing of value.";
                     expedition.log.unshift(logMessage);
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
                    logMessage = "Found a hidden cache... but it was empty.";
                    expedition.log.unshift(logMessage);
                    updateState({ expedition: expedition });
                    
                    if (!uiState.skipAnimations) {
                         openModal('MODAL_INVESTIGATE_RESULT', { type: 'investigate_nothing', message: logMessage, items: [] }, true);
                    }
                } else {
                    const { item, quantity } = lootResult;
                    const amountFound = rollDice(quantity[0], quantity[1]);
                    let itemsFound = [];
                    
                    if (amountFound > 0) {
                        expedition.foundLoot.materials[item] = (expedition.foundLoot.materials[item] || 0) + amountFound;
                        logMessage = `Success! Found ${amountFound}x ${item} (${lootResult.type})!`;
                        expedition.log.unshift(logMessage);
                        itemsFound.push({ itemId: item, quantity: amountFound });
                    }
                    updateState({ expedition: expedition });

                    if (!uiState.skipAnimations) {
                        openModal('MODAL_INVESTIGATE_RESULT', { type: 'investigate_success', message: logMessage, items: itemsFound }, true);
                    }
                }
                break;
        }
    },

    /**
     * Executa a ação "Search For Enemy".
     */
    searchForEnemy: function() {
        const state = getState();
        let { expedition } = state;

        if (expedition.currentAP < 2) { 
            expedition.log.unshift(`Not enough AP to search for enemies.`);
            updateState({ expedition: expedition });
            return;
        }
        expedition.currentAP -= 2; 

        const biomeKey = getCurrentBiomeKey(expedition.position.nodeId);
        const enemyTable = ENEMIES_BY_BIOME[biomeKey];
        
        if (!enemyTable || !enemyTable.common) {
            expedition.log.unshift(`The area seems quiet... for now.`);
            updateState({ expedition: expedition });
            return;
        }
        
        const enemyName = enemyTable.common.name;
        expedition.log.unshift(`You found a ${enemyName}! Combat initiated.`);
        updateState({ expedition: expedition });

        alert(`COMBATE INICIADO vs ${enemyName} (Placeholder)`);
    },

    /**
     * Finaliza o turno (dia) atual.
     */
    endDay: function() {
        const state = getState();
        let { expedition } = state;

        if (expedition.currentDay >= expedition.maxDays) {
            expedition.log.unshift("This was the final day. The expedition is ending.");
            updateState({ expedition: expedition }); 
            this.endExpedition(); 
            return;
        }

        expedition.currentDay += 1;
        expedition.currentAP = expedition.maxAP;
        expedition.currentMP = expedition.maxMP;
        expedition.log.unshift(`Day ${expedition.currentDay}: AP and MP have been restored.`);
        
        updateState({ expedition: expedition });
    },

    /**
     * Encerra a expedição manualmente.
     */
    endExpedition: function() {
        const state = getState();
        let { expedition, playerInventory } = state;

        if (!expedition) return; 

        // 1. Salva o Loot
        for (const matId in expedition.foundLoot.materials) {
            const amount = expedition.foundLoot.materials[matId];
            playerInventory.materials[matId] = (playerInventory.materials[matId] || 0) + amount;
        }
        playerInventory.equipment = playerInventory.equipment.concat(expedition.foundLoot.equipment);
        playerInventory.components = playerInventory.components.concat(expedition.foundLoot.components);

        const lootCount = Object.keys(expedition.foundLoot.materials).length;
        const logMessage = lootCount > 0 ? "Expedition ended. Loot secured in main inventory." : "Expedition ended. No loot found.";
        
        alert(logMessage); 

        // 4. Reseta o estado da expedição e retorna ao Hub
        updateState({ 
            playerInventory: playerInventory,
            expedition: INITIAL_STATE.expedition 
        });
        setCurrentScreen('hub-preparation-screen');
    }
};
