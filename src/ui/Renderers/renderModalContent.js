/* ====================================================================
// RENDERER: renderModalContent.js
// UPDATE: renderEquipmentListModal agora renderiza o card de item completo.
// ==================================================================== */

import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { SYNERGY_MAP, SLOT_UNLOCK_RULES } from '../../../database/crafting_rules.js';

/**
 * (NOVO) Helper para renderizar os slots de um item (para o modal)
 */
const renderItemSlotsHTML = (itemInstance) => {
    let slotsHTML = '';
    const itemTier = itemInstance.tier;

    itemInstance.slots.forEach((slot, index) => {
        const requiredTier = SLOT_UNLOCK_RULES[index];
        
        if (slot.component_id) {
            // Slot Preenchido
            const compData = COMPONENTS_DB[slot.component_id];
            slotsHTML += `
                <div class="item-slot-row filled">
                    <img src="${compData.iconPath}" class="slot-bar-icon">
                    <span class="slot-bar-text">${compData.name}</span>
                    <span class="slot-bar-bonus">(+${Object.values(compData.stats)[0]} ${Object.keys(compData.stats)[0]})</span>
                </div>
            `;
        } else if (itemTier >= requiredTier) {
            // Slot Vazio (Destravado)
            slotsHTML += `
                <div class="item-slot-row empty">
                    <span class="slot-bar-icon">+</span>
                    <span class="slot-bar-text">Empty Slot</span>
                </div>
            `;
        } else {
            // Slot Travado
            slotsHTML += `
                <div class="item-slot-row locked">
                    <span class="slot-bar-icon">🔒</span>
                    <span class="slot-bar-text">Locked (Requires Tier ${requiredTier})</span>
                </div>
            `;
        }
    });
    return slotsHTML;
};

/**
 * (ATUALIZADO) Renderiza a lista de Equipamentos (Cards Completos)
 */
export const renderEquipmentListModal = (state) => {
    const { playerInventory, modalTargetSlot } = state;

    // 1. Filtra o inventário para mostrar apenas o tipo de slot (ex: 'helmet')
    const equipmentInventory = playerInventory.equipment.filter(item => {
        const staticData = EQUIPMENT_DB[item.item_id];
        return staticData && staticData.slot === modalTargetSlot;
    });
    
    if (equipmentInventory.length === 0) {
        return `<h2>Select ${modalTargetSlot.toUpperCase()}</h2><p>You have no items of this type in your inventory.</p>`;
    }

    // 2. Renderiza os cards completos
    const itemCardsHTML = equipmentInventory.map(item => {
        const itemData = EQUIPMENT_DB[item.item_id];
        const itemStats = itemData.base_stats;
        
        // Renderiza os stats base
        const statsHTML = Object.keys(itemStats).map(statKey => `
            <div class="card-stat-row">
                <span>${statKey.toUpperCase()}</span>
                <span class="card-stat-val">+${itemStats[statKey]}</span>
            </div>
        `).join('');

        // Renderiza os slots (Vazio, Preenchido, Travado)
        const slotsHTML = renderItemSlotsHTML(item);

        return `
            <div classid="btn-modal-select-item" class="item-card modal-item-card" data-instance-id="${item.instance_id}">
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
                <div class="card-actions">
                    <button id="btn-modal-select-item" data-instance-id="${item.instance_id}" class="action-btn btn-sm btn-primary">SELECT</button>
                </div>
            </div>
        `;
    }).join('');

    return `
        <h2>Select ${modalTargetSlot.toUpperCase()}</h2>
        <div class="modal-item-grid">
            ${itemCardsHTML}
        </div>
    `;
};

/**
 * Renderiza a lista de Componentes (Filtrada por Sinergia)
 */
export const renderComponentListModal = (state) => {
    const { playerInventory, embedTargetEquipmentId } = state;

    if (!embedTargetEquipmentId) {
        return '<p>Error: No equipment selected.</p>';
    }
    
    const equipment = playerInventory.equipment.find(e => e.instance_id === embedTargetEquipmentId);
    const equipmentData = EQUIPMENT_DB[equipment.item_id];
    const allowedTypes = SYNERGY_MAP[equipmentData.synergy] || [];

    const componentsInventory = playerInventory.components.filter(comp => {
        const compData = COMPONENTS_DB[comp.item_id];
        if (!compData) return false; 
        return allowedTypes.includes(compData.type);
    });

    if (componentsInventory.length === 0) {
        return `<h2>Select Component</h2><p>You have no components compatible with <strong>${equipmentData.synergy}</strong> synergy.</p>`;
    }

    // (ATUALIZADO) Renderiza os cards de componente
    const itemCardsHTML = componentsInventory.map(item => {
        const itemData = COMPONENTS_DB[item.item_id];
        const statsHTML = Object.keys(itemData.stats).map(statKey => `
            <div class="card-stat-row">
                <span>${statKey.toUpperCase()}</span>
                <span class="card-stat-val">+${itemData.stats[statKey]}</span>
            </div>
        `).join('');
        
        return `
            <div classid="btn-modal-select-item" class="item-card modal-item-card" data-instance-id="${item.instance_id}">
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
                <div class="card-actions">
                    <button id="btn-modal-select-item" data-instance-id="${item.instance_id}" class="action-btn btn-sm btn-primary">SELECT</button>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <h2>Select Component (Synergy: ${equipmentData.synergy.toUpperCase()})</h2>
        <div class="modal-item-grid">
            ${itemCardsHTML}
        </div>
    `;
};
