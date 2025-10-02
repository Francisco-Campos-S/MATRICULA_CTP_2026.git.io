// Script simple para hacer que Firefox imprima igual que Chrome
(function() {
    // Detectar si estamos en Firefox
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    if (!isFirefox) {
        // Si no es Firefox, no hacemos nada
        return;
    }
    
    // Función para ajustar Firefox antes de imprimir
    function prepararFirefoxParaImprimir() {
        // Agregar clase al body para activar estilos específicos
        document.body.classList.add('firefox-printing');
         
        // Ajustar tamaño de textarea para evitar desbordamiento
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea._originalHeight = textarea.style.height;
            textarea.style.height = '40px';
        });
        
        // Asegurar que los encabezados tengan fondo verde
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
    }
    
    // Función para restaurar después de imprimir
    function restaurarDespuesDeImprimir() {
        document.body.classList.remove('firefox-printing');
        
        // Restaurar textarea
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (textarea._originalHeight !== undefined) {
                textarea.style.height = textarea._originalHeight;
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
    }
    
    // Escuchar evento de impresión
    window.addEventListener('beforeprint', prepararFirefoxParaImprimir);
    window.addEventListener('afterprint', restaurarDespuesDeImprimir);
    
    // Modificar la función de impresión existente si está presente
    document.addEventListener('DOMContentLoaded', function() {
        const btnImprimir = document.getElementById('btnPrint');
        if (btnImprimir) {
            // Guardamos la función original
            const originalOnClick = btnImprimir.onclick;
            
            // Sobreescribimos con nuestra función
            btnImprimir.onclick = function() {
                prepararFirefoxParaImprimir();
                window.print();
                setTimeout(restaurarDespuesDeImprimir, 500);
            };
        }
    });
})();
