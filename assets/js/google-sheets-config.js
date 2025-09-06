// Google Sheets Configuration for CTP Agropecuario de Sabalito
// Configuración de Google Sheets para el formulario de matrícula

const GOOGLE_SHEETS_CONFIG = {
    // ID de la hoja de cálculo de Google Sheets
    SPREADSHEET_ID: '1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI',
    
    // URL de la hoja de cálculo
    SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI/edit?gid=0#gid=0',
    
    // Configuración de Google Apps Script (URL desplegada actualizada)
    APPS_SCRIPT: {
        WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbyMqp041MdxsJ4HO654NMCWfA-mkYfBo6ZIYW3vgamMKvz9x3czktj2PtoaXqbU4Nmcrw/exec',
        // O usa esta URL alternativa si prefieres Google Forms
        FORMS_URL: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform'
    },
    
    // Configuración de campos para la hoja de cálculo (39 columnas para envío de matrícula)
    // ⚠️ IMPORTANTE: Estos nombres deben coincidir EXACTAMENTE con las columnas de tu Google Sheet
    SHEET_COLUMNS: [
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
        'Enfermedad',                  // Columna R (17) - Enfermedad
        'Tipo de Enfermedad',          // Columna S (18) - Tipo de Enfermedad
        'Especialidad',                // Columna T (19) - Especialidad
        'Nivel',                       // Columna U (20) - Nivel
        'Sección',                     // Columna V (21) - Sección
        'Título',                      // Columna W (22) - Título
        'Celular estudiante',          // Columna X (23) - Celular estudiante
        'Encargada',                   // Columna Y (24) - Encargada
        'Cédula',                      // Columna Z (25) - Cédula de la madre
        'Celular',                     // Columna AA (26) - Celular de la madre
        'Parentesco',                  // Columna AB (27) - Parentesco
        'Vive con estud',              // Columna AC (28) - Vive con estudiante
        'Dirección exacta',            // Columna AD (29) - Dirección exacta
        'Encargado',                   // Columna AE (30) - Encargado
        'Cédula2',                     // Columna AF (31) - Cédula del padre
        'Celular2',                    // Columna AG (32) - Celular del padre
        'Parentezco2',                 // Columna AH (33) - Parentesco del padre
        'Otro Cel',                    // Columna AI (34) - Otro celular
        'Dirección2',                  // Columna AJ (35) - Dirección del padre
        'MOVIMIENTO'                   // Columna AK (36) - Movimiento
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
