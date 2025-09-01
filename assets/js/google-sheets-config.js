// Google Sheets Configuration for CTP Agropecuario de Sabalito
// Configuración de Google Sheets para el formulario de matrícula

const GOOGLE_SHEETS_CONFIG = {
    // ID de la hoja de cálculo de Google Sheets
    SPREADSHEET_ID: '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI',
    
    // URL de la hoja de cálculo
    SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI/edit?gid=0#gid=0',
    
    // Configuración de Google Apps Script (debes crear esto)
    APPS_SCRIPT: {
        // ✅ CONFIGURADO: URL real de tu Google Apps Script
        WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbyFmC36fkkraO5amUr9rScr8rWiMUDK7ksqXK8FSCc0ci03NKw9Awo47lCy3tbJ3795Hw/exec',
        // O usa esta URL alternativa si prefieres Google Forms
        FORMS_URL: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform'
    },
    
    // Configuración de campos para la hoja de cálculo
    // ⚠️ IMPORTANTE: Estos nombres deben coincidir EXACTAMENTE con las columnas de tu Google Sheet
    SHEET_COLUMNS: [
        'Timestamp',
        'Nivel',
        'Especialidad',
        'Sección',
        'Primer Apellido',
        'Segundo Apellido',
        'Nombre',           // ← Cambiado de "Nombre Estudiante"
        'Teléfono',         // ← Cambiado de "Teléfono Estudiante"
        'Cédula',           // ← Cambiado de "Cédula Estudiante"
        'Fecha Nacimiento',
        'Nacionalidad',
        'Adecuación',
        'Ruta Transporte',
        'Repitente',
        'Enfermedad',
        'Detalle Enfermedad',
        'Nombre Madre',
        'Cédula Madre',
        'Teléfono Madre',
        'Dirección Madre',
        'Parentesco Madre',
        'Vive con Estudiante Madre',
        'Nombre Padre',
        'Cédula Padre',
        'Teléfono Padre',
        'Dirección Padre',
        'Parentesco Padre',
        'Vive con Estudiante Padre',
        'Firma Encargada',
        'Firma Encargado',
        'Fecha',
        'Observaciones'
    ],
    
    // Configuración de validación
    VALIDATION: {
        PHONE_REGEX: /^[0-9]{8}$/,
        CEDULA_REGEX: /^[0-9]{9}$/,
        REQUIRED_FIELDS: [
            'nivel',
            'especialidad',
            'seccion',
            'primerApellido',
            'nombreEstudiante',
            'cedulaEstudiante',
            'fechaNacimiento',
            'nombreMadre',
            'cedulaMadre',
            'telefonoMadre',
            'direccionMadre'
        ]
    }
};

// Función para obtener la configuración
function getGoogleSheetsConfig() {
    return GOOGLE_SHEETS_CONFIG;
}

// Función para verificar si la configuración está completa
function isConfigComplete() {
    const config = GOOGLE_SHEETS_CONFIG;
    return config.SPREADSHEET_ID && 
           (config.APPS_SCRIPT.WEB_APP_URL !== 'https://script.google.com/macros/s/TU_SCRIPT_ID_REAL/exec' &&
            config.APPS_SCRIPT.WEB_APP_URL.includes('script.google.com'));
}

// Función para mostrar advertencia de configuración
function showConfigWarning() {
    if (!isConfigComplete()) {
        console.warn('⚠️ Google Sheets no está completamente configurado.');
        console.warn('📝 Por favor, configura Google Apps Script o Google Forms.');
        console.warn('📚 Consulta el README.md para instrucciones detalladas.');
        
        // Mostrar mensaje al usuario
        const warningDiv = document.createElement('div');
        warningDiv.className = 'config-warning';
        warningDiv.innerHTML = `
            <strong>⚠️ Configuración Pendiente</strong>
            Para que el formulario funcione completamente, debes configurar Google Apps Script.<br>
            Consulta el archivo README.md para instrucciones detalladas.
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(warningDiv, container.firstChild);
        }

    }
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GOOGLE_SHEETS_CONFIG, getGoogleSheetsConfig, isConfigComplete, showConfigWarning };
}
