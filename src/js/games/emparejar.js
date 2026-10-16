let emparejarPalabras = [];
let emparejarSeleccionados = [];
let emparejarBloque = 0;
let emparejarResueltos = 0;
const BLOQUE_TAMANIO = 10;
let bloquePalabrasActual = [];

function iniciarEmparejar() {
    emparejarPalabras = obtenerPalabrasSeleccionadas();
    emparejarSeleccionados = [];
    emparejarBloque = 0;
    emparejarResueltos = 0;

    if (emparejarPalabras.length === 0) {
        mostrarActividadVacia();
        return;
    }
    cargarBloqueEmparejar();
}

function cargarBloqueEmparejar() {
    const contenedor = document.getElementById("actividad-juego");
    if (!contenedor) return;

    const inicio = emparejarBloque * BLOQUE_TAMANIO;
    bloquePalabrasActual = emparejarPalabras.slice(inicio, inicio + BLOQUE_TAMANIO);
    emparejarSeleccionados = [];
    contenedor.innerHTML = `
        <p style="text-align:center">Match each English idiom with its Spanish translation.</p>
        <div style="display:flex;gap:20px;justify-content:space-between;align-items:start">
            <div id="palabras-ingles" style="flex:1;display:flex;flex-direction:column;gap:10px"></div>
            <div id="palabras-espanol" style="flex:1;display:flex;flex-direction:column;gap:10px"></div>
        </div>
        <div id="feedback-emparejar" role="status" aria-live="polite"></div>
    `;

    const opcionesIngles = mezclarCopia(bloquePalabrasActual);
    const opcionesEspanol = mezclarCopia(bloquePalabrasActual);
    opcionesIngles.forEach(palabra => {
        crearOpcionEmparejar("ingles", palabra, contenedor.querySelector("#palabras-ingles"));
    });
    opcionesEspanol.forEach(palabra => {
        crearOpcionEmparejar("espanol", palabra, contenedor.querySelector("#palabras-espanol"));
    });
    actualizarProgresoEmparejar();
}

function crearOpcionEmparejar(tipo, palabra, columna) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = tipo === "ingles" ? palabra.ingles : palabra.espanol;
    boton.className = "btn-palabra";
    boton.addEventListener("click", () => seleccionarEmparejar(tipo, boton, palabra));
    columna.appendChild(boton);
}

function seleccionarEmparejar(tipo, boton, palabra) {
    if (emparejarSeleccionados.length === 2 || boton.disabled ||
        emparejarSeleccionados.some(seleccion => seleccion.tipo === tipo)) return;

    boton.classList.add("seleccionada");
    emparejarSeleccionados.push({ tipo, boton, palabra });
    if (emparejarSeleccionados.length < 2) return;

    const [primera, segunda] = emparejarSeleccionados;
    const sesion = sesionActividad;
    const ingles = primera.tipo === "ingles" ? primera : segunda;
    const espanol = primera.tipo === "espanol" ? primera : segunda;
    const feedback = document.getElementById("feedback-emparejar");

    if (ingles.palabra === espanol.palabra) {
        ingles.boton.disabled = true;
        espanol.boton.disabled = true;
        ingles.boton.classList.remove("seleccionada");
        espanol.boton.classList.remove("seleccionada");
        ingles.boton.style.visibility = "hidden";
        espanol.boton.style.visibility = "hidden";
        emparejarResueltos++;
        emparejarSeleccionados = [];
        if (feedback) {
            feedback.textContent = "Correct match! 🌟";
            feedback.style.color = "green";
        }
        if (typeof window.mostrarPopUpGif === "function" && window.minionsFelices?.length) {
            window.mostrarPopUpGif(window.minionsFelices[Math.floor(Math.random() * window.minionsFelices.length)], 1200);
        }
        reproducirSonidoActividad(sonidoCorrcto);
        puntos++;
        localStorage.setItem("puntosTotales", puntos.toString());
        actualizarPuntos();
        actualizarRacha();
        actualizarProgresoEmparejar();

        if (emparejarResueltos === emparejarPalabras.length) {
            mostrarActividadCompletada(document.getElementById("actividad-juego"), "You matched all the idioms.");
        } else if (emparejarResueltos % BLOQUE_TAMANIO === 0) {
            emparejarBloque++;
            setTimeout(() => {
                if (sesion === sesionActividad) cargarBloqueEmparejar();
            }, 700);
        }
        return;
    }

    if (feedback) {
        feedback.textContent = `Not a match. ${ingles.palabra.ingles} means “${ingles.palabra.espanol}”.`;
        feedback.style.color = "red";
    }
    if (typeof window.mostrarPopUpGif === "function" && window.minionsTristes?.length) {
        window.mostrarPopUpGif(window.minionsTristes[Math.floor(Math.random() * window.minionsTristes.length)], 1400);
    }
    puntos = Math.max(0, puntos - 1);
    localStorage.setItem("puntosTotales", puntos.toString());
    actualizarPuntos();
    reproducirSonidoActividad(sonidoIncorrecto);
    setTimeout(() => {
        if (sesion !== sesionActividad) return;
        emparejarSeleccionados.forEach(seleccion => seleccion.boton.classList.remove("seleccionada"));
        emparejarSeleccionados = [];
        if (feedback?.isConnected) feedback.textContent = "";
    }, 900);
}

function actualizarProgresoEmparejar() {
    if (typeof window.actualizarBarraProgreso === "function") {
        window.actualizarBarraProgreso(emparejarResueltos, emparejarPalabras.length);
    }
}
