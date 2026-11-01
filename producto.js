/**
 * Vista de Detalle de Producto / Proceso de Compra (Figma Frame 1334:408)
 * Galería interactiva, Stepper de Cantidad, Persistencia en Carrito y Carrusel Relacionados
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'chapa_cart';

  // Datos base del producto principal
  var PRODUCTO_MAIN = {
    id: 'prod-taladro-dewalt',
    nombre: 'Taladro Percutor DWD024K',
    categoria: 'electricas',
    categoriaLabel: 'Herramientas Eléctricas',
    marca: 'DeWalt Industrial',
    precio: 279.90,
    stock: 'En stock',
    imagen: 'assets/img/productos/taladro_thumb_1.webp',
    alt: 'Taladro Percutor DWD024K profesional DeWalt'
  };

  // Helper de persistencia en localStorage
  function obtenerCarrito() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function guardarCarrito(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('chapa-cart-updated'));
    } catch (e) {}
  }

  // Anunciador accesible para lectores de pantalla
  function announceSR(mensaje) {
    var sr = document.getElementById('chapa-sr-announcer');
    if (sr) {
      sr.textContent = '';
      setTimeout(function () {
        sr.textContent = mensaje;
      }, 50);
    }
  }

  // Notificador flotante Toast accesible
  function showToast(mensaje, tipo) {
    var toast = document.getElementById('chapa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'chapa-toast';
      toast.className = 'chapa-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.className = 'chapa-toast show' + (tipo === 'error' ? ' toast-error' : ' toast-success');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.className = 'chapa-toast';
    }, 2800);
  }

  // 1. Inicialización de Galería Interactiva
  function initGaleria() {
    var thumbButtons = document.querySelectorAll('.producto-thumb-btn');
    var mainImg = document.getElementById('producto-main-img');

    if (!mainImg || thumbButtons.length === 0) return;

    function activarThumbnail(btn) {
      thumbButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var newSrc = btn.getAttribute('data-img-src');
      var newAlt = btn.getAttribute('data-img-alt');

      if (newSrc && mainImg.src !== newSrc) {
        mainImg.style.opacity = '0.3';
        mainImg.style.transform = 'scale(0.97)';
        setTimeout(function () {
          mainImg.src = newSrc;
          if (newAlt) mainImg.alt = newAlt;
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1)';
        }, 120);
      }
    }

    thumbButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activarThumbnail(this);
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activarThumbnail(this);
        }
      });
    });
  }

  // 2. Selector de Cantidad (Stepper)
  function initStepper() {
    var btnMinus = document.getElementById('btn-qty-minus');
    var btnPlus = document.getElementById('btn-qty-plus');
    var inputQty = document.getElementById('input-producto-qty');

    if (!btnMinus || !btnPlus || !inputQty) return;

    function clampQty(val) {
      var num = parseInt(val, 10);
      if (isNaN(num) || num < 1) return 1;
      if (num > 10) return 10;
      return num;
    }

    btnMinus.addEventListener('click', function () {
      var current = clampQty(inputQty.value);
      if (current > 1) {
        inputQty.value = current - 1;
        announceSR('Cantidad actualizada a ' + inputQty.value);
      }
    });

    btnPlus.addEventListener('click', function () {
      var current = clampQty(inputQty.value);
      if (current < 10) {
        inputQty.value = current + 1;
        announceSR('Cantidad actualizada a ' + inputQty.value);
      }
    });

    inputQty.addEventListener('change', function () {
      this.value = clampQty(this.value);
    });
  }

  // 3. Añadir Producto Principal al Carrito
  function initAddPrincipal() {
    var btnAdd = document.getElementById('btn-add-main');
    var inputQty = document.getElementById('input-producto-qty');

    if (!btnAdd) return;

    btnAdd.addEventListener('click', function () {
      var qty = inputQty ? Math.max(1, parseInt(inputQty.value, 10) || 1) : 1;
      var cart = obtenerCarrito();

      var existing = cart.find(function (item) {
        return item.id === PRODUCTO_MAIN.id;
      });

      if (existing) {
        existing.cantidad = (existing.cantidad || 1) + qty;
      } else {
        cart.push({
          id: PRODUCTO_MAIN.id,
          nombre: PRODUCTO_MAIN.nombre,
          precio: PRODUCTO_MAIN.precio,
          imagen: PRODUCTO_MAIN.imagen,
          cantidad: qty,
          tipo: 'producto',
          marca: PRODUCTO_MAIN.marca
        });
      }

      guardarCarrito(cart);

      // Feedback en botón
      var origText = btnAdd.innerHTML;
      btnAdd.classList.add('btn-added-pulse');
      btnAdd.innerHTML = '<span>¡Añadido (' + qty + ')! ✔</span>';
      btnAdd.disabled = true;

      showToast(qty + ' × ' + PRODUCTO_MAIN.nombre + ' añadido al carrito', 'success');
      announceSR(qty + ' unidades de ' + PRODUCTO_MAIN.nombre + ' añadidas al carrito');

      setTimeout(function () {
        btnAdd.classList.remove('btn-added-pulse');
        btnAdd.innerHTML = origText;
        btnAdd.disabled = false;
      }, 1600);
    });
  }

  // 4. Añadir Productos Relacionados al Carrito
  function initAddRelacionados() {
    var btnsRel = document.querySelectorAll('.btn-relacionado-add');

    btnsRel.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        var nombre = this.getAttribute('data-nombre');
        var precio = parseFloat(this.getAttribute('data-precio')) || 0;
        var img = this.getAttribute('data-img');

        var cart = obtenerCarrito();
        var existing = cart.find(function (item) { return item.id === id; });

        if (existing) {
          existing.cantidad = (existing.cantidad || 1) + 1;
        } else {
          cart.push({
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: img,
            cantidad: 1,
            tipo: 'producto'
          });
        }

        guardarCarrito(cart);

        var origText = this.innerHTML;
        this.classList.add('btn-added-pulse');
        this.innerHTML = '<span>¡Añadido! ✔</span>';
        this.disabled = true;

        showToast(nombre + ' añadido al carrito', 'success');
        announceSR(nombre + ' añadido al carrito');

        var that = this;
        setTimeout(function () {
          that.classList.remove('btn-added-pulse');
          that.innerHTML = origText;
          that.disabled = false;
        }, 1600);
      });
    });
  }

  // 5. Navegación del Carrusel de Relacionados
  function initCarrusel() {
    var track = document.getElementById('relacionados-track');
    var btnNext = document.getElementById('btn-carousel-next');

    if (!track || !btnNext) return;

    btnNext.addEventListener('click', function () {
      var scrollAmount = 320;
      var maxScroll = track.scrollWidth - track.clientWidth;
      
      if (track.scrollLeft >= maxScroll - 20) {
        // Regresa al inicio si llegó al final
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });
  }

  // Inicialización al cargar el DOM
  document.addEventListener('DOMContentLoaded', function () {
    initGaleria();
    initStepper();
    initAddPrincipal();
    initAddRelacionados();
    initCarrusel();
  });
})();
