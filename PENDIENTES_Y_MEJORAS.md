# 📋 Pendientes, Mejoras y Roadmap Técnico: Chapa Tu Técnico

Este documento registra formalmente el estado de integración del proyecto **Chapa Tu Técnico**, detallando la correspondencia con los diseños de Figma, las vistas o flujos aún pendientes de diseño oficial, las funcionalidades interactivas que requerirán programación backend en fases posteriores y las recomendaciones técnicas de UI/UX, SEO y rendimiento.

---

## 1. 🎨 Vistas y Flujos Pendientes en el Archivo de Figma

De acuerdo con la auditoría exhaustiva realizada contra el archivo de Figma (*CHAPA TU TECNICO*, file key `qg00MT4SVQUrHSM8c58jFt`), se identifican las siguientes pantallas y flujos que aún **no cuentan con Frame oficial diseñado en Figma**:

1. **Catálogo de Productos y Herramientas (Tienda):**
   - *Estado:* **IMPLEMENTADO AL 100%** mediante la página oficial [`tienda.html`](tienda.html) basada fielmente en el Frame oficial **`TIENDA CHAPA`** (`id: 1331:265`) de Figma.
   - *Características activas:* Matriz 3x3 de 9 herramientas en WebP (CLS = 0), barra de herramientas con filtro desplegable de "CATEGORÍAS", selector "Ordenar por: Recomendados", buscador instantáneo en vivo con micrófono (Search UX), botón "VER MÁS" de paginación progresiva y adición reactiva a `localStorage` (`chapa_cart`) sincronizada en tiempo real con el badge del `<header>`.
   - *Navegación:* Expuesto en la barra de navegación institucional (`layout.js`) como enlace activo `TIENDA CHAPA` con la **Regla de Buscador Único** (`data-search="false"`).

2. **Ficha de Detalle de Producto Individual:**
   - *Situación actual:* Al dar clic a un producto del carrito no existe una pantalla con especificaciones técnicas, selector de cantidad o galería de fotos del producto antes de agregarlo.

3. **Flujo de Pasarela de Pagos (Checkout Interactivo):**
   - *Situación actual:* El Frame **`COMPRA`** (`id: 475:454`) diseña la pantalla estática de resumen con botones de Yape, Visa, Mastercard y Plin.
   - *Pendiente en Figma:* Faltan los modales o pantallas de confirmación (pantalla de escaneo de QR para Yape/Plin, formulario de datos de tarjeta de crédito/débito y pantalla de "Pedido Confirmado / Voucher").

4. **Flujo de Autenticación de Clientes y Técnicos (Login):**
   - *Estado:* **IMPLEMENTADO AL 100%** mediante la página oficial [`login.html`](login.html) basada fielmente en el Frame oficial **`INICIAR SESIÓN`** (`id: 1423:848`) de Figma.
   - *Características activas:* Selector dual de roles (Soy Cliente / Soy Técnico), validación en tiempo real para correo o celular peruano (+51 de 9 dígitos), toggle interactivo de contraseña, accesos rápidos multi-proveedor (Google, Apple, y código OTP vía WhatsApp con modal emergente), feedback visual accesible sin recarga y vinculación en el botón global del Header y Footer en todo el sitio web.
   - *Fase backend futura:* Conexión de los endpoints de autenticación OAuth y servicio de SMS/WhatsApp OTP con backend productivo.

---

## 2. ⚡ Funcionalidades Interactivas Pendientes de Programación Backend

Actualmente, las vistas del proyecto cuentan con prototipado dinámico en frontend (JavaScript nativo, `localStorage` y manejo de eventos). Para llevar la plataforma a un entorno productivo completo se requiere implementar:

1. **Sistema de Chat y Mensajería en Tiempo Real ([`mensajes.html`](mensajes.html)):**
   - Integración con base de datos en tiempo real (ej. Firebase Realtime Database o Supabase WebSockets).
   - Notificaciones push al técnico y al cliente cuando se envía un nuevo mensaje.

