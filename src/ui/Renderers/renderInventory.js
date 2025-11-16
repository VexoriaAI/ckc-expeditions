/* ====================================================================
// (NOVO) RENDERER: renderInventory.js
// Renderiza as abas do Inventário (Equipamentos, Componentes, etc.)
// ==================================================================== */

import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../../database/equipment.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { MATERIALS_DB } from '../../../database/materials.js';
import { SHOP_ITEMS_DB } from '../../../database/crafting_rules.js';
import { SLOT_UNLOCK_RULES } from '../../../database/crafting_rules.js';
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';

// --- (Copiado do renderModalContent.js, pois é reutilizável) ---
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
// --- Fim do código reutilizado ---

/**
 * Renderiza a aba de Equipamentos (com filtros, ordenação e botões de ação)
 * @param {object} state - O GameState completo
 * @returns {string} HTML para a aba de Equipamentos
 */
export const renderInventoryEquipments = (state) => {
    const { playerInventory, uiState } = state;
    const { inventoryEquipmentFilter, inventoryEquipmentSort } = uiState;

    let filteredItems = [...playerInventory.equipment];

    // 1. Aplicar Filtro (ex: 'helmet')
    if (inventoryEquipmentFilter !== 'all') {
        filteredItems = filteredItems.filter(item => {
            const staticData = EQUIPMENT_DB[item.item_id];
            return staticData && staticData.slot === inventoryEquipmentFilter;
        });
    }

    // 2. Aplicar Ordenação
    filteredItems.sort((a, b) => {
        const aData = EQUIPMENT_DB[a.item_id];
        const bData = EQUIPMENT_DB[b.item_id];
        
        switch (inventoryEquipmentSort) {
            case 'rarity':
                // (Lógica futura de raridade)
                return 0; // Placeholder
            case 'tier':
                return b.tier - a.tier; // Tier mais alto primeiro
            case 'type':
                return (aData.slot || '').localeCompare(bData.slot || ''); // Ordem alfabética
            case 'power':
            default:
                // (Power Score precisa ser calculado)
                return 0; // Placeholder
        }
    });

    // 3. Renderizar Filtros da UI
    const filterButtonsHTML = EQUIPMENT_SLOTS.map(slotType => `
        <button 
            id="btn-inv-filter" 
            data-filter-type="${slotType}" 
            class="btn-xs btn-secondary ${inventoryEquipmentFilter === slotType ? 'active' : ''}"
        >
            ${slotType.toUpperCase()}
        </button>
    `).join('');

    const filterHTML = `
        <div class="inventory-filters">
            <div class="filter-group">
                <span>Filter:</span>
                <button 
                    id="btn-inv-filter" 
                    data-filter-type="all" 
                    class="btn-xs btn-secondary ${inventoryEquipmentFilter === 'all' ? 'active' : ''}"
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
        return `${filterHTML}<p>No equipment matching filters.</p>`;
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

        // (Sugestão Aprovada) Botão de Ação Rápida
        const actionButton = item.isEquipped
            ? `<button id="btn-inv-unequip" data-instance-id="${item.instance_id}" class="action-btn btn-sm btn-primary">UNEQUIP</button>`
            : `<button id="btn-inv-equip" data-instance-id="${item.instance_id}" class="action-btn btn-sm btn-info">EQUIP</button>`;

        return `
            <div class="item-card ${item.isEquipped ? 'equipped-border' : ''}">
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

/**
 * Renderiza a aba de Componentes
 */
export const renderInventoryComponents = (state) => {
    // (Lógica de renderização dos componentes - Placeholder)
    return "<p>Renderizador de Componentes (Pendente)</p>";
};

/**
 * Renderiza a aba de Materiais
 */
export const renderInventoryMaterials = (state) => {
    // (Lógica de renderização dos materiais - Placeholder)
    return "<p>Renderizador de Materiais (Pendente)</p>";
};

/**
 * Renderiza a aba de Itens da Loja
 */
export const renderInventoryShopItems = (state) => {
    // (Lógica de renderização dos itens de loja - Placeholder)
    return "<p>Renderizador de Itens da Loja (Pendente)</p>";
};
