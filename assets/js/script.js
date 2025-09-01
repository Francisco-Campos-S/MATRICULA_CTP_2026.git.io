// Configuración del selector de tipo de matrícula
function setupTipoMatricula() {
    const tipoRegular = document.getElementById('tipoRegular');
    const tipoPlanNacional = document.getElementById('tipoPlanNacional');
    
    if (tipoRegular && tipoPlanNacional) {
        tipoRegular.addEventListener('change', () => cambiarTipoMatricula('regular'));
        tipoPlanNacional.addEventListener('change', () => cambiarTipoMatricula('planNacional'));
    }
}

// Cambiar tipo de matrícula
function cambiarTipoMatricula(tipo) {
    console.log('Cambiando tipo de matrícula a:', tipo);
    
    if (tipo === 'regular') {
        cambiarFormularioRegular();
    } else if (tipo === 'planNacional') {
        cambiarFormularioPlanNacional();
    }
}

// Cambiar a formulario Regular
function cambiarFormularioRegular() {
    // Cambiar título del formulario
    const tituloFormulario = document.querySelector('.section-header h2');
    if (tituloFormulario) {
        tituloFormulario.textContent = '📋 Formulario de Matrícula - REGULAR CTP 2026';
    }
    
    // Configurar para hoja REGULAR CTP 2026
    updateGoogleSheetsConfig('regular');
}

// Cambiar a formulario Plan Nacional
function cambiarFormularioPlanNacional() {
    // Cambiar título del formulario
    const tituloFormulario = document.querySelector('.section-header h2');
    if (tituloFormulario) {
        tituloFormulario.textContent = '📋 Formulario de Matrícula - PLAN NACIONAL 2026';
    }
    
    // Configurar para hoja PLAN NACIONAL 2026
    updateGoogleSheetsConfig('planNacional');
}

// Actualizar configuración de Google Sheets según el tipo
function updateGoogleSheetsConfig(tipo) {
    if (tipo === 'regular') {
        console.log('Configurando para hoja: REGULAR CTP 2026');
        // Aquí se configuraría la hoja específica para Regular
    } else if (tipo === 'planNacional') {
        console.log('Configurando para hoja: PLAN NACIONAL 2026');
        // Aquí se configuraría la hoja específica para Plan Nacional
    }
}





// Función para cargar datos de prueba
function cargarDatosPrueba() {
    console.log('Cargando datos de prueba...');
    
    // Datos de prueba para el formulario
    const datosPrueba = {
        // Información básica
        nivel: 'Décimo',
        especialidad: 'CONTABILIDAD',
        seccion: 'A',
        
        // Datos del estudiante
        primerApellido: 'ALVARADO',
        segundoApellido: 'PINEDA',
        nombreEstudiante: 'ESTUDIANTE',
        cedulaEstudiante: '123456789',
        fechaNacimiento: '2008-03-15',
        nacionalidad: 'Costarricense',
        telefonoEstudiante: '8888-8888',
        enfermedad: 'No',
        detalleEnfermedad: '',
        adecuacion: 'No',
        repitente: 'No',
        rutaTransporte: 'Ruta 1',
        
        // Datos de la madre
        nombreMadre: 'MARÍA',
        cedulaMadre: '987654321',
        telefonoMadre: '7777-7777',
        parentescoMadre: 'Madre',
        viveConEstudianteMadre: 'Sí',
        direccionMadre: 'San José, Costa Rica',
        
        // Datos del padre
        nombrePadre: 'JUAN',
        cedulaPadre: '456789123',
        telefonoPadre: '6666-6666',
        parentescoPadre: 'Padre',
        viveConEstudiantePadre: 'Sí',
        direccionPadre: 'San José, Costa Rica',
        
        // Declaración y firmas
        firmaEncargada: 'MARÍA GONZÁLEZ LÓPEZ',
        firmaEncargado: 'JUAN RODRÍGUEZ MARTÍNEZ',
        fecha: '15/01/2026',
        observaciones: 'Estudiante nuevo ingreso'
    };
    
    // Llenar todos los campos del formulario
    Object.keys(datosPrueba).forEach(key => {
        const elemento = document.getElementById(key);
        if (elemento) {
            elemento.value = datosPrueba[key];
            
            // Manejar campos especiales
            if (key === 'enfermedad' && datosPrueba[key] === 'Sí') {
                const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
                if (detalleEnfermedadGroup) {
                    detalleEnfermedadGroup.style.display = 'block';
                }
            }
        }
    });
    
    console.log('Datos de prueba cargados exitosamente');
    mostrarMensaje('✅ Datos de prueba cargados correctamente', 'success');
}

