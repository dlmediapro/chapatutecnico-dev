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

4. **Flujo de Autenticación de Clientes (Login / Registro):**
   - *Situación actual:* El Frame **`PERFIL DEL TECNICO`** (`id: 614:103`) atiende el panel del especialista, pero no hay Frame de registro para clientes nuevos ni recuperación de contraseña.

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
   - Sustituir la imagen estática del mapa por el mapa interactivo de Google Maps JavaScript API o Mapbox GL JS.
   - Polígonos de geocercas reales para delimitación automática de zonas tarifarias por distrito.

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

*Documento generado el 29 de octubre de 2026 como parte del cierre de integración del repositorio oficial [dlmediapro/chapatutecnico-dev](https://github.com/dlmediapro/chapatutecnico-dev).*
