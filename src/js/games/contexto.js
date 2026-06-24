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

//  Función principal del juego 
function mostrarPreguntaContexto() {
    
    if (typeof window.actualizarBarraProgreso === 'function') {
        window.actualizarBarraProgreso(indiceContexto, palabrasBloque.length);
    } else if (typeof actualizarBarraProgreso === 'function') {
        actualizarBarraProgreso(indiceContexto, palabrasBloque.length);
    }
    
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
        // 🏆 CORRECCIÓN: Añadido window. para la lectura global estable de las copas
        const copaAleatoria = window.gifsCopasVictoria[Math.floor(Math.random() * window.gifsCopasVictoria.length)];

        contenedorFrase.innerHTML = `
        <div style='text-align:center; padding: 20px;'>
            <h3 style="color: #ffb300; font-size: 1.8rem; margin-bottom: 10px; font-weight: bold;">Activity Completed! 🏆</h3>
            <p style="font-size: 1.1rem; color: #555; margin-bottom: 20px;">You have mastered the register and nuances of these C2 idioms.</p>
            
            <div style="margin: 20px auto; max-width: 260px;">
                <img src="${copaAleatoria}" 
                     alt="Victory Trophy" 
                     style="width: 100%; border-radius: 12px; box-shadow: 0 6px 20px rgba(255, 179, 0, 0.3);">
            </div>
        </div>`;
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
            const botones = contenedorOpciones.querySelectorAll("button");
            botones.forEach(b => b.disabled = true);

            if (opt === solucionCorrecta) {
                // 🍏 CASO: ACIERTO
                const gifOk = window.minionsFelices[Math.floor(Math.random() * window.minionsFelices.length)];
                
                // CORRECCIÓN: Cambiado 'gifKo' por 'gifOk' para que salga el minion feliz
                if (typeof window.mostrarPopUpGif === 'function') {
                    window.mostrarPopUpGif(gifOk, 1500);
                }
                
                if (feedback) {
                    // CORRECCIÓN: Cambiado 'palabra.ingles' por 'item.ingles' y estilo en verde
                    feedback.innerHTML = `<p style="color: green; font-weight: bold; margin-top: 10px;">Spot on! Match correct. 🌟 <strong>${item.ingles}</strong></p>`;
                }
                if (typeof sonidoCorrcto !== 'undefined') sonidoCorrcto.play();
                
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
                
                puntos += 2;
                actualizarRacha();
                actualizarPuntos();
                indiceContexto++;
                setTimeout(mostrarPreguntaContexto, 1500); // Subido a 1.5s para disfrutar del pop-up feliz
            
            } else {
                // FALLO
                const gifKo = window.minionsTristes[Math.floor(Math.random() * window.minionsTristes.length)];
                
                if (typeof window.mostrarPopUpGif === 'function') {
                    window.mostrarPopUpGif(gifKo, 1800);
                }
                
                if (feedback) {
                    // CORRECCIÓN: Cambiado 'palabra.ingles' por 'item.ingles' para que no rompa
                    feedback.innerHTML = `<p style="color: red; font-weight: bold; margin-top: 10px;">Not quite. Correct: <strong>${solucionCorrecta}</strong></p> `;
                }
                if (typeof sonidoIncorrecto !== 'undefined') sonidoIncorrecto.play();
                
                setTimeout(() => {
                    botones.forEach(b => b.disabled = false);
                    feedback.innerHTML = ""; // Limpiamos el texto al dejarles reintentar
                }, 2000);
            }
        };
        contenedorOpciones.appendChild(btn);
    });
}