// Función para llenar formulario con datos del estudiante (formato Google Sheets)
function llenarFormularioConEstudiante(estudiante) {
    console.log('Llenando formulario con datos del estudiante:', estudiante);
    
    // Mapear campos de Google Sheets a campos del formulario
    // Los nombres deben coincidir EXACTAMENTE con los que devuelve el Google Apps Script
    const mapeoCampos = {
        'especialidad': 'especialidad',
        'seccion': 'seccion',
        'primerApellido': 'primerApellido',
        'segundoApellido': 'segundoApellido',
        'nombre': 'nombreEstudiante',
        'telefono': 'telefonoEstudiante',
        'cedula': 'cedulaEstudiante',
        'fechaNacimiento': 'fechaNacimiento',
        'nacionalidad': 'nacionalidad',
        'adecuacion': 'adecuacion',
        'rutaTransporte': 'rutaTransporte',
        'repitente': 'repitente',
        'enfermedad': 'enfermedad',
        'detalleEnfermedad': 'detalleEnfermedad',
        'nombreMadre': 'nombreMadre',
        'cedulaMadre': 'cedulaMadre',
        'telefonoMadre': 'telefonoMadre',
        'direccionMadre': 'direccionMadre',
        'parentescoMadre': 'parentescoMadre',
        'viveConEstudianteMadre': 'viveConEstudianteMadre',
        'nombrePadre': 'nombrePadre',
        'cedulaPadre': 'cedulaPadre',
        'telefonoPadre': 'telefonoPadre',
        'direccionPadre': 'direccionPadre',
        'parentescoPadre': 'parentescoPadre',
        'viveConEstudiantePadre': 'viveConEstudiantePadre',
        'firmaEncargada': 'firmaEncargada',
        'firmaEncargado': 'firmaEncargado',
        'observaciones': 'observaciones'
    };
    
    console.log('Mapeo de campos:', mapeoCampos);
    console.log('Datos del estudiante recibidos:', estudiante);
    
    // Llenar cada campo
    let camposLlenados = 0;
    let camposNoEncontrados = 0;
    let camposVacios = 0;
    
    Object.keys(mapeoCampos).forEach(campoGoogle => {
        const campoFormulario = mapeoCampos[campoGoogle];
        const elemento = document.getElementById(campoFormulario);
        const valor = estudiante[campoGoogle];
        
        console.log(`🔍 Mapeando: "${campoGoogle}" -> "${campoFormulario}" = "${valor}"`);
        
        if (!elemento) {
            console.log(`❌ Campo "${campoFormulario}" no encontrado en el formulario`);
            camposNoEncontrados++;
            return;
        }
        
        if (valor !== undefined && valor !== null && valor !== '') {
            elemento.value = valor;
            console.log(`✅ Campo "${campoFormulario}" llenado con: "${valor}"`);
            camposLlenados++;
            
            // Manejar campos especiales
            if (campoFormulario === 'enfermedad' && valor === 'Sí') {
                const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
                if (detalleEnfermedadGroup) {
                    detalleEnfermedadGroup.style.display = 'block';
                    console.log('✅ Campo de detalle de enfermedad mostrado');
                }
            }
        } else {
            console.log(`⚠️ Campo "${campoFormulario}" no se llenó - valor: "${valor}"`);
            camposVacios++;
        }
    });
    
    console.log(`📊 Resumen de llenado: ${camposLlenados} campos llenados, ${camposVacios} vacíos, ${camposNoEncontrados} no encontrados`);
    
    // Establecer fecha actual
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        fechaInput.value = `${day}/${month}/${year}`;
        console.log(`✅ Fecha actual establecida: ${day}/${month}/${year}`);
    }
    
    // Verificar campos que se llenaron
    const camposLlenadosArray = [];
    Object.keys(mapeoCampos).forEach(campoGoogle => {
        const campoFormulario = mapeoCampos[campoGoogle];
        const elemento = document.getElementById(campoFormulario);
        if (elemento && elemento.value) {
            camposLlenadosArray.push(campoFormulario);
        }
    });
    
    console.log(`✅ Formulario llenado exitosamente. Campos llenados: ${camposLlenadosArray.length}/${Object.keys(mapeoCampos).length}`);
    console.log('Campos llenados:', camposLlenadosArray);
}

