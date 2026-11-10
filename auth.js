/**
 * CHAPA TU TÉCNICO - Módulo de Autenticación, Estado Global & Menú Desplegable
 * Heurísticas Emil Kowalski (60fps, WCAG 2.1 AA, Click Outside, Keyboard Nav)
 * Preparado para integración con APIs de Backend (fetch/axios) - < 250 líneas
 */
(function (global) {
  'use strict';
  const getAuthToken = () => localStorage.getItem('authToken') || '';

  // Listo para conectar: GET /api/v1/cart/count
  async function fetchCartCount() {
    try {
      // BACKEND_ENDPOINT: const res = await fetch('/api/v1/cart/count', { headers: { Authorization: `Bearer ${getAuthToken()}` } }); return (await res.json()).count;
      const raw = localStorage.getItem('chapa_cart');
      const cart = raw ? JSON.parse(raw) : null;
      return Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.cantidad || 1), 0) : 0;
    } catch (e) { return 0; }
  }

  // Listo para conectar: GET /api/v1/notifications/unread-count
  async function fetchUnreadNotifications() {
    try {
      // BACKEND_ENDPOINT: const res = await fetch('/api/v1/notifications/unread-count', { headers: { Authorization: `Bearer ${getAuthToken()}` } }); return (await res.json()).unread;
      const raw = localStorage.getItem('ctt_unread_notifications');
      return raw !== null ? parseInt(raw, 10) : 0;
    } catch (e) { return 0; }
  }

  // Listo para conectar: GET /api/v1/user/profile
  async function fetchUserProfile() {
    try {
      // BACKEND_ENDPOINT: const res = await fetch('/api/v1/user/profile', { headers: { Authorization: `Bearer ${getAuthToken()}` } }); return await res.json();
      if (localStorage.getItem('ctt_is_authenticated') !== 'true') return null;
      const raw = localStorage.getItem('ctt_profile');
      return raw ? JSON.parse(raw) : { firstname: 'Usuario', email: 'usuario@chapatutecnico.pe' };
    } catch (e) { return null; }
  }

  // Listo para conectar: POST /api/v1/auth/logout
  async function handleLogout() {
    try {
      // BACKEND_ENDPOINT: await fetch('/api/v1/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${getAuthToken()}` } });
      ['ctt_is_authenticated', 'ctt_profile', 'ctt_tech_profile', 'authToken'].forEach(k => localStorage.removeItem(k));
      closeMenu();
      window.dispatchEvent(new CustomEvent('chapa-auth-updated', { detail: { isAuthenticated: false } }));
      window.location.href = 'index.html';
    } catch (e) { window.location.href = 'index.html'; }
  }

  const getMenuElements = () => ({
    wrap: document.getElementById('header-account-wrap'),
    btn: document.getElementById('header-account-btn'),
    menu: document.getElementById('header-account-menu'),
    userName: document.getElementById('menu-user-name'),
    userEmail: document.getElementById('menu-user-email'),
    logoutBtn: document.getElementById('btn-header-logout')
  });

  const isMenuOpen = () => {
    const { menu } = getMenuElements();
    return menu ? menu.classList.contains('is-open') : false;
  };

  function openMenu() {
    const { btn, menu } = getMenuElements();
    if (!menu || !btn) return;
    menu.removeAttribute('hidden');
    void menu.offsetWidth; // Force reflow for 60fps GPU acceleration
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    const firstItem = menu.querySelector('.menu-item');
    if (firstItem) firstItem.focus();
  }

  function closeMenu() {
    const { btn, menu } = getMenuElements();
    if (!menu || !btn) return;
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.setAttribute('hidden', ''); }, 180);
  }

  const toggleMenu = () => isMenuOpen() ? closeMenu() : openMenu();

  function renderBadges(cartCount, unreadCount) {
    const cartLink = document.querySelector('.icon-cart');
    if (cartLink) {
      let b = cartLink.querySelector('.header-cart-count');
      if (cartCount > 0) {
        if (!b) {
          b = document.createElement('span');
          b.className = 'header-cart-count';
          b.setAttribute('aria-hidden', 'true');
          cartLink.appendChild(b);
        }
        b.textContent = cartCount;
        cartLink.setAttribute('aria-label', `Mi Carrito: ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`);
      } else {
        if (b) b.remove();
        cartLink.setAttribute('aria-label', 'Mi Carrito');
      }
    }

    const notifLink = document.querySelector('.header-notif');
    if (notifLink) {
      let dot = notifLink.querySelector('.header-badge-dot');
      if (unreadCount > 0) {
        if (!dot) {
          dot = document.createElement('span');
          dot.className = 'header-badge-dot';
          dot.setAttribute('aria-hidden', 'true');
          notifLink.appendChild(dot);
        }
        notifLink.setAttribute('title', `Notificaciones (${unreadCount} nuevas)`);
        notifLink.setAttribute('aria-label', `Notificaciones (${unreadCount} nuevas)`);
      } else {
        if (dot) dot.remove();
        notifLink.setAttribute('title', 'Notificaciones');
        notifLink.setAttribute('aria-label', 'Notificaciones y mensajes');
      }
    }
  }

  function renderProfileState(profile) {
    const { btn, userName, userEmail } = getMenuElements();
    if (!btn) return;
    if (profile) {
      btn.removeAttribute('href');
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      const name = (profile.firstname || 'Mi Cuenta').trim();
      btn.title = `Cuenta de ${name}`;
      btn.setAttribute('aria-label', `Menú de usuario: ${name}`);
      const textSpan = btn.querySelector('.account-text');
      if (textSpan) textSpan.textContent = name.length > 12 ? name.substring(0, 10).toUpperCase() + '..' : name.toUpperCase();
      const iconImg = btn.querySelector('.account-icon');
      if (iconImg && profile.picture) {
        iconImg.src = profile.picture;
        iconImg.style.borderRadius = '50%';
        iconImg.style.objectFit = 'cover';
      }
      if (userName) userName.textContent = profile.firstname ? `${profile.firstname} ${profile.lastname || ''}`.trim() : 'Usuario Chapa';
      if (userEmail) userEmail.textContent = profile.email || 'usuario@chapatutecnico.pe';
    } else {
      btn.setAttribute('href', 'login.html');
      btn.removeAttribute('role');
      btn.removeAttribute('tabindex');
      btn.title = 'Iniciar sesión';
      btn.setAttribute('aria-label', 'Iniciar sesión o acceder a mi cuenta');
      const textSpan = btn.querySelector('.account-text');
      if (textSpan) textSpan.textContent = 'INICIAR SESIÓN';
      closeMenu();
    }
  }

  async function initHeaderAuth() {
    const [profile, cartCount, unreadCount] = await Promise.all([
      fetchUserProfile(),
      fetchCartCount(),
      fetchUnreadNotifications()
    ]);
    renderBadges(cartCount, unreadCount);
    renderProfileState(profile);
  }

  function setupEventListeners() {
    const { wrap, btn, menu, logoutBtn } = getMenuElements();
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      if (localStorage.getItem('ctt_is_authenticated') === 'true') {
        e.preventDefault();
        toggleMenu();
      }
    });

    btn.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') && localStorage.getItem('ctt_is_authenticated') === 'true') {
        e.preventDefault();
        openMenu();
      }
    });

    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });

    if (menu) {
      menu.addEventListener('keydown', (e) => {
        const items = Array.from(menu.querySelectorAll('.menu-item'));
        const idx = items.indexOf(document.activeElement);
        if (e.key === 'Escape') {
          e.preventDefault();
          closeMenu();
          if (btn) btn.focus();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[(idx + 1) % items.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[(idx - 1 + items.length) % items.length].focus();
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (wrap && !wrap.contains(e.target) && isMenuOpen()) closeMenu();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { setupEventListeners(); initHeaderAuth(); });
  } else {
    setupEventListeners();
    initHeaderAuth();
  }

  window.addEventListener('chapa-cart-updated', initHeaderAuth);
  window.addEventListener('chapa-auth-updated', initHeaderAuth);
  window.addEventListener('storage', initHeaderAuth);

  global.ChapaAuth = { fetchCartCount, fetchUnreadNotifications, fetchUserProfile, handleLogout, initHeaderAuth, openMenu, closeMenu, toggleMenu };
})(typeof window !== 'undefined' ? window : this);