2. **Integración de Pasarela de Pagos Real ([`compra.html`](compra.html)):**
   - Integración del SDK de procesamiento de pagos (ej. Niubiz, Culqi o MercadoPago Perú).
   - Generación dinámica de QR para cobros vía interoperabilidad Yape/Plin.

3. **Geolocalización Dinámica y Mapas Interactivos ([`cobertura.html`](cobertura.html)):**
   - *Estado actual (Optimizado al 100% según Figma y Heurísticas de Nielsen):* 
     - **Header compacto en 1 sola fila:** Se adaptó la cabecera en `layout.js` para omitir el buscador de oficios en esta vista, evitando redundancia con el buscador de distritos (#5 Prevención de errores y #8 Minimalismo).
     - **Buscador protagónico de distritos:** Búsqueda en tiempo real por distrito o código postal con feedback amigable y zoom directo al polígono.
     - **Google Maps como motor único:** Eliminación de 1.3 MB de imagen base rasterizada y 120+ líneas de SVG muerto.
     - **Control ergonómico `Centrar`:** Botón flotante accesible con glassmorphism cian (#3 Control y libertad) para reencuadrar Lima Metropolitana.
   - *Fase backend futura:* Conexión con WebSockets para seguimiento GPS en movimiento de la moto/vehículo del técnico hacia el domicilio del cliente.

4. **Persistencia del Carrito de Compras ([`carrito.html`](carrito.html)):**
   - Conexión de los eventos de adición, incremento y eliminación con almacenamiento en base de datos o sincronización con sesión de usuario.

5. **Panel del Técnico con API REST ([`perfil.html`](perfil.html) y [`solicitud.html`](solicitud.html)):**
   - Gestión de estados de solicitudes (Aceptada, En camino, Finalizada, Cancelada) comunicada con base de datos relacional (PostgreSQL).

---

## 3. 🚀 Mejoras Sugeridas de UI/UX, SEO y Rendimiento

### UI / UX
- **Micro-interacciones y Feedback Háptico:** Añadir estados de carga (*skeleton loaders*) durante la transición entre la selección de un técnico y la pantalla de compra.
- **Validación Accesible de Formularios (WCAG 2.2 AA):** Incorporar anuncios en vivo (`aria-live="polite"`) en el formulario de soporte y el carrito para lectores de pantalla.

### SEO On-Page y Local
- **Marcado Semántico de Preguntas Frecuentes:** `soporte.html` ya incluye `schema.org/FAQPage`. Se recomienda añadir `schema.org/BreadcrumbList` en todas las páginas internas para mejorar los rich snippets en Google.
- **SEO para Técnicos:** Añadir metadatos OpenGraph dinámicos en los perfiles individuales de técnicos cuando se pasen parámetros en la URL (`perfil.html?id=roberto`).

### Rendimiento (Core Web Vitals)
- **Conversión de Imágenes a WebP / AVIF:** Las imágenes de alta definición agregadas en `img/` (`cobertura_mapa_lima.png`, `tecnico_roberto.png`, etc.) están optimizadas, pero convertirlas a formato WebP moderno reduciría el peso de transferencia en un ~40% adicional.
- **Atributos de Dimensiones:** Mantener `width` y `height` explícitos en todas las etiquetas `<img>` para garantizar **CLS = 0** (Cumulative Layout Shift) en móviles.

---

## 4. 🧭 Vista de Error 404 (Heurísticas de Jakob Nielsen) y Mapeo de Enlaces Temporales

### A. Implementación de `404.html` (Figma Frame `1283:242`)
Se implementó la página oficial [`404.html`](404.html) siguiendo estrictamente el Frame de Figma y las **Heurísticas de Usabilidad de Jakob Nielsen**:
1. **Heurística #1 (Visibilidad del estado del sistema):** Chip `"Enlace roto"` (`#53c8f7`) y número decorativo `"404"` de fondo en opacidad reducida.
2. **Heurística #2 (Relación con el mundo real):** Tono empático y reconfortante (*"Tu cuenta y tus solicitudes siguen a salvo; solo hay que volver a conectar"*) junto con la ilustración del castor técnico reparando el cableado (`img/404-sin%20fondo.webp`).
3. **Heurísticas #3 y #9 (Salidas de emergencia y recuperación):**
   - CTA primario: `"Volver al inicio"` (`index.html`).
   - CTA secundario: `"Ver servicios"` (`servicios.html`).
   - Accesos directos a especialistas: `Electricista`, `Gasfitero`, `Carpintero` y `Cerrajero`.
   - Asistencia 24/7 con botón de WhatsApp directo (`wa.me/51998204667`).
4. **Heurísticas #4 y #8 (Consistencia y estética minimalista):** Mantiene Header y Footer globales vía `layout.js` con `data-page="404"` (sin ninguna pestaña marcada artificialmente como activa).
5. **SEO y Crawler Safety:** Inclusión de `<meta name="robots" content="noindex, follow">`.

### B. Enlaces Pendientes Redirigidos a `404.html`
Para evitar enlaces muertos o saltos vacíos (`href="#"`), se enlazaron temporalmente a `404.html`:
- **Redes Sociales del Footer (`layout.js`):** YouTube, Facebook, Instagram y TikTok.
- **Botones de Solicitar en la Home (`index.html`):** Gasfitería, Carpintería, Cerrajería, Vidriería e Informática.
- **Botones de Solicitar en Catálogo de Servicios (`servicios.html`):** Gasfitería, Carpintería, Cerrajería, Vidriería, Informática, Pintura, Línea Blanca, Albañilería, Drywall, Cámaras CCTV y Climatización (mientras que Electricidad apunta a [`electricidad.html`](electricidad.html) por contar con landing operativa y cotizador oficial).

---

## 5. 🛠️ Sincronización Oficial de la Vista de Servicios (`servicios.html` - Figma Frame `475:695`)

El 1 de noviembre de 2026 se completó la refactorización profunda de [`servicios.html`](servicios.html) basada en el Frame oficial de Figma **`SERVICIOS`** (`node-id: 475:695`):

1. **Arquitectura SEO y Metadatos Modularizados:**
   - Organización en 7 bloques comentados en el `<head>` para fácil edición futura.
   - Datos estructurados Schema.org duales en formato JSON-LD: `LocalBusiness` (atención 24/7 en Lima Metropolitana) e `ItemList` (12 servicios técnicos oficiales).
   - Metadatos Open Graph y Twitter Cards enriquecidos para previsualizaciones limpias en WhatsApp, Facebook y LinkedIn.
2. **Semántica HTML5 Estricta y Nielsen Heuristics (#1, #2, #3, #4, #6 y #8):**
   - Único `<h1>SERVICIOS</h1>` en la página con jerarquía lógica `<h2>` (secciones) y `<h3>` (tarjetas y pilares de confianza), con encabezado `≡ SERVICIOS` alineado a la izquierda según el canvas de Figma.
   - **Unificación del Buscador Global (Heurísticas #4 y #8):** Eliminación del segundo input de búsqueda repetido en el `<main>`. El filtrado en vivo se conecta 100% al input del Header global cuando se está en `servicios.html`, y detecta parámetros de URL `?q=termino` si el usuario busca desde otras páginas (`index.html`, etc.).
   - **Estado Vacío y Recuperación (Heurística #9):** Contenedor accesible (`role="status"`, `aria-live="polite"`) con botón interactivo "Ver todos los servicios" para restablecer el catálogo con 1 clic.
   - Botones píldora "Solicitar" con `min-height: 44px` (WCAG 2.2 touch target) y feedback visual inmediato.
3. **Rendimiento Nativo (CLS = 0):**
   - Atributos `width` y `height` explícitos en todas las imágenes con `aspect-ratio: 436 / 449` en tarjetas y `780 / 506` en la sección "Por Qué Elegirnos".
   - Carga anticipada `loading="eager"` en el primer pliegue y `loading="lazy"` bajo el pliegue.

---

*Documento actualizado el 1 de noviembre de 2026 tras la sincronización oficial de `servicios.html` con el Frame de Figma 475:695.*



---

## 6. ⚡ Implementación Oficial de la Vista de Técnicos (`tecnicos.html` - Figma Frame `873:198`)

Se implementó y sincronizó al 100% la pantalla oficial **"LISTA DE TÉCNICOS"** a partir de la inspección en vivo de Figma mediante MCP y la aplicación combinada de las 4 Agent Skills de UX/UI (`ux-heuristics`, `ux-heuristic-review`, `review-ux-ui` y `ui-laws-and-spacing`).

### 6.1. Correspondencia Directa con Figma
- **Frame Oficial:** `LISTA DE TECNICOS` (Node ID `873:198`, página `0:1: Modelo pagina web`, dimensiones `1427 x 1974 px`).
- **Nodos Integrados:**
  - `1452:730`: Título principal `TÉCNICOS`.
  - `1100:1863` / `1091:1839`: Tarjeta de **Roberto Rojas** (4.5 ★, 267 reseñas, S/ 200).
  - `1109:1893` / `1324:253`: Tarjeta de **Mateo Santos** (4.3 ★, 204 reseñas, S/ 100).
  - `1109:1902` / `1092:1845`: Tarjeta de **Carlos Paredes** (4.6 ★, 221 reseñas, S/ 180; nombre unificado tras resolver duplicidad del diseño original).
  - `1109:1920` / `1095:1853`: Tarjeta de **Ximena Gonzales** (4.7 ★, 321 reseñas, S/ 250).
  - `1344:895`: Botón inferior `VER MÁS TÉCNICOS`.

### 6.2. Activos Gráficos en `.webp` (CLS = 0)
- Todas las imágenes fueron exportadas a alta resolución desde sus respectivos nodos de Figma y convertidas a formato `.webp` (calidad 85%) mediante Pillow (PIL):
  - `assets/img/tecnicos/roberto-rojas.webp` (47 KB)
  - `assets/img/tecnicos/mateo-santos.webp` (59 KB)
  - `assets/img/tecnicos/carlos-paredes.webp` (53 KB)
  - `assets/img/tecnicos/ximena-gonzales.webp` (56 KB)
  *(Copia espejo en `img/tecnicos/` para máxima resiliencia de rutas relativas).*
- Declaración obligatoria de `aspect-ratio: 16/10`, `width`, `height` y `loading="lazy"` bajo el pliegue para erradicar cualquier salto de contenido (**CLS = 0**).

### 6.3. Mejoras Heurísticas y de Accesibilidad Aplicadas
- **Ley de Hick & Don't Make Me Think (`ux-heuristics`):** Barra de filtrado ágil por distritos clave (Miraflores, Surco, San Isidro, San Borja, Los Olivos) y filtro de disponibilidad rápida (`⚡ Disponibles hoy`) sin abrumar al usuario con controles innecesarios.
- **Ley de Fitts (`ui-laws-and-spacing`):** Áreas táctiles de mínimo `44x44px` en todos los botones y chips; diferenciación clara entre el CTA primario ("Contratar") y el secundario ("Ver perfil").
- **Accesibilidad WCAG 2.1 AA (`review-ux-ui`):** Estados de disponibilidad con doble codificación (icono visual + texto explícito `🟢 Disponible hoy` / `⚡ En línea`), eliminando la dependencia exclusiva del color para usuarios daltónicos; contraste superior a 4.5:1; atributos `aria-live="polite"` para anunciar resultados filtrados; soporte de navegación completa por teclado con `:focus-visible`.
- **Prevención y Recuperación de Errores (`ux-heuristic-review`):** Zero-State empático cuando la búsqueda no arroja resultados, con botón directo "Ver todos los técnicos" para restablecer filtros sin fricción.

### 6.4. Vinculación y Flujo de Usuario
- **Entrantes:**
  - `servicios.html`: El botón *"Solicitar"* de la tarjeta "Servicio de Electricidad" apunta directamente a `tecnicos.html`.
  - `index.html`: El botón *"Solicitar"* de "Servicio de Electricidad" en la grilla principal apunta a `tecnicos.html`.
  - `electricidad.html`: Acceso directo *"Ver Técnicos Disponibles en Lima"* en el hero principal.
  - `layout.js` (Footer): Enlace institucional *"Nuestros Técnicos"*.
- **Salientes:**
  - Migas de pan: `Inicio (index.html) > Servicios (servicios.html) > Electricidad (electricidad.html) > Técnicos Disponibles`.
  - Botón "Contratar" $\rightarrow$ `solicitud.html?servicio=electricidad&tecnico=...`.
  - Botón "Ver perfil" $\rightarrow$ `perfil.html?id=...`.


---

## 7. 🛡️ Implementación Oficial del Centro de Soporte y Ayuda (`soporte.html` - Figma Frame `873:509`)

Se completó y sincronizó al 100% la pantalla oficial **"SOPORTE"** a partir de la inspección en vivo de Figma mediante MCP y la aplicación rigurosa de las 4 Agent Skills de UX/UI (`ux-heuristics`, `ux-heuristic-review`, `review-ux-ui` y `ui-laws-and-spacing`) con especial enfoque en la **Heurística #10 de Jakob Nielsen (Ayuda y Documentación)**.

### 7.1. Correspondencia Directa con Figma
- **Frame Oficial:** `SOPORTE` (Node ID `873:509`, página `0:1: Modelo pagina web`, dimensiones `1435 x 2380 px`, posición canvas `x=7302, y=-200`).
- **Nodos Integrados:**
  - `1336:235` / `978:1550`: Título protagónico `¿En qué podemos ayudarte?` y subtítulo de bienvenida.
  - `934:224` / `1334:406`: Buscador exclusivo de consultas y FAQs (*"Escribe tu consulta aquí"*).
  - `978:1624` / `978:1848` / `978:2052`: Tarjeta y botón de **WhatsApp**.
  - `978:1667` / `978:1884` / `978:2074`: Tarjeta y botón de **Correo electrónico**.
  - `978:1705` / `978:1919` / `978:2144`: Tarjeta y botón de **Preguntas frecuentes**.
  - `978:1826` / `978:1977` / `978:2125`: Tarjeta y botón de **Libro de reclamaciones**.
  - `978:1745`: Sección y acordeones interactivos de **Preguntas frecuentes** (`978:2159`, `978:2198`, `978:2239`).
  - `978:1785` / `978:2019`: Sección de asistencia personalizada *"¿Necesitas más ayuda?"*.
  - `1057:238`: Ilustración oficial del asesor de soporte (*"Persona con audífonos"*).
  - `978:2297`, `978:2376`, `978:2313`, `978:2331`, `1334:403`: Formulario de ticket de consulta con botón `Enviar consulta`.
  - `1269:260`: Botón de acceso directo a *Carrito de servicio*.

### 7.2. Regla de Buscador Único (Cero Colisión Cognitiva)
- Debido a que el hero de Soporte tiene como protagonista su propio buscador interno (`¿En qué podemos ayudarte?`), se activó la variante compacta del `<header>` institucional (`data-search="false"` / `page === 'soporte'`), suprimiendo el buscador superior de oficios para erradicar cualquier duplicidad o desorientación del usuario.

### 7.3. Activos en `.webp` y Optimización (CLS = 0)
- La ilustración oficial de soporte (`nodo 1057:238`) fue exportada a alta resolución y convertida a `.webp` (calidad 85%) mediante Pillow (PIL):
  - `assets/img/soporte-atencion.webp` (4.8 KB, 302 x 251 px)
  - `img/soporte-atencion.webp` (copia espejo para rutas relativas).
- Se declararon dimensiones explícitas `width="302"`, `height="251"`, `aspect-ratio: 302/251` y `loading="lazy"` para garantizar **CLS = 0**.

### 7.4. Accesibilidad WCAG 2.1 AA y Microinteracciones
- **Acordeones Dinámicos:** Implementados en Vanilla JS con atributos semánticos `<button aria-expanded="false" aria-controls="...">` y soporte de teclado (`Enter` / `Espacio`).
- **Filtrado en Tiempo Real:** El buscador del hero filtra instantáneamente los acordeones de FAQ, expandiendo automáticamente las coincidencias y anunciando los resultados mediante `aria-live="polite"`.
- **Validación Amigable (Nielsen H1 & H5):** El formulario valida campos requeridos y formato de email sin recargar la página ni emitir alertas invasivas (`alert()`). Al enviar, muestra un ticket generado (`#TK-XXXXXX`) y confirma el tiempo estimado de respuesta (*"menos de 15 minutos por WhatsApp o por correo"*).
- **Target Táctil:** Áreas de contacto de mínimo `44x44px` en todos los botones y campos interactivos.

### 7.5. Bloque SEO y Esquema JSON-LD (`FAQPage` + `ContactPage`)
- Sección `<head>` comentada con `<!-- === SEO & METADATOS EDITABLES === -->`.
- Marcado estructurado Schema.org con `@graph` dual:
  - `ContactPage`: Atención 24/7 en Lima Metropolitana, WhatsApp y correo.
  - `FAQPage`: Las 4 preguntas esenciales sobre seguimiento, garantías, reprogramación y medios de pago.
- Enlace de rescate integrado en `404.html` para redireccionar usuarios extraviados directamente al centro de soporte.

### 7.6. Rediseño y Ajuste de Precisión 1:1 con Figma (Tema Oscuro & Captura Oficial)
- **100% Dark Theme:** Se erradicaron las tarjetas blancas artificiales; la vista adopta el fondo dark navy continuo (`#08233b`) con contenedores oscuros translúcidos (`#061a2c`) y bordes de alta sutileza (`1px solid rgba(255,255,255,0.18)`).
- **Hero Split:** Título y subtítulo en columna izquierda y buscador píldora blanco (con iconos SVG de lupa y micrófono) alineado a la derecha.
- **Grilla 2x2 Canónica:** Reconfiguración a 2 columnas para las 4 tarjetas de canales con botones píldora (`border-radius: 999px`) y chevrons (`>`). Botón de WhatsApp en verde brillante `#00e599`, y los demás en contorno blanco elegante.
- **Barras FAQ Píldora:** Acordeones estilizados como cápsulas oscuras flotantes de ancho completo con chevron animado (`>`).
- **Módulo "¿Necesitas más ayuda?":** Contenedor unificado oscuro con la ilustración de soporte (`soporte-atencion.webp`) sobre el encabezado y formulario con campos oscuros e icono integrado, finalizando en el prominente botón blanco sólido `Enviar consulta` (`#ffffff` con texto azul `#08233b`).

---

## 8. 🛒 Implementación Oficial del Carrito de Servicios y Tienda Chapa (`carrito.html` - Figma Frame `1331:265`)

Se implementó y transformó al 100% la pantalla oficial **"MI CARRITO"** a partir de la inspección en vivo de Figma mediante MCP (`node-id=1331-265`) y la aplicación sinérgica de las Agent Skills de UX/UI (`ux-heuristics`, `ux-heuristic-review`, `review-ux-ui`, `ui-laws-and-spacing`) y las leyes conductuales del diseño.

### 8.1. Correspondencia Directa con Figma & Arquitectura Dual-Purpose
- **Frame Oficial:** `CARRITO DE SERVICIOS` (Node ID `1331:265`).
- **Arquitectura Dual-Purpose:** Unifica en una sola vista la gestión de servicios técnicos reservados (mano de obra con técnicos certificados) y productos/herramientas físicas de Tienda Chapa.
- **Grilla de 12 Columnas (8 + 4):**
  - **8 Columnas (Contenido Principal):** Lista dinámica de servicios y productos, controles de cantidad accesibles, eliminación con transición suave y sección de venta cruzada con las 9 herramientas de Figma.
  - **4 Columnas (Lateral Sticky):** Tarjeta de Resumen del Pedido (`order-summary-card`) fija durante el desplazamiento en desktop, con cálculo en tiempo real, desglose transparente, cupón de descuento y CTA principal hacia `compra.html`.

### 8.2. Leyes de UX Aplicadas en la Interfaz
- **Ley de Fitts:** Botón primario de checkout (`FINALIZAR COMPRA`) con altura generosa de 52px, tipografía destacada y microinteracción de elevación a 60fps. Controles táctiles del stepper (`-` y `+`) y botón de eliminación con dimensiones mínimas estrictas de **44x44px**.
- **Ley de Hick:** Organización jerárquica limpia que reduce la sobrecarga cognitiva: el usuario ve su resumen en 4 líneas claras sin pasos innecesarios antes de decidir la compra.
- **Ley de Miller:** Desglose del pedido estructurado en 4 datos clave: Subtotal Servicios, Subtotal Productos, Desplazamiento Lima (Gratis en promoción) y Descuento por cupón.
- **Ley de Jakob:** Patrón canónico de E-commerce familiar y predecible: lista a la izquierda, resumen y checkout flotante a la derecha, botón de cupón y papelera para eliminar.

### 8.3. Motor Reactivo en Vanilla JS (`carrito.js`) & Sincronización en Tiempo Real
- **Persistencia en `localStorage` (`chapa_cart`):** Almacenamiento seguro del estado del carrito con soporte para ítems de tipo servicio y tipo producto.
- **Sincronización en Vivo del Header Badge:** `layout.js` escucha eventos `chapa-cart-updated` y cambios de `storage`, actualizando de inmediato la burbuja numérica del carrito (`.header-cart-count`) en todo el sitio web con una sutil animación de pulso (`pulse`).
- **Cero `alert()` Invasivos:** Notificaciones toast accesibles (`chapa-toast`) con `role="status"` y anunciador para lectores de pantalla (`#chapa-sr-announcer`).
- **Cupón de Descuento Interactivo:** Soporte para cupones dinámicos como `CHAPA20` (-20%), `CHAPA10` (-10%) y `BIENVENIDA` (-15%), con feedback visual instantáneo (verde/rojo) y opción de remover cupón.
- **Zero-State Empático:** Si el usuario vacía el carrito, la interfaz muestra una ilustración vectorial personalizada (`assets/img/carrito-vacio.svg`), mensaje cordial y 2 botones de rescate hacia `servicios.html` y `tienda.html`.

### 8.4. Optimización de Activos a `.webp` (CLS = 0)
- Las 9 herramientas presentes en el Frame `1331:265` fueron convertidas y optimizadas en formato `.webp` en `assets/img/productos/`:
  - `taladro.webp` (18.9 KB)
  - `wincha.webp` (8.4 KB)
  - `tablero.webp` (13.5 KB)
  - `martillo.webp` (28.6 KB)
  - `arco_acero.webp` (47.9 KB)
  - `sierra.webp` (34.5 KB)
  - `caja_herramientas.webp` (31.4 KB)
  - `cinturon.webp` (5.4 KB)
  - `kit_herramientas.webp` (5.4 KB)
- Reducción global de peso >80% respecto a los archivos PNG originales.
- Atributos `width` y `height` explícitos en todas las etiquetas `<img>` para garantizar **CLS = 0**.

---

## 9. 🛒 Implementación Oficial de Tienda Chapa (`tienda.html` - Figma Frame `1331:265`)

Se implementó y activó oficialmente el catálogo de productos **"TIENDA CHAPA"** (`tienda.html`) a partir de la inspección en vivo de Figma (`node-id=1331-265`) y la captura oficial, unificando la identidad visual con las 4 Agent Skills de UX/UI (`figma-design-to-code`, `frontend-ui-engineering`, `search-ux`, `verification-before-completion`) y las heurísticas del proyecto.

### 9.1. Integración en Navegación Global y Regla de Buscador Único
- **Habilitación en Menú Principal (`layout.js`):** Se incorporó `"TIENDA CHAPA"` como enlace activo oficial en la barra de navegación institucional con indicador de página activa (`aria-current="page"`).
- **Cero Colisión Cognitiva (`data-search="false"`):** Al contar la vista con una barra de herramientas protagónica que incluye buscador por texto y voz, se configuró `page === 'tienda'` en `layout.js` para ocultar automáticamente el buscador genérico de oficios de la cabecera.

### 9.2. Barra de Herramientas del Catálogo (Toolbar)
- **Filtro de CATEGORÍAS (Heurística #7 Nielsen: Flexibilidad y Eficiencia):** Menú desplegable accesible con icono de hamburguesa que permite filtrar instantáneamente por familias: *Herramientas Eléctricas*, *Herramientas Manuales*, *Medición y Trazo*, *Tableros y Material Eléctrico*, *Cajas y Organizadores*, *Kits y Juegos de Herramientas*.
- **Selector de Ordenamiento:** Opciones de clasificación en tiempo real: *Recomendados ⇅*, *Menor precio*, *Mayor precio* y *Nombre A - Z*.
- **Buscador Píldora Blanco con Micrófono (Search UX):** Barra de búsqueda con bordes redondeados (`border-radius: 999px`), icono de lupa y botón de dictado por voz (Web Speech API) con animación de escucha activa.
- **Estado Sin Resultados Empático:** Zero-state ilustrado con mensaje orientador y botón CTA para restaurar el catálogo completo sin recargar la página.

### 9.3. Matriz de Productos 3x3 (Figma 1:1) & Optimización WebP
- **Fidelidad Estética:** Cada tarjeta de producto cuenta con un contenedor superior blanco puro (`.tienda-img-box`) para máximo contraste visual de la herramienta, título en Oswald, badge de precio en naranja institucional (`#e8532b`), indicador de stock en verde neón (`#00e599`) y botón CTA blanco tipo píldora (`Añadir al carrito`).
- **9 Herramientas Oficiales:** Taladro Percutor DeWalt, Wincha Truper 8m, Tablero Schneider 12 polos, Martillo barnizado Stanley, Arco de acero Montarez, Sierra circular Bosch, Caja de herramientas Tactix, Cinturón porta herramientas DeWalt y Kit de herramientas Workpro.
- **Carga Progresiva ("VER MÁS"):** Botón centrado que inyecta herramientas adicionales del catálogo sin saltos de layout.
- **Rendimiento CLS = 0:** Imágenes WebP con dimensiones intrínsecas declaradas y carga diferida (`loading="lazy"`).

### 9.4. Sincronización Reactiva con el Carrito
- Al presionar **"Añadir al carrito"**, el producto se almacena en `localStorage` (`chapa_cart`), el botón emite feedback táctil temporal (`¡Añadido! ✔`), se despacha el evento global `chapa-cart-updated` y la burbuja numérica del header (`.header-cart-count`) se actualiza instantáneamente en todo el sitio web.