// Función para enviar el formulario a Google Sheets
async function enviarFormulario() {
    console.log('Enviando formulario a Google Sheets...');
    
    // Validar campos requeridos
    const camposRequeridos = [
        'nivel', 'especialidad', 'seccion', 'primerApellido', 
        'segundoApellido', 'nombreEstudiante', 'cedulaEstudiante', 'fechaNacimiento',
        'nacionalidad', 'nombreMadre', 'cedulaMadre', 'telefonoMadre',
        'direccionMadre', 'fecha'
    ];
    
    let camposFaltantes = [];
    
    camposRequeridos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento && (!elemento.value || elemento.value.trim() === '')) {
            camposFaltantes.push(campo);
        }
    });
    
    if (camposFaltantes.length > 0) {
        mostrarMensaje(`❌ Campos requeridos faltantes: ${camposFaltantes.join(', ')}`, 'error');
        return;
    }
    
    // Obtener tipo de matrícula seleccionado
    const tipoMatricula = document.querySelector('input[name="tipoMatricula"]:checked');
    if (!tipoMatricula) {
        mostrarMensaje('❌ Por favor seleccione un tipo de matrícula', 'error');
        return;
    }
    
    try {
        // Recolectar datos del formulario
        const formData = recolectarDatosFormulario();
        
        // Mostrar mensaje de envío
        mostrarMensaje('📤 Enviando formulario a Google Sheets...', 'info');
        
        // Enviar a Google Sheets
        const resultado = await enviarAGoogleSheets(formData, tipoMatricula.value);
        
        if (resultado.success) {
            const hojaDestino = tipoMatricula.value === 'regular' ? 'REGULAR CTP 2026' : 'PLAN NACIONAL 2026';
            mostrarMensaje(`✅ Formulario enviado exitosamente a la hoja: ${hojaDestino}`, 'success');
            console.log(`Formulario enviado exitosamente a Google Sheets - Hoja: ${hojaDestino}`);
            
            // Limpiar formulario después del envío exitoso
            setTimeout(() => {
                limpiarFormulario();
            }, 2000);
        } else {
            throw new Error(resultado.error || 'Error desconocido al enviar');
        }
        
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        mostrarMensaje(`❌ Error al enviar: ${error.message}`, 'error');
    }
}

// Función para recolectar datos del formulario
function recolectarDatosFormulario() {
    // Mapear campos del formulario al orden EXACTO de las columnas de la base de datos
    // IMPORTANTE: Todas las columnas se envían con sus encabezados, incluso las vacías
    // Esto asegura que Google Sheets mantenga la estructura correcta de las columnas
    const formData = {
        // 1. Número de identificación
        numeroIdentificacion: document.getElementById('cedulaEstudiante').value,
        
        // 2. Tipo de identificación
        tipoIdentificacion: 'CÉDULA',
        
        // 3. Primer apellido
        primerApellido: document.getElementById('primerApellido').value,
        
        // 4. Segundo apellido
        segundoApellido: document.getElementById('segundoApellido').value,
        
        // 5. Nombre
        nombre: document.getElementById('nombreEstudiante').value,
        
        // 6. Fecha de nacimiento
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        
        // 7. Edad
        edad: '',
        
        // 8. Identidad de género
        identidadGenero: '',
        
        // 9. Nacionalidad
        nacionalidad: document.getElementById('nacionalidad').value,
        
        // 10. Repitente
        repitente: document.getElementById('repitente').value,
        
        // 11. Refugiado
        refugiado: '',
        
        // 12. Discapacidad
        discapacidad: document.getElementById('adecuacion').value,
        
        // 13. Especialidad
        especialidad: document.getElementById('especialidad').value,
        
        // 14. Nivel
        nivel: document.getElementById('nivel').value,
        
        // 15. Sección
        seccion: document.getElementById('seccion').value,
        
        // 16. Título
        titulo: '',
        
        // 17. Celular estudiante
        celularEstudiante: document.getElementById('telefonoEstudiante').value,
        
        // 18. Encargada
        encargada: document.getElementById('nombreMadre').value,
        
        // 19. Cédula
        cedula: document.getElementById('cedulaMadre').value,
        
        // 20. Celular
        celular: document.getElementById('telefonoMadre').value,
        
        // 21. Parentesco
        parentesco: document.getElementById('parentescoMadre').value,
        
        // 22. Vive con estud
        viveConEstudiante: document.getElementById('viveConEstudianteMadre').value,
        
        // 23. Dirección exacta
        direccionExacta: document.getElementById('direccionMadre').value,
        
        // 24. Encargado
        encargado: document.getElementById('nombrePadre').value,
        
        // 25. Cédula2
        cedula2: document.getElementById('cedulaPadre').value,
        
        // 26. Celular2
        celular2: document.getElementById('telefonoPadre').value,
        
        // 27. Parentezco2
        parentezco2: document.getElementById('parentescoPadre').value,
        
        // 28. Otro Cel
        otroCel: '',
        
        // 29. Dirección2
        direccion2: document.getElementById('direccionPadre').value,
        
        // 30. MOVIMIENTO
        movimiento: 'NUEVA MATRÍCULA 2026',
        
        // 31. Columna1
        columna1: '',
        
        // 32. Columna2
        columna2: '',
        
        // 33. Columna3
        columna3: '',
        
        // 34. Columna4
        columna4: '',
        
        // Campos adicionales del formulario que no están en la base de datos
        rutaTransporte: document.getElementById('rutaTransporte').value,
        enfermedad: document.getElementById('enfermedad').value,
        detalleEnfermedad: document.getElementById('detalleEnfermedad').value,
        firmaEncargada: document.getElementById('firmaEncargada').value,
        firmaEncargado: document.getElementById('firmaEncargado').value,
        fecha: document.getElementById('fecha').value,
        observaciones: document.getElementById('observaciones').value,
        
        // Timestamp para auditoría
        timestamp: new Date().toISOString()
    };
    
    return formData;
}

