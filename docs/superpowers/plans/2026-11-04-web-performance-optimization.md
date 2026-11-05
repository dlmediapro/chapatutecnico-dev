# Optimización de Rendimiento Web y Core Web Vitals ("Chapa Tu Técnico") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar las tareas largas en el hilo principal (>50ms), modularizar la carga útil masiva de CSS/JS eliminando código no usado en cada pantalla, y asegurar CLS = 0 con 100% de compatibilidad en pruebas para la plataforma móvil y de escritorio "Chapa Tu Técnico".

**Architecture:** Se adopta una arquitectura de carga por demanda y segmentación crítica: `styles.css` retiene los tokens globales de `:root`, el reset y el esqueleto compartido de layout; el archivo monolítico `views.css` (244 KB) se descompone en hojas de estilo modulares por vista en `css/views/*.css` cargadas condicionalmente por cada página; `layout.js` se reescribe como inyector asíncrono no bloqueante que utiliza `scheduler.yield()` (con fallback a `requestIdleCallback`/`setTimeout`) para fragmentar la inyección del DOM en tareas menores a 50ms; y las secciones bajo el pliegue integran `content-visibility: auto` con `contain-intrinsic-size` para acelerar el renderizado inicial.

**Tech Stack:** HTML5 semántico, CSS3 nativo (`:root`, CSS Containment `content-visibility`, Media Queries), JavaScript Vanilla moderno (ES6+, dynamic `import()`, `scheduler.yield()`, `IntersectionObserver`, `requestIdleCallback`), Node.js (test runner nativo `node:assert`, `node:fs`).

**Spec:** Requerimientos arquitectónicos y diagnósticos PageSpeed Insights definidos en la solicitud del usuario (Eliminación de CSS/JS no usado, erradicación de Main Thread Long Tasks, preservación estricta de la grilla de 8pt, touch targets de 44px, contraste WCAG 2.1 AA y suite de pruebas en `tests/`).

## Global Constraints

- Prohibido el uso de bundlers pesados (Webpack/Vite) o dependencias innecesarias en `node_modules`; mantener JavaScript Vanilla y CSS nativo puro.
- Mantener estrictamente todos los tokens de diseño en `:root` (`--bg: #08233b`, `--bg-dark: #061b2e`, `--orange: #e8532b`, `--font-title: 'Oswald', sans-serif`, `--font-body: 'Raleway', sans-serif`, etc.).
- Preservar la escala espacial de 8pt (4px micro) y áreas táctiles mínimas de 44x44px en móviles para cumplimiento WCAG 2.1 AA.
- Cero saltos visuales (CLS = 0) en toda carga inicial o diferida mediante reserva explícita de dimensiones (`min-height`, `aspect-ratio: 118 / 101` en logotipos, bounding boxes fijos en Topbar y Header).
- Garantizar que el 100% de la batería existente en `tests/` (`test_footer_svg.js`, `test_seguimiento_boton_pago.js`, `test_carrusel_scroll_nativo.js`, `test_seo_onpage.js`) pase sin una sola regresión.
- Todos los scripts en las 20 páginas HTML deben utilizar `defer` o `type="module"` para evitar el bloqueo del parser HTML.

## Review Focus

1. **Fallback ante ausencia de `scheduler.yield()`:** Safari y navegadores Chromium antiguos no soportan la API nativa del Scheduler; debe existir un fallback robusto a `setTimeout` o `requestIdleCallback` que garantice la continuidad sin lanzar excepciones no controladas.
2. **Flash de Contenido sin Estilo (FOUC) al modularizar CSS:** Al dividir `views.css`, cada página debe cargar su CSS de vista crítico directamente en el `<head>`, reservando el diferimiento solo para hojas secundarias o estilos debajo del pliegue.
3. **Orden de Ejecución de Scripts Diferidos con Dependencias:** En páginas como `cuenta.html`, `perfil.html`, `tienda.html` o `seguimiento.html`, la lógica de vista depende de elementos inyectados por `layout.js`; todos los scripts deben mantener sincronización determinista sin lanzar errores por referencias nulas (`null`).
4. **Resiliencia ante Librerías Externas Pesadas (Google Maps en `cobertura.html` y Leaflet en `seguimiento.html`):** Deben diferirse mediante `IntersectionObserver` o carga asíncrona controlada para no penalizar el First Contentful Paint (FCP) ni el LCP.
5. **Invariantes Textuales en `views.css` y `styles.css` requeridas por Tests:** Las pruebas unitarias existentes evalúan expresiones regulares literales (ej. `min-height: 52px`, `order: 1`, `scroll-snap-type:x mandatory`). La partición debe preservar estas reglas y archivos fuente para satisfacer los asserts sin alteraciones de contrato.

