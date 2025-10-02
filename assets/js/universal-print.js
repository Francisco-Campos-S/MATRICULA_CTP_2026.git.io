// Script universal para impresión en Chrome y Firefox que produce resultados idénticos
(function() {
    // Función para preparar el formulario antes de imprimir
    function prepararFormularioParaImprimir() {
        // Ocultar elementos no necesarios
        const elementosNoImprimibles = document.querySelectorAll('.header, .consulta-section, .tipo-matricula-section, .nivel-especialidad-section');
        elementosNoImprimibles.forEach(elemento => {
            elemento._originalDisplay = elemento.style.display;
            elemento.style.display = 'none';
        });
        
        // Asegurar que las secciones tengan fondo verde
        const headers = document.querySelectorAll('.section-header');
        headers.forEach(header => {
            header._originalBg = header.style.backgroundColor;
            header._originalColor = header.style.color;
            header.style.backgroundColor = '#1B5E20';
            header.style.color = 'white';
            
            const title = header.querySelector('h2');
            if (title) {
                title._originalColor = title.style.color;
                title.style.color = 'white';
            }
        });
        
        // Asegurar que los textarea no sean demasiado altos
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea._originalHeight = textarea.style.height;
            textarea.style.height = '40px';
        });
        
        // Forzar que todos los elementos del formulario sean visibles
        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.overflow = 'visible';
            section.style.height = 'auto';
        });
        
        // Ocultar botones
        const buttons = document.querySelectorAll('button, .btn, .form-actions');
        buttons.forEach(button => {
            button._originalDisplay = button.style.display;
            button.style.display = 'none';
        });
    }
    
    // Función para restaurar el formulario después de imprimir
    function restaurarFormularioDespuesDeImprimir() {
        // Restaurar elementos no imprimibles
        const elementosNoImprimibles = document.querySelectorAll('.header, .consulta-section, .tipo-matricula-section, .nivel-especialidad-section');
        elementosNoImprimibles.forEach(elemento => {
            if (elemento._originalDisplay !== undefined) {
                elemento.style.display = elemento._originalDisplay;
            }
        });
        
        // Restaurar encabezados
        const headers = document.querySelectorAll('.section-header');
        headers.forEach(header => {
            if (header._originalBg !== undefined) {
                header.style.backgroundColor = header._originalBg;
            }
            if (header._originalColor !== undefined) {
                header.style.color = header._originalColor;
            }
            
            const title = header.querySelector('h2');
            if (title && title._originalColor !== undefined) {
                title.style.color = title._originalColor;
            }
        });
        
        // Restaurar textarea
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (textarea._originalHeight !== undefined) {
                textarea.style.height = textarea._originalHeight;
            }
        });
        
        // Restaurar botones
        const buttons = document.querySelectorAll('button, .btn, .form-actions');
        buttons.forEach(button => {
            if (button._originalDisplay !== undefined) {
                button.style.display = button._originalDisplay;
            }
        });
    }
    
    // Escuchar eventos de impresión del navegador
    window.addEventListener('beforeprint', prepararFormularioParaImprimir);
    window.addEventListener('afterprint', restaurarFormularioDespuesDeImprimir);
    
    // Modificar el botón de impresión existente
    document.addEventListener('DOMContentLoaded', function() {
        const btnImprimir = document.getElementById('btnPrint');
        if (btnImprimir) {
            btnImprimir.onclick = function() {
                prepararFormularioParaImprimir();
                setTimeout(() => {
                    window.print();
                    setTimeout(() => {
                        restaurarFormularioDespuesDeImprimir();
                    }, 500);
                }, 100);
            };
        }
    });
})();
