let palabrasBloque = [];
let indiceContexto = 0;
    
// 1. Función para iniciar la configuración
function iniciarContexto() {
    palabrasBloque = filtrarPalabrasParaActividad();

    if (palabrasBloque.length === 0) {
        alert("No hay suficientes modismos en este bloque.");
        return;
    }
    // Las mezclamos para que no se memoricen el orden
    palabrasBloque.sort(() => Math.random() - 0.5);

    indiceContexto = 0;
    mostrarPantalla("pantalla-contexto");
    
    const configDiv = document.getElementById("config-test");
    const juegoDiv = document.getElementById("juego-contexto");
    if (configDiv) configDiv.classList.remove("pantalla-oculta");
    if (juegoDiv) juegoDiv.classList.add("pantalla-oculta");
}

// 2. Evento para el botón de empezar examen
const btnIniciarExamen = document.getElementById("btn-iniciar-examen");
if (btnIniciarExamen) {
    btnIniciarExamen.addEventListener("click", () => {
        if (!leccionActual) {
            alert("Selecciona una lección primero.");
            return;
        }

        palabrasBloque = obtenerPalabrasSeleccionadas();

        if (palabrasBloque.length === 0) {
            alert("Este bloque está vacío.");
            return;
        }

        palabrasBloque.sort(() => Math.random() - 0.5);
        document.getElementById("config-test").classList.add("pantalla-oculta");
        document.getElementById("juego-contexto").classList.remove("pantalla-oculta");
        
        mostrarPreguntaContexto();
    });
}

// 3. Función principal del juego (¡100% Clics Rápidos!)
function mostrarPreguntaContexto() {
    
    const contenedorFrase = document.getElementById("frase-pregunta");
    const contenedorOpciones = document.getElementById("opciones-contexto");
    const progreso = document.getElementById("info-progreso");
    const feedback = document.getElementById("feedback-contexto");

    if (!contenedorFrase || !contenedorOpciones || !progreso || !feedback) {
        console.error("Error: No se encuentran los elementos del test en el HTML.");
        return;
    }

    feedback.textContent = "";

    if (indiceContexto >= palabrasBloque.length) {
        contenedorFrase.innerHTML = "<div style='text-align:center;'><h3>¡Cloze Test Finalizado! 🧠</h3><p>¡Buen trabajo controlando esos contextos C2!</p></div>";
        contenedorOpciones.innerHTML = "";
        progreso.textContent = "";
        guardarPuntuacionEnHistorial(); 
        return;
    }
    
    const item = palabrasBloque[indiceContexto];
    progreso.textContent = `Pregunta ${indiceContexto + 1} de ${palabrasBloque.length}`;
    
    // Mostramos la frase con el hueco
    contenedorFrase.textContent = item.frase || "Missing context sentence...";

    // Generar opciones: La respuesta conjugada correcta + 3 distractores
    // Usamos 'respuesta_cloze' si existe (por si cambia el tiempo verbal), si no, 'ingles'
    let solucionCorrecta = item.respuesta_cloze || item.ingles;
    
    let opciones = [solucionCorrecta];
    
    // Filtramos los distractores del resto del bloque para que no se repita la respuesta correcta
    let otros = palabrasBloque.filter(p => (p.respuesta_cloze || p.ingles) !== solucionCorrecta);
    otros.sort(() => Math.random() - 0.5);
    
    // Añadimos hasta 3 respuestas incorrectas
    opciones.push(...otros.slice(0, 3).map(p => p.respuesta_cloze || p.ingles));
    
    // Mezclamos las 4 opciones finales para los botones
    opciones.sort(() => Math.random() - 0.5);

    contenedorOpciones.innerHTML = "";
    opciones.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "actividad-btn";
        btn.onclick = () => {
            if (opt === solucionCorrecta) {
                feedback.textContent = "Spot on! 🌟";
                feedback.style.color = "green";
                if (typeof sonidoCorrcto !== 'undefined') sonidoCorrcto.play();
                confetti({
                         particleCount: 100,
                         spread: 70,
                         origin: { y: 0.6 }
                        });
                puntos += 2;
                actualizarRacha();
                actualizarPuntos();
                indiceContexto++;
                setTimeout(mostrarPreguntaContexto, 1200); // Transición rápida
            } else {
                feedback.textContent = `Not quite! ❌ Correct: ${solucionCorrecta}`;
                feedback.style.color = "red";
                if (typeof sonidoIncorrecto !== 'undefined') sonidoIncorrecto.play();
            }
        };
        contenedorOpciones.appendChild(btn);
    });
}