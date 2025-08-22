// Utilidades de UI: Toasts
(function() {
    function ensureToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function createToast(message, type, duration) {
        const container = ensureToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type || 'info'}`;
        toast.innerHTML = `<span class="toast-message">${message}</span>`;

        container.appendChild(toast);

        // Força layout para animação
        // eslint-disable-next-line no-unused-expressions
        toast.offsetHeight;
        toast.classList.add('show');

        const hide = () => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };

        setTimeout(hide, duration || 3000);

        toast.addEventListener('click', hide);
    }

    window.showToast = function(message, type, duration) {
        createToast(message, type, duration);
    };
})();


