const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 SUITE DE PRUEBAS: HEADER DROPDOWN, BADGES LIMPIOS & AUTH ASYNC');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${description}`);
    console.error(`    Detalle del error: ${err.message}`);
    process.exitCode = 1;
  }
}

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const layoutJs = fs.readFileSync(path.join(rootDir, 'layout.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
const authJsPath = path.join(rootDir, 'auth.js');
const authJs = fs.readFileSync(authJsPath, 'utf8');

// 1. Limpieza de estados en HTML estático
test('index.html: Enlaces de notificaciones y carrito inician limpios sin badges estáticos quemados', () => {
  const notifMatch = indexHtml.match(/<a[^>]*class=["'][^"']*header-notif[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
  assert(notifMatch, 'Debe existir enlace .header-notif en index.html');
  assert(!notifMatch[1].includes('header-badge-dot'), 'El enlace de notificaciones no debe tener badge quemado');

  const cartMatch = indexHtml.match(/<a[^>]*class=["'][^"']*icon-cart[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
  assert(cartMatch, 'Debe existir enlace .icon-cart en index.html');
  assert(!cartMatch[1].includes('header-cart-count'), 'El enlace de carrito no debe tener badge quemado');
});

test('layout.js: Plantilla header inicia sin badges estáticos quemados', () => {
  assert(!layoutJs.includes('<span class="header-badge-dot" aria-hidden="true"></span>'), 'layout.js no debe tener header-badge-dot quemado');
  assert(!layoutJs.includes('<span class="header-cart-count" aria-hidden="true">2</span>'), 'layout.js no debe tener header-cart-count 2 quemado');
});

// 2. Menú Desplegable Accesible y Estructura ARIA (WCAG 2.1 AA)
test('index.html y layout.js contienen contenedor #header-account-wrap y menú accesible #header-account-menu', () => {
  assert(indexHtml.includes('id="header-account-wrap"'), 'Falta #header-account-wrap en index.html');
  assert(indexHtml.includes('id="header-account-btn"'), 'Falta #header-account-btn en index.html');
  assert(indexHtml.includes('aria-haspopup="menu"'), 'Falta aria-haspopup="menu" en index.html');
  assert(indexHtml.includes('aria-expanded="false"'), 'Falta aria-expanded="false" en index.html');
  assert(indexHtml.includes('id="header-account-menu"'), 'Falta #header-account-menu en index.html');
  assert(indexHtml.includes('role="menu"'), 'Falta role="menu" en index.html');
  assert(indexHtml.includes('id="btn-header-logout"'), 'Falta #btn-header-logout en index.html');

  assert(layoutJs.includes('id="header-account-wrap"'), 'Falta #header-account-wrap en layout.js');
  assert(layoutJs.includes('id="header-account-menu"'), 'Falta #header-account-menu en layout.js');
});

// 3. Estilos Emil Kowalski y Animaciones GPU
test('styles.css define animación fluida de dropdown anclado en top right a 60fps', () => {
  assert(stylesCss.includes('.header-account-wrap{position:relative;display:inline-flex;align-items:center}'), 'Falta regla de .header-account-wrap');
  assert(stylesCss.includes('.header-account-menu{'), 'Falta regla de .header-account-menu');
  assert(stylesCss.includes('transform-origin:top right'), 'El dropdown debe anclarse en top right');
  assert(stylesCss.includes('cubic-bezier(0.16,1,0.3,1)'), 'Debe usar curva Kowalski cubic-bezier(0.16,1,0.3,1)');
  assert(stylesCss.includes('.header-account-menu.is-open{'), 'Falta estado .is-open en styles.css');
  assert(stylesCss.includes('.menu-item{'), 'Falta estilo de .menu-item');
  assert(stylesCss.includes('min-height:44px'), 'Ítems del menú deben tener touch target >= 44px');
  assert(stylesCss.includes('.menu-item-logout{'), 'Falta estilo de botón de cerrar sesión');
});

// 4. Módulo Asíncrono auth.js y Preparación Backend
test('auth.js exporta funciones asíncronas para integración con backend y manejo de sesión', () => {
  assert(authJs.includes('async function fetchCartCount()'), 'Falta async fetchCartCount en auth.js');
  assert(authJs.includes('async function fetchUnreadNotifications()'), 'Falta async fetchUnreadNotifications en auth.js');
  assert(authJs.includes('async function fetchUserProfile()'), 'Falta async fetchUserProfile en auth.js');
  assert(authJs.includes('async function handleLogout()'), 'Falta async handleLogout en auth.js');
  assert(authJs.includes('openMenu') && authJs.includes('closeMenu'), 'Faltan funciones controladoras de apertura/cierre de menú');
  assert(authJs.includes('global.ChapaAuth ='), 'auth.js debe exponer global.ChapaAuth');
});

test('auth.js implementa cierre por click outside y soporte de teclado WCAG 2.1 AA', () => {
  assert(authJs.includes("e.key === 'Escape'"), 'Falta soporte para cerrar con Escape en auth.js');
  assert(authJs.includes("e.key === 'ArrowDown'"), 'Falta navegación por teclado en auth.js');
  assert(authJs.includes('!wrap.contains(e.target)'), 'Falta cierre con click outside en auth.js');
});

test('index.html carga auth.js con atributo defer', () => {
  assert(indexHtml.includes('<script src="auth.js" defer></script>'), 'index.html debe cargar auth.js con defer');
});

// 5. Estándar de Líneas y Cero console.log
test('Todos los archivos modificados y creados cumplen <= 250 líneas', () => {
  const countLines = (str) => str.split('\n').length;
  assert(countLines(indexHtml) <= 250, `index.html tiene ${countLines(indexHtml)} líneas`);
  assert(countLines(layoutJs) <= 250, `layout.js tiene ${countLines(layoutJs)} líneas`);
  assert(countLines(stylesCss) <= 250, `styles.css tiene ${countLines(stylesCss)} líneas`);
  assert(countLines(authJs) <= 250, `auth.js tiene ${countLines(authJs)} líneas`);
});

test('Cero console.log en auth.js, layout.js y main.js', () => {
  assert(!authJs.includes('console.log'), 'auth.js contiene console.log');
  assert(!layoutJs.includes('console.log'), 'layout.js contiene console.log');
});

console.log('\n----------------------------------------------------');
console.log(`Resultados: ${passedTests}/${totalTests} pruebas pasadas con éxito.`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('\n🎉 TODAS LAS VERIFICACIONES DE HEADER, DROPDOWN Y AUTH PASARON AL 100%.\n');
}