// Función para enviar datos a Google Sheets
async function enviarAGoogleSheets(formData, tipoMatricula) {
    try {
        // Obtener configuración de Google Sheets
        const config = getGoogleSheetsConfig();
        if (!config || !config.APPS_SCRIPT || !config.APPS_SCRIPT.WEB_APP_URL) {
            throw new Error('Configuración de Google Sheets no disponible');
        }
        
        // Agregar tipo de matrícula y hoja destino a los datos
        formData.tipoMatricula = tipoMatricula;
        formData.hojaDestino = tipoMatricula === 'regular' ? 'REGULAR CTP 2026' : 'PLAN NACIONAL 2026';
        
        console.log('Enviando datos a Google Sheets:', formData);
        console.log('Hoja destino:', formData.hojaDestino);
        console.log('URL de Apps Script:', config.APPS_SCRIPT.WEB_APP_URL);
        
        // Crear URLSearchParams para enviar datos
        // Enviar TODAS las columnas con sus encabezados, incluso las vacías
        const urlParams = new URLSearchParams();
        let columnasEnviadas = 0;
        
        Object.keys(formData).forEach(key => {
            // Enviar todas las columnas, incluso si están vacías
            // Esto asegura que Google Sheets mantenga la estructura correcta
            const valor = formData[key] !== null && formData[key] !== undefined ? formData[key] : '';
            urlParams.append(key, valor);
            columnasEnviadas++;
        });
        
        console.log(`📊 Enviando ${columnasEnviadas} columnas con sus encabezados a Google Sheets`);
        console.log('📋 Columnas enviadas:', Object.keys(formData));
        
        // Enviar datos usando fetch
        const response = await fetch(config.APPS_SCRIPT.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Para evitar problemas de CORS
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlParams.toString()
        });
        
        console.log('Respuesta del servidor:', response);
        
        // Con no-cors, siempre asumimos éxito si no hay error
        return { success: true, message: 'Datos enviados exitosamente' };
        
    } catch (error) {
        console.error('Error en enviarAGoogleSheets:', error);
        return { success: false, error: error.message };
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    console.log('Limpiando formulario...');
    
    const campos = document.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        if (campo.type !== 'radio') {
            campo.value = '';
        }
    });
    
    // Resetear radio buttons
    document.getElementById('tipoRegular').checked = true;
    cambiarFormularioRegular();
    
    // Ocultar campo de detalle de enfermedad
    const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
    if (detalleEnfermedadGroup) {
        detalleEnfermedadGroup.style.display = 'none';
    }
    
    mostrarMensaje('🧹 Formulario limpiado correctamente', 'success');
}

// Función para imprimir el formulario
function imprimirFormulario() {
    console.log('Imprimiendo formulario...');
    window.print();
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo = 'info') {
    const mensajeElement = document.getElementById('mensajeConsulta');
    if (mensajeElement) {
        mensajeElement.textContent = mensaje;
        mensajeElement.className = `mensaje-consulta ${tipo}`;
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
            mensajeElement.textContent = '';
            mensajeElement.className = 'mensaje-consulta';
        }, 5000);
    }
}



