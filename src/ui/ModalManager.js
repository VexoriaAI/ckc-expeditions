/* ====================================================================
// UI: ModalManager.js
// UPDATE: (Passo 4.2) Adiciona suporte para 'MODAL_TRAVEL_CONFIRM'.
// ==================================================================== */

import { renderEquipmentListModal, renderComponentListModal } from './Renderers/renderModalContent.js';
import { renderLootResultModal } from './Renderers/renderModalResult.js';
import { renderCombatModal } from './Renderers/renderCombatModal.js';
import { renderEmbedConfirmationModal } from './Renderers/renderEmbedConfirmation.js';
import { renderWorldMap } from './Renderers/renderWorldMap.js';
// (NOVO) Importa o renderer de viagem
import { renderTravelModal } from './Renderers/renderTravelModal.js';

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
            case 'MODAL_WORLD_MAP':
                contentHTML = renderWorldMap(state);
                modalClass = 'modal-large'; 
                break;
            
            // (NOVO) Modal de Viagem
            case 'MODAL_TRAVEL_CONFIRM':
                contentHTML = renderTravelModal(state.modalData);
                break;

            // --- Placeholders ---
            case 'MODAL_SELECT_EQUIPMENT_FOR_RARITY':
            case 'MODAL_SELECT_EQUIPMENT_FOR_SLOT':
            case 'MODAL_SELECT_EQUIPMENT_FOR_EXTRACT':
                contentHTML = `<h2>Placeholder</h2><p>Content coming soon.</p>`;
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
