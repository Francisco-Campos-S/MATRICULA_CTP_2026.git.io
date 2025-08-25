// Form handling and Google Sheets integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('matriculaForm');
    const successMessage = document.getElementById('successMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Theme toggle functionality
    initializeThemeToggle();
    
    // Cargar datos guardados al iniciar
    loadSavedFormData();
    
    // Guardar datos automáticamente al cambiar cualquier campo
    setupAutoSave();
    
    // Configurar especialidades según el nivel seleccionado
    setupEspecialidadesPorNivel();
    
    // Show configuration warning if needed
    if (typeof showConfigWarning === 'function') {
        showConfigWarning();
    }
    
    // Show/hide illness detail field based on selection
    const enfermedadSelect = document.getElementById('enfermedad');
    const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
    
    if (enfermedadSelect && detalleEnfermedadGroup) {
        enfermedadSelect.addEventListener('change', function() {
            if (this.value === 'Sí') {
                detalleEnfermedadGroup.style.display = 'block';
            } else {
                detalleEnfermedadGroup.style.display = 'none';
                const detalleEnfermedad = document.getElementById('detalleEnfermedad');
                if (detalleEnfermedad) detalleEnfermedad.value = '';
            }
        });
    }
    
    // Form submission - allows incomplete fields
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('🚀 Iniciando envío del formulario...');
            
            // Show loading spinner
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            if (form) form.style.display = 'none';
            
            try {
                console.log('📝 Recolectando datos del formulario...');
                const formData = collectFormData();
                console.log('📊 Datos recolectados:', formData);
                
                console.log('📤 Enviando a Google Sheets...');
                const result = await submitToGoogleSheets(formData);
                console.log('✅ Resultado del envío:', result);
                
                // Show success message
                if (successMessage) successMessage.style.display = 'block';
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                
                // Reset form immediately after successful submission
                resetForm();
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'none';
                    if (form) form.style.display = 'block';
                }, 3000);
                
            } catch (error) {
                console.error('❌ Error submitting form:', error);
                alert('Error al enviar el formulario: ' + error.message + '\nPor favor, inténtelo de nuevo.');
                
                // Hide loading spinner and show form again
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (form) form.style.display = 'block';
            }
        });
    }
    
    // Auto-fill current date
    const today = new Date();
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        // Formatear la fecha como DD/MM/AAAA para edición manual
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        fechaInput.value = `${day}/${month}/${year}`;
        
        // Agregar funcionalidad de calendario al hacer clic
        fechaInput.addEventListener('click', function() {
            // Crear un input temporal de tipo date para mostrar el calendario
            const tempDateInput = document.createElement('input');
            tempDateInput.type = 'date';
            tempDateInput.style.position = 'absolute';
            tempDateInput.style.left = '-9999px';
            tempDateInput.style.opacity = '0';
            
            // Convertir la fecha actual del input al formato YYYY-MM-DD
            const currentDate = this.value;
            if (currentDate && currentDate.includes('/')) {
                const parts = currentDate.split('/');
                if (parts.length === 3) {
                    const day = parts[0];
                    const month = parts[1];
                    const year = parts[2];
                    tempDateInput.value = `${year}-${month}-${day}`;
                }
            }
            
            document.body.appendChild(tempDateInput);
            tempDateInput.focus();
            tempDateInput.click();
            
            // Escuchar cambios en el input temporal
            tempDateInput.addEventListener('change', function() {
                if (this.value) {
                    const date = new Date(this.value);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    fechaInput.value = `${day}/${month}/${year}`;
                }
                document.body.removeChild(tempDateInput);
            });
            
            // Si se cancela, remover el input temporal
            tempDateInput.addEventListener('blur', function() {
                setTimeout(() => {
                    if (document.body.contains(tempDateInput)) {
                        document.body.removeChild(tempDateInput);
                    }
                }, 100);
            });
        });
        
        // Validar formato de fecha al escribir manualmente
        fechaInput.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Permitir solo números y barras
            value = value.replace(/[^0-9/]/g, '');
            
            // Auto-insertar barras
            if (value.length === 2 && !value.includes('/')) {
                value += '/';
            }
            if (value.length === 5 && value.split('/').length === 2) {
                value += '/';
            }
            
            // Limitar a 10 caracteres (DD/MM/AAAA)
            if (value.length <= 10) {
                e.target.value = value;
            }
        });
        
        // Validar fecha al perder el foco
        fechaInput.addEventListener('blur', function() {
            const value = this.value;
            if (value && value.includes('/')) {
                const parts = value.split('/');
                if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]);
                    const year = parseInt(parts[2]);
                    
                    // Validar rango de fechas
                    if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2025 && year <= 2027) {
                        // Solo aplicar color verde si NO estamos imprimiendo
                        if (!document.body.classList.contains('printing')) {
                            this.style.borderColor = '#28a745'; // Verde si es válida
                        }
                    } else {
                        // Solo aplicar color rojo si NO estamos imprimiendo
                        if (!document.body.classList.contains('printing')) {
                            this.style.borderColor = '#dc3545'; // Rojo si es inválida
                            alert('Por favor ingrese una fecha válida en formato DD/MM/AAAA');
                            this.focus();
                        }
                    }
                }
            }
        });
    }
    
    // Add optional validation feedback (not blocking)
    addOptionalValidation();
    
    // Initialize consulta functionality
    const btnConsultar = document.getElementById('btnConsultar');
    if (btnConsultar) {
        btnConsultar.addEventListener('click', consultarEstudiante);
    }
    
    // Allow Enter key in consulta input
    const cedulaConsulta = document.getElementById('cedulaConsulta');
    if (cedulaConsulta) {
        cedulaConsulta.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                consultarEstudiante();
            }
        });
    }
});

