/* ====================================================================
// SYSTEM: ExpeditionManager.js
// UPDATE: (Fase 4.0 - Fix Spawn Logic)
// - Mapeia corretamente TODAS as tribos para seus biomas iniciais.
// - Corrige o bug onde Radioactives iam para Wasteland.
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
// Importa o MapGenerator para criar os mapas dinâmicos
import { MapGenerator } from './MapGenerator.js';

// --- Helpers ---

const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

// (Helper atualizado para usar o mapa gerado, não estático)
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
     * Inicia uma nova expedição (Gera o Mapa Dinâmico).
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
        
        // (CORREÇÃO) Mapeamento completo de Tribo -> Bioma Inicial
        const TRIBE_HOME_BIOMES = {
            'VOLCANICS': 'BURNING_RIDGE',
            'RADIOACTIVES': 'LAKE_RANCID',
            'NOCTURNALS': 'ANCIENT_METROPOLIS', // (Usará gerador genérico por enquanto)
            'UNDERGROUNDERS': 'ABANDONED_MINES', // (Usará gerador genérico por enquanto)
            'REPTILIANS': 'COVENANT_SWAMP'       // (Usará gerador genérico por enquanto)
        };

        // Define o bioma inicial (ou Wasteland se a tribo não estiver mapeada)
        const startBiomeId = TRIBE_HOME_BIOMES[kidStaticData.tribe] || 'WASTELAND';

        console.log(`ExpeditionManager: Generating map for ${kidStaticData.tribe} -> ${startBiomeId}`);

        // 2. Gera o Mapa Procedural
        const mapInstance = MapGenerator.generateBiomeMap(startBiomeId);
        
        // 3. Define o Spawn Point Aleatório
        const startNodeId = MapGenerator.getRandomSpawnNode(mapInstance);
        
        // Encontra o nó inicial para o log
        const startNode = mapInstance.nodes.find(n => n.id === startNodeId);
        const biomeName = mapInstance.name; // Usa o nome da instância gerada

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
            
            // Salva o mapa gerado no estado
            currentMap: mapInstance,
            
            position: { nodeId: startNodeId }, 
            
            log: [`Day 1: Dropped into ${biomeName} at ${startNode.name}.`],
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
     * Move o jogador para um novo nó (Lê do currentMap).
     */
    moveToNode: function(targetNodeId) {
        const state = getState();
        let { expedition } = state; 
        
        if (!expedition.currentMap) return;

        const currentNode = getCurrentNode(expedition);
        const targetNode = expedition.currentMap.nodes.find(n => n.id === targetNodeId);

        if (!targetNode) {
            console.error(`MoveToNode: Nó alvo "${targetNodeId}" não encontrado no mapa atual.`);
            return;
        }

        // Verifica conexão (Lê do mapa dinâmico)
        if (!currentNode || !currentNode.connections.includes(targetNodeId)) {
            expedition.log.unshift(`Cannot move there directly.`);
            updateState({ expedition: expedition });
            return;
        }

        // Verifica custo de MP
        const cost = calculateMPCost(currentNode, targetNode);
        if (expedition.currentMP < cost) {
            expedition.log.unshift(`Not enough MP to move. (Costs ${cost} MP)`);
            updateState({ expedition: expedition });
            return;
        }

        // Executa movimento
        expedition.currentMP -= cost;
        expedition.position.nodeId = targetNodeId; 
        
        expedition.log.unshift(`Moved to ${targetNode.name}.`);
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

        // Identifica o Tipo de Nó (Subtype)
        const currentNode = getCurrentNode(expedition);
        const nodeType = currentNode.subtype; 
        
        // Busca a tabela de loot específica do tipo de nó
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

        const currentNode = getCurrentNode(expedition);
        const biomeId = expedition.currentMap.id; 
        const eventTable = SPAWN_LOGIC[biomeId]?.investigate;
        
        if (!eventTable) {
             console.warn(`Investigate: Sem tabela de spawn para ${biomeId}.`);
             return;
        }

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
                // Usa Bioma para inimigos
                const enemyData = ENEMIES_BY_BIOME[biomeId] ? ENEMIES_BY_BIOME[biomeId][rarity] : null;
                
                if (enemyData) {
                    expedition.log.unshift(`AMBUSH! A ${enemyData.name} attacks at ${currentNode.name}!`);
                    updateState({ expedition: expedition });
                    this.handleCombatExecution(enemyData);
                } else {
                    console.warn(`Inimigo não encontrado para ${biomeId} ${rarity}`);
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
