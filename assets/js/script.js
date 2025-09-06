// Variable para controlar si se está editando un estudiante
let editandoEstudiante = false;

// Mapeo de especialidades por nivel
const especialidadesPorNivel = {
    'Sétimo': [
        { value: 'Sin especialidad', text: 'Sin especialidad' }
    ],
    'Octavo': [
        { value: 'Sin especialidad', text: 'Sin especialidad' }
    ],
    'Noveno': [
        { value: 'Sin especialidad', text: 'Sin especialidad' }
    ],
    'Décimo': [
        { value: 'Contabilidad', text: 'Contabilidad' },
        { value: 'Organización de empresas de Turismo Rural', text: 'Organización de empresas de Turismo Rural' },
        { value: 'Procesos productivos e inspección en la Industria Alimentaria', text: 'Procesos productivos e inspección en la Industria Alimentaria' },
        { value: 'Producción Agrícola y Pecuaria', text: 'Producción Agrícola y Pecuaria' }
    ],
    'Undécimo': [
        { value: 'Contabilidad y Finanzas', text: 'Contabilidad y Finanzas' },
        { value: 'Turismo Rural', text: 'Turismo Rural' },
        { value: 'Procesos productivos e inspección en la Industria Alimentaria', text: 'Procesos productivos e inspección en la Industria Alimentaria' },
        { value: 'Producción Agrícola y Pecuaria', text: 'Producción Agrícola y Pecuaria' }
    ],
    'Duodécimo': [
        { value: 'Contabilidad', text: 'Contabilidad' },
        { value: 'Turismo Rural', text: 'Turismo Rural' },
        { value: 'Agroindustria Alimentaria con Tecnología Agrícola', text: 'Agroindustria Alimentaria con Tecnología Agrícola' },
        { value: 'Producción Agrícola y Pecuaria', text: 'Producción Agrícola y Pecuaria' }
    ]
};

// Claves para localStorage
const STORAGE_KEYS = {
    EDITANDO: 'editandoEstudiante',
    DATOS_ESTUDIANTE: 'datosEstudianteEditando'
};

// Función para guardar el estado de edición en localStorage
function guardarEstadoEdicion(estudiante) {
    try {
        localStorage.setItem(STORAGE_KEYS.EDITANDO, 'true');
        localStorage.setItem(STORAGE_KEYS.DATOS_ESTUDIANTE, JSON.stringify(estudiante));
        console.log('💾 Estado de edición guardado en localStorage');
    } catch (error) {
        console.error('❌ Error guardando estado de edición:', error);
    }
}

