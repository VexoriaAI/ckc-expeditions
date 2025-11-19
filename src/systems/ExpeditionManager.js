/* ====================================================================
// SYSTEM: ExpeditionManager.js
// UPDATE: (CORREÇÃO FINAL DE REGRESSÃO)
// - Usa MAP_NODES e SPAWN_NODE_ID (em vez de STATIC_MAP_DATA).
// - Inclui a vírgula de sintaxe.
// - Inclui toda a lógica de Nós e Combate.
// ==================================================================== */

import { getState, updateState, setCurrentScreen, INITIAL_STATE, openModal } from '../core/GameState.js';
import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 
// (CORRIGIDO) Importa MAP_NODES e SPAWN_NODE_ID
import { MAP_NODES, MAP_BIOMES, SPAWN_NODE_ID } from '../../database/maps.js';
import { DROP_TABLES } from '../../database/drops.js'; 
import { SPAWN_LOGIC } from '../../database/spawn_logic.js';
import { ENEMIES_BY_BIOME } from '../../database/enemies.js'; 
import { EquipmentSystem } from './EquipmentSystem.js';
import { calculateFinalStats } from './StatCalculationSystem.js';
import { CombatSystem } from './CombatSystem.js';

// --- Helpers ---

const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * (ATUALIZADO) Retorna o ID do nó de spawn.
 */
const getSpawnNodeId = (kidTribe) => {
    return SPAWN_NODE_ID; 
};

/**
 * (ATUALIZADO) Retorna a chave do Bioma para o Nó atual.
 */
const getCurrentBiomeKey = (nodeId) => {
    const node = MAP_NODES.find(n => n.id === nodeId);
    return node ? node.biome : 'WASTELAND'; 
};

const rollDice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const calculateMPCost = (fromNodeId, toNodeId) => {
    return 1; 
};


