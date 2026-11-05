const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 SUITE DE PRUEBAS: RENDIMIENTO ESTÁTICO, ASSETS & CLS = 0');
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
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
const layoutJs = fs.readFileSync(path.join(rootDir, 'layout.js'), 'utf8');

// Test 1: Verificar que ningún enlace CSS o script local esté roto en las 20 páginas HTML
test('Cero enlaces rotos a hojas de estilo o scripts locales en todas las páginas HTML', () => {
  assert(htmlFiles.length >= 20, `Deben existir al menos 20 archivos HTML (encontrados ${htmlFiles.length})`);
  
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');

    // Comprobar hojas de estilo
    const cssMatches = content.matchAll(/<link\s+[^>]*href=["']([^"']+)["'][^>]*>/gi);
    for (const match of cssMatches) {
      const fullTag = match[0];
      const href = match[1];
      if (fullTag.includes('rel="stylesheet"') || fullTag.includes("rel='stylesheet'")) {
        if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
          const resolvedPath = path.join(rootDir, href.split('?')[0]);
          assert(fs.existsSync(resolvedPath), `En ${file}: No existe la hoja de estilo local ${href}`);
        }
      }
    }

    // Comprobar scripts locales
    const scriptMatches = content.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi);
    for (const match of scriptMatches) {
      const src = match[1];
      if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
        const resolvedPath = path.join(rootDir, src.split('?')[0]);
        assert(fs.existsSync(resolvedPath), `En ${file}: No existe el script local ${src}`);
      }
    }
  }
});

// Test 2: Verificar que el 100% de scripts externos en HTML usen defer, async o type="module"
test('Todos los scripts externos cuentan con atributo defer, async o type="module" para no bloquear el parser', () => {
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    const scriptMatches = content.matchAll(/<script\s+([^>]*src=["'][^"']+["'][^>]*)>/gi);
    for (const match of scriptMatches) {
      const attrs = match[1];
      const isNonBlocking = attrs.includes('defer') || attrs.includes('async') || attrs.includes('type="module"');
      assert(isNonBlocking, `En ${file}: Script bloqueante detectado: <script ${attrs}>`);
    }
  }
});

// Test 3: Existencia y modularidad saludable de hojas de estilo por vista en css/views/
test('Las hojas de estilo modulares por vista existen en css/views/ y tienen tamaño saludable', () => {
  const viewsDir = path.join(rootDir, 'css/views');
  assert(fs.existsSync(viewsDir), 'El directorio css/views/ debe existir');

  const requiredModules = [
    'servicios.css',
    'electricidad.css',
    'tecnicos.css',
    'chat.css',
    'seguimiento.css',
    'solicitud.css',
    'tienda.css',
    'carrito.css',
    'soporte.css',
    'login.css',
    'cobertura.css',
    'nosotros.css',
    '404.css',
    'mensajes.css'
  ];

  for (const mod of requiredModules) {
    const modPath = path.join(viewsDir, mod);
    assert(fs.existsSync(modPath), `El módulo ${mod} debe existir en css/views/`);
    const stat = fs.statSync(modPath);
    assert(stat.size > 200, `El módulo ${mod} debe tener contenido real (tamaño: ${stat.size} bytes)`);
    assert(stat.size < 60000, `El módulo ${mod} no debe exceder el umbral saludable (tamaño: ${stat.size} bytes)`);
  }
});

// Test 4: Preservación estricta de variables y tokens de diseño en :root dentro de styles.css
test('styles.css preserva los tokens canónicos del sistema de diseño en :root', () => {
  assert(stylesCss.includes('--bg:#08233b'), 'Falta variable --bg:#08233b en styles.css');
  assert(stylesCss.includes('--orange:#e8532b'), 'Falta variable --orange:#e8532b en styles.css');
  assert(stylesCss.includes("--font-title:'Oswald',sans-serif"), "Falta variable --font-title:'Oswald' en styles.css");
  assert(stylesCss.includes("--font-body:'Raleway',sans-serif"), "Falta variable --font-body:'Raleway' en styles.css");
  assert(stylesCss.includes('--min-touch-target:44px'), 'Falta variable --min-touch-target:44px en styles.css');
});

// Test 5: Desbloqueo del hilo principal e inyección asíncrona en layout.js
test('layout.js implementa yielding con scheduler.yield() para fragmentar tareas largas (>50ms)', () => {
  assert(layoutJs.includes('yieldToMain'), 'layout.js debe definir la función helper yieldToMain');
  assert(layoutJs.includes('scheduler.yield'), 'layout.js debe consultar scheduler.yield()');
  assert(layoutJs.includes('requestIdleCallback') || layoutJs.includes('setTimeout'), 'layout.js debe contar con fallback para navegadores sin Scheduler API');
  assert(layoutJs.includes('DOMContentLoaded'), 'layout.js debe gestionar eventos del ciclo de vida del DOM');
});

// Test 6: Invariantes de estabilidad visual (CLS = 0) en styles.css y layout.js
test('styles.css y layout.js configuran dimensiones estáticas y aspect-ratio para CLS = 0', () => {
  assert(stylesCss.includes('.topbar{min-height:36px'), 'La barra superior debe tener min-height reservado de 36px');
  assert(stylesCss.includes('.header{min-height:84px'), 'El header debe tener min-height reservado para evitar CLS');
  assert(stylesCss.includes('aspect-ratio:118 / 101'), 'El logotipo debe reservar aspect-ratio: 118 / 101');
  assert(layoutJs.includes('fetchpriority="high"'), 'El logotipo de cabecera debe elevar su prioridad con fetchpriority="high"');
  assert(layoutJs.includes('loading="lazy"'), 'El logotipo de pie de página debe diferirse con loading="lazy"');
});

// Test 7: Optimización de renderizado CSS (content-visibility y contain)
test('styles.css aplica content-visibility: auto y contain-intrinsic-size al footer para aligerar el árbol de renderizado', () => {
  assert(stylesCss.includes('content-visibility:auto'), 'styles.css debe aplicar content-visibility:auto');
  assert(stylesCss.includes('contain-intrinsic-size:auto none auto 420px'), 'styles.css debe definir contain-intrinsic-size en el footer para evitar saltos en scroll');
  assert(stylesCss.includes('.fab-whatsapp-container{contain:layout style paint'), 'El FAB debe aislarse con contain:layout style paint');
});

console.log('\n----------------------------------------------------');
console.log(`Resultados: ${passedTests}/${totalTests} pruebas pasadas con éxito.`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('\n🚀 TODAS LAS VERIFICACIONES DE RENDIMIENTO PASARON AL 100%.\n');
}