// Función para cargar el estado de edición desde localStorage
function cargarEstadoEdicion() {
    try {
        const editando = localStorage.getItem(STORAGE_KEYS.EDITANDO);
        const datosEstudiante = localStorage.getItem(STORAGE_KEYS.DATOS_ESTUDIANTE);
        
        if (editando === 'true' && datosEstudiante) {
            editandoEstudiante = true;
            const estudiante = JSON.parse(datosEstudiante);
            console.log('📂 Estado de edición cargado desde localStorage:', estudiante);
            
            // Llenar el formulario con los datos guardados (sin limpiar ni guardar nuevamente)
            llenarFormularioConDatosGuardados(estudiante);
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error cargando estado de edición:', error);
        return false;
    }
}

// Función para llenar el formulario con datos guardados (sin guardar en localStorage)
function llenarFormularioConDatosGuardados(estudiante) {
    console.log('Llenando formulario con datos guardados:', estudiante);
    
    // Actualizar visibilidad del botón de reset
    actualizarBotonReset();
    
    // Mapear campos de Google Sheets a campos del formulario
    const mapeoCampos = {
        'primerApellido': 'primerApellido',
        'segundoApellido': 'segundoApellido',
        'nombre': 'nombreEstudiante',
        'telefono': 'telefonoEstudiante',
        'cedula': 'cedulaEstudiante',
        'fechaNacimiento': 'fechaNacimiento',
        'nacionalidad': 'nacionalidad',
        'nacionalidadOtro': 'nacionalidadOtro',
        'adecuacion': 'adecuacion',
        'rutaTransporte': 'rutaTransporte',
        'repitente': 'repitente',
        'discapacidad': 'discapacidad',
        'enfermedad': 'enfermedad',
        'detalleEnfermedad': 'detalleEnfermedad',
        'tipoIdentificacion': 'tipoIdentificacion',
        'edad': 'edad',
        'identidadGenero': 'identidadGenero',
        'titulo': 'titulo',
        'refugiado': 'refugiado',
        'nombreMadre': 'nombreMadre',
        'cedulaMadre': 'cedulaMadre',
        'telefonoMadre': 'telefonoMadre',
        'parentescoMadre': 'parentescoMadre',
        'viveConEstudianteMadre': 'viveConEstudianteMadre',
        'direccionMadre': 'direccionMadre',
        'nombrePadre': 'nombrePadre',
        'cedulaPadre': 'cedulaPadre',
        'telefonoPadre': 'telefonoPadre',
        'parentescoPadre': 'parentescoPadre',
        'viveConEstudiantePadre': 'viveConEstudiantePadre',
        'direccionPadre': 'direccionPadre',
        'firmaEncargada': 'firmaEncargada',
        'firmaEncargado': 'firmaEncargado',
        'observaciones': 'observaciones'
    };
    
    // Llenar campos mapeados
    Object.keys(mapeoCampos).forEach(campoBackend => {
        const campoFrontend = mapeoCampos[campoBackend];
        const valor = estudiante[campoBackend];
        
        console.log(`🔍 Mapeando ${campoBackend} -> ${campoFrontend}: "${valor}"`);
        
        if (valor !== undefined && valor !== null && valor !== '') {
            const elemento = document.getElementById(campoFrontend);
            if (elemento) {
                if (elemento.tagName === 'SELECT') {
                    // Para selectores, buscar por valor o texto
                    const opcion = Array.from(elemento.options).find(opt => 
                        opt.value === valor || opt.textContent.trim() === valor
                    );
                    if (opcion) {
                        elemento.value = opcion.value;
                        console.log(`✅ Selector ${campoFrontend} configurado a: "${opcion.value}"`);
                    } else {
                        console.log(`⚠️ No se encontró opción para ${campoFrontend} con valor: "${valor}"`);
                    }
                } else if (elemento.type === 'date') {
                    // Para campos de fecha, convertir formato si es necesario
                    const fechaConvertida = convertirFechaFormato(valor);
                    elemento.value = fechaConvertida;
                    console.log(`✅ Fecha ${campoFrontend} configurada a: "${fechaConvertida}"`);
                } else if (campoFrontend === 'nacionalidad') {
                    // Manejo especial para nacionalidad
                    manejarNacionalidadEnFormulario(valor);
                } else {
                    elemento.value = valor;
                    console.log(`✅ Campo ${campoFrontend} configurado a: "${valor}"`);
                }
            } else {
                console.log(`❌ No se encontró elemento con ID: ${campoFrontend}`);
            }
        } else {
            console.log(`⚠️ Valor vacío para ${campoBackend}: "${valor}"`);
        }
    });
    
    // Calcular edad si hay fecha de nacimiento
    if (estudiante.fechaNacimiento) {
        actualizarEdad();
    }
    
    // Sincronizar la cédula del estudiante al campo de consulta
    const cedulaEstudiante = document.getElementById('cedulaEstudiante').value;
    if (cedulaEstudiante) {
        sincronizarCedulaAConsulta(cedulaEstudiante);
    }
    
    console.log('✅ Formulario llenado con datos guardados');
}

// Función para llenar el formulario con datos (sin limpiar)
function llenarFormularioConDatos(estudiante) {
    console.log('📝 Llenando formulario con datos:', estudiante);
    
    // Mapear campos de Google Sheets a campos del formulario
    const mapeoCampos = {
        'primerApellido': 'primerApellido',
        'segundoApellido': 'segundoApellido',
        'nombre': 'nombreEstudiante',
        'telefono': 'telefonoEstudiante',
        'cedula': 'cedulaEstudiante',
        'fechaNacimiento': 'fechaNacimiento',
        'nacionalidad': 'nacionalidad',
        'nacionalidadOtro': 'nacionalidadOtro',
        'adecuacion': 'adecuacion',
        'rutaTransporte': 'rutaTransporte',
        'repitente': 'repitente',
        'discapacidad': 'discapacidad',
        'enfermedad': 'enfermedad',
        'detalleEnfermedad': 'detalleEnfermedad',
        'tipoIdentificacion': 'tipoIdentificacion',
        'edad': 'edad',
        'identidadGenero': 'identidadGenero',
        'titulo': 'titulo',
        'refugiado': 'refugiado',
        'nombreMadre': 'nombreMadre',
        'cedulaMadre': 'cedulaMadre',
        'telefonoMadre': 'telefonoMadre',
        'parentescoMadre': 'parentescoMadre',
        'viveConEstudianteMadre': 'viveConEstudianteMadre',
        'direccionMadre': 'direccionMadre',
        'nombrePadre': 'nombrePadre',
        'cedulaPadre': 'cedulaPadre',
        'telefonoPadre': 'telefonoPadre',
        'parentescoPadre': 'parentescoPadre',
        'viveConEstudiantePadre': 'viveConEstudiantePadre',
        'direccionPadre': 'direccionPadre',
        'firmaEncargada': 'firmaEncargada',
        'firmaEncargado': 'firmaEncargado',
        'observaciones': 'observaciones'
    };
    
    console.log('Mapeo de campos:', mapeoCampos);
    console.log('Datos del estudiante recibidos:', estudiante);
    
    // Llenar campos mapeados
    Object.keys(mapeoCampos).forEach(campoBackend => {
        const campoFrontend = mapeoCampos[campoBackend];
        const valor = estudiante[campoBackend];
        
        console.log(`🔍 Mapeando ${campoBackend} -> ${campoFrontend}: "${valor}"`);
        
        if (valor !== undefined && valor !== null && valor !== '') {
            const elemento = document.getElementById(campoFrontend);
            if (elemento) {
                if (elemento.tagName === 'SELECT') {
                    // Para selectores, buscar por valor o texto
                    const opcion = Array.from(elemento.options).find(opt => 
                        opt.value === valor || opt.textContent.trim() === valor
                    );
                    if (opcion) {
                        elemento.value = opcion.value;
                        console.log(`✅ Selector ${campoFrontend} configurado a: "${opcion.value}"`);
                    } else {
                        console.log(`⚠️ No se encontró opción para ${campoFrontend} con valor: "${valor}"`);
                    }
                } else if (elemento.type === 'date') {
                    // Para campos de fecha, convertir formato si es necesario
                    const fechaConvertida = convertirFechaFormato(valor);
                    elemento.value = fechaConvertida;
                    console.log(`✅ Fecha ${campoFrontend} configurada a: "${fechaConvertida}"`);
                } else if (campoFrontend === 'nacionalidad') {
                    // Manejo especial para nacionalidad
                    manejarNacionalidadEnFormulario(valor);
                } else {
                    elemento.value = valor;
                    console.log(`✅ Campo ${campoFrontend} configurado a: "${valor}"`);
                }
            } else {
                console.log(`❌ No se encontró elemento con ID: ${campoFrontend}`);
            }
        } else {
            console.log(`⚠️ Valor vacío para ${campoBackend}: "${valor}"`);
        }
    });
    
    // Calcular edad si hay fecha de nacimiento
    if (estudiante.fechaNacimiento) {
        actualizarEdad();
    }
    
    // Sincronizar la cédula del estudiante al campo de consulta
    const cedulaEstudiante = document.getElementById('cedulaEstudiante').value;
    if (cedulaEstudiante) {
        sincronizarCedulaAConsulta(cedulaEstudiante);
    }
    
    console.log('✅ Formulario llenado con datos del estudiante');
}

// Variable para controlar el timeout de actualización
let timeoutActualizacion = null;

// Función para actualizar los datos guardados cuando el usuario modifica el formulario
function actualizarDatosGuardados() {
    if (editandoEstudiante) {
        // Cancelar actualización anterior si existe
        if (timeoutActualizacion) {
            clearTimeout(timeoutActualizacion);
        }
        
        // Actualizar con un pequeño delay para evitar actualizaciones excesivas
        timeoutActualizacion = setTimeout(() => {
            // Obtener los datos actuales del formulario
            const datosActuales = obtenerDatosFormulario();
            
            // Guardar los datos actualizados
            guardarEstadoEdicion(datosActuales);
            console.log('💾 Datos de edición actualizados en localStorage');
        }, 500); // 500ms de delay
    }
}

// Función para obtener los datos actuales del formulario
function obtenerDatosFormulario() {
    const datos = {};
    
    // Mapear campos del formulario a datos del estudiante
    const mapeoCampos = {
        'primerApellido': 'primerApellido',
        'segundoApellido': 'segundoApellido',
        'nombreEstudiante': 'nombre',
        'telefonoEstudiante': 'telefono',
        'cedulaEstudiante': 'cedula',
        'fechaNacimiento': 'fechaNacimiento',
        'nacionalidad': 'nacionalidad',
        'nacionalidadOtro': 'nacionalidadOtro',
        'adecuacion': 'adecuacion',
        'rutaTransporte': 'rutaTransporte',
        'repitente': 'repitente',
        'discapacidad': 'discapacidad',
        'enfermedad': 'enfermedad',
        'tipoIdentificacion': 'tipoIdentificacion',
        'edad': 'edad',
        'identidadGenero': 'identidadGenero',
        'titulo': 'titulo',
        'refugiado': 'refugiado',
        'nombreMadre': 'nombreMadre',
        'cedulaMadre': 'cedulaMadre',
        'telefonoMadre': 'telefonoMadre',
        'parentescoMadre': 'parentescoMadre',
        'viveConEstudianteMadre': 'viveConEstudianteMadre',
        'direccionMadre': 'direccionMadre',
        'nombrePadre': 'nombrePadre',
        'cedulaPadre': 'cedulaPadre',
        'telefonoPadre': 'telefonoPadre',
        'parentescoPadre': 'parentescoPadre',
        'viveConEstudiantePadre': 'viveConEstudiantePadre',
        'direccionPadre': 'direccionPadre',
        'firmaEncargada': 'firmaEncargada',
        'firmaEncargado': 'firmaEncargado',
        'observaciones': 'observaciones'
    };
    
    // Obtener valores de los campos
    Object.keys(mapeoCampos).forEach(campoFrontend => {
        const campoBackend = mapeoCampos[campoFrontend];
        const elemento = document.getElementById(campoFrontend);
        if (elemento) {
            datos[campoBackend] = elemento.value || '';
        }
    });
    
    return datos;
}

// Función para agregar event listeners que actualicen los datos durante la edición
function agregarEventListenersEdicion() {
    // Lista de campos que deben actualizar los datos guardados cuando cambien
    const camposEdicion = [
        'nivel', 'especialidad', 'seccion', 'primerApellido', 'segundoApellido', 
        'nombreEstudiante', 'cedulaEstudiante', 'fechaNacimiento', 'nacionalidad',
        'tipoIdentificacion', 'telefonoEstudiante', 'enfermedad', 'adecuacion',
        'repitente', 'rutaTransporte', 'nombreMadre', 'cedulaMadre', 'telefonoMadre',
        'parentescoMadre', 'viveConEstudianteMadre', 'direccionMadre', 'nombrePadre',
        'cedulaPadre', 'telefonoPadre', 'parentescoPadre', 'viveConEstudiantePadre',
        'direccionPadre', 'firmaEncargada', 'firmaEncargado', 'observaciones'
    ];
    
    // Agregar event listener a cada campo
    camposEdicion.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            // Para campos de texto, usar 'input' para capturar cambios en tiempo real
            if (campo.type === 'text' || campo.type === 'tel' || campo.type === 'date' || campo.tagName === 'TEXTAREA') {
                campo.addEventListener('input', actualizarDatosGuardados);
            }
            // Para selectores, usar 'change' para capturar selecciones
            else if (campo.tagName === 'SELECT') {
                campo.addEventListener('change', actualizarDatosGuardados);
            }
        }
    });
    
    console.log('📝 Event listeners de edición agregados');
}


