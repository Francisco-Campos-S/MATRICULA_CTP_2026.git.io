# 🚀 Configuración de Google Apps Script para el Formulario de Matrícula

## 📋 Pasos para Configurar Google Apps Script

### 1. Crear el Proyecto de Google Apps Script

1. **Ve a [script.google.com](https://script.google.com)**
2. **Haz clic en "Nuevo proyecto"**
3. **Cambia el nombre del proyecto** a "Formulario Matrícula CTP Sabalito"

### 2. Copiar el Código

Reemplaza todo el contenido del editor con este código:

```javascript
function doPost(e) {
  try {
    // Obtener los datos del formulario
    const formData = JSON.parse(e.postData.contents);
    
    // ID de tu Google Sheet (ya configurado)
    const spreadsheetId = '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Preparar los datos para la hoja
    const rowData = [
      formData.timestamp,
      formData.nivel,
      formData.especialidad,
      formData.seccion,
      formData.primerApellido,
      formData.segundoApellido,
      formData.nombreEstudiante,
      formData.telefonoEstudiante,
      formData.cedulaEstudiante,
      formData.fechaNacimiento,
      formData.nacionalidad,
      formData.adecuacion,
      formData.rutaTransporte,
      formData.repitente,
      formData.enfermedad,
      formData.detalleEnfermedad,
      formData.nombreMadre,
      formData.cedulaMadre,
      formData.telefonoMadre,
      formData.direccionMadre,
      formData.parentescoMadre,
      formData.viveConEstudianteMadre,
      formData.nombrePadre,
      formData.cedulaPadre,
      formData.telefonoPadre,
      formData.direccionPadre,
      formData.parentescoPadre,
      formData.viveConEstudiantePadre,
      formData.firmaEncargada,
      formData.firmaEncargado,
      formData.fecha,
      formData.observaciones
    ];
    
    // Agregar la fila a la hoja
    sheet.appendRow(rowData);
    
    // Retornar respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar error
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Formulario de Matrícula CTP Sabalito - Servidor Activo');
}

// Función para probar la conexión
function testConnection() {
  try {
    const spreadsheetId = '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    Logger.log('✅ Conexión exitosa con Google Sheets');
    Logger.log('📊 Nombre de la hoja: ' + sheet.getName());
    return true;
  } catch (error) {
    Logger.log('❌ Error de conexión: ' + error.toString());
    return false;
  }
}
```

### 3. Configurar el Despliegue

1. **Haz clic en "Implementar" (Deploy)**
2. **Selecciona "Nueva implementación"**
3. **Configura los siguientes parámetros:**
   - **Tipo**: Aplicación web
   - **Ejecutar como**: Yo
   - **Quién tiene acceso**: Cualquier persona
4. **Haz clic en "Implementar"**
5. **Autoriza la aplicación** cuando se te solicite

### 4. Obtener la URL del Web App

1. **Después del despliegue, copia la URL del Web App**
2. **La URL se verá así:**
   ```
   https://script.google.com/macros/s/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/exec
   ```

### 5. Actualizar la Configuración

1. **Abre el archivo `assets/js/google-sheets-config.js`**
2. **Reemplaza `YOUR_SCRIPT_ID` con el ID de tu script**
3. **El ID es la parte larga de la URL entre `/s/` y `/exec`**

```javascript
// Ejemplo:
WEB_APP_URL: 'https://script.google.com/macros/s/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/exec'
```

### 6. Probar la Configuración

1. **Abre la consola del navegador (F12)**
2. **Llena y envía el formulario**
3. **Verifica que aparezca el mensaje: "✅ Datos enviados a Google Apps Script"**
4. **Revisa tu Google Sheet para confirmar que los datos se agregaron**

## 🔧 Solución de Problemas

### Error: "No se puede acceder a la hoja de cálculo"

**Solución:**
1. Asegúrate de que la hoja de cálculo sea accesible
2. Verifica que el ID de la hoja sea correcto
3. Ejecuta la función `testConnection()` en Google Apps Script

### Error: "No se puede analizar JSON"

**Solución:**
1. Verifica que el formulario esté enviando datos válidos
2. Revisa la consola del navegador para errores
3. Asegúrate de que todos los campos requeridos estén completos

### Error: "Permiso denegado"

**Solución:**
1. Verifica que la aplicación web esté configurada como "Cualquier persona"
2. Asegúrate de haber autorizado la aplicación
3. Revisa los permisos de la cuenta de Google

## 📊 Verificar los Datos

1. **Abre tu Google Sheet**
2. **Verifica que los encabezados coincidan con los campos del formulario**
3. **Los datos deberían aparecer en nuevas filas cada vez que se envía el formulario**

## 🎯 Campos del Formulario

El formulario envía los siguientes campos en este orden:

1. Timestamp
2. Nivel
3. Especialidad
4. Sección
5. Primer Apellido
6. Segundo Apellido
7. Nombre Estudiante
8. Teléfono Estudiante
9. Cédula Estudiante
10. Fecha Nacimiento
11. Nacionalidad
12. Adecuación
13. Ruta Transporte
14. Repitente
15. Enfermedad
16. Detalle Enfermedad
17. Nombre Madre
18. Cédula Madre
19. Teléfono Madre
20. Dirección Madre
21. Parentesco Madre
22. Vive con Estudiante Madre
23. Nombre Padre
24. Cédula Padre
25. Teléfono Padre
26. Dirección Padre
27. Parentesco Padre
28. Vive con Estudiante Padre
29. Firma Encargada
30. Firma Encargado
31. Fecha
32. Observaciones

## 🔒 Seguridad

- Los datos se envían directamente a Google Sheets
- No se almacenan en servidores externos
- Se recomienda configurar permisos de acceso apropiados en Google Sheets
- Considera implementar autenticación si es necesario

---

**¡Con esta configuración, tu formulario estará completamente funcional! 🎉**
