# Diagnóstico: Problema con Plan Nacional en Chrome

## Problema Reportado
- ✅ Firefox: El envío funciona correctamente en Plan Nacional
- ❌ Chrome: La animación de "Enviando..." aparece pero los datos no llegan
- ✅ Regular: Funciona bien en ambos navegadores

## Checklist de Diagnóstico

### 1. Verificar que las hojas existen en Google Sheets
- [ ] Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/1NycwEzSs5YPmVWzcUtRTHDfO4xvyWL7PDlGngVIJ9zI/edit
- [ ] Verifica que tengas estas dos hojas (pestañas):
  - [ ] `REGULAR CTP 2026` (debe existir)
  - [ ] `PLAN NACIONAL 2026` (debe existir - si no existe, CREAR AHORA)

### 2. Verificar que el Google Apps Script está deplorado
- [ ] El Apps Script debe tener un deployment activo
- [ ] URL debe ser: `https://script.google.com/macros/s/AKfycbxi5M4J-DtFVi5RSIfDtCfGF2_yo2Wj07ZgRD7A6PL4uM1_iTdeemspmMM4UfDRCyDPIw/exec`

### 3. Prueba en Consola (F12 - Pestaña Console)

#### 3.1 Abre la consola de Chrome (F12)
- Vé a la pestaña "Console"

#### 3.2 Intenta enviar un formulario en Plan Nacional
- Selecciona "Plan Nacional" como tipo de matrícula
- Completa los datos del formulario
- Presiona "Enviar"

#### 3.3 En la consola deberías ver estos logs:
```
🔍 Tipo de matrícula en enviarFormulario: <input ...>
🔍 Valor del tipo: planNacional
🔍 Tipo de dato: string
🔍 ¿Es regular? false
🔍 ¿Es planNacional? true

🚀 Enviando datos a Google Sheets
📝 Tipo de matrícula: planNacional
🎯 Hoja destino: PLAN NACIONAL 2026
🔗 URL de Apps Script: https://script.google.com/macros/s/AKfycbxi5M4J-DtFVi5RSIfDtCfGF2_yo2Wj07ZgRD7A6PL4uM1_iTdeemspmMM4UfDRCyDPIw/exec
📦 Datos a enviar: {...}

📊 Enviando XX columnas
📋 Parámetros: ...

⏳ Iniciando fetch...
✅ Respuesta recibida
📊 Estado de la respuesta: 0
🔍 Tipo de respuesta: opaque
✅ Envío completado exitosamente
```

### 4. Si no ves los logs
- [ ] Verifica que los datos se están recolectando correctamente
- [ ] Revisa si hay errores de JavaScript en la consola (línea roja)

### 5. Diferencias entre Chrome y Firefox

#### Firefox (funciona):
- Maneja mejor las peticiones con `mode: 'no-cors'`
- Permitebetas más solicitudes cruzadas

#### Chrome (no funciona):
- Puede ser más estricto con CORS
- Posible problema: **Las hojas no existen o el nombre no es exacto**
- Posible problema: **El valor de tipoMatricula se está truncando**

## Solución Potencial

Si las hojas existen pero sigue sin funcionar:

1. **Verifica el nombre exacto de las hojas** (sin espacios extra, con mayúsculas correctas)
   - Debe ser: `PLAN NACIONAL 2026` (sin espacios extra)
   - Debe ser: `REGULAR CTP 2026` (sin espacios extra)

2. **Abre el Apps Script** y ejecuta la función `verificarColumnas()` para ver:
   - Si las hojas existen
   - Cuántas columnas tienen
   - Cuál es el nombre exacto

## Próximos Pasos

1. Copia estos logs de la consola
2. Verifica que las hojas existen
3. Ejecuta `verificarColumnas()` en el Apps Script
4. Comparte los resultados
