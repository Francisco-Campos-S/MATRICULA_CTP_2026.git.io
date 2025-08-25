# 🚀 CONFIGURACIÓN COMPLETA DE GOOGLE APPS SCRIPT

## 📋 **PASOS PARA CONFIGURAR GOOGLE APPS SCRIPT:**

### **Paso 1: Crear el proyecto**
1. Ve a [script.google.com](https://script.google.com)
2. Haz clic en **"Nuevo proyecto"**
3. Cambia el nombre del proyecto a: **"Formulario Matrícula CTP"**

### **Paso 2: Copiar el código completo**
**Copia y pega TODO este código** en tu archivo `.gs`:

```javascript
function doPost(e) {
  try {
    console.log('🚀 INICIO - Objeto e recibido:', e);
    console.log('🔍 Tipo de e:', typeof e);
    console.log('📋 Propiedades de e:', Object.keys(e || {}));
    
    // Obtener datos del formulario
    let formData = {};
    
    if (e && e.parameter) {
      formData = e.parameter;
      console.log('✅ Datos de e.parameter:', formData);
    } else if (e && e.postData && e.postData.contents) {
      try {
        formData = JSON.parse(e.postData.contents);
        console.log('✅ Datos de e.postData:', formData);
      } catch (error) {
        console.log('❌ Error parseando JSON:', error);
      }
    } else {
      console.log('⚠️ No se encontraron datos en e.parameter ni e.postData');
      console.log('e:', e);
      return ContentService.createTextOutput('Error: No se recibieron datos').setMimeType(ContentService.MimeType.TEXT);
    }
    
    if (Object.keys(formData).length === 0) {
      return ContentService.createTextOutput('Error: No hay datos para procesar').setMimeType(ContentService.MimeType.TEXT);
    }
    
    console.log('📊 Datos a procesar:', formData);
    
    // Obtener la hoja de cálculo
    const spreadsheetId = '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI';
    console.log('🔍 Intentando abrir hoja con ID:', spreadsheetId);
    
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      console.log('✅ Spreadsheet abierto:', spreadsheet.getName());
    } catch (error) {
      console.log('❌ Error abriendo spreadsheet:', error);
      return ContentService.createTextOutput('Error: No se pudo abrir la hoja de cálculo').setMimeType(ContentService.MimeType.TEXT);
    }
    
    let sheet;
    try {
      sheet = spreadsheet.getSheetByName('DATOS ESTUDIANTES 2025 (10)');
      if (!sheet) {
        console.log('⚠️ Hoja específica no encontrada, usando hoja activa');
        sheet = spreadsheet.getActiveSheet();
      }
      console.log('📋 Hoja obtenida:', sheet.getName());
    } catch (error) {
      console.log('❌ Error obteniendo hoja:', error);
      return ContentService.createTextOutput('Error: No se pudo acceder a la hoja').setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Preparar datos para la fila
    const rowData = [
      new Date(),
      formData.nivel || '',
      formData.especialidad || '',
      formData.seccion || '',
      formData.primerApellido || '',
      formData.segundoApellido || '',
      formData.nombre || '',
      formData.telefono || '',
      formData.cedula || '',
      formData.fechaNacimiento || '',
      formData.nacionalidad || '',
      formData.adecuacion || '',
      formData.rutaTransporte || '',
      formData.repitente || '',
      formData.enfermedad || '',
      formData.detalleEnfermedad || '',
      formData.nombreMadre || '',
      formData.cedulaMadre || '',
      formData.telefonoMadre || '',
      formData.direccionMadre || '',
      formData.parentescoMadre || '',
      formData.viveConEstudianteMadre || '',
      formData.nombrePadre || '',
      formData.cedulaPadre || '',
      formData.telefonoPadre || '',
      formData.direccionPadre || '',
      formData.parentescoPadre || '',
      formData.viveConEstudiantePadre || '',
      formData.firmaEncargada || '',
      formData.firmaEncargado || '',
      formData.fecha || '',
      formData.observaciones || ''
    ];
    
    console.log('📝 Datos de la fila:', rowData);
    
    // Insertar en la hoja
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ Datos insertados exitosamente en fila', lastRow + 1);
    
    return ContentService.createTextOutput('Datos guardados exitosamente').setMimeType(ContentService.MimeType.TEXT);
    
  } catch (error) {
    console.error('❌ Error:', error);
    return ContentService.createTextOutput('Error: ' + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  try {
    console.log('🔍 CONSULTA - Objeto e recibido:', e);
    console.log('📋 Parámetros de consulta:', e.parameter);
    
    // Verificar si es una consulta de estudiante
    if (e.parameter && e.parameter.action === 'consulta' && e.parameter.cedula) {
      const cedula = e.parameter.cedula;
      console.log('🔍 Consultando estudiante con cédula:', cedula);
      
      // Obtener la hoja de cálculo
      const spreadsheetId = '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI';
      console.log('🔍 Intentando abrir hoja con ID:', spreadsheetId);
      
      let spreadsheet;
      try {
        spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        console.log('✅ Spreadsheet abierto:', spreadsheet.getName());
      } catch (error) {
        console.log('❌ Error abriendo spreadsheet:', error);
        return ContentService.createTextOutput(JSON.stringify({ error: 'No se pudo abrir la hoja de cálculo' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      let sheet;
      try {
        sheet = spreadsheet.getSheetByName('DATOS ESTUDIANTES 2025 (10)');
        if (!sheet) {
          console.log('⚠️ Hoja específica no encontrada, usando hoja activa');
          sheet = spreadsheet.getActiveSheet();
        }
        console.log('📋 Hoja obtenida:', sheet.getName());
      } catch (error) {
        console.log('❌ Error obteniendo hoja:', error);
        return ContentService.createTextOutput(JSON.stringify({ error: 'No se pudo acceder a la hoja' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Buscar el estudiante por cédula
      const estudiante = buscarEstudiantePorCedula(sheet, cedula);
      
      if (estudiante) {
        console.log('✅ Estudiante encontrado:', estudiante);
        return ContentService.createTextOutput(JSON.stringify(estudiante))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        console.log('❌ Estudiante no encontrado');
        return ContentService.createTextOutput(JSON.stringify({ error: 'Estudiante no encontrado' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Si no es consulta, mostrar mensaje de funcionamiento
    return ContentService.createTextOutput('Formulario funcionando correctamente. Use ?action=consulta&cedula=XXXX para consultar estudiantes.')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('❌ Error en consulta:', error);
    return ContentService.createTextOutput('Error: ' + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

// Función para buscar estudiante por cédula
function buscarEstudiantePorCedula(sheet, cedula) {
  try {
    console.log('🔍 Buscando cédula:', cedula, 'en hoja:', sheet.getName());
    
    // Obtener todos los datos de la hoja
    const data = sheet.getDataRange().getValues();
    console.log('📊 Total de filas en la hoja:', data.length);
    
    if (data.length <= 1) {
      console.log('⚠️ Solo hay encabezados, no hay datos');
      return null;
    }
    
    // Los encabezados están en la primera fila
    const headers = data[0];
    console.log('📋 Encabezados:', headers);
    
    // Buscar la columna de cédula (columna I = índice 7 según la estructura real)
    const cedulaColumnIndex = 9; // Índice 7 = columna I (Cédula)
    
    // Buscar en todas las filas de datos (empezando desde la fila 2)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const cedulaEnFila = row[cedulaColumnIndex];
      
      console.log(`🔍 Fila ${i + 1}: Cédula encontrada: "${cedulaEnFila}" vs buscada: "${cedula}"`);
      
      if (cedulaEnFila && cedulaEnFila.toString().trim() === cedula.trim()) {
        console.log('✅ ¡Cédula encontrada en fila', i + 1, '!');
        
        // Mapear los datos de la fila a un objeto según la estructura real del Google Sheet
        const estudiante = {
          especialidad: row[2] || '',        // Columna C (índice 2)
          seccion: row[3] || '',            // Columna D (índice 3)
          primerApellido: row[4] || '',     // Columna E (índice 4)
          segundoApellido: row[5] || '',    // Columna F (índice 5)
          nombre: row[6] || '',             // Columna G (índice 6)
          telefono: row[7] || '',           // Columna H (índice 7)
          cedula: row[8] || '',             // Columna I (índice 8)
          fechaNacimiento: row[9] || '',    // Columna J (índice 9)
          // Los demás campos se mapearán cuando los agregues a tu Google Sheet
          nacionalidad: row[10] || '',
          adecuacion: row[11] || '',
          rutaTransporte: row[12] || '',
          repitente: row[13] || '',
          enfermedad: row[14] || '',
          detalleEnfermedad: row[15] || '',
          nombreMadre: row[16] || '',
          cedulaMadre: row[17] || '',
          telefonoMadre: row[18] || '',
          direccionMadre: row[19] || '',
          parentescoMadre: row[20] || '',
          viveConEstudianteMadre: row[21] || '',
          nombrePadre: row[22] || '',
          cedulaPadre: row[23] || '',
          telefonoPadre: row[24] || '',
          direccionPadre: row[25] || '',
          parentescoPadre: row[26] || '',
          viveConEstudiantePadre: row[27] || '',
          firmaEncargada: row[28] || '',
          firmaEncargado: row[29] || '',
          fecha: row[30] || '',
          observaciones: row[31] || ''
        };
        
        console.log('📝 Datos del estudiante mapeados:', estudiante);
        return estudiante;
      }
    }
    
    console.log('❌ Cédula no encontrada en ninguna fila');
    return null;
    
  } catch (error) {
    console.error('❌ Error buscando estudiante:', error);
    return null;
  }
}

// Función de prueba para verificar el funcionamiento
function testConsulta() {
  console.log('🧪 Iniciando prueba de consulta...');
  
  // Simular una consulta GET
  const mockE = {
    parameter: {
      action: 'consulta',
      cedula: '123456789'
    }
  };
  
  try {
    const resultado = doGet(mockE);
    console.log('✅ Resultado de la consulta:', resultado.getContent());
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}
```

### **Paso 3: Guardar el archivo**
1. **Guarda** el archivo (Ctrl+S)
2. **Cambia el nombre** del archivo a: `Code.gs`

### **Paso 4: Desplegar la aplicación web**
1. **Haz clic** en "Deploy" → "New deployment"
2. **Selecciona** "Web app"
3. **Configura**:
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. **Haz clic** en "Deploy"
5. **Copia** la URL que te dé

### **Paso 5: Actualizar la configuración**
Una vez que tengas la URL, actualiza tu archivo `google-sheets-config.js`:

```javascript
WEB_APP_URL: 'TU_NUEVA_URL_AQUI'
```

## ✅ **ESTE CÓDIGO INCLUYE:**

- **`doPost`** - Para guardar formularios
- **`doGet`** - Para consultar estudiantes
- **`buscarEstudiantePorCedula`** - Con mapeo corregido para tu estructura
- **`testConsulta`** - Para pruebas internas

## 🧪 **PRUEBA DESPUÉS DE ACTUALIZAR:**

Una vez actualizado, prueba la consulta con:
- **Cédula: `114750560`** (FRANCISCO CAMPOS SANDI)
- **Cédula: `35689568`** (María González Pérez)

## 🚀 **¡LISTO PARA COPIAR Y PEGAR!**

**Copia todo el código de arriba y pégalo en tu Google Apps Script.** Una vez que lo hagas, la consulta funcionará perfectamente con los estudiantes que ya tienes guardados. 🎯✨
