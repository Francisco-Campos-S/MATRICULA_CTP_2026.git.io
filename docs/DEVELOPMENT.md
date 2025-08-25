# 🚀 **GUÍA DE DESARROLLO**

## 📋 **REQUISITOS PREVIOS**

- **Node.js** (versión 16 o superior)
- **Git** para control de versiones
- **Editor de código** (VS Code recomendado)
- **Navegador web** moderno
- **Cuenta de Google** para Google Apps Script

## 🛠️ **CONFIGURACIÓN DEL ENTORNO**

### **1. Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/MATRICULA_CTP_2026.git.io.git
cd MATRICULA_CTP_2026.git.io
```

### **2. Estructura de desarrollo**
```
MATRICULA_CTP_2026.git.io/
├── index.html                   # 🏠 Página principal (GitHub Pages)
├── _layouts/                    # 🎨 Plantillas Jekyll
├── assets/                      # 🎨 Recursos estáticos
│   ├── css/                     # Estilos
│   ├── js/                      # JavaScript
│   └── images/                  # Imágenes
├── docs/                        # 📚 Documentación
├── config/                      # ⚙️ Configuración
├── scripts/                     # 🔧 Scripts Google Apps Script
├── templates/                   # 📋 Plantillas y datos
└── src/                         # 💻 Código fuente (desarrollo local)
    └── index.html              # Copia para desarrollo
```

## 🔧 **DESARROLLO LOCAL**

### **Opción 1: Desarrollo en la raíz (Recomendado para GitHub Pages)**
```bash
# Servidor HTTP simple con Python
python -m http.server 8000

# O con Node.js
npx http-server -p 8000

# O con PHP
php -S localhost:8000
```

### **Opción 2: Desarrollo en carpeta src/ (Para desarrollo aislado)**
```bash
# Navegar a la carpeta src
cd src

# Servidor HTTP simple
python -m http.server 8000
```

### **Acceder al formulario**
- **Raíz**: `http://localhost:8000`
- **Src**: `http://localhost:8000/src/`

## 📝 **ESTRUCTURA DEL CÓDIGO**

### **HTML (index.html)**
- **Header**: Logo, título del colegio, información MEP
- **Formulario**: Secciones organizadas por tipo de datos
- **Footer**: Información de contacto y copyright

### **CSS (assets/css/styles.css)**
- **Variables CSS**: Colores, fuentes, espaciados
- **Layout**: Grid y Flexbox para responsividad
- **Componentes**: Botones, inputs, secciones
- **Media Queries**: Breakpoints para dispositivos

### **JavaScript (assets/js/)**
- **script.js**: Lógica principal del formulario
- **google-sheets-config.js**: Configuración de Google Apps Script

## 🎨 **SISTEMA DE DISEÑO**

### **Colores principales**
```css
:root {
  --primary-color: #1e3c72;      /* Azul principal */
  --secondary-color: #2a5298;    /* Azul secundario */
  --accent-color: #ffd700;       /* Dorado */
  --success-color: #28a745;      /* Verde */
  --error-color: #dc3545;        /* Rojo */
  --text-color: #333;            /* Texto principal */
  --light-bg: #f8f9fa;          /* Fondo claro */
}
```

### **Tipografía**
- **Principal**: Roboto (Google Fonts)
- **Tamaños**: 14px base, escalado con rem
- **Pesos**: 300, 400, 500, 700

### **Espaciado**
- **Base**: 8px
- **Escala**: 8px, 16px, 24px, 32px, 48px, 64px

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints**
```css
/* Mobile First */
@media (min-width: 480px) { /* Small Mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large Desktop */ }
```

### **Grid System**
- **Mobile**: 1 columna
- **Tablet**: 2 columnas
- **Desktop**: 3 columnas

## 🔌 **INTEGRACIÓN CON GOOGLE APPS SCRIPT**