// Función para consultar estudiante por cédula en Google Sheets
async function consultarEstudiante() {
    const cedula = document.getElementById('cedulaConsulta').value.trim();
    
    if (!cedula) {
        mostrarMensaje('❌ Por favor ingrese un número de cédula', 'error');
        return;
    }
    
    console.log('🔍 Consultando estudiante con cédula:', cedula);
    mostrarMensaje('🔍 Buscando estudiante en Google Sheets...', 'info');
    

    
    try {
        // Obtener configuración de Google Sheets
        const config = getGoogleSheetsConfig();
        if (!config || !config.APPS_SCRIPT || !config.APPS_SCRIPT.WEB_APP_URL) {
            throw new Error('Configuración de Google Sheets no disponible');
        }
        
        // Crear URL para consulta
        const consultaUrl = `${config.APPS_SCRIPT.WEB_APP_URL}?action=consulta&cedula=${encodeURIComponent(cedula)}`;
        
        console.log('🌐 Consultando URL:', consultaUrl);
        
        // Realizar consulta simple
        console.log('📡 Enviando consulta...');
        
        const response = await fetch(consultaUrl, {
            method: 'GET',
            mode: 'cors'
        });
        
        console.log('📡 Respuesta del servidor:', response);
        console.log('📊 Status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const responseText = await response.text();
        console.log('📄 Respuesta en texto:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('✅ Datos parseados correctamente:', data);
        } catch (parseError) {
            console.error('❌ Error parseando JSON:', parseError);
            console.log('📄 Respuesta original:', responseText);
            throw new Error('Respuesta del servidor no es JSON válido');
        }
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (data && Object.keys(data).length > 0) {
            console.log('🎯 Estudiante encontrado, llenando formulario...');
            // Estudiante encontrado, llenar formulario
            llenarFormularioConEstudiante(data);
            mostrarMensaje('✅ Estudiante encontrado, formulario llenado correctamente', 'success');
        } else {
            console.log('❌ No se encontraron datos del estudiante');
            mostrarMensaje('❌ No se encontró estudiante con esa cédula', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error en consulta:', error);
        mostrarMensaje(`❌ Error al consultar: ${error.message}`, 'error');
        console.log('💡 Sugerencia: Verifica que el Google Apps Script esté funcionando correctamente');
    }
}

// Función para mostrar el tipo de matrícula seleccionado
function mostrarTipoMatriculaSeleccionado() {
    const tipoRegular = document.getElementById('regular');
    const tipoPlanNacional = document.getElementById('planNacional');
    
    // Crear elemento para mostrar el tipo seleccionado
    let tipoSeleccionadoDiv = document.getElementById('tipoSeleccionado');
    if (!tipoSeleccionadoDiv) {
        tipoSeleccionadoDiv = document.createElement('div');
        tipoSeleccionadoDiv.id = 'tipoSeleccionado';
        tipoSeleccionadoDiv.className = 'tipo-seleccionado-display';
        tipoSeleccionadoDiv.style.cssText = 'margin-top: 5px; padding: 3px; background: #e8f5e8; border: 1px solid #4caf50; border-radius: 3px; font-size: 0.8rem; color: #2e7d32; text-align: center;';
        
        // Insertar después de las opciones
        const tipoMatriculaOptions = document.querySelector('.tipo-matricula-options');
        tipoMatriculaOptions.parentNode.insertBefore(tipoSeleccionadoDiv, tipoMatriculaOptions.nextSibling);
    }
    
    // Mostrar el tipo seleccionado
    if (tipoRegular.checked) {
        tipoSeleccionadoDiv.textContent = '✅ Tipo seleccionado: REGULAR CTP 2026';
        tipoSeleccionadoDiv.style.background = '#e8f5e8';
        tipoSeleccionadoDiv.style.borderColor = '#4caf50';
        tipoSeleccionadoDiv.style.color = '#2e7d32';
    } else if (tipoPlanNacional.checked) {
        tipoSeleccionadoDiv.textContent = '✅ Tipo seleccionado: PLAN NACIONAL 2026';
        tipoSeleccionadoDiv.style.background = '#fff3e0';
        tipoSeleccionadoDiv.style.borderColor = '#ff9800';
        tipoSeleccionadoDiv.style.color = '#e65100';
    } else {
        tipoSeleccionadoDiv.textContent = '⚠️ Seleccione un tipo de matrícula';
        tipoSeleccionadoDiv.style.background = '#fff3e0';
        tipoSeleccionadoDiv.style.borderColor = '#ff9800';
        tipoSeleccionadoDiv.style.color = '#e65100';
    }
}

// Agregar event listeners cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para los tipos de matrícula
    const tipoRegular = document.getElementById('regular');
    const tipoPlanNacional = document.getElementById('planNacional');
    
    if (tipoRegular) {
        tipoRegular.addEventListener('change', mostrarTipoMatriculaSeleccionado);
    }
    
    if (tipoPlanNacional) {
        tipoPlanNacional.addEventListener('change', mostrarTipoMatriculaSeleccionado);
    }
    
    // Mostrar estado inicial
    setTimeout(mostrarTipoMatriculaSeleccionado, 100);
});

