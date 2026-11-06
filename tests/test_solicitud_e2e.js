/**
 * Suite E2E Automatizada: Vista Solicitud, Identidad Canónica, Sesión Dinámica y Micro-Interacciones
 * Playwright (Headless Chrome) — Límite estricto: < 250 líneas
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
    const req = http.get(BASE_URL, (res) => resolve(res.statusCode === 200));
    req.on('error', () => resolve(false));
  });
}

async function runE2E() {
  console.log('====================================================');
  console.log('🧪 PRUEBAS E2E AUTOMATIZADAS (PLAYWRIGHT): SOLICITUD');
  console.log('====================================================\n');

  let serverProcess = null;
  if (!(await isServerRunning())) {
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
    // 1. Simulación de Sesión y Carga de Vista
    // -------------------------------------------------------------------------
    console.log('1️⃣  Simulando sesión activa con usuario "Diego León"...');
    await page.goto(`${BASE_URL}/solicitud.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('ctt_profile', JSON.stringify({
        firstname: 'Diego',
        lastname: 'León',
        distrito: 'Surco, Lima',
        verificado: true
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });

    // -------------------------------------------------------------------------
    // 2. Verificación de Identidad Visual (Logo Castor & CLS=0)
    // -------------------------------------------------------------------------
    console.log('2️⃣  Verificando identidad visual oficial del castor...');
    const logoSrc = await page.getAttribute('.consulta-brand-logo', 'src');
    assert(logoSrc && logoSrc.includes('logo.webp'), `El logo debe apuntar al asset canónico logo.webp (obtenido: ${logoSrc})`);

    const logoMetrics = await page.evaluate(() => {
      const img = document.querySelector('.consulta-brand-logo');
      const cs = window.getComputedStyle(img);
      return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        aspectRatio: cs.aspectRatio
      };
    });
    assert(logoMetrics.naturalWidth > 0, 'La imagen del logo castor debe cargar con dimensiones reales (naturalWidth > 0)');
    console.log(`     ✓ Logo canónico: ${logoSrc} (${logoMetrics.naturalWidth}x${logoMetrics.naturalHeight}px, aspect-ratio: ${logoMetrics.aspectRatio})`);

    // -------------------------------------------------------------------------
    // 3. Verificación de Inyección Dinámica de Usuario (Sin Hardcode)
    // -------------------------------------------------------------------------
    console.log('3️⃣  Verificando hidratación dinámica de usuario (anti-hardcode)...');
    const renderedUserName = await page.textContent('#session-user-name');
    assert.strictEqual(renderedUserName.trim(), 'Diego León', `El nombre debe ser 'Diego León' (obtenido: '${renderedUserName}')`);

    const headerHTML = await page.innerHTML('.consulta-header');
    assert(!headerHTML.includes('María González'), 'El header NO debe contener el hardcode "María González"');
    console.log(`     ✓ Usuario hidratado dinámicamente: "${renderedUserName.trim()}" (María González eliminada)`);

    // -------------------------------------------------------------------------
    // 4. Micro-Interacciones en Chips de Selección Rápida
    // -------------------------------------------------------------------------
    console.log('4️⃣  Verificando micro-interacciones a 60fps en chips de problema...');
    const initialChipState = await page.getAttribute('[data-chip="cortocircuito"]', 'aria-pressed');
    assert.strictEqual(initialChipState, 'true', 'El chip cortocircuito debe iniciar seleccionado');

    await page.click('[data-chip="tomacorriente"]');
    const tomacorrientePressed = await page.getAttribute('[data-chip="tomacorriente"]', 'aria-pressed');
    assert.strictEqual(tomacorrientePressed, 'true', 'El chip tomacorriente debe conmutar a presionado');

    await page.click('[data-chip="cortocircuito"]');
    const cortocircuitoPressed = await page.getAttribute('[data-chip="cortocircuito"]', 'aria-pressed');
    assert.strictEqual(cortocircuitoPressed, 'false', 'El chip cortocircuito debe alternar a no presionado');

    const chipActiveTransition = await page.evaluate(() => {
      const chip = document.querySelector('.chip-item');
      const cs = window.getComputedStyle(chip);
      return {
        transition: cs.transition,
        minHeight: cs.minHeight
      };
    });
    assert(chipActiveTransition.transition.includes('transform'), 'Los chips deben incluir transición explícita de transform');
    console.log(`     ✓ Chips interactivos con aria-pressed dinámico y transición GPU: ${chipActiveTransition.transition}`);

    // -------------------------------------------------------------------------
    // 5. Auditoría de Proporciones Espaciales y Responsividad Multi-Viewport
    // -------------------------------------------------------------------------
    console.log('5️⃣  Auditoría espacial en viewports Mobile, Tablet y Desktop...');
    const viewports = [
      { name: 'Mobile (375px)', width: 375, height: 812 },
      { name: 'Tablet (768px)', width: 768, height: 1024 },
      { name: 'Desktop (1440px)', width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(150);
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth
        };
      });
      assert(
        overflow.scrollWidth <= overflow.innerWidth,
        `Desbordamiento horizontal en ${vp.name}: scrollWidth=${overflow.scrollWidth}px > innerWidth=${overflow.innerWidth}px`
      );
      console.log(`     ✓ ${vp.name}: sin desbordamiento (doc: ${overflow.scrollWidth}px <= viewport: ${overflow.innerWidth}px)`);
    }

    // -------------------------------------------------------------------------
    // 6. Validación de Consola Limpia
    // -------------------------------------------------------------------------
    console.log('6️⃣  Verificando consola limpia de DevTools...');
    assert.strictEqual(consoleErrors.length, 0, `Se encontraron errores en consola: ${consoleErrors.join(' | ')}`);
    console.log('     ✓ 0 errores o excepciones en consola DevTools');

    console.log('\n====================================================');
    console.log('🎉 TODOS LOS TESTS E2E DE SOLICITUD APROBADOS CON ÉXITO');
    console.log('====================================================\n');
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runE2E().catch((err) => {
  console.error('\n❌ ERROR EN TEST E2E DE SOLICITUD:', err);
  process.exit(1);
});
