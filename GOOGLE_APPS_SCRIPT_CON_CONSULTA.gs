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
      
      // SIEMPRE verificar y actualizar los headers para asegurar que tengan las 41 columnas correctas
      const headers = [
        'Timestamp',
        'Número Secuencial',
        'Número de identificación',
        'Tipo de identificación', 
        'Primer apellido',
        'Segundo apellido',
        'Nombre',
        'Fecha de nacimiento',
        'Edad',
        'Identidad de género',
        'Nacionalidad',
        'Repitente',
        'Refugiado',
        'Discapacidad',
        'Tipo de Discapacidad',
        'Adecuación',
        'Tipo de Adecuación',
        'Enfermedad',
        'Tipo de Enfermedad',
        'Especialidad',
        'Nivel',
        'Sección',
        'Título',
        'Celular estudiante',
        'Encargada',
        'Cédula',
        'Celular',
        'Parentesco',
        'Vive con estud',
        'Dirección exacta',
        'Encargado',
        'Cédula2',
        'Celular2',
        'Parentezco2',
        'Otro Cel',
        'Dirección2',
        'MOVIMIENTO',
        'Columna1',
        'Columna2',
        'Columna3',
        'Columna4'
      ];
      
      // VERIFICAR Y ACTUALIZAR HEADERS SIN ELIMINAR DATOS EXISTENTES
      console.log(`🔄 Verificando headers en hoja "${nombreHoja}"...`);
      
      // Verificar si la hoja está completamente vacía (recién creada)
      const isHojaNueva = hojaDestino.getLastRow() === 0;
      console.log(`🔍 ¿Es una hoja nueva? ${isHojaNueva ? 'SÍ' : 'NO'}`);
      
      if (isHojaNueva) {
        console.log(`📝 Hoja nueva detectada, insertando headers...`);
        hojaDestino.getRange(1, 1, 1, headers.length).setValues([headers]);
        console.log(`✅ Headers insertados en hoja nueva "${nombreHoja}" con ${headers.length} columnas`);
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
        } else {
          console.log(`✅ Headers ya son correctos en hoja "${nombreHoja}" con ${headers.length} columnas`);
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
    
    // PREPARAR DATOS PARA LA FILA CON LAS 42 COLUMNAS EN EL ORDEN EXACTO
    // Orden según las columnas que especificaste:
    // 0. Timestamp (fecha y hora del envío)
    // 1. Número Secuencial (conteo de estudiantes)
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
    // 13. Discapacidad (Sí/No)
    // 14. Tipo de Discapacidad
    // 15. Adecuación (Sí/No)
    // 16. Tipo de Adecuación
    // 17. Enfermedad (Sí/No)
    // 18. Tipo de Enfermedad
    // 19. Especialidad
    // 20. Nivel
    // 21. Sección
    // 22. Título
    // 23. Celular estudiante
    // 24. Encargada
    // 25. Cédula
    // 26. Celular
    // 27. Parentesco
    // 28. Vive con estud
    // 29. Dirección exacta
    // 30. Encargado
    // 31. Cédula2
    // 32. Celular2
    // 33. Parentezco2
    // 34. Otro Cel
    // 35. Dirección2
    // 36. MOVIMIENTO
    // 37. Columna1
    // 38. Columna2
    // 39. Columna3
    // 40. Columna4
    
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
      timestamp,                                    // 0. Timestamp (fecha y hora del envío)
      siguienteNumero,                              // 1. Número Secuencial (conteo de estudiantes)
      formData.numeroIdentificacion || '',          // 2. Número de identificación
      'CÉDULA',                                    // 3. Tipo de identificación (siempre CÉDULA)
      formData.primerApellido || '',                // 4. Primer apellido
      formData.segundoApellido || '',               // 5. Segundo apellido
      formData.nombre || '',                        // 6. Nombre
      formData.fechaNacimiento || '',               // 7. Fecha de nacimiento
      '',                                          // 8. Edad (vacío, se calcula en Sheets)
      '',                                          // 9. Identidad de género (vacío)
      formData.nacionalidad || '',                  // 10. Nacionalidad
      formData.repitente || '',                     // 11. Repitente
      '',                                          // 12. Refugiado (vacío)
      formData.discapacidad || '',                  // 13. Discapacidad
      formData.tipoDiscapacidad || '',              // 14. Tipo de Discapacidad
      formData.adecuacion || '',                    // 15. Adecuación
      formData.tipoAdecuacion || '',                // 16. Tipo de Adecuación
      formData.enfermedad || '',                    // 17. Enfermedad
      formData.tipoEnfermedad || '',                // 18. Tipo de Enfermedad
      formData.especialidad || '',                  // 19. Especialidad
      formData.nivel || '',                         // 20. Nivel
      formData.seccion || '',                       // 21. Sección
      '',                                          // 22. Título (vacío)
      formData.celularEstudiante || '',             // 23. Celular estudiante
      formData.encargada || '',                     // 24. Encargada
      formData.cedula || '',                        // 25. Cédula
      formData.celular || '',                       // 26. Celular
      formData.parentesco || '',                    // 27. Parentesco
      formData.viveConEstudiante || '',             // 28. Vive con estud
      formData.direccionExacta || '',               // 29. Dirección exacta
      formData.encargado || '',                     // 30. Encargado
      formData.cedula2 || '',                       // 31. Cédula2
      formData.celular2 || '',                      // 32. Celular2
      formData.parentezco2 || '',                   // 33. Parentezco2
      formData.otroCel || '',                       // 34. Otro Cel
      formData.direccion2 || '',                    // 35. Dirección2
      'NUEVA MATRÍCULA 2026',                      // 36. MOVIMIENTO
      '',                                          // 37. Columna1 (vacío)
      '',                                          // 38. Columna2 (vacío)
      '',                                          // 39. Columna3 (vacío)
      ''                                           // 40. Columna4 (vacío)
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
        sheetBase = spreadsheet.getSheetByName('BASE 2025');
        if (!sheetBase) {
          console.log('⚠️ Hoja "BASE 2025" no encontrada, usando hoja activa');
          sheetBase = spreadsheet.getActiveSheet();
        }
        console.log('✅ Hoja base obtenida:', sheetBase.getName());
      } catch (error) {
        console.log('❌ Error obteniendo hoja base:', error);
        return ContentService.createTextOutput(JSON.stringify({ error: 'No se pudo acceder a la hoja base' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Buscar el estudiante por cédula en la base
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
    
    // BUSCAR EN LA COLUMNA DE CÉDULA (índice 8)
    const cedulaColumnIndex = 8; // Columna I (Cédula)
    console.log(`🔍 Buscando cédula "${cedula}" en columna ${cedulaColumnIndex} (${headers[cedulaColumnIndex]})`);
    
    // Buscar en todas las filas de datos (empezando desde la fila 2)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const cedulaEnFila = row[cedulaColumnIndex];
      
      console.log(`🔍 Fila ${i + 1}: Cédula encontrada: "${cedulaEnFila}" vs buscada: "${cedula}"`);
      
      if (cedulaEnFila && cedulaEnFila.toString().trim() === cedula.trim()) {
        console.log('✅ ¡Cédula encontrada en fila', i + 1, '!');
        
        // Mapear los datos de la fila correctamente - COLUMNAS COMPLETAS
        const estudiante = {
          nivel: row[1] || '',             // Columna B (índice 1) - NIVEL
          especialidad: row[2] || '',      // Columna C (índice 2) - ESPECIALIDAD
          seccion: (row[3] || '').toString(),  // Columna D (índice 3) - SECCIÓN (forzado como texto)
          primerApellido: row[4] || '',   // Columna E (índice 4) - PRIMER APELLIDO
          segundoApellido: row[5] || '',  // Columna F (índice 5) - SEGUNDO APELLIDO
          nombre: row[6] || '',           // Columna G (índice 6) - NOMBRE
          telefono: row[7] || '',         // Columna H (índice 7) - TELÉFONO
          cedula: row[8] || '',           // Columna I (índice 8) - CÉDULA
          fechaNacimiento: row[9] || '',  // Columna J (índice 9) - FECHA NACIMIENTO
          nacionalidad: row[10] || '',    // Columna K (índice 10) - NACIONALIDAD
          adecuacion: row[11] || '',      // Columna L (índice 11) - ADECUACIÓN
          rutaTransporte: row[12] || '',  // Columna M (índice 12) - RUTA TRANSPORTE
          repitente: row[13] || '',       // Columna N (índice 13) - REPITENTE
          enfermedad: row[14] || '',      // Columna O (índice 14) - ENFERMEDAD
          detalleEnfermedad: row[15] || '', // Columna P (índice 15) - DETALLE ENFERMEDAD
          nombreMadre: row[16] || '',     // Columna Q (índice 16) - NOMBRE MADRE
          cedulaMadre: row[17] || '',     // Columna R (índice 17) - CÉDULA MADRE
          telefonoMadre: row[18] || '',   // Columna S (índice 18) - TELÉFONO MADRE
          direccionMadre: row[19] || '',  // Columna T (índice 19) - DIRECCIÓN MADRE
          parentescoMadre: row[20] || '', // Columna U (índice 20) - PARENTESCO MADRE
          viveConEstudianteMadre: row[21] || '', // Columna V (índice 21) - VIVE CON ESTUDIANTE MADRE
          nombrePadre: row[22] || '',     // Columna W (índice 22) - NOMBRE PADRE
          cedulaPadre: row[23] || '',     // Columna X (índice 23) - CÉDULA PADRE
          telefonoPadre: row[24] || '',   // Columna Y (índice 24) - TELÉFONO PADRE
          direccionPadre: row[25] || '',  // Columna Z (índice 25) - DIRECCIÓN PADRE
          parentescoPadre: row[26] || '', // Columna AA (índice 26) - PARENTESCO PADRE
          viveConEstudiantePadre: row[27] || '', // Columna AB (índice 27) - VIVE CON ESTUDIANTE PADRE
          firmaEncargada: row[28] || '',  // Columna AC (índice 28) - FIRMA ENCARGADA
          firmaEncargado: row[29] || '',  // Columna AD (índice 29) - FIRMA ENCARGADO
          fecha: row[30] || '',           // Columna AE (índice 30) - FECHA
          observaciones: row[31] || ''    // Columna AF (índice 31) - OBSERVACIONES
        };
        
        console.log('📝 Datos del estudiante extraídos de la base:', estudiante);
        console.log('🔍 Campos críticos:');
        console.log('   - Nivel:', estudiante.nivel);
        console.log('   - Especialidad:', estudiante.especialidad);
        console.log('   - Sección:', estudiante.seccion);
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
      primerApellido: 'PRUEBA',
      segundoApellido: 'TEST',
      nombre: 'ESTUDIANTE',
      fechaNacimiento: '01/01/2000',
      nacionalidad: 'COSTARRICENSE',
      repitente: 'No',
      discapacidad: 'No',
      tipoDiscapacidad: '',
      adecuacion: 'No',
      tipoAdecuacion: '',
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