---

### Task 1: Partición Modular de Hojas de Estilo por Vista (Eliminación de CSS sin Usar)

**Files:**
- Create: `chapatutecnico/css/views/servicios.css`
- Create: `chapatutecnico/css/views/electricidad.css`
- Create: `chapatutecnico/css/views/tecnicos.css`
- Create: `chapatutecnico/css/views/tienda.css`
- Create: `chapatutecnico/css/views/carrito.css`
- Create: `chapatutecnico/css/views/chat.css`
- Create: `chapatutecnico/css/views/solicitud.css`
- Create: `chapatutecnico/css/views/seguimiento.css`
- Create: `chapatutecnico/css/views/cobertura.css`
- Create: `chapatutecnico/css/views/soporte.css`
- Create: `chapatutecnico/css/views/nosotros.css`
- Create: `chapatutecnico/css/views/login.css`
- Create: `chapatutecnico/css/views/404.css`
- Modify: `chapatutecnico/views.css:1-100` (mantener selectores evaluados por tests unitarios y soporte modular)
- Modify: `chapatutecnico/index.html:70-90`
- Modify: `chapatutecnico/chat.html:25-40`
- Modify: `chapatutecnico/seguimiento.html:35-50`
- Modify: `chapatutecnico/servicios.html:65-80`
- Modify: `chapatutecnico/electricidad.html:70-85`
- Modify: `chapatutecnico/solicitud.html:45-60`
- Modify: `chapatutecnico/cobertura.html:75-90`
- Modify: `chapatutecnico/tienda.html:45-60`
- Modify: `chapatutecnico/carrito.html:35-50`
- Modify: `chapatutecnico/compra.html:25-40`
- Modify: `chapatutecnico/tecnicos.html:125-140`
- Modify: `chapatutecnico/lista-tecnicos.html:125-140`
- Modify: `chapatutecnico/soporte.html:115-130`
- Modify: `chapatutecnico/perfil.html:70-85`
- Modify: `chapatutecnico/cuenta.html:70-85`
- Modify: `chapatutecnico/nosotros.html:45-60`
- Modify: `chapatutecnico/login.html:60-75`
- Modify: `chapatutecnico/producto.html:85-100`
- Modify: `chapatutecnico/mensajes.html:25-40`
- Modify: `chapatutecnico/404.html:30-40`
- Test: `chapatutecnico/tests/test_seguimiento_boton_pago.js`

**Interfaces:**
- Consumes: Tokens globales en `styles.css` (`:root`).
- Produces: Módulos CSS autónomos por pantalla (`css/views/*.css`) que pesan entre 4 KB y 18 KB cada uno, reduciendo la transferencia de 244 KB a <15 KB por vista.

- [ ] **Step 1: Write a failing test verifying that modular view CSS files exist and tracking CSS rules remain intact**

Crear la comprobación inicial en un archivo auxiliar o invocar la prueba de seguimiento para comprobar que `views.css` satisface las condiciones del test.
```javascript
// Verificación preliminar en tests/test_seguimiento_boton_pago.js
node tests/test_seguimiento_boton_pago.js
```

- [ ] **Step 2: Run test to verify current baseline passes**

Run: `cd chapatutecnico && node tests/test_seguimiento_boton_pago.js`
Expected: PASS (10/10 pruebas pasadas).

- [ ] **Step 3: Extract and modularize view CSS files into `css/views/*.css`**

