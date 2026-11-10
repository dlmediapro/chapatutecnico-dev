/* ==========================================================================
   Chapa Tu Técnico — Proxy Loader: js/perfil.js
   Mantiene compatibilidad hacia atrás y modularidad arquitectónica
   ========================================================================== */
(function() {
    'use strict';
    // Si js/perfil.js ya fue cargado, no duplicar ejecución
    if (window._chapaPerfilLoaded) return;
    window._chapaPerfilLoaded = true;
    var script = document.createElement('script');
    script.src = 'js/perfil.js';
    script.defer = true;
    document.head.appendChild(script);
})();
