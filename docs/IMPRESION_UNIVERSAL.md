# Impresión Universal para Chrome y Firefox

Esta documentación explica la implementación de la solución universal de impresión que garantiza resultados consistentes tanto en Chrome como en Firefox.

## Problema Resuelto

Los navegadores Chrome y Firefox manejan la impresión de manera diferente, causando que el formulario:
1. Se mostrara incompleto en Firefox
2. Tuviera un formato diferente entre navegadores
3. No mantuviera los estilos (como encabezados verdes) en algunos casos

## Solución Implementada

Se ha implementado una solución que garantiza que el formulario se imprima exactamente igual en ambos navegadores:

### 1. CSS Universal (`universal-print.css`)

- Define un formato consistente para impresión en todos los navegadores
- Especifica dimensiones exactas de los elementos
- Agrega un título "BOLETA MATRÍCULA 2026" automáticamente en la impresión
- Incluye ajustes específicos para Firefox usando `@-moz-document url-prefix()`
- Garantiza que los encabezados se muestren con fondo verde
- Estructurados los elementos en 3 columnas para mejor uso del espacio

### 2. JavaScript Universal (`universal-print.js`)

- Prepara el documento antes de imprimir ocultando elementos innecesarios
- Aplica estilos de impresión de manera dinámica
- Restaura el documento a su estado normal después de imprimir
- Sobrescribe el comportamiento del botón de imprimir para aplicar los estilos
- Mantiene el formulario consistente entre todos los navegadores

## Cómo funciona

1. **Antes de imprimir**:
   - Se ocultan elementos no necesarios como botones y la sección de consulta
   - Se asegura que los encabezados tengan fondo verde
   - Se ajustan los tamaños de campos de texto

2. **Durante la impresión**:
   - Los estilos CSS se aplican para garantizar un formato consistente
   - El documento se estructura en una sola página
   - Los elementos mantienen su alineación y tamaño correctos

3. **Después de imprimir**:
   - Todos los elementos vuelven a su estado original
   - La interfaz del formulario se restaura completamente

## Ventajas de esta solución

- **Universal**: Funciona de manera idéntica en Chrome y Firefox
- **Simple**: No requiere código específico por navegador
- **Consistente**: Garantiza que la boleta de matrícula tenga siempre el mismo aspecto
- **Mantenible**: Fácil de actualizar si se hacen cambios al formulario

## Recomendaciones

Si se realizan cambios en el diseño del formulario, verificar la impresión en ambos navegadores para garantizar la consistencia.