// Add optional validation feedback (not blocking submission)
function addOptionalValidation() {
    const fields = document.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
        field.addEventListener('blur', function() {
            // Solo aplicar colores si NO estamos imprimiendo
            if (!document.body.classList.contains('printing')) {
                // Optional validation feedback
                if (this.value.trim()) {
                    this.style.borderColor = '#28a745'; // Green for filled fields
                } else {
                    this.style.borderColor = '#e1e8ed'; // Default for empty fields
                }
            }
        });
        
        field.addEventListener('input', function() {
            // Solo aplicar colores si NO estamos imprimiendo
            if (!document.body.classList.contains('printing')) {
                // Clear validation styling when user starts typing
                this.style.borderColor = '#e1e8ed';
            }
        });
    });
}

// Collect form data - allows empty values
function collectFormData() {
    const formData = {
        timestamp: new Date().toISOString(),
        nivel: document.getElementById('nivel')?.value || '',
        especialidad: document.getElementById('especialidad')?.value || '',
        seccion: document.getElementById('seccion')?.value || '',
        
        // Student data
        primerApellido: document.getElementById('primerApellido')?.value || '',
        segundoApellido: document.getElementById('segundoApellido')?.value || '',
        nombre: document.getElementById('nombreEstudiante')?.value || '',
        telefono: document.getElementById('telefonoEstudiante')?.value || '',
        cedula: document.getElementById('cedulaEstudiante')?.value || '',
        fechaNacimiento: document.getElementById('fechaNacimiento')?.value || '',
        nacionalidad: document.getElementById('nacionalidad')?.value || '',
        adecuacion: document.getElementById('adecuacion')?.value || '',
        rutaTransporte: document.getElementById('rutaTransporte')?.value || '',
        repitente: document.getElementById('repitente')?.value || '',
        enfermedad: document.getElementById('enfermedad')?.value || '',
        detalleEnfermedad: document.getElementById('detalleEnfermedad')?.value || '',
        
        // Mother/Guardian data
        nombreMadre: document.getElementById('nombreMadre')?.value || '',
        cedulaMadre: document.getElementById('cedulaMadre')?.value || '',
        telefonoMadre: document.getElementById('telefonoMadre')?.value || '',
        direccionMadre: document.getElementById('direccionMadre')?.value || '',
        parentescoMadre: document.getElementById('parentescoMadre')?.value || '',
        viveConEstudianteMadre: document.getElementById('viveConEstudianteMadre')?.value || '',
        
        // Father/Guardian data
        nombrePadre: document.getElementById('nombrePadre')?.value || '',
        cedulaPadre: document.getElementById('cedulaPadre')?.value || '',
        telefonoPadre: document.getElementById('telefonoPadre')?.value || '',
        direccionPadre: document.getElementById('direccionPadre')?.value || '',
        parentescoPadre: document.getElementById('parentescoPadre')?.value || '',
        viveConEstudiantePadre: document.getElementById('viveConEstudiantePadre')?.value || '',
        
        // Signatures and date
        firmaEncargada: document.getElementById('firmaEncargada')?.value || '',
        firmaEncargado: document.getElementById('firmaEncargado')?.value || '',
        fecha: document.getElementById('fecha')?.value || '',
        observaciones: document.getElementById('observaciones')?.value || ''
    };
    
    return formData;
}

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    
    if (!themeIcon || !themeText) return;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button
        updateThemeButton(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        
        console.log(`🎨 Tema cambiado a: ${newTheme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}`);
    });
}

