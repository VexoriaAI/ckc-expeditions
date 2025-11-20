/* ====================================================================
// RENDERER: renderWorkshopEmbed.js
// UPDATE: (Fase 3.1 - Fix Crash Embed)
// Adiciona verificação de segurança para evitar crash quando o
// componente é consumido/removido do estado.
// ==================================================================== */

import { COMPONENTS_DB } from '../../../database/components.js';
import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { SLOT_UNLOCK_RULES } from '../../../database/crafting_rules.js';

// --- Helper (Reutilizado) ---
const renderItemSlotsHTML = (itemInstance) => {
    let slotsHTML = '';
    const itemTier = itemInstance.tier;
    itemInstance.slots.forEach((slot, index) => {
        const requiredTier = SLOT_UNLOCK_RULES[index];
        if (slot.component_id) {
            const compData = COMPONENTS_DB[slot.component_id];
            slotsHTML += `
                <div class="item-slot-row filled">
                    <img src="${compData.iconPath}" class="slot-bar-icon">
                    <span class="slot-bar-text">${compData.name}</span>
                    <span class="slot-bar-bonus">(+${Object.values(compData.stats)[0]} ${Object.keys(compData.stats)[0]})</span>
                </div>
            `;
        } else if (itemTier >= requiredTier) {
            slotsHTML += `<div class="item-slot-row empty"><span class="slot-bar-icon">+</span><span class="slot-bar-text">Empty Slot</span></div>`;
        } else {
            slotsHTML += `<div class="item-slot-row locked"><span class="slot-bar-icon">🔒</span><span class="slot-bar-text">Locked (Requires Tier ${requiredTier})</span></div>`;
        }
    });
    return slotsHTML;
};

/**
 * Renderiza a UI para a aba "Embed".
 */
export const renderEmbedTab = (state) => {
    const { 
        embedTargetEquipmentId, 
        embedTargetComponentId,
        playerInventory 
    } = state;

    let equipmentSlotHTML = '';
    let componentSlotHTML = '';
    let previewHTML = '';
    
    // --- 1. Renderiza o Slot de Equipamento ---
    if (embedTargetEquipmentId) {
        const item = playerInventory.equipment.find(e => e.instance_id === embedTargetEquipmentId);
        // Proteção se item for removido
        if (!item) {
             equipmentSlotHTML = `<div class="embed-slot-placeholder panel"><p>Item not found</p></div>`;
        } else {
            const itemData = EQUIPMENT_DB[item.item_id];
            const itemStats = itemData.base_stats;
            
            const statsHTML = Object.keys(itemStats).map(statKey => `
                <div class="card-stat-row">
                    <span>${statKey.toUpperCase()}</span>
                    <span class="card-stat-val">+${itemStats[statKey]}</span>
                </div>
            `).join('');

            const slotsHTML = renderItemSlotsHTML(item);
            const rarityClass = `rarity-${item.rarity.toLowerCase()}`;
            
            equipmentSlotHTML = `
                <div class="item-card ${rarityClass}">
                    <button id="btn-remove-embed-equip" class="unequip-btn">&times;</button>
                    <div class="card-header">
                        <div class="card-icon-frame"><img src="${itemData.iconPath}" alt="${itemData.name}"></div>
                        <div class="card-header-text">
                            <h4>${itemData.name}</h4>
                            <span class="card-level">Tier ${item.tier} (${item.rarity})</span>
                        </div>
                    </div>
                    <div class="card-body">
                        ${statsHTML}
                    </div>
                    <div class="card-footer">
                        ${slotsHTML}
                    </div>
                </div>
            `;
        }
    } else {
        equipmentSlotHTML = `
            <div id="btn-select-embed-equip" class="embed-slot-placeholder panel">
                <span class="embed-plus">+</span>
                <span class="embed-title">Select Equipment</span>
                <p class="embed-desc">Choose an item from your inventory to modify.</p>
            </div>
        `;
    }

    // --- 2. Renderiza o Slot de Componente ---
    const isComponentSlotDisabled = !embedTargetEquipmentId;
    
    // (CORREÇÃO) Verifica se o ID existe E se o item ainda está no inventário
    let componentItem = null;
    if (embedTargetComponentId) {
        componentItem = playerInventory.components.find(c => c.instance_id === embedTargetComponentId);
    }

    if (embedTargetComponentId && componentItem) {
        const itemData = COMPONENTS_DB[componentItem.item_id];
        
        const statsHTML = Object.keys(itemData.stats).map(statKey => `
            <div class="card-stat-row">
                <span>${statKey.toUpperCase()}</span>
                <span class="card-stat-val">+${itemData.stats[statKey]}</span>
            </div>
        `).join('');

        componentSlotHTML = `
            <div class="item-card rarity-common">
                <button id="btn-remove-embed-comp" class="unequip-btn">&times;</button>
                <div class="card-header">
                    <div class="card-icon-frame"><img src="${itemData.iconPath}" alt="${itemData.name}"></div>
                    <div class="card-header-text">
                        <h4>${itemData.name}</h4>
                        <span class="card-level">Type: ${itemData.type}</span>
                    </div>
                </div>
                <div class="card-body">
                    ${statsHTML}
                </div>
            </div>
        `;
    } else {
        componentSlotHTML = `
            <div id="btn-select-embed-comp" class="embed-slot-placeholder panel ${isComponentSlotDisabled ? 'disabled' : ''}">
                <span class="embed-plus">+</span>
                <span class="embed-title">Select Component</span>
                <p class="embed-desc">${isComponentSlotDisabled ? 'Select equipment first' : 'Choose a component to embed'}</p>
            </div>
        `;
    }
    
    // --- 3. Botão de Execução ---
    // Só habilita se ambos os slots estiverem preenchidos E o item existir
    const executeButtonDisabled = !(embedTargetEquipmentId && componentItem);

    if (!executeButtonDisabled) {
        previewHTML = `
            <div class="embed-preview panel">
                <h4>Ready to Embed!</h4>
                <p>Clicking 'Embed Component' will consume the component and permanently socket it into the first available, unlocked slot.</p>
            </div>
        `;
    }
    
    return `
        <div class="embed-ui">
            ${equipmentSlotHTML}
            <span class="arrow-separator">+</span>
            ${componentSlotHTML}
        </div>
        ${previewHTML}
        <button 
            id="btn-execute-embed" 
            class="action-btn btn-success"
            ${executeButtonDisabled ? 'disabled' : ''}
        >
            Embed Component
        </button>
    `;
};