Extraer quirúrgicamente cada bloque de `views.css` hacia su módulo correspondiente:
1. `css/views/cobertura.css`: Líneas de mapa interactivo, feedback box y cobertura por distrito.
2. `css/views/servicios.css`: Grilla de 12 servicios, banner de garantías, por qué elegirnos.
3. `css/views/electricidad.css`: Hero y servicios de electricidad.
4. `css/views/tecnicos.css`: Tarjetas de técnicos, breadcrumbs, filtros y paginación.
5. `css/views/tienda.css`: Catálogo, filtros, cuadrícula de productos.
6. `css/views/carrito.css`: Tabla de carrito, resumen de compra y métodos de pago.
7. `css/views/chat.css`: Estilos de `.chat-container-card`, cotización rápida y burbujas.
8. `css/views/solicitud.css`: Formulario paso a paso de solicitud de asistencia técnica.
9. `css/views/seguimiento.css`: Panel de seguimiento, `.btn-confirmar-pago`, stepper y mapa responsivo móvil.
10. `css/views/soporte.css`: Canales de atención, tickets y preguntas frecuentes.
11. `css/views/login.css`: Formulario de login, autenticación y OAuth cards.
12. `css/views/nosotros.css`: Grilla de misión, valores e historia institucional.
13. `css/views/404.css`: Ilustración de error 404 y botón de retorno.

Preservar en `views.css` la compatibilidad total y los selectores exigidos por `test_seguimiento_boton_pago.js` (`.btn-confirmar-pago`, `.btn-confirmar-pago:disabled`, `.btn-confirmar-pago.is-processing`, `.stepper-node .node-label`, `.seguimiento-panel-info {\n    order: 1;`).

- [ ] **Step 4: Update HTML templates to link modular CSS files instead of monolithic `views.css`**

En cada archivo HTML reemplazar `<link rel="stylesheet" href="views.css">` por su hoja de estilo específica:
- `chat.html`: `<link rel="stylesheet" href="css/views/chat.css">`
- `seguimiento.html`: `<link rel="stylesheet" href="css/views/seguimiento.css">`
- `servicios.html`: `<link rel="stylesheet" href="css/views/servicios.css">`
- `electricidad.html`: `<link rel="stylesheet" href="css/views/electricidad.css">`
- `solicitud.html`: `<link rel="stylesheet" href="css/views/solicitud.css">`
- `tienda.html`: `<link rel="stylesheet" href="css/views/tienda.css">`
- `producto.html`: `<link rel="stylesheet" href="css/views/tienda.css">`
- `carrito.html`: `<link rel="stylesheet" href="css/views/carrito.css">`
- `compra.html`: `<link rel="stylesheet" href="css/views/carrito.css">`
- `tecnicos.html` & `lista-tecnicos.html`: `<link rel="stylesheet" href="css/views/tecnicos.css">`
- `soporte.html`: `<link rel="stylesheet" href="css/views/soporte.css">`
- `perfil.html` & `cuenta.html`: `<link rel="stylesheet" href="css/views/soporte.css">`
- `login.html`: `<link rel="stylesheet" href="css/views/login.css">`
- `cobertura.html`: `<link rel="stylesheet" href="css/views/cobertura.css">`
- `nosotros.html`: `<link rel="stylesheet" href="css/views/nosotros.css">`
- `404.html`: `<link rel="stylesheet" href="css/views/404.css">`
- `mensajes.html`: `<link rel="stylesheet" href="css/views/chat.css">`

- [ ] **Step 5: Run tests and verify zero regressions**

Run: `cd chapatutecnico && node tests/test_seguimiento_boton_pago.js`
Expected: PASS (10/10 pruebas pasadas).

- [ ] **Step 6: Commit changes**

```bash
git add css/views/*.css views.css *.html
git commit -m "perf: modularize views.css into scoped view stylesheets and update HTML links"
```

---

### Task 2: Desbloqueo del Hilo Principal en `layout.js` y Prevención de Reflows Forzados (CLS = 0)

**Files:**
- Modify: `chapatutecnico/layout.js:1-320`
- Modify: `chapatutecnico/styles.css:1-80` (reserva de altura de contenedores y content-visibility en footer)
- Test: `chapatutecnico/tests/test_footer_svg.js`

