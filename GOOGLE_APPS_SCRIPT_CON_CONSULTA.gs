// Función para convertir fecha de formato dd/MM/yyyy a yyyy-MM-dd
function convertirFecha(fechaString) {
  try {
    // Si ya está en formato yyyy-MM-dd, devolverlo tal como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
      return fechaString;
    }
    
    // Si está en formato dd/MM/yyyy o dd/M/yyyy, convertir
    const partes = fechaString.split('/');
    if (partes.length === 3) {
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const año = partes[2];
      return `${año}-${mes}-${dia}`;
    }
    
    // Si no se puede convertir, devolver la fecha original
    return fechaString;
  } catch (error) {
    console.log('Error convirtiendo fecha:', error);
    return fechaString;
  }
}

// Función para mapear tipo de identificación a valores del HTML
function mapearTipoIdentificacion(tipo) {
  const mapeo = {
    'CÉDULA': 'Cédula',
    'Cédula': 'Cédula',
    'YÍS RÖ - IDENTIFICACIÓN MEP': 'YR',
    'YR': 'YR',
    'DIMEX': 'DIMEX',
    'Dimex': 'DIMEX'
  };
  
  return mapeo[tipo] || tipo;
}

// Función para mapear discapacidad a valores del HTML
function mapearDiscapacidad(discapacidad) {
  const mapeo = {
    'SIN DISCAPACIDAD': 'Sin discapacidad',
    'Sin discapacidad': 'Sin discapacidad',
    'BAJA VISIÓN': 'Baja Visión',
    'Baja Visión': 'Baja Visión',
    'CEGUERA': 'Ceguera',
    'Ceguera': 'Ceguera',
    'DISCAPACIDAD INTELECTUAL': 'Discapacidad Intelectual (Retraso Mental)',
    'DISCAPACIDAD MOTORA': 'Discapacidad motora',
    'DISCAPACIDAD MÚLTIPLE': 'Discapacidad Múltiple (Multidiscapacidad o Retos Múltiples)'
  };
  
  return mapeo[discapacidad] || discapacidad;
}

