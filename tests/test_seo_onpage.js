/**
 * SUITE DE PRUEBAS UNITARIAS: SEO ON-PAGE & JERARQUÍA SEMÁNTICA (WCAG 2.1 AA)
 * Proyecto: Chapa Tu Técnico
 * Valida: Title, Meta Description, H1 único, H2/H3 y Enlaces de Interlinking.
 */

const fs = require('fs');
const path = require('path');

let total = 0;
let passed = 0;
let failed = 0;

function assert(condition, testName, detail = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failed++;
    console.error(`  ✗ [FAIL] ${testName}`);
    if (detail) console.error(`    Detalle: ${detail}`);
  }
}

function loadHtml(fileName) {
  const filePath = path.join(__dirname, '..', fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function getTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function getMetaDescription(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
                html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
  return match ? match[1].trim() : '';
}

function getH1s(html) {
  const matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  return matches.map(m => m[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function hasHeadingWithText(html, tag, expectedText) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const matches = [...html.matchAll(regex)];
  return matches.some(m => {
    const text = m[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return text.toLowerCase().includes(expectedText.toLowerCase());
  });
}

function hasLink(html, targetHref) {
  const regex = new RegExp(`<a[^>]+href=["']${targetHref}["']`, 'i');
  return regex.test(html);
}

console.log('====================================================');
console.log('🧪 VERIFICACIÓN SEO ON-PAGE & JERARQUÍA SEMÁNTICA');
console.log('====================================================\n');

try {
  // --------------------------------------------------------------------------
  // 1. index.html
  // --------------------------------------------------------------------------
  console.log('📄 Comprobando index.html...');
  const indexHtml = loadHtml('index.html');
  const indexTitle = getTitle(indexHtml);
  const indexDesc = getMetaDescription(indexHtml);
  const indexH1s = getH1s(indexHtml);

  assert(
    indexTitle === 'Contratar Técnico de Confianza en Lima | Técnicos a Domicilio',
    'index.html: Title tag exacto',
    `Esperado: "Contratar Técnico de Confianza en Lima | Técnicos a Domicilio", Obtenido: "${indexTitle}"`
  );

  assert(
    indexDesc === 'Encuentra la mejor asistencia técnica para el hogar. Te ayudamos a contratar un técnico de confianza y técnicos a domicilio para cualquier necesidad.',
    'index.html: Meta description exacta',
    `Esperado: "Encuentra la mejor asistencia...", Obtenido: "${indexDesc}"`
  );

  assert(
    indexH1s.length === 1 && indexH1s[0].includes('Servicio Técnico de confianza para tu hogar'),
    'index.html: Encabezado <h1> único con texto exacto',
    `H1s encontrados (${indexH1s.length}): ${JSON.stringify(indexH1s)}`
  );

  assert(
    hasHeadingWithText(indexHtml, 'h2', 'Técnicos a Domicilio en Lima'),
    'index.html: Subencabezado <h2> "Técnicos a Domicilio en Lima"'
  );

  assert(
    hasHeadingWithText(indexHtml, 'h3', 'Asistencia Técnica para el Hogar'),
    'index.html: Subencabezado <h3> "Asistencia Técnica para el Hogar"'
  );

  assert(
    hasLink(indexHtml, 'servicios.html') && hasLink(indexHtml, 'solicitud.html'),
    'index.html: Interlinking hacia servicios.html y solicitud.html'
  );

  // --------------------------------------------------------------------------
  // 2. servicios.html
  // --------------------------------------------------------------------------
  console.log('\n📄 Comprobando servicios.html...');
  const serviciosHtml = loadHtml('servicios.html');
  const serviciosTitle = getTitle(serviciosHtml);
  const serviciosDesc = getMetaDescription(serviciosHtml);
  const serviciosH1s = getH1s(serviciosHtml);

  assert(
    serviciosTitle === 'Servicio Técnico en Lima | Técnicos Verificados Precios',
    'servicios.html: Title tag exacto',
    `Esperado: "Servicio Técnico en Lima | Técnicos Verificados Precios", Obtenido: "${serviciosTitle}"`
  );

  assert(
    serviciosDesc === 'Conoce nuestro catálogo de servicio técnico en Lima. Trabajamos con profesionales garantizados, ofreciendo técnicos verificados y precios transparentes.',
    'servicios.html: Meta description exacta',
    `Esperado: "Conoce nuestro catálogo...", Obtenido: "${serviciosDesc}"`
  );

  assert(
    serviciosH1s.length === 1 && serviciosH1s[0].includes('Servicio Técnico en Lima de Calidad'),
    'servicios.html: Encabezado <h1> único con texto exacto',
    `H1s encontrados (${serviciosH1s.length}): ${JSON.stringify(serviciosH1s)}`
  );

  assert(
    hasHeadingWithText(serviciosHtml, 'h2', 'Especialidades Disponibles'),
    'servicios.html: Subencabezado <h2> "Especialidades Disponibles"'
  );

  assert(
    hasHeadingWithText(serviciosHtml, 'h3', 'Técnicos Verificados Precios'),
    'servicios.html: Subencabezado <h3> "Técnicos Verificados Precios"'
  );

  assert(
    hasLink(serviciosHtml, 'electricidad.html') && hasLink(serviciosHtml, 'perfil.html'),
    'servicios.html: Interlinking hacia electricidad.html y perfil.html'
  );

  // --------------------------------------------------------------------------
  // 3. electricidad.html
  // --------------------------------------------------------------------------
  console.log('\n📄 Comprobando electricidad.html...');
  const elecHtml = loadHtml('electricidad.html');
  const elecTitle = getTitle(elecHtml);
  const elecDesc = getMetaDescription(elecHtml);
  const elecH1s = getH1s(elecHtml);

  assert(
    elecTitle === 'Electricista en Lima a Domicilio | Precio de Instalaciones de Luz',
    'electricidad.html: Title tag exacto',
    `Esperado: "Electricista en Lima a Domicilio | Precio de Instalaciones de Luz", Obtenido: "${elecTitle}"`
  );

  assert(
    elecDesc === '¿Necesitas un electricista en Lima? Realizamos reparación de fallas eléctricas y te brindamos el mejor precio de instalaciones de luz. ¡Atención a domicilio!',
    'electricidad.html: Meta description exacta',
    `Esperado: "¿Necesitas un electricista...", Obtenido: "${elecDesc}"`
  );

  assert(
    elecH1s.length === 1 && elecH1s[0].includes('Electricista a Domicilio: Instalaciones y Reparaciones'),
    'electricidad.html: Encabezado <h1> único con texto exacto',
    `H1s encontrados (${elecH1s.length}): ${JSON.stringify(elecH1s)}`
  );

  assert(
    hasHeadingWithText(elecHtml, 'h2', 'Precio de Instalaciones de Luz'),
    'electricidad.html: Subencabezado <h2> "Precio de Instalaciones de Luz"'
  );

  assert(
    hasHeadingWithText(elecHtml, 'h3', 'Reparación de Fallas Eléctricas'),
    'electricidad.html: Subencabezado <h3> "Reparación de Fallas Eléctricas"'
  );

  assert(
    hasLink(elecHtml, 'solicitud.html'),
    'electricidad.html: Interlinking CTA hacia solicitud.html'
  );

  // --------------------------------------------------------------------------
  // 4. solicitud.html
  // --------------------------------------------------------------------------
  console.log('\n📄 Comprobando solicitud.html...');
  const solHtml = loadHtml('solicitud.html');
  const solTitle = getTitle(solHtml);
  const solDesc = getMetaDescription(solHtml);
  const solH1s = getH1s(solHtml);

  assert(
    solTitle === 'Cotizar Servicio Técnico Hogar | Electricista 24 Horas Lima',
    'solicitud.html: Title tag exacto',
    `Esperado: "Cotizar Servicio Técnico Hogar | Electricista 24 Horas Lima", Obtenido: "${solTitle}"`
  );

  assert(
    solDesc === 'Ingresa y aprende cómo cotizar servicio técnico hogar fácilmente. Contamos con disponibilidad de electricista 24 horas en Lima para urgencias.',
    'solicitud.html: Meta description exacta',
    `Esperado: "Ingresa y aprende cómo...", Obtenido: "${solDesc}"`
  );

  assert(
    solH1s.length === 1 && solH1s[0].includes('Cotizar Servicio Técnico de Hogar'),
    'solicitud.html: Encabezado <h1> único con texto exacto',
    `H1s encontrados (${solH1s.length}): ${JSON.stringify(solH1s)}`
  );

  assert(
    hasHeadingWithText(solHtml, 'h2', 'Formulario de Atención Rápida'),
    'solicitud.html: Subencabezado <h2> "Formulario de Atención Rápida"'
  );

  assert(
    hasHeadingWithText(solHtml, 'h3', '¿Buscas un Electricista 24 Horas en Lima?'),
    'solicitud.html: Subencabezado <h3> "¿Buscas un Electricista 24 Horas en Lima?"'
  );

  assert(
    hasLink(solHtml, 'index.html') && hasLink(solHtml, 'servicios.html'),
    'solicitud.html: Interlinking de retorno seguro hacia index.html y servicios.html'
  );

} catch (err) {
  console.error('Error durante la ejecución de las pruebas:', err);
  process.exit(1);
}

console.log('\n----------------------------------------------------');
console.log(`Resultados: ${passed}/${total} pruebas pasadas con éxito.`);
console.log('----------------------------------------------------');

if (failed > 0) {
  process.exit(1);
}

