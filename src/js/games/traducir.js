let traducirPalabras = [];
let traducirIndice = 0;
let palabrasSeleccionadasUser = [];
let bloquesDisponibles = [];
let sesionTraducir = 0;

function iniciarTraducir() {
    sesionTraducir = sesionActividad;
    traducirPalabras = mezclarCopia(obtenerPalabrasSeleccionadas());
    traducirIndice = 0;

    if (traducirPalabras.length === 0) {
        mostrarActividadVacia();
        return;
    }
    mostrarPalabraTraducir();
}

function mostrarPalabraTraducir() {
    const contenedor = document.getElementById("actividad-juego");
    if (!contenedor) return;

    if (traducirIndice >= traducirPalabras.length) {
        mostrarActividadCompletada(contenedor, "You completed all the sentence transformations.");
        return;
    }
    if (typeof window.actualizarBarraProgreso === "function") {
        window.actualizarBarraProgreso(traducirIndice, traducirPalabras.length);
    }

    const palabra = traducirPalabras[traducirIndice];
    const solucionCorrecta = (palabra.respuesta_cloze || palabra.ingles || "").trim();
    palabrasSeleccionadasUser = [];
    bloquesDisponibles = mezclarCopia(solucionCorrecta.split(/\s+/).filter(Boolean));
    const palabrasSolucion = solucionCorrecta.split(/\s+/).filter(Boolean);
    const clave = palabrasSolucion[palabrasSolucion.length - 1] || "";

    contenedor.innerHTML = `
        <div class="actividad-card">
            <p>Sentence ${traducirIndice + 1} of ${traducirPalabras.length}</p>
            <p><strong>Original sentence:</strong></p>
            <h4 id="frase-original"></h4>
            <p><strong>Key word:</strong> <span id="palabra-clave"></span></p>
            <p><strong>Complete the transformation:</strong></p>
            <h4 id="frase-transformada"></h4>
            <div id="zona-resultado" aria-live="polite" style="min-height:45px;border:2px dashed #ccc;border-radius:8px;padding:8px;margin-bottom:15px"></div>
            <div id="zona-bloques" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px"></div>
            <div id="feedback-traducir" role="status" aria-live="polite"></div>
            <div style="display:flex;gap:10px">
                <button type="button" id="btn-borrar-todo" class="actividad-btn">Reset</button>
                <button type="button" id="btn-verificar-traduccion" class="actividad-btn">Check answer</button>
            </div>
        </div>
    `;
    contenedor.querySelector("#frase-original").textContent = palabra.frase_formal || "No original sentence available.";
    contenedor.querySelector("#palabra-clave").textContent = clave;
    contenedor.querySelector("#frase-transformada").textContent = palabra.frase_transformada || "Complete the sentence using the idiom.";
    renderizarBloquesTraducir();

    contenedor.querySelector("#btn-borrar-todo").addEventListener("click", () => {
        palabrasSeleccionadasUser = [];
        bloquesDisponibles = mezclarCopia(solucionCorrecta.split(/\s+/).filter(Boolean));
        contenedor.querySelector("#feedback-traducir").textContent = "";
        renderizarBloquesTraducir();
    });
    contenedor.querySelector("#btn-verificar-traduccion").addEventListener("click", () => {
        verificarTraducir(solucionCorrecta);
    });
}

function renderizarBloquesTraducir() {
    const zonaResultado = document.getElementById("zona-resultado");
    const zonaBloques = document.getElementById("zona-bloques");
    if (!zonaResultado || !zonaBloques) return;
    zonaResultado.innerHTML = "";
    zonaBloques.innerHTML = "";

    palabrasSeleccionadasUser.forEach(palabra => {
        const bloque = document.createElement("span");
        bloque.textContent = palabra;
        bloque.style.cssText = "display:inline-block;background:#1976d2;color:#fff;padding:4px 10px;border-radius:4px;margin:2px";
        zonaResultado.appendChild(bloque);
    });
    if (palabrasSeleccionadasUser.length === 0) {
        zonaResultado.textContent = "Select the words in the correct order.";
    }

    bloquesDisponibles.forEach((palabra, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = palabra;
        boton.addEventListener("click", () => {
            palabrasSeleccionadasUser.push(palabra);
            bloquesDisponibles.splice(indice, 1);
            renderizarBloquesTraducir();
        });
        zonaBloques.appendChild(boton);
    });
}

function verificarTraducir(solucionCorrecta) {
    const feedback = document.getElementById("feedback-traducir");
    if (!feedback) return;
    if (palabrasSeleccionadasUser.length === 0) {
        feedback.textContent = "Build the answer before checking it.";
        return;
    }

    const normalizar = texto => texto.toLocaleLowerCase().replace(/[.,!?;:]+$/g, "").replace(/\s+/g, " ").trim();
    const respuesta = palabrasSeleccionadasUser.join(" ");
    if (normalizar(respuesta) === normalizar(solucionCorrecta)) {
        feedback.textContent = "Correct transformation! 🌟";
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
        traducirIndice++;
        setTimeout(() => {
            if (sesionTraducir === sesionActividad) mostrarPalabraTraducir();
        }, 1000);
        return;
    }

    feedback.textContent = `Not quite. Correct answer: ${solucionCorrecta}`;
    feedback.style.color = "red";
    if (typeof window.mostrarPopUpGif === "function" && window.minionsTristes?.length) {
        window.mostrarPopUpGif(window.minionsTristes[Math.floor(Math.random() * window.minionsTristes.length)], 1400);
    }
    reproducirSonidoActividad(sonidoIncorrecto);
    puntos = Math.max(0, puntos - 1);
    localStorage.setItem("puntosTotales", puntos.toString());
    actualizarPuntos();
}
