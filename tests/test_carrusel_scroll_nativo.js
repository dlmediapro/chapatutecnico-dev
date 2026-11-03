const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
const mainJs = fs.readFileSync(path.join(rootDir, 'main.js'), 'utf8');
const listaTecnicosExists = fs.existsSync(path.join(rootDir, 'lista-tecnicos.html'));

let passed = 0;
let total = 0;

function assertTest(name, condition, errorDetail = '') {
  total++;
  if (condition) {
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${name}`);
    if (errorDetail) console.error(`    Detalle: ${errorDetail}`);
  }
}

console.log('====================================================');
console.log('🧪 VERIFICACIÓN DEL CARRUSEL: SCROLL NATIVO Y ENLACES');
console.log('====================================================\n');

// 1. Eliminación del bucle infinito en main.js
assertTest(
  'main.js no contiene clonación de nodos DOM en el hero',
  !mainJs.includes('cloneBefore') && !mainJs.includes('cloneAfter'),
  'Se encontraron referencias a clones en main.js'
);

assertTest(
  'main.js no contiene temporizadores setInterval de autoplay para el hero',
  !mainJs.includes('autoplayTimer') && !mainJs.includes('3400'),
  'Se encontró autoplay setInterval en main.js'
);

assertTest(
  'main.js implementa scroll programático nativo (scrollBy) accesible para las flechas',
  mainJs.includes('initHeroScrollCarousel') && mainJs.includes('viewport.scrollBy'),
  'No se encontró initHeroScrollCarousel o scrollBy en main.js'
);

// 2. CSS scroll horizontal nativo y oculto
assertTest(
  'styles.css define scroll horizontal con scroll-snap-type: x mandatory',
  stylesCss.includes('overflow-x:auto') && stylesCss.includes('scroll-snap-type:x mandatory'),
  'Falta overflow-x:auto o scroll-snap-type:x mandatory en styles.css'
);

assertTest(
  'styles.css oculta la barra de scroll visual manteniendo accesibilidad táctil',
  stylesCss.includes('scrollbar-width:none') && stylesCss.includes('.hero-carousel-viewport::-webkit-scrollbar{display:none'),
  'Falta scrollbar-width:none o ::-webkit-scrollbar en styles.css'
);

assertTest(
  'styles.css configura hero-card con flex: 0 0 auto y scroll-snap-align: start',
  stylesCss.includes('.hero-card{position:relative;flex:0 0 auto') && stylesCss.includes('scroll-snap-align:start'),
  'hero-card no tiene flex:0 0 auto o scroll-snap-align:start'
);

// 3. Vinculación condicional y segura
assertTest(
  'Electricidad vincula a lista-tecnicos.html en el carrusel',
  indexHtml.includes('href="lista-tecnicos.html" class="hero-card" data-service="electricidad"'),
  'La tarjeta de Electricidad no apunta a lista-tecnicos.html'
);

assertTest(
  'Servicios sin vista creada apuntan a 404.html en el carrusel hero',
  indexHtml.includes('href="404.html" class="hero-card" data-service="blanca"') &&
  indexHtml.includes('href="404.html" class="hero-card" data-service="gasfiteria"') &&
  indexHtml.includes('href="404.html" class="hero-card" data-service="carpinteria"') &&
  indexHtml.includes('href="404.html" class="hero-card" data-service="cerrajeria"'),
  'Algún servicio no apunta a 404.html'
);

assertTest(
  'index.html no contiene enlaces vacíos o rotos href="#"',
  !indexHtml.includes('href="#"'),
  'Se detectaron href="#" en index.html'
);

assertTest(
  'El archivo lista-tecnicos.html existe y es accesible',
  listaTecnicosExists,
  'lista-tecnicos.html no existe en el directorio raíz'
);

console.log('\n----------------------------------------------------');
console.log(`Resultados: ${passed}/${total} pruebas pasadas con éxito.`);
console.log('----------------------------------------------------');

if (passed !== total) {
  process.exit(1);
}