function updateThemeButton(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    
    if (!themeIcon || !themeText) return;
    
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Modo Claro';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Modo Oscuro';
    }
}

// Función para imprimir el formulario como boleta de matrícula
function printForm() {
    // Obtener el nombre del estudiante y la sección para el nombre del archivo
    const nombreEstudiante = document.getElementById('nombreEstudiante')?.value || 'Estudiante';
    const primerApellido = document.getElementById('primerApellido')?.value || '';
    const segundoApellido = document.getElementById('segundoApellido')?.value || '';
    const seccion = document.getElementById('seccion')?.value || 'Seccion';
    const nivel = document.getElementById('nivel')?.value || 'Nivel';
    
    // Crear nombre del archivo
    const apellidos = [primerApellido, segundoApellido].filter(ap => ap.trim()).join('_');
    const nombreCompleto = apellidos ? `${apellidos}_${nombreEstudiante}` : nombreEstudiante;
    const nombreArchivo = `Boleta_Matricula_${nombreCompleto}_${nivel}_${seccion}_2026`;
    
    // LIMPIAR TODOS LOS COLORES VERDES ANTES DE IMPRIMIR
    clearAllGreenColors();
    
    // Ocultar elementos que no queremos en la impresión
    const elementsToHide = document.querySelectorAll('.header, .form-actions, .consulta-section, .app-footer');
    elementsToHide.forEach(el => el.style.display = 'none');
    
    // Mostrar elementos de impresión
    const printElements = document.querySelectorAll('.print-header, .print-section-title, .print-footer');
    printElements.forEach(el => el.style.display = 'block');
    
    // Aplicar estilos de impresión temporalmente
    document.body.classList.add('printing');
    
    // Configurar el nombre del archivo antes de imprimir
    const originalTitle = document.title;
    document.title = nombreArchivo;
    
    // Imprimir
    window.print();
    
    // Restaurar la vista después de la impresión
    setTimeout(() => {
        elementsToHide.forEach(el => el.style.display = '');
        printElements.forEach(el => el.style.display = 'none');
        document.body.classList.remove('printing');
        document.title = originalTitle;
    }, 1000);
    
    console.log(`🖨️ Imprimiendo boleta para: ${nombreArchivo}`);
}