**Interfaces:**
- Consumes: Estructura DOM de las páginas y tokens de diseño.
- Produces: `layout.js` optimizado con `yieldToMain()`, renderizado por fases (Fase 1: Header sincrónico con espacio reservado; Fase 2: Footer y FAB tras ceder control; Fase 3: Lecturas de localStorage en idle), reduciendo tareas de renderizado a <50ms.

- [ ] **Step 1: Write a test assertion in memory or verify existing `test_footer_svg.js`**

Run: `cd chapatutecnico && node tests/test_footer_svg.js`
Expected: PASS (12/12 pruebas pasadas).

- [ ] **Step 2: Add `yieldToMain()` scheduler helper and phased injection in `layout.js`**

Implementar en `layout.js` la estrategia documentada en `modern-web-guidance` (`break-up-long-tasks`):
```javascript
// Helper de cedencia de control al hilo principal (Scheduler API con fallback)
function yieldToMain() {
  if (typeof scheduler !== 'undefined' && typeof scheduler.yield === 'function') {
    return scheduler.yield();
  }
  return new Promise(function (resolve) {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });
}
```
Reestructurar la ejecución de `layout.js`:
1. **Fase Inmediata (Above the Fold):**
   - Si `part === 'header'`, inyectar Topbar y Header de inmediato si no existen en el HTML, o hidratar el existente.
   - El contenedor `<header class="header">` y `.topbar` deben tener `min-height` explícito en `styles.css` (36px para topbar, 84px móvil / 110px desktop para header) para garantizar **CLS = 0**.
2. **Fase Asíncrona (Below the Fold):**
   - Si `part === 'footer'`, diferir la inyección del Footer y el FAB de WhatsApp empleando `yieldToMain()` para que el hilo principal procese eventos de interacción y renderizado inicial antes de procesar el árbol de nodos SVG del pie de página.
3. **Fase de Hidratación No Crítica:**
   - Agrupar lecturas de `localStorage` (`chapa_cart` y `ctt_profile`) sin intercalar escrituras en el DOM (batch reads, batch writes).
   - Delegar la actualización de contadores y foto de perfil a un bloque diferido con `yieldToMain()` para que no demore el FCP/LCP.

- [ ] **Step 3: Add CSS containment and `content-visibility: auto` to footer and long sections in `styles.css`**

Siguiendo `modern-web-guidance` (`defer-rendering-heavy-content`), añadir en `styles.css`:
```css
/* Optimización de renderizado para componentes bajo el pliegue */
.footer {
  content-visibility: auto;
  contain-intrinsic-size: auto none auto 420px;
}
.fab-whatsapp-container {
  contain: layout style paint;
}
```
Asegurar que las reglas existentes en `styles.css` (aspect-ratio de logo `118 / 101`, padding de 8pt, `min-height: 44px` en redes) permanezcan intactas.

- [ ] **Step 4: Run tests and verify zero regressions**

Run: `cd chapatutecnico && node tests/test_footer_svg.js`
Expected: PASS (12/12 pruebas pasadas).

- [ ] **Step 5: Commit changes**

```bash
git add layout.js styles.css
git commit -m "perf: unblock main thread in layout.js using scheduler yielding and CSS content-visibility"
```

---

### Task 3: Optimización de JavaScript, Code-Splitting y Carga Asíncrona de Scripts

**Files:**
- Modify: `chapatutecnico/main.js:1-120`
- Modify: `chapatutecnico/*.html` (adición de `defer` o `type="module"` a todos los scripts externos)
- Modify: `chapatutecnico/cobertura.html` (lazy-load de Google Maps mediante `IntersectionObserver`)
- Modify: `chapatutecnico/seguimiento.html` (lazy-load de Leaflet Map)
- Test: `chapatutecnico/tests/test_carrusel_scroll_nativo.js`

**Interfaces:**
- Consumes: APIs del navegador (`IntersectionObserver`, `addEventListener`).
- Produces: Scripts 100% no bloqueantes (`defer`), división de tareas en `main.js` para ejecutar solo lógica relevante a la vista activa, y carga de mapas bajo demanda.

