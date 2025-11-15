/* ====================================================================
// RENDERER: renderModalContent.js
// UPDATE: Corrige o ReferenceError importando SYNERGY_MAP.
// ==================================================================== */

import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { COMPONENTS_DB } from '../../../database/components.js';
// (A CORREÇÃO ESTÁ AQUI) Importa as regras de sinergia
import { SYNERGY_MAP } from '../../../database/crafting_rules.js';

/**
 * Renderiza uma lista filtrada de Equipamentos do inventário para o modal.
 * @param {object} state - O GameState completo.
 * @returns {string} HTML para a lista de equipamentos.
 */
export const renderEquipmentListModal = (state) => {
    const equipmentInventory = state.playerInventory.equipment;
    
    if (equipmentInventory.length === 0) {
        return '<p>You have no equipment in your inventory.</p>';
    }

    const itemCardsHTML = equipmentInventory.map(item => {
        const itemData = EQUIPMENT_DB[item.item_id];
        return `
            <div class="modal-item-card" data-instance-id="${item.instance_id}">
                <img src="${itemData.iconPath}" alt="${itemData.name}">
                <h4>${itemData.name} (T${item.tier})</h4>
                <p>Rarity: ${item.rarity}</p>
                <button class="action-btn btn-sm btn-info" id="btn-modal-select-item" data-instance-id="${item.instance_id}">SELECT</button>
            </div>
        `;
    }).join('');

    return `
        <h2>Select Equipment</h2>
        <div class="modal-item-grid">
            ${itemCardsHTML}
        </div>
    `;
};

/**
 * Renderiza uma lista filtrada de Componentes do inventário para o modal.
 * @param {object} state - O GameState completo.
 * @returns {string} HTML para a lista de componentes.
 */
export const renderComponentListModal = (state) => {
    const { playerInventory, embedTargetEquipmentId } = state;

    if (!embedTargetEquipmentId) {
        return '<p>Error: No equipment selected.</p>';
    }
    
    // Filtra componentes baseado na Sinergia do equipamento
    const equipment = playerInventory.equipment.find(e => e.instance_id === embedTargetEquipmentId);
    const equipmentData = EQUIPMENT_DB[equipment.item_id];
    
    // (A CORREÇÃO ESTÁ AQUI) Usa o SYNERGY_MAP importado
    const allowedTypes = SYNERGY_MAP[equipmentData.synergy] || [];

    const componentsInventory = playerInventory.components.filter(comp => {
        const compData = COMPONENTS_DB[comp.item_id];
        // Adiciona checagem para compData (caso o componente não exista no DB)
        if (!compData) return false; 
        return allowedTypes.includes(compData.type);
    });

    if (componentsInventory.length === 0) {
        return `<p>You have no components compatible with <strong>${equipmentData.synergy}</strong> synergy.</p>`;
    }

    const itemCardsHTML = componentsInventory.map(item => {
        const itemData = COMPONENTS_DB[item.item_id];
        return `
            <div class="modal-item-card" data-instance-id="${item.instance_id}">
                <img src="${itemData.iconPath}" alt="${itemData.name}">
                <h4>${itemData.name}</h4>
                <p>Type: ${itemData.type}</p>
                <button class="action-btn btn-sm btn-info" id="btn-modal-select-item" data-instance-id="${item.instance_id}">SELECT</button>
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
