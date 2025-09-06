# Nacionalidades Dinámicas - Matrícula CTP 2026

## Funcionalidad Implementada

El sistema ahora maneja las nacionalidades de manera inteligente con una lista desplegable de opciones comunes y la posibilidad de especificar nacionalidades personalizadas.

## Opciones de Nacionalidad Disponibles

### **Nacionalidades Predefinidas:**
- **Costarricense** - Nacionalidad costarricense
- **Panameña** - Nacionalidad panameña  
- **Nicaragüense** - Nacionalidad nicaragüense
- **Venezolana** - Nacionalidad venezolana
- **Otro** - Para nacionalidades no listadas

### **Campo Personalizado:**
Cuando se selecciona "Otro", aparece un campo de texto donde se puede escribir cualquier nacionalidad específica.

## Cómo Funciona

### **1. Selección de Nacionalidad Predefinida**
1. Usuario selecciona una nacionalidad de la lista (Costarricense, Panameña, etc.)
2. El campo personalizado se oculta automáticamente
3. La nacionalidad se guarda directamente

### **2. Selección de Nacionalidad Personalizada**
1. Usuario selecciona "Otro" del dropdown
2. Aparece un campo de texto "Especifique la nacionalidad"
3. El usuario escribe la nacionalidad deseada
4. El campo se vuelve obligatorio hasta que se complete

### **3. Validación Inteligente**
- Si se selecciona una nacionalidad predefinida, el campo personalizado se limpia
- Si se selecciona "Otro", el campo personalizado se vuelve obligatorio
- Al limpiar el formulario, ambos campos se resetean

## Implementación Técnica

### **HTML - Estructura de Campos**
```html
<!-- Grupo horizontal de nacionalidad (igual que tipo de identificación) -->
<div class="form-group horizontal-group" id="nacionalidadGroup">
    <div class="horizontal-field">
        <label for="nacionalidad">Nacionalidad:</label>
        <select id="nacionalidad" name="nacionalidad" onchange="mostrarNacionalidadOtro()">
            <option value="">Seleccione una nacionalidad</option>
            <option value="Costarricense">Costarricense</option>
            <option value="Panameña">Panameña</option>
            <option value="Nicaragüense">Nicaragüense</option>
            <option value="Venezolana">Venezolana</option>
            <option value="Otro">Otro</option>
        </select>
    </div>
    <div class="horizontal-field" id="nacionalidadOtroGroup" style="display: none;">
        <label for="nacionalidadOtro">Especifique la nacionalidad:</label>
        <input type="text" id="nacionalidadOtro" name="nacionalidadOtro" placeholder="Escriba la nacionalidad">
    </div>
</div>
```

### **JavaScript - Funciones Principales**

#### **`mostrarNacionalidadOtro()`**
- Se ejecuta cuando cambia la selección de nacionalidad
- Muestra/oculta el campo personalizado según la selección
- Cambia el layout de vertical a horizontal cuando se muestra el campo "Otro"
- Hace obligatorio el campo personalizado cuando es necesario

#### **`obtenerNacionalidad()`**
- Retorna la nacionalidad correcta para enviar a la base de datos
- Si es "Otro", retorna el valor del campo personalizado
- Si es predefinida, retorna el valor seleccionado

#### **`manejarNacionalidadEnFormulario(valor)`**
- Se usa al llenar el formulario con datos existentes
- Detecta si la nacionalidad es predefinida o personalizada
- Configura automáticamente los campos según el tipo

## Flujo de Usuario

### **Escenario 1: Nacionalidad Predefinida**
1. Usuario abre el dropdown de nacionalidad
2. Selecciona "Costarricense" (o cualquier opción predefinida)
3. El campo personalizado se oculta automáticamente
4. La nacionalidad se guarda como "Costarricense"

### **Escenario 2: Nacionalidad Personalizada**
1. Usuario abre el dropdown de nacionalidad
2. Selecciona "Otro"
3. Aparece el campo "Especifique la nacionalidad"
4. Usuario escribe "Colombiana" (o cualquier otra nacionalidad)
5. La nacionalidad se guarda como "Colombiana"

### **Escenario 3: Cambio de Selección**
1. Usuario selecciona "Otro" y escribe "Peruana"
2. Luego cambia a "Costarricense"
3. El campo personalizado se oculta y se limpia automáticamente
4. La nacionalidad se guarda como "Costarricense"

## Integración con Otras Funcionalidades

### **Carga de Datos de Prueba**
- Los datos de prueba incluyen "Costarricense" como nacionalidad
- Se selecciona automáticamente en el dropdown

### **Consulta de Estudiantes**
- Al consultar un estudiante existente, se detecta su nacionalidad
- Si es predefinida, se selecciona en el dropdown
- Si es personalizada, se configura "Otro" y se llena el campo personalizado

### **Limpieza de Formulario**
- Al limpiar el formulario, ambos campos se resetean
- El campo personalizado se oculta
- Se vuelve a la configuración inicial

## Validaciones

### **Campos Obligatorios**
- El campo principal de nacionalidad es obligatorio
- El campo personalizado es obligatorio solo cuando se selecciona "Otro"

### **Limpieza Automática**
- Al cambiar de "Otro" a una opción predefinida, el campo personalizado se limpia
- Al limpiar el formulario, ambos campos se resetean

### **Detección Inteligente**
- Al cargar datos existentes, se detecta automáticamente el tipo de nacionalidad
- Se configura la interfaz según corresponda

## Logs de Debugging

El sistema incluye logs detallados para facilitar el debugging:

```javascript
// Al mostrar/ocultar campo personalizado
console.log('🌍 Campo de nacionalidad personalizada mostrado');
console.log('🌍 Campo de nacionalidad personalizada ocultado');

// Al configurar nacionalidad en formulario
console.log('✅ Nacionalidad predefinida seleccionada: Costarricense');
console.log('✅ Nacionalidad personalizada configurada: Colombiana');
```

## Mantenimiento

### **Agregar Nuevas Nacionalidades Predefinidas**
Para agregar nuevas nacionalidades a la lista:

1. Editar el HTML en `index.html`:
```html
<option value="Nueva Nacionalidad">Nueva Nacionalidad</option>
```

2. Actualizar la lista en `manejarNacionalidadEnFormulario()`:
```javascript
const nacionalidadesPredefinidas = ['Costarricense', 'Panameña', 'Nicaragüense', 'Venezolana', 'Nueva Nacionalidad'];
```

### **Modificar Validaciones**
Para cambiar las validaciones:

1. Editar `mostrarNacionalidadOtro()` para cambiar cuándo se muestra el campo
2. Editar `obtenerNacionalidad()` para cambiar cómo se procesa la nacionalidad
3. Editar `manejarNacionalidadEnFormulario()` para cambiar la detección automática

## Casos de Uso Comunes

### **Estudiantes Costarricenses**
- Seleccionan "Costarricense" del dropdown
- No necesitan campo adicional

### **Estudiantes de Países Vecinos**
- Seleccionan "Panameña", "Nicaragüense" o "Venezolana"
- No necesitan campo adicional

### **Estudiantes de Otros Países**
- Seleccionan "Otro"
- Escriben su nacionalidad específica (ej: "Colombiana", "Mexicana", "Estadounidense")

### **Estudiantes con Nacionalidad Múltiple**
- Seleccionan "Otro"
- Escriben la nacionalidad principal o "Doble nacionalidad"

---

**Última actualización**: Enero 2025  
**Versión**: 1.0  
**Mantenido por**: Equipo de Desarrollo CTP Sabalito
