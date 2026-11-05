# Campus Consulta (PWA)

Aplicación web progresiva de consulta académica: inicio, horario, materias/calificaciones y calendario.

## Cómo ejecutarla (necesita http://localhost o HTTPS)
    cd campus-pwa
    python -m http.server 8080
    # abrir http://localhost:8080 en Chrome o Edge

## Estructura
- index.html          Página única con 4 secciones
- manifest.json       Nombre, iconos, colores, display: standalone
- sw.js               Service Worker (precaché + offline)
- offline.html        Página de respaldo sin conexión
- css/styles.css      Estilos responsivos
- js/data.js          Datos de ejemplo (editables)
- js/app.js           Lógica, instalación y registro del SW
- icons/              Iconos 192, 512, maskable y apple-touch
