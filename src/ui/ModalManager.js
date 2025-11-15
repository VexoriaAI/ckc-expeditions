/* ====================================================================
// UI: ModalManager.js
// UPDATE: Importa e usa os renderers de conteúdo do modal.
// ==================================================================== */

// (NOVO) Importa os renderers de conteúdo
import { renderEquipmentListModal, renderComponentListModal } from './Renderers/renderModalContent.js';

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
            case 'MODAL_SELECT_EQUIPMENT':
                // (ATUALIZADO) Chama o renderer real
                contentHTML = renderEquipmentListModal(state);
                break;
            case 'MODAL_SELECT_COMPONENT':
                // (ATUALIZADO) Chama o renderer real
                contentHTML = renderComponentListModal(state);
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
