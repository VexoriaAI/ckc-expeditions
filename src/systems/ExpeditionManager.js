/* ====================================================================
// SYSTEM: ExpeditionManager.js
// UPDATE: (Fase 4.0 - Passo 4.3)
// - Implementa 'travelToBiome' para trocar de mapa dinamicamente.
// - Consome MP e gera nova instância de mapa.
// ==================================================================== */

import { getState, updateState, setCurrentScreen, INITIAL_STATE, openModal } from '../core/GameState.js';
import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 
import { MAP_NODES, MAP_BIOMES, SPAWN_NODE_ID } from '../../database/maps.js';
import { DROP_TABLES } from '../../database/drops.js'; 
import { SPAWN_LOGIC } from '../../database/spawn_logic.js';
import { ENEMIES_BY_BIOME } from '../../database/enemies.js'; 
import { EquipmentSystem } from './EquipmentSystem.js';
import { calculateFinalStats } from './StatCalculationSystem.js';
import { CombatSystem } from './CombatSystem.js'; 
import { MapGenerator } from './MapGenerator.js';

// --- Helpers ---

const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

const getSpawnNodeId = (kidTribe) => {
    return SPAWN_NODE_ID; 
};

// Helper para pegar o nome/bioma do nó atual de forma segura
const getCurrentBiomeKey = (expedition) => {
    if (!expedition || !expedition.currentMap) return 'WASTELAND';
    return expedition.currentMap.id;
};

const getCurrentNode = (expedition) => {
    if (!expedition || !expedition.currentMap || !expedition.position) return null;
    return expedition.currentMap.nodes.find(n => n.id === expedition.position.nodeId);
};

