# Formulario de Matrícula 2026 - CTP Agropecuario de Sabalito

Un formulario web moderno y responsivo para la matrícula estudiantil del Colegio Técnico Profesional Agropecuario de Sabalito, diseñado para ser desplegado en GitHub Pages y con integración a Google Sheets.

## 🚀 Características

- **Diseño Moderno**: Interfaz limpia y profesional con colores institucionales
- **Responsivo**: Funciona perfectamente en dispositivos móviles y de escritorio
- **Validación**: Validación en tiempo real de campos requeridos
- **Integración Google Sheets**: Guarda automáticamente los datos en Google Sheets
- **Impresión**: Funcionalidad de impresión optimizada
- **Accesibilidad**: Cumple con estándares de accesibilidad web

## 📋 Campos del Formulario

### Información General de Matrícula
- Nivel
- Especialidad
- Sección

### Datos del Estudiante
- Primer y segundo apellido
- Nombre
- Número de teléfono
- Número de cédula
- Fecha de nacimiento
- Nacionalidad
- Adecuación educativa
- Ruta de transporte
- Condición de repitente
- Información médica

### Datos de la Madre o Encargada
- Nombre completo
- Número de cédula
- Teléfono
- Dirección exacta
- Parentesco
- Vive con el estudiante

### Datos del Padre o Encargado
- Nombre completo
- Número de cédula
- Teléfono
- Dirección
- Parentesco
- Vive con el estudiante

### Declaración y Firmas
- Firma de la encargada
- Firma del encargado
- Fecha
- Observaciones

## 🛠️ Configuración

### 1. Desplegar en GitHub Pages

1. **Crear un repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Formulario de Matrícula 2026"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**
   - Ve a Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Click Save

3. **Tu formulario estará disponible en:**
   ```
   https://TU_USUARIO.github.io/TU_REPOSITORIO
   ```

### 2. Integración con Google Sheets

#### Opción A: Google Apps Script (Recomendado)

1. **Crear una nueva Google Sheet**
   - Ve a [sheets.google.com](https://sheets.google.com)
   - Crea una nueva hoja de cálculo

2. **Configurar Google Apps Script**
   - En tu Google Sheet, ve a Extensions > Apps Script
   - Reemplaza el código por defecto con el siguiente:

```javascript
function doPost(e) {
  try {
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prepare the row data
    const rowData = [
      new Date(), // Timestamp
      data.nivel,
      data.especialidad,
      data.seccion,
      data.primerApellido,
      data.segundoApellido,
      data.nombreEstudiante,
      data.telefonoEstudiante,
      data.cedulaEstudiante,
      data.fechaNacimiento,
      data.nacionalidad,
      data.adecuacion,
      data.rutaTransporte,
      data.repitente,
      data.enfermedad,
      data.detalleEnfermedad,
      data.nombreMadre,
      data.cedulaMadre,
      data.telefonoMadre,
      data.direccionMadre,
      data.parentescoMadre,
      data.viveConEstudianteMadre,
      data.nombrePadre,
      data.cedulaPadre,
      data.telefonoPadre,
      data.direccionPadre,
      data.parentescoPadre,
      data.viveConEstudiantePadre,
      data.firmaEncargada,
      data.firmaEncargado,
      data.fecha,
      data.observaciones
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Formulario de Matrícula - Servidor Activo');
}
```

3. **Configurar encabezados de la hoja**
   - En la primera fila de tu Google Sheet, agrega estos encabezados:
   ```
   Timestamp | Nivel | Especialidad | Sección | Primer Apellido | Segundo Apellido | Nombre | Teléfono | Cédula | Fecha Nacimiento | Nacionalidad | Adecuación | Ruta Transporte | Repitente | Enfermedad | Detalle Enfermedad | Nombre Madre | Cédula Madre | Teléfono Madre | Dirección Madre | Parentesco Madre | Vive con Estudiante Madre | Nombre Padre | Cédula Padre | Teléfono Padre | Dirección Padre | Parentesco Padre | Vive con Estudiante Padre | Firma Encargada | Firma Encargado | Fecha | Observaciones
   ```

4. **Desplegar como aplicación web**
   - Click en Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy
   - Copia la URL de la aplicación web

5. **Actualizar el formulario**
   - En `script.js`, reemplaza `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` con la URL de tu aplicación web

#### Opción B: Google Forms (Alternativa)

1. **Crear un Google Form**
   - Ve a [forms.google.com](https://forms.google.com)
   - Crea un formulario con todos los campos necesarios

2. **Obtener la URL del formulario**
   - Comparte el formulario y copia la URL

3. **Actualizar el formulario**
   - En `script.js`, reemplaza `YOUR_GOOGLE_FORM_URL_HERE` con la URL de tu Google Form

## 📱 Personalización

### Cambiar Colores
Edita `styles.css` para cambiar los colores institucionales:

```css
:root {
  --primary-color: #1e3c72;      /* Azul principal */
  --secondary-color: #2a5298;    /* Azul secundario */
  --accent-color: #ffd700;       /* Dorado */
  --success-color: #28a745;      /* Verde */
  --danger-color: #dc3545;       /* Rojo */
}
```

### Agregar/Quitar Campos
1. Edita `index.html` para agregar/quitar campos
2. Actualiza `script.js` en la función `collectFormData()`
3. Actualiza el Google Apps Script si usas esa opción

## 🔒 Seguridad y Privacidad

- Los datos se envían directamente a Google Sheets
- No se almacenan datos en el servidor web
- Se recomienda configurar permisos de acceso apropiados en Google Sheets
- Considera implementar autenticación si es necesario

## 🚨 Solución de Problemas

### El formulario no envía datos
1. Verifica que la URL de Google Apps Script sea correcta
2. Asegúrate de que la aplicación web esté desplegada
3. Revisa la consola del navegador para errores

### Error de CORS
- Google Apps Script maneja esto automáticamente
- Si persiste, verifica la configuración de la aplicación web

### Los datos no aparecen en Google Sheets
1. Verifica que el Google Apps Script esté funcionando
2. Revisa los logs de ejecución en Google Apps Script
3. Asegúrate de que los encabezados de la hoja coincidan

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación:

1. Revisa los logs de Google Apps Script
2. Verifica la consola del navegador
3. Consulta la documentación de Google Apps Script

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes modificarlo y distribuirlo libremente.

## 🙏 Agradecimientos

- Ministerio de Educación Pública de Costa Rica
- Colegio Técnico Profesional Agropecuario de Sabalito
- Comunidad de desarrolladores web

---

**Nota**: Este formulario está diseñado específicamente para el CTP Agropecuario de Sabalito. Ajusta los campos y validaciones según las necesidades específicas de tu institución.
