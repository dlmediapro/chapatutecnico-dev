# Sistema de Diseño: Chapa Tu Técnico 🎨📐

**Diseño Oficial en Figma:** [CHAPA-TU-TECNICO (Figma)](https://www.figma.com/design/qg00MT4SVQUrHSM8c58jFt/CHAPA-TU-TECNICO?m=auto&t=UcRT9b8HSTMI72Ax-1)

---

## 1. Filosofía de Diseño: Figma como Base Flexible

> [!NOTE]
> **Principio Rector:** El archivo de Figma constituye la base conceptual, visual y estructural del proyecto. Sin embargo, la experiencia interactiva real en el navegador (tiempos de carga, ergonomía táctil en móviles, contraste de accesibilidad y transiciones a 60fps) manda.
> Si durante la maquetación y programación una solución en código resulta más clara, rápida o visualmente más pulida que el diseño inicial, **se adopta dicha mejora en código y se traslada posteriormente al Figma**, asegurando una evolución dinámica y no restrictiva.

---

## 2. Anatomía y Secciones de Home / Inicio (`index.html`)

La página principal está modularizada en secciones independientes pero unificadas bajo un mismo lenguaje visual:

```mermaid
flowchart TD
    A["1. Topbar (Atención 24/7 + Cobertura Lima)"] --> B["2. Header Principal (Logo + Nav + Búsqueda + Emergencia)"]
    B --> C["3. Hero Banner (Título de Impacto + Carrusel de Especialidades)"]
    C --> D["4. Beneficios Clave (Técnicos Verificados + Precios Claros + Garantía)"]
    D --> E["5. Ofertas del Mes (Promociones estacionales)"]
    E --> F["6. Técnicos Destacados (Fichas con estrellas y contacto directo)"]
    F --> G["7. Categorías de Servicios (Grilla modular)"]
    G --> H["8. Experiencia y Confianza (Testimonios y Reseñas)"]
    H --> I["9. Footer Institucional (Medios de pago, libro de reclamaciones y redes)"]
```

### Detalle por Sección:
1. **Topbar Compartido:** Franja superior que comunica cobertura exclusiva en Lima Metropolitana, atención 24/7 y selector de idioma.
2. **Header Principal:**
   - Logotipo de alta nitidez en formato SVG/WebP.
   - Navegación clara (`Inicio`, `Nosotros`, `Servicios`, `Cobertura`, `Soporte`).
   - Botón CTA de alta visibilidad: **EMERGENCIA 24/7** con enlace directo a WhatsApp.
   - Barra de búsqueda central con soporte para búsqueda textual y botón de voz.
   - Iconos de acción del usuario: Mi Cuenta, Notificaciones y Carrito.
3. **Hero Banner & Carrusel:**
   - Titular de alto contraste con acentos en amarillo y verde de seguridad.
   - Cruces ornamentales y carrusel deslizable con imágenes optimizadas (WebP) de electricistas, gasfiteros, cerrajeros y carpinteros.
4. **Beneficios (Trust Badges):**
   - 3 pilares de confianza: *Técnicos Identificados*, *Precios Transparentes* y *Garantía Asegurada*.
5. **Ofertas del Mes:**
   - Carrusel de promociones destacadas con badges de descuento.
6. **Footer Compartido:**
   - Enlaces agrupados, canales de soporte (WhatsApp y teléfono), pasarelas aceptadas (Yape, Plin, Visa, Mastercard) y acceso al Libro de Reclamaciones según normativa peruana.

---

## 3. Tokens de Diseño Globales (`:root`)

Los tokens están centralizados en `styles.css` para mantener coherencia en todas las vistas:

```css
:root {
  /* Paleta Corporativa */
  --bg: #08233b;           /* Azul profundo principal */
  --bg-dark: #061b2e;      /* Fondo de header/footer */
  --white: #ffffff;        /* Texto principal y tarjetas claras */
  --muted: #c9d4de;        /* Texto secundario y subtítulos */
  --orange: #e8532b;       /* Acento de atención y alertas */
  --red: #e5482e;          /* Emergencia / Destacados */
  --green: #5fd068;        /* Validación, éxito y WhatsApp */
  --yellow: #fdb913;       /* Calificaciones y acento de marca */
  --line: rgba(255, 255, 255, 0.22); /* Bordes sutiles */

  /* Tipografía Modular */
  --font-title: 'Oswald', sans-serif;  /* Titulares, badges y números */
  --font-body: 'Raleway', sans-serif;  /* Textos de lectura y formularios */

  /* Escala de Espaciado Canónica de 8pt */
  --space-1: 4px;   /* Micro-espaciado */
  --space-2: 8px;   /* Espaciado compacto */
  --space-3: 16px;  /* Espaciado base (padding de cards) */
  --space-4: 24px;  /* Separación de grupos */
  --space-5: 32px;  /* Padding mayor */
  --space-6: 48px;  /* Separación de secciones */

  /* Ergonomía Táctil y Accesibilidad */
  --min-touch-target: 44px; /* Tamaño mínimo interactivo móvil */
}
```

---

## 4. Reglas de Rendimiento y Prevención de CLS

1. **Aspect Ratio Obligatorio:** Toda imagen en tarjeta o banner debe declarar su relación de aspecto (`aspect-ratio: 16/9`, `aspect-square`, etc.) para evitar saltos de página durante la carga.
2. **Formato WebP/SVG:** Priorizar recursos vectoriales limpios y WebP con compresión moderna.
3. **Animaciones a 60fps:** Limitar transiciones CSS a `transform` y `opacity` con curvas de desaceleración `ease-out`.

---

## 5. Anatomía de la Página Nosotros (`nosotros.html`)

Replicada con fidelidad estricta al Frame **NOSOTROS** de Figma (`id: 1232:246`):
- **Header & Footer Institucionales:** Inyectados mediante `layout.js` con el enlace `NOSOTROS` activo (`aria-current="page"`).
- **Fondo Corporativo:** `#0a2941` unificado con la paleta de marca.
- **Estructura de Secciones Oficiales (Figma):**
  1. **S1 · Nosotros (`1235:262`):**
     - Columna izquierda: Fotografía oficial de pareja de especialistas (`img/nosotros_pareja_tecnicos.png`, `662x441`, `border-radius: 16px`).
     - Columna derecha: `H1` "Nosotros" (Raleway 40px w500), Lead "Conectamos tu hogar con técnicos de confianza." (Raleway 24px w500) y párrafo oficial de origen de la empresa.
     - Franja inferior: 3 tarjetas de datos clave (`4 años` / *de servicio a domicilio*, `24/7` / *atención y soporte*, `Lima Metropolitana` / *cobertura del servicio*) con valor destacado en rojo/naranja `#dd3d22` y fondo translúcido (`rgba(255, 255, 255, 0.04)`).
  2. **S2 · Misión y Visión (`1235:277`):**
     - Tarjeta Misión: Icono diana concéntrica SVG oficial (`icon_mision.svg`), titular Raleway 32px w600 y texto de compromiso con los hogares de Lima.
     - Tarjeta Visión: Icono de ojo SVG oficial (`icon_vision.svg`), titular Raleway 32px w600 y texto de consolidación en familias peruanas.
  3. **S3 · Por qué elegirnos (`1235:291`):**
     - Columna izquierda: Fotografía oficial del equipo técnico especializado (`img/nosotros_equipo_tecnicos.png`, `776x503`).
     - Columna derecha: Titular `H2` "Por qué elegirnos", bajada explicativa y 3 pilares con sus iconos vectoriales oficiales:
       - *Seguridad* (`icon_seguridad.svg`): Técnicos seleccionados con responsabilidad.
       - *Confianza* (`icon_confianza.svg`): Soporte 24/7 disponible.
       - *Calidad* (`icon_calidad.svg`): Especialistas en gasfitería, electricidad, carpintería y línea blanca.
  4. **Frase de Cierre (`1235:315`):**
     - Frase centrada de impacto: *"Tú tienes el problema, nosotros te conectamos con la persona indicada para solucionarlo"* con acento en `#dd3d22`.
  5. **S4 · Cierre / CTA (`1235:316`):**
     - Titular `H2` "Encuentra al técnico que necesitas".
     - Botón primario: `Volver al inicio` (outline translúcido).
     - Botón secundario: `Ver servicios` (fondo blanco, texto `#423f53`).

