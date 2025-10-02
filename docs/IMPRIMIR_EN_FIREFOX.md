# Impresión en Firefox

Este documento explica los ajustes realizados para que el formulario se imprima correctamente en Firefox, de manera similar a Chrome.

## Solución Implementada

Hemos creado una solución mínima y no invasiva que consiste en:

1. **Archivo CSS específico para Firefox**: `firefox-print.css`
   - Contiene estilos que solo se aplican en Firefox durante la impresión
   - Usa la directiva `@-moz-document url-prefix()` para targetear solo Firefox

2. **Script JavaScript para ajustes dinámicos**: `firefox-print.js`
   - Detecta automáticamente si el navegador es Firefox
   - Aplica ajustes necesarios justo antes de imprimir
   - Restaura la apariencia normal después de imprimir

## Diferencias de impresión entre navegadores

Firefox y Chrome manejan la impresión de manera diferente. Algunos problemas específicos que resolvimos:

- **Manejo de espaciado**: Firefox tiende a aplicar márgenes y espaciado diferentes
- **Escalado del contenido**: Firefox puede necesitar un escalado ligeramente diferente para ajustar todo en una página
- **Colores y fondos**: Firefox tiene diferentes configuraciones predeterminadas para imprimir fondos de color

## Cómo funciona

1. Al cargar la página, se detecta si el navegador es Firefox
2. Cuando el usuario hace clic en "Imprimir" o usa Ctrl+P:
   - Se activan ajustes específicos para Firefox que hacen que el formulario se vea como en Chrome
   - Se ajustan elementos como textareas y encabezados para evitar desbordamientos
   - Los encabezados de sección mantienen su color verde

3. Después de imprimir, todo vuelve a la normalidad

## Testeo

Esta solución ha sido probada para asegurar que:
- El formulario se imprime en una sola página en Firefox
- La apariencia es similar a Chrome
- Todos los elementos del formulario son visibles
- Los encabezados mantienen su formato con fondo verde

## Mantenimiento

Si se realizan cambios en el diseño del formulario o en los estilos de impresión, es recomendable probar nuevamente la impresión tanto en Chrome como en Firefox para asegurar la compatibilidad.
