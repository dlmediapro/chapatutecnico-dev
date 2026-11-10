/**
 * Suite E2E Automatizada: Centro de Mensajes y Chat (mensajes.html)
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
  console.log('🧪 PRUEBAS E2E AUTOMATIZADAS (PLAYWRIGHT): CHAT Y MENSAJES');
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
    console.log('1️⃣  Navegando a la vista mensajes.html...');
    await page.goto(`${BASE_URL}/mensajes.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#conversation-list-container .chat-item');

    console.log('2️⃣  Validando renderizado inicial del chat y contactos...');
    const chatItemsCount = await page.locator('.chat-item').count();
    assert(chatItemsCount >= 4, `Se esperaban al menos 4 chats, se obtuvieron ${chatItemsCount}`);

    const activeName = (await page.textContent('#chat-active-name')).trim();
    assert(activeName.includes('Carlos Rojas'), `Esperado: Carlos Rojas, Obtenido: ${activeName}`);
    console.log(`     ✓ Chat activo: "${activeName}" con 4 conversaciones en sidebar`);

    console.log('3️⃣  Validando tarjeta de propuesta de servicio ("ACEPTAR SERVICIO")...');
    const hasAcceptBtn = await page.isVisible('#btn-service-accept');
    assert(hasAcceptBtn, 'El botón ACEPTAR SERVICIO debe ser visible en el chat con propuesta');
    console.log('     ✓ Tarjeta de propuesta con botones de acción visibles');

    console.log('4️⃣  Probando cambio de conversación entre contactos...');
    await page.click('.chat-item[data-chat-id="chat-2"]');
    await page.waitForTimeout(200);
    const updatedName = (await page.textContent('#chat-active-name')).trim();
    assert(updatedName.includes('Rodrigo Rojas'), `Esperado: Rodrigo Rojas, Obtenido: ${updatedName}`);
    console.log(`     ✓ Conversación conmutada con éxito a: "${updatedName}"`);

    // Volver a Carlos Rojas para probar interacción de servicio y envío de mensaje
    await page.click('.chat-item[data-chat-id="chat-1"]');
    await page.waitForTimeout(200);

    console.log('5️⃣  Probando envío reactivo de mensaje...');
    const streamLocator = page.locator('#chat-stream');
    const initialBubbleCount = await streamLocator.locator('.mensaje-bubble').count();

    await page.fill('#mensaje-input', 'Hola Carlos, confirmo que estaré atento a las 12:00 pm.');
    await page.click('#btn-chat-send');
    await page.waitForTimeout(200);

    const newBubbleCount = await streamLocator.locator('.mensaje-bubble').count();
    assert(newBubbleCount === initialBubbleCount + 1, 'Debe agregarse una nueva burbuja al stream');

    const lastBubbleText = await streamLocator.locator('.mensaje-bubble').last().textContent();
    assert(lastBubbleText.includes('confirmo que estaré atento'), 'El mensaje enviado debe renderizarse');
    console.log('     ✓ Mensaje enviado e insertado en el DOM con scroll reactivo');

    console.log('6️⃣  Probando acción "ACEPTAR SERVICIO" y retroalimentación...');
    await page.click('#btn-service-accept');
    await page.waitForTimeout(200);

    const isAcceptedBadgeVisible = await page.isVisible('.proposal-status-accepted');
    assert(isAcceptedBadgeVisible, 'La propuesta debe mostrar la insignia de servicio aceptado');

    const toastVisible = await page.isVisible('#chat-toast');
    assert(toastVisible, 'El toast accesible de confirmación debe mostrarse');
    console.log('     ✓ Propuesta aceptada, badge actualizado y toast accesible emitido');

    console.log('7️⃣  Auditoría espacial en viewports Mobile, Tablet y Desktop...');
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(150);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(scrollWidth <= vp.width + 1, `Desbordamiento horizontal en ${vp.name}: ${scrollWidth}px > ${vp.width}px`);
      console.log(`     ✓ ${vp.name} (${vp.width}px): sin desbordamiento (doc: ${scrollWidth}px <= viewport: ${vp.width}px)`);
    }

    console.log('8️⃣  Verificando consola limpia de DevTools...');
    if (consoleErrors.length > 0) {
      throw new Error(`Se detectaron errores en consola DevTools:\n${consoleErrors.join('\n')}`);
    }
    console.log('     ✓ 0 errores o excepciones en consola DevTools');

    console.log('\n====================================================');
    console.log('🎉 TODOS LOS TESTS E2E DE MENSAJES Y CHAT APROBADOS CON ÉXITO');
    console.log('====================================================\n');
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runE2E().catch((err) => {
  console.error('\n❌ ERROR EN PRUEBAS E2E DE MENSAJES:', err);
  process.exit(1);
});
