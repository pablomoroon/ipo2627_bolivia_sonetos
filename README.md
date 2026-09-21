# Sonetos — estructura adaptada

Versión reconstruida a partir del lector anterior y de la captura de carpetas. No contiene modificaciones privadas de tus archivos originales: solo se recibió una imagen. Los poemas son transcripciones de las fuentes enlazadas en cada Markdown.

## Abrir en localhost
1. Abre una terminal dentro de `ipo2627_bolivia_sonetos` (la carpeta que contiene los poemas .md).
2. Ejecuta `py -m http.server 8000` en Windows, o `python3 -m http.server 8000` en macOS/Linux.
3. Abre http://localhost:8000/sonetos/
4. Para detener el servidor: Ctrl+C.

No arranques el servidor dentro de la subcarpeta `sonetos`: los poemas están un nivel por encima y deben ser accesibles. Los módulos y fetch requieren HTTP; no abras index.html con doble clic.

## Organización y MVC
- sonetos/index.html: estructura semántica y vinculación a CSS y módulo principal.
- sonetos/css/soneto.css: color, tipografía y espacio, en secciones comentadas.
- sonetos/data/index.js: catálogo de títulos, autores, fuentes y rutas.
- sonetos/data/main.js: carga, interpretación, validación y estado del modelo. No accede al DOM.
- sonetos/js/main.js: clases independientes de vista y controlador, más inicialización.
- sonetos/js/header.js: carga del fragmento de cabecera con alternativa si falla.
- sonetos/components/header.html: fragmento de cabecera utilizado.
- sonetos/header.html: copia de compatibilidad con la estructura de la captura; para modificar la cabecera usada, edita components/header.html.
- Los cinco .md de la raíz contienen los poemas, con título, autor, cuatro estrofas y fuente.

## Diseño
Paleta monocromática azul. Georgia para poesía y titulares; Arial para controles. Unidades rem, Grid adaptable, agrupación por proximidad y región común. Clases CSS para estilo y atributos data-* para JS. La vista inserta poemas con textContent, y usa aria-current y disabled para coordinar DOM y estilos. Acceso por teclado, foco visible, enlace de salto y estados de carga/error.

Para editar un poema conserva las cuatro estrofas 4/4/3/3, separadas por una línea en blanco. Para añadir uno crea un .md en la raíz y registra sus metadatos en data/index.js.
