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
    
    enfermedadSelect.addEventListener('change', function() {
        if (this.value === 'Sí') {
            detalleEnfermedadGroup.style.display = 'block';
        } else {
            detalleEnfermedadGroup.style.display = 'none';
            document.getElementById('detalleEnfermedad').value = '';
        }
    });
    
    // Form submission - allows incomplete fields
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading spinner
        loadingSpinner.style.display = 'block';
        form.style.display = 'none';
        
        try {
            const formData = collectFormData();
            await submitToGoogleSheets(formData);
            
            // Show success message
            successMessage.style.display = 'block';
            loadingSpinner.style.display = 'none';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
                form.style.display = 'block';
                resetForm();
            }, 3000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error al enviar el formulario. Por favor, inténtelo de nuevo.');
            
            // Hide loading spinner and show form again
            loadingSpinner.style.display = 'none';
            form.style.display = 'block';
        }
    });
    
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
                        this.style.borderColor = '#28a745'; // Verde si es válida
                    } else {
                        this.style.borderColor = '#dc3545'; // Rojo si es inválida
                        alert('Por favor ingrese una fecha válida en formato DD/MM/AAAA');
                        this.focus();
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
            // Optional validation feedback
            if (this.value.trim()) {
                this.style.borderColor = '#28a745'; // Green for filled fields
        } else {
                this.style.borderColor = '#e1e8ed'; // Default for empty fields
            }
        });
        
        field.addEventListener('input', function() {
            // Clear validation styling when user starts typing
            this.style.borderColor = '#e1e8ed';
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
        nivel: document.getElementById('nivel').value || '',
        especialidad: document.getElementById('especialidad').value || '',
        seccion: document.getElementById('seccion').value || '',
        
        // Student data
        primerApellido: document.getElementById('primerApellido').value || '',
        segundoApellido: document.getElementById('segundoApellido').value || '',
        nombre: nombreElement ? nombreElement.value || '' : '',           // ← Debug mejorado
        telefono: telefonoElement ? telefonoElement.value || '' : '',     // ← Debug mejorado
        cedula: cedulaElement ? cedulaElement.value || '' : '',           // ← Debug mejorado
        fechaNacimiento: document.getElementById('fechaNacimiento').value || '',
        nacionalidad: document.getElementById('nacionalidad').value || '',
        adecuacion: document.getElementById('adecuacion').value || '',
        rutaTransporte: document.getElementById('rutaTransporte').value || '',
        repitente: document.getElementById('repitente').value || '',
        enfermedad: document.getElementById('enfermedad').value || '',
        detalleEnfermedad: document.getElementById('detalleEnfermedad').value || '',
        
        // Mother/Guardian data
        nombreMadre: document.getElementById('nombreMadre').value || '',
        cedulaMadre: document.getElementById('cedulaMadre').value || '',
        telefonoMadre: document.getElementById('telefonoMadre').value || '',
        direccionMadre: document.getElementById('direccionMadre').value || '',
        parentescoMadre: document.getElementById('parentescoMadre').value || '',
        viveConEstudianteMadre: document.getElementById('viveConEstudianteMadre').value || '',
        
        // Father/Guardian data
        nombrePadre: document.getElementById('nombrePadre').value || '',
        cedulaPadre: document.getElementById('cedulaPadre').value || '',
        telefonoPadre: document.getElementById('telefonoPadre').value || '',
        direccionPadre: document.getElementById('direccionPadre').value || '',
        parentescoPadre: document.getElementById('parentescoPadre').value || '',
        viveConEstudiantePadre: document.getElementById('viveConEstudiantePadre').value || '',
        
        // Signatures and date
        firmaEncargada: document.getElementById('firmaEncargada').value || '',
        firmaEncargado: document.getElementById('firmaEncargado').value || '',
        fecha: document.getElementById('fecha').value || '',
        observaciones: document.getElementById('observaciones').value || ''
    };
    
    return formData;
}

