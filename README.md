# Sitio web — CATIM (UANL-CA-272)

Sitio del Cuerpo Académico Tecnología e Innovación Mecatrónica, FIME-UANL.
Publicado en GitHub Pages. Es un sitio estático (HTML/CSS/JS puro, sin build,
sin dependencias de servidor).

## Estructura del proyecto

```
index.html            → contenido y estructura de todas las secciones
styles.css            → estilos (paleta verde institucional / plateado / blanco)
script.js             → menú móvil, carrusel del hero, publicaciones, formulario de contacto, scroll y botón "volver arriba"
google-apps-script.gs → código para conectar el formulario con Google Sheets (ver más abajo)
assets/
  catim-seal.png                → sello del CATIM (navbar, footer, favicon)
  uanl-logo.png, fime-logo.png  → logos institucionales
  juan.png, griselda.png, luis.png, erick.png → fotos del cuerpo académico
  f1.jpg ... f10.jpg            → fotos del carrusel del hero (ver abajo)
```

## Orden de las secciones

Hero → Quiénes somos → Líneas de investigación → Programas educativos →
Misión y Visión → Cuerpo académico → Publicaciones destacadas →
Formas de participar → Contacto.

Ya no existe la sección "Noticias y actividades" ni el widget de Facebook —
se quitaron a petición expresa.

## El carrusel de fotos del hero

El fondo de la primera pantalla es un carrusel automático (cambia cada 5
segundos, con fundido). El texto vive en una franja oscura en la parte
inferior de la foto, para no tapar las caras del resto de la imagen.

Ahora hay **dos sets de fotos independientes**, uno por tipo de pantalla:

- **Computadora / tablet** (pantallas de más de 700px de ancho): usa
  `assets/f1.jpg` … `f10.jpg` — fotos horizontales (apaisadas), las mismas
  de antes.
- **Celular** (pantallas de hasta 700px de ancho): usa `assets/m1.jpg` …
  `m10.jpg` — fotos pensadas para pantalla vertical.

El sitio elige el set correcto una sola vez, al cargar la página (no cambia
si giras el celular después).

### Resolución recomendada para las fotos de celular (`m1.jpg` … `m10.jpg`)

