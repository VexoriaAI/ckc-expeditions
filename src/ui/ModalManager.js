/* ====================================================================
// UI: ModalManager.js
// UPDATE: Importa e chama o 'renderLootResultModal'
// para os novos tipos de modal de resultado.
// ==================================================================== */

import { renderEquipmentListModal, renderComponentListModal } from './Renderers/renderModalContent.js';
// (NOVO) Importa o renderer de resultado
import { renderLootResultModal } from './Renderers/renderModalResult.js';

let modalRoot;

export const ModalManager = {
    init: function() {
        modalRoot = document.getElementById('modal-root');
        if (!modalRoot) {
            console.error("CRITICAL Error: #modal-root element not found in index.html.");
        }
    },

    /**
     * Renderiza o Modal baseado no estado (isModalOpen).
     * @param {object} state - O GameState completo.
     */
    renderModal: function(state) {
        if (!modalRoot) return;

        if (!state.isModalOpen) {
            modalRoot.innerHTML = ''; // Limpa o modal se estiver fechado
            return;
        }

        let contentHTML = '';
        
        // Determina qual conteúdo renderizar dentro do modal
        switch (state.modalContent) {
            // --- Modais de Seleção (Antigos) ---
            case 'MODAL_SELECT_EQUIPMENT':
                contentHTML = renderEquipmentListModal(state);
                break;
            case 'MODAL_SELECT_COMPONENT':
                contentHTML = renderComponentListModal(state);
                break;

            // --- (NOVOS) Modais de Resultado ---
            case 'MODAL_COLLECT_RESULT':
            case 'MODAL_INVESTIGATE_RESULT':
                contentHTML = renderLootResultModal(state.modalData);
                break;

            // (Placeholder para futuros modais de "USE" do inventário)
            case 'MODAL_SELECT_EQUIPMENT_FOR_RARITY':
                contentHTML = `<h2>Select Equipment to Upgrade Rarity</h2><p>(Placeholder) ${renderEquipmentListModal(state)}</p>`;
                break;
            case 'MODAL_SELECT_EQUIPMENT_FOR_SLOT':
                contentHTML = `<h2>Select Equipment to Unlock Slot</h2><p>(Placeholder) ${renderEquipmentListModal(state)}</p>`;
                break;
                
            default:
                contentHTML = `<h2>Error</h2><p>Modal content ID "${state.modalContent}" not found.</p>`;
        }

        // Renderiza o "wrapper" (invólucro) do modal com o conteúdo
        modalRoot.innerHTML = `
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal-content panel">
                    <button id="btn-modal-close" class="modal-close-btn">&times;</button>
                    <div class="modal-body">
                        ${contentHTML}
                    </div>
                </div>
            </div>
        `;
    }
};
