// Form handling and Google Sheets integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('matriculaForm');
    const successMessage = document.getElementById('successMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
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
    document.getElementById('dia').value = today.getDate();
    document.getElementById('mes').value = today.getMonth() + 1; // El select usa valores 1-12
    document.getElementById('anio').value = today.getFullYear();
    
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
        fecha: `${document.getElementById('dia').value || ''}/${document.getElementById('mes').value || ''}/${document.getElementById('anio').value || ''}`,
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
    document.getElementById('dia').value = today.getDate();
    document.getElementById('mes').value = today.getMonth() + 1;
    document.getElementById('anio').value = today.getFullYear();
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
    document.getElementById('dia').value = '15';
    document.getElementById('mes').value = '1';
    document.getElementById('anio').value = '2026';
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
        } else {
            mostrarMensajeConsulta('❌ No se encontró estudiante con esa cédula', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error en consulta:', error);
        mostrarMensajeConsulta('❌ Error al consultar: ' + error.message, 'error');
    }
}

// Simulate student consultation (temporary until Apps Script is updated)
async function simularConsultaEstudiante(cedula) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in real implementation, this would come from Google Sheets
    const estudiantesMock = {
        '123456789': {
            nivel: 'Sétimo',
            especialidad: 'Agropecuaria',
            seccion: 'A',
            primerApellido: 'González',
            segundoApellido: 'Pérez',
            nombre: 'María José',
            telefono: '8888-8888',
            cedula: '123456789',
            fechaNacimiento: '2008-05-15',
            nacionalidad: 'Costarricense',
            adecuacion: 'No',
            rutaTransporte: 'Ruta 1',
            repitente: 'No',
            enfermedad: 'No',
            nombreMadre: 'Ana Pérez',
            cedulaMadre: '987654321',
            telefonoMadre: '7777-7777',
            direccionMadre: 'San José, Costa Rica',
            parentescoMadre: 'Madre',
            viveConEstudianteMadre: 'Sí',
            nombrePadre: 'Carlos González',
            cedulaPadre: '111222333',
            telefonoPadre: '6666-6666',
            direccionPadre: 'San José, Costa Rica',
            parentescoPadre: 'Padre',
            viveConEstudiantePadre: 'Sí',
            firmaEncargada: 'Ana Pérez',
            firmaEncargado: 'Carlos González',
            fecha: '15/01/2026',
            observaciones: 'Estudiante existente consultado por cédula'
        },
        '987654321': {
            nivel: 'Octavo',
            especialidad: 'Informática',
            seccion: 'B',
            primerApellido: 'Rodríguez',
            segundoApellido: 'López',
            nombre: 'Juan Carlos',
            telefono: '9999-9999',
            cedula: '987654321',
            fechaNacimiento: '2007-03-20',
            nacionalidad: 'Costarricense',
            adecuacion: 'Sí',
            rutaTransporte: 'Ruta 2',
            repitente: 'No',
            enfermedad: 'Sí',
            detalleEnfermedad: 'Asma leve',
            nombreMadre: 'Carmen López',
            cedulaMadre: '555666777',
            telefonoMadre: '5555-5555',
            direccionMadre: 'Heredia, Costa Rica',
            parentescoMadre: 'Madre',
            parentescoMadre: 'Madre',
            viveConEstudianteMadre: 'Sí',
            nombrePadre: 'Roberto Rodríguez',
            cedulaPadre: '333444555',
            telefonoPadre: '4444-4444',
            direccionPadre: 'Heredia, Costa Rica',
            parentescoPadre: 'Padre',
            viveConEstudiantePadre: 'No',
            firmaEncargada: 'Carmen López',
            firmaEncargado: 'Roberto Rodríguez',
            fecha: '15/01/2026',
            observaciones: 'Estudiante con adecuación y asma leve'
        }
    };
    
    return estudiantesMock[cedula] || null;
}

// Fill form with student data
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
        const fechaParts = estudiante.fecha.split('/');
        if (fechaParts.length === 3) {
            document.getElementById('dia').value = fechaParts[0];
            // El select del mes espera valores 1-12, no strings
            const mes = parseInt(fechaParts[1]);
            if (!isNaN(mes) && mes >= 1 && mes <= 12) {
                document.getElementById('mes').value = mes;
            }
            document.getElementById('anio').value = fechaParts[2];
        }
    }
    
    console.log('✅ Formulario rellenado exitosamente');
}

// Show consultation message
function mostrarMensajeConsulta(mensaje, tipo) {
    const mensajeConsulta = document.getElementById('mensajeConsulta');
    if (mensajeConsulta) {
        mensajeConsulta.textContent = mensaje;
        mensajeConsulta.className = 'mensaje-consulta ' + tipo;
    }
}