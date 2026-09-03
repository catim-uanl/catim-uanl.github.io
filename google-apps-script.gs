/**
 * Código para Google Apps Script — conecta el formulario de contacto
 * del sitio del CATIM con un Google Sheets.
 *
 * CÓMO INSTALARLO (una sola vez):
 * 1. Crea un Google Sheets nuevo (o usa uno que ya tengas para esto).
 * 2. Dentro del Sheets, ve a Extensiones -> Apps Script.
 * 3. Borra el contenido de "Código.gs" y pega TODO este archivo.
 * 4. Arriba a la derecha, clic en "Implementar" -> "Nueva implementación".
 * 5. En "Selecciona el tipo", elige "Aplicación web".
 * 6. En "Ejecutar como", deja "Yo (tu-correo@...)".
 * 7. En "Quién tiene acceso", elige "Cualquier usuario".
 * 8. Clic en "Implementar". Google te va a pedir autorizar permisos
 *    (es tu propio script, es seguro aceptar).
 * 9. Copia la URL que te da ("URL de la aplicación web"). Termina en /exec.
 * 10. Pega esa URL en el archivo script.js del sitio, reemplazando el
 *     texto "PEGA_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT".
 *
 * Cada vez que alguien llene el formulario del sitio, se va a agregar
 * una fila nueva en la primera hoja de este Google Sheets.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var datos = e.parameter;

  // Protección simple contra bots: si el campo oculto "_honey" viene
  // lleno, un humano nunca lo llenaría (está oculto con CSS), así que
  // se ignora la respuesta sin agregar nada al Sheets.
  if (datos["_honey"]) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "ignorado" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Si la hoja está vacía, agrega los encabezados primero.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Fecha",
      "Tema",
      "Nombre",
      "Método de contacto",
      "Correo",
      "WhatsApp",
      "Mensaje",
    ]);
  }

  sheet.appendRow([
    new Date(),
    datos["Tema"] || "",
    datos["Nombre"] || "",
    datos["Método de contacto"] || "",
    datos["Correo"] || "",
    datos["WhatsApp"] || "",
    datos["Mensaje"] || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Función de prueba: abre la URL de la aplicación web directamente en el
   navegador (sin enviar un formulario) para confirmar que el script y los
   permisos quedaron bien instalados. */
function doGet(e) {
  return ContentService.createTextOutput(
    "El script del formulario de contacto del CATIM está funcionando."
  );
}