// Submit to Google Sheets using Google Apps Script
async function submitToGoogleSheets(formData) {
    // Get configuration from google-sheets-config.js
    let config = {};
    if (typeof getGoogleSheetsConfig === 'function') {
        config = getGoogleSheetsConfig();
    }
    
    // Google Apps Script Web App URL
    const GOOGLE_APPS_SCRIPT_URL = config.APPS_SCRIPT?.WEB_APP_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    
    try {
        // First, try to submit to Google Apps Script
        // Get configuration from google-sheets-config.js
        let config = {};
        if (typeof getGoogleSheetsConfig === 'function') {
            config = getGoogleSheetsConfig();
        }
        
        const GOOGLE_APPS_SCRIPT_URL = config.APPS_SCRIPT?.WEB_APP_URL;
        
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
        
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formDataToSend
        });
        
        // Since we're using no-cors, we can't read the response
        // The success is assumed if no error is thrown
        console.log('✅ Datos enviados a Google Apps Script');
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

// Reset form
function resetForm() {
    document.getElementById('matriculaForm').reset();
    
    // Reset custom styling
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#e1e8ed';
    });
    
    // Hide illness detail field
    document.getElementById('detalleEnfermedadGroup').style.display = 'none';
    
    // Reset date to current date
    const today = new Date();
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        // Formatear la fecha como DD/MM/AAAA para edición manual
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        fechaInput.value = `${day}/${month}/${year}`;
    }
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

// Print form
function printForm() {
    window.print();
}

// Test form submission function
function testFormSubmission() {
    console.log('🧪 Iniciando prueba del formulario...');
    
    // Fill form with test data
    document.getElementById('nivel').value = 'Sétimo';
    document.getElementById('especialidad').value = 'Agropecuaria';
    document.getElementById('seccion').value = 'A';
    document.getElementById('primerApellido').value = 'González';
    document.getElementById('segundoApellido').value = 'Pérez';
    document.getElementById('nombreEstudiante').value = 'María';
    document.getElementById('telefonoEstudiante').value = '88888888';
    document.getElementById('cedulaEstudiante').value = '123456789';
    document.getElementById('fechaNacimiento').value = '2009-03-15';
    document.getElementById('adecuacion').value = 'No';
    document.getElementById('rutaTransporte').value = 'Ruta 1';
    document.getElementById('repitente').value = 'No';
    document.getElementById('enfermedad').value = 'No';
    document.getElementById('nombreMadre').value = 'Ana González';
    document.getElementById('cedulaMadre').value = '987654321';
    document.getElementById('telefonoMadre').value = '77777777';
    document.getElementById('direccionMadre').value = 'Sabalito, Coto Brus';
    document.getElementById('viveConEstudianteMadre').value = 'Sí';
    document.getElementById('nombrePadre').value = 'Carlos Pérez';
    document.getElementById('cedulaPadre').value = '456789123';
    document.getElementById('telefonoPadre').value = '66666666';
    document.getElementById('direccionPadre').value = 'Sabalito, Coto Brus';
    document.getElementById('viveConEstudiantePadre').value = 'Sí';
    document.getElementById('firmaEncargada').value = 'Ana González';
    document.getElementById('firmaEncargado').value = 'Carlos Pérez';
    document.getElementById('fecha').value = '15/01/2026';
    document.getElementById('observaciones').value = 'Estudiante nueva, excelente conducta';
    
    console.log('✅ Formulario llenado con datos de prueba');
    console.log('🚀 Ahora haz clic en "Enviar Matrícula" para probar');
    
    // Scroll to submit button
    document.querySelector('.btn-submit').scrollIntoView({ behavior: 'smooth' });
}

// Add print button functionality
document.addEventListener('DOMContentLoaded', function() {
    const printButton = document.createElement('button');
    printButton.type = 'button';
    printButton.className = 'btn-print';
    printButton.textContent = 'Imprimir Formulario';
    printButton.onclick = printForm;
    
    // Add print button to form actions
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
    formActions.appendChild(printButton);
    }
});

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    
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
    const cedula = document.getElementById('cedulaConsulta').value.trim();
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
                document.getElementById('detalleEnfermedadGroup').style.display = 'block';
            }
        }
    });
    
    // Handle date fields separately
    if (estudiante.fecha) {
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            // La fecha ya viene en formato DD/MM/AAAA, solo asignarla
            fechaInput.value = estudiante.fecha;
        }
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