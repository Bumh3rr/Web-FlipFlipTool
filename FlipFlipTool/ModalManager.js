export class ModalManager {
    constructor() {
        this.setupEscapeKeyListener();
    }

    openModal(modalId = 'info', title = '', subtitle = '', callback = null) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (!modal) return;
        modal.classList.add('show');

        if (title) {
            const titleElement = document.getElementById(`title-${modalId}`);
            if (titleElement) titleElement.textContent = title;
        }

        if (subtitle) {
            const subtitleElement = document.getElementById(`subtitle-${modalId}`);
            if (subtitleElement) subtitleElement.textContent = subtitle;
        }

        // Configurar callback del botón OK
        document.getElementById(`btn-ok-${modalId}`)
            .onclick = callback || (() => this.closeModal(`modal-${modalId}`));
    }

    closeModal(modalId) {
        if (!modalId) return;
        if (!modalId.startsWith('modal-')) {
            modalId = `modal-${modalId}`;
        }
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }

    openInfo(title, subtitle, callback) {
        this.openModal(ModalManager.ModalType.INFO, title, subtitle, callback);
    }

    openError(title, subtitle, callback) {
        this.openModal(ModalManager.ModalType.ERROR, title, subtitle, callback);
    }

    openSuccess(title, subtitle, callback) {
        this.openModal(ModalManager.ModalType.SUCCESS, title, subtitle, callback);
    }

    openWarning(subtitle) {
        this.openModal(ModalManager.ModalType.WARNING, 'Advertencia', subtitle);
    }

    setupEscapeKeyListener() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    closeModalPop() {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            this.closeModal(openModal.id);
        }
    }

    // Modal Types
    static get ModalType() {
        return {
            INFO: 'info',
            ERROR: 'error',
            SUCCESS: 'success',
            WARNING: 'warning'
        };
    }
}