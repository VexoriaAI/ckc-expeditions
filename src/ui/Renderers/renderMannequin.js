/* ====================================================================
// RENDERER: renderMannequin.js
// UPDATE: Adiciona o botão "X" (btn-unequip-item) nos slots equipados.
// ==================================================================== */

import { EQUIPMENT_DB, EQUIPMENT_SLOTS } from '../../../database/equipment.js';

/**
 * Renders the Character Mannequin, showing equipped items.
 * @param {Array<object>} equippedItems - Array of equipped InventoryItem instances.
 * @returns {string} HTML for the Mannequin slots.
 */
export const renderMannequinSlots = (equippedItems) => {
    let slotsHTML = '';
    
    const equippedMap = equippedItems.reduce((map, item) => {
        const staticData = EQUIPMENT_DB[item.item_id];
        if (staticData) {
            map[staticData.slot] = item;
        }
        return map;
    }, {});

    for (const slotType of EQUIPMENT_SLOTS) {
        const item = equippedMap[slotType];
        
        if (item) {
            // Slot Equipado
            const itemData = EQUIPMENT_DB[item.item_id];
            slotsHTML += `
                <div class="mannequin-slot equipped-slot" data-slot-type="${slotType}" data-equipped-instance-id="${item.instance_id}">
                    <button id="btn-unequip-item" class="unequip-btn" data-instance-id="${item.instance_id}">&times;</button>
                    
                    <img src="${itemData.iconPath}" alt="${itemData.name}">
                    <span class="slot-name">${itemData.name}</span>
                </div>
            `;
        } else {
            // Slot Vazio (Placeholder)
            const placeholderIcon = `assets/ui/icon_${slotType}.png`;
            const placeholderName = `Empty (${slotType.toUpperCase()})`;
            slotsHTML += `
                <div id="btn-open-equip-modal" class="mannequin-slot empty-slot" data-slot-type="${slotType}">
                    <img src="${placeholderIcon}" alt="${placeholderName}">
                    <span class="slot-name">${placeholderName}</span>
                </div>
            `;
        }
    }
    return slotsHTML;
};
