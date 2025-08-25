# 🚀 **GUÍA DE DESPLIEGUE - GITHUB PAGES**

## 📋 **REQUISITOS PREVIOS**

- **Cuenta de GitHub** activa
- **Repositorio** clonado en tu máquina local
- **Git** configurado correctamente
- **Archivos del proyecto** organizados según la estructura

## 🏗️ **ESTRUCTURA REQUERIDA PARA GITHUB PAGES**

```
MATRICULA_CTP_2026.git.io/
├── 📄 index.html                 # 🏠 REQUERIDO en la raíz
├── 📁 assets/                    # 🎨 Recursos estáticos
│   ├── css/
│   ├── js/
│   └── images/
├── 📁 _layouts/                  # 🎨 Plantillas Jekyll (opcional)
├── 📁 docs/                      # 📚 Documentación
├── 📁 config/                    # ⚙️ Configuración
├── 📁 scripts/                   # 🔧 Scripts
├── 📁 templates/                 # 📋 Plantillas
└── 📁 src/                       # 💻 Desarrollo local
```

## 🚀 **DESPLIEGUE AUTOMÁTICO (RECOMENDADO)**

### **Paso 1: Verificar estructura**
```bash
# Asegúrate de que index.html esté en la raíz
ls -la index.html

# Verifica que assets esté en la raíz
ls -la assets/
```

### **Paso 2: Commit y Push**
```bash
# Agregar todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: actualizar formulario de matrícula"

# Push a la rama main
git push origin main
```

### **Paso 3: Verificar despliegue**
1. Ve a tu repositorio en GitHub
2. **Settings** > **Pages**
3. Verifica que esté configurado como:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`

## ⚙️ **CONFIGURACIÓN MANUAL DE GITHUB PAGES**

### **Si no tienes GitHub Pages habilitado:**

1. **Ve a tu repositorio** en GitHub
2. **Settings** (pestaña)
3. **Pages** (menú lateral izquierdo)
4. **Source**: Selecciona "Deploy from a branch"
5. **Branch**: Selecciona `main`
6. **Folder**: Selecciona `/ (root)`
7. **Save**

### **Configuración avanzada:**

```yaml
# .github/workflows/deploy.yml (opcional)
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 🔍 **VERIFICACIÓN DEL DESPLIEGUE**

### **1. Verificar URL**
Tu sitio estará disponible en:
```
https://tu-usuario.github.io/MATRICULA_CTP_2026.git.io/
```

### **2. Verificar funcionalidad**
- ✅ Formulario se carga correctamente
- ✅ Estilos CSS se aplican
- ✅ JavaScript funciona
- ✅ Formulario envía datos
- ✅ Consulta de estudiantes funciona

### **3. Verificar en diferentes dispositivos**
- 📱 Mobile
- 📱 Tablet
- 💻 Desktop

## 🐛 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Problema: Página no se despliega**
**Solución:**
1. Verifica que `index.html` esté en la raíz
2. Verifica que la rama sea `main`
3. Espera 5-10 minutos para el despliegue
4. Revisa la pestaña **Actions** en GitHub

### **Problema: Assets no se cargan**
**Solución:**
1. Verifica que `assets/` esté en la raíz
2. Verifica rutas relativas en HTML
3. Limpia caché del navegador
4. Verifica consola del navegador para errores 404

### **Problema: Formulario no funciona**
**Solución:**
1. Verifica configuración de Google Apps Script
2. Revisa consola del navegador
3. Verifica permisos de CORS
4. Prueba en modo incógnito

### **Problema: Cambios no se reflejan**
**Solución:**
1. Verifica que hayas hecho push a `main`
2. Espera 5-10 minutos
3. Limpia caché del navegador
4. Verifica que no haya conflictos de merge

## 📱 **OPTIMIZACIÓN PARA MÓVILES**

### **Verificar meta tags:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
```

### **Verificar responsive design:**
- Breakpoints correctos
- Imágenes responsivas
- Touch targets apropiados

## 🔒 **SEGURIDAD Y PERMISOS**

### **Google Apps Script:**
1. **Execute as**: "Me"
2. **Who has access**: "Anyone" (para formularios públicos)
3. **Verificar** que el script tenga permisos de escritura en Google Sheets

### **GitHub Pages:**
- **HTTPS** automático
- **Sin credenciales** expuestas en el código
- **Variables de entorno** para configuraciones sensibles

## 📊 **MONITOREO Y MANTENIMIENTO**

### **Verificar regularmente:**
- ✅ Formulario funciona
- ✅ Datos se guardan en Google Sheets
- ✅ Consultas de estudiantes funcionan
- ✅ Responsividad en diferentes dispositivos

### **Logs útiles:**
```javascript
// En la consola del navegador
console.log('🚀 Formulario cargado');
console.log('📊 Datos enviados:', formData);
console.log('✅ Respuesta del servidor:', response);
```

## 🚀 **ACTUALIZACIONES Y VERSIONES**

### **Flujo de actualización:**
1. **Desarrollar** cambios en `src/` (opcional)
2. **Probar** localmente
3. **Aplicar** cambios a archivos de la raíz
4. **Commit** y **push** a `main`
5. **Verificar** despliegue automático

### **Versionado:**
- Usar [Semantic Versioning](https://semver.org/)
- Documentar cambios en `docs/CHANGELOG.md`
- Tag releases importantes en GitHub

## 📚 **RECURSOS ADICIONALES**

- **GitHub Pages**: [pages.github.com](https://pages.github.com)
- **GitHub Actions**: [github.com/features/actions](https://github.com/features/actions)
- **Jekyll**: [jekyllrb.com](https://jekyllrb.com)
- **Google Apps Script**: [developers.google.com/apps-script](https://developers.google.com/apps-script)

---

**¡Despliegue exitoso! 🎉**

*Última actualización: Agosto 2025*
