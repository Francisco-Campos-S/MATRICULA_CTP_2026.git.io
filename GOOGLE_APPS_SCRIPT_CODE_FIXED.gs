function doPost(e) {
  try {
    console.log('🚀 Iniciando procesamiento de datos...');
    console.log('Objeto e completo:', e);
    
    // VERIFICACIÓN DE SEGURIDAD: Si e es undefined, crear un objeto vacío
    if (!e) {
      console.log('⚠️ ADVERTENCIA: El objeto e es undefined, creando objeto vacío');
      e = {};
    }
    
    // Obtener datos del formulario
    let formData = {};
    
    if (e.parameter) {
      formData = e.parameter;
      console.log('✅ Datos obtenidos de e.parameter:', formData);
    } else if (e.postData && e.postData.contents) {
      try {
        formData = JSON.parse(e.postData.contents);
        console.log('✅ Datos obtenidos de e.postData:', formData);
      } catch (jsonError) {
        console.log('❌ Error parseando JSON:', jsonError);
        formData = {};
      }
    } else {
      console.log('⚠️ No se encontraron datos en e.parameter ni e.postData');
      console.log('e.parameter:', e.parameter);
      console.log('e.postData:', e.postData);
      
      // INTENTAR OBTENER DATOS DE OTRAS FUENTES
      console.log('🔍 Intentando obtener datos de otras fuentes...');
      
      // Verificar si hay datos en el contexto global
      if (typeof e === 'object' && e !== null) {
        console.log('📋 Propiedades disponibles en e:', Object.keys(e));
        
        // Intentar extraer datos de cualquier propiedad disponible
        for (let key in e) {
          if (e.hasOwnProperty(key) && e[key] && typeof e[key] === 'object') {
            console.log(`🔍 Explorando propiedad ${key}:`, e[key]);
            if (e[key].parameter) {
              formData = e[key].parameter;
              console.log('✅ Datos encontrados en e.' + key + '.parameter:', formData);
              break;
            }
          }
        }
      }
      
      if (Object.keys(formData).length === 0) {
        console.log('❌ No se pudieron obtener datos de ninguna fuente');
        return ContentService.createTextOutput('Error: No se recibieron datos del formulario').setMimeType(ContentService.MimeType.TEXT);
      }
    }
    
    // Verificar que tenemos datos
    if (!formData || Object.keys(formData).length === 0) {
      console.log('❌ No hay datos para procesar');
      return ContentService.createTextOutput('Error: No hay datos para procesar').setMimeType(ContentService.MimeType.TEXT);
    }
    
    console.log('📊 Datos a procesar:', formData);
    
    // Obtener la hoja de cálculo
    const spreadsheetId = '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName('DATOS ESTUDIANTES 2025 (10)') || spreadsheet.getActiveSheet();
    
    console.log('📋 Hoja obtenida:', sheet.getName());
    
    // Preparar los datos para la fila
    const rowData = [
      new Date(), // Timestamp
      formData.nivel || '',
      formData.especialidad || '',
      formData.seccion || '',
      formData.primerApellido || '',
      formData.segundoApellido || '',
      formData.nombre || '',                    // ← IMPORTANTE: debe ser 'nombre' no 'nombreEstudiante'
      formData.telefono || '',                 // ← IMPORTANTE: debe ser 'telefono' no 'telefonoEstudiante'
      formData.cedula || '',                   // ← IMPORTANTE: debe ser 'cedula' no 'cedulaEstudiante'
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
    
    console.log('📝 Datos de la fila a insertar:', rowData);
    
    // Insertar la fila en la hoja
    const lastRow = sheet.getLastRow();
    const targetRow = lastRow + 1;
    
    console.log(`📍 Insertando en fila ${targetRow}`);
    
    // Insertar todos los datos en una sola fila
    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ Datos insertados exitosamente en la fila', targetRow);
    
    // Retornar respuesta de éxito
    return ContentService.createTextOutput('Datos guardados exitosamente')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('❌ Error en Google Apps Script:', error);
    console.error('Stack trace:', error.stack);
    
    return ContentService.createTextOutput('Error: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Formulario de Matrícula - Google Apps Script funcionando correctamente')
    .setMimeType(ContentService.MimeType.TEXT);
}
