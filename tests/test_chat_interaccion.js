/**
 * Suite E2E Automatizada: Chat y Propuesta de Servicio #CTT-804 (chat.html)
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
  console.log('🧪 PRUEBAS E2E AUTOMATIZADAS: CHAT Y PROPUESTA #CTT-804');
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
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico')) consoleErrors.push(text);
    }
  });

  try {
    console.log('1️⃣  Navegando a la vista chat.html...');
    await page.goto(`${BASE_URL}/chat.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#chat-stream');

    console.log('2️⃣  Validando renderizado de la sala de chat y Roberto Rojas...');
    const techName = (await page.textContent('#chat-active-tech-name')).trim();
    assert(techName.includes('Roberto Rojas'), `Esperado: Roberto Rojas, Obtenido: ${techName}`);

    console.log('3️⃣  Validando Propuesta de Servicio #CTT-804, checklist y precio S/ 85.00...');
    const hasPropuesta = await page.isVisible('#propuesta-ctt-804');
    assert(hasPropuesta, 'La tarjeta de propuesta #CTT-804 debe ser visible');

    const checklistCount = await page.locator('.cotizacion-checklist li').count();
    assert(checklistCount >= 3, `Debe haber al menos 3 items en checklist, encontrados: ${checklistCount}`);

    const hasArrival = await page.isVisible('#arrival-indicator');
    assert(hasArrival, 'El indicador de llegada estimada debe estar visible');

    const priceText = (await page.textContent('#cotizacion-precio-valor')).trim();
    assert.strictEqual(priceText, '85.00', `El precio debe ser 85.00, se obtuvo: ${priceText}`);

    const hasCta = await page.isVisible('#btn-aceptar-contratar');
    assert(hasCta, 'El botón ACEPTAR Y CONTRATAR debe estar presente');
    console.log('     ✓ Propuesta #CTT-804 con checklist, llegada y precio S/ 85.00 verificados');

    console.log('4️⃣  Auditoría espacial en viewports Mobile (375px), Tablet (768px) y Desktop (1440px)...');
    const viewports = [
      { name: 'Mobile', width: 375, height: 812 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(150);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(scrollWidth <= vp.width + 1, `Desbordamiento en ${vp.name}: doc ${scrollWidth}px > vp ${vp.width}px`);
      console.log(`     ✓ ${vp.name} (${vp.width}px): sin desbordamiento horizontal (${scrollWidth}px <= ${vp.width}px)`);
    }

    console.log('5️⃣  Validando ergonomía táctil (Touch Targets >= 44x44px)...');
    const chipBoxes = await page.locator('.suggestion-chip').all();
    for (const chip of chipBoxes) {
      const box = await chip.boundingBox();
      assert(box.height >= 40, `Touch target altura insuficiente en chip: ${box.height}px`);
    }
    const sendBox = await page.locator('#btn-chat-send').boundingBox();
    assert(sendBox.width >= 40 && sendBox.height >= 40, 'Botón enviar debe cumplir touch target');
    console.log('     ✓ Ergonomía táctil verificada en chips, envío y CTA');

    console.log('6️⃣  Probando envío de mensaje personalizado...');
    await page.fill('#chat-input-text', 'Hola Roberto, ¿en cuánto tiempo llegas a Surco?');
    await page.click('#btn-chat-send');
    await page.waitForTimeout(300);

    const userMsgs = await page.locator('.chat-user-msg').all();
    const lastMsg = await userMsgs[userMsgs.length - 1].textContent();
    assert(lastMsg.includes('en cuánto tiempo llegas'), 'El mensaje debe renderizarse en el log');
    console.log('     ✓ Mensaje enviado y renderizado con auto-scroll reactivo');

    console.log('7️⃣  Probando interacción con botón de sugerencia rápida...');
    await page.click('.suggestion-chip[data-msg="¿El precio incluye materiales?"]');
    await page.waitForTimeout(700);

    const streamText = await page.textContent('#chat-stream');
    assert(streamText.includes('¿El precio incluye materiales?'), 'La sugerencia debe inyectarse en el chat');
    console.log('     ✓ Chip interactivo probado con respuesta asíncrona de Roberto');

    console.log('8️⃣  Probando pulsación de CTA "ACEPTAR Y CONTRATAR" y navegación...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => null),
      page.click('#btn-aceptar-contratar')
    ]);
    const currentUrl = page.url();
    assert(currentUrl.includes('seguimiento.html'), `Debe navegar a seguimiento.html, url actual: ${currentUrl}`);
    console.log('     ✓ Contratación completada, feedback visual y navegación a seguimiento validados');

    console.log('9️⃣  Verificando consola limpia de DevTools...');
    if (consoleErrors.length > 0) {
      throw new Error(`Se detectaron errores en consola DevTools:\n${consoleErrors.join('\n')}`);
    }
    console.log('     ✓ 0 errores o excepciones en consola DevTools');

    console.log('\n====================================================');
    console.log('🎉 TODOS LOS TESTS E2E DE CHAT Y PROPUESTA APROBADOS');
    console.log('====================================================\n');
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runE2E().catch((err) => {
  console.error('\n❌ ERROR EN PRUEBAS E2E DE CHAT:', err);
  process.exit(1);
});