// Función para limpiar el estado de edición del localStorage
function limpiarEstadoEdicion() {
    try {
        localStorage.removeItem(STORAGE_KEYS.EDITANDO);
        localStorage.removeItem(STORAGE_KEYS.DATOS_ESTUDIANTE);
        console.log('🗑️ Estado de edición limpiado del localStorage');
    } catch (error) {
        console.error('❌ Error limpiando estado de edición:', error);
    }
}

// Función para limpiar completamente el formulario (sin afectar estado de edición)
function limpiarFormularioCompleto() {
    console.log('🧹 Limpiando formulario completamente...');
    
    // Limpiar todos los campos del formulario
    const campos = document.querySelectorAll('input, select, textarea');
    
    campos.forEach(campo => {
        if (campo.type === 'checkbox' || campo.type === 'radio') {
            campo.checked = false;
        } else if (campo.type === 'date') {
            campo.value = '';
        } else {
            campo.value = '';
        }
    });
    
    // Limpiar campos específicos que podrían tener valores por defecto
    const camposEspecificos = [
        'nivel', 'especialidad', 'seccion', 'primerApellido', 'segundoApellido', 
        'nombreEstudiante', 'cedulaEstudiante', 'fechaNacimiento', 'nacionalidad',
        'nacionalidadOtro', 'tipoIdentificacion', 'telefonoEstudiante', 'enfermedad', 'adecuacion',
        'repitente', 'rutaTransporte', 'nombreMadre', 'cedulaMadre', 'telefonoMadre',
        'parentescoMadre', 'viveConEstudianteMadre', 'direccionMadre', 'nombrePadre',
        'cedulaPadre', 'telefonoPadre', 'parentescoPadre', 'viveConEstudiantePadre',
        'direccionPadre', 'firmaEncargada', 'firmaEncargado', 'observaciones'
    ];
    
    camposEspecificos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = '';
        }
    });
    
    // Limpiar campos de edad calculada
    const edadCampo = document.getElementById('edad');
    if (edadCampo) {
        edadCampo.value = '';
    }
    
    // Actualizar especialidades después de limpiar
    actualizarEspecialidades();
    
    // Ocultar campo de nacionalidad personalizada y resetear layout
    const nacionalidadOtroGroup = document.getElementById('nacionalidadOtroGroup');
    const nacionalidadOtro = document.getElementById('nacionalidadOtro');
    const nacionalidadGroup = document.getElementById('nacionalidadGroup');
    
    if (nacionalidadOtroGroup) {
        nacionalidadOtroGroup.style.display = 'none';
    }
    if (nacionalidadOtro) {
        nacionalidadOtro.required = false;
    }
    if (nacionalidadGroup) {
        nacionalidadGroup.style.flexDirection = 'column';
        nacionalidadGroup.style.gap = '4px';
        nacionalidadGroup.style.alignItems = 'stretch';
        nacionalidadGroup.style.flexWrap = 'nowrap';
        nacionalidadGroup.style.overflow = 'hidden';
    }
    
    console.log('✅ Formulario limpiado completamente');
}

// Función para actualizar la visibilidad del botón de reset
function actualizarBotonReset() {
    const botonReset = document.getElementById('btnReset');
    if (botonReset) {
        if (editandoEstudiante) {
            botonReset.style.display = 'inline-block';
            botonReset.textContent = 'Limpiar Formulario';
            botonReset.title = 'Limpiar el formulario y cancelar la edición';
        } else {
            botonReset.style.display = 'inline-block';
            botonReset.textContent = 'Limpiar Formulario';
            botonReset.title = 'Limpiar el formulario';
        }
    }
}

// Función para limpiar el formulario
function limpiarFormulario(forzarLimpieza = false) {
    console.log('🧹 Limpiando formulario...');
    
    // Si se está editando y no es una limpieza forzada, confirmar antes de limpiar
    if (editandoEstudiante && !forzarLimpieza) {
        const confirmar = confirm('¿Está seguro de que desea limpiar el formulario y cancelar la edición?');
        if (!confirmar) {
            console.log('❌ Limpieza cancelada por el usuario');
            return;
        }
        console.log('✅ Usuario confirmó la limpieza durante la edición');
    }
    
    // Limpiar todos los campos del formulario
    const campos = document.querySelectorAll('input, select, textarea');
    
    campos.forEach(campo => {
        if (campo.type === 'checkbox' || campo.type === 'radio') {
            campo.checked = false;
        } else if (campo.type === 'date') {
            campo.value = '';
        } else {
            campo.value = '';
        }
    });
    
    // Limpiar campos específicos que podrían tener valores por defecto
    const camposEspecificos = [
        'nivel', 'especialidad', 'seccion', 'primerApellido', 'segundoApellido', 
        'nombreEstudiante', 'cedulaEstudiante', 'fechaNacimiento', 'nacionalidad',
        'nacionalidadOtro', 'tipoIdentificacion', 'telefonoEstudiante', 'enfermedad', 'adecuacion',
        'repitente', 'rutaTransporte', 'nombreMadre', 'cedulaMadre', 'telefonoMadre',
        'parentescoMadre', 'viveConEstudianteMadre', 'direccionMadre', 'nombrePadre',
        'cedulaPadre', 'telefonoPadre', 'parentescoPadre', 'viveConEstudiantePadre',
        'direccionPadre', 'firmaEncargada', 'firmaEncargado', 'observaciones'
    ];
    
    camposEspecificos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = '';
        }
    });
    
    // Limpiar campos de edad calculada
    const edadCampo = document.getElementById('edad');
    if (edadCampo) {
        edadCampo.value = '';
    }
    
    // Actualizar especialidades después de limpiar
    actualizarEspecialidades();
    
    console.log('✅ Formulario limpiado correctamente');
}

