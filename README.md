# Finca El Progreso — Sitio Web

Sitio web estático (HTML5 + CSS3 + JavaScript puro, sin frameworks) para la finca ganadera "El Progreso".

## Estructura del proyecto

```
finca-el-progreso/
├── index.html          → Todas las secciones: Inicio, Nosotros, Servicios, Productos, Galería, Contacto
├── css/
│   └── styles.css      → Estilos, paleta de colores, responsive
├── js/
│   └── script.js       → Menú móvil, animaciones, formulario simulado
└── README.md
```

## Cómo verlo localmente

Simplemente abre `index.html` en el navegador (doble clic), o usa un servidor local:

```bash
npx serve .
```

## Reemplazar las fotografías

Por ahora las fotos son marcadores de posición (bloques de color con etiqueta). Para usar fotos reales:

1. Coloca tus imágenes en una carpeta `img/` (crear si no existe).
2. En `index.html`, busca los `<div class="photo-frame ph-...">` y reemplázalos por:
   ```html
   <img src="img/nombre-de-tu-foto.jpg" alt="Descripción de la foto" class="photo-frame">
   ```
3. Ajusta en `css/styles.css` la regla `.photo-frame` si necesitas `object-fit: cover;`.

## Publicar en GitHub Pages (gratis)

1. Crea un repositorio en GitHub, por ejemplo `finca-el-progreso`.
2. Sube el contenido de esta carpeta a la raíz del repositorio:
   ```bash
   git init
   git add .
   git commit -m "Sitio web Finca El Progreso"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/finca-el-progreso.git
   git push -u origin main
   ```
3. En GitHub, entra a **Settings → Pages**.
4. En "Branch", selecciona `main` y la carpeta `/root`, luego **Save**.
5. En un par de minutos el sitio estará disponible en:
   `https://TU-USUARIO.github.io/finca-el-progreso/`

## Requisitos técnicos cubiertos

- HTML5 semántico (`header`, `nav`, `main`, `section`, `article`, `footer`).
- CSS3 externo con variables, Grid y Flexbox, responsive (móvil, tablet, escritorio).
- JavaScript externo: menú hamburguesa, scroll suave, resaltado de sección activa, animaciones al hacer scroll, formulario simulado.
- Tipografía moderna vía Google Fonts (Fraunces + Work Sans + Space Mono).
- Paleta de colores acorde a la temática ganadera (verdes de potrero, tonos de cuero/tierra, dorado trigo).
- Mapa de Google Maps incrustado.
- Iconografía en SVG propia (sin dependencias externas de íconos).
