/* ====================================================================
// RENDERER: renderModalResult.js
// UPDATE: (Passo 7.2 - Robustez de Loot)
// Garante que o renderer lide corretamente com itens de Equipamento
// e Componentes no loot (além de Materiais).
// ==================================================================== */

import { MATERIALS_DB } from '../../../database/materials.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { EQUIPMENT_DB } from '../../../database/equipment.js';

/**
 * Renderiza o modal de resultado de uma ação (Collect, Investigate).
 * @param {object} modalData - O objeto 'state.modalData'.
 * @returns {string} HTML para o corpo do modal.
 */
export const renderLootResultModal = (modalData) => {
    
    if (!modalData) {
        return '<h2>Resultado Desconhecido</h2><p>Nenhum dado de resultado foi recebido.</p>';
    }

    const { type, message, items } = modalData;
    let title = 'Resultado da Ação';
    let imageHTML = '';
    let itemsHTML = '';

    // 1. Define o Título e a Imagem (baseado no tipo de evento)
    switch (type) {
        case 'collect_success':
            title = 'Recursos Coletados';
            imageHTML = `<img src="assets/ui/modal_loot.png" class="modal-result-image" alt="Coleta">`;
            break;
        case 'investigate_success':
            title = 'Loot Encontrado!';
            imageHTML = `<img src="assets/ui/modal_loot.png" class="modal-result-image" alt="Loot">`;
            break;
        case 'investigate_nothing':
            title = 'Nada Encontrado';
            imageHTML = `<img src="assets/ui/modal_nothing.png" class="modal-result-image" alt="Nada Encontrado">`;
            break;
        default:
            title = 'Ação Realizada';
            imageHTML = `<img src="assets/ui/modal_nothing.png" class="modal-result-image" alt="Resultado">`;
    }

    // 2. Renderiza a lista de itens (se houver)
    if (items && items.length > 0) {
        itemsHTML = items.map(item => {
            // Tenta encontrar o item em todos os DBs
            let itemData = MATERIALS_DB[item.itemId];
            if (!itemData) itemData = COMPONENTS_DB[item.itemId];
            if (!itemData) itemData = EQUIPMENT_DB[item.itemId];

            if (!itemData) {
                console.warn(`Item ID ${item.itemId} não encontrado nos DBs.`);
                return '';
            }
            
            return `
                <li class="loot-item">
                    <img src="${itemData.iconPath}" alt="${itemData.name}">
                    <span>${itemData.name}</span>
                    <span class="loot-quantity">x ${item.quantity}</span>
                </li>
            `;
        }).join('');
        
        itemsHTML = `<ul class="loot-display-list">${itemsHTML}</ul>`;
    } else {
        // Se não houver itens, apenas mostra a mensagem
        itemsHTML = `<p class="modal-result-message">${message}</p>`;
    }

    // 3. Montagem Final
    return `
        <h2>${title}</h2>
        <div class="modal-result-layout">
            <div class="modal-image-column">
                ${imageHTML}
            </div>
            <div class="modal-loot-column">
                ${itemsHTML}
            </div>
        </div>
    `;
};