const rollDice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const calculateMPCost = (nodeA, nodeB) => {
    return 1; 
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
        
        // 1. Mapeamento de Tribo -> Bioma Inicial
        const TRIBE_HOME_BIOMES = {
            'VOLCANICS': 'BURNING_RIDGE',
            'RADIOACTIVES': 'LAKE_RANCID',
            'NOCTURNALS': 'ANCIENT_METROPOLIS',
            'UNDERGROUNDERS': 'ABANDONED_MINES',
            'REPTILIANS': 'COVENANT_SWAMP'
        };

        const startBiomeId = TRIBE_HOME_BIOMES[kidStaticData.tribe] || 'WASTELAND';

        // 2. Gera o Mapa Procedural
        const mapInstance = MapGenerator.generateBiomeMap(startBiomeId);
        
        // 3. Define o Spawn Point
        const startNodeId = MapGenerator.getRandomSpawnNode(mapInstance);
        
        const startNode = mapInstance.nodes.find(n => n.id === startNodeId);
        const biomeName = mapInstance.name; 

        const expeditionData = {
            kidStats: finalStats, 
            currentHP: finalStats.maxHP,
            maxHP: finalStats.maxHP,
            currentAP: finalStats.ap || 0, 
            maxAP: finalStats.ap || 0,
            currentMP: finalStats.speed || 0, 
            maxMP: finalStats.speed || 0,
            currentDay: 1, 
            maxDays: 10,
            
            currentMap: mapInstance,
            position: { nodeId: startNodeId }, 
            
            log: [`Day 1: Dropped into ${biomeName} at ${startNode.name}.`],
            foundLoot: { materials: {}, components: [], equipment: [] }
        };

        updateState({ expedition: expeditionData });
        setCurrentScreen('game-screen');
    },

    /**
     * Move o jogador para um novo nó dentro do mapa atual.
     */
    moveToNode: function(targetNodeId) {
        const state = getState();
        let { expedition } = state; 
        
        if (!expedition.currentMap) return;

        const currentNode = getCurrentNode(expedition);
        const targetNode = expedition.currentMap.nodes.find(n => n.id === targetNodeId);

        if (!targetNode) return;

        // 1. Se clicar no PRÓPRIO nó e for TRANSIT, abre modal
        if (targetNodeId === expedition.position.nodeId) {
            if (currentNode.type === 'TRANSIT') {
                openModal('MODAL_TRAVEL_CONFIRM', { 
                    targetBiomeId: currentNode.targetBiome,
                    currentMp: expedition.currentMP 
                });
            }
            return; 
        }

        // 2. Verifica conexão
        if (!currentNode.connections.includes(targetNodeId)) {
            expedition.log.unshift(`Cannot move there directly.`);
            updateState({ expedition: expedition });
            return;
        }

        // 3. Verifica custo
        const cost = calculateMPCost(currentNode, targetNode);
        if (expedition.currentMP < cost) {
            expedition.log.unshift(`Not enough MP to move. (Costs ${cost} MP)`);
            updateState({ expedition: expedition });
            return;
        }

        // 4. Move
        expedition.currentMP -= cost;
        expedition.position.nodeId = targetNodeId; 
        
        expedition.log.unshift(`Moved to ${targetNode.name}.`);
        
        if (targetNode.type === 'TRANSIT') {
            expedition.log.unshift(`You reached a Transit Point. Click again to travel.`);
        }

        updateState({ expedition: expedition });
    },

    /**
     * (IMPLEMENTADO) Viaja para um novo bioma.
     * Consome 2 MP e gera um novo mapa.
     */
    travelToBiome: function(targetBiomeId) {
        const state = getState();
        let { expedition } = state;
        const TRAVEL_COST = 2;

        // 1. Validação de MP
        if (expedition.currentMP < TRAVEL_COST) {
            expedition.log.unshift(`Not enough MP to travel between biomes (Cost: ${TRAVEL_COST}).`);
            updateState({ expedition: expedition });
            return;
        }

        // 2. Gera o Novo Mapa
        const newMapInstance = MapGenerator.generateBiomeMap(targetBiomeId);
        if (!newMapInstance) {
            console.error(`Failed to generate map for ${targetBiomeId}`);
            return;
        }

        // 3. Define Spawn no Novo Mapa
        const startNodeId = MapGenerator.getRandomSpawnNode(newMapInstance);
        const startNode = newMapInstance.nodes.find(n => n.id === startNodeId);

        // 4. Aplica Mudanças
        expedition.currentMP -= TRAVEL_COST;
        expedition.currentMap = newMapInstance;
        expedition.position.nodeId = startNodeId;

        expedition.log.unshift(`Traveled to ${newMapInstance.name}. Landed at ${startNode.name}.`);
        
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

        const currentNode = getCurrentNode(expedition);
        // Usa o subtipo do nó para definir a tabela de loot
        const nodeType = currentNode.subtype; 
        const lootTable = DROP_TABLES[nodeType]?.collect;

        if (!lootTable || lootTable.length === 0) {
            expedition.log.unshift(`Nothing to collect at ${currentNode.name}.`);
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

        if (lootFoundLog !== "Collected: ") { logMessage = lootFoundLog.slice(0, -2); }
        
        expedition.log.unshift(logMessage);
        updateState({ expedition: expedition });
        
        if (!uiState.skipAnimations) {
            openModal('MODAL_COLLECT_RESULT', { type: 'collect_success', message: logMessage, items: itemsFound }, true);
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

        const currentNode = getCurrentNode(expedition);
        // Usa o ID do mapa atual (Bioma) para lógica de spawn
        const biomeId = expedition.currentMap.id; 
        const eventTable = SPAWN_LOGIC[biomeId]?.investigate;
        
        if (!eventTable) return;

        const luck = expedition.kidStats.luck || 0;
        const eventRoll = rollDice(1, 100) + luck; 
        let eventResult = eventTable[eventTable.length - 1]; 
        for (const event of eventTable) { if (eventRoll <= event.chance) { eventResult = event; break; } }

        let logMessage = '';

        switch (eventResult.type) {
            case "nothing":
                logMessage = `Investigated ${currentNode.name}... found nothing.`;
                expedition.log.unshift(logMessage);
                updateState({ expedition: expedition });
                if (!uiState.skipAnimations) openModal('MODAL_INVESTIGATE_RESULT', { type: 'investigate_nothing', message: logMessage, items: [] }, true);
                break;
            case "ambush":
                const rarity = eventResult.enemyRarity || 'common';
                const enemyData = ENEMIES_BY_BIOME[biomeId] ? ENEMIES_BY_BIOME[biomeId][rarity] : null;
                if (enemyData) {
                    expedition.log.unshift(`AMBUSH! A ${enemyData.name} attacks at ${currentNode.name}!`);
                    updateState({ expedition: expedition });
                    this.handleCombatExecution(enemyData);
                }
                break;
            case "loot":
                const lootTable = DROP_TABLES[currentNode.subtype]?.investigate;
                if (!lootTable) return;
                const lootRoll = rollDice(1, 100) + luck; 
                let lootResult = lootTable[lootTable.length - 1];
                for (const loot of lootTable) { if (lootRoll <= loot.chance) { lootResult = loot; break; } }

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
                    if (!uiState.skipAnimations) openModal('MODAL_INVESTIGATE_RESULT', { type: 'investigate_success', message: "Loot Found!", items: itemsFound }, true);
                }
                break;
        }
    },

    searchForEnemy: function() {
        const state = getState();
        let { expedition } = state;
        if (expedition.currentAP < 2) { 
            expedition.log.unshift(`Not enough AP to search.`);
            updateState({ expedition: expedition });
            return;
        }
        expedition.currentAP -= 2; 
        
        // Usa o ID do mapa atual
        const biomeId = expedition.currentMap.id;
        const enemyTable = ENEMIES_BY_BIOME[biomeId];
        if (!enemyTable || !enemyTable.common) return;
        
        const enemyData = enemyTable.common; 
        expedition.log.unshift(`Hunting in ${biomeId}... found a ${enemyData.name}!`);
        updateState({ expedition: expedition });
        this.handleCombatExecution(enemyData);
    },

    endDay: function() {
        const state = getState();
        let { expedition } = state;
        if (expedition.currentDay >= expedition.maxDays) {
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

        alert("Expedition Ended. Loot Secured."); 

        updateState({ 
            playerInventory: playerInventory,
            expedition: JSON.parse(JSON.stringify(INITIAL_STATE.expedition)) 
        });
        setCurrentScreen('hub-preparation-screen');
    }
};
