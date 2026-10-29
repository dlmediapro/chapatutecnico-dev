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
    // Si la pantalla es ancha y el contenido ya cabe centrado, no necesita desplazamiento
    if (carousel.scrollWidth <= carousel.clientWidth + 10) return;

    const cardWidth = carousel.firstElementChild ? carousel.firstElementChild.offsetWidth + 20 : 280;
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 15) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }, 3200);
}
