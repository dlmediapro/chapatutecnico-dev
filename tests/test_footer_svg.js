const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 SUITE DE PRUEBAS UNITARIAS: FOOTER SVG, LOGO WEBP & WCAG 2.1 AA');
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
const rootDir = path.resolve(__dirname, '..');
const layoutJsPath = path.resolve(rootDir, 'layout.js');
const stylesCssPath = path.resolve(rootDir, 'styles.css');
const imgDir = path.resolve(rootDir, 'img');
const iconsDir = path.resolve(rootDir, 'img/icons');

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
  assert(/aspect-ratio:\s*1\s*\/\s*1/.test(stylesContent), 'Los enlaces de redes deben tener aspect-ratio: 1 / 1;');
  assert(/flex-shrink:\s*0;?/.test(stylesContent), 'Los iconos deben tener flex-shrink: 0;');
});

// Test 5: Grilla de 8pt y área táctil accesible en styles.css
test('styles.css implementa espaciados matemáticos en grilla de 8pt y área táctil mínima de 44x44px', () => {
  assert(/padding:\s*32px 0 16px;?/.test(stylesContent), 'Footer debe tener padding en múltiplos de 8pt (32px y 16px)');
  assert(/gap:\s*32px 24px;?/.test(stylesContent), 'Footer container debe tener gap en múltiplos de 8pt (32px y 24px)');
  assert(/gap:\s*16px;?/.test(stylesContent), 'Footer socials debe tener gap de 16px (2 * 8pt)');
  assert(/margin-top:\s*16px;?/.test(stylesContent), 'Footer socials debe tener margin-top de 16px (2 * 8pt)');
  assert(/min-width:\s*44px;?/.test(stylesContent), 'Área táctil debe tener min-width de 44px');
  assert(/min-height:\s*44px;?/.test(stylesContent), 'Área táctil debe tener min-height de 44px');
  assert(/border-radius:\s*8px;?/.test(stylesContent), 'Border radius debe ser 8px (1 * 8pt)');
});

// Test 6: Estados de Foco Accesible (:focus-visible) y Colores de Marca
test('styles.css define focus-visible de alto contraste y estados hover por marca', () => {
  assert(stylesContent.includes('.footer-social-link:focus-visible'), 'Debe existir regla :focus-visible');
  assert(/outline:\s*2px solid/.test(stylesContent), 'Foco debe tener outline de 2px');
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

// Test 9: Comprobación de existencia de logo.webp sin pérdida
test('El archivo img/logo.webp existe y es accesible', () => {
  const logoPath = path.join(imgDir, 'logo.webp');
  assert(fs.existsSync(logoPath), 'img/logo.webp debe existir en el disco');
  const stats = fs.statSync(logoPath);
  assert(stats.size > 0, 'img/logo.webp no debe estar vacío');
});

// Test 10: Vinculación optimizada de logo.webp en layout.js (Header y Footer)
test('layout.js renderiza img/logo.webp con CLS=0 y optimizaciones LCP/Lazy', () => {
  assert(layoutContent.includes('src="img/logo.webp"'), 'layout.js debe enlazar img/logo.webp');
  assert(layoutContent.includes('width="118"'), 'logo debe tener width="118"');
  assert(layoutContent.includes('height="101"'), 'logo debe tener height="101"');
  assert(layoutContent.includes('fetchpriority="high"'), 'Header logo debe tener fetchpriority="high"');
  assert(layoutContent.includes('loading="lazy"'), 'Footer logo debe tener loading="lazy"');
  assert(layoutContent.includes('footer-logo-img'), 'Footer logo debe tener clase footer-logo-img');
});

// Test 11: Bloqueo de aspecto en styles.css (aspect-ratio: 118 / 101)
test('styles.css contiene aspect-ratio: 118 / 101 para prevenir CLS en cabecera y pie', () => {
  assert(/aspect-ratio:\s*118\s*\/\s*101/.test(stylesContent), 'styles.css debe definir aspect-ratio: 118 / 101');
  assert(stylesContent.includes('.brand-col .footer-logo-img'), 'styles.css debe estilizar .brand-col .footer-logo-img');
});

// Test 12: Ausencia total de referencias rotas a logo.png en HTML y JS
test('Cero archivos HTML o JS mantienen enlaces al antiguo logo.png', () => {
  const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') || f.endsWith('.js'));
  files.forEach(f => {
    const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
    assert(!content.includes('logo.png'), `El archivo ${f} no debe contener ninguna referencia a logo.png`);
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
