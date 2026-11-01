/**
 * Tienda Chapa (Figma Frame 1331:265)
 * Motor reactivo de Catálogo, Filtros por Categoría, Ordenamiento, Búsqueda y Sincronización con Carrito
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'chapa_cart';

  // Catálogo Oficial de 9 Productos (Frame 1331:265 Figma) + Ítems complementarios para "VER MÁS"
  var CATALOGO_BASE = [
    {
      id: 'prod-taladro-dewalt',
      nombre: 'Taladro Percutor DWD024K',
      categoria: 'electricas',
      categoriaLabel: 'Herramientas Eléctricas',
      marca: 'DeWalt Industrial',
      precio: 279.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/taladro.webp',
      alt: 'Taladro Percutor DWD024K profesional DeWalt'
    },
    {
      id: 'prod-wincha-truper',
      nombre: 'Wincha Contra Impactos 8m',
      categoria: 'medicion',
      categoriaLabel: 'Medición y Trazo',
      marca: 'Truper Expert',
      precio: 39.90, // Corrección de typo en Figma (S/39.99.90 -> S/39.90)
      stock: 'En stock',
      imagen: 'assets/img/productos/wincha.webp',
      alt: 'Wincha contra impactos 8 metros cinta negra Truper'
    },
    {
      id: 'prod-tablero-12polos',
      nombre: 'Tablero Adosable Plástico',
      categoria: 'tableros',
      categoriaLabel: 'Tableros y Material Eléctrico',
      marca: 'Schneider Electric',
      precio: 384.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/tablero.webp',
      alt: 'Tablero adosable de plástico blanco para interruptores'
    },
    {
      id: 'prod-martillo-barnizado',
      nombre: 'Martillo barnizado 29mm',
      categoria: 'manuales',
      categoriaLabel: 'Herramientas Manuales',
      marca: 'Stanley FatMax',
      precio: 51.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/martillo.webp',
      alt: 'Martillo mango barnizado 29 milímetros'
    },
    {
      id: 'prod-arco-acero',
      nombre: 'Arco de acero Montarez',
      categoria: 'manuales',
      categoriaLabel: 'Herramientas Manuales',
      marca: 'Montarez Industrial',
      precio: 79.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/arco_acero.webp',
      alt: 'Arco de sierra en acero resistente Montarez'
    },
    {
      id: 'prod-sierra-circular',
      nombre: 'Sierra circular eléctrica',
      categoria: 'electricas',
      categoriaLabel: 'Herramientas Eléctricas',
      marca: 'Bosch Professional',
      precio: 379.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/sierra.webp',
      alt: 'Sierra circular eléctrica 1400W de alta precisión'
    },
    {
      id: 'prod-caja-herramientas',
      nombre: 'Caja de herramientas',
      categoria: 'organizadores',
      categoriaLabel: 'Cajas y Organizadores',
      marca: 'Tactix Pro',
      precio: 199.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/caja_herramientas.webp',
      alt: 'Caja de herramientas metálica de 3 niveles con compartimientos'
    },
    {
      id: 'prod-cinturon-16bolsillos',
      nombre: 'Cinturón porta herramientas DeWalt',
      categoria: 'organizadores',
      categoriaLabel: 'Cajas y Organizadores',
      marca: 'DeWalt Industrial',
      precio: 89.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/cinturon.webp',
      alt: 'Cinturón porta herramientas ajustable de 16 bolsillos'
    },
    {
      id: 'prod-kit-herramientas',
      nombre: 'Kit de herramienta Manuales',
      categoria: 'kits',
      categoriaLabel: 'Kits y Juegos de Herramientas',
      marca: 'Workpro Complete',
      precio: 139.90,
      stock: 'En stock',
      imagen: 'assets/img/productos/kit_herramientas.webp',
      alt: 'Maletín kit completo con 250 herramientas manuales y dados'
    }
  ];

  // Productos adicionales para carga progresiva ("VER MÁS")
  var CATALOGO_EXTRA = [
    {
      id: 'prod-multimetro-digital',
      nombre: 'Multímetro Digital Automotriz',
      categoria: 'medicion',
      categoriaLabel: 'Medición y Trazo',
      marca: 'Fluke / Truper',
      precio: 95.00,
      stock: 'En stock',
      imagen: 'assets/img/productos/taladro.webp',
      alt: 'Multímetro digital con probador de continuidad'
    },
    {
      id: 'prod-alicate-universal',
      nombre: 'Alicate Universal Aislado 1000V',
      categoria: 'manuales',
      categoriaLabel: 'Herramientas Manuales',
      marca: 'Stanley',
      precio: 45.00,
      stock: 'En stock',
      imagen: 'assets/img/productos/martillo.webp',
      alt: 'Alicate universal de presión con mango dieléctrico'
    },
    {
      id: 'prod-destornilladores-set',
      nombre: 'Set de 8 Destornilladores Aislados',
      categoria: 'manuales',
      categoriaLabel: 'Herramientas Manuales',
      marca: 'Tactix Pro',
      precio: 68.00,
      stock: 'En stock',
      imagen: 'assets/img/productos/kit_herramientas.webp',
      alt: 'Juego de 8 destornilladores planos y estrella aislados'
    }
  ];

  var productosActivos = CATALOGO_BASE.slice();
  var categoriaFiltro = 'todas';
  var terminoBusqueda = '';
  var criterioOrden = 'recomendados';
  var extraCargado = false;

  // Normalizador para búsqueda insensible a tildes y mayúsculas
  function normalizarTexto(txt) {
    return (txt || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
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

  // Notificador flotante Toast
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

  // Filtrado y Ordenamiento
  function filtrarYOrdenar() {
    var query = normalizarTexto(terminoBusqueda);
    var resultado = productosActivos.filter(function (prod) {
      var matchCategoria = (categoriaFiltro === 'todas' || prod.categoria === categoriaFiltro);
      if (!matchCategoria) return false;

      if (!query) return true;

      var nombreNorm = normalizarTexto(prod.nombre);
      var marcaNorm = normalizarTexto(prod.marca);
      var catNorm = normalizarTexto(prod.categoriaLabel);

      return (
        nombreNorm.indexOf(query) !== -1 ||
        marcaNorm.indexOf(query) !== -1 ||
        catNorm.indexOf(query) !== -1
      );
    });

    // Ordenamiento
    if (criterioOrden === 'precio-menor') {
      resultado.sort(function (a, b) { return a.precio - b.precio; });
    } else if (criterioOrden === 'precio-mayor') {
      resultado.sort(function (a, b) { return b.precio - a.precio; });
    } else if (criterioOrden === 'nombre-az') {
      resultado.sort(function (a, b) { return a.nombre.localeCompare(b.nombre); });
    }

    renderGrid(resultado);
  }

  // Renderizar la matriz de productos
  function renderGrid(productos) {
    var gridContainer = document.getElementById('tienda-grid');
    var emptyContainer = document.getElementById('tienda-sin-resultados');
    var verMasContainer = document.getElementById('tienda-ver-mas-wrap');

    if (!gridContainer) return;

    if (productos.length === 0) {
      gridContainer.innerHTML = '';
      gridContainer.style.display = 'none';
      if (emptyContainer) {
        emptyContainer.style.display = 'block';
        var queryLabel = document.getElementById('busqueda-termino-label');
        if (queryLabel) {
          queryLabel.textContent = terminoBusqueda ? ' "' + terminoBusqueda + '"' : '';
        }
      }
      if (verMasContainer) verMasContainer.style.display = 'none';
      announceSR('No se encontraron herramientas que coincidan con la búsqueda.');
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    gridContainer.style.display = 'grid';
    if (verMasContainer) verMasContainer.style.display = 'flex';

    var html = '';
    productos.forEach(function (prod, idx) {
      var isAboveFold = idx < 3;
      var fetchAttr = isAboveFold ? 'fetchpriority="high"' : 'loading="lazy"';

      html += '<article class="tienda-producto-card" data-id="' + prod.id + '" data-cat="' + prod.categoria + '">';
      
      // Contenedor Blanco de Imagen (Figma 1:1)
      html += '  <div class="tienda-img-box">';
      html += '    <img src="' + prod.imagen + '" alt="' + prod.alt + '" width="260" height="260" ' + fetchAttr + ' class="tienda-card-thumb">';
      html += '  </div>';

      // Información de Producto
      html += '  <div class="tienda-card-body">';
      html += '    <h3 class="tienda-card-title" title="' + prod.nombre + '">' + prod.nombre + '</h3>';
      
      // Fila Precio Badge Naranja (Figma 1:1)
      html += '    <div class="tienda-card-price-row">';
      html += '      <span class="tienda-price-badge">S/' + prod.precio.toFixed(2) + '</span>';
      html += '    </div>';

      // Estado de Stock en Verde (Figma 1:1)
      html += '    <div class="tienda-card-stock-row">';
      html += '      <span class="tienda-stock-dot" aria-hidden="true"></span>';
      html += '      <span class="tienda-stock-text">' + prod.stock + '</span>';
      html += '    </div>';

      // Botón Píldora Blanco Añadir al Carrito (Figma 1:1)
      html += '    <button type="button" class="btn-tienda-add-cart" data-id="' + prod.id + '" aria-label="Añadir ' + prod.nombre + ' al carrito">';
      html += '      <span>Añadir al carrito</span>';
      html += '    </button>';
      html += '  </div>';

      html += '</article>';
    });

    gridContainer.innerHTML = html;
    vincularBotonesAdd();
    announceSR('Mostrando ' + productos.length + ' herramientas en el catálogo.');
  }

  // Vincular eventos a los botones "Añadir al carrito"
  function vincularBotonesAdd() {
    var buttons = document.querySelectorAll('.btn-tienda-add-cart');
    buttons.forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute('data-id');
        var prod = productosActivos.find(function (p) { return p.id === id; });
        if (!prod) return;

        agregarAlCarrito(prod, this);
      };
    });
  }

  // Guardar en localStorage y emitir evento global
  function agregarAlCarrito(producto, btnElement) {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) cart = [];

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

      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('chapa-cart-updated', { detail: { cart: cart } }));

      // Feedback visual en el botón (cambio temporal sin popup)
      if (btnElement) {
        btnElement.classList.add('btn-added-pulse');
        var originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<span>✓ ¡Añadido!</span>';
        setTimeout(function () {
          btnElement.innerHTML = originalText;
          btnElement.classList.remove('btn-added-pulse');
        }, 1200);
      }

      // Animación en el badge del header
      var badge = document.querySelector('.header-cart-count');
      if (badge) {
        badge.classList.add('pulse');
        setTimeout(function () { badge.classList.remove('pulse'); }, 600);
      }

      showToast('¡"' + producto.nombre + '" añadido al carrito!', 'success');
      announceSR(producto.nombre + ' añadido al carrito.');
    } catch (e) {
      console.error('Error al agregar al carrito:', e);
    }
  }

  // Inicialización de la Barra de Herramientas (Categorías, Ordenamiento, Búsqueda)
  function inicializarToolbar() {
    // 1. Botón y Menú de Categorías
    var btnCat = document.getElementById('btn-categorias');
    var menuCat = document.getElementById('menu-categorias');
    var catNameLabel = document.getElementById('categoria-actual-label');

    if (btnCat && menuCat) {
      btnCat.onclick = function (e) {
        e.stopPropagation();
        var isOpen = menuCat.classList.contains('open');
        menuCat.classList.toggle('open');
        btnCat.setAttribute('aria-expanded', !isOpen);
      };

      document.addEventListener('click', function (e) {
        if (!menuCat.contains(e.target) && e.target !== btnCat) {
          menuCat.classList.remove('open');
          btnCat.setAttribute('aria-expanded', 'false');
        }
      });

      var catLinks = menuCat.querySelectorAll('.cat-menu-item');
      catLinks.forEach(function (link) {
        link.onclick = function (e) {
          e.preventDefault();
          categoriaFiltro = this.getAttribute('data-cat') || 'todas';
          
          catLinks.forEach(function (l) { l.classList.remove('active'); });
          this.classList.add('active');

          if (catNameLabel) {
            catNameLabel.textContent = this.textContent.trim();
          }

          menuCat.classList.remove('open');
          btnCat.setAttribute('aria-expanded', 'false');
          filtrarYOrdenar();
        };
      });
    }

    // 2. Selector de Ordenamiento
    var selectOrden = document.getElementById('select-ordenar');
    if (selectOrden) {
      selectOrden.onchange = function () {
        criterioOrden = this.value;
        filtrarYOrdenar();
      };
    }

    // 3. Barra de Búsqueda Instantánea (Search UX)
    var inputBuscar = document.getElementById('input-buscar-tienda');
    if (inputBuscar) {
      inputBuscar.oninput = function () {
        terminoBusqueda = this.value;
        filtrarYOrdenar();
      };

      // Limpiar al presionar ESC
      inputBuscar.onkeydown = function (e) {
        if (e.key === 'Escape') {
          this.value = '';
          terminoBusqueda = '';
          filtrarYOrdenar();
        }
      };
    }

    // 4. Búsqueda por Voz (Web Speech API)
    var btnMic = document.getElementById('btn-tienda-mic');
    if (btnMic && inputBuscar) {
      btnMic.onclick = function () {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          var recognition = new SpeechRecognition();
          recognition.lang = 'es-PE';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          btnMic.classList.add('mic-listening');
          showToast('Escuchando... di el nombre de la herramienta', 'success');

          recognition.onresult = function (event) {
            var speechResult = event.results[0][0].transcript;
            inputBuscar.value = speechResult;
            terminoBusqueda = speechResult;
            filtrarYOrdenar();
            showToast('Buscando: "' + speechResult + '"', 'success');
          };

          recognition.onspeechend = function () {
            recognition.stop();
            btnMic.classList.remove('mic-listening');
          };

          recognition.onerror = function () {
            btnMic.classList.remove('mic-listening');
            showToast('No se detectó voz. Intenta escribiendo en el buscador.', 'error');
          };

          recognition.start();
        } else {
          showToast('Tu navegador no soporta búsqueda por voz. Usa el teclado.', 'error');
        }
      };
    }

    // 5. Botón "Limpiar búsqueda" del estado vacío
    var btnLimpiar = document.getElementById('btn-limpiar-busqueda');
    if (btnLimpiar && inputBuscar) {
      btnLimpiar.onclick = function () {
        inputBuscar.value = '';
        terminoBusqueda = '';
        categoriaFiltro = 'todas';
        criterioOrden = 'recomendados';
        if (selectOrden) selectOrden.value = 'recomendados';
        if (catNameLabel) catNameLabel.textContent = 'CATEGORÍAS';
        var catLinksAll = document.querySelectorAll('.cat-menu-item');
        catLinksAll.forEach(function (l) {
          if (l.getAttribute('data-cat') === 'todas') l.classList.add('active');
          else l.classList.remove('active');
        });
        filtrarYOrdenar();
      };
    }

    // 6. Botón "VER MÁS"
    var btnVerMas = document.getElementById('btn-ver-mas');
    if (btnVerMas) {
      btnVerMas.onclick = function () {
        if (!extraCargado) {
          extraCargado = true;
          productosActivos = CATALOGO_BASE.concat(CATALOGO_EXTRA);
          filtrarYOrdenar();
          btnVerMas.textContent = 'CATÁLOGO COMPLETO MOSTRADO ✓';
          btnVerMas.classList.add('btn-ver-mas-done');
          showToast('Se cargaron 3 herramientas adicionales.', 'success');
          announceSR('Nuevas herramientas cargadas en la tienda.');
        } else {
          showToast('Ya estás viendo todos los productos disponibles en esta categoría.', 'success');
        }
      };
    }
  }

  // Inicialización global al cargar DOM
  document.addEventListener('DOMContentLoaded', function () {
    renderGrid(productosActivos);
    inicializarToolbar();
  });

  // Exportar API segura para tests o scripts
  window.ChapaTienda = {
    filtrarYOrdenar: filtrarYOrdenar,
    agregarAlCarrito: agregarAlCarrito,
    showToast: showToast
  };
})();