function doPost(e) {
  try {
    console.log('🚀 INICIO - Guardando nueva matrícula...');
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
    console.log('🔍 Tipo de matrícula recibido:', formData.tipoMatricula);
    console.log('🔍 Todos los datos recibidos:', Object.keys(formData));
    console.log('🔍 Verificando campos críticos:');
    console.log('   - numeroIdentificacion:', formData.numeroIdentificacion);
    console.log('   - primerApellido:', formData.primerApellido);
    console.log('   - nombre:', formData.nombre);
    console.log('   - nivel:', formData.nivel);
    console.log('   - especialidad:', formData.especialidad);
    console.log('   - seccion:', formData.seccion);
    
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
    
    // DETERMINAR LA HOJA DESTINO SEGÚN EL TIPO DE MATRÍCULA
    let hojaDestino;
    let nombreHoja;
    
    // Verificar el tipo de matrícula recibido
    if (formData.tipoMatricula === 'regular') {
      nombreHoja = 'REGULAR CTP 2026';
      console.log('✅ Tipo de matrícula: REGULAR');
    } else if (formData.tipoMatricula === 'planNacional') {
      nombreHoja = 'PLAN NACIONAL 2026';
      console.log('✅ Tipo de matrícula: PLAN NACIONAL');
    } else {
      // Por defecto, usar REGULAR CTP 2026
      nombreHoja = 'REGULAR CTP 2026';
      console.log('⚠️ Tipo de matrícula no especificado, usando REGULAR CTP 2026 por defecto');
    }
    
    console.log('🎯 Enviando matrícula a la hoja:', nombreHoja);
    
    // VERIFICAR SI YA EXISTE UNA MATRÍCULA CON LA MISMA CÉDULA
    const cedulaEstudiante = formData.numeroIdentificacion;
    if (cedulaEstudiante) {
      console.log(`🔍 Verificando si ya existe matrícula para cédula: ${cedulaEstudiante}`);
      
      // Buscar en la hoja destino si ya existe
      let hojaExistente = spreadsheet.getSheetByName(nombreHoja);
      if (hojaExistente) {
        const dataExistente = hojaExistente.getDataRange().getValues();
        if (dataExistente.length > 1) {
          // Buscar en la primera columna (Número de identificación)
          for (let i = 1; i < dataExistente.length; i++) {
            if (dataExistente[i][0] === cedulaEstudiante) {
              console.log(`⚠️ Ya existe una matrícula para la cédula ${cedulaEstudiante} en ${nombreHoja}`);
              return ContentService.createTextOutput(`Ya existe una matrícula para la cédula ${cedulaEstudiante} en ${nombreHoja}`).setMimeType(ContentService.MimeType.TEXT);
            }
          }
        }
      }
      console.log(`✅ No se encontraron duplicados para cédula: ${cedulaEstudiante}`);
    }
    
    // BUSCAR O CREAR LA HOJA DESTINO
    try {
      hojaDestino = spreadsheet.getSheetByName(nombreHoja);
      if (!hojaDestino) {
        console.log(`⚠️ Hoja "${nombreHoja}" no encontrada, creando nueva hoja...`);
        hojaDestino = spreadsheet.insertSheet(nombreHoja);
        console.log(`✅ Nueva hoja "${nombreHoja}" creada exitosamente`);
      } else {
        console.log(`✅ Hoja "${nombreHoja}" ya existe`);
      }
      
      // ESTRUCTURA DE COLUMNAS PARA ENVÍO DE MATRÍCULA (41 columnas)
      const headers = [
        'Timestamp',                   // Columna A (0) - Timestamp
        'Número Secuencial',           // Columna B (1) - Número secuencial
        'Número de identificación',    // Columna C (2) - Cédula del estudiante
        'Tipo de identificación',      // Columna D (3) - Tipo de cédula
        'Primer apellido',             // Columna E (4) - Primer apellido
        'Segundo apellido',            // Columna F (5) - Segundo apellido
        'Nombre',                      // Columna G (6) - Nombre
        'Fecha de nacimiento',         // Columna H (7) - Fecha de nacimiento
        'Edad',                        // Columna I (8) - Edad calculada
        'Identidad de género',         // Columna J (9) - Identidad de género
        'Nacionalidad',                // Columna K (10) - Nacionalidad
        'Repitente',                   // Columna L (11) - Repitente
        'Refugiado',                   // Columna M (12) - Refugiado
        'Discapacidad',                // Columna N (13) - Discapacidad
        'Tipo de Discapacidad',        // Columna O (14) - Tipo de Discapacidad
        'Adecuación',                  // Columna P (15) - Adecuación
        'Tipo de Adecuación',          // Columna Q (16) - Tipo de Adecuación
        'Tipo de Enfermedad',          // Columna R (17) - Tipo de Enfermedad (antes "Enfermedad")
        'Especialidad',                // Columna S (18) - Especialidad
        'Nivel',                       // Columna T (19) - Nivel
        'Sección',                     // Columna U (20) - Sección
        'Ruta de transporte',          // Columna V (21) - Ruta de transporte
        'Título',                      // Columna W (22) - Título
        'Celular estudiante',          // Columna X (23) - Celular estudiante
        'Encargada',                   // Columna Y (24) - Encargada
        'Cédula',                      // Columna Z (25) - Cédula de la madre
        'Celular',                     // Columna AA (26) - Celular de la madre
        'Parentesco',                  // Columna AB (27) - Parentesco
        'Vive con estud',              // Columna AC (28) - Vive con estudiante (Madre)
        'Dirección exacta',            // Columna AD (29) - Dirección exacta
        'Encargado',                   // Columna AE (30) - Encargado
        'Cédula2',                     // Columna AF (31) - Cédula del padre
        'Celular2',                    // Columna AG (32) - Celular del padre
        'Parentezco2',                 // Columna AH (33) - Parentesco del padre
        'Vive con estud 2',            // Columna AI (34) - Vive con estudiante (Padre)
        'Otro Cel',                    // Columna AJ (35) - Otro celular
        'Dirección2',                  // Columna AK (36) - Dirección del padre
        'MOVIMIENTO'                   // Columna AL (37) - Movimiento
      ];
      
      // VERIFICAR Y ACTUALIZAR HEADERS SIN ELIMINAR DATOS EXISTENTES
      console.log(`🔄 Verificando headers en hoja "${nombreHoja}"...`);
      
      // Verificar si la hoja está completamente vacía (recién creada)
      const isHojaNueva = hojaDestino.getLastRow() === 0;
      console.log(`🔍 ¿Es una hoja nueva? ${isHojaNueva ? 'SÍ' : 'NO'}`);
      
      if (isHojaNueva) {
        console.log(`📝 Hoja nueva detectada, insertando headers con ${headers.length} columnas...`);
        hojaDestino.getRange(1, 1, 1, headers.length).setValues([headers]);
        console.log(`✅ Headers insertados en hoja nueva "${nombreHoja}" con ${headers.length} columnas`);
        console.log(`🔍 Verificando que la columna W sea "Ruta de transporte":`, headers[22]);
      } else {
        // Obtener headers actuales
        const headersActuales = hojaDestino.getRange(1, 1, 1, hojaDestino.getLastColumn()).getValues()[0];
        console.log(`📊 Headers actuales: ${headersActuales.length}, Headers correctos: ${headers.length}`);
        console.log(`📋 Headers actuales:`, headersActuales);
        
        // Verificar si los headers son correctos
        const headersCorrectos = headersActuales.length === headers.length && 
                                 headersActuales.every((header, index) => header === headers[index]);
        
        if (!headersCorrectos) {
          console.log(`⚠️ Headers incorrectos, actualizando solo la primera fila...`);
          
          // Solo actualizar la primera fila (headers) sin tocar los datos
          hojaDestino.getRange(1, 1, 1, headers.length).setValues([headers]);
          console.log(`✅ Headers actualizados en hoja "${nombreHoja}" con ${headers.length} columnas`);
          console.log(`🔍 Verificando que la columna W sea "Ruta de transporte":`, headers[22]);
        } else {
          console.log(`✅ Headers ya son correctos en hoja "${nombreHoja}" con ${headers.length} columnas`);
        }
        
        // VERIFICACIÓN ADICIONAL: Si la hoja no tiene la columna "Ruta de transporte", forzar actualización
        if (headersActuales.length < 23 || headersActuales[22] !== 'Ruta de transporte') {
          console.log(`⚠️ Columna "Ruta de transporte" no encontrada, forzando actualización...`);
          hojaDestino.getRange(1, 1, 1, headers.length).setValues([headers]);
          console.log(`✅ Headers forzados a actualización en hoja "${nombreHoja}"`);
        }
        
        // FORZAR ACTUALIZACIÓN: Si la hoja tiene más de 39 columnas, eliminar las columnas extra
        const columnasActuales = hojaDestino.getLastColumn();
        if (columnasActuales > headers.length) {
          console.log(`⚠️ Hoja tiene ${columnasActuales} columnas, eliminando columnas extra...`);
          const columnaInicio = headers.length + 1;
          const columnasAEliminar = columnasActuales - headers.length;
          hojaDestino.deleteColumns(columnaInicio, columnasAEliminar);
          console.log(`✅ Eliminadas ${columnasAEliminar} columnas extra de la hoja "${nombreHoja}"`);
        }
      }
      
      // Verificar que se actualizaron correctamente
      const headersVerificados = hojaDestino.getRange(1, 1, 1, headers.length).getValues()[0];
      console.log(`🔍 Headers verificados:`, headersVerificados);
      console.log(`✅ Hoja destino obtenida: ${hojaDestino.getName()}`);
      console.log(`🔍 Verificando que la hoja destino no sea null:`, hojaDestino ? 'NO ES NULL' : 'ES NULL');
      console.log(`🔍 Nombre de la hoja destino:`, hojaDestino ? hojaDestino.getName() : 'NULL');
    } catch (error) {
      console.log('❌ Error obteniendo hoja destino:', error);
      return ContentService.createTextOutput(`Error: No se pudo acceder a la hoja ${nombreHoja}`).setMimeType(ContentService.MimeType.TEXT);
    }
    
    // PREPARAR DATOS PARA LA FILA CON 41 COLUMNAS EN EL ORDEN EXACTO
    // Orden según rowData (39 elementos con índices 0-38):
    // 0. Timestamp
    // 1. Número Secuencial
    // 2. Número de identificación
    // 3. Tipo de identificación
    // 4. Primer apellido
    // 5. Segundo apellido
    // 6. Nombre
    // 7. Fecha de nacimiento
    // 8. Edad
    // 9. Identidad de género
    // 10. Nacionalidad
    // 11. Repitente
    // 12. Refugiado
    // 13. Discapacidad
    // 14. Tipo de Discapacidad
    // 15. Adecuación
    // 16. Tipo de Adecuación
    // 17. Enfermedad
    // 18. Tipo de Enfermedad
    // 19. Especialidad
    // 20. Nivel
    // 21. Sección
    // 22. Ruta de transporte
    // 23. Título
    // 24. Celular estudiante
    // 25. Encargada
    // 26. Cédula (Madre)
    // 27. Celular (Madre)
    // 28. Parentesco (Madre)
    // 29. Vive con estud (Madre)
    // 30. Dirección exacta
    // 31. Encargado
    // 32. Cédula2 (Padre)
    // 33. Celular2 (Padre)
    // 34. Parentezco2 (Padre)
    // 35. Vive con estud 2 (Padre) ✅ NUEVO
    // 36. Otro Cel
    // 37. Dirección2
    // 38. MOVIMIENTO
    
    // Obtener el siguiente número secuencial para esta hoja
    let siguienteNumero = 1;
    const lastRow = hojaDestino.getLastRow();
    console.log(`📊 Última fila en hoja "${nombreHoja}": ${lastRow}`);
    
    if (lastRow > 1) {
        // Si hay datos (más de 1 fila = header + datos), el siguiente número es la última fila
        siguienteNumero = lastRow;
        console.log(`📊 Hoja con datos existentes, siguiente número: ${siguienteNumero}`);
    } else if (lastRow === 1) {
        // Si solo hay header (1 fila), el siguiente número es 1
        siguienteNumero = 1;
        console.log(`📊 Hoja solo con header, siguiente número: ${siguienteNumero}`);
    } else {
        // Si está completamente vacía (0 filas), el siguiente número es 1
        siguienteNumero = 1;
        console.log(`📊 Hoja vacía, siguiente número: ${siguienteNumero}`);
    }
    
    // Obtener fecha y hora actual en formato legible
    const ahora = new Date();
    const timestamp = Utilities.formatDate(ahora, 'America/Costa_Rica', 'dd/MM/yyyy HH:mm:ss');
    
    const rowData = [
      timestamp,                                    // 0. Timestamp
      siguienteNumero,                              // 1. Número Secuencial
      formData.numeroIdentificacion || '',          // 2. Número de identificación
      formData.tipoIdentificacion || 'CÉDULA',      // 3. Tipo de identificación
      formData.primerApellido || '',                // 4. Primer apellido
      formData.segundoApellido || '',               // 5. Segundo apellido
      formData.nombre || '',                        // 6. Nombre
      formData.fechaNacimiento || '',               // 7. Fecha de nacimiento
      formData.edad || '',                          // 8. Edad (calculada automáticamente)
      '',                                          // 9. Identidad de género (vacío)
      formData.nacionalidad || '',                  // 10. Nacionalidad
      formData.repitente || '',                     // 11. Repitente
      '',                                          // 12. Refugiado (vacío)
      formData.discapacidad || '',                  // 13. Discapacidad
      '',                                          // 14. Tipo de Discapacidad (vacío)
      formData.adecuacion || '',                    // 15. Adecuación
      '',                                          // 16. Tipo de Adecuación (vacío)
      formData.enfermedad || '',                    // 17. Tipo de Enfermedad (antes "Enfermedad")
      formData.especialidad || '',                  // 18. Especialidad
      formData.nivel || '',                         // 19. Nivel
      formData.seccion || '',                       // 20. Sección
      formData.rutaTransporte || '',                // 21. Ruta de transporte
      '',                                          // 22. Título (vacío)
      formData.celularEstudiante || '',             // 23. Celular estudiante
      formData.encargada || '',                     // 24. Encargada
      formData.cedula || '',                        // 25. Cédula
      formData.celular || '',                       // 26. Celular
      formData.parentesco || '',                    // 27. Parentesco
      formData.viveConEstudiante || '',             // 28. Vive con estud (Madre)
      formData.direccionExacta || '',               // 29. Dirección exacta
      formData.encargado || '',                     // 30. Encargado (Padre)
      formData.cedula2 || '',                       // 31. Cédula2 (Padre)
      formData.celular2 || '',                      // 32. Celular2 (Padre)
      formData.parentezco2 || '',                   // 33. Parentezco2 (Padre)
      formData.viveConEstudiante2 || '',            // 34. Vive con estud 2 (Padre)
      formData.otroCel || '',                       // 35. Otro Cel
      formData.direccion2 || '',                    // 36. Dirección2 (Padre)
      'NUEVA MATRÍCULA 2026'                       // 37. MOVIMIENTO
    ];
    
    console.log(`📝 Datos de la fila para ${nombreHoja}:`, rowData);
    console.log(`📊 Total de columnas: ${rowData.length}`);
    console.log(`🔍 Verificando que la hoja "${nombreHoja}" existe antes de insertar...`);
    console.log(`🔍 Hoja destino válida:`, hojaDestino ? 'SÍ' : 'NO');
    console.log(`🔍 Nombre de la hoja destino:`, hojaDestino ? hojaDestino.getName() : 'NULL');
    
    // Verificar que la hoja existe antes de insertar
    if (!hojaDestino) {
      console.log('❌ ERROR: La hoja destino es null');
      return ContentService.createTextOutput(`Error: No se pudo acceder a la hoja ${nombreHoja}`).setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Insertar en la hoja destino
    console.log(`📊 Número secuencial calculado: ${siguienteNumero}`);
    console.log(`📊 Timestamp generado: ${timestamp}`);
    console.log(`📊 Insertando en fila: ${lastRow + 1}`);
    
    // Verificar que rowData no esté vacío
    if (!rowData || rowData.length === 0) {
      console.log('❌ ERROR: rowData está vacío');
      return ContentService.createTextOutput(`Error: No hay datos para insertar`).setMimeType(ContentService.MimeType.TEXT);
    }
    
    try {
      console.log(`🔄 Intentando insertar en fila ${lastRow + 1} con ${rowData.length} columnas...`);
      hojaDestino.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);
      console.log(`✅ Nueva matrícula insertada exitosamente en hoja "${nombreHoja}" fila ${lastRow + 1}`);
      
      // Verificar que se insertó correctamente
      const filaInsertada = hojaDestino.getRange(lastRow + 1, 1, 1, rowData.length).getValues()[0];
      console.log(`🔍 Verificación: Fila insertada:`, filaInsertada);
      console.log(`🔍 Verificando que la hoja "${nombreHoja}" sigue existiendo después de insertar:`, spreadsheet.getSheetByName(nombreHoja) ? 'SÍ' : 'NO');
      
      return ContentService.createTextOutput(`Matrícula guardada exitosamente en ${nombreHoja}`).setMimeType(ContentService.MimeType.TEXT);
    } catch (insertError) {
      console.error('❌ Error insertando datos:', insertError);
      console.error('❌ Detalles del error:', insertError.toString());
      console.error('❌ Stack trace:', insertError.stack);
      return ContentService.createTextOutput(`Error al insertar datos en ${nombreHoja}: ${insertError.toString()}`).setMimeType(ContentService.MimeType.TEXT);
    }
    
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
      
      // BUSCAR EN LA HOJA "BASE 2025" PARA CONSULTAS
      let sheetBase;
      try {
        console.log('🔍 Buscando hoja "BASE 2025"...');
        sheetBase = spreadsheet.getSheetByName('BASE 2025');
        
        if (!sheetBase) {
          console.log('⚠️ Hoja "BASE 2025" no encontrada, listando hojas disponibles...');
          const sheets = spreadsheet.getSheets();
          console.log('📋 Hojas disponibles:', sheets.map(s => s.getName()));
          
          if (sheets.length === 0) {
            console.log('❌ No hay hojas en el spreadsheet');
            return ContentService.createTextOutput(JSON.stringify({ error: 'No hay hojas disponibles en el spreadsheet' }))
              .setMimeType(ContentService.MimeType.JSON);
          }
          
          console.log('⚠️ Usando la primera hoja disponible como alternativa');
          sheetBase = sheets[0];
          console.log('✅ Usando hoja:', sheetBase.getName());
        }
        
        console.log('✅ Hoja base obtenida:', sheetBase.getName());
      } catch (error) {
        console.log('❌ Error obteniendo hoja base:', error);
        return ContentService.createTextOutput(JSON.stringify({ error: 'No se pudo acceder a la hoja base: ' + error.toString() }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Validar que tenemos una hoja válida antes de buscar
      if (!sheetBase) {
        console.log('❌ Error: No se pudo obtener una hoja válida para la búsqueda');
        return ContentService.createTextOutput(JSON.stringify({ error: 'No se pudo acceder a la hoja de datos' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Buscar el estudiante por cédula en la base
      console.log('🔍 Iniciando búsqueda en hoja:', sheetBase.getName());
      const estudiante = buscarEstudiantePorCedula(sheetBase, cedula);
      
      if (estudiante) {
        console.log('✅ Estudiante encontrado en base:', estudiante);
        return ContentService.createTextOutput(JSON.stringify(estudiante))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        console.log('❌ Estudiante no encontrado en base');
        return ContentService.createTextOutput(JSON.stringify({ error: 'Estudiante no encontrado en la base de datos' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Si no es consulta, mostrar mensaje de funcionamiento
    return ContentService.createTextOutput('Formulario funcionando correctamente. Use ?action=consulta&cedula=XXXX para consultar estudiantes en BASE 2025.')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('❌ Error en consulta:', error);
    return ContentService.createTextOutput('Error: ' + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

// Función para buscar estudiante por cédula en la base CORREGIDA
function buscarEstudiantePorCedula(sheet, cedula) {
  try {
    // Validar que la hoja existe
    if (!sheet) {
      console.log('❌ Error: La hoja es null o undefined');
      return null;
    }
    
    console.log('🔍 Buscando cédula:', cedula, 'en hoja base:', sheet.getName());
    
    // Obtener todos los datos de la hoja
    const data = sheet.getDataRange().getValues();
    console.log('📊 Total de filas en la hoja base:', data.length);
    
    if (data.length <= 1) {
      console.log('⚠️ Solo hay encabezados, no hay datos en la base');
      return null;
    }
    
    // Los encabezados están en la primera fila
    const headers = data[0];
    console.log('📋 Encabezados de la base:', headers);
    
    // BUSCAR EN LA COLUMNA DE CÉDULA DEL ESTUDIANTE (índice 1 - Número de identificación)
    const cedulaColumnIndex = 1; // Columna B (Número de identificación) según la estructura real
    console.log(`🔍 Buscando cédula "${cedula}" en columna ${cedulaColumnIndex} (${headers[cedulaColumnIndex]})`);
    
    // Buscar en todas las filas de datos (empezando desde la fila 2)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const cedulaEnFila = row[cedulaColumnIndex];
      
      // Comparar cédulas de forma más flexible (como string y como número)
      const cedulaEncontrada = cedulaEnFila ? cedulaEnFila.toString().trim() : '';
      const cedulaBuscada = cedula.trim();
      
      console.log(`🔍 Fila ${i + 1}: Cédula encontrada: "${cedulaEncontrada}" (tipo: ${typeof cedulaEnFila}) vs buscada: "${cedulaBuscada}"`);
      console.log(`🔍 Fila ${i + 1}: Tipo de identificación en la fila: "${row[2]}" (tipo: ${typeof row[2]})`);
      console.log(`🔍 Fila ${i + 1}: Todos los valores de la fila:`, row);
      console.log(`🔍 Fila ${i + 1}: Verificando si cédula empieza con YR:`, cedulaEncontrada.startsWith('YR'));
      console.log(`🔍 Fila ${i + 1}: Fecha de nacimiento en row[6]:`, `"${row[6]}" (tipo: ${typeof row[6]})`);
      console.log(`🔍 Fila ${i + 1}: Repitente en row[10]:`, `"${row[10]}" (tipo: ${typeof row[10]})`);
      console.log(`🔍 Fila ${i + 1}: Discapacidad en row[12]:`, `"${row[12]}" (tipo: ${typeof row[12]})`);
      console.log(`🔍 Fila ${i + 1}: Ruta en row[31]:`, `"${row[31]}" (tipo: ${typeof row[31]})`);
      
      if (cedulaEncontrada === cedulaBuscada || 
          cedulaEncontrada === cedulaBuscada.replace(/^0+/, '') || // Quitar ceros a la izquierda
          cedulaBuscada === cedulaEncontrada.replace(/^0+/, '')) { // Quitar ceros a la izquierda
        console.log('✅ ¡Cédula encontrada en fila', i + 1, '!');
        
        // Mapear los datos de la fila según la estructura real de BASE 2025
        // Estructura: ° | Número de identificación | Tipo de identificación | Primer apellido | Segundo apellido | Nombre | Fecha de nacimiento | Edad | Identidad de género | Nacionalidad | Repitente | Refugiado | Discapacidad | Especialidad | Nivel | Sección | Título | Celular estudiante | Encargada | Cédula | Celular | Parentesco | Vive con estud | Dirección exacta | Encargado | Cédula2 | Celular2 | Parentezco2 | Otro Cel | Dirección2 | MOVIMIENTO | Ruta
        const estudiante = {
          // Información básica - CARGAR DESDE LA BASE
          nivel: row[14] ? row[14].toString().trim() : '',        // Columna O (índice 14) - Nivel
          especialidad: row[13] ? row[13].toString().trim() : '', // Columna N (índice 13) - Especialidad
          seccion: row[15] ? row[15].toString().trim() : '',      // Columna P (índice 15) - Sección
          
          // Datos del estudiante
          primerApellido: row[3] || '',   // Columna D (índice 3) - Primer apellido
          segundoApellido: row[4] || '',  // Columna E (índice 4) - Segundo apellido
          nombre: row[5] || '',           // Columna F (índice 5) - Nombre
          cedula: row[1] || '',           // Columna B (índice 1) - Número de identificación
          tipoIdentificacion: row[2] ? mapearTipoIdentificacion(row[2].toString().trim()) : '', // Columna C (índice 2) - Tipo de identificación
          fechaNacimiento: row[6] ? (row[6] instanceof Date ? row[6].toISOString().split('T')[0] : convertirFecha(row[6].toString().trim())) : '',  // Columna G (índice 6) - Fecha de nacimiento
          nacionalidad: row[9] || '',     // Columna J (índice 9) - Nacionalidad
          telefono: row[17] || '',        // Columna R (índice 17) - Celular estudiante
          repitente: row[10] ? row[10].toString().trim() : '',       // Columna K (índice 10) - Repitente
          refugiado: row[11] ? row[11].toString().trim() : '',       // Columna L (índice 11) - Refugiado
          discapacidad: row[12] ? mapearDiscapacidad(row[12].toString().trim()) : '',    // Columna M (índice 12) - Discapacidad
          adecuacion: '',                 // No disponible en la base
          enfermedad: '',                 // No disponible en la base
          rutaTransporte: row[31] ? row[31].toString().trim() : '',  // Columna AF (índice 31) - Ruta
          
          // Campos adicionales disponibles en la base
          edad: row[7] ? row[7].toString().trim() : '',           // Columna H (índice 7) - Edad
          identidadGenero: row[8] ? row[8].toString().trim() : '', // Columna I (índice 8) - Identidad de género
          titulo: row[16] ? row[16].toString().trim() : '',       // Columna Q (índice 16) - Título
          
          // Datos de la madre
          nombreMadre: row[18] ? row[18].toString().trim() : '',     // Columna S (índice 18) - Encargada
          cedulaMadre: row[19] ? row[19].toString().trim() : '',     // Columna T (índice 19) - Cédula
          telefonoMadre: row[20] ? row[20].toString().trim() : '',   // Columna U (índice 20) - Celular
          parentescoMadre: row[21] ? row[21].toString().trim() : '', // Columna V (índice 21) - Parentesco
          viveConEstudianteMadre: row[22] ? row[22].toString().trim() : '', // Columna W (índice 22) - Vive con estud
          direccionMadre: row[23] ? row[23].toString().trim() : '',  // Columna X (índice 23) - Dirección exacta
          
          // Datos del padre
          nombrePadre: row[24] ? row[24].toString().trim() : '',     // Columna Y (índice 24) - Encargado
          cedulaPadre: row[25] ? row[25].toString().trim() : '',     // Columna Z (índice 25) - Cédula2
          telefonoPadre: row[26] ? row[26].toString().trim() : '',   // Columna AA (índice 26) - Celular2
          parentescoPadre: row[27] ? row[27].toString().trim() : '', // Columna AB (índice 27) - Parentezco2
          viveConEstudiantePadre: '', // No hay campo específico para el padre en la estructura
          direccionPadre: row[29] ? row[29].toString().trim() : '',  // Columna AD (índice 29) - Dirección2
          
          // Campos adicionales
          firmaEncargada: '',             // No disponible en la base
          firmaEncargado: '',             // No disponible en la base
          observaciones: ''               // No disponible en la base
        };
        
        console.log('📝 Datos del estudiante extraídos de la base:', estudiante);
        console.log('🔍 Campos críticos:');
        console.log('   - Cédula:', estudiante.cedula);
        console.log('   - Tipo de Identificación:', `"${estudiante.tipoIdentificacion}" (longitud: ${estudiante.tipoIdentificacion.length})`);
        console.log('   - Valor original en row[2]:', `"${row[2]}" (tipo: ${typeof row[2]})`);
        console.log('   - Fecha de Nacimiento:', `"${estudiante.fechaNacimiento}" (longitud: ${estudiante.fechaNacimiento.length})`);
        console.log('   - Valor original en row[6]:', `"${row[6]}" (tipo: ${typeof row[6]})`);
        console.log('   - ✅ Cargando tipo exacto de la base de datos sin modificaciones');
        
        // Logging detallado para datos de encargados
        console.log('👥 Datos de encargados extraídos:');
        console.log('   - Nombre Madre (row[18]):', `"${row[18]}" (tipo: ${typeof row[18]})`);
        console.log('   - Cédula Madre (row[19]):', `"${row[19]}" (tipo: ${typeof row[19]})`);
        console.log('   - Teléfono Madre (row[20]):', `"${row[20]}" (tipo: ${typeof row[20]})`);
        console.log('   - Parentesco Madre (row[21]):', `"${row[21]}" (tipo: ${typeof row[21]})`);
        console.log('   - Vive con estudiante Madre (row[22]):', `"${row[22]}" (tipo: ${typeof row[22]})`);
        console.log('   - Dirección Madre (row[23]):', `"${row[23]}" (tipo: ${typeof row[23]})`);
        console.log('   - Nombre Padre (row[24]):', `"${row[24]}" (tipo: ${typeof row[24]})`);
        console.log('   - Cédula Padre (row[25]):', `"${row[25]}" (tipo: ${typeof row[25]})`);
        console.log('   - Teléfono Padre (row[26]):', `"${row[26]}" (tipo: ${typeof row[26]})`);
        console.log('   - Parentesco Padre (row[27]):', `"${row[27]}" (tipo: ${typeof row[27]})`);
        console.log('   - Dirección Padre (row[29]):', `"${row[29]}" (tipo: ${typeof row[29]})`);
        
        // Verificación adicional para cédulas YR
        if (estudiante.cedula && estudiante.cedula.startsWith('YR') && !estudiante.tipoIdentificacion) {
          console.log('⚠️ Cédula YR encontrada pero tipo de identificación vacío, asignando valor por defecto');
          estudiante.tipoIdentificacion = 'YÍS RÖ - IDENTIFICACIÓN MEP';
        }
        
        console.log('   - Nombre:', estudiante.nombre);
        console.log('   - Nivel:', estudiante.nivel);
        console.log('   - Especialidad:', estudiante.especialidad);
        console.log('   - Sección:', estudiante.seccion);
        console.log('   - Edad:', estudiante.edad);
        console.log('   - Identidad de Género:', estudiante.identidadGenero);
        console.log('   - Título:', estudiante.titulo);
        console.log('   - Repitente:', estudiante.repitente);
        console.log('   - Discapacidad:', estudiante.discapacidad);
        console.log('   - Ruta de Transporte:', estudiante.rutaTransporte);
        console.log('   - Valores originales problemáticos:');
        console.log('     - row[6] (fecha):', `"${row[6]}" (tipo: ${typeof row[6]})`);
        console.log('     - row[10] (repitente):', `"${row[10]}" (tipo: ${typeof row[10]})`);
        console.log('     - row[12] (discapacidad):', `"${row[12]}" (tipo: ${typeof row[12]})`);
        console.log('     - row[31] (ruta):', `"${row[31]}" (tipo: ${typeof row[31]})`);
        console.log('   - Verificación de campos procesados:');
        console.log('     - fechaNacimiento procesada:', `"${estudiante.fechaNacimiento}"`);
        console.log('     - repitente procesado:', `"${estudiante.repitente}"`);
        console.log('     - discapacidad procesada:', `"${estudiante.discapacidad}"`);
        console.log('     - rutaTransporte procesada:', `"${estudiante.rutaTransporte}"`);
        console.log('   - Firma Encargada:', estudiante.firmaEncargada);
        console.log('   - Firma Encargado:', estudiante.firmaEncargado);
        console.log('   - Fecha:', estudiante.firmaEncargado);
        console.log('   - Observaciones:', estudiante.observaciones);
        return estudiante;
      }
    }
    
    console.log('❌ Cédula no encontrada en la base de datos');
    return null;
    
  } catch (error) {
    console.error('❌ Error buscando estudiante en base:', error);
    return null;
  }
}

// Función de prueba para verificar el funcionamiento
function testConsulta() {
  console.log('🧪 Iniciando prueba de consulta en BASE 2025...');
  
  // Simular una consulta GET con cédula real
  const mockE = {
    parameter: {
      action: 'consulta',
      cedula: '35689568' // Cédula que SÍ existe en tu Google Sheet
    }
  };
  
  try {
    const resultado = doGet(mockE);
    console.log('✅ Resultado de la consulta:', resultado.getContent());
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Función de prueba para verificar el envío de datos
function testEnvio() {
  console.log('🧪 Iniciando prueba de envío de datos...');
  
  // Simular datos de prueba
  const mockData = {
    parameter: {
      action: 'insertar',
      tipoMatricula: 'regular',
      numeroIdentificacion: '123456789',
      tipoIdentificacion: 'CÉDULA',
      primerApellido: 'PRUEBA',
      segundoApellido: 'TEST',
      nombre: 'ESTUDIANTE',
      fechaNacimiento: '01/01/2000',
      edad: '26',
      nacionalidad: 'COSTARRICENSE',
      repitente: 'No',
      discapacidad: 'Sin discapacidad',
      adecuacion: 'Sin adecuación',
      enfermedad: 'No',
      tipoEnfermedad: '',
      especialidad: 'Agropecuaria',
      nivel: 'Décimo',
      seccion: 'A',
      celularEstudiante: '88888888',
      encargada: 'MADRE PRUEBA',
      cedula: '111111111',
      celular: '77777777',
      parentesco: 'Madre',
      viveConEstudiante: 'Sí',
      direccionExacta: 'Dirección de prueba',
      encargado: 'PADRE PRUEBA',
      cedula2: '222222222',
      celular2: '66666666',
      parentezco2: 'Padre',
      otroCel: '',
      direccion2: 'Dirección padre prueba'
    }
  };
  
  try {
    const resultado = doPost(mockData);
    console.log('✅ Resultado del envío:', resultado.getContent());
  } catch (error) {
    console.error('❌ Error en la prueba de envío:', error);
  }
}

// Función para limpiar y actualizar headers en todas las hojas
function limpiarHeadersHojas() {
  console.log('🧹 Iniciando limpieza de headers en todas las hojas...');
  
  try {
    const spreadsheetId = '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Headers correctos para envío de matrícula (38 columnas)
    const headersCorrectos = [
      'Timestamp',                   // Columna A (0) - Timestamp
      'Número Secuencial',           // Columna B (1) - Número secuencial
      'Número de identificación',    // Columna C (2) - Cédula del estudiante
      'Tipo de identificación',      // Columna D (3) - Tipo de cédula
      'Primer apellido',             // Columna E (4) - Primer apellido
      'Segundo apellido',            // Columna F (5) - Segundo apellido
      'Nombre',                      // Columna G (6) - Nombre
      'Fecha de nacimiento',         // Columna H (7) - Fecha de nacimiento
      'Edad',                        // Columna I (8) - Edad calculada
      'Identidad de género',         // Columna J (9) - Identidad de género
      'Nacionalidad',                // Columna K (10) - Nacionalidad
      'Repitente',                   // Columna L (11) - Repitente
      'Refugiado',                   // Columna M (12) - Refugiado
      'Discapacidad',                // Columna N (13) - Discapacidad
      'Tipo de Discapacidad',        // Columna O (14) - Tipo de Discapacidad
      'Adecuación',                  // Columna P (15) - Adecuación
      'Tipo de Adecuación',          // Columna Q (16) - Tipo de Adecuación
      'Tipo de Enfermedad',          // Columna R (17) - Tipo de Enfermedad (antes "Enfermedad")
      'Especialidad',                // Columna S (18) - Especialidad
      'Nivel',                       // Columna T (19) - Nivel
      'Sección',                     // Columna U (20) - Sección
      'Ruta de transporte',          // Columna V (21) - Ruta de transporte
      'Título',                      // Columna W (22) - Título
      'Celular estudiante',          // Columna X (23) - Celular estudiante
      'Encargada',                   // Columna Y (24) - Encargada
      'Cédula',                      // Columna Z (25) - Cédula de la madre
      'Celular',                     // Columna AA (26) - Celular de la madre
      'Parentesco',                  // Columna AB (27) - Parentesco
      'Vive con estud',              // Columna AC (28) - Vive con estudiante (Madre)
      'Dirección exacta',            // Columna AD (29) - Dirección exacta
      'Encargado',                   // Columna AE (30) - Encargado
      'Cédula2',                     // Columna AF (31) - Cédula del padre
      'Celular2',                    // Columna AG (32) - Celular del padre
      'Parentezco2',                 // Columna AH (33) - Parentesco del padre
      'Vive con estud 2',            // Columna AI (34) - Vive con estudiante (Padre)
      'Otro Cel',                    // Columna AJ (35) - Otro celular
      'Dirección2',                  // Columna AK (36) - Dirección del padre
      'MOVIMIENTO'                   // Columna AL (37) - Movimiento
    ];
    
    const nombresHojas = ['REGULAR CTP 2026', 'PLAN NACIONAL 2026'];
    
    nombresHojas.forEach(nombreHoja => {
      console.log(`🔄 Procesando hoja: ${nombreHoja}`);
      
      let hoja = spreadsheet.getSheetByName(nombreHoja);
      if (hoja) {
        const columnasActuales = hoja.getLastColumn();
        console.log(`📊 Columnas actuales en ${nombreHoja}: ${columnasActuales}`);
        
        // Actualizar headers
        hoja.getRange(1, 1, 1, headersCorrectos.length).setValues([headersCorrectos]);
        console.log(`✅ Headers actualizados en ${nombreHoja}`);
        
        // Eliminar columnas extra si existen
        if (columnasActuales > headersCorrectos.length) {
          const columnasAEliminar = columnasActuales - headersCorrectos.length;
          const columnaInicio = headersCorrectos.length + 1;
          hoja.deleteColumns(columnaInicio, columnasAEliminar);
          console.log(`🗑️ Eliminadas ${columnasAEliminar} columnas extra de ${nombreHoja}`);
        }
        
        // Verificar resultado
        const headersVerificados = hoja.getRange(1, 1, 1, headersCorrectos.length).getValues()[0];
        console.log(`✅ Headers finales en ${nombreHoja}:`, headersVerificados);
        console.log(`📊 Total de columnas finales: ${headersVerificados.length}`);
      } else {
        console.log(`⚠️ Hoja ${nombreHoja} no encontrada`);
      }
    });
    
    return 'Limpieza completada. Todas las hojas actualizadas a 39 columnas.';
  } catch (error) {
    console.error('❌ Error limpiando headers:', error);
    return 'Error: ' + error.toString();
  }
}

// Función para verificar las columnas actuales en Google Sheets
function verificarColumnas() {
  console.log('🔍 Verificando columnas actuales en Google Sheets...');
  
  try {
    const spreadsheetId = '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Verificar hoja REGULAR CTP 2026
    let hojaRegular = spreadsheet.getSheetByName('REGULAR CTP 2026');
    if (hojaRegular) {
      const headersRegular = hojaRegular.getRange(1, 1, 1, hojaRegular.getLastColumn()).getValues()[0];
      console.log('📋 Headers en REGULAR CTP 2026:', headersRegular);
      console.log('📊 Total de columnas en REGULAR:', headersRegular.length);
    }
    
    // Verificar hoja PLAN NACIONAL 2026
    let hojaPlan = spreadsheet.getSheetByName('PLAN NACIONAL 2026');
    if (hojaPlan) {
      const headersPlan = hojaPlan.getRange(1, 1, 1, hojaPlan.getLastColumn()).getValues()[0];
      console.log('📋 Headers en PLAN NACIONAL 2026:', headersPlan);
      console.log('📊 Total de columnas en PLAN NACIONAL:', headersPlan.length);
    }
    
    return 'Verificación completada. Revisa los logs.';
  } catch (error) {
    console.error('❌ Error verificando columnas:', error);
    return 'Error: ' + error.toString();
  }
}
