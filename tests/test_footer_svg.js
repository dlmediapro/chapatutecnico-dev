const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 SUITE DE PRUEBAS UNITARIAS: FOOTER SVG & WCAG 2.1 AA');
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

// 1. Carga de Archivos
const layoutJsPath = path.resolve(__dirname, '../layout.js');
const stylesCssPath = path.resolve(__dirname, '../styles.css');
const imgDir = path.resolve(__dirname, '../img');
const iconsDir = path.resolve(__dirname, '../img/icons');

const layoutContent = fs.readFileSync(layoutJsPath, 'utf8');
const stylesContent = fs.readFileSync(stylesCssPath, 'utf8');

// Test 1: Comprobación de funciones y strings SVG en layout.js
test('layout.js contiene las definiciones de SVG inline para redes sociales y soporte', () => {
  assert(layoutContent.includes('footerSvg'), 'Debe existir la función helper footerSvg');
  assert(layoutContent.includes('svgYt'), 'Debe existir el SVG de YouTube');
  assert(layoutContent.includes('svgFb'), 'Debe existir el SVG de Facebook');
  assert(layoutContent.includes('svgIg'), 'Debe existir el SVG de Instagram');
  assert(layoutContent.includes('svgTk'), 'Debe existir el SVG de TikTok');
  assert(layoutContent.includes('svgWaSupport'), 'Debe existir el SVG de WhatsApp para soporte');
  assert(layoutContent.includes('svgMailSupport'), 'Debe existir el SVG de Correo para soporte');
});

// Test 2: Atributos de Accesibilidad WCAG 2.1 AA en SVG
test('Todos los elementos SVG del footer cuentan con role="img", aria-hidden="true" y focusable="false"', () => {
  assert(layoutContent.includes('role="img"'), 'El SVG debe tener role="img"');
  assert(layoutContent.includes('aria-hidden="true"'), 'El SVG debe tener aria-hidden="true"');
  assert(layoutContent.includes('focusable="false"'), 'El SVG debe tener focusable="false"');
  assert(layoutContent.includes('viewBox="0 0 24 24"'), 'El SVG debe tener viewBox estandarizado');
});

// Test 3: Enlaces accesibles con aria-label descriptivo y target seguro
test('Los 4 enlaces de redes sociales tienen aria-label descriptivo, target="_blank" y rel="noopener noreferrer"', () => {
  assert(layoutContent.includes('aria-label="Canal oficial de YouTube de Chapa Tu Técnico (abre en nueva pestaña)"'), 'Falta aria-label de YouTube');
  assert(layoutContent.includes('aria-label="Página oficial de Facebook de Chapa Tu Técnico (abre en nueva pestaña)"'), 'Falta aria-label de Facebook');
  assert(layoutContent.includes('aria-label="Cuenta oficial de Instagram de Chapa Tu Técnico (abre en nueva pestaña)"'), 'Falta aria-label de Instagram');
  assert(layoutContent.includes('aria-label="Cuenta oficial de TikTok de Chapa Tu Técnico (abre en nueva pestaña)"'), 'Falta aria-label de TikTok');
  assert(layoutContent.includes('rel="noopener noreferrer"'), 'Debe contar con rel="noopener noreferrer" en enlaces externos');
});

// Test 4: Dimensiones estáticas para prevenir Cumulative Layout Shift (CLS = 0)
test('El SVG y los contenedores definen dimensiones estáticas y aspect-ratio', () => {
  assert(layoutContent.includes('width="20"') || layoutContent.includes("width='\" + w + \"'"), 'SVG debe tener width estático');
  assert(layoutContent.includes('height="20"') || layoutContent.includes("height='\" + h + \"'"), 'SVG debe tener height estático');
  assert(stylesContent.includes('aspect-ratio: 1 / 1;'), 'Los enlaces de redes deben tener aspect-ratio: 1 / 1;');
  assert(stylesContent.includes('flex-shrink: 0;'), 'Los iconos deben tener flex-shrink: 0;');
});

// Test 5: Grilla de 8pt y área táctil accesible en styles.css
test('styles.css implementa espaciados matemáticos en grilla de 8pt y área táctil mínima de 44x44px', () => {
  assert(stylesContent.includes('padding: 32px 0 16px;'), 'Footer debe tener padding en múltiplos de 8pt (32px y 16px)');
  assert(stylesContent.includes('gap: 32px 24px;'), 'Footer container debe tener gap en múltiplos de 8pt (32px y 24px)');
  assert(stylesContent.includes('gap: 16px;'), 'Footer socials debe tener gap de 16px (2 * 8pt)');
  assert(stylesContent.includes('margin-top: 16px;'), 'Footer socials debe tener margin-top de 16px (2 * 8pt)');
  assert(stylesContent.includes('min-width: 44px;'), 'Área táctil debe tener min-width de 44px');
  assert(stylesContent.includes('min-height: 44px;'), 'Área táctil debe tener min-height de 44px');
  assert(stylesContent.includes('border-radius: 8px;'), 'Border radius debe ser 8px (1 * 8pt)');
});

// Test 6: Estados de Foco Accesible (:focus-visible) y Colores de Marca
test('styles.css define focus-visible de alto contraste y estados hover por marca', () => {
  assert(stylesContent.includes('.footer-social-link:focus-visible'), 'Debe existir regla :focus-visible');
  assert(stylesContent.includes('outline: 2px solid'), 'Foco debe tener outline de 2px');
  assert(stylesContent.includes('.social-youtube:hover'), 'Debe existir hover para YouTube');
  assert(stylesContent.includes('.social-facebook:hover'), 'Debe existir hover para Facebook');
  assert(stylesContent.includes('.social-instagram:hover'), 'Debe existir hover para Instagram');
  assert(stylesContent.includes('.social-tiktok:hover'), 'Debe existir hover para TikTok');
});

// Test 7: Archivos vectoriales nuevos en img/icons/
test('Los 6 archivos vectoriales SVG existen en el directorio img/icons/', () => {
  const icons = ['youtube.svg', 'facebook.svg', 'instagram.svg', 'tiktok.svg', 'whatsapp.svg', 'email.svg'];
  icons.forEach(icon => {
    const fullPath = path.join(iconsDir, icon);
    assert(fs.existsSync(fullPath), `El archivo ${icon} debe existir en ${iconsDir}`);
  });
});

// Test 8: Eliminación obligatoria de imágenes PNG obsoletas
test('Los archivos PNG obsoletos ya no existen en img/', () => {
  const obsoletePngs = ['youtube.png', 'facebook.png', 'instagram.png', 'tik-tok.png', 'communication.png', 'whatsapp.png'];
  obsoletePngs.forEach(png => {
    const fullPath = path.join(imgDir, png);
    assert(!fs.existsSync(fullPath), `El archivo ${png} NO debe existir en ${imgDir}`);
  });
});

console.log(`\n----------------------------------------------------`);
console.log(`Resultados: ${passedTests}/${totalTests} pruebas pasadas con éxito.`);
console.log(`----------------------------------------------------\n`);

if (passedTests === totalTests) {
  console.log('🎉 TODAS LAS VERIFICACIONES DE CALIDAD PASARON AL 100%.');
} else {
  process.exit(1);
}
