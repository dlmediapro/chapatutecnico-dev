// Menú móvil
const toggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
if (toggle && navbar) {
  toggle.addEventListener('click', () => {
    const open = navbar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  navbar.addEventListener('click', e => {
    if (e.target.tagName === 'A') { navbar.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }
  });
}

// Carrusel del hero: movimiento de pasarela interactivo y centrado
const carousel = document.getElementById('hero-carousel');
if (carousel) {
  let down = false, moved = false, startX = 0, startLeft = 0;
  let isHovered = false;

  // Interacción con mouse (arrastrar)
  carousel.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startLeft = carousel.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) {
      moved = true;
      carousel.classList.add('dragging');
      carousel.scrollLeft = startLeft - dx;
    }
  });
  window.addEventListener('pointerup', () => {
    down = false;
    carousel.classList.remove('dragging');
  });
  carousel.addEventListener('click', e => {
    if (moved) e.preventDefault();
  }, true);

  // Pausar pasarela si el usuario tiene el cursor encima
  carousel.addEventListener('mouseenter', () => { isHovered = true; });
  carousel.addEventListener('mouseleave', () => { isHovered = false; });
  carousel.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
  carousel.addEventListener('touchend', () => {
    setTimeout(() => { isHovered = false; }, 2000);
  }, { passive: true });

  // Movimiento automático tipo pasarela suave
  setInterval(() => {
    if (isHovered || down) return;
    if (carousel.scrollWidth <= carousel.clientWidth + 10) return;

    const cardWidth = carousel.firstElementChild ? carousel.firstElementChild.offsetWidth + 20 : 280;
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 15) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }, 3200);
}

// Carrusel interactivo de Ofertas del Mes
const offersWrap = document.querySelector('.offers');
if (offersWrap) {
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
}
