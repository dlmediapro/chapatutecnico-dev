# Chapa Tu Técnico 🛠️⚡

Plataforma digital para la contratación rápida, segura y transparente de técnicos verificados (electricidad, gasfitería, carpintería, cerrajería, línea blanca y más) en Lima Metropolitana, con soporte de emergencia 24/7.

---

## 🔗 Enlaces Clave

- **🌐 Sitio en Vivo (GitHub Pages):** [https://cela2508.github.io/chapatutecnico/](https://cela2508.github.io/chapatutecnico/)
- **🎨 Diseño en Figma (Fuente de Diseño):** [CHAPA-TU-TECNICO en Figma](https://www.figma.com/design/qg00MT4SVQUrHSM8c58jFt/CHAPA-TU-TECNICO?m=auto&t=UcRT9b8HSTMI72Ax-1)
- **📦 Repositorio en GitHub:** [https://github.com/Cela2508/chapatutecnico](https://github.com/Cela2508/chapatutecnico)
- **📐 Arquitectura y Tokens:** Ver [`DESIGN.md`](DESIGN.md)

---

## 🚀 Inicio Rápido (Desarrollo Local)

El proyecto cuenta con un servidor local de desarrollo ultra-ligero que no requiere instalaciones pesadas en `node_modules` y ofrece recarga automática en vivo (Live Reload):

```bash
# Iniciar el servidor local
npm start
# o: node dev-server.js
```
Abre tu navegador en: **`http://localhost:3000`**

### Abrir Figma desde la Terminal
```bash
npm run figma
```

---

## 📂 Estructura del Proyecto

```text
chapatutecnico/
├── index.html           # Página principal (Home / Inicio dividida por secciones)
├── servicios.html       # Catálogo y filtro de especialidades técnicas
├── electricidad.html    # Ficha de categoría de electricistas
├── solicitud.html       # Flujo interactivo de solicitud de servicio técnico
├── soporte.html         # Centro de ayuda, preguntas frecuentes y reclamos
├── cuenta.html          # Portal de inicio de sesión, registro y cuenta
├── perfil.html          # Ficha y reseñas de técnico verificado
├── layout.js            # Inyección de cabecera (Header/Topbar) y pie (Footer)
├── styles.css           # Tokens de diseño (:root) y reglas CSS globales
├── dev-server.js        # Servidor HTTP local con Live-Reload nativo
├── package.json         # Configuración y comandos de ejecución
├── img/                 # Iconos SVG y multimedia optimizada en WebP/PNG
├── DESIGN.md            # Documentación de diseño, tokens y reglas de UX
└── README.md            # Documentación general
```

---

## 🚀 Despliegue en GitHub Pages

Cualquier cambio confirmado en la rama `main` se publica automáticamente en GitHub Pages en 1 a 2 minutos:

```bash
git checkout main
git merge feature/integracion-diego   # Si estás integrando mejoras
git push origin main
```
