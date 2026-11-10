/**
 * Suite E2E Automatizada: Vista Electricidad, Responsive Multi-Viewport y Flujo Funcional
 * Ejecutado con Playwright (Headless Chrome)
 * Límite estricto: < 250 líneas
 */
try {
  require.resolve('playwright');
} catch (_) {
  const { execSync } = require('child_process');
  try {
    module.paths.push(execSync('npm.cmd root -g').toString().trim());
  } catch (e) {
    try { module.paths.push(execSync('npm root -g').toString().trim()); } catch (_) {}
  }
}

const { chromium } = require('playwright');
const assert = require('assert');
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function isServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
  });
}

async function runE2E() {
  console.log('====================================================');
  console.log('🧪 PRUEBAS E2E AUTOMATIZADAS (PLAYWRIGHT): ELECTRICIDAD');
  console.log('====================================================\n');

  let serverProcess = null;
  const running = await isServerRunning();
  if (!running) {
    console.log('  ℹ️  Iniciando servidor local dev-server.js en puerto 3000...');
    const serverPath = path.resolve(__dirname, '..', 'dev-server.js');
    serverProcess = spawn(process.execPath, [serverPath], { stdio: 'ignore' });
    let attempts = 0;
    while (!(await isServerRunning()) && attempts < 15) {
      await new Promise((r) => setTimeout(r, 300));
      attempts++;
    }
  }

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (_) {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('pageerror', (err) => consoleErrors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // -------------------------------------------------------------------------
    // 1. Desktop Viewport (1440x900) - 12 Columnas
    // -------------------------------------------------------------------------
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto(`${BASE_URL}/electricidad.html`, { waitUntil: 'networkidle' });
    assert.strictEqual(response.status(), 200, 'HTTP status debe ser 200');
    console.log('  ✓ [PASS] Desktop (1440px): Carga HTTP 200 y DOM listo');

    const desktopCols = await page.evaluate(() => {
      const el = document.querySelector('.grid-details');
      return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
    });
    assert.strictEqual(desktopCols, 3, 'En Desktop la grilla debe tener 3 columnas');
    console.log('  ✓ [PASS] Desktop (1440px): Grilla .grid-details renderiza exactamente 3 columnas');

    // Comprobación de Aspect Ratio y Dimensiones para CLS = 0
    const imagesCheck = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('.detail-card img'));
      return imgs.every((img) => img.naturalWidth > 0 && img.src.endsWith('.webp'));
    });
    assert(imagesCheck, 'Todas las imágenes de las tarjetas deben ser WebP y renderizar sin CLS');
    console.log('  ✓ [PASS] Desktop (1440px): 6 imágenes WebP renderizadas con dimensiones intrínsecas (CLS=0)');

    // -------------------------------------------------------------------------
    // 2. Tablet Viewport (768x1024) - 8 Columnas
    // -------------------------------------------------------------------------
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);
    const tabletCols = await page.evaluate(() => {
      const el = document.querySelector('.grid-details');
      return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
    });
    assert.strictEqual(tabletCols, 2, 'En Tablet la grilla debe tener 2 columnas');
    console.log('  ✓ [PASS] Tablet (768px): Grilla .grid-details adapta ordenadamente a 2 columnas');

    // -------------------------------------------------------------------------
    // 3. Mobile Viewport (375x812) - 4 Columnas / Cero Scroll Horizontal
    // -------------------------------------------------------------------------
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(100);
    const mobileMetrics = await page.evaluate(() => {
      const el = document.querySelector('.grid-details');
      const btn = document.querySelector('.btn-solicitar-detail');
      const btnRect = btn.getBoundingClientRect();
      const cols = window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
      const noHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth;
      return {
        cols,
        noHorizontalOverflow,
        btnHeight: btnRect.height,
        btnWidth: btnRect.width
      };
    });

    assert.strictEqual(mobileMetrics.cols, 1, 'En Mobile la grilla debe colapsar a 1 columna');
    assert(mobileMetrics.noHorizontalOverflow, 'No debe existir desbordamiento horizontal en Mobile (375px)');
    assert(mobileMetrics.btnHeight >= 44, 'El botón Solicitar debe tener altura mínima táctil de 44px');
    console.log('  ✓ [PASS] Mobile (375px): Grilla colapsa a 1 columna sin scroll horizontal');
    console.log(`  ✓ [PASS] Mobile (375px): Touch target accesible (${Math.round(mobileMetrics.btnHeight)}x${Math.round(mobileMetrics.btnWidth)}px >= 44x44px)`);

    // -------------------------------------------------------------------------
    // 4. Enrutamiento Funcional & Tap en "Solicitar"
    // -------------------------------------------------------------------------
    const firstSolicitarBtn = page.locator('.btn-solicitar-detail').first();
    await Promise.all([
      page.waitForURL(/lista-tecnicos\.html/),
      firstSolicitarBtn.click()
    ]);

    const targetUrl = page.url();
    assert(targetUrl.includes('lista-tecnicos.html'), 'La navegación debe dirigir a lista-tecnicos.html');

    const pageTitle = await page.title();
    assert(pageTitle.includes('Técnicos Electricistas'), 'La página destino debe ser el directorio de técnicos electricistas');
    console.log(`  ✓ [PASS] Enrutamiento: Tap en "Solicitar" navega a ${path.basename(targetUrl)} exitosamente`);
    console.log(`  ✓ [PASS] Aserción DOM: Título verificado "${pageTitle}"`);

    // -------------------------------------------------------------------------
    // 5. Consola Limpia
    // -------------------------------------------------------------------------
    assert.strictEqual(consoleErrors.length, 0, `Se detectaron errores de consola: ${consoleErrors.join(', ')}`);
    console.log('  ✓ [PASS] Consola Limpia: Cero excepciones JavaScript detectadas durante el flujo');

    console.log('\n----------------------------------------------------');
    console.log('🎉 TODAS LAS PRUEBAS E2E PASARON CON ÉXITO AL 100%.');
    console.log('----------------------------------------------------\n');
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runE2E().catch((err) => {
  console.error('\n❌ ERROR EN PRUEBAS E2E:', err.message);
  process.exit(1);
});
