/* Cabecera y pie compartidos: Chapa Tu Técnico (Figma System)
   Uso en el HTML:  <script src="layout.js" data-part="header"></script>
                    <script src="layout.js" data-part="footer"></script>
   Y en <body data-page="inicio | nosotros | servicios | cobertura | soporte | tienda | producto | tecnicos | login | cuenta | perfil | solicitud | carrito | compra | mensajes | 404"> */
(function () {
  var s = document.currentScript, part = s.dataset.part, page = document.body.dataset.page || '';
  var hideSearch = (s.dataset.search === 'false' || s.dataset.variant === 'compact' || page === 'cobertura' || page === 'soporte' || page === 'tienda');
  var navLink = function (id, href, text) {
    var isActive = (page === id || (page === 'producto' && id === 'tienda'));
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
    '<header class="header' + (hideSearch ? ' header-compact' : '') + '">' +
    '  <div class="container header-container">' +
        '<!-- 1. Identidad: Logo Figma con retorno a inicio -->' +
        '<a href="index.html" class="logo" aria-label="Chapa Tu Técnico - Ir a inicio">' +
          '<img src="img/logo.webp" alt="Chapa Tu Técnico - Servicios profesionales a domicilio" class="logo-img" width="118" height="101" fetchpriority="high" decoding="async">' +
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
                '<img src="img/icons/whatsapp.svg" alt="" width="20" height="20"> EMERGENCIA 24/7' +
              '</a>' +
            '</div>' +
          '</nav>' +
          (hideSearch ? '' :
          '<form class="search-bar" role="search" action="servicios.html" method="get">' +
            '<button type="submit" class="search-btn search-btn-submit" aria-label="Buscar">' +
              '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
            '</button>' +
            '<input type="search" name="q" placeholder="Ejemplo: gasfitero, electricista, etc..." aria-label="Buscar servicio">' +
            '<button type="button" class="search-btn search-btn-voice" aria-label="Buscar por voz">' +
              '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>' +
            '</button>' +
          '</form>') +
        '</div>' +
        '<!-- 3. Acciones Derecha: Cuenta/Login, Notificaciones, Carrito, Hamburguesa -->' +
        '<div class="header-actions">' +
          '<a href="login.html" class="header-account' + (page === 'login' || page === 'cuenta' || page === 'perfil' ? ' active' : '') + '"' + (page === 'login' ? ' aria-current="page"' : '') + ' title="Iniciar sesión" aria-label="Iniciar sesión o acceder a mi cuenta">' +
            '<img src="img/icon-cuenta.svg" alt="" width="36" height="36" class="account-icon">' +
            '<span class="account-text">INICIAR SESIÓN</span>' +
          '</a>' +
          '<a href="mensajes.html" class="icon-link header-notif' + (page === 'mensajes' ? ' active' : '') + '" aria-label="Notificaciones y mensajes" title="Notificaciones (1 nueva)">' +
            '<img src="img/111.svg" alt="" width="38" height="38">' +
            '<span class="header-badge-dot" aria-hidden="true"></span>' +
          '</a>' +
          '<a href="carrito.html" class="icon-link icon-cart' + (page === 'carrito' || page === 'compra' ? ' active' : '') + '" aria-label="Mi Carrito: 2 productos" title="Mi Carrito">' +
            '<img src="img/222.svg" alt="" width="38" height="38">' +
            '<span class="header-cart-count" aria-hidden="true">2</span>' +
          '</a>' +
          '<button class="menu-toggle" id="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navbar">' +
            '<span class="menu-toggle-bar"></span><span class="menu-toggle-bar"></span><span class="menu-toggle-bar"></span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>';

  var footerSvg = function (name, d, w, h) {
    w = w || 20;
    h = h || 20;
    return '<svg class="footer-svg-icon icon-' + name + '" viewBox="0 0 24 24" width="' + w + '" height="' + h + '" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  };

  var svgYt = footerSvg('youtube', 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z');
  var svgFb = footerSvg('facebook', 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z');
  var svgIg = footerSvg('instagram', 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z');
  var svgTk = footerSvg('tiktok', 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z');
  var svgWaSupport = footerSvg('whatsapp', 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 16.59c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.31z', 16, 16);
  var svgMailSupport = footerSvg('email', 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', 16, 16);

  var footer =
    '<footer class="footer"><h2 class="sr-only">Navegación del pie de página</h2><div class="container footer-container">' +
    '<div class="footer-col"><h3 class="footer-col-title">Inicio:</h3><ul>' +
    '<li><a href="login.html">Iniciar Sesión</a></li>' +
    '<li><a href="nosotros.html">Nosotros</a></li>' +
    '<li><a href="servicios.html">Servicios Generales</a></li>' +
    '<li><a href="cobertura.html">Cobertura Lima</a></li>' +
    '<li><a href="tecnicos.html">Nuestros Técnicos</a></li>' +
    '<li><a href="soporte.html">Centro de Soporte</a></li>' +
    '<li><a href="perfil.html">Perfil Técnico</a></li>' +
    '<li><a href="solicitud.html">Detalle Solicitud</a></li>' +
    '<li><a href="mensajes.html">Bandeja de Mensajes</a></li></ul></div>' +
    '<div class="footer-col"><h3 class="footer-col-title">Categoría:</h3><ul>' +
    '<li><a href="servicios.html">Gasfitero</a></li>' +
    '<li><a href="electricidad.html">Electricista</a></li>' +
    '<li><a href="servicios.html">Línea Blanca</a></li>' +
    '<li><a href="servicios.html">Carpintería</a></li>' +
    '<li><a href="electricidad.html">Otros Servicios</a></li></ul></div>' +
    '<div class="footer-col support-col"><h3 class="footer-col-title">Soporte</h3><p>Atención 24/7.</p><p>Consulta a los siguientes datos</p>' +
    '<p><a href="tel:+51998204667" class="support-contact-link" aria-label="Llamar o escribir a soporte por WhatsApp: 998 204 667">' + svgWaSupport + ' <strong>998 204 667</strong></a></p>' +
    '<p><a href="mailto:chapatutecnico@gmail.com" class="support-contact-link" aria-label="Enviar correo electrónico a chapatutecnico@gmail.com">' + svgMailSupport + ' <strong>chapatutecnico@gmail.com</strong></a></p></div>' +
    '<div class="footer-col payment-col"><h3 class="footer-col-title">Medios de pago</h3>' +
    '<p class="small">Contamos con varios medios de pago.<br>Paga seguro, paga con confianza</p>' +
    '<div class="payment-icons"><img src="img/pago-mastercard.svg" alt="Mastercard" width="38" height="24"><img src="img/pago-visa.svg" alt="Visa" width="38" height="24">' +
    '<img src="img/pago-yape.svg" alt="Yape" width="38" height="24"><img src="img/pago-plin.svg" alt="Plin" width="38" height="24"></div></div>' +
    '<a href="soporte.html#contacto-form" class="footer-col claim-col"><img src="img/libro-reclamaciones.svg" alt="" width="56" height="56"><span>Libro de Reclamaciones</span></a>' +
    '<div class="footer-col brand-col">' +
      '<img src="img/logo.webp" alt="Chapa Tu Técnico" class="footer-logo-img" width="118" height="101" loading="lazy" decoding="async">' +
      '<p>Servicios confiables<br>y al instante</p>' +
    '<div class="footer-socials">' +
    '<a href="https://www.youtube.com/@chapatutecnico" class="footer-social-link social-youtube" target="_blank" rel="noopener noreferrer" aria-label="Canal oficial de YouTube de Chapa Tu Técnico (abre en nueva pestaña)">' + svgYt + '</a>' +
    '<a href="https://www.facebook.com/chapatutecnico" class="footer-social-link social-facebook" target="_blank" rel="noopener noreferrer" aria-label="Página oficial de Facebook de Chapa Tu Técnico (abre en nueva pestaña)">' + svgFb + '</a>' +
    '<a href="https://www.instagram.com/chapatutecnico" class="footer-social-link social-instagram" target="_blank" rel="noopener noreferrer" aria-label="Cuenta oficial de Instagram de Chapa Tu Técnico (abre en nueva pestaña)">' + svgIg + '</a>' +
    '<a href="https://www.tiktok.com/@chapatutecnico" class="footer-social-link social-tiktok" target="_blank" rel="noopener noreferrer" aria-label="Cuenta oficial de TikTok de Chapa Tu Técnico (abre en nueva pestaña)">' + svgTk + '</a>' +
    '</div></div>' +
    '</div><p class="footer-bottom">© 2026 | Empresa peruana innovadora</p></footer>';

  var fabWhatsApp = '';
  var isFabPage = (page === 'inicio' || page === 'nosotros' || page === 'servicios' || page === 'cobertura');
  if (isFabPage && !location.pathname.includes('electricidad')) {
    fabWhatsApp =
      '<aside class="fab-whatsapp-container" aria-label="Canal de asistencia de emergencia 24/7">' +
        '<a href="https://wa.me/51998204667?text=Hola%20Chapa%20Tu%20T%C3%A9cnico,%20necesito%20un%20t%C3%A9cnico%20de%20emergencia%2024/7" ' +
           'class="fab-whatsapp-btn" ' +
           'target="_blank" ' +
           'rel="noopener noreferrer" ' +
           'aria-label="Contactar a técnico de emergencia por WhatsApp 24/7" ' +
           'title="Emergencia 24/7 - Contactar por WhatsApp">' +
          '<span class="fab-whatsapp-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">' +
              '<path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>' +
            '</svg>' +
          '</span>' +
          '<span class="fab-whatsapp-label">Emergencia 24/7</span>' +
          '<span class="fab-whatsapp-badge" aria-hidden="true">24/7</span>' +
          '<span class="fab-whatsapp-pulse" aria-hidden="true"></span>' +
        '</a>' +
      '</aside>';
  }

  if (part === 'header') {
    if (!document.querySelector('.header')) {
      s.insertAdjacentHTML('beforebegin', header);
    }
  } else if (part === 'footer') {
    if (!document.querySelector('.footer')) {
      s.insertAdjacentHTML('beforebegin', footer + fabWhatsApp);
    }
  }

  if (part === 'header') {
    var updateHeaderCartBadge = function () {
      try {
        var raw = localStorage.getItem('chapa_cart');
        var cart = raw ? JSON.parse(raw) : null;
        var badge = document.querySelector('.header-cart-count');
        var cartLink = document.querySelector('.icon-cart');
        if (badge) {
          var count = 0;
          if (Array.isArray(cart)) {
            count = cart.reduce(function (sum, item) { return sum + (item.cantidad || 1); }, 0);
          } else {
            count = 2;
          }
          badge.textContent = count;
          badge.style.display = count > 0 ? 'inline-flex' : 'none';
          if (cartLink) {
            cartLink.setAttribute('aria-label', 'Mi Carrito: ' + count + (count === 1 ? ' producto' : ' productos'));
          }
        }
      } catch (e) {}
    };

    var updateHeaderAuthState = function () {
      try {
        var isAuth = localStorage.getItem('ctt_is_authenticated') === 'true';
        var raw = localStorage.getItem('ctt_profile');
        var profile = raw ? JSON.parse(raw) : null;
        var accountLink = document.querySelector('.header-account');
        if (!accountLink) return;

        if (isAuth && profile) {
          accountLink.href = 'cuenta.html';
          var name = (profile.firstname || 'Mi Cuenta').trim();
          accountLink.title = 'Mi Cuenta (' + name + ')';
          accountLink.setAttribute('aria-label', 'Acceder a mi cuenta: ' + name);

          var textSpan = accountLink.querySelector('.account-text');
          if (textSpan) {
            textSpan.textContent = name.length > 12 ? name.substring(0, 10).toUpperCase() + '..' : name.toUpperCase();
          }

          var iconImg = accountLink.querySelector('.account-icon');
          if (iconImg && profile.picture) {
            iconImg.src = profile.picture;
            iconImg.style.borderRadius = '50%';
            iconImg.style.objectFit = 'cover';
          }
        }
      } catch (e) {}
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        updateHeaderCartBadge();
        updateHeaderAuthState();
      });
    } else {
      updateHeaderCartBadge();
      updateHeaderAuthState();
    }
    window.addEventListener('chapa-cart-updated', updateHeaderCartBadge);
    window.addEventListener('chapa-auth-updated', updateHeaderAuthState);
    window.addEventListener('storage', function () {
      updateHeaderCartBadge();
      updateHeaderAuthState();
    });
  }
})();
