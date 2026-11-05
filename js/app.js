(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const RUTAS = ["inicio", "horario", "materias", "calendario"];
  const materiaPorId = id => DATOS.materias.find(m => m.id === id);
  const aMin = hhmm => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const ahora = () => new Date();
  const hoyISO = () => { const d = ahora(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const fechaDe = iso => new Date(iso + "T00:00:00");
  const promedio = notas => { const n = notas.filter(x => x != null); return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null; };

  /* ---------- Navegación ---------- */
  const nav = $("#nav"), btnMenu = $("#btn-menu");
  btnMenu.addEventListener("click", () => {
    const abierto = nav.classList.toggle("is-open");
    btnMenu.setAttribute("aria-expanded", abierto);
  });

  function irA() {
    const ruta = RUTAS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "inicio";
    RUTAS.forEach(r => { $("#" + r).hidden = r !== ruta; });
    $$(".nav a").forEach(a => { if (a.dataset.ruta === ruta) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    nav.classList.remove("is-open");
    btnMenu.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    $("#contenido").focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", irA);

  /* ---------- Inicio ---------- */
  function renderInicio() {
    const d = ahora();
    $("#fecha-hoy").textContent = d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

    // Próxima clase
    const cont = $("#proxima");
    const minAhora = d.getHours() * 60 + d.getMinutes();
    let encontrada = null;
    for (let i = 0; i < 7 && !encontrada; i++) {
      const dia = (d.getDay() + i) % 7;
      const clases = DATOS.horario[dia] || [];
      encontrada = clases.find(c => (i > 0 || aMin(c.fin) > minAhora)) ? { i, dia, c: clases.find(c => (i > 0 || aMin(c.fin) > minAhora)) } : null;
    }
    if (encontrada) {
      const { i, dia, c } = encontrada, m = materiaPorId(c.m);
      const enCurso = i === 0 && aMin(c.ini) <= minAhora;
      const cuando = enCurso ? "<mark>En curso</mark>" : i === 0 ? "Hoy" : i === 1 ? "Mañana" : DIAS[dia];
      cont.innerHTML = `<small>${enCurso ? "Ahora" : "Tu siguiente clase"}</small><h2>${m.nombre}</h2>
        <p>${cuando} · ${c.ini} a ${c.fin} h · ${m.aula}</p>`;
    } else {
      cont.innerHTML = `<h2>Sin clases próximas</h2><p>Revisa el horario completo en la sección Horario.</p>`;
    }

    $("#lista-avisos").innerHTML = DATOS.avisos.map(a => `<li><strong>${a.titulo}</strong><small>${a.texto}</small></li>`).join("");

    const hoy = hoyISO();
    const prox = DATOS.eventos.filter(e => e.fecha >= hoy).slice(0, 3);
    $("#lista-proximas").innerHTML = prox.length
      ? prox.map(e => { const f = fechaDe(e.fecha); return `<li><strong>${e.titulo}</strong><small>${f.getDate()} de ${MESES[f.getMonth()]} · ${e.detalle}</small></li>`; }).join("")
      : `<li><small>No hay fechas próximas.</small></li>`;
  }

  /* ---------- Horario ---------- */
  let diaSel = Math.min(Math.max(ahora().getDay(), 1), 5); // fin de semana muestra lunes
  if (ahora().getDay() === 0 || ahora().getDay() === 6) diaSel = 1;

  function renderHorario() {
    const tabs = $("#tabs-dias");
    tabs.innerHTML = [1, 2, 3, 4, 5].map(n =>
      `<button class="tab ${n === ahora().getDay() ? "es-hoy" : ""}" role="tab" id="tab-${n}" aria-selected="${n === diaSel}" data-dia="${n}">${DIAS[n]}</button>`).join("");
    $$(".tab", tabs).forEach(b => b.addEventListener("click", () => { diaSel = +b.dataset.dia; renderHorario(); }));

    const d = ahora(), minAhora = d.getHours() * 60 + d.getMinutes();
    const clases = DATOS.horario[diaSel] || [];
    $("#lista-clases").innerHTML = clases.length ? clases.map(c => {
      const m = materiaPorId(c.m);
      const en = diaSel === d.getDay() && aMin(c.ini) <= minAhora && minAhora < aMin(c.fin);
      return `<li class="clase ${en ? "ahora" : ""}">
        <div class="clase__hora">${c.ini}<small>a ${c.fin}</small></div>
        <div><h3>${m.nombre}</h3><p>${m.profesor} · ${m.aula}</p></div></li>`;
    }).join("") : `<li class="vacio">No hay clases este día.</li>`;
  }

  /* ---------- Materias ---------- */
  function renderMaterias() {
    const q = $("#buscar").value.trim().toLowerCase();
    const lista = DATOS.materias.filter(m => (m.nombre + " " + m.profesor + " " + m.clave).toLowerCase().includes(q));
    $("#lista-materias").innerHTML = lista.map(m => {
      const fin = promedio(m.notas);
      const celdas = m.notas.map((n, i) => `<div class="nota ${n != null && n < 70 ? "nota--bajo" : ""}">Parcial ${i + 1}<b>${n ?? "—"}</b></div>`).join("");
      return `<li class="materia"><h3>${m.nombre}</h3>
        <p class="meta">${m.clave} · ${m.profesor} · ${m.creditos} créditos</p>
        <div class="notas">${celdas}
          <div class="nota nota--final ${fin != null && fin < 70 ? "nota--bajo" : ""}">Promedio<b>${fin != null ? fin.toFixed(1) : "—"}</b></div></div></li>`;
    }).join("");
    $("#vacio-materias").hidden = lista.length > 0;

    const gen = promedio(DATOS.materias.map(m => promedio(m.notas)).filter(x => x != null));
    $("#promedio").innerHTML = gen != null ? `Promedio general: <b>${gen.toFixed(1)}</b>` : "";
  }
  $("#buscar").addEventListener("input", renderMaterias);

  /* ---------- Calendario ---------- */
  let filtro = "todos";
  const ETIQ = { examen: "Examen", entrega: "Entrega", tramite: "Trámite", descanso: "Descanso" };
  function renderCalendario() {
    const hoy = hoyISO();
    const lista = DATOS.eventos.filter(e => filtro === "todos" || e.tipo === filtro);
    $("#lista-agenda").innerHTML = lista.map(e => {
      const f = fechaDe(e.fecha);
      return `<li class="evento evento--${e.tipo} ${e.fecha < hoy ? "pasado" : ""}">
        <div class="evento__dia"><b>${f.getDate()}</b><span>${MESES[f.getMonth()]}</span></div>
        <div><h3>${e.titulo}</h3><p>${ETIQ[e.tipo]} · ${e.detalle}</p></div></li>`;
    }).join("");
  }
  $("#filtros").addEventListener("click", ev => {
    const b = ev.target.closest(".chip"); if (!b) return;
    filtro = b.dataset.tipo;
    $$(".chip").forEach(c => c.classList.toggle("is-on", c === b));
    renderCalendario();
  });

  /* ---------- Estado de red ---------- */
  function actualizarRed() {
    const on = navigator.onLine, el = $("#estado-red");
    el.textContent = on ? "En línea" : "Sin conexión";
    el.className = "red " + (on ? "red--on" : "red--off");
  }
  window.addEventListener("online", () => { actualizarRed(); aviso("Volviste a estar en línea."); });
  window.addEventListener("offline", () => { actualizarRed(); aviso("Sin conexión. Sigues viendo tu información guardada."); });

  /* ---------- Aviso emergente ---------- */
  let tToast;
  function aviso(texto, accion) {
    const t = $("#toast");
    t.innerHTML = `<span></span>`; $("span", t).textContent = texto;
    if (accion) { const b = document.createElement("button"); b.textContent = accion.texto; b.onclick = accion.fn; t.append(b); }
    t.hidden = false; clearTimeout(tToast);
    if (!accion) tToast = setTimeout(() => (t.hidden = true), 4000);
  }

  /* ---------- Instalación ---------- */
  let promptInstalar = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();               // guardamos el evento para lanzarlo con nuestro botón
    promptInstalar = e;
    $("#bloque-instalar").hidden = false;
  });
  $("#btn-instalar").addEventListener("click", async () => {
    if (!promptInstalar) return;
    promptInstalar.prompt();
    const { outcome } = await promptInstalar.userChoice;
    console.log("Resultado de instalación:", outcome);
    promptInstalar = null;
    $("#bloque-instalar").hidden = true;
  });
  window.addEventListener("appinstalled", () => {
    $("#bloque-instalar").hidden = true;
    aviso("Aplicación instalada.");
  });

  /* ---------- Service Worker ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const reg = await navigator.serviceWorker.register("sw.js");
        console.log("Service Worker registrado. Alcance:", reg.scope);
        reg.addEventListener("updatefound", () => {
          const nuevo = reg.installing;
          nuevo.addEventListener("statechange", () => {
            if (nuevo.state === "installed" && navigator.serviceWorker.controller) {
              aviso("Hay una nueva versión.", { texto: "Actualizar", fn: () => nuevo.postMessage("SKIP_WAITING") });
            }
          });
        });
      } catch (err) { console.error("No se pudo registrar el Service Worker:", err); }
    });
    let recargado = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (!recargado) { recargado = true; location.reload(); } });
  }

  /* ---------- Arranque ---------- */
  renderInicio(); renderHorario(); renderMaterias(); renderCalendario();
  actualizarRed(); irA();
})();