- **1080 × 1920 px** (formato vertical 9:16, el más común en celulares).
- Formato `.jpg`, apuntando a 150–300 KB por foto ya comprimida (herramientas
  gratuitas como [Squoosh](https://squoosh.app) o [TinyPNG](https://tinypng.com)
  hacen esto en segundos).
- Igual que con las de computadora: pon lo importante (caras, letreros) cerca
  del centro vertical de la foto, no pegado arriba ni abajo — el sitio recorta
  más los extremos superior/inferior en pantallas muy altas y angostas.
- No hace falta subir las 10: si falta alguna, el sitio la salta sin error.
  Mientras no subas ninguna `m*.jpg`, el celular simplemente no mostrará
  fondo en el hero (fondo verde sólido) hasta que las agregues.

Para reemplazar o agregar fotos de computadora más adelante, la misma lógica
de antes sigue aplicando:
- Usa el mismo nombre de archivo que quieras sustituir (por ejemplo, sube tu
  nueva foto como `f3.jpg` para reemplazar esa posición del carrusel).
- Deben ser `.jpg`. Si prefieres usar `.png`, avísame o cambia la extensión
  en `index.html` (busca `assets/f1.jpg`, `assets/m1.jpg` y las que le siguen).
- Recomendado para computadora: fotos horizontales, idealmente de al menos
  1600×1000 px.

## Publicaciones destacadas

Se muestran las 5 más recientes; el botón "Ver 5 publicaciones más" despliega
las otras 5 sin necesidad de recargar la página.

**¿Se actualizan solas?** No. Es una selección curada a mano de los perfiles
de Google Scholar de los 4 integrantes — Google Scholar no ofrece un API
público gratuito para conectarlo en automático, así que hay que revisarla y
actualizarla manualmente de vez en cuando (una o dos veces al año es
razonable).

## El formulario de contacto

El formulario (tema de la consulta, nombre, método de contacto preferido y
mensaje) puede guardar cada respuesta como una fila en un **Google Sheets**.
Como el sitio es estático (sin servidor propio), esto se logra con un
**Google Apps Script** — es gratis y no necesita backend ni tarjeta de
crédito, pero sí requiere que hagas una configuración de una sola vez en tu
propia cuenta de Google.

### Cómo activarlo (una sola vez)

1. Crea un Google Sheets nuevo (o usa uno existente para esto).
2. En el Sheets, ve a **Extensiones → Apps Script**.
3. Borra lo que haya en "Código.gs" y pega el contenido completo del
   archivo **`google-apps-script.gs`** que viene junto a este sitio.
4. Arriba a la derecha: **Implementar → Nueva implementación**.
5. Tipo: **Aplicación web**. Ejecutar como: **Yo**. Acceso: **Cualquier
   usuario**.
6. Dale **Implementar** y acepta los permisos que te pida Google (es tu
   propio script, es seguro).
7. Copia la URL que te da (termina en `/exec`).
8. Abre `script.js`, busca el texto `PEGA_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT`
   y reemplázalo por esa URL completa (entre comillas, tal como está).
9. Sube el cambio a GitHub. Listo — cada respuesta del formulario ahora cae
   como fila nueva en tu Google Sheets.

### Mientras no lo actives

Si dejas el texto de ejemplo tal cual (sin pegar tu URL), el formulario
sigue funcionando igual que antes: las respuestas llegan por correo a
`angel.rodriguezln@uanl.edu.mx` a través de [FormSubmit](https://formsubmit.co/)
(la primera vez, FormSubmit manda un correo de confirmación que hay que
abrir y aceptar una sola vez). En cuanto pegues la URL de tu Apps Script,
el sitio deja de usar ese respaldo y empieza a guardar todo en tu Sheets.

## Cómo editar y publicar cambios

Como el sitio ya vive en GitHub Pages, el flujo normal es:

1. Clona el repositorio (o haz `git pull` si ya lo tienes clonado).
2. Edita `index.html`, `styles.css` o `script.js` con cualquier editor.
3. Guarda, y sube el cambio:
   ```
   git add .
   git commit -m "Describe aquí el cambio"
   git push
   ```
4. GitHub Pages reconstruye el sitio automáticamente en uno o dos minutos.

No hay paso de "build": lo que subas a la rama publicada es exactamente lo que
se ve en línea. Si algo no se refleja después de un par de minutos:
- Revisa la pestaña **Actions** del repositorio, por si el deploy de Pages falló.
- Fuerza un refresco sin caché en el navegador (Ctrl+Shift+R / Cmd+Shift+R).
- Los enlaces a `styles.css` y `script.js` en `index.html` llevan un
  parámetro `?v=5` — si vuelves a editar esos archivos y el cambio no se
  refleja, sube ese número (`?v=6`, `?v=7`...) para forzar que el navegador
  descargue la versión nueva en vez de la guardada en caché.

## Colores de marca

- Verde institucional: `#00763D`
- Verde oscuro (hover, títulos): `#01532B`
- Plateado: `#C7CCC9` (variante clara `#F1F2F0`)
- Blanco: `#FFFFFF`

## Notas de diseño

- Tipografía: Source Serif 4 (títulos) + Inter (cuerpo), vía Google Fonts.
- Fotos del equipo en marco circular de doble anillo (verde + plateado), sobre
  fondo degradado — pensado para fotos PNG con transparencia.
- Animaciones de aparición al hacer scroll en la mayoría de las secciones;
  respetan `prefers-reduced-motion` para quienes prefieren menos movimiento.
  El carrusel del hero también respeta esa preferencia: si el sistema del
  visitante pide menos movimiento, se queda fijo en la primera foto.