// Función para cargar datos de prueba
function cargarDatosPrueba() {
    console.log('🔄 Iniciando carga de datos de prueba...');
    
    try {
        // Datos de prueba para el formulario
        const datosPrueba = {
            // Información básica
            nivel: 'Décimo',
            especialidad: 'Contabilidad',
            seccion: 'A',
            
            // Datos del estudiante
            primerApellido: 'ALVARADO',
            segundoApellido: 'PINEDA',
            nombreEstudiante: 'ESTUDIANTE',
            cedulaEstudiante: '123456789',
            fechaNacimiento: '2008-03-15',
            nacionalidad: 'Costarricense',
            tipoIdentificacion: 'Cédula',
            telefonoEstudiante: '8888-8888',
            enfermedad: '',
            adecuacion: 'Sin adecuación',
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
        let camposCargados = 0;
        let camposNoEncontrados = [];
        
        Object.keys(datosPrueba).forEach(key => {
            const elemento = document.getElementById(key);
            if (elemento) {
                elemento.value = datosPrueba[key];
                camposCargados++;
                console.log(`✅ Campo cargado: ${key} = ${datosPrueba[key]}`);
                
                // Si es el campo de nivel, actualizar especialidades
                if (key === 'nivel') {
                    setTimeout(() => {
                        actualizarEspecialidades();
                        // Después de actualizar especialidades, cargar la especialidad de prueba
                        setTimeout(() => {
                            const especialidadElement = document.getElementById('especialidad');
                            if (especialidadElement) {
                                especialidadElement.value = datosPrueba.especialidad;
                                console.log(`✅ Especialidad cargada: ${datosPrueba.especialidad}`);
                            }
                        }, 100);
                    }, 100);
                }
            } else {
                camposNoEncontrados.push(key);
                console.warn(`⚠️ Campo no encontrado: ${key}`);
            }
        });
        
        console.log(`📊 Resumen: ${camposCargados} campos cargados, ${camposNoEncontrados.length} no encontrados`);
        
        if (camposNoEncontrados.length > 0) {
            console.log('❌ Campos no encontrados:', camposNoEncontrados);
        }
        
        // Mostrar mensaje de éxito
        const mensajeElement = document.getElementById('mensajeConsulta');
        if (mensajeElement) {
            mensajeElement.textContent = `✅ Datos de prueba cargados correctamente (${camposCargados} campos)`;
            mensajeElement.className = 'mensaje-consulta success';
            
            // Limpiar mensaje después de 5 segundos
            setTimeout(() => {
                mensajeElement.textContent = '';
                mensajeElement.className = 'mensaje-consulta';
            }, 5000);
        }
        
        console.log('✅ Datos de prueba cargados exitosamente');
        
    } catch (error) {
        console.error('❌ Error cargando datos de prueba:', error);
        alert('Error al cargar los datos de prueba: ' + error.message);
    }
}

// Función para llenar formulario con datos del estudiante (formato Google Sheets)
// Función para convertir fecha de formato dd/MM/yyyy a yyyy-MM-dd
function convertirFechaFormato(fechaString) {
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
    console.log('Error convirtiendo fecha en frontend:', error);
    return fechaString;
  }
}

