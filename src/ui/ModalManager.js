/* ====================================================================
// (NOVO) UI: ModalManager.js
// Gerencia a renderização do Modal Global (overlay, container).
// ==================================================================== */

// (Futuro: Importar renderers de conteúdo do Modal)
// import { renderEquipmentListModal } from './Renderers/renderModalContent.js';

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
                // contentHTML = renderEquipmentListModal(state);
                contentHTML = "<h2>Select Equipment (Placeholder)</h2><p>Lista de equipamentos do inventário...</p>";
                break;
            case 'MODAL_SELECT_COMPONENT':
                // contentHTML = renderComponentListModal(state);
                contentHTML = "<h2>Select Component (Placeholder)</h2><p>Lista de componentes (filtrada por sinergia)...</p>";
                break;
            default:
                contentHTML = `<h2>Error</h2><p>Modal content ID "${state.modalContent}" not found.</p>`;
        }

        // Renderiza o "wrapper" (invólucro) do modal com o conteúdo
        modalRoot.innerHTML = `
            <div classclass="modal-overlay" id="modal-overlay">
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
