/* ====================================================================
// RENDERER: renderInventoryEquipments.js
// UPDATE: (Correção de Lógica)
// Importa e usa 'getEquipmentPowerScore' para o 'Sort By' (Ordenação).
// ==================================================================== */

import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../../database/equipment.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { SLOT_UNLOCK_RULES } from '../../../database/crafting_rules.js';
// (ATUALIZADO) Importa o 'getEquipmentPowerScore'
import { getEquipmentPowerScore } from '../../systems/StatCalculationSystem.js';

// Helper reutilizado para desenhar os slots de um item
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
 * Renderiza a aba de Equipamentos
 * @param {object} state - O GameState completo
 * @returns {string} HTML para a aba de Equipamentos
 */
export const renderInventoryEquipments = (state) => {
    const { playerInventory, uiState } = state;
    const { inventoryEquipmentFilter, inventoryEquipmentSort } = uiState;

    let filteredItems = [...playerInventory.equipment];

    // 1. Aplicar Filtro
    if (inventoryEquipmentFilter !== 'all') {
        filteredItems = filteredItems.filter(item => {
            const staticData = EQUIPMENT_DB[item.item_id];
            return staticData && staticData.slot === inventoryEquipmentFilter;
        });
    }

    // (ATUALIZADO) 2. Aplicar Ordenação
    filteredItems.sort((a, b) => {
        const aData = EQUIPMENT_DB[a.item_id];
        const bData = EQUIPMENT_DB[b.item_id];
        
        switch (inventoryEquipmentSort) {
            case 'rarity':
                const rarityOrder = { 'COMMON': 1, 'UNCOMMON': 2, 'RARE': 3, 'MYTHIC': 4 };
                return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
            case 'tier':
                return b.tier - a.tier;
            case 'type':
                return (aData.slot || '').localeCompare(bData.slot || '');
            case 'power':
            default:
                // (CORRIGIDO) Usa a função importada para calcular A e B
                const powerA = getEquipmentPowerScore(a);
                const powerB = getEquipmentPowerScore(b);
                return powerB - powerA; // Mais alto primeiro
        }
    });

    // 3. Renderizar Filtros da UI
    const filterButtonsHTML = EQUIPMENT_SLOTS.map(slotType => `
        <button 
            id="btn-inv-filter" 
            data-filter-type="${slotType}" 
            class="action-btn btn-xs btn-secondary ${inventoryEquipmentFilter === slotType ? 'active' : ''}"
            title="${slotType}"
        >
            <img src="assets/ui/icon_${slotType}.png" alt="${slotType}">
        </button>
    `).join('');

    const filterHTML = `
        <div class="inventory-filters">
            <div class="filter-group">
                <button 
                    id="btn-inv-filter" 
                    data-filter-type="all" 
                    class="action-btn btn-xs btn-secondary ${inventoryEquipmentFilter === 'all' ? 'active' : ''}"
                >ALL</button>
                ${filterButtonsHTML}
            </div>
            <div class="filter-group">
                <label for="inventory-sort-by">Sort By:</label>
                <select id="inventory-sort-by">
                    <option value="power" ${inventoryEquipmentSort === 'power' ? 'selected' : ''}>Power Score</option>
                    <option value="rarity" ${inventoryEquipmentSort === 'rarity' ? 'selected' : ''}>Rarity</option>
                    <option value="tier" ${inventoryEquipmentSort === 'tier' ? 'selected' : ''}>Tier</option>
                    <option value="type" ${inventoryEquipmentSort === 'type' ? 'selected' : ''}>Type (Slot)</option>
                </select>
            </div>
        </div>
    `;

    // 4. Renderizar Cards de Itens
    if (filteredItems.length === 0) {
        return `${filterHTML}<div class="item-grid-container"><p>No equipment matching filters.</p></div>`;
    }

    const itemCardsHTML = filteredItems.map(item => {
        const itemData = EQUIPMENT_DB[item.item_id];
        const itemStats = itemData.base_stats;
        
        const statsHTML = Object.keys(itemStats).map(statKey => `
            <div class="card-stat-row">
                <span>${statKey.toUpperCase()}</span>
                <span class="card-stat-val">+${itemStats[statKey]}</span>
            </div>
        `).join('');

        const slotsHTML = renderItemSlotsHTML(item);

        const actionButton = item.isEquipped
            ? `<button id="btn-inv-unequip" data-instance-id="${item.instance_id}" class="action-btn btn-sm btn-primary">UNEQUIP</button>`
            : `<button id="btn-inv-equip" data-instance-id="${item.instance_id}" class="action-btn btn-sm btn-info">EQUIP</button>`;
        
        const rarityClass = `rarity-${item.rarity.toLowerCase()}`;
        const equippedClass = item.isEquipped ? 'equipped-border' : '';

        return `
            <div class="item-card ${rarityClass} ${equippedClass}">
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
                    ${actionButton}
                </div>
            </div>
        `;
    }).join('');

    return `${filterHTML}<div class="item-grid-container">${itemCardsHTML}</div>`;
};