function llenarFormularioConEstudiante(estudiante) {
    console.log('Llenando formulario con datos del estudiante:', estudiante);
    
    // Activar modo de edición PRIMERO
    editandoEstudiante = true;
    console.log('✏️ Modo de edición activado');
    
    // Limpiar formulario SIN desactivar el modo de edición
    console.log('🧹 Limpiando formulario antes de llenar con nuevos datos...');
    limpiarFormularioCompleto();
    
    // Pequeño delay para asegurar que la limpieza se complete
    setTimeout(() => {
        // Llenar el formulario con los datos
        llenarFormularioConDatos(estudiante);
        
        // Guardar estado de edición en localStorage
        guardarEstadoEdicion(estudiante);
        
        // Actualizar visibilidad del botón de reset
        actualizarBotonReset();
    }, 50);
    
    // Mapear campos de Google Sheets a campos del formulario
    // Los nombres deben coincidir EXACTAMENTE con los que devuelve el Google Apps Script
    // IMPORTANTE: NO se mapean "nivel", "especialidad" y "seccion" para que el usuario los seleccione manualmente
    const mapeoCampos = {
        'primerApellido': 'primerApellido',
        'segundoApellido': 'segundoApellido',
        'nombre': 'nombreEstudiante',
        'telefono': 'telefonoEstudiante',
        'cedula': 'cedulaEstudiante',
        'fechaNacimiento': 'fechaNacimiento',
        'nacionalidad': 'nacionalidad',
        'nacionalidadOtro': 'nacionalidadOtro',
        'adecuacion': 'adecuacion',
        'rutaTransporte': 'rutaTransporte',
        'repitente': 'repitente',
        'discapacidad': 'discapacidad',
        'enfermedad': 'enfermedad',
        'detalleEnfermedad': 'detalleEnfermedad',
        'tipoIdentificacion': 'tipoIdentificacion',
        'edad': 'edad',
        'identidadGenero': 'identidadGenero',
        'titulo': 'titulo',
        'refugiado': 'refugiado',
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
    console.log('⚠️ NOTA: Los campos "nivel", "especialidad" y "seccion" NO se llenan automáticamente para que el usuario los seleccione manualmente');
    
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
            // Manejo especial para fechas
            if (campoFormulario === 'fechaNacimiento' && valor) {
                // Convertir fecha de dd/MM/yyyy a yyyy-MM-dd
                const fechaConvertida = convertirFechaFormato(valor);
                elemento.value = fechaConvertida;
                console.log(`✅ Campo "${campoFormulario}" llenado con fecha convertida: "${fechaConvertida}" (original: "${valor}")`);
            } else if (elemento.tagName === 'SELECT') {
                // Manejo especial para campos select (dropdowns)
                const opciones = Array.from(elemento.options);
                const opcionEncontrada = opciones.find(opcion => 
                    opcion.value === valor || 
                    opcion.textContent.trim() === valor ||
                    opcion.textContent.trim().toLowerCase() === valor.toLowerCase()
                );
                
                if (opcionEncontrada) {
                    elemento.value = opcionEncontrada.value;
                    console.log(`✅ Campo SELECT "${campoFormulario}" llenado con: "${valor}" (opción: "${opcionEncontrada.textContent}")`);
                } else {
                    console.log(`⚠️ No se encontró opción para "${valor}" en el campo SELECT "${campoFormulario}"`);
                    console.log(`Opciones disponibles:`, opciones.map(op => op.textContent.trim()));
                }
            } else if (campoFormulario === 'nacionalidad') {
                // Manejo especial para nacionalidad
                manejarNacionalidadEnFormulario(valor);
            } else {
                elemento.value = valor;
                console.log(`✅ Campo "${campoFormulario}" llenado con: "${valor}"`);
            }
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
    
    // LIMPIAR EXPLÍCITAMENTE los campos de Nivel, Especialidad y Sección
    const camposNivelEspecialidad = ['nivel', 'especialidad', 'seccion'];
    camposNivelEspecialidad.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.value = '';
            console.log(`🧹 Campo "${campo}" limpiado para selección manual`);
        }
    });
    
    console.log(`📊 Resumen de llenado: ${camposLlenados} campos llenados, ${camposVacios} vacíos, ${camposNoEncontrados} no encontrados`);
    console.log(`🧹 Campos de Nivel/Especialidad/Sección limpiados para selección manual`);
    
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
    
    // Sincronizar la cédula del estudiante al campo de consulta
    const cedulaEstudiante = document.getElementById('cedulaEstudiante').value;
    if (cedulaEstudiante) {
        sincronizarCedulaAConsulta(cedulaEstudiante);
    }
    
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
        'nacionalidad', 'tipoIdentificacion', 'nombreMadre', 'cedulaMadre', 'telefonoMadre',
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
    // Obtener fecha y hora actual
    const ahora = new Date();
    const timestamp = ahora.toLocaleString('es-CR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Mapear campos del formulario al orden EXACTO de las columnas de la base de datos
    // IMPORTANTE: Todas las columnas se envían con sus encabezados, incluso las vacías
    // Esto asegura que Google Sheets mantenga la estructura correcta de las columnas
    const formData = {
        // 0. Timestamp (fecha y hora del envío)
        timestamp: timestamp,
        
        // 1. Número de identificación
        numeroIdentificacion: document.getElementById('cedulaEstudiante').value,
        
        // 2. Tipo de identificación
        tipoIdentificacion: obtenerTipoIdentificacion(),
        
        // 3. Primer apellido
        primerApellido: document.getElementById('primerApellido').value,
        
        // 4. Segundo apellido
        segundoApellido: document.getElementById('segundoApellido').value,
        
        // 5. Nombre
        nombre: document.getElementById('nombreEstudiante').value,
        
        // 6. Fecha de nacimiento
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        
        // 7. Edad (calculada automáticamente)
        edad: calcularEdad(document.getElementById('fechaNacimiento').value),
        
        // 8. Identidad de género
        identidadGenero: '',
        
        // 9. Nacionalidad
        nacionalidad: obtenerNacionalidad(),
        
        // 10. Repitente
        repitente: document.getElementById('repitente').value,
        
        // 11. Refugiado
        refugiado: '',
        
        // 12. Discapacidad
        discapacidad: obtenerDiscapacidadSeleccionada(),
        
        // 14. Adecuación
        adecuacion: document.getElementById('adecuacion').value,
        
        
        // 15. Enfermedad
        enfermedad: document.getElementById('enfermedad').value,
        
        // 18. Especialidad
        especialidad: document.getElementById('especialidad').value,
        
        // 19. Nivel
        nivel: document.getElementById('nivel').value,
        
        // 20. Sección
        seccion: document.getElementById('seccion').value,
        
        // 21. Título
        titulo: '',
        
        // 22. Celular estudiante
        celularEstudiante: document.getElementById('telefonoEstudiante').value,
        
        // 23. Encargada
        encargada: document.getElementById('nombreMadre').value,
        
        // 24. Cédula
        cedula: document.getElementById('cedulaMadre').value,
        
        // 25. Celular
        celular: document.getElementById('telefonoMadre').value,
        
        // 26. Parentesco
        parentesco: document.getElementById('parentescoMadre').value,
        
        // 27. Vive con estud
        viveConEstudiante: document.getElementById('viveConEstudianteMadre').value,
        
        // 28. Dirección exacta
        direccionExacta: document.getElementById('direccionMadre').value,
        
        // 29. Encargado
        encargado: document.getElementById('nombrePadre').value,
        
        // 30. Cédula2
        cedula2: document.getElementById('cedulaPadre').value,
        
        // 31. Celular2
        celular2: document.getElementById('telefonoPadre').value,
        
        // 32. Parentezco2
        parentezco2: document.getElementById('parentescoPadre').value,
        
        // 33. Otro Cel
        otroCel: document.getElementById('telefonoOtroEncargado') ? document.getElementById('telefonoOtroEncargado').value : '',
        
        // 34. Dirección2
        direccion2: document.getElementById('direccionOtroEncargado') ? document.getElementById('direccionOtroEncargado').value : '',
        
        // 35. MOVIMIENTO
        movimiento: 'NUEVA MATRÍCULA 2026',
        
        // 36. Columna1
        columna1: '',
        
        // 37. Columna2
        columna2: '',
        
        // 38. Columna3
        columna3: '',
        
        // 39. Columna4
        columna4: ''
    };
    
    // LÓGICA ESPECIAL PARA CAMPOS CONDICIONALES
    // Ya no es necesaria lógica especial para discapacidad
    
    
    
    console.log('📊 Datos recolectados del formulario:', formData);
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
    const radioRegular = document.getElementById('regular');
    if (radioRegular) {
        radioRegular.checked = true;
    }
    
    // Ocultar campos condicionales
    const tipoDiscapacidadGroup = document.getElementById('tipoDiscapacidadGroup');
    if (tipoDiscapacidadGroup) {
        tipoDiscapacidadGroup.style.display = 'none';
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



// Función para copiar la cédula al campo de datos del estudiante
function copiarCedulaACampoEstudiante(cedula, mostrarMensaje = false) {
    console.log('🔄 Ejecutando copiarCedulaACampoEstudiante con cédula:', cedula);
    const cedulaEstudianteField = document.getElementById('cedulaEstudiante');
    console.log('🔍 Campo de cédula del estudiante encontrado:', !!cedulaEstudianteField);
    
    if (cedulaEstudianteField) {
        console.log('📊 Valor actual del campo:', cedulaEstudianteField.value);
        console.log('📊 Valor a copiar:', cedula);
        console.log('📊 ¿Son diferentes?', cedulaEstudianteField.value !== cedula);
        
        // Solo actualizar si el valor es diferente
        if (cedulaEstudianteField.value !== cedula) {
            cedulaEstudianteField.value = cedula;
            console.log(`✅ Cédula copiada al campo de datos del estudiante: ${cedula}`);
            
            // Mostrar mensaje de confirmación solo si se solicita
            if (mostrarMensaje) {
                const mensajeElement = document.getElementById('mensajeConsulta');
                if (mensajeElement) {
                    mensajeElement.textContent = `📋 Cédula ${cedula} copiada al formulario`;
                    mensajeElement.className = 'mensaje-consulta info';
                    
                    // Limpiar mensaje después de 3 segundos
                    setTimeout(() => {
                        mensajeElement.textContent = '';
                        mensajeElement.className = 'mensaje-consulta';
                    }, 3000);
                }
            }
        } else {
            console.log('⚠️ La cédula ya es la misma, no se actualiza');
        }
    } else {
        console.log('❌ No se encontró el campo de cédula del estudiante');
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
        
        // Usar método alternativo para evitar problemas de CORS
        const response = await fetch(consultaUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
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
            // También asegurar que la cédula esté en el campo (por si no está en los datos)
            copiarCedulaACampoEstudiante(cedula, false);
            // Sincronizar la cédula de vuelta al campo de consulta
            sincronizarCedulaAConsulta(cedula);
            mostrarMensaje('✅ Estudiante encontrado, formulario llenado correctamente', 'success');
        } else {
            console.log('❌ No se encontraron datos del estudiante');
            // Aunque no se encuentre el estudiante, copiar la cédula al campo de datos
            copiarCedulaACampoEstudiante(cedula, true);
            // Sincronizar la cédula de vuelta al campo de consulta
            sincronizarCedulaAConsulta(cedula);
            mostrarMensaje('❌ No se encontró estudiante con esa cédula, pero se copió la cédula al formulario', 'warning');
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

// Función para detectar el navegador y aplicar ajustes específicos
function detectarNavegadorYajustar() {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
    const isEdge = /Edg/.test(userAgent);
    
    console.log('🌐 Navegador detectado:', {
        userAgent: userAgent,
        isChrome: isChrome,
        isFirefox: isFirefox,
        isSafari: isSafari,
        isEdge: isEdge
    });
    
    // Aplicar ajustes específicos según el navegador
    if (isFirefox) {
        console.log('🦊 Aplicando ajustes específicos para Firefox');
        document.body.style.height = 'calc(100vh - 4px)';
        document.body.style.minHeight = 'calc(100vh - 4px)';
        const container = document.querySelector('.container');
        if (container) {
            container.style.height = 'calc(100vh - 4px)';
            container.style.minHeight = 'calc(100vh - 4px)';
        }
        const form = document.querySelector('.matricula-form');
        if (form) {
            form.style.maxHeight = 'calc(100vh - 120px)';
            form.style.overflowY = 'auto';
        }
    } else if (isSafari) {
        console.log('🦁 Aplicando ajustes específicos para Safari');
        document.body.style.height = '-webkit-fill-available';
        document.querySelector('.container').style.height = '-webkit-fill-available';
    } else if (isChrome || isEdge) {
        console.log('🌐 Aplicando ajustes específicos para Chrome/Edge');
        // Chrome y Edge manejan mejor 100vh
        document.body.style.height = '100vh';
        document.querySelector('.container').style.height = '100vh';
    }
    
    // Ajustar según la altura de la ventana
    const alturaVentana = window.innerHeight;
    console.log('📏 Altura de ventana detectada:', alturaVentana);
    
    if (alturaVentana < 600) {
        console.log('📱 Pantalla pequeña detectada, aplicando ajustes');
        document.body.style.fontSize = '18px';
        // Reducir padding y márgenes para pantallas pequeñas
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            if (input) {
                input.style.fontSize = '14px';
                input.style.padding = '4px 6px';
                input.style.minHeight = '16px';
            }
            const label = group.querySelector('label');
            if (label) {
                label.style.fontSize = '14px';
            }
        });
    }
}

// Función para ajustar el layout cuando cambia el tamaño de la ventana
function ajustarLayout() {
    const alturaVentana = window.innerHeight;
    const anchoVentana = window.innerWidth;
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    console.log('📐 Ajustando layout - Altura:', alturaVentana, 'Ancho:', anchoVentana, 'Firefox:', isFirefox);
    
    // Ajustar altura del contenedor
    const container = document.querySelector('.container');
    if (container) {
        if (isFirefox) {
            // Firefox necesita un ajuste especial
            container.style.height = `calc(${alturaVentana}px - 4px)`;
            container.style.minHeight = `calc(${alturaVentana}px - 4px)`;
        } else {
            container.style.height = `${alturaVentana}px`;
        }
    }
    
    // Ajustar altura del body
    if (isFirefox) {
        document.body.style.height = `calc(${alturaVentana}px - 4px)`;
        document.body.style.minHeight = `calc(${alturaVentana}px - 4px)`;
        
        // Ajustar el formulario para que quepa en Firefox
        const form = document.querySelector('.matricula-form');
        if (form) {
            form.style.maxHeight = `calc(${alturaVentana}px - 120px)`;
            form.style.overflowY = 'auto';
        }
    } else {
        document.body.style.height = `${alturaVentana}px`;
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
    
    // Inicializar campos condicionales
    setTimeout(function() {
        // Ya no hay campos condicionales que inicializar
    }, 200);
    
    // Limpiar formulario al cargar la página (siempre vacío al inicio)
    setTimeout(() => {
        limpiarFormulario(true); // Forzar limpieza sin confirmación
    }, 100);
    
    // Inicializar botón de reset
    actualizarBotonReset();
    
    // Agregar event listeners para actualizar datos durante la edición
    agregarEventListenersEdicion();
    
    // Inicializar especialidades dinámicas
    inicializarEspecialidades();
    
    // Inicializar sincronización de cédula y búsqueda con Enter
    inicializarSincronizacionCedula();
    
    // Detectar navegador y aplicar ajustes específicos
    detectarNavegadorYajustar();
    
    // Ajustar layout inicial
    ajustarLayout();
    
    // Ajuste adicional para Firefox después de un pequeño delay
    if (/Firefox/.test(navigator.userAgent)) {
        setTimeout(() => {
            console.log('🦊 Aplicando ajuste adicional para Firefox');
            ajustarLayout();
            
            // Forzar recálculo del layout
            const form = document.querySelector('.matricula-form');
            if (form) {
                form.style.height = 'auto';
                form.offsetHeight; // Trigger reflow
                form.style.maxHeight = `calc(${window.innerHeight}px - 100px)`;
            }
        }, 200);
    }
    
    // Ajustar layout cuando cambia el tamaño de la ventana
    window.addEventListener('resize', ajustarLayout);
    window.addEventListener('orientationchange', function() {
        // Pequeño delay para que el navegador termine de rotar
        setTimeout(ajustarLayout, 100);
    });
});

// Función para mostrar/ocultar campo de tipo de discapacidad
// Función para obtener la discapacidad seleccionada
function obtenerDiscapacidadSeleccionada() {
    const discapacidadSelect = document.getElementById('discapacidad');
    return discapacidadSelect ? discapacidadSelect.value : '';
}



// Función para mostrar/ocultar campo de tipo de identificación "Otro"
function mostrarTipoIdentificacionOtro() {
    const tipoIdentificacion = document.getElementById('tipoIdentificacion');
    const tipoIdentificacionOtroGroup = document.getElementById('tipoIdentificacionOtroGroup');
    const tipoIdentificacionOtro = document.getElementById('tipoIdentificacionOtro');
    
    if (tipoIdentificacion.value === 'Otro') {
        tipoIdentificacionOtroGroup.style.display = 'block';
        tipoIdentificacionOtro.required = true;
    } else {
        tipoIdentificacionOtroGroup.style.display = 'none';
        tipoIdentificacionOtro.required = false;
        tipoIdentificacionOtro.value = '';
    }
}

// Función para mostrar/ocultar campo de nacionalidad "Otro"
function mostrarNacionalidadOtro() {
    const nacionalidad = document.getElementById('nacionalidad');
    const nacionalidadOtroGroup = document.getElementById('nacionalidadOtroGroup');
    const nacionalidadOtro = document.getElementById('nacionalidadOtro');
    const nacionalidadGroup = document.getElementById('nacionalidadGroup');
    
    if (nacionalidad.value === 'Otro') {
        nacionalidadOtroGroup.style.display = 'block';
        nacionalidadOtro.required = true;
        // Cambiar el layout del grupo a horizontal cuando se muestra el campo "Otro"
        nacionalidadGroup.style.flexDirection = 'row';
        nacionalidadGroup.style.gap = '8px';
        nacionalidadGroup.style.alignItems = 'start';
        nacionalidadGroup.style.flexWrap = 'wrap';
        nacionalidadGroup.style.overflow = 'hidden';
        console.log('🌍 Campo de nacionalidad personalizada mostrado al lado');
    } else {
        nacionalidadOtroGroup.style.display = 'none';
        nacionalidadOtro.required = false;
        nacionalidadOtro.value = '';
        // Volver al layout vertical cuando se oculta el campo "Otro"
        nacionalidadGroup.style.flexDirection = 'column';
        nacionalidadGroup.style.gap = '4px';
        nacionalidadGroup.style.alignItems = 'stretch';
        nacionalidadGroup.style.flexWrap = 'nowrap';
        nacionalidadGroup.style.overflow = 'hidden';
        console.log('🌍 Campo de nacionalidad personalizada ocultado');
    }
}

// Función para obtener el tipo de identificación correcto para enviar a la base de datos
function obtenerTipoIdentificacion() {
    const tipoIdentificacion = document.getElementById('tipoIdentificacion');
    const tipoIdentificacionOtro = document.getElementById('tipoIdentificacionOtro');
    
    if (tipoIdentificacion.value === 'Otro' && tipoIdentificacionOtro.value.trim() !== '') {
        return tipoIdentificacionOtro.value.trim().toUpperCase();
    } else if (tipoIdentificacion.value && tipoIdentificacion.value !== 'Otro') {
        return tipoIdentificacion.value.toUpperCase();
    } else {
        return 'CÉDULA'; // Valor por defecto
    }
}

// Función para obtener la nacionalidad correcta para enviar a la base de datos
function obtenerNacionalidad() {
    const nacionalidad = document.getElementById('nacionalidad');
    const nacionalidadOtro = document.getElementById('nacionalidadOtro');
    
    if (nacionalidad.value === 'Otro' && nacionalidadOtro.value.trim() !== '') {
        return nacionalidadOtro.value.trim();
    } else if (nacionalidad.value && nacionalidad.value !== 'Otro') {
        return nacionalidad.value;
    } else {
        return ''; // Valor vacío si no se selecciona nada
    }
}

// Función para manejar la nacionalidad al llenar el formulario
function manejarNacionalidadEnFormulario(valor) {
    const nacionalidadSelect = document.getElementById('nacionalidad');
    const nacionalidadOtroInput = document.getElementById('nacionalidadOtro');
    const nacionalidadOtroGroup = document.getElementById('nacionalidadOtroGroup');
    const nacionalidadGroup = document.getElementById('nacionalidadGroup');
    
    if (!valor) return;
    
    // Lista de nacionalidades predefinidas
    const nacionalidadesPredefinidas = ['Costarricense', 'Panameña', 'Nicaragüense', 'Venezolana'];
    
    if (nacionalidadesPredefinidas.includes(valor)) {
        // Si es una nacionalidad predefinida, seleccionarla
        nacionalidadSelect.value = valor;
        nacionalidadOtroGroup.style.display = 'none';
        nacionalidadOtroInput.value = '';
        nacionalidadOtroInput.required = false;
        // Asegurar layout vertical
        nacionalidadGroup.style.flexDirection = 'column';
        nacionalidadGroup.style.gap = '4px';
        nacionalidadGroup.style.alignItems = 'stretch';
        nacionalidadGroup.style.flexWrap = 'nowrap';
        nacionalidadGroup.style.overflow = 'hidden';
        console.log(`✅ Nacionalidad predefinida seleccionada: ${valor}`);
    } else {
        // Si no es predefinida, usar "Otro" y llenar el campo personalizado
        nacionalidadSelect.value = 'Otro';
        nacionalidadOtroGroup.style.display = 'block';
        nacionalidadOtroInput.value = valor;
        nacionalidadOtroInput.required = true;
        // Cambiar a layout horizontal
        nacionalidadGroup.style.flexDirection = 'row';
        nacionalidadGroup.style.gap = '8px';
        nacionalidadGroup.style.alignItems = 'start';
        nacionalidadGroup.style.flexWrap = 'wrap';
        nacionalidadGroup.style.overflow = 'hidden';
        console.log(`✅ Nacionalidad personalizada configurada: ${valor}`);
    }
}

// Función para calcular la edad al 1 de febrero de 2026 en formato "X años y Y meses"
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return '';
    
    try {
        // Fecha de referencia: 1 de febrero de 2026
        const fechaReferencia = new Date('2026-02-01');
        const fechaNac = new Date(fechaNacimiento);
        
        // Verificar que la fecha de nacimiento sea válida
        if (isNaN(fechaNac.getTime())) {
            console.log('❌ Fecha de nacimiento inválida:', fechaNacimiento);
            return '';
        }
        
        // Calcular la diferencia en años y meses
        let años = fechaReferencia.getFullYear() - fechaNac.getFullYear();
        let meses = fechaReferencia.getMonth() - fechaNac.getMonth();
        
        // Ajustar si aún no ha cumplido años en 2026
        if (meses < 0) {
            años--;
            meses += 12;
        }
        
        // Ajustar por días si es necesario
        const diaReferencia = fechaReferencia.getDate();
        const diaNacimiento = fechaNac.getDate();
        
        if (diaReferencia < diaNacimiento) {
            meses--;
            if (meses < 0) {
                años--;
                meses += 12;
            }
        }
        
        // Verificar que la edad sea válida (entre 0 y 100 años)
        if (años < 0 || años > 100) {
            console.log('❌ Edad calculada inválida:', años, 'años para fecha:', fechaNacimiento);
            return '';
        }
        
        // Formatear la edad como "X años y Y meses"
        let edadFormateada = `${años} años`;
        if (meses > 0) {
            edadFormateada += ` y ${meses} meses`;
        }
        
        console.log(`📅 Edad calculada: ${edadFormateada} (nacimiento: ${fechaNacimiento}, referencia: 2026-02-01)`);
        return edadFormateada;
        
    } catch (error) {
        console.error('❌ Error calculando edad:', error);
        return '';
    }
}

// Función para actualizar la edad cuando cambia la fecha de nacimiento
function actualizarEdad() {
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const edad = calcularEdad(fechaNacimiento);
    
    // Actualizar el campo de edad calculada
    const edadCalculadaField = document.getElementById('edadCalculada');
    if (edadCalculadaField) {
        edadCalculadaField.value = edad || '';
    }
    
    // Mostrar la edad calculada en consola para debugging
    if (edad) {
        console.log(`🎂 Edad calculada al 01 de febrero de 2026: ${edad}`);
    }
    
    return edad;
}

// Función para actualizar las especialidades según el nivel seleccionado
function actualizarEspecialidades() {
    const nivelSelect = document.getElementById('nivel');
    const especialidadSelect = document.getElementById('especialidad');
    
    if (!nivelSelect || !especialidadSelect) {
        console.log('❌ No se encontraron los elementos de nivel o especialidad');
        return;
    }
    
    const nivelSeleccionado = nivelSelect.value;
    console.log('📚 Nivel seleccionado:', nivelSeleccionado);
    
    // Limpiar opciones actuales (excepto la primera)
    especialidadSelect.innerHTML = '<option value="">Seleccione una especialidad</option>';
    
    // Obtener especialidades para el nivel seleccionado
    const especialidades = especialidadesPorNivel[nivelSeleccionado];
    
    if (especialidades) {
        console.log('🎯 Especialidades disponibles para', nivelSeleccionado, ':', especialidades);
        
        // Agregar opciones de especialidades
        especialidades.forEach(especialidad => {
            const option = document.createElement('option');
            option.value = especialidad.value;
            option.textContent = especialidad.text;
            especialidadSelect.appendChild(option);
        });
        
        // Si solo hay una opción (Sin especialidad), seleccionarla automáticamente
        if (especialidades.length === 1 && especialidades[0].value === 'Sin especialidad') {
            especialidadSelect.value = 'Sin especialidad';
            console.log('✅ Especialidad "Sin especialidad" seleccionada automáticamente para', nivelSeleccionado);
        }
        
        console.log(`✅ ${especialidades.length} especialidades cargadas para ${nivelSeleccionado}`);
    } else {
        console.log('❌ No se encontraron especialidades para el nivel:', nivelSeleccionado);
    }
}

// Función para inicializar las especialidades al cargar la página
function inicializarEspecialidades() {
    console.log('🚀 Inicializando especialidades...');
    
    // Agregar event listener al campo de nivel
    const nivelSelect = document.getElementById('nivel');
    if (nivelSelect) {
        nivelSelect.addEventListener('change', function() {
            console.log('🔄 Nivel cambió, actualizando especialidades...');
            actualizarEspecialidades();
        });
        console.log('✅ Event listener agregado al campo de nivel');
    } else {
        console.log('❌ No se encontró el campo de nivel');
    }
    
    // Actualizar especialidades con el valor inicial (si hay uno)
    actualizarEspecialidades();
}

// Función para inicializar la sincronización de cédula y búsqueda con Enter
function inicializarSincronizacionCedula() {
    console.log('🚀 Inicializando sincronización de cédula y búsqueda con Enter...');
    
    const cedulaConsultaField = document.getElementById('cedulaConsulta');
    const cedulaEstudianteField = document.getElementById('cedulaEstudiante');
    
    console.log('🔍 Campo de consulta encontrado:', !!cedulaConsultaField);
    console.log('🔍 Campo de estudiante encontrado:', !!cedulaEstudianteField);
    
    if (cedulaConsultaField) {
        // Agregar event listener para copiar cédula cuando se escriba
        cedulaConsultaField.addEventListener('input', function() {
            const cedula = this.value.trim();
            console.log('📝 Escribiendo en campo de consulta:', cedula);
            if (cedula && cedula.length >= 7) { // Solo si tiene al menos 7 dígitos
                console.log('📋 Copiando cédula al campo de estudiante:', cedula);
                copiarCedulaACampoEstudiante(cedula, false); // Sin mensaje para evitar spam
            }
        });
        
        // Agregar event listener para buscar cuando se presione Enter
        cedulaConsultaField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevenir comportamiento por defecto
                const cedula = this.value.trim();
                if (cedula) {
                    console.log('🔍 Enter presionado, ejecutando búsqueda...');
                    consultarEstudiante(); // Ejecutar búsqueda automáticamente
                } else {
                    mostrarMensaje('❌ Por favor ingrese un número de cédula', 'error');
                }
            }
        });
        
        console.log('✅ Event listeners agregados para sincronización de cédula y búsqueda con Enter');
    } else {
        console.log('❌ No se encontró el campo de consulta de cédula');
    }
}

