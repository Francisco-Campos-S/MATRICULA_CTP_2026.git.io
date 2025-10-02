// Script simple para impresión que funciona en todos los navegadores
document.addEventListener('DOMContentLoaded', function() {
    // Obtener botón de impresión
    const printButton = document.getElementById('btnPrint');
    
    // Si existe el botón, modificar su comportamiento
    if (printButton) {
        printButton.addEventListener('click', function(e) {
            e.preventDefault(); // Evitar comportamiento predeterminado
            
            // Simple: solo imprimir
            window.print();
        });
    }
});