// Función para limpiar todos los colores verdes
function clearAllGreenColors() {
    const allInputs = document.querySelectorAll('input, select, textarea');
    
    allInputs.forEach(input => {
        // LIMPIEZA NUCLEAR para TODOS los campos - FORZAR NEGRO
        input.style.borderColor = '#000';
        input.style.borderBottomColor = '#000';
        input.style.borderTopColor = '#000';
        input.style.borderLeftColor = '#000';
        input.style.borderRightColor = '#000';
        
        // Usar setProperty con !important para mayor prioridad
        input.style.setProperty('border-color', '#000', 'important');
        input.style.setProperty('border-bottom-color', '#000', 'important');
        input.style.setProperty('border-top-color', '#000', 'important');
        input.style.setProperty('border-left-color', '#000', 'important');
        input.style.setProperty('border-right-color', '#000', 'important');
        
        // Limpiar cualquier estilo inline que pueda tener colores
        if (input.style.cssText.includes('28a745') || 
            input.style.cssText.includes('40, 167, 69') ||
            input.style.cssText.includes('dc3545') ||
            input.style.cssText.includes('220, 53, 69') ||
            input.style.cssText.includes('green') ||
            input.style.cssText.includes('rgb(40, 167, 69)')) {
            
            // Forzar todos los bordes a negro
            input.style.setProperty('border-color', '#000', 'important');
            input.style.setProperty('border-bottom-color', '#000', 'important');
            input.style.setProperty('border-top-color', '#000', 'important');
            input.style.setProperty('border-left-color', '#000', 'important');
            input.style.setProperty('border-right-color', '#000', 'important');
        }
    });
    
    // LIMPIEZA NUCLEAR para textarea - QUITAR TODOS LOS RECUADROS
    const allTextareas = document.querySelectorAll('textarea');
    allTextareas.forEach(textarea => {
        // Resetear TODOS los estilos de borde
        textarea.style.border = 'none';
        textarea.style.borderTop = 'none';
        textarea.style.borderLeft = 'none';
        textarea.style.borderRight = 'none';
        textarea.style.borderBottom = '1px solid #000';
        textarea.style.borderRadius = '0';
        textarea.style.boxShadow = 'none';
        textarea.style.outline = 'none';
        textarea.style.backgroundColor = 'transparent';
        
        // Forzar estilos específicos
        textarea.style.setProperty('border', 'none', 'important');
        textarea.style.setProperty('border-top', 'none', 'important');
        textarea.style.setProperty('border-left', 'none', 'important');
        textarea.style.setProperty('border-right', 'none', 'important');
        textarea.style.setProperty('border-bottom', '1px solid #000', 'important');
        textarea.style.setProperty('border-radius', '0', 'important');
        textarea.style.setProperty('box-shadow', 'none', 'important');
        textarea.style.setProperty('outline', 'none', 'important');
        textarea.style.setProperty('background-color', 'transparent', 'important');
    });
    
    // LIMPIEZA ESPECÍFICA para Observaciones Adicionales
    const observacionesTextarea = document.querySelector('textarea[name="observacionesAdicionales"]');
    if (observacionesTextarea) {
        // Aplicar limpieza nuclear específica
        observacionesTextarea.style.cssText = `
            border: none !important;
            border-bottom: 1px solid #000 !important;
            background: transparent !important;
            box-shadow: none !important;
            outline: none !important;
            border-radius: 0 !important;
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            border-width: 0 0 1px 0 !important;
            border-style: none none solid none !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 20px !important;
            padding: 0 !important;
            margin: 0 !important;
        `;
        
        console.log('🧹 Recuadro de Observaciones Adicionales limpiado nuclearmente');
    }
    
    // LIMPIEZA ADICIONAL para campos específicos que suelen tener colores
    const signatureInputs = document.querySelectorAll('input[name*="firma"], input[placeholder*="firma"], input[placeholder*="Firma"]');
    signatureInputs.forEach(input => {
        input.style.setProperty('border-color', '#000', 'important');
        input.style.setProperty('border-bottom-color', '#000', 'important');
        input.style.setProperty('border-top-color', '#000', 'important');
        input.style.setProperty('border-left-color', '#000', 'important');
        input.style.setProperty('border-right-color', '#000', 'important');
    });
    
    console.log('🧹 TODOS los colores verdes y recuadros limpiados nuclearmente');
}

// Función para resetear el formulario (sin limpiar localStorage)
function resetForm() {
    const form = document.getElementById('matriculaForm');
    if (form) form.reset();
    
    // Ocultar el campo de detalle de enfermedad
    const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
    if (detalleEnfermedadGroup) {
        detalleEnfermedadGroup.style.display = 'none';
    }
    
    // Restablecer la fecha actual
    const today = new Date();
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        fechaInput.value = `${day}/${month}/${year}`;
    }
    
    console.log('✅ Formulario reseteado (datos guardados mantenidos)');
}

// Función para limpiar completamente el formulario y localStorage
function limpiarFormularioCompleto() {
    const form = document.getElementById('matriculaForm');
    if (form) form.reset();
    
    // Ocultar el campo de detalle de enfermedad
    const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
    if (detalleEnfermedadGroup) {
        detalleEnfermedadGroup.style.display = 'none';
    }
    
    // Restablecer la fecha actual
    const today = new Date();
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        fechaInput.value = `${day}/${month}/${year}`;
    }
    
    // Limpiar datos guardados en localStorage
    clearSavedData();
    
    console.log('✅ Formulario completamente limpiado y datos guardados eliminados');
}

