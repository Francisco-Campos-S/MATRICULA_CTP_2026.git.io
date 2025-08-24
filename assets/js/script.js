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
    document.getElementById('mes').value = today.getMonth() + 1;
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
    const formData = {
        timestamp: new Date().toISOString(),
        nivel: document.getElementById('nivel').value || '',
        especialidad: document.getElementById('especialidad').value || '',
        seccion: document.getElementById('seccion').value || '',
        
        // Student data
        primerApellido: document.getElementById('primerApellido').value || '',
        segundoApellido: document.getElementById('segundoApellido').value || '',
        nombreEstudiante: document.getElementById('nombreEstudiante').value || '',
        telefonoEstudiante: document.getElementById('telefonoEstudiante').value || '',
        cedulaEstudiante: document.getElementById('cedulaEstudiante').value || '',
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
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
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
    link.setAttribute('download', `matricula_${formData.cedulaEstudiante || 'sin_cedula'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Print form
function printForm() {
    window.print();
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