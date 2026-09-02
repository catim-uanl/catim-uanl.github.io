# Sitio web — CATIM (UANL-CA-272)

Sitio estático (HTML/CSS/JS puro, sin build). Archivos:

- `index.html` — contenido y estructura.
- `styles.css` — estilos (paleta verde/plateado/blanco).
- `script.js` — solo abre/cierra el menú en móvil.
- `assets/` — logos y fotos reales:
  - `catim-seal.png`, `uanl-logo.png`, `fime-logo.png` (los que subiste, con fondo transparente donde aplicaba)
  - `juan.jpg`, `griselda.jpg`, `luis.jpg`, `erick.jpg` — las fotos que enviaste, ya con un fondo plateado degradado (las originales eran PNG transparentes; les puse fondo para que se vean uniformes en las tarjetas del equipo)

## Cómo verlo localmente
Abre `index.html` en el navegador. No necesita servidor.

## Cómo publicarlo
- **GitHub Pages**: sube la carpeta completa (incluyendo `assets/`) a un repo y activa Pages.
- **Netlify / Vercel**: arrastra la carpeta completa a su panel.
- **Hosting de la UANL/FIME**: sube todo por FTP manteniendo la estructura de carpetas.

## Cambios de esta vuelta
- Se quitó la sección "Qué hacemos" y el párrafo largo del hero (queda solo un badge corto: "Cuerpo académico consolidado · Registro UANL-CA-272 · PRODEP-SEP").
- "Programas educativos" ahora está agrupado en Posgrado / Licenciatura en vez de una lista plana.
- Se quitó la frase con guiones largos en "Líneas de investigación" y la frase introductoria de "Publicaciones destacadas".
- Publicaciones: ahora son 10, ordenadas de la más reciente (2026) a la más antigua, cubriendo a los 4 integrantes.
- Noticias: solo Facebook (en vivo, sin necesitar token). Instagram se quitó por ahora, como pediste.
- Formas de participar: cada tarjeta tiene una etiqueta (Licenciatura / Posgrado / Vinculación) y los términos clave en negritas para escanear más rápido.
- Fotos y logos reales integrados en todo el sitio (navbar, hero, equipo, footer).

## Pendiente / a considerar
- **Instagram**: como se quitó "por ahora", cuando quieras reactivarlo la opción más simple sigue siendo un widget como LightWidget o SnapWidget (gratuitos), ya que Instagram no ofrece un embed público sin token del API de Meta (Facebook sí lo ofrece, por eso ese widget funciona solo).
- **Publicaciones**: es una selección curada de los perfiles de Google Scholar de los 4 integrantes — no hay forma de generarla 100% automática sin revisarla manualmente cada semestre, ya que Google Scholar no tiene un API público gratuito.

## Colores usados
- Verde institucional: `#00763D`
- Verde oscuro (hover, títulos): `#01532B`
- Plateado: `#C7CCC9` (variante clara `#F1F2F0`)
- Blanco: `#FFFFFF`
