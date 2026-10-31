/* Cabecera y pie compartidos: Chapa Tu Técnico (Figma System)
   Uso en el HTML:  <script src="layout.js" data-part="header"></script>
                    <script src="layout.js" data-part="footer"></script>
   Y en <body data-page="inicio | nosotros | servicios | cobertura | soporte | tienda | tecnicos | cuenta | perfil | solicitud | carrito | compra | mensajes | 404"> */
(function () {
  var s = document.currentScript, part = s.dataset.part, page = document.body.dataset.page || '';
  var navLink = function (id, href, text) {
    var isActive = (page === id);
    return '<a href="' + href + '" class="nav-link' + (isActive ? ' active' : '') + '"' + (isActive ? ' aria-current="page"' : '') + '>' + text + '</a>';
  };
  var navDot = '<span class="nav-dot" aria-hidden="true">•</span>';

  var header =
    '<div class="topbar">' +
      '<div class="container topbar-container">' +
        '<div class="topbar-left" aria-hidden="true"></div>' +
        '<p class="topbar-text">***Atención 24/7. Cobertura solo en Lima Metropolitana***</p>' +
        '<div class="topbar-right">' +
          '<div class="topbar-location">' +
            '<svg class="topbar-pin-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' +
            '<span>Lima, Lima, Perú</span>' +
          '</div>' +
          '<div class="topbar-flags" aria-label="Idiomas disponibles">' +
            '<img src="img/flag-pe.svg" alt="Español (Perú)" class="flag" width="28" height="19">' +
            '<img src="img/flag-us.svg" alt="English (United States)" class="flag" width="28" height="19">' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<header class="header">' +
      '<div class="container header-container">' +
        '<!-- 1. Identidad: Logo Figma con retorno a inicio -->' +
        '<a href="index.html" class="logo" aria-label="Chapa Tu Técnico - Ir a inicio">' +
          '<img src="img/logo.png" alt="Chapa Tu Técnico" class="logo-img" width="214" height="184">' +
        '</a>' +
        '<!-- 2. Centro: Menú de Navegación Principal + Buscador Global -->' +
        '<div class="header-main">' +
          '<nav class="navbar" id="navbar" aria-label="Navegación principal">' +
            '<div class="mobile-nav-header">' +
              '<span class="mobile-nav-title">MENÚ</span>' +
              '<button type="button" class="mobile-nav-close" id="mobile-nav-close" aria-label="Cerrar menú">&times;</button>' +
            '</div>' +
            navLink('inicio', 'index.html', 'INICIO') +
            navDot +
            navLink('nosotros', 'nosotros.html', 'NOSOTROS') +
            navDot +
            navLink('servicios', 'servicios.html', 'SERVICIOS') +
            navDot +
            navLink('cobertura', 'cobertura.html', 'COBERTURA') +
            navDot +
            navLink('soporte', 'soporte.html', 'SOPORTE') +
            navDot +
            navLink('tienda', 'tienda.html', 'TIENDA CHAPA') +
            '<div class="mobile-nav-footer">' +
              '<a href="https://wa.me/51998204667?text=Hola%20Chapa%20Tu%20T%C3%A9cnico,%20necesito%20atenci%C3%B3n%20de%20emergencia" target="_blank" rel="noopener noreferrer" class="btn-emergency-mobile">' +
                '<img src="img/whatsapp.webp" alt="" width="20" height="20"> EMERGENCIA 24/7' +
              '</a>' +
            '</div>' +
          '</nav>' +
          '<form class="search-bar" role="search" action="servicios.html" method="get">' +
            '<button type="submit" class="search-btn search-btn-submit" aria-label="Buscar">' +
              '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
            '</button>' +
            '<input type="search" name="q" placeholder="Ejemplo: gasfitero, electricista, etc..." aria-label="Buscar servicio">' +
            '<button type="button" class="search-btn search-btn-voice" aria-label="Buscar por voz">' +
              '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>' +
            '</button>' +
          '</form>' +
        '</div>' +
        '<!-- 3. Acciones Derecha: Cuenta, Notificaciones, Carrito, Hamburguesa -->' +
        '<div class="header-actions">' +
          '<a href="cuenta.html" class="header-account' + (page === 'cuenta' || page === 'perfil' ? ' active' : '') + '" title="Mi Cuenta" aria-label="Iniciar sesión o acceder a mi cuenta">' +
            '<img src="img/icon-cuenta.svg" alt="" width="36" height="36" class="account-icon">' +
            '<span class="account-text">INICIAR SESIÓN</span>' +
          '</a>' +
          '<a href="mensajes.html" class="icon-link header-notif' + (page === 'mensajes' ? ' active' : '') + '" aria-label="Notificaciones y mensajes" title="Notificaciones (1 nueva)">' +
            '<img src="img/111.svg" alt="" width="38" height="38">' +
            '<span class="header-badge-dot" aria-hidden="true"></span>' +
          '</a>' +
          '<a href="carrito.html" class="icon-link icon-cart' + (page === 'carrito' || page === 'compra' ? ' active' : '') + '" aria-label="Mi Carrito de Compras" title="Mi Carrito">' +
            '<img src="img/222.svg" alt="" width="38" height="38">' +
            '<span class="header-cart-count" aria-hidden="true">2</span>' +
          '</a>' +
          '<button class="menu-toggle" id="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navbar">' +
            '<span class="menu-toggle-bar"></span><span class="menu-toggle-bar"></span><span class="menu-toggle-bar"></span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>';

  var footer =
    '<footer class="footer"><div class="container footer-container">' +
    '<div class="footer-col"><h4>Inicio:</h4><ul>' +
    '<li><a href="nosotros.html">Nosotros</a></li>' +
    '<li><a href="servicios.html">Servicios Generales</a></li>' +
    '<li><a href="cobertura.html">Cobertura Lima</a></li>' +
    '<li><a href="tecnicos.html">Nuestros Técnicos</a></li>' +
    '<li><a href="soporte.html">Centro de Soporte</a></li>' +
    '<li><a href="perfil.html">Perfil Técnico</a></li>' +
    '<li><a href="solicitud.html">Detalle Solicitud</a></li>' +
    '<li><a href="mensajes.html">Bandeja de Mensajes</a></li></ul></div>' +
    '<div class="footer-col"><h4>Categoría:</h4><ul>' +
    '<li><a href="servicios.html">Gasfitero</a></li>' +
    '<li><a href="electricidad.html">Electricista</a></li>' +
    '<li><a href="servicios.html">Línea Blanca</a></li>' +
    '<li><a href="servicios.html">Carpintería</a></li>' +
    '<li><a href="electricidad.html">Otros Servicios</a></li></ul></div>' +
    '<div class="footer-col support-col"><h4>Soporte</h4><p>Atención 24/7.</p><p>Consulta a los siguientes datos</p>' +
    '<p><a href="tel:+51998204667"><img src="img/whatsapp.png" alt="Teléfono"> <strong>998 204 667</strong></a></p>' +
    '<p><a href="mailto:chapatutecnico@gmail.com"><img src="img/communication.png" alt="Correo"> <strong>chapatutecnico@gmail.com</strong></a></p></div>' +
    '<div class="footer-col payment-col"><h4>Medios de pago</h4>' +
    '<p class="small">Contamos con varios medios de pago.<br>Paga seguro, paga con confianza</p>' +
    '<div class="payment-icons"><img src="img/pago-mastercard.svg" alt="Mastercard"><img src="img/pago-visa.svg" alt="Visa">' +
    '<img src="img/pago-yape.svg" alt="Yape"><img src="img/pago-plin.svg" alt="Plin"></div></div>' +
    '<a href="soporte.html#contacto-form" class="footer-col claim-col"><img src="img/libro-reclamaciones.svg" alt=""><span>Libro de Reclamaciones</span></a>' +
    '<div class="footer-col brand-col"><img src="img/logo.png" alt="Chapa Tu Técnico"><p>Servicios confiables<br>y al instante</p>' +
    '<div class="footer-socials"><a href="404.html" aria-label="YouTube"><img src="img/youtube.png" alt=""></a>' +
    '<a href="404.html" aria-label="Facebook"><img src="img/facebook.png" alt=""></a>' +
    '<a href="404.html" aria-label="Instagram"><img src="img/instagram.png" alt=""></a>' +
    '<a href="404.html" aria-label="TikTok"><img src="img/tik-tok.png" alt=""></a></div></div>' +
    '</div><p class="footer-bottom">© 2026 | Empresa peruana innovadora</p></footer>';

  s.insertAdjacentHTML('beforebegin', part === 'footer' ? footer : header);
})();
