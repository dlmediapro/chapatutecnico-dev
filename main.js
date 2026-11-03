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

// 2. Carrusel del Hero: Scroll Horizontal Nativo y Controles Asistidos
(function initHeroScrollCarousel() {
  const viewport = document.getElementById('hero-carousel-viewport');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (!viewport) return;

  function getStep() {
    const card = viewport.querySelector('.hero-card');
    const gap = 20;
    return card ? card.offsetWidth + gap : 320;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
  }
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
