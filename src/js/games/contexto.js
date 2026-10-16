let palabrasBloque = [];
let indiceContexto = 0;

function iniciarContexto() {
    palabrasBloque = mezclarCopia(obtenerPalabrasSeleccionadas());
    indiceContexto = 0;

    if (palabrasBloque.length === 0) {
        mostrarActividadVacia();
        return;
    }
    mostrarPreguntaContexto();
}

function mostrarPreguntaContexto() {
    const contenedor = document.getElementById("actividad-juego");
    if (!contenedor) return;

    if (indiceContexto >= palabrasBloque.length) {
        mostrarActividadCompletada(contenedor, "You completed all the context questions.");
        return;
    }
    if (typeof window.actualizarBarraProgreso === "function") {
        window.actualizarBarraProgreso(indiceContexto, palabrasBloque.length);
    }

    const palabra = palabrasBloque[indiceContexto];
    const sesion = sesionActividad;
    const respuesta = palabra.respuesta_cloze || palabra.ingles;
    const respuestas = new Set([respuesta]);
    mezclarCopia(palabrasBloque)
        .map(item => item.respuesta_cloze || item.ingles)
        .filter(opcion => opcion && opcion !== respuesta)
        .forEach(opcion => {
            if (respuestas.size < 4) respuestas.add(opcion);
        });

    contenedor.innerHTML = `
        <p id="progreso-contexto" style="font-weight:bold"></p>
        <p id="frase-contexto" style="font-size:1.3rem;padding:20px;background:white;border:1px solid #ccc;border-radius:8px"></p>
        <div id="opciones-contexto" class="grid"></div>
        <div id="feedback-contexto" role="status" aria-live="polite"></div>
    `;
    contenedor.querySelector("#progreso-contexto").textContent = `Question ${indiceContexto + 1} of ${palabrasBloque.length}`;
    contenedor.querySelector("#frase-contexto").textContent = palabra.frase || "No context sentence available.";
    const opciones = mezclarCopia([...respuestas]);
    const opcionesContenedor = contenedor.querySelector("#opciones-contexto");
    const feedback = contenedor.querySelector("#feedback-contexto");

    opciones.forEach(opcion => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = opcion;
        boton.className = "actividad-btn";
        boton.addEventListener("click", () => {
            opcionesContenedor.querySelectorAll("button").forEach(item => item.disabled = true);
            if (opcion === respuesta) {
                feedback.textContent = "Correct! 🌟";
                feedback.style.color = "green";
                if (typeof window.mostrarPopUpGif === "function" && window.minionsFelices?.length) {
                    window.mostrarPopUpGif(window.minionsFelices[Math.floor(Math.random() * window.minionsFelices.length)], 1200);
                }
                reproducirSonidoActividad(sonidoCorrcto);
                if (typeof confetti === "function") confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
                puntos += 2;
                localStorage.setItem("puntosTotales", puntos.toString());
                actualizarPuntos();
                actualizarRacha();
                indiceContexto++;
                setTimeout(() => {
                    if (sesion === sesionActividad) mostrarPreguntaContexto();
                }, 1000);
                return;
            }

            feedback.textContent = `Not quite. The correct answer is: ${respuesta}`;
            feedback.style.color = "red";
            if (typeof window.mostrarPopUpGif === "function" && window.minionsTristes?.length) {
                window.mostrarPopUpGif(window.minionsTristes[Math.floor(Math.random() * window.minionsTristes.length)], 1400);
            }
            reproducirSonidoActividad(sonidoIncorrecto);
            setTimeout(() => {
                if (sesion !== sesionActividad || !feedback.isConnected) return;
                opcionesContenedor.querySelectorAll("button").forEach(item => item.disabled = false);
                feedback.textContent = "";
            }, 1500);
        });
        opcionesContenedor.appendChild(boton);
    });
}