// Submit to Google Sheets using Google Apps Script
async function submitToGoogleSheets(formData) {
    console.log('🔧 Iniciando submitToGoogleSheets...');
    
    // Get configuration from google-sheets-config.js
    let config = {};
    if (typeof getGoogleSheetsConfig === 'function') {
        config = getGoogleSheetsConfig();
        console.log('✅ Configuración obtenida:', config);
    } else {
        console.log('❌ Función getGoogleSheetsConfig no disponible');
        throw new Error('Función getGoogleSheetsConfig no disponible');
    }
    
    try {
        // First, try to submit to Google Apps Script
        const GOOGLE_APPS_SCRIPT_URL = config.APPS_SCRIPT?.WEB_APP_URL;
        console.log('🔗 URL de Google Apps Script:', GOOGLE_APPS_SCRIPT_URL);
        
        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes('TU_SCRIPT_ID_REAL')) {
            throw new Error('Google Apps Script no está configurado');
        }
        
        // Debug: Log los datos que se van a enviar
        console.log('📤 Datos a enviar:', formData);
        console.log('📤 FormData completo:', JSON.stringify(formData, null, 2));
        
        // Debug: Verificar campos específicos
        console.log('🔍 Verificación de campos críticos:');
        console.log('formData.nombre:', formData.nombre);
        console.log('formData.telefono:', formData.telefono);
        console.log('formData.cedula:', formData.cedula);
        
        // Convertir JSON a FormData para compatibilidad
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
            console.log(`📝 Enviando campo: ${key} = ${formData[key]}`);
        });
        
        // Debug: Verificar FormData
        console.log('🔍 FormData creado:');
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`FormData[${key}] = ${value}`);
        }
        
        console.log('🌐 Realizando fetch a:', GOOGLE_APPS_SCRIPT_URL);
        
        // Intentar primero con URLSearchParams (más compatible con Apps Script)
        console.log('🔄 Intentando envío con URLSearchParams...');
        
        const urlParams = new URLSearchParams();
        Object.keys(formData).forEach(key => {
            urlParams.append(key, formData[key]);
        });
        
        // Cambiar a modo 'no-cors' para mejor compatibilidad con Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlParams.toString()
        });
        
        console.log('📡 Respuesta del fetch:', response);
        console.log('📡 Status:', response.status);
        console.log('📡 StatusText:', response.statusText);
        
        // Con no-cors, siempre asumimos éxito si no hay error
        console.log('✅ Datos enviados exitosamente con URLSearchParams (no-cors)');
        return true;
        
    } catch (error) {
        console.log('❌ Google Apps Script failed, trying alternative method...');
        // Fallback to Google Forms method
        return await submitToGoogleForms(formData);
    }
}

// Alternative method using Google Forms (more reliable)
async function submitToGoogleForms(formData) {
    // Get configuration from google-sheets-config.js
    let config = {};
    if (typeof getGoogleSheetsConfig === 'function') {
        config = getGoogleSheetsConfig();
    }
    
    // Create a Google Form and get the pre-filled URL
    const googleFormUrl = config.APPS_SCRIPT?.FORMS_URL || 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';
    const formUrl = new URL(googleFormUrl);
    
    // Add form data as URL parameters (only non-empty values)
    Object.keys(formData).forEach(key => {
        if (formData[key] && formData[key] !== '') {
            formUrl.searchParams.append(key, formData[key]);
        }
    });
    
    // Open the form in a new window/tab
    window.open(formUrl.toString(), '_blank');
    
    console.log('📝 Formulario abierto en Google Forms');
    return true;
}

