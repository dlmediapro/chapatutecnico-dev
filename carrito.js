/**
 * Carrito de Servicios & Tienda Chapa (Figma Frame 1331:265)
 * Motor reactivo en Vanilla JS con sincronización en localStorage y accesibilidad WCAG 2.1 AA
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'chapa_cart';
  var COUPON_STORAGE_KEY = 'chapa_applied_coupon';

  // Catálogo canónico de las 9 herramientas de Figma Frame 1331:265
  var PRODUCTOS_FIGMA = [
    {
      id: 'prod-taladro-dewalt',
      tipo: 'producto',
      nombre: 'Taladro Percutor DWD024K',
      marca: 'DeWalt Industrial',
      precio: 279.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/taladro.webp',
      alt: 'Taladro Percutor DWD024K profesional DeWalt'
    },
    {
      id: 'prod-wincha-truper',
      tipo: 'producto',
      nombre: 'Wincha Contra Impactos 8m Truper',
      marca: 'Truper Expert',
      precio: 39.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/wincha.webp',
      alt: 'Wincha contra impactos 8 metros cinta negra Truper'
    },
    {
      id: 'prod-tablero-12polos',
      tipo: 'producto',
      nombre: 'Tablero Adosable Plástico Blanco 12 Polos',
      marca: 'Schneider Electric',
      precio: 384.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/tablero.webp',
      alt: 'Tablero adosable de plástico blanco 12 polos para instalaciones'
    },
    {
      id: 'prod-martillo-barnizado',
      tipo: 'producto',
      nombre: 'Martillo barnizado 29mm',
      marca: 'Stanley FatMax',
      precio: 51.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/martillo.webp',
      alt: 'Martillo mango barnizado 29 milímetros'
    },
    {
      id: 'prod-arco-acero',
      tipo: 'producto',
      nombre: 'Arco de acero Montarez',
      marca: 'Montarez Industrial',
      precio: 79.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/arco_acero.webp',
      alt: 'Arco de sierra en acero resistente Montarez'
    },
    {
      id: 'prod-sierra-circular',
      tipo: 'producto',
      nombre: 'Sierra circular eléctrica 1400W',
      marca: 'Bosch Professional',
      precio: 379.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/sierra.webp',
      alt: 'Sierra circular eléctrica 1400W de alta precisión'
    },
    {
      id: 'prod-caja-herramientas',
      tipo: 'producto',
      nombre: 'Caja de herramientas metálica 3 pisos',
      marca: 'Tactix Pro',
      precio: 199.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/caja_herramientas.webp',
      alt: 'Caja de herramientas metálica de 3 niveles con compartimientos'
    },
    {
      id: 'prod-cinturon-16bolsillos',
      tipo: 'producto',
      nombre: 'Cinturón de 16 bolsillos para herramientas',
      marca: 'ToughBuilt',
      precio: 89.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/cinturon.webp',
      alt: 'Cinturón porta herramientas ajustable de 16 bolsillos'
    },
    {
      id: 'prod-kit-herramientas',
      tipo: 'producto',
      nombre: 'Kit de herramientas manuales 250 piezas',
      marca: 'Workpro Complete',
      precio: 139.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/kit_herramientas.webp',
      alt: 'Maletín kit completo con 250 herramientas manuales y dados'
    }
  ];

  // Estado inicial seed si el usuario nunca ha agregado nada
  var SEED_CART = [
    {
      id: 'srv-electricidad-roberto',
      tipo: 'servicio',
      nombre: 'Instalación y Mantenimiento Eléctrico Residencial',
      tecnico: 'Roberto Rojas',
      especialidad: 'Electricista Certificado SENATI',
      badge: 'Verificado PNP • SAT',
      precio: 200.00,
      cantidad: 1,
      imagen: 'assets/img/tecnicos/roberto-rojas.webp',
      alt: 'Roberto Rojas técnico electricista calificado',
      distrito: 'Miraflores / San Isidro / Lima Metropolitana',
      horario: 'Hoy • Turno estimado 2:00 PM'
    },
    {
      id: 'prod-taladro-dewalt',
      tipo: 'producto',
      nombre: 'Taladro Percutor DWD024K',
      marca: 'DeWalt Industrial',
      precio: 279.90,
      cantidad: 1,
      imagen: 'assets/img/productos/taladro.webp',
      alt: 'Taladro Percutor DWD024K profesional DeWalt',
      stock: 'En stock'
    },
    {
      id: 'prod-wincha-truper',
      tipo: 'producto',
      nombre: 'Wincha Contra Impactos 8m Truper',
      marca: 'Truper Expert',
      precio: 39.90,
      cantidad: 1,
      imagen: 'assets/img/productos/wincha.webp',
      alt: 'Wincha contra impactos 8 metros cinta negra Truper',
      stock: 'En stock'
    }
  ];

  // Cupones activos admitidos
  var CUPONES = {
    'CHAPA20': { porcentaje: 20, desc: '20% de descuento en tu orden' },
    'CHAPA10': { porcentaje: 10, desc: '10% de descuento en tu orden' },
    'BIENVENIDA': { porcentaje: 15, desc: '15% de descuento primer servicio' }
  };

  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        var legacy = localStorage.getItem('chapa_carrito');
        if (legacy) {
          try {
            var parsedLegacy = JSON.parse(legacy);
            if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedLegacy));
              return parsedLegacy;
            }
          } catch (e) {}
        }
        // Primera visita: poblar con el seed inicial y guardar
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CART));
        return SEED_CART.slice();
      }
      return JSON.parse(raw) || [];
    } catch (e) {
      console.warn('Error leyendo localStorage:', e);
      return SEED_CART.slice();
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('chapa-cart-updated', { detail: { cart: cart } }));
    } catch (e) {
      console.warn('Error guardando en localStorage:', e);
    }
  }

  function getAppliedCoupon() {
    try {
      var code = localStorage.getItem(COUPON_STORAGE_KEY);
      if (code && CUPONES[code]) {
        return { code: code, data: CUPONES[code] };
      }
    } catch (e) {}
    return null;
  }

  function saveAppliedCoupon(code) {
    try {
      if (code) {
        localStorage.setItem(COUPON_STORAGE_KEY, code);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {}
  }

  // Notificador accesible Toast
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
    }, 3200);
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

  // Renderizador principal del carrito
  function renderCart() {
    var cart = getCart();
    var listContainer = document.getElementById('carrito-items-list');
    var emptyContainer = document.getElementById('carrito-empty-state');
    var summaryWrapper = document.getElementById('carrito-summary-wrapper');
    var titleCount = document.getElementById('carrito-header-count');

    if (!listContainer) return;

    var totalItemsCount = cart.reduce(function (sum, it) { return sum + (it.cantidad || 1); }, 0);
    if (titleCount) {
      titleCount.textContent = '(' + totalItemsCount + ' ' + (totalItemsCount === 1 ? 'ítem' : 'ítems') + ')';
    }

    if (cart.length === 0) {
      listContainer.innerHTML = '';
      listContainer.style.display = 'none';
      if (emptyContainer) emptyContainer.style.display = 'block';
      if (summaryWrapper) summaryWrapper.style.display = 'none';
      renderTotales(cart);
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    listContainer.style.display = 'block';
    if (summaryWrapper) summaryWrapper.style.display = 'block';

    var html = '';
    cart.forEach(function (item) {
      var isServicio = item.tipo === 'servicio';
      var itemTotal = (item.precio * item.cantidad).toFixed(2);

      html += '<article class="cart-item-card ' + (isServicio ? 'cart-item-service' : 'cart-item-product') + '" data-id="' + item.id + '">';
      
      // Columna Imagen
      html += '  <div class="cart-item-img-wrap">';
      html += '    <img src="' + item.imagen + '" alt="' + (item.alt || item.nombre) + '" width="96" height="96" loading="lazy" class="cart-item-thumb">';
      if (isServicio) {
        html += '    <span class="badge-item-tipo badge-servicio" title="Servicio verificado"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Servicio</span>';
      } else {
        html += '    <span class="badge-item-tipo badge-producto">Herramienta</span>';
      }
      html += '  </div>';

      // Columna Información Central
      html += '  <div class="cart-item-info">';
      if (isServicio) {
        html += '    <div class="cart-item-meta-row">';
        html += '      <span class="cart-item-tecnico"><strong>Técnico:</strong> ' + item.tecnico + '</span>';
        if (item.badge) {
          html += '      <span class="cart-item-badge-pnp">' + item.badge + '</span>';
        }
        html += '    </div>';
      }
      html += '    <h3 class="cart-item-title">' + item.nombre + '</h3>';
      
      if (isServicio) {
        html += '    <p class="cart-item-subtext"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> ' + (item.distrito || 'Lima Metropolitana') + '</p>';
        if (item.horario) {
          html += '    <p class="cart-item-subtext schedule-subtext"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg> ' + item.horario + '</p>';
        }
      } else {
        html += '    <p class="cart-item-subtext stock-subtext"><span class="stock-dot"></span> ' + (item.stock || 'Disponible') + ' ' + (item.marca ? '• ' + item.marca : '') + '</p>';
      }

      html += '    <div class="cart-item-unit-price">Precio unitario: <span>S/ ' + Number(item.precio).toFixed(2) + '</span></div>';
      html += '  </div>';

      // Columna Controles (Stepper + Precios + Eliminar)
      html += '  <div class="cart-item-actions">';
      html += '    <div class="item-stepper-control" role="group" aria-label="Cantidad para ' + item.nombre + '">';
      html += '      <button type="button" class="btn-stepper btn-stepper-minus" data-id="' + item.id + '" data-delta="-1" aria-label="Disminuir cantidad de ' + item.nombre + '"' + (item.cantidad <= 1 ? ' disabled' : '') + '>−</button>';
      html += '      <span class="stepper-count" aria-live="polite" aria-atomic="true">' + item.cantidad + '</span>';
      html += '      <button type="button" class="btn-stepper btn-stepper-plus" data-id="' + item.id + '" data-delta="1" aria-label="Aumentar cantidad de ' + item.nombre + '">+</button>';
      html += '    </div>';

      html += '    <div class="cart-item-total-col">';
      html += '      <span class="item-total-label">Total</span>';
      html += '      <span class="item-total-val">S/ ' + itemTotal + '</span>';
      html += '    </div>';

      html += '    <button type="button" class="btn-item-delete" data-id="' + item.id + '" aria-label="Eliminar ' + item.nombre + ' del carrito" title="Eliminar ítem">';
      html += '      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
      html += '    </button>';
      html += '  </div>';

      html += '</article>';
    });

    listContainer.innerHTML = html;
    renderTotales(cart);
    vincularEventosItems();
  }

  // Renderizar la tarjeta de resumen (Sticky Order Summary)
  function renderTotales(cart) {
    var subtotalSrvEl = document.getElementById('sum-subtotal-servicios');
    var subtotalProdEl = document.getElementById('sum-subtotal-productos');
    var envioEl = document.getElementById('sum-envio-val');
    var descuentoRowEl = document.getElementById('sum-descuento-row');
    var descuentoValEl = document.getElementById('sum-descuento-val');
    var descuentoLabelEl = document.getElementById('sum-descuento-label');
    var totalValEl = document.getElementById('sum-total-val');
    var itemsCountEl = document.getElementById('sum-items-count');

    var subtotalServicios = 0;
    var subtotalProductos = 0;
    var totalItemsCount = 0;

    cart.forEach(function (it) {
      var cant = it.cantidad || 1;
      totalItemsCount += cant;
      if (it.tipo === 'servicio') {
        subtotalServicios += it.precio * cant;
      } else {
        subtotalProductos += it.precio * cant;
      }
    });

    var subtotalGeneral = subtotalServicios + subtotalProductos;
    var costoEnvio = 0.00; // Desplazamiento Lima Promoción S/ 0.00

    var coupon = getAppliedCoupon();
    var montoDescuento = 0;

    if (coupon && coupon.data && subtotalGeneral > 0) {
      montoDescuento = (subtotalGeneral * (coupon.data.porcentaje / 100));
      if (descuentoRowEl) descuentoRowEl.style.display = 'flex';
      if (descuentoLabelEl) descuentoLabelEl.textContent = 'Descuento cupón (' + coupon.code + ' -' + coupon.data.porcentaje + '%)';
      if (descuentoValEl) descuentoValEl.textContent = '- S/ ' + montoDescuento.toFixed(2);
    } else {
      if (descuentoRowEl) descuentoRowEl.style.display = 'none';
    }

    var totalFinal = Math.max(0, subtotalGeneral + costoEnvio - montoDescuento);

    if (itemsCountEl) itemsCountEl.textContent = totalItemsCount;
    if (subtotalSrvEl) subtotalSrvEl.textContent = 'S/ ' + subtotalServicios.toFixed(2);
    if (subtotalProdEl) subtotalProdEl.textContent = 'S/ ' + subtotalProductos.toFixed(2);
    if (envioEl) envioEl.textContent = 'GRATIS';
    if (totalValEl) totalValEl.textContent = 'S/ ' + totalFinal.toFixed(2);

    // Actualizar también la insignia fija del header
    var headerBadge = document.querySelector('.header-cart-count');
    if (headerBadge) {
      headerBadge.textContent = totalItemsCount;
      headerBadge.style.display = totalItemsCount > 0 ? 'inline-flex' : 'none';
    }
  }

  // Vincular eventos a los elementos generados dinámicamente
  function vincularEventosItems() {
    var minusBtns = document.querySelectorAll('.btn-stepper-minus');
    var plusBtns = document.querySelectorAll('.btn-stepper-plus');
    var deleteBtns = document.querySelectorAll('.btn-item-delete');

    minusBtns.forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute('data-id');
        cambiarCantidad(id, -1);
      };
    });

    plusBtns.forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute('data-id');
        cambiarCantidad(id, 1);
      };
    });

    deleteBtns.forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute('data-id');
        eliminarItem(id);
      };
    });
  }

  function cambiarCantidad(id, delta) {
    var cart = getCart();
    var item = cart.find(function (it) { return it.id === id; });
    if (!item) return;

    var nuevaCantidad = (item.cantidad || 1) + delta;
    if (nuevaCantidad < 1) nuevaCantidad = 1;

    item.cantidad = nuevaCantidad;
    saveCart(cart);
    renderCart();
    announceSR('Cantidad actualizada para ' + item.nombre + ': ' + nuevaCantidad);
  }

  function eliminarItem(id) {
    var cart = getCart();
    var itemIndex = cart.findIndex(function (it) { return it.id === id; });
    if (itemIndex === -1) return;

    var itemEliminado = cart[itemIndex];
    var cardEl = document.querySelector('.cart-item-card[data-id="' + id + '"]');

    if (cardEl) {
      cardEl.classList.add('removing');
      setTimeout(function () {
        cart.splice(itemIndex, 1);
        saveCart(cart);
        renderCart();
        showToast('"' + itemEliminado.nombre + '" eliminado del carrito', 'success');
        announceSR(itemEliminado.nombre + ' eliminado del carrito');
      }, 240);
    } else {
      cart.splice(itemIndex, 1);
      saveCart(cart);
      renderCart();
      showToast('"' + itemEliminado.nombre + '" eliminado del carrito', 'success');
    }
  }

  // Agregar producto desde la cuadrícula de Venta Cruzada (Frame 1331:265)
  function agregarProductoCrossSell(producto) {
    var cart = getCart();
    var existente = cart.find(function (it) { return it.id === producto.id; });

    if (existente) {
      existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
      cart.push({
        id: producto.id,
        tipo: 'producto',
        nombre: producto.nombre,
        marca: producto.marca,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen,
        alt: producto.alt,
        stock: producto.stock
      });
    }

    saveCart(cart);
    renderCart();
    showToast('¡"' + producto.nombre + '" añadido a tu carrito!', 'success');
    announceSR('Producto añadido al carrito: ' + producto.nombre);

    // Scroll suave hacia la lista de items en mobile si es necesario
    var listContainer = document.getElementById('carrito-items-list');
    if (listContainer && window.innerWidth < 768) {
      listContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Renderizar la cuadrícula de 9 herramientas de Figma (Cross-sell)
  function renderCrossSellGrid() {
    var gridContainer = document.getElementById('cross-sell-grid');
    if (!gridContainer) return;

    var html = '';
    PRODUCTOS_FIGMA.forEach(function (prod) {
      html += '<article class="cross-sell-card" data-product-id="' + prod.id + '">';
      html += '  <div class="cross-sell-img-wrap">';
      html += '    <img src="' + prod.imagen + '" alt="' + prod.alt + '" width="140" height="140" loading="lazy" class="cross-sell-thumb">';
      html += '    <span class="cross-sell-stock-badge">' + prod.stock + '</span>';
      html += '  </div>';
      html += '  <div class="cross-sell-content">';
      html += '    <span class="cross-sell-brand">' + prod.marca + '</span>';
      html += '    <h4 class="cross-sell-title" title="' + prod.nombre + '">' + prod.nombre + '</h4>';
      html += '    <div class="cross-sell-price-row">';
      html += '      <span class="cross-sell-currency">S/</span>';
      html += '      <strong class="cross-sell-price">' + prod.precio.toFixed(2) + '</strong>';
      html += '    </div>';
      html += '    <button type="button" class="btn-cross-sell-add" data-id="' + prod.id + '" aria-label="Añadir ' + prod.nombre + ' al carrito">';
      html += '      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
      html += '      <span>Añadir al carrito</span>';
      html += '    </button>';
      html += '  </div>';
      html += '</article>';
    });

    gridContainer.innerHTML = html;

    // Vincular botones de añadir
    var addBtns = gridContainer.querySelectorAll('.btn-cross-sell-add');
    addBtns.forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute('data-id');
        var prod = PRODUCTOS_FIGMA.find(function (p) { return p.id === id; });
        if (prod) {
          // Microinteracción visual en el botón
          btn.classList.add('added');
          setTimeout(function () { btn.classList.remove('added'); }, 600);
          agregarProductoCrossSell(prod);
        }
      };
    });
  }

  // Manejo de Cupón de Descuento sin alert()
  function inicializarCupon() {
    var form = document.getElementById('form-cupon');
    var input = document.getElementById('input-cupon');
    var feedback = document.getElementById('cupon-feedback');
    var btnRemove = document.getElementById('btn-remover-cupon');

    if (!form || !input || !feedback) return;

    var current = getAppliedCoupon();
    if (current) {
      input.value = current.code;
      feedback.textContent = '✓ ' + current.data.desc;
      feedback.className = 'cupon-feedback-msg cupon-success';
      if (btnRemove) btnRemove.style.display = 'inline-block';
    }

    form.onsubmit = function (e) {
      e.preventDefault();
      var code = input.value.trim().toUpperCase();

      if (!code) {
        feedback.textContent = 'Por favor ingresa un código de cupón.';
        feedback.className = 'cupon-feedback-msg cupon-error';
        return;
      }

      if (CUPONES[code]) {
        saveAppliedCoupon(code);
        feedback.textContent = '¡Excelente! ' + CUPONES[code].desc;
        feedback.className = 'cupon-feedback-msg cupon-success';
        if (btnRemove) btnRemove.style.display = 'inline-block';
        showToast('Cupón ' + code + ' aplicado correctamente (-' + CUPONES[code].porcentaje + '%)', 'success');
        announceSR('Cupón aplicado con éxito. Descuento del ' + CUPONES[code].porcentaje + ' por ciento.');
        renderCart();
      } else {
        feedback.textContent = 'El cupón "' + code + '" no es válido o ha expirado. Prueba con CHAPA20.';
        feedback.className = 'cupon-feedback-msg cupon-error';
        showToast('Cupón inválido. Prueba con CHAPA20', 'error');
        announceSR('El cupón ingresado no es válido');
      }
    };

    if (btnRemove) {
      btnRemove.onclick = function () {
        saveAppliedCoupon(null);
        input.value = '';
        feedback.textContent = 'Cupón removido.';
        feedback.className = 'cupon-feedback-msg';
        btnRemove.style.display = 'none';
        showToast('Cupón removido', 'success');
        renderCart();
      };
    }
  }

  // Inicialización al cargar el DOM
  document.addEventListener('DOMContentLoaded', function () {
    renderCart();
    renderCrossSellGrid();
    inicializarCupon();

    // Sincronizar si otra pestaña modifica el carrito
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY || e.key === COUPON_STORAGE_KEY) {
        renderCart();
      }
    });
  });

  // Exportar API global segura para pruebas o scripts externos
  window.ChapaCart = {
    getCart: getCart,
    saveCart: saveCart,
    agregarProductoCrossSell: agregarProductoCrossSell,
    cambiarCantidad: cambiarCantidad,
    eliminarItem: eliminarItem,
    showToast: showToast
  };
})();