export const ExpeditionManager = {

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
            
            // (ATUALIZADO) Usa nodeId
            position: { nodeId: startNodeId }, 
            
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

    moveToNode: function(targetNodeId) {
        const state = getState();
        let { expedition } = state; 

        const currentNode = MAP_NODES.find(n => n.id === expedition.position.nodeId);
        const targetNode = MAP_NODES.find(n => n.id === targetNodeId);

        if (!targetNode) {
            console.error(`MoveToNode: Nó alvo "${targetNodeId}" não encontrado.`);
            return;
        }

        if (!currentNode || !currentNode.connections.includes(targetNodeId)) {
            expedition.log.unshift(`Cannot move there directly.`);
            updateState({ expedition: expedition });
            return;
        }

        const cost = calculateMPCost(currentNode.id, targetNodeId);
        if (expedition.currentMP < cost) {
            expedition.log.unshift(`Not enough MP to move. (Costs ${cost} MP)`);
            updateState({ expedition: expedition });
            return;
        }

        expedition.currentMP -= cost;
        expedition.position.nodeId = targetNodeId; 
        
        const newBiome = MAP_BIOMES[targetNode.biome];
        expedition.log.unshift(`Moved to ${targetNode.name}. (Biome: ${newBiome.name})`);

        updateState({ expedition: expedition });
    },

    collectResources: function() {
        const state = getState();
        let { expedition, uiState } = state; 

        if (expedition.currentAP < 1) {
            expedition.log.unshift(`Not enough AP to collect.`);
            updateState({ expedition: expedition }); 
            return;
        }
        expedition.currentAP -= 1; 

        // (ATUALIZADO) Usa getCurrentBiomeKey com nodeId
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
                true 
            );
        }
    },

    handleCombatExecution: function(enemyData) {
        const state = getState();
        let { expedition } = state;

        const combatResult = CombatSystem.simulateCombat(expedition.kidStats, enemyData);
        expedition.currentHP = combatResult.playerRemainingHP;

        let lootItems = [];
        
        if (combatResult.victory) {
            expedition.log.unshift(`VICTORY against ${enemyData.name}!`);
            
            if (enemyData.rewards) {
                for (const [itemId, dropRule] of Object.entries(enemyData.rewards)) {
                    if (rollDice(1, 100) <= dropRule.chance) {
                        const qty = rollDice(dropRule.quantity[0], dropRule.quantity[1]);
                        if (qty > 0) {
                            expedition.foundLoot.materials[itemId] = (expedition.foundLoot.materials[itemId] || 0) + qty;
                            lootItems.push({ itemId: itemId, quantity: qty });
                        }
                    }
                }
            }
        } else {
            expedition.log.unshift(`DEFEATED by ${enemyData.name}... barely escaped.`);
        }

        updateState({ expedition: expedition });

        openModal('MODAL_COMBAT_RESULT', {
            type: combatResult.victory ? 'combat_victory' : 'combat_defeat',
            combatLog: combatResult.log,
            enemy: enemyData,
            items: lootItems
        });
    },

    investigate: function() {
        const state = getState();
        let { expedition, uiState } = state; 

        if (expedition.currentAP < 1) {
            expedition.log.unshift(`Not enough AP to investigate.`);
            updateState({ expedition: expedition });
            return;
        }
        expedition.currentAP -= 1;

        // (ATUALIZADO) Usa getCurrentBiomeKey com nodeId
        const biomeKey = getCurrentBiomeKey(expedition.position.nodeId);
        const eventTable = SPAWN_LOGIC[biomeKey]?.investigate;
        
        if (!eventTable) { return; }

        const luck = expedition.kidStats.luck || 0;
        const eventRoll = rollDice(1, 100) + luck; 
        let eventResult = eventTable[eventTable.length - 1]; 
        for (const event of eventTable) { if (eventRoll <= event.chance) { eventResult = event; break; } }

        let logMessage = '';

        switch (eventResult.type) {
            case "nothing":
                logMessage = "Investigated the area... but found nothing.";
                expedition.log.unshift(logMessage);
                updateState({ expedition: expedition });
                if (!uiState.skipAnimations) openModal('MODAL_INVESTIGATE_RESULT', { type: 'investigate_nothing', message: logMessage, items: [] }, true);
                break;
            case "ambush":
                const rarity = eventResult.enemyRarity || 'common';
                const enemyData = ENEMIES_BY_BIOME[biomeKey][rarity];
                if (enemyData) {
                    expedition.log.unshift(`AMBUSH! A ${enemyData.name} attacks!`);
                    updateState({ expedition: expedition });
                    this.handleCombatExecution(enemyData);
                }
                break;
            case "loot":
                const lootTable = DROP_TABLES[biomeKey]?.investigate;
                if (!lootTable) return;
                const lootRoll = rollDice(1, 100) + luck; 
                let lootResult = lootTable[lootTable.length - 1];
                for (const loot of lootTable) { if (lootRoll <= loot.chance) { lootResult = loot; break; } }

                if (lootResult.type === 'nothing') {
                    logMessage = "Found a hidden cache... but it was empty.";
                    expedition.log.unshift(logMessage);
                    updateState({ expedition: expedition });
                    if (!uiState.skipAnimations) openModal('MODAL_INVESTIGATE_RESULT', { type: 'investigate_nothing', message: logMessage, items: [] }, true);
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
                    if (!uiState.skipAnimations) openModal('MODAL_INVESTIGATE_RESULT', { type: 'investigate_success', message: "Loot Found!", items: itemsFound }, true);
                }
                break;
        }
    },

    searchForEnemy: function() {
        const state = getState();
        let { expedition } = state;

        if (expedition.currentAP < 2) { 
            expedition.log.unshift(`Not enough AP to search for enemies.`);
            updateState({ expedition: expedition });
            return;
        }
        expedition.currentAP -= 2; 

        // (ATUALIZADO) Usa getCurrentBiomeKey com nodeId
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

        this.handleCombatExecution(enemyTable.common);
    },

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

    endExpedition: function() {
        const state = getState();
        let { expedition, playerInventory } = state;

        if (!expedition) return; 

        for (const matId in expedition.foundLoot.materials) {
            const amount = expedition.foundLoot.materials[matId];
            playerInventory.materials[matId] = (playerInventory.materials[matId] || 0) + amount;
        }
        playerInventory.equipment = playerInventory.equipment.concat(expedition.foundLoot.equipment);
        playerInventory.components = playerInventory.components.concat(expedition.foundLoot.components);

        const lootCount = Object.keys(expedition.foundLoot.materials).length;
        const logMessage = lootCount > 0 ? "Expedition ended. Loot secured in main inventory." : "Expedition ended. No loot found.";
        
        alert(logMessage); 

        updateState({ 
            playerInventory: playerInventory,
            expedition: INITIAL_STATE.expedition 
        });
        setCurrentScreen('hub-preparation-screen');
    }
};