// Function to consult student by cédula
async function consultarEstudiante() {
    const cedula = document.getElementById('cedulaConsulta')?.value?.trim();
    const mensajeConsulta = document.getElementById('mensajeConsulta');
    
    if (!cedula) {
        mostrarMensajeConsulta('Por favor, ingrese un número de cédula', 'error');
        return;
    }
    
    // Show loading message
    mostrarMensajeConsulta('🔍 Buscando estudiante...', 'info');
    
    try {
        // Get configuration
        let config = {};
        console.log('🔧 Verificando función getGoogleSheetsConfig:', typeof getGoogleSheetsConfig);
        
        if (typeof getGoogleSheetsConfig === 'function') {
            config = getGoogleSheetsConfig();
            console.log('✅ Configuración obtenida:', config);
        } else {
            console.log('❌ Función getGoogleSheetsConfig no disponible');
            mostrarMensajeConsulta('Error: Configuración de Google Sheets no disponible', 'error');
            return;
        }
        
        if (!config.APPS_SCRIPT || !config.APPS_SCRIPT.WEB_APP_URL) {
            console.log('❌ URL de Apps Script no encontrada en:', config);
            mostrarMensajeConsulta('Error: URL de Google Apps Script no configurada', 'error');
            return;
        }
        
        // Create the consulta URL
        const consultaUrl = config.APPS_SCRIPT.WEB_APP_URL + '?action=consulta&cedula=' + encodeURIComponent(cedula);
        
        console.log('🔍 Consultando URL:', consultaUrl);
        
        // Make the actual API call to Google Apps Script
        const response = await fetch(consultaUrl);
        console.log('📡 Respuesta del servidor:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 Datos recibidos:', data);
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        const estudianteEncontrado = data;
        
        if (estudianteEncontrado) {
            rellenarFormularioConEstudiante(estudianteEncontrado);
            mostrarMensajeConsulta('✅ Estudiante encontrado y formulario rellenado', 'success');
            
            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                const mensajeConsulta = document.getElementById('mensajeConsulta');
                if (mensajeConsulta) {
                    mensajeConsulta.style.opacity = '0';
                    setTimeout(() => {
                        mensajeConsulta.style.display = 'none';
                        mensajeConsulta.style.opacity = '1';
                    }, 300);
                }
            }, 3000);
        } else {
            mostrarMensajeConsulta('❌ No se encontró estudiante con esa cédula', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error en consulta:', error);
        mostrarMensajeConsulta('❌ Error al consultar: ' + error.message, 'error');
    }
}

// Función para rellenar formulario con datos del estudiante
function rellenarFormularioConEstudiante(estudiante) {
    console.log('📝 Rellenando formulario con datos del estudiante:', estudiante);
    
    // Map the student data to form fields
    const fieldMappings = {
        'nivel': estudiante.nivel,
        'especialidad': estudiante.especialidad,
        'seccion': estudiante.seccion,
        'primerApellido': estudiante.primerApellido,
        'segundoApellido': estudiante.segundoApellido,
        'nombreEstudiante': estudiante.nombre,
        'telefonoEstudiante': estudiante.telefono,
        'cedulaEstudiante': estudiante.cedula,
        'fechaNacimiento': estudiante.fechaNacimiento,
        'nacionalidad': estudiante.nacionalidad,
        'adecuacion': estudiante.adecuacion,
        'rutaTransporte': estudiante.rutaTransporte,
        'repitente': estudiante.repitente,
        'enfermedad': estudiante.enfermedad,
        'detalleEnfermedad': estudiante.detalleEnfermedad || '',
        'nombreMadre': estudiante.nombreMadre,
        'cedulaMadre': estudiante.cedulaMadre,
        'telefonoMadre': estudiante.telefonoMadre,
        'direccionMadre': estudiante.direccionMadre,
        'parentescoMadre': estudiante.parentescoMadre,
        'viveConEstudianteMadre': estudiante.viveConEstudianteMadre,
        'nombrePadre': estudiante.nombrePadre,
        'cedulaPadre': estudiante.cedulaPadre,
        'telefonoPadre': estudiante.telefonoPadre,
        'direccionPadre': estudiante.direccionPadre,
        'parentescoPadre': estudiante.parentescoPadre,
        'viveConEstudiantePadre': estudiante.viveConEstudiantePadre,
        'firmaEncargada': estudiante.firmaEncargada,
        'firmaEncargado': estudiante.firmaEncargado,
        'observaciones': estudiante.observaciones
    };
    
    // Fill each field
    Object.keys(fieldMappings).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = fieldMappings[fieldId];
            
            // Special handling for date fields
            if (fieldId === 'fechaNacimiento' && estudiante.fechaNacimiento) {
                // Convert date format if needed
                const fecha = new Date(estudiante.fechaNacimiento);
                if (!isNaN(fecha.getTime())) {
                    element.value = fecha.toISOString().split('T')[0];
                }
            }
            
            // Special handling for illness detail
            if (fieldId === 'enfermedad' && estudiante.enfermedad === 'Sí') {
                const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
                if (detalleEnfermedadGroup) {
                    detalleEnfermedadGroup.style.display = 'block';
                }
            }
        }
    });
    
    // Handle date fields separately - SIEMPRE establecer la fecha actual al consultar
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        // Establecer la fecha actual (fecha de la consulta) sin importar si ya tenía fecha
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        fechaInput.value = `${day}/${month}/${year}`;
        
        console.log(`📅 Fecha de matrícula establecida como fecha actual: ${day}/${month}/${year}`);
    }
    
    // Guardar automáticamente los datos del estudiante cargado en localStorage
    saveFormData();
    
    console.log('✅ Formulario rellenado exitosamente y datos guardados automáticamente');
}

