/* ====================================================================
// SYSTEM: ExpeditionManager.js
// UPDATE: (Passo 3) 'collectResources' e 'investigate' agora
// chamam 'openModal()' com os dados de resultado, em vez de 'alert()'.
// ==================================================================== */

import { getState, updateState, setCurrentScreen, INITIAL_STATE, openModal } from '../core/GameState.js'; // (Importa openModal)
import { MOCK_KIDZ_NFTS } from '../../database/mock_wallet.js'; 
import { STATIC_MAP_DATA, MAP_BIOMES } from '../../database/maps.js';
import { DROP_TABLES } from '../../database/drops.js'; 
import { SPAWN_LOGIC } from '../../database/spawn_logic.js';
import { ENEMIES_BY_BIOME } from '../../database/enemies.js'; 
import { EquipmentSystem } from './EquipmentSystem.js';
import { calculateFinalStats } from './StatCalculationSystem.js';

// ... (Helpers: getKidDataById, getSpawnPoint, getCurrentBiomeKey, rollDice - sem alteração) ...
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};
const getSpawnPoint = () => {
    let spawn = STATIC_MAP_DATA.find(tile => tile.biome === 'WASTELAND');
    if (!spawn) {
        spawn = STATIC_MAP_DATA[0]; // Fallback
    }
    return { q: spawn.q, r: spawn.r };
};
const getCurrentBiomeKey = (position) => {
    const tile = STATIC_MAP_DATA.find(t => t.q === position.q && t.r === position.r);
    return tile ? tile.biome : 'WASTELAND';
};
const rollDice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const ExpeditionManager = {

    /**
     * Inicia uma nova expedição.
     */
    startExpedition: function() {
        // ... (lógica do startExpedition - sem alteração) ...
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
     * (ATUALIZADO) Executa a ação "Collect Resources".
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

        const biomeKey = getCurrentBiomeKey(expedition.position);
        const lootTable = DROP_TABLES[biomeKey]?.collect;

        if (!lootTable || lootTable.length === 0) {
            expedition.log.unshift(`Cannot collect here.`);
            updateState({ expedition: expedition });
            return;
        }

        let lootFoundLog = "Collected: ";
        let logMessage = "Collected... but found nothing."; 
        let itemsFound = []; // (NOVO) Array para o modal

        lootTable.forEach(entry => {
            const { item, quantity } = entry;
            const amountFound = rollDice(quantity[0], quantity[1]);
            
            if (amountFound > 0) {
                expedition.foundLoot.materials[item] = (expedition.foundLoot.materials[item] || 0) + amountFound;
                lootFoundLog += `${amountFound}x ${item}, `;
                itemsFound.push({ itemId: item, quantity: amountFound }); // (NOVO) Adiciona ao array do modal
            }
        });

        if (lootFoundLog !== "Collected: ") {
             logMessage = lootFoundLog.slice(0, -2); 
        }
        
        expedition.log.unshift(logMessage);
        updateState({ expedition: expedition });
        
        // (ATUALIZADO) Passo 4: Aciona o modal (se não estiver pulando)
        if (!uiState.skipAnimations) {
            openModal(
                'MODAL_COLLECT_RESULT', 
                { type: 'collect_success', message: logMessage, items: itemsFound },
                true // Auto-fecha em 3 segundos
            );
        }
    },

    /**
     * (ATUALIZADO) Executa a ação "Investigate".
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

        let logMessage = '';

        switch (eventResult.type) {
            case "nothing":
                logMessage = "Investigated the area... but found nothing.";
                expedition.log.unshift(logMessage);
                updateState({ expedition: expedition });
                
                if (!uiState.skipAnimations) {
                    openModal(
                        'MODAL_INVESTIGATE_RESULT', 
                        { type: 'investigate_nothing', message: logMessage, items: [] },
                        true // Auto-fecha
                    );
                }
                break;
            
            case "ambush":
                logMessage = `Ambush! A ${eventResult.enemyRarity} enemy attacks!`;
                expedition.log.unshift(logMessage);
                updateState({ expedition: expedition });
                
                // Combate NUNCA é pulado
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
                         openModal(
                            'MODAL_INVESTIGATE_RESULT', 
                            { type: 'investigate_nothing', message: logMessage, items: [] },
                            true // Auto-fecha
                        );
                    }
                } else {
                    const { item, quantity } = lootResult;
                    const amountFound = rollDice(quantity[0], quantity[1]);
                    let itemsFound = [];
                    
                    if (amountFound > 0) {
                        expedition.foundLoot.materials[item] = (expedition.foundLoot.materials[item] || 0) + amountFound;
                        logMessage = `Success! Found ${amountFound}x ${item} (${lootResult.type})!`;
                        expedition.log.unshift(logMessage);
                        itemsFound.push({ itemId: item, quantity: amountFound }); // Adiciona ao array do modal
                    }
                    updateState({ expedition: expedition });

                    if (!uiState.skipAnimations) {
                        openModal(
                            'MODAL_INVESTIGATE_RESULT', 
                            { type: 'investigate_success', message: logMessage, items: itemsFound },
                            true // Auto-fecha
                        );
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

        const biomeKey = getCurrentBiomeKey(expedition.position);
        const enemyTable = ENEMIES_BY_BIOME[biomeKey];
        
        if (!enemyTable || !enemyTable.common) {
            expedition.log.unshift(`The area seems quiet... for now.`);
            updateState({ expedition: expedition });
            return;
        }
        
        const enemyName = enemyTable.common.name;
        expedition.log.unshift(`You found a ${enemyName}! Combat initiated.`);
        updateState({ expedition: expedition });

        // Combate NUNCA é pulado
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

        // 1. Salva o Loot (Materiais)
        for (const matId in expedition.foundLoot.materials) {
            const amount = expedition.foundLoot.materials[matId];
            playerInventory.materials[matId] = (playerInventory.materials[matId] || 0) + amount;
        }
        // 2. Salva o Loot (Equipamentos e Componentes)
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
