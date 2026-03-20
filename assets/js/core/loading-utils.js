// Control de estados de carga globales y placeholders de espera.
// Funcion: showAppLoading
// Que hace: Gestiona la logica de showAppLoading.
function showAppLoading(message) {
    const overlay = document.getElementById('appLoading');
    if (!overlay) return;
    const text = overlay.querySelector('.app-loading-text');
    if (text && message) text.textContent = message;
    overlay.classList.remove('app-loading-hidden');
}

// Funcion: hideAppLoading
// Que hace: Gestiona la logica de hideAppLoading.
function hideAppLoading() {
    const overlay = document.getElementById('appLoading');
    if (!overlay) return;
    overlay.classList.add('app-loading-hidden');
}

window.showAppLoading = showAppLoading;
window.hideAppLoading = hideAppLoading;