// Show consultation message
function mostrarMensajeConsulta(mensaje, tipo) {
    const mensajeConsulta = document.getElementById('mensajeConsulta');
    if (mensajeConsulta) {
        // Limpiar cualquier timeout anterior
        if (mensajeConsulta.timeoutId) {
            clearTimeout(mensajeConsulta.timeoutId);
        }
        
        // Mostrar el mensaje con transición suave
        mensajeConsulta.style.display = 'block';
        mensajeConsulta.style.opacity = '0';
        mensajeConsulta.textContent = mensaje;
        mensajeConsulta.className = 'mensaje-consulta ' + tipo;
        
        // Fade in
        setTimeout(() => {
            mensajeConsulta.style.opacity = '1';
        }, 10);
        
        // Solo auto-ocultar mensajes de éxito, no los de error
        if (tipo === 'success') {
            mensajeConsulta.timeoutId = setTimeout(() => {
                // Fade out
                mensajeConsulta.style.opacity = '0';
                setTimeout(() => {
                    mensajeConsulta.style.display = 'none';
                    mensajeConsulta.style.opacity = '1';
                }, 300);
            }, 3000);
        }
    }
}

// Función para configurar las especialidades según el nivel seleccionado
function setupEspecialidadesPorNivel() {
    const nivelSelect = document.getElementById('nivel');
    const especialidadSelect = document.getElementById('especialidad');
    
    if (!nivelSelect || !especialidadSelect) return;
    
    // Agregar event listener para cambios en el nivel
    nivelSelect.addEventListener('change', function() {
        updateEspecialidades(this.value);
    });
    
    // Configurar especialidades iniciales
    updateEspecialidades(nivelSelect.value);
}

// Función para actualizar las especialidades según el nivel
function updateEspecialidades(nivel) {
    const especialidadSelect = document.getElementById('especialidad');
    if (!especialidadSelect) return;
    
    // Limpiar opciones existentes
    especialidadSelect.innerHTML = '';
    
    // Agregar opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccione una especialidad';
    especialidadSelect.appendChild(defaultOption);
    
    // Definir especialidades por nivel
    const especialidadesPorNivel = {
        'Sétimo': [
            'Agropecuaria',
            'Informática',
            'Turismo',
            'Administración'
        ],
        'Octavo': [
            'Agropecuaria',
            'Informática',
            'Turismo',
            'Administración'
        ],
        'Noveno': [
            'Agropecuaria',
            'Informática',
            'Turismo',
            'Administración'
        ],
        'Décimo': [
            'Contabilidad',
            'Organización de empresas de Turismo Rural',
            'Procesos productivos e inspección en la Industria Alimentaria',
            'Producción Agrícola y Pecuaria'
        ],
        'Undécimo': [
            'Contabilidad',
            'Organización de empresas de Turismo Rural',
            'Procesos productivos e inspección en la Industria Alimentaria',
            'Producción Agrícola y Pecuaria'
        ],
        'Duodécimo': [
            'Contabilidad',
            'Organización de empresas de Turismo Rural',
            'Procesos productivos e inspección en la Industria Alimentaria',
            'Producción Agrícola y Pecuaria'
        ]
    };
    
    // Obtener especialidades para el nivel seleccionado
    const especialidades = especialidadesPorNivel[nivel] || [];
    
    // Agregar opciones de especialidades
    especialidades.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad;
        option.textContent = especialidad;
        especialidadSelect.appendChild(option);
    });
    
    console.log(`🎯 Especialidades actualizadas para nivel: ${nivel}`);
}

