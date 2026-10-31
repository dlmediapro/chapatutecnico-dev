# 📋 Pendientes, Mejoras y Roadmap Técnico: Chapa Tu Técnico

Este documento registra formalmente el estado de integración del proyecto **Chapa Tu Técnico**, detallando la correspondencia con los diseños de Figma, las vistas o flujos aún pendientes de diseño oficial, las funcionalidades interactivas que requerirán programación backend en fases posteriores y las recomendaciones técnicas de UI/UX, SEO y rendimiento.

---

## 1. 🎨 Vistas y Flujos Pendientes en el Archivo de Figma

De acuerdo con la auditoría exhaustiva realizada contra el archivo de Figma (*CHAPA TU TECNICO*, file key `qg00MT4SVQUrHSM8c58jFt`), se identifican las siguientes pantallas y flujos que aún **no cuentan con Frame oficial diseñado en Figma**:

1. **Catálogo de Productos y Herramientas (Tienda):**
   - *Situación actual:* Existen los Frames oficiales de **`MI CARRITO`** (`id: 1184:945`), **`CARRITO DE SERVICIOS`** (`id: 873:737`) y **`COMPRA`** (`id: 475:454`), los cuales listan productos físicos y herramientas (Taladro Percutor DWD024K, Martillo barnizado, Wincha Truper, etc.).
   - *Pendiente en Figma:* Falta diseñar el Frame oficial de la **Página de Catálogo / Tienda** donde el usuario explore, filtre y añada dichas herramientas al carrito.
   - *Manejo en código:* Se cuenta con el archivo borrador [`tienda.html`](tienda.html) guardado en el repositorio, pero no se expone en la barra de navegación principal para respetar estrictamente los Frames oficiales diseñados. El acceso al carrito se resolvió mediante el botón oficial *"Carrito de servicio"* añadido en la vista de Soporte (Frame `873:509`, nodo `1269:260`) y el icono de carrito en la cabecera.

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
   - *Estado actual (Implementado al 100%):* Se integró la **Google Maps JavaScript API oficial** con la API Key del proyecto, configurada con estilo cartográfico oscuro (*Midnight Navy / Cyan*), polígonos de geocercas reales para los 10 distritos cubiertos, capa de tráfico en tiempo real, vista satelital y selector de doble modo para alternar con la vista vectorial original de Figma.
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

---

*Documento actualizado el 30 de octubre de 2026 tras la implementación de la vista oficial Iniciar Sesión (`login.html`) y su vinculación global.*