### **Configuración**
1. **Crear proyecto** en [script.google.com](https://script.google.com)
2. **Copiar código** de `scripts/GOOGLE_APPS_SCRIPT_CON_CONSULTA.gs`
3. **Desplegar** como Web App
4. **Actualizar URL** en `assets/js/google-sheets-config.js`

### **Endpoints**
- **POST**: Envío de formularios
- **GET**: Consulta de estudiantes por cédula

## 🧪 **TESTING**

### **Validación del formulario**
- **Campos requeridos**: Nivel, especialidad, sección, nombres, cédulas
- **Formatos**: Teléfonos (8 dígitos), cédulas (9 dígitos)
- **Validación en tiempo real**: Feedback inmediato al usuario

### **Pruebas de funcionalidad**
- **Envío de formulario**: Verificar datos en Google Sheets
- **Consulta de estudiantes**: Buscar por cédula existente
- **Responsividad**: Probar en diferentes dispositivos

## 📦 **BUILD Y DESPLIEGUE**

### **GitHub Pages (Automático)**
1. **Push** cambios a la rama `main`
2. **GitHub Pages** se despliega automáticamente
3. **URL disponible** en `https://tu-usuario.github.io/MATRICULA_CTP_2026.git.io/`

### **Configuración manual de GitHub Pages**
1. Ve a **Settings** > **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`
4. **Folder**: `/ (root)`

### **Despliegue manual**
1. **Copiar** archivos de la raíz al servidor
2. **Verificar** rutas de assets
3. **Probar** funcionalidad completa

## 🔄 **FLUJO DE DESARROLLO**

### **Para cambios en producción (GitHub Pages):**
1. **Edita** archivos en la raíz del proyecto
2. **Prueba** localmente con servidor HTTP
3. **Commit** y **push** a `main`
4. **GitHub Pages** se actualiza automáticamente

### **Para desarrollo aislado:**
1. **Edita** archivos en `src/`
2. **Prueba** en `src/` con servidor local
3. **Copia** cambios a la raíz cuando estén listos
4. **Commit** y **push** a `main`

## 🐛 **DEBUGGING**

### **Herramientas del navegador**
- **Console**: Logs y errores JavaScript
- **Network**: Peticiones HTTP y respuestas
- **Elements**: Inspección del DOM
- **Application**: Almacenamiento local

### **Logs comunes**
```javascript
console.log('🚀 Formulario enviado:', formData);
console.error('❌ Error:', error);
console.warn('⚠️ Advertencia:', warning);
```

## 📚 **RECURSOS ÚTILES**

- **MDN Web Docs**: [developer.mozilla.org](https://developer.mozilla.org)
- **Google Apps Script**: [developers.google.com/apps-script](https://developers.google.com/apps-script)
- **CSS Grid**: [css-tricks.com/snippets/css/complete-guide-grid](https://css-tricks.com/snippets/css/complete-guide-grid)
- **Flexbox**: [css-tricks.com/snippets/css/a-guide-to-flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox)
- **GitHub Pages**: [pages.github.com](https://pages.github.com)

## 🤝 **CONTRIBUCIÓN**

### **Flujo de trabajo**
1. **Fork** el repositorio
2. **Crear** rama feature: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar** y **probar** cambios
4. **Commit**: `git commit -m 'feat: agregar nueva funcionalidad'`
5. **Push**: `git push origin feature/nueva-funcionalidad`
6. **Pull Request** con descripción detallada

### **Convenciones de código**
- **HTML**: Indentación de 2 espacios
- **CSS**: BEM methodology para clases
- **JavaScript**: ES6+, camelCase, comentarios descriptivos
- **Commits**: Conventional Commits (feat:, fix:, docs:, etc.)

### **Importante para GitHub Pages**
- **index.html** debe estar en la raíz del repositorio
- **assets/** debe estar en la raíz para rutas correctas
- **Rutas relativas** funcionan mejor que absolutas

---

**¡Feliz desarrollo! 🎉**
