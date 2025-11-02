// Script directo para impresión con todos los datos visibles
(function() {
    // Función para obtener el valor de un elemento
    function getElementValue(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return '(No disponible)';
        
        // Manejo especial para discapacidad
        if (elementId === 'discapacidad') {
            const discapacidadSelect = element;
            const discapacidadOtro = document.getElementById('discapacidadOtro');
            
            if (discapacidadSelect.value === 'Otro' && discapacidadOtro) {
                return discapacidadOtro.value.trim() || '(No especificada)';
            } else {
                const selectedIndex = discapacidadSelect.selectedIndex;
                if (selectedIndex >= 0) {
                    let texto = discapacidadSelect.options[selectedIndex].text;
                    // Remover texto entre paréntesis solo para la impresión
                    return texto.replace(/\s*\([^)]*\)/g, '').trim();
                }
                return '(No seleccionada)';
            }
        }
        
        if (element.tagName === 'SELECT') {
            const selectedIndex = element.selectedIndex;
            return selectedIndex >= 0 ? element.options[selectedIndex].text : '(No seleccionado)';
        } else if (element.tagName === 'INPUT') {
            if (element.type === 'radio' || element.type === 'checkbox') {
                return element.checked ? element.value : '';
            }
            return element.value || '(Vacío)';
        }
        
        return '(No disponible)';
    }
    
    // Función para obtener el tipo de matrícula
    function getTipoMatricula() {
        const regularRadio = document.getElementById('regular');
        const planNacionalRadio = document.getElementById('planNacional');
        
        if (regularRadio && regularRadio.checked) {
            return "Regular CTP 2026";
        } else if (planNacionalRadio && planNacionalRadio.checked) {
            return "Plan Nacional 2026";
        }
        
        return "(No seleccionado)";
    }
    
    // Función para crear el bloque de información general
    function createInfoBlock() {
        // Crear el elemento
        const infoBlock = document.createElement('div');
        infoBlock.id = 'print-info-block';
        infoBlock.style.border = '1px solid black';
        infoBlock.style.padding = '5px';
        infoBlock.style.marginBottom = '10px';
        infoBlock.style.fontFamily = 'Arial, sans-serif';
        infoBlock.style.fontSize = '10pt';
        infoBlock.style.pageBreakInside = 'avoid';
        
        // Obtener valores
        const tipoMatricula = getTipoMatricula();
        const nivel = getElementValue('nivel');
        const especialidad = getElementValue('especialidad');
        const seccion = getElementValue('seccion');
        const rutaTransporte = getElementValue('rutaTransporte');
        
        // Crear tabla para mejor formato
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        
        // Añadir filas a la tabla
        const rows = [
            { label: 'TIPO DE MATRÍCULA:', value: tipoMatricula },
            { label: 'NIVEL:', value: nivel },
            { label: 'ESPECIALIDAD:', value: especialidad },
            { label: 'SECCIÓN:', value: seccion },
            { label: 'RUTA DE TRANSPORTE:', value: rutaTransporte }
        ];
        
        rows.forEach(row => {
            const tr = document.createElement('tr');
            
            const tdLabel = document.createElement('td');
            tdLabel.textContent = row.label;
            tdLabel.style.fontWeight = 'bold';
            tdLabel.style.width = '30%';
            tdLabel.style.padding = '2px 5px';
            tr.appendChild(tdLabel);
            
            const tdValue = document.createElement('td');
            tdValue.textContent = row.value;
            tdValue.style.padding = '2px 5px';
            tr.appendChild(tdValue);
            
            table.appendChild(tr);
        });
        
        infoBlock.appendChild(table);
        return infoBlock;
    }
    
    // Función para preparar el formulario para impresión
    function prepareFormForPrinting() {
        console.log('Preparando formulario para impresión');
        
        // Buscar la primera sección
        const firstSection = document.querySelector('.form-section');
        if (!firstSection) {
            console.error('No se encontró la primera sección');
            return;
        }
        
        // Asegurar que el campo de discapacidad personalizada sea visible si está seleccionado "Otro"
        const discapacidadSelect = document.getElementById('discapacidad');
        const discapacidadOtro = document.getElementById('discapacidadOtro');
        if (discapacidadSelect && discapacidadOtro && discapacidadSelect.value === 'Otro') {
            discapacidadOtro.style.display = 'block';
            discapacidadOtro.classList.add('print-visible');
        }
        
        // Crear bloque de información
        const infoBlock = createInfoBlock();
        
        // Insertar el bloque al inicio de la primera sección
        firstSection.insertBefore(infoBlock, firstSection.firstChild);
        
        // Mostrar firmas
        const printFirmas = document.querySelector('.print-firmas');
        if (printFirmas) {
            printFirmas.style.display = 'block';
        }
        
        // Asegurar que los encabezados sean verdes
        const headers = document.querySelectorAll('.section-header');
        headers.forEach(header => {
            header._originalBg = header.style.backgroundColor;
            header.style.backgroundColor = '#1B5E20';
            
            const title = header.querySelector('h2');
            if (title) {
                title._originalColor = title.style.color;
                title.style.color = 'white';
            }
        });
        
        console.log('Formulario preparado para impresión');
    }
    
    // Función para restaurar el formulario después de imprimir
    function restoreFormAfterPrinting() {
        console.log('Restaurando formulario después de impresión');
        
        // Eliminar el bloque de información
        const infoBlock = document.getElementById('print-info-block');
        if (infoBlock) {
            infoBlock.parentNode.removeChild(infoBlock);
        }
        
        // Ocultar firmas
        const printFirmas = document.querySelector('.print-firmas');
        if (printFirmas) {
            printFirmas.style.display = 'none';
        }
        
        // Restaurar encabezados
        const headers = document.querySelectorAll('.section-header');
        headers.forEach(header => {
            if (header._originalBg !== undefined) {
                header.style.backgroundColor = header._originalBg;
            }
            
            const title = header.querySelector('h2');
            if (title && title._originalColor !== undefined) {
                title.style.color = title._originalColor;
            }
        });
        
        console.log('Formulario restaurado');
    }
    
    // Función principal para manejar la impresión
    function handlePrint() {
        // Si ya estamos en proceso de impresión, no hacer nada
        if (document.body.classList.contains('printing')) {
            return;
        }
        
        try {
            // Marcar que estamos en proceso de impresión
            document.body.classList.add('printing');
            
            // Preparar el formulario
            prepareFormForPrinting();
            
            // Imprimir
            setTimeout(() => {
                window.print();
                
                // Restaurar después de un tiempo
                setTimeout(() => {
                    restoreFormAfterPrinting();
                    document.body.classList.remove('printing');
                }, 500);
            }, 200);
        } catch (e) {
            console.error('Error en el proceso de impresión:', e);
            document.body.classList.remove('printing');
        }
    }
    
    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM cargado, configurando manejador de impresión');
        
        // Asignar manejador al botón de imprimir
        const printButton = document.getElementById('btnPrint');
        if (printButton) {
            printButton.addEventListener('click', handlePrint);
            console.log('Manejador de impresión asignado al botón');
        } else {
            console.warn('Botón de impresión no encontrado');
        }
        
        // Escuchar el evento beforeprint del navegador
        window.addEventListener('beforeprint', function() {
            if (!document.body.classList.contains('printing')) {
                console.log('Evento beforeprint detectado');
                handlePrint();
            }
        });
    });
})();
