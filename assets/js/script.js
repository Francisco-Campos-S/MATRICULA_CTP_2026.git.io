// Form handling and Google Sheets integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('matriculaForm');
    const successMessage = document.getElementById('successMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Theme toggle functionality
    initializeThemeToggle();
    
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
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'none';
                    if (form) form.style.display = 'block';
                    resetForm();
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
    // Debug: Verificar que los elementos del DOM existan
    const nombreElement = document.getElementById('nombreEstudiante');
    const telefonoElement = document.getElementById('telefonoEstudiante');
    const cedulaElement = document.getElementById('cedulaEstudiante');
    
    console.log('🔍 Elementos del DOM:');
    console.log('nombreEstudiante:', nombreElement);
    console.log('telefonoEstudiante:', telefonoElement);
    console.log('cedulaEstudiante:', cedulaElement);
    
    // Debug: Verificar los valores directamente
    console.log('🔍 Valores de los campos:');
    console.log('nombreEstudiante.value:', nombreElement ? nombreElement.value : 'ELEMENTO NO ENCONTRADO');
    console.log('telefonoEstudiante.value:', telefonoElement ? telefonoElement.value : 'ELEMENTO NO ENCONTRADO');
    console.log('cedulaEstudiante.value:', cedulaElement ? cedulaElement.value : 'ELEMENTO NO ENCONTRADO');
    
    // Debug: Verificar si los elementos están en el DOM
    console.log('🔍 Verificación del DOM:');
    console.log('document.getElementById("nombreEstudiante"):', document.getElementById('nombreEstudiante'));
    console.log('document.getElementById("telefonoEstudiante"):', document.getElementById('telefonoEstudiante'));
    console.log('document.getElementById("cedulaEstudiante"):', document.getElementById('cedulaEstudiante'));
    
    const formData = {
        timestamp: new Date().toISOString(),
        nivel: document.getElementById('nivel')?.value || '',
        especialidad: document.getElementById('especialidad')?.value || '',
        seccion: document.getElementById('seccion')?.value || '',
        
        // Student data
        primerApellido: document.getElementById('primerApellido')?.value || '',
        segundoApellido: document.getElementById('segundoApellido')?.value || '',
        nombre: nombreElement ? nombreElement.value || '' : '',
        telefono: telefonoElement ? telefonoElement.value || '' : '',
        cedula: cedulaElement ? cedulaElement.value || '' : '',
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
        // Limpiar cualquier color verde o rojo
        if (input.style.borderColor === '#28a745' || 
            input.style.borderColor === '#dc3545' ||
            input.style.borderColor === 'rgb(40, 167, 69)' ||
            input.style.borderColor === 'rgb(220, 53, 69)') {
            input.style.borderColor = '#000';
            input.style.borderBottomColor = '#000';
        }
        
        // Limpiar cualquier estilo inline que pueda tener colores
        if (input.style.cssText.includes('28a745') || 
            input.style.cssText.includes('40, 167, 69') ||
            input.style.cssText.includes('dc3545') ||
            input.style.cssText.includes('220, 53, 69')) {
            input.style.borderColor = '#000';
            input.style.borderBottomColor = '#000';
        }
    });
    
    console.log('🧹 Colores verdes limpiados antes de imprimir');
}

// Función para resetear el formulario
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
    
    console.log('✅ Formulario reseteado');
}

// Export form data as CSV (for backup purposes)
function exportAsCSV(formData) {
    const headers = Object.keys(formData);
    const csvContent = [
        headers.join(','),
        Object.values(formData).map(value => `"${value || ''}"`).join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `matricula_${formData.cedula || 'sin_cedula'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Test form submission function
function testFormSubmission() {
    console.log('🧪 Iniciando prueba del formulario...');
    
    // Fill form with test data
    const testFields = {
        'nivel': 'Sétimo',
        'especialidad': 'Agropecuaria',
        'seccion': 'A',
        'primerApellido': 'González',
        'segundoApellido': 'Pérez',
        'nombreEstudiante': 'María',
        'telefonoEstudiante': '88888888',
        'cedulaEstudiante': '123456789',
        'fechaNacimiento': '2009-03-15',
        'adecuacion': 'No',
        'rutaTransporte': 'Ruta 1',
        'repitente': 'No',
        'enfermedad': 'No',
        'nombreMadre': 'Ana González',
        'cedulaMadre': '987654321',
        'telefonoMadre': '77777777',
        'direccionMadre': 'Sabalito, Coto Brus',
        'viveConEstudianteMadre': 'Sí',
        'nombrePadre': 'Carlos Pérez',
        'cedulaPadre': '456789123',
        'telefonoPadre': '66666666',
        'direccionPadre': 'Sabalito, Coto Brus',
        'viveConEstudiantePadre': 'Sí',
        'firmaEncargada': 'Ana González',
        'firmaEncargado': 'Carlos Pérez',
        'fecha': '15/01/2026',
        'observaciones': 'Estudiante nueva, excelente conducta'
    };
    
    // Fill each field safely
    Object.keys(testFields).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = testFields[fieldId];
        }
    });
    
    console.log('✅ Formulario llenado con datos de prueba');
    console.log('🚀 Ahora haz clic en "Enviar Matrícula" para probar');
    
    // Scroll to submit button
    const submitButton = document.querySelector('.btn-submit');
    if (submitButton) {
        submitButton.scrollIntoView({ behavior: 'smooth' });
    }
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

// ===== FUNCIONALIDAD DE CONSULTA DE ESTUDIANTES =====

// Initialize consulta functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
    
    console.log('✅ Formulario rellenado exitosamente');
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
