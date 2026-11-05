/* Datos de ejemplo. Cámbialos por los tuyos (nombre de la escuela, materias, etc.). */
const DATOS = {
  alumno: "Estudiante",
  materias: [
    { id: "calc", nombre: "Cálculo diferencial",   clave: "MAT-101", profesor: "Dra. Elena Ruiz",    aula: "A-12", creditos: 5, notas: [88, 92, 85] },
    { id: "web",  nombre: "Programación web",       clave: "SIS-204", profesor: "Mtro. Carlos Pech",  aula: "Lab 3", creditos: 5, notas: [95, 98, 100] },
    { id: "bd",   nombre: "Bases de datos",         clave: "SIS-210", profesor: "Ing. Laura Canul",   aula: "Lab 1", creditos: 4, notas: [78, 82, null] },
    { id: "fis",  nombre: "Física general",         clave: "FIS-110", profesor: "Dr. Mario Echeverría", aula: "B-05", creditos: 4, notas: [69, 74, null] },
    { id: "ing",  nombre: "Inglés IV",              clave: "IDM-104", profesor: "Lic. Ana Cetina",    aula: "C-20", creditos: 3, notas: [90, null, null] }
  ],
  /* Días: 1 = lunes … 5 = viernes */
  horario: {
    1: [ { m: "calc", ini: "07:00", fin: "09:00" }, { m: "web", ini: "09:00", fin: "11:00" }, { m: "ing", ini: "12:00", fin: "13:00" } ],
    2: [ { m: "bd",   ini: "08:00", fin: "10:00" }, { m: "fis", ini: "10:00", fin: "12:00" } ],
    3: [ { m: "calc", ini: "07:00", fin: "09:00" }, { m: "web", ini: "09:00", fin: "11:00" }, { m: "ing", ini: "12:00", fin: "13:00" } ],
    4: [ { m: "bd",   ini: "08:00", fin: "10:00" }, { m: "fis", ini: "10:00", fin: "12:00" } ],
    5: [ { m: "web",  ini: "08:00", fin: "10:00" }, { m: "ing", ini: "10:00", fin: "11:00" } ]
  },
  eventos: [
    { fecha: "2026-11-02", titulo: "Día de muertos (sin clases)",  tipo: "descanso", detalle: "Suspensión de labores." },
    { fecha: "2026-11-09", titulo: "Examen parcial de Física",      tipo: "examen",   detalle: "Aula B-05, 10:00 h." },
    { fecha: "2026-11-13", titulo: "Entrega de proyecto web",       tipo: "entrega",  detalle: "Subir al aula virtual antes de las 23:59." },
    { fecha: "2026-11-16", titulo: "Suspensión por día festivo",    tipo: "descanso", detalle: "Revolución Mexicana (se recorre al lunes)." },
    { fecha: "2026-11-20", titulo: "Reinscripción en línea",        tipo: "tramite",  detalle: "Consulta tu turno en control escolar." },
    { fecha: "2026-11-24", titulo: "Examen de Bases de datos",      tipo: "examen",   detalle: "Laboratorio 1, 8:00 h." },
    { fecha: "2026-12-04", titulo: "Examen de Cálculo diferencial", tipo: "examen",   detalle: "Aula A-12, 7:00 h." },
    { fecha: "2026-12-11", titulo: "Entrega de calificaciones",     tipo: "tramite",  detalle: "Revisa tus notas en la sección Materias." },
    { fecha: "2026-12-18", titulo: "Inicio de vacaciones",          tipo: "descanso", detalle: "Regreso de clases el 11 de enero." }
  ],
  avisos: [
    { titulo: "Cambio de aula en Física", texto: "A partir del martes la clase será en el aula B-05." },
    { titulo: "Biblioteca", texto: "Horario extendido hasta las 20:00 h durante semana de exámenes." },
    { titulo: "Credencial", texto: "Recoge tu credencial en control escolar con una identificación." }
  ]
};