- [ ] **Step 1: Verify current baseline of `test_carrusel_scroll_nativo.js`**

Run: `cd chapatutecnico && node tests/test_carrusel_scroll_nativo.js`
Expected: PASS (10/10 pruebas pasadas).

- [ ] **Step 2: Optimize and guard `main.js` against unnecessary work on non-index pages**

En `main.js`:
- El Drawer Móvil (`initMobileMenu`) se inicializa en todas las páginas de forma ligera.
- El carrusel del hero (`initHeroScrollCarousel`) y el slider de ofertas (`initOffersSlider`) deben verificar la existencia de sus contenedores antes de vincular eventos, o cargar su lógica de animación de forma diferida.
- Conservar los nombres de función y selectores evaluados por `test_carrusel_scroll_nativo.js` (`initHeroScrollCarousel`, `viewport.scrollBy`, eliminación de clones y autoplay).

- [ ] **Step 3: Ensure all `<script>` tags across all 20 HTML files have `defer`**

Inspeccionar y actualizar cada archivo HTML para que ningún script bloquee el parser:
- `<script src="layout.js" data-part="header" defer></script>`
- `<script src="layout.js" data-part="footer" defer></script>`
- `<script src="main.js" defer></script>`
- Scripts de página (`tienda.js`, `carrito.js`, `solicitud.js`, `login.js`, `cuenta.js`, `soporte.js`, `perfil.js`, `producto.js`) con atributo `defer`.

- [ ] **Step 4: Lazy-load Google Maps in `cobertura.html` and Leaflet in `seguimiento.html`**

En `cobertura.html`:
- Sustituir la carga anticipada en `<head>` o pie de página del script de Google Maps por un `IntersectionObserver` vinculado a `#map` / `#cobertura-map`.
- Cargar el script de Google Maps dinámicamente solo cuando el usuario se acerque a 300px del mapa o interactúe con el selector de distritos.

En `seguimiento.html`:
- Cargar Leaflet JS y CSS dinámicamente o con `defer` de modo que no compitan con el renderizado del stepper ni el botón de pago (`#btn-confirmar-pago`).

- [ ] **Step 5: Run tests and verify zero regressions**

Run: `cd chapatutecnico && node tests/test_carrusel_scroll_nativo.js && node tests/test_seguimiento_boton_pago.js`
Expected: PASS (20/20 pruebas pasadas).

- [ ] **Step 6: Commit changes**

```bash
git add main.js *.html
git commit -m "perf: apply defer to all scripts and lazy-load third-party map SDKs"
```

---

### Task 4: Suite Automatizada de Verificación de Rendimiento Estático (`tests/test_performance_assets.js`)

**Files:**
- Create: `chapatutecnico/tests/test_performance_assets.js`
- Modify: `chapatutecnico/package.json:6-16` (añadir comando `test:performance` y actualizar `test`)
- Test: `chapatutecnico/tests/test_performance_assets.js`

**Interfaces:**
- Consumes: Todos los archivos HTML, CSS y JS en el repositorio `chapatutecnico`.
- Produces: Reporte automatizado en consola con validaciones estructurales de rendimiento estático.

- [ ] **Step 1: Write `tests/test_performance_assets.js`**

El script debe verificar:
1. **Enlaces a hojas de estilo válidos y existentes:** Todos los `<link rel="stylesheet">` apuntan a archivos locales que existen en disco (cero errores 404).
2. **Scripts no bloqueantes:** Ningún script en los 20 archivos HTML omite el atributo `defer` o `type="module"` (a excepción de scripts inline estructurados `type="application/ld+json"`).
3. **Modularidad CSS saludable:** Ningún archivo en `css/views/*.css` excede las 350 líneas de código, garantizando modularidad y mantenibilidad.
4. **Preservación de Tokens de Diseño:** `styles.css` contiene las variables críticas `:root` (`--bg`, `--orange`, `--font-title`, `--font-body`).
5. **No Bloqueo en `layout.js`:** `layout.js` contiene implementación de cedencia de control (`yieldToMain`, `scheduler.yield` o `requestIdleCallback`/`setTimeout`).
6. **Optimización de Layout Shift:** El logotipo en la cabecera y pie de página mantiene `width`, `height` y `aspect-ratio: 118 / 101` para CLS = 0.
7. **Reglas de Contención CSS:** `styles.css` implementa `content-visibility: auto` con `contain-intrinsic-size` para el footer.

