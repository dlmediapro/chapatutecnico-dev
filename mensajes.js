/* ==========================================================================
   Chapa Tu Técnico — Proxy Loader: js/mensajes.js
   Mantiene compatibilidad hacia atrás y modularidad arquitectónica
   ========================================================================== */
(function() {
    'use strict';
    if (window._chapaMensajesLoaded) return;
    window._chapaMensajesLoaded = true;
    var script = document.createElement('script');
    script.src = 'js/mensajes.js';
    script.defer = true;
    document.head.appendChild(script);
})();
