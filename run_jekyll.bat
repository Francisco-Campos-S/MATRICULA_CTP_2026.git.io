@echo off
echo Iniciando servidor Jekyll local...
echo.
echo Si no tienes Jekyll instalado, ejecuta primero:
echo gem install jekyll bundler
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo Iniciando servidor...
echo.
echo El sitio estara disponible en: http://localhost:4000
echo Presiona Ctrl+C para detener el servidor
echo.

jekyll serve --livereload
pause