// ===== FUNCIONES DE GUARDADO AUTOMÁTICO =====

// Función para guardar datos del formulario en localStorage
function saveFormData() {
    const form = document.getElementById('matriculaForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const dataToSave = {};
    
    // Guardar todos los campos del formulario
    for (let [key, value] of formData.entries()) {
        dataToSave[key] = value;
    }
    
    // Guardar en localStorage
    localStorage.setItem('matriculaFormData', JSON.stringify(dataToSave));
    console.log('💾 Datos del formulario guardados automáticamente');
}

// Función para cargar datos guardados del formulario
function loadSavedFormData() {
    const savedData = localStorage.getItem('matriculaFormData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        const form = document.getElementById('matriculaForm');
        if (!form) return;
        
        // Restaurar cada campo
        Object.keys(data).forEach(fieldName => {
            const element = document.getElementById(fieldName);
            if (element && data[fieldName]) {
                element.value = data[fieldName];
                
                // Manejar campos especiales
                if (fieldName === 'enfermedad' && data[fieldName] === 'Sí') {
                    const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
                    if (detalleEnfermedadGroup) {
                        detalleEnfermedadGroup.style.display = 'block';
                    }
                }
            }
        });
        
        console.log('📂 Datos del formulario restaurados desde localStorage');
    } catch (error) {
        console.error('❌ Error al cargar datos guardados:', error);
    }
}

// Función para configurar el guardado automático
function setupAutoSave() {
    const form = document.getElementById('matriculaForm');
    if (!form) return;
    
    // Guardar datos cada vez que cambie un campo
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });
    
    console.log('🔄 Guardado automático configurado');
}

// Función para limpiar datos guardados (llamada desde resetForm)
function clearSavedData() {
    localStorage.removeItem('matriculaFormData');
    console.log('🗑️ Datos guardados eliminados');
}

// Función para cargar datos de prueba en el formulario
function cargarDatosPrueba() {
    console.log('🧪 Cargando datos de prueba...');
    
    // Datos de prueba para llenar el formulario
    const datosPrueba = {
        'nivel': 'Décimo',
        'especialidad': 'Contabilidad',
        'seccion': 'A',
        'primerApellido': 'González',
        'segundoApellido': 'López',
        'nombreEstudiante': 'María José',
        'telefonoEstudiante': '8991-4536',
        'cedulaEstudiante': '123456789',
        'fechaNacimiento': '2008-05-15',
        'nacionalidad': 'Costarricense',
        'adecuacion': 'No',
        'rutaTransporte': 'Ruta 1',
        'repitente': 'No',
        'enfermedad': 'No',
        'nombreMadre': 'Ana María López',
        'cedulaMadre': '987654321',
        'telefonoMadre': '2784-0616',
        'direccionMadre': 'Puntarenas, Coto Brus, 600 metros sureste de la tostadora de Café Río Brus',
        'parentescoMadre': 'Madre',
        'viveConEstudianteMadre': 'Sí',
        'nombrePadre': 'Carlos González',
        'cedulaPadre': '456789123',
        'telefonoPadre': '8991-4537',
        'direccionPadre': 'Puntarenas, Coto Brus, 600 metros sureste de la tostadora de Café Río Brus',
        'parentescoPadre': 'Padre',
        'viveConEstudiantePadre': 'Sí',
        'firmaEncargada': 'Ana María López',
        'firmaEncargado': 'Carlos González',
        'observaciones': 'Estudiante con buen rendimiento académico'
    };
    
    // Llenar cada campo del formulario
    Object.keys(datosPrueba).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = datosPrueba[fieldId];
            
            // Manejar campos especiales
            if (fieldId === 'enfermedad' && datosPrueba[fieldId] === 'Sí') {
                const detalleEnfermedadGroup = document.getElementById('detalleEnfermedadGroup');
                if (detalleEnfermedadGroup) {
                    detalleEnfermedadGroup.style.display = 'block';
                }
            }
        }
    });
    
    // Establecer fecha actual
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        fechaInput.value = `${day}/${month}/${year}`;
    }
    
    // Actualizar especialidades según el nivel
    updateEspecialidades('Décimo');
    
    // Guardar los datos de prueba en localStorage
    saveFormData();
    
    console.log('✅ Datos de prueba cargados exitosamente');
}

