# Sitio web — CATIM (UANL-CA-272)

Sitio del Cuerpo Académico Tecnología e Innovación Mecatrónica, FIME-UANL.
Publicado en GitHub Pages. Es un sitio estático (HTML/CSS/JS puro, sin build,
sin dependencias de servidor).

## Estructura del proyecto

```
index.html      → contenido y estructura de todas las secciones
styles.css      → estilos (paleta verde institucional / plateado / blanco)
script.js       → menú móvil, animaciones al hacer scroll, botón "volver arriba"
assets/
  catim-seal.png    → sello del CATIM (navbar, marca de agua del hero, footer, favicon)
  uanl-logo.png      → logo de la UANL
  fime-logo.png      → logo de la FIME
  juan.png, griselda.png, luis.png, erick.png → fotos del cuerpo académico
```

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
se ve en línea. Si algo no se refleja después de un par de minutos, revisa en
la pestaña **Actions** del repositorio si el deploy de Pages falló.

## Limitaciones técnicas conocidas

- **Instagram**: no tiene feed en vivo embebido. Instagram no ofrece, como sí
  lo hace Facebook, un widget público sin necesitar un token del API de Meta.
  Si más adelante lo quieren, la opción más simple sigue siendo un servicio
  gratuito como LightWidget o SnapWidget.
- **Ancho del feed de Facebook**: el widget oficial de Meta ("Page Plugin") no
  siempre estira su contenido interno al 100% del contenedor aunque el
  `<iframe>` sea más ancho — es una limitación del propio widget de Facebook,
  no del sitio.
- **Publicaciones destacadas**: es una selección curada a mano de los perfiles
  de Google Scholar de los 4 integrantes, no una lista generada
  automáticamente — Google Scholar no ofrece un API público gratuito para
  eso, así que hay que revisarla y actualizarla manualmente de vez en cuando.

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
- El ajuste fino de las animaciones vive en `styles.css`, bajo el bloque
  `/* ---------- scroll reveal ---------- */`.
