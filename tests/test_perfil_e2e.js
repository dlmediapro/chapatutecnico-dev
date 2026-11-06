/**
 * Suite E2E Automatizada: Panel Técnico (perfil.html)
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
  console.log('🧪 PRUEBAS E2E AUTOMATIZADAS (PLAYWRIGHT): PANEL TÉCNICO');
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
    // 1. Simulación de Sesión del Técnico Logueado
    // -------------------------------------------------------------------------
    console.log('1️⃣  Simulando sesión del técnico que hizo login ("Rodrigo Rojas")...');
    await page.goto(`${BASE_URL}/perfil.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('ctt_tech_profile', JSON.stringify({
        firstname: 'Rodrigo',
        lastname: 'Rojas',
        nombre: 'Rodrigo Rojas',
        role: 'tecnico',
        rating: '9.5',
        stats: { newRequests: 5, inProgress: 3, completed: 15 }
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });

    // -------------------------------------------------------------------------
    // 2. Verificación de Inyección Dinámica del Técnico Logueado & KPIs
    // -------------------------------------------------------------------------
    console.log('2️⃣  Validando nombre dinámico del técnico y métricas KPI...');
    const renderedName = await page.textContent('#tech-user-name');
    assert.strictEqual(renderedName.trim(), 'Rodrigo Rojas', `El nombre debe ser 'Rodrigo Rojas' (obtenido: '${renderedName}')`);

    const statNew = await page.textContent('#stat-new-requests');
    const statProg = await page.textContent('#stat-in-progress');
    const statComp = await page.textContent('#stat-completed');
    const statRate = await page.textContent('#stat-rating');
    assert.strictEqual(statNew.trim(), '5', 'El contador de solicitudes nuevas debe iniciar en 5');
    assert.strictEqual(statProg.trim(), '3', 'El contador de trabajos en proceso debe iniciar en 3');
    assert.strictEqual(statComp.trim(), '15', 'Los servicios completados deben ser 15');
    assert.strictEqual(statRate.trim(), '9.5', 'La calificación debe ser 9.5');
    console.log(`     ✓ Técnico autenticado inyectado con éxito: "${renderedName.trim()}" (KPIs: 5 nuevas, 3 en proceso, 15 completadas, 9.5 rating)`);

    // -------------------------------------------------------------------------
    // 3. Verificación de Estados Asíncronos & Tarjetas de Trabajo
    // -------------------------------------------------------------------------
    console.log('3️⃣  Verificando renderizado de solicitudes y filtros...');
    await page.waitForSelector('.job-card:not(.is-skeleton)');
    const initialCardsCount = await page.locator('#work-cards-list .job-card').count();
    assert.strictEqual(initialCardsCount, 3, `Debe renderizar 3 solicitudes iniciales (obtenidas: ${initialCardsCount})`);

    // Filtro por categoría: Plomería
    await page.selectOption('#select-category-filter', 'Plomeria');
    const plomeriaCount = await page.locator('#work-cards-list .job-card').count();
    assert.strictEqual(plomeriaCount, 1, 'Filtrar por Plomería debe mostrar 1 tarjeta');

    // Restaurar filtro
    await page.selectOption('#select-category-filter', 'all');
    const restoredCount = await page.locator('#work-cards-list .job-card').count();
    assert.strictEqual(restoredCount, 3, 'Restaurar filtro debe mostrar 3 tarjetas');
    console.log(`     ✓ Tarjetas de trabajo y filtro de categorías validados`);

    // -------------------------------------------------------------------------
    // 4. Micro-interacción: Aceptar Trabajo y Feedback Háptico
    // -------------------------------------------------------------------------
    console.log('4️⃣  Verificando micro-interacción de "Aceptar trabajo"...');
    const firstAcceptBtn = page.locator('.btn-job-accept').first();
    await firstAcceptBtn.click();

    const acceptBtnText = await firstAcceptBtn.textContent();
    assert(acceptBtnText.includes('Aceptado'), 'El botón debe conmutar a estado Aceptado');

    const updatedProg = await page.textContent('#stat-in-progress');
    assert.strictEqual(updatedProg.trim(), '4', 'Los trabajos en proceso deben incrementar a 4');

    const toastVisible = await page.isVisible('#toast-notification.show');
    assert(toastVisible, 'El toast de notificación debe mostrarse');
    console.log(`     ✓ Botón Aceptar conmuta reactivamente e incrementa KPI en proceso (3 -> 4) con toast activo`);

    // -------------------------------------------------------------------------
    // 5. Interactividad del Calendario de Disponibilidad
    // -------------------------------------------------------------------------
    console.log('5️⃣  Verificando selector de disponibilidad en calendario...');
    const day20 = page.locator('.cal-day-card[data-day="20"]');
    await day20.click();
    const isDay20Active = await day20.evaluate(el => el.classList.contains('active'));
    assert(isDay20Active, 'El día 20 debe marcarse como activo en el calendario');
    console.log(`     ✓ Selección de disponibilidad en calendario interactiva`);

    // -------------------------------------------------------------------------
    // 6. Auditoría Espacial Multi-Viewport (CLS = 0)
    // -------------------------------------------------------------------------
    console.log('6️⃣  Auditoría espacial en viewports Mobile, Tablet y Desktop...');
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
    // 7. Consola DevTools Limpia
    // -------------------------------------------------------------------------
    console.log('7️⃣  Verificando consola limpia de DevTools...');
    assert.strictEqual(consoleErrors.length, 0, `Se encontraron errores en consola: ${consoleErrors.join(' | ')}`);
    console.log('     ✓ 0 errores o excepciones en consola DevTools');

    console.log('\n====================================================');
    console.log('🎉 TODOS LOS TESTS E2E DEL PANEL TÉCNICO APROBADOS CON ÉXITO');
    console.log('====================================================\n');
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runE2E().catch((err) => {
  console.error('\n❌ ERROR EN TEST E2E DEL PANEL TÉCNICO:', err);
  process.exit(1);
});
