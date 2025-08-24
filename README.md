# Formulario de Matrícula 2026 - CTP Agropecuario de Sabalito

Este es un formulario web moderno y responsivo para la matrícula estudiantil del Colegio Técnico Profesional Agropecuario de Sabalito.

## 🚀 Características

- **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y de escritorio
- **Validación de Formularios**: Validación en tiempo real de campos requeridos
- **Integración con Google Sheets**: Los datos se envían automáticamente a Google Sheets
- **Interfaz Moderna**: Diseño atractivo con gradientes y animaciones
- **Funcionalidad de Impresión**: Botón para imprimir el formulario
- **Exportación CSV**: Opción para descargar los datos en formato CSV

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
- Adecuación curricular
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

## ⚙️ Configuración de Google Sheets

### Opción 1: Google Apps Script (Recomendado)

1. **Crear un nuevo proyecto en Google Apps Script**:
   - Ve a [script.google.com](https://script.google.com)
   - Crea un nuevo proyecto
   - Copia el siguiente código:

```javascript
function doPost(e) {
  try {
    // Obtener los datos del formulario
    const formData = JSON.parse(e.postData.contents);
    
    // ID de tu Google Sheet
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
  return ContentService.createTextOutput('Formulario de Matrícula CTP Sabalito');
}
```

2. **Configurar el despliegue**:
   - Haz clic en "Deploy" > "New deployment"
   - Selecciona "Web app"
   - Configura el acceso como "Anyone"
   - Copia la URL del web app

3. **Actualizar el JavaScript**:
   - En `assets/js/script.js`, reemplaza `YOUR_SCRIPT_ID` con el ID de tu script

### Opción 2: Google Forms

1. **Crear un Google Form** con todos los campos necesarios
2. **Obtener la URL del formulario**
3. **Actualizar el JavaScript** con la URL del formulario

## 🎨 Personalización

### Colores
Los colores principales se pueden modificar en `assets/css/styles.css`:
- Color principal: `#1e3c72`
- Color secundario: `#2a5298`
- Color de acento: `#ffd700`
- Color de éxito: `#28a745`

### Fuentes
El formulario usa la fuente Roboto de Google Fonts. Puedes cambiarla modificando la importación en el HTML.

## 📱 Responsive Design

El formulario está optimizado para:
- **Desktop**: 1200px y superior
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Menos de 480px

## 🖨️ Funcionalidad de Impresión

El formulario incluye estilos específicos para impresión que ocultan elementos innecesarios y optimizan el layout para papel.

## 🔧 Solución de Problemas

### El formulario no envía datos
1. Verifica que la URL de Google Apps Script sea correcta
2. Asegúrate de que el script tenga permisos de escritura en Google Sheets
3. Revisa la consola del navegador para errores

### Problemas de validación
1. Verifica que todos los campos requeridos estén completos
2. Los números de teléfono deben tener 8 dígitos
3. Los números de cédula deben tener 9 dígitos

### Problemas de estilo
1. Verifica que los archivos CSS y JS estén en las carpetas correctas
2. Limpia la caché del navegador
3. Verifica que no haya conflictos con otros estilos

## 📞 Soporte

Para soporte técnico o preguntas sobre el formulario, contacta a:
- **Email**: contacto@ctpsabalito.edu.cr
- **Colegio**: CTP Agropecuario de Sabalito

## 📄 Licencia

Este proyecto está desarrollado para el uso exclusivo del Colegio Técnico Profesional Agropecuario de Sabalito.

---

**Desarrollado con ❤️ para la comunidad educativa de Sabalito**