// Función para sincronizar la cédula del campo de datos del estudiante al campo de consulta
function sincronizarCedulaAConsulta(cedula) {
    const cedulaConsultaField = document.getElementById('cedulaConsulta');
    if (cedulaConsultaField && cedula) {
        // Solo actualizar si el valor es diferente
        if (cedulaConsultaField.value !== cedula) {
            cedulaConsultaField.value = cedula;
            console.log(`📋 Cédula sincronizada al campo de consulta: ${cedula}`);
        }
    } else {
        console.log('❌ No se encontró el campo de consulta de cédula o la cédula está vacía');
    }
}

// Función de prueba para verificar la consulta
async function probarConsulta() {
    const config = getGoogleSheetsConfig();
    const testUrl = `${config.APPS_SCRIPT.WEB_APP_URL}?action=consulta&cedula=123456789`;
    
    console.log('🧪 Probando consulta con URL:', testUrl);
    
    try {
        const response = await fetch(testUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        console.log('📡 Respuesta de prueba:', response);
        console.log('📊 Status:', response.status);
        
        const responseText = await response.text();
        console.log('📄 Respuesta en texto:', responseText);
        
        try {
            const data = JSON.parse(responseText);
            console.log('✅ Datos de prueba parseados:', data);
            return data;
        } catch (parseError) {
            console.error('❌ Error parseando respuesta de prueba:', parseError);
            return null;
        }
    } catch (error) {
        console.error('❌ Error en prueba de consulta:', error);
        return null;
    }
}

// Función de prueba para verificar la sincronización de cédula
function probarSincronizacionCedula() {
    console.log('🧪 Probando sincronización de cédula...');
    
    // Verificar que los campos existan
    const cedulaConsultaField = document.getElementById('cedulaConsulta');
    const cedulaEstudianteField = document.getElementById('cedulaEstudiante');
    
    console.log('🔍 Campo de consulta encontrado:', !!cedulaConsultaField);
    console.log('🔍 Campo de estudiante encontrado:', !!cedulaEstudianteField);
    
    if (cedulaConsultaField && cedulaEstudianteField) {
        // Probar copiar de consulta a estudiante
        console.log('📝 Probando copia de consulta a estudiante...');
        cedulaConsultaField.value = '123456789';
        cedulaConsultaField.dispatchEvent(new Event('input'));
        
        setTimeout(() => {
            console.log('📊 Valor en campo de consulta:', cedulaConsultaField.value);
            console.log('📊 Valor en campo de estudiante:', cedulaEstudianteField.value);
            console.log('✅ Prueba de sincronización completada');
        }, 100);
    } else {
        console.log('❌ No se encontraron los campos necesarios para la prueba');
    }
}

// Función para verificar el estado de la sincronización
function verificarEstadoSincronizacion() {
    console.log('🔍 Verificando estado de la sincronización...');
    
    const cedulaConsultaField = document.getElementById('cedulaConsulta');
    const cedulaEstudianteField = document.getElementById('cedulaEstudiante');
    
    console.log('📊 Campo de consulta:', {
        existe: !!cedulaConsultaField,
        valor: cedulaConsultaField?.value || 'N/A',
        id: cedulaConsultaField?.id || 'N/A'
    });
    
    console.log('📊 Campo de estudiante:', {
        existe: !!cedulaEstudianteField,
        valor: cedulaEstudianteField?.value || 'N/A',
        id: cedulaEstudianteField?.id || 'N/A'
    });
    
    // Verificar si los event listeners están activos
    if (cedulaConsultaField) {
        console.log('📊 Event listeners en campo de consulta:', {
            input: cedulaConsultaField.oninput !== null,
            keypress: cedulaConsultaField.onkeypress !== null
        });
    }
}

