let eleccionPalabras = [];
let eleccionIndice = 0;

function iniciarEleccionMultiple() {
    eleccionPalabras = mezclarCopia(obtenerPalabrasSeleccionadas());
    eleccionIndice = 0;

    if (eleccionPalabras.length === 0) {
        mostrarActividadVacia();
        return;
    }

    mostrarPreguntaEleccion();
}

function mostrarPreguntaEleccion() {
    const contenedor = document.getElementById("actividad-juego");
    if (!contenedor) return;

    if (eleccionIndice >= eleccionPalabras.length) {
        actividadCompletada = true;
        mostrarActividadCompletada(contenedor, "You have completed the register and nuance activity.");
        return;
    }

    const palabra = eleccionPalabras[eleccionIndice];
    const sesion = sesionActividad;
    const opciones = ["formal", "informal", "idiomatic/neutral"];
    contenedor.innerHTML = `
        <p>Question ${eleccionIndice + 1} of ${eleccionPalabras.length}</p>
        <p><strong>Idiom:</strong> <span style="font-size:1.2rem;color:#0070f3"></span></p>
        <p><strong>Usage note:</strong> <span id="nota-uso"></span></p>
        <p>Select the correct register:</p>
        <div id="opciones-multiple"></div>
        <div id="feedback-eleccion" role="status" aria-live="polite"></div>
    `;
    contenedor.querySelector("p strong + span").textContent = palabra.ingles || "";
    contenedor.querySelector("#nota-uso").textContent = palabra.contexto_uso || "No usage note available.";

    if (typeof window.actualizarBarraProgreso === "function") {
        window.actualizarBarraProgreso(eleccionIndice, eleccionPalabras.length);
    }

    const opcionesContainer = contenedor.querySelector("#opciones-multiple");
    const feedback = contenedor.querySelector("#feedback-eleccion");
    opciones.forEach(opcion => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = opcion;
        boton.className = "btn-opcion";
        boton.addEventListener("click", () => {
            const botones = opcionesContainer.querySelectorAll("button");
            botones.forEach(item => item.disabled = true);
            const respuestaCorrecta = (palabra.formalidad || "informal").trim().toLowerCase();

            if (opcion === respuestaCorrecta) {
                feedback.textContent = "Correct! 🌟";
                feedback.style.color = "green";
                if (typeof window.mostrarPopUpGif === "function" && window.minionsFelices?.length) {
                    window.mostrarPopUpGif(window.minionsFelices[Math.floor(Math.random() * window.minionsFelices.length)], 1200);
                }
                reproducirSonidoActividad(sonidoCorrcto);
                if (typeof confetti === "function") confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
                puntos++;
                localStorage.setItem("puntosTotales", puntos.toString());
                actualizarPuntos();
                actualizarRacha();
                eleccionIndice++;
                setTimeout(() => {
                    if (sesion === sesionActividad) mostrarPreguntaEleccion();
                }, 1200);
                return;
            }

            feedback.textContent = `Not quite. The correct register is: ${respuestaCorrecta}.`;
            feedback.style.color = "red";
            if (typeof window.mostrarPopUpGif === "function" && window.minionsTristes?.length) {
                window.mostrarPopUpGif(window.minionsTristes[Math.floor(Math.random() * window.minionsTristes.length)], 1500);
            }
            reproducirSonidoActividad(sonidoIncorrecto);
            puntos = Math.max(0, puntos - 1);
            localStorage.setItem("puntosTotales", puntos.toString());
            actualizarPuntos();
            setTimeout(() => {
                if (sesion !== sesionActividad || !feedback.isConnected) return;
                botones.forEach(item => item.disabled = false);
                feedback.textContent = "";
            }, 1500);
        });
        opcionesContainer.appendChild(boton);
    });
}
