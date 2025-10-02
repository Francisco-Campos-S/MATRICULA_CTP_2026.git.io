// Script para impresión en una sola página - versión precisa con datos de la parte superior
(function() {
    // Función para obtener el valor de un selector
    function getSelectedValue(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return '';
        
        if (element.tagName === 'SELECT') {
            const selected = element.options[element.selectedIndex];
            return selected ? selected.text : '';
        } else if (element.tagName === 'INPUT') {
            return element.value || '';
        }
        
        return '';
    }

    // Función para obtener el valor del tipo de matrícula
    function getTipoMatricula() {
        if (document.getElementById('regular') && document.getElementById('regular').checked) {
            return "Regular CTP 2026";
        } else if (document.getElementById('planNacional') && document.getElementById('planNacional').checked) {
            return "Plan Nacional 2026";
        }
        return "";
    }
    
    // Función para configurar atributos de datos
    function setupDataAttributes() {
        // Obtener la primera sección
        const firstSection = document.querySelector('.form-section:first-of-type');
        if (!firstSection) return;
        
        // Obtener los valores
        const tipoMatricula = getTipoMatricula();
        const nivel = getSelectedValue('nivel');
        const especialidad = getSelectedValue('especialidad');
        const seccion = getSelectedValue('seccion');
        const rutaTransporte = getSelectedValue('rutaTransporte');
        
        // Establecer atributos de datos
        firstSection.setAttribute('data-tipo-matricula', tipoMatricula || '(No seleccionado)');
        firstSection.setAttribute('data-nivel', nivel || '(No seleccionado)');
        firstSection.setAttribute('data-especialidad', especialidad || '(No seleccionado)');
        firstSection.setAttribute('data-seccion', seccion || '(No seleccionado)');
        firstSection.setAttribute('data-ruta', rutaTransporte || '(No seleccionado)');
    }
    
    // Función para manejar la impresión
    function handlePrint() {
        // Verificar si estamos ya en modo impresión
        if (document.body.classList.contains('printing')) return;
        
        try {
            // Marcar el cuerpo como en impresión
            document.body.classList.add('printing');
            
            // Configurar los atributos de datos para la impresión
            setupDataAttributes();
            
            // Mostrar elementos que deben ser visibles en impresión
            const printFirmas = document.querySelector('.print-firmas');
            if (printFirmas) {
                printFirmas.style.display = 'block';
            }
            
            // Asegurar que los encabezados de sección tengan fondo verde
            const headers = document.querySelectorAll('.section-header');
            headers.forEach(header => {
                header.style.backgroundColor = '#1B5E20';
                header.style.color = 'white';
                
                const title = header.querySelector('h2');
                if (title) {
                    title.style.color = 'white';
                }
            });
            
            // Ajustar tamaño de textareas
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.dataset.originalHeight = textarea.style.height || '';
                textarea.style.height = '20px';
            });
            
            // Ajustar las columnas para mejor distribución
            document.querySelectorAll('.form-row').forEach(row => {
                row.dataset.originalDisplay = row.style.display || '';
                row.style.display = 'flex';
            });
            
            // Iniciar la impresión
            window.print();
            
            // Restaurar después de imprimir (con un pequeño retraso)
            setTimeout(function() {
                // Restaurar textareas
                textareas.forEach(textarea => {
                    if (textarea.dataset.originalHeight) {
                        textarea.style.height = textarea.dataset.originalHeight;
                    }
                });
                
                // Restaurar las filas
                document.querySelectorAll('.form-row').forEach(row => {
                    if (row.dataset.originalDisplay) {
                        row.style.display = row.dataset.originalDisplay;
                    }
                });
                
                // Volver a ocultar elementos de impresión
                if (printFirmas) {
                    printFirmas.style.display = 'none';
                }
                
                // Quitar marcador de impresión
                document.body.classList.remove('printing');
                
            }, 1000);
        } catch (e) {
            console.error('Error al imprimir:', e);
            document.body.classList.remove('printing');
        }
    }
    
    // Vincular al botón de impresión cuando la página esté lista
    document.addEventListener('DOMContentLoaded', function() {
        const printButton = document.getElementById('btnPrint');
        if (printButton) {
            printButton.addEventListener('click', handlePrint);
        }
        
        // También vincular a la función de impresión del navegador
        window.addEventListener('beforeprint', function() {
            // Si no estamos ya en modo impresión, preparar
            if (!document.body.classList.contains('printing')) {
                handlePrint();
            }
        });
    });
})();