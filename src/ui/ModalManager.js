/* ====================================================================
// UI: ModalManager.js
// UPDATE: (Passo 3.3) Adiciona o case 'MODAL_WORLD_MAP'.
// ==================================================================== */

import { renderEquipmentListModal, renderComponentListModal } from './Renderers/renderModalContent.js';
import { renderLootResultModal } from './Renderers/renderModalResult.js';
import { renderCombatModal } from './Renderers/renderCombatModal.js';
import { renderEmbedConfirmationModal } from './Renderers/renderEmbedConfirmation.js';
// (NOVO) Importa o renderer do mapa mundi
import { renderWorldMap } from './Renderers/renderWorldMap.js';

let modalRoot;

export const ModalManager = {
    init: function() {
        modalRoot = document.getElementById('modal-root');
        if (!modalRoot) {
            console.error("CRITICAL Error: #modal-root element not found in index.html.");
        }
    },

    renderModal: function(state) {
        if (!modalRoot) return;

        if (!state.isModalOpen) {
            modalRoot.innerHTML = ''; 
            return;
        }

        let contentHTML = '';
        let modalClass = ''; 

        switch (state.modalContent) {
            // --- Seleção ---
            case 'MODAL_SELECT_EQUIPMENT':
                contentHTML = renderEquipmentListModal(state);
                break;
            case 'MODAL_SELECT_COMPONENT':
                contentHTML = renderComponentListModal(state);
                break;

            // --- Resultados ---
            case 'MODAL_COLLECT_RESULT':
            case 'MODAL_INVESTIGATE_RESULT':
                contentHTML = renderLootResultModal(state.modalData);
                break;
            case 'MODAL_COMBAT_RESULT':
                contentHTML = renderCombatModal(state);
                modalClass = 'modal-large'; 
                break;

            // --- Ações ---
            case 'MODAL_CONFIRM_EMBED':
                contentHTML = renderEmbedConfirmationModal(state);
                break;

            // --- (NOVO) Mapa Mundi ---
            case 'MODAL_WORLD_MAP':
                contentHTML = renderWorldMap(state);
                modalClass = 'modal-large'; // Mapa precisa de espaço
                break;

            // --- Placeholders ---
            case 'MODAL_SELECT_EQUIPMENT_FOR_RARITY':
                contentHTML = `<h2>Select Equipment to Upgrade Rarity</h2><p>(Placeholder) ${renderEquipmentListModal(state)}</p>`;
                break;
            case 'MODAL_SELECT_EQUIPMENT_FOR_SLOT':
                contentHTML = `<h2>Select Equipment to Unlock Slot</h2><p>(Placeholder) ${renderEquipmentListModal(state)}</p>`;
                break;
            case 'MODAL_SELECT_EQUIPMENT_FOR_EXTRACT':
                contentHTML = `<h2>Select Equipment to Extract Component</h2><p>(Placeholder) ${renderEquipmentListModal(state)}</p>`;
                break;
                
            default:
                contentHTML = `<h2>Error</h2><p>Modal content ID "${state.modalContent}" not found.</p>`;
        }

        modalRoot.innerHTML = `
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal-content panel ${modalClass}">
                    <button id="btn-modal-close" class="modal-close-btn">&times;</button>
                    <div class="modal-body">
                        ${contentHTML}
                    </div>
                </div>
            </div>
        `;
    }
};
