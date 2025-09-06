# Especialidades Dinámicas por Nivel - Matrícula CTP 2026

## Funcionalidad Implementada

El sistema ahora maneja las especialidades de manera dinámica según el nivel educativo seleccionado, siguiendo la estructura académica del Colegio Técnico Profesional Agropecuario de Sabalito.

## Estructura de Especialidades por Nivel

### **Grados Básicos (7°, 8°, 9°)**
- **Sétimo**: Solo "Sin especialidad"
- **Octavo**: Solo "Sin especialidad"  
- **Noveno**: Solo "Sin especialidad"

### **Grados Técnicos (10°, 11°, 12°)**

#### **10° (Décimo)**
- Contabilidad
- Organización de empresas de Turismo Rural
- Procesos productivos e inspección en la Industria Alimentaria
- Producción Agrícola y Pecuaria

#### **11° (Undécimo)**
- Contabilidad y Finanzas
- Turismo Rural
- Procesos productivos e inspección en la Industria Alimentaria
- Producción Agrícola y Pecuaria

#### **12° (Duodécimo)**
- Contabilidad
- Turismo Rural
- Agroindustria Alimentaria con Tecnología Agrícola
- Producción Agrícola y Pecuaria

## Cómo Funciona

### **1. Selección de Nivel**
Cuando el usuario selecciona un nivel en el dropdown "Nivel", automáticamente se actualizan las opciones disponibles en "Especialidad".

### **2. Actualización Automática**
- **Para grados básicos (7°, 8°, 9°)**: Se muestra solo "Sin especialidad" y se selecciona automáticamente
- **Para grados técnicos (10°, 11°, 12°)**: Se muestran las especialidades correspondientes y el usuario debe seleccionar una

### **3. Validación**
- El campo "Especialidad" es obligatorio
- Solo se pueden seleccionar especialidades válidas para el nivel elegido

## Implementación Técnica

### **JavaScript - Mapeo de Especialidades**
```javascript
const especialidadesPorNivel = {
    'Sétimo': [
        { value: 'Sin especialidad', text: 'Sin especialidad' }
    ],
    'Octavo': [
        { value: 'Sin especialidad', text: 'Sin especialidad' }
    ],
    'Noveno': [
        { value: 'Sin especialidad', text: 'Sin especialidad' }
    ],
    'Décimo': [
        { value: 'Contabilidad', text: 'Contabilidad' },
        { value: 'Organización de empresas de Turismo Rural', text: 'Organización de empresas de Turismo Rural' },
        { value: 'Procesos productivos e inspección en la Industria Alimentaria', text: 'Procesos productivos e inspección en la Industria Alimentaria' },
        { value: 'Producción Agrícola y Pecuaria', text: 'Producción Agrícola y Pecuaria' }
    ],
    // ... más niveles
};
```

### **Funciones Principales**

#### **`actualizarEspecialidades()`**
- Se ejecuta cuando cambia el nivel seleccionado
- Limpia las opciones actuales de especialidad
- Carga las especialidades correspondientes al nivel
- Selecciona automáticamente "Sin especialidad" para grados básicos

#### **`inicializarEspecialidades()`**
- Se ejecuta al cargar la página
- Agrega el event listener al campo de nivel
- Inicializa las especialidades con el valor por defecto

## Flujo de Usuario

### **Escenario 1: Estudiante de 7°, 8° o 9°**
1. Usuario selecciona "Sétimo", "Octavo" o "Noveno"
2. El sistema automáticamente:
   - Carga solo "Sin especialidad" en el dropdown
   - Selecciona "Sin especialidad" automáticamente
3. El usuario puede proceder con el resto del formulario

### **Escenario 2: Estudiante de 10°, 11° o 12°**
1. Usuario selecciona "Décimo", "Undécimo" o "Duodécimo"
2. El sistema carga las especialidades correspondientes
3. El usuario debe seleccionar una especialidad de la lista
4. El usuario puede proceder con el resto del formulario

## Integración con Otras Funcionalidades

### **Carga de Datos de Prueba**
- Los datos de prueba incluyen un nivel (Décimo) y especialidad (Contabilidad)
- El sistema actualiza automáticamente las especialidades al cargar los datos

### **Consulta de Estudiantes**
- Al consultar un estudiante existente, se cargan sus datos incluyendo nivel y especialidad
- El sistema actualiza las especialidades según el nivel del estudiante consultado

### **Limpieza de Formulario**
- Al limpiar el formulario, se resetean las especialidades
- Se vuelve a la configuración inicial

## Logs de Debugging

El sistema incluye logs detallados para facilitar el debugging:

```javascript
// Al cambiar nivel
console.log('📚 Nivel seleccionado:', nivelSeleccionado);
console.log('🎯 Especialidades disponibles para', nivelSeleccionado, ':', especialidades);

// Al cargar especialidades
console.log(`✅ ${especialidades.length} especialidades cargadas para ${nivelSeleccionado}`);

// Para grados básicos
console.log('✅ Especialidad "Sin especialidad" seleccionada automáticamente para', nivelSeleccionado);
```

## Mantenimiento

### **Agregar Nuevas Especialidades**
Para agregar nuevas especialidades a un nivel:

1. Editar el objeto `especialidadesPorNivel` en `script.js`
2. Agregar la nueva especialidad al array correspondiente:
```javascript
'Décimo': [
    { value: 'Nueva Especialidad', text: 'Nueva Especialidad' },
    // ... otras especialidades
]
```

### **Modificar Niveles**
Para agregar nuevos niveles:

1. Agregar el nivel al HTML (dropdown de niveles)
2. Agregar el mapeo de especialidades en `especialidadesPorNivel`
3. El sistema funcionará automáticamente

## Validaciones

- ✅ Campo "Especialidad" es obligatorio
- ✅ Solo se pueden seleccionar especialidades válidas para el nivel
- ✅ Se previene la selección de especialidades incorrectas
- ✅ Se mantiene la consistencia entre nivel y especialidad

---

**Última actualización**: Enero 2025  
**Versión**: 1.0  
**Mantenido por**: Equipo de Desarrollo CTP Sabalito
