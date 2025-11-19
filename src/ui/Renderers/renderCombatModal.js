/* ====================================================================
// RENDERER: renderCombatModal.js
// UPDATE: (CORREÇÃO DE DIAGNÓSTICO)
// Adiciona importações de COMPONENTS_DB e EQUIPMENT_DB para que
// o loot de vitória seja renderizado corretamente.
// ==================================================================== */

import { MOCK_KIDZ_NFTS } from '../../../database/mock_wallet.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js'; // (NOVO)
import { EQUIPMENT_DB } from '../../../database/equipment.js';   // (NOVO)

// Helper para encontrar o Kid
const getKidDataById = (kidId) => {
    return MOCK_KIDZ_NFTS.find(kid => kid.id === kidId);
};

/**
 * Helper interno para renderizar o loot do combate.
 */
const renderCombatLoot = (items) => {
    if (!items || items.length === 0) return '';
    
    const lootHTML = items.map(item => {
        // (CORREÇÃO) Procura o item em todos os bancos de dados
        const itemData = MATERIALS_DB[item.itemId] || COMPONENTS_DB[item.itemId] || EQUIPMENT_DB[item.itemId];
        
        if (!itemData) return '';
        
        return `
            <div class="combat-loot-item">
                <img src="${itemData.iconPath}" alt="${itemData.name}">
                <span>${item.quantity}x</span>
            </div>
        `;
    }).join('');

    return `
        <div class="combat-loot-section">
            <h4>Loot Acquired</h4>
            <div class="combat-loot-grid">
                ${lootHTML}
            </div>
        </div>
    `;
};

/**
 * Renderiza o Modal de Combate.
 * @param {object} state - O GameState completo.
 * @returns {string} HTML para o conteúdo do modal.
 */
export const renderCombatModal = (state) => {
    const { modalData, expedition, currentPlayerKidId } = state;
    
    if (!modalData) return '<p>Error: No combat data.</p>';

    const { type, combatLog, enemy, items } = modalData;
    const isVictory = type === 'combat_victory';
    const kidData = getKidDataById(currentPlayerKidId);

    const title = isVictory ? 'VICTORY!' : 'DEFEAT!';
    const titleClass = isVictory ? 'combat-title-victory' : 'combat-title-defeat';
    
    // Player Info
    const playerHTML = `
        <div class="combat-fighter player">
            <div class="fighter-img-frame">
                <img src="${kidData.spritePath}" alt="${kidData.name}">
            </div>
            <div class="fighter-stats">
                <span class="fighter-name">${kidData.name}</span>
                <span class="fighter-hp">HP: ${expedition.currentHP}/${expedition.maxHP}</span>
                <div class="hp-bar-mini">
                    <div class="hp-fill" style="width: ${(expedition.currentHP / expedition.maxHP) * 100}%"></div>
                </div>
            </div>
        </div>
    `;

    // Enemy Info
    const enemyHTML = `
        <div class="combat-fighter enemy">
            <div class="fighter-img-frame">
                <img src="${enemy.sprite}" alt="${enemy.name}">
            </div>
            <div class="fighter-stats">
                <span class="fighter-name">${enemy.name}</span>
                <span class="fighter-hp">HP: ${isVictory ? 0 : '???'} / ${enemy.stats.hp}</span>
                <div class="hp-bar-mini">
                    <div class="hp-fill" style="width: ${isVictory ? 0 : 100}%"></div>
                </div>
            </div>
        </div>
    `;

    // Log de Combate
    const logHTML = combatLog.map(entry => {
        let className = 'log-entry';
        if (entry.includes('VICTORY')) className += ' log-victory';
        if (entry.includes('DEFEAT')) className += ' log-defeat';
        if (entry.includes('CRITICAL')) className += ' log-crit';
        return `<p class="${className}">${entry}</p>`;
    }).join('');

    // Loot (apenas se venceu)
    const lootSection = isVictory ? renderCombatLoot(items) : '';

    return `
        <div class="combat-modal-layout">
            <h2 class="${titleClass}">${title}</h2>
            
            <div class="combat-arena">
                ${playerHTML}
                <div class="vs-badge">VS</div>
                ${enemyHTML}
            </div>

            ${lootSection}

            <div class="combat-log-wrapper">
                <h4>Battle Log</h4>
                <div class="combat-log-scroll">
                    ${logHTML}
                </div>
            </div>
        </div>
    `;
};