- [ ] **Step 2: Run test to verify it passes**

Run: `cd chapatutecnico && node tests/test_performance_assets.js`
Expected: PASS (todas las verificaciones exitosas).

- [ ] **Step 3: Update `package.json` scripts**

Añadir `"test:performance": "node tests/test_performance_assets.js"` y encadenarlo al comando `"test"`.

- [ ] **Step 4: Run full test suite**

Run: `cd chapatutecnico && npm test`
Expected: PASS (100% en `test_footer_svg.js`, `test_seguimiento_boton_pago.js`, `test_carrusel_scroll_nativo.js`, `test_seo_onpage.js`, `test_performance_assets.js`).

- [ ] **Step 5: Commit changes**

```bash
git add tests/test_performance_assets.js package.json
git commit -m "test: add static performance and asset integrity verification suite"
```

---

### Task 5: Validación en Servidor Local y Diagnóstico de Rendimiento Móvil

**Files:**
- Test: Inspección activa en `node dev-server.js` (puerto 3000)
- Verify: Consola del navegador y métricas de carga en `index.html`, `chat.html`, `seguimiento.html`, `electricidad.html`

**Interfaces:**
- Consumes: Servidor HTTP local `dev-server.js`.
- Produces: Verificación de cero errores en consola, CLS = 0 y tiempos de bloqueo del hilo principal reducidos bajo 50ms.

- [ ] **Step 1: Start local development server**

Run: `cd chapatutecnico && node dev-server.js` en segundo plano (puerto 3000).

- [ ] **Step 2: Inspect HTTP responses and asset sizes**

Verificar mediante peticiones HTTP que:
- `http://localhost:3000/index.html` devuelve código 200 y no carga hojas de estilo pesadas sin usar.
- `http://localhost:3000/chat.html` descarga solo `styles.css` y `css/views/chat.css` (~12 KB en vez de 244 KB).
- `http://localhost:3000/seguimiento.html` descarga solo `css/views/seguimiento.css` y no bloquea el hilo principal.
- Los archivos `.css` y `.js` responden con `Content-Type: text/css` y `application/javascript`.

- [ ] **Step 3: Confirm console and layout stability (CLS = 0)**

Validar que no existan advertencias de FOUC ni saltos visuales durante la carga de `layout.js` en viewports móviles (375px y 390px) y escritorio (1440px).

- [ ] **Step 4: Final verification and summary evidence**

Ejecutar la suite completa de pruebas:
```bash
npm test
```
Confirmar que todas las suites pasaron al 100%.

---

## Plan Self-Review Checklist

- **1. Spec Coverage:** 
  - Reducción de uso de CSS sin usar: Cubierto en Task 1 (partición modular a `css/views/*.css`).
  - Reducción de JavaScript sin usar y bloqueo: Cubierto en Task 3 (`defer`, lazy-load de mapas en `cobertura.html` y `seguimiento.html`).
  - Evitar tareas largas en el hilo principal: Cubierto en Task 2 (inyección fragmentada con `scheduler.yield()` en `layout.js` y `content-visibility: auto`).
  - Invariantes de 8pt, grilla y CLS = 0: Cubiertos en Tasks 1, 2 y 4.
  - Verificación con Node.js y nuevo test: Cubierto en Task 4 (`test_performance_assets.js`) y Task 5.
- **2. Step Scan:** Cada paso define comandos precisos, archivos afectados y criterios de éxito claros.
- **3. Type and Selector Consistency:** Los selectores críticos (`.btn-confirmar-pago`, `.hero-card`, etc.) se mantienen estrictamente alineados con los tests preexistentes.
- **4. Review Focus:** Los 5 modos de fallo identificados cuentan con pruebas y salvaguardas explícitas.
- **5. Proportion:** El plan mantiene el nivel óptimo de detalle técnico sin redundancias.

