const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(rootDir, 'seguimiento.html'), 'utf8');
const css = fs.readFileSync(path.join(rootDir, 'views.css'), 'utf8');

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
console.log('🧪 VERIFICACIÓN SEGUIMIENTO: BOTÓN DE PAGO Y UX');
console.log('====================================================\n');

// 1. Integración del botón principal de pago
assertTest(
  'seguimiento.html contiene el botón principal de pago con id btn-confirmar-pago',
  html.includes('id="btn-confirmar-pago"') && html.includes('class="btn-confirmar-pago"'),
  'No se encontró el botón con id btn-confirmar-pago'
);

assertTest(
  'seguimiento.html contiene el contenedor de feedback accesible aria-live',
  html.includes('id="payment-feedback-msg"') && html.includes('aria-live="polite"'),
  'Falta payment-feedback-msg o aria-live="polite"'
);

// 2. Jerarquía visual: Chat y Llamar en estilo secundario
assertTest(
  'Los botones de Chat y Llamar están en .tracking-secondary-actions como .btn-secondary-action',
  html.includes('class="tracking-secondary-actions"') &&
  html.includes('class="btn-secondary-action btn-secondary-chat"') &&
  html.includes('class="btn-secondary-action btn-secondary-call"'),
  'Los botones de Chat y Llamar no tienen clase btn-secondary-action o tracking-secondary-actions'
);

assertTest(
  'Los 4 métodos de pago cuentan con data-method correspondiente',
  html.includes('data-method="yape"') &&
  html.includes('data-method="plin"') &&
  html.includes('data-method="culqi"') &&
  html.includes('data-method="contraentrega"'),
  'Faltan atributos data-method en botones de pago'
);

// 3. Lógica JS reactiva y prevención de errores (Heurística #5)
assertTest(
  'seguimiento.html define updatePayButtonState() para validar y activar el botón',
  html.includes('function updatePayButtonState()') && html.includes('payBtn.disabled = false'),
  'No se encontró updatePayButtonState en seguimiento.html'
);

assertTest(
  'seguimiento.html define initPaymentAction() con simulación de 2s y estados asíncronos',
  html.includes('function initPaymentAction()') && html.includes('is-processing') && html.includes('2000'),
  'Falta initPaymentAction o temporizador de 2 segundos en seguimiento.html'
);

// 4. CSS: Fitts, Hick y estados del botón
assertTest(
  'views.css define .btn-confirmar-pago con altura mínima de 52px y degradado esmeralda',
  css.includes('.btn-confirmar-pago') && css.includes('min-height: 52px') && css.includes('#10b981'),
  'views.css no define .btn-confirmar-pago adecuadamente'
);

assertTest(
  'views.css define estados disabled, is-processing y is-success para el botón de pago',
  css.includes('.btn-confirmar-pago:disabled') &&
  css.includes('.btn-confirmar-pago.is-processing') &&
  css.includes('.btn-confirmar-pago.is-success'),
  'Faltan estados de interacción en views.css'
);

// 5. Auditoría de Contrastes y Layout Móvil
assertTest(
  'views.css incrementa el contraste de stepper-node labels a #cbd5e1 y #ffffff',
  css.includes('.stepper-node .node-label') && css.includes('color: #cbd5e1;') && css.includes('color: #ffffff;'),
  'Contraste de etiquetas de stepper no actualizado'
);

assertTest(
  'views.css configura orden fluido y mapa responsivo para pantallas móviles',
  css.includes('.seguimiento-panel-info {\n    order: 1;') || css.includes('.seguimiento-panel-info {\r\n    order: 1;'),
  'Falta order: 1 para seguimiento-panel-info en media query'
);

console.log('\n----------------------------------------------------');
console.log(`Resultados: ${passed}/${total} pruebas pasadas con éxito.`);
console.log('----------------------------------------------------');

if (passed !== total) {
  process.exit(1);
}
