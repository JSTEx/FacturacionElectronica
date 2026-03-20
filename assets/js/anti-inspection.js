// Seguridad UI: bloquea inspeccion y atajos de desarrollo en el cliente.
(function () {
// Funcion: blockEvent
// Que hace: Gestiona la logica de blockEvent.
    function blockEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    document.addEventListener('contextmenu', blockEvent);
    document.addEventListener('keydown', function (event) {
        const key = String(event.key || '').toLowerCase();

        if (key === 'f12') {
            blockEvent(event);
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
            blockEvent(event);
            return;
        }

        if ((event.ctrlKey || event.metaKey) && key === 'u') {
            blockEvent(event);
        }
    });
})();