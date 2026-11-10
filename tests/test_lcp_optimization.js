/**
 * SUITE DE PRUEBAS: OPTIMIZACIÓN LCP, CORE WEB VITALS & BLOQUEO DE RENDERIZADO
 * Proyecto: Chapa Tu Técnico
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 SUITE DE PRUEBAS: OPTIMIZACIÓN LCP & WEB VITALS');
console.log('====================================================\n');

let total = 0;
let passed = 0;

function test(description, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${description}`);
    console.error(`    Detalle: ${err.message}`);
    process.exitCode = 1;
  }
}

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
const layoutJs = fs.readFileSync(path.join(rootDir, 'layout.js'), 'utf8');
const mainJs = fs.readFileSync(path.join(rootDir, 'main.js'), 'utf8');

// 1. Elemento LCP en index.html
test('Hero Section contiene etiqueta <img> semántica con src="img/banner_principal.webp"', () => {
  assert(indexHtml.includes('src="img/banner_principal.webp"'), 'index.html debe incluir src="img/banner_principal.webp"');
  const imgTagMatch = indexHtml.match(/<img[^>]*src=["']img\/banner_principal\.webp["'][^>]*>/i);
  assert(imgTagMatch, 'Debe existir una etiqueta <img> completa para banner_principal.webp');
});

test('Imagen principal Hero NO tiene loading="lazy"', () => {
  const imgTagMatch = indexHtml.match(/<img[^>]*src=["']img\/banner_principal\.webp["'][^>]*>/i);
  assert(imgTagMatch, 'Etiqueta <img> no encontrada');
  const tag = imgTagMatch[0];
  assert(!tag.includes('loading="lazy"'), 'La imagen LCP no debe contener loading="lazy"');
});

test('Imagen principal Hero contiene fetchpriority="high"', () => {
  const imgTagMatch = indexHtml.match(/<img[^>]*src=["']img\/banner_principal\.webp["'][^>]*>/i);
  assert(imgTagMatch, 'Etiqueta <img> no encontrada');
  const tag = imgTagMatch[0];
  assert(tag.includes('fetchpriority="high"'), 'La imagen LCP debe contener fetchpriority="high"');
});

test('Imagen principal Hero define dimensiones exactas width="1920" y height="1080" (CLS = 0)', () => {
  const imgTagMatch = indexHtml.match(/<img[^>]*src=["']img\/banner_principal\.webp["'][^>]*>/i);
  assert(imgTagMatch, 'Etiqueta <img> no encontrada');
  const tag = imgTagMatch[0];
  assert(tag.includes('width="1920"'), 'La imagen debe definir width="1920"');
  assert(tag.includes('height="1080"'), 'La imagen debe definir height="1080"');
});

test('Imagen principal Hero cumple accesibilidad WCAG 2.1 AA con alt semántico', () => {
  const imgTagMatch = indexHtml.match(/<img[^>]*src=["']img\/banner_principal\.webp["'][^>]*>/i);
  assert(imgTagMatch, 'Etiqueta <img> no encontrada');
  const tag = imgTagMatch[0];
  assert(/alt=["'][^"']+["']/.test(tag), 'La imagen debe tener un atributo alt descriptivo');
});

// 2. Preloads y Desbloqueo de Renderizado en <head>
test('<head> contiene preload de banner_principal.webp con fetchpriority="high"', () => {
  assert(indexHtml.includes('<link rel="preload" as="image" href="img/banner_principal.webp" fetchpriority="high">'), 'Falta preload LCP de banner_principal.webp');
});

test('<head> contiene preload de hoja de estilos crítica styles.css', () => {
  assert(indexHtml.includes('<link rel="preload" href="styles.css" as="style">'), 'Falta preload as="style" para styles.css');
});

test('Google Fonts se carga de manera no bloqueante (media="print" onload con preload y noscript)', () => {
  assert(indexHtml.includes('as="style" href="https://fonts.googleapis.com/css2?family=Oswald'), 'Falta preload de Google Fonts');
  assert(indexHtml.includes("media=\"print\" onload=\"this.media='all'\""), 'Falta patrón asíncrono para stylesheet de Google Fonts');
  assert(indexHtml.includes('<noscript>'), 'Falta bloque <noscript> de respaldo para Google Fonts');
});

test('Todos los scripts en index.html tienen atributo defer', () => {
  const scriptTags = [...indexHtml.matchAll(/<script\s+([^>]*src=["'][^"']+["'][^>]*)>/gi)];
  assert(scriptTags.length > 0, 'Deben existir scripts');
  for (const m of scriptTags) {
    assert(m[1].includes('defer'), `Script sin defer encontrado: <script ${m[1]}>`);
  }
});

// 3. Estilos y Estabilidad en styles.css
test('styles.css define .hero-bg-img con position absolute, object-fit cover y z-index 0', () => {
  assert(stylesCss.includes('.hero-bg-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;z-index:0;pointer-events:none;aspect-ratio:16 / 9}'), 'Falta regla CSS de .hero-bg-img');
});

test('styles.css define .hero-overlay para gradiente sin bloquear interacciones', () => {
  assert(stylesCss.includes('.hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.85) 0,rgba(0,0,0,.35) 90px,rgba(0,0,0,0) 220px);z-index:1;pointer-events:none}'), 'Falta regla CSS de .hero-overlay');
});

test('styles.css no duplica la descarga del banner como background en .hero-wrap', () => {
  assert(!stylesCss.includes("url('img/banner_principal.webp')"), 'styles.css no debe cargar duplicadamente banner_principal.webp como CSS background');
});

// 4. Estándar de Líneas y Calidad de Código (Máximo 250 líneas)
test('layout.js cumple estrictamente el límite de máximo 250 líneas', () => {
  const lines = layoutJs.split('\n').length;
  assert(lines <= 250, `layout.js tiene ${lines} líneas (debe ser <= 250)`);
});

test('main.js cumple estrictamente el límite de máximo 250 líneas', () => {
  const lines = mainJs.split('\n').length;
  assert(lines <= 250, `main.js tiene ${lines} líneas (debe ser <= 250)`);
});

test('Cero console.log en layout.js y main.js', () => {
  assert(!layoutJs.includes('console.log'), 'layout.js contiene console.log');
  assert(!mainJs.includes('console.log'), 'main.js contiene console.log');
});

console.log('\n----------------------------------------------------');
console.log(`Resultados: ${passed}/${total} pruebas pasadas con éxito.`);
console.log('----------------------------------------------------');

if (passed !== total) {
  process.exit(1);
} else {
  console.log('\n🎉 TODAS LAS VERIFICACIONES DE LCP Y RENDIMIENTO PASARON AL 100%.\n');
}

