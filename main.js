// ==========================================================
// Chapa Tu Técnico — Lógica Interactiva Principal
// ==========================================================

// 1. Menú Móvil Accesible (Figma Drawer + Escape + Focus + Scroll Lock)
(function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  if (!toggle || !navbar) return;

  function closeMenu() {
    navbar.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
    toggle.focus();
  }

  function openMenu() {
    navbar.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-locked');
    const closeBtn = document.getElementById('mobile-nav-close');
    if (closeBtn) closeBtn.focus();
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navbar.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navbar.addEventListener('click', (e) => {
    if (e.target.closest('#mobile-nav-close') || e.target.closest('a')) {
      closeMenu();
    }
  });

  // Heurística #3: Control del usuario con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('open')) {
      closeMenu();
    }
  });

  // Clic en backdrop fuera del contenido del menú
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('open') && !navbar.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
})();

// 2. Carrusel Infinito del Hero (Navegación Híbrida: Autoplay + Flechas + Touch)
(function initHeroInfiniteCarousel() {
  const viewport = document.getElementById('hero-carousel-viewport');
  const track = document.getElementById('hero-carousel-track');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (!viewport || !track) return;

  const originalItems = Array.from(track.children);
  const total = originalItems.length;
  if (total === 0) return;

  // Clonar elementos al inicio y al final para bucle infinito perfecto
  originalItems.forEach(item => {
    const cloneBefore = item.cloneNode(true);
    cloneBefore.setAttribute('aria-hidden', 'true');
    track.insertBefore(cloneBefore, track.firstChild);
  });

  originalItems.forEach(item => {
    const cloneAfter = item.cloneNode(true);
    cloneAfter.setAttribute('aria-hidden', 'true');
    track.appendChild(cloneAfter);
  });

  const allItems = Array.from(track.children);
  let currentIndex = total; // Iniciar en el primer elemento original (índice 5)
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let dragDelta = 0;
  let autoplayTimer = null;
  let isPaused = false;
  let resumeTimeout = null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getMetrics() {
    const card = allItems[0];
    const cardWidth = card ? card.offsetWidth : 280;
    const computedGap = parseFloat(window.getComputedStyle(track).gap) || 20;
    const step = cardWidth + computedGap;
    const leftOffset = (viewport.clientWidth - cardWidth) / 2;
    return { cardWidth, step, leftOffset };
  }

  function getPositionForIndex(index) {
    const { step, leftOffset } = getMetrics();
    return - (index * step) + leftOffset;
  }

  function moveTo(index, animate = true) {
    currentIndex = index;
    const targetPos = getPositionForIndex(currentIndex);
    currentTranslate = targetPos;

    if (animate && !prefersReducedMotion) {
      track.classList.add('is-animating');
    } else {
      track.classList.remove('is-animating');
    }

    track.style.transform = `translate3d(${targetPos}px, 0, 0)`;
  }

  // Ajuste invisible al completar la transición para bucle infinito
  track.addEventListener('transitionend', () => {
    track.classList.remove('is-animating');

    if (currentIndex >= total * 2) {
      currentIndex -= total;
      moveTo(currentIndex, false);
    } else if (currentIndex < total) {
      currentIndex += total;
      moveTo(currentIndex, false);
    }
  });

  function nextSlide() {
    moveTo(currentIndex + 1, true);
  }

  function prevSlide() {
    moveTo(currentIndex - 1, true);
  }

  // Controles de flechas
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pauseTemporary();
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pauseTemporary();
      prevSlide();
    });
  }

  // Autoplay Inteligente
  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (!isPaused && !isDragging) {
        nextSlide();
      }
    }, 3400);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function pauseTemporary() {
    isPaused = true;
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isPaused = false;
    }, 3500);
  }

  // Pausa en hover / focus
  viewport.addEventListener('mouseenter', () => { isPaused = true; });
  viewport.addEventListener('mouseleave', () => {
    if (!isDragging) isPaused = false;
  });
  viewport.addEventListener('focusin', () => { isPaused = true; });
  viewport.addEventListener('focusout', () => { isPaused = false; });

  // Gestos Táctiles y Arrastre con Puntero
  viewport.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDragging = true;
    isPaused = true;
    startX = e.clientX;
    dragDelta = 0;
    track.classList.remove('is-animating');
    track.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', e => {
    if (!isDragging) return;
    dragDelta = e.clientX - startX;
    const basePos = getPositionForIndex(currentIndex);
    track.style.transform = `translate3d(${basePos + dragDelta}px, 0, 0)`;
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('is-dragging');
    try { viewport.releasePointerCapture(e.pointerId); } catch (_) {}

    const swipeThreshold = 45;
    if (dragDelta < -swipeThreshold) {
      currentIndex += 1;
    } else if (dragDelta > swipeThreshold) {
      currentIndex -= 1;
    }

    moveTo(currentIndex, true);
    pauseTemporary();
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // Evitar que el clic abra enlaces durante un arrastre real
  track.addEventListener('click', e => {
    if (Math.abs(dragDelta) > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Inicialización y reajuste en cambio de tamaño de ventana
  moveTo(currentIndex, false);
  startAutoplay();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      moveTo(currentIndex, false);
    }, 100);
  });
})();

// 3. Carrusel Interactivo de Ofertas del Mes
(function initOffersSlider() {
  const offersWrap = document.querySelector('.offers');
  if (!offersWrap) return;

  const prevBtn = offersWrap.querySelector('.carousel-arrow.prev');
  const nextBtn = offersWrap.querySelector('.carousel-arrow.next');
  const titleEl = offersWrap.querySelector('.offers-text h3');
  const percentEl = offersWrap.querySelector('.discount .percent');
  const descEl = offersWrap.querySelector('.discount .desc');

  const offers = [
    {
      title: 'CELEBREMOS<br>JUNTOS LA<br>SEMANA DEL<br>GASFITERO',
      percent: '50 %',
      desc: 'DE DESCUENTO'
    },
    {
      title: 'INSTALACIONES<br>ELÉCTRICAS<br>SEGURAS Y CON<br>GARANTÍA',
      percent: '30 %',
      desc: 'EN DIAGNÓSTICO'
    },
    {
      title: 'REPARACIÓN DE<br>LÍNEA BLANCA<br>Y REFRIGERACIÓN<br>AL INSTANTE',
      percent: '25 %',
      desc: 'DE DESCUENTO'
    }
  ];

  let currentOffer = 0;

  function renderOffer(index) {
    if (!titleEl || !percentEl || !descEl) return;
    titleEl.style.opacity = '0';
    percentEl.style.opacity = '0';
    descEl.style.opacity = '0';

    setTimeout(() => {
      titleEl.innerHTML = offers[index].title;
      percentEl.textContent = offers[index].percent;
      descEl.textContent = offers[index].desc;
      titleEl.style.transition = 'opacity 0.25s ease-out';
      percentEl.style.transition = 'opacity 0.25s ease-out';
      descEl.style.transition = 'opacity 0.25s ease-out';
      titleEl.style.opacity = '1';
      percentEl.style.opacity = '1';
      descEl.style.opacity = '1';
    }, 150);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentOffer = (currentOffer + 1) % offers.length;
      renderOffer(currentOffer);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentOffer = (currentOffer - 1 + offers.length) % offers.length;
      renderOffer(currentOffer);
    });
  }
})();
