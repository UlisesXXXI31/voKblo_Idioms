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
    // 📊 ACTUALIZACIÓN SEGURA DE LA BARRA DE PROGRESO
    // Al usar 'window.actualizarBarraProgreso' prevenimos errores de "not defined" si app.js tarda en cargar
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
        const copaAleatoria = gifsCopasVictoria[Math.floor(Math.random() * gifsCopasVictoria.length)];

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
            // Bloqueamos clics repetidos en los botones mientras se muestra el feedback
            const botones = contenedorOpciones.querySelectorAll("button");
            botones.forEach(b => b.disabled = true);

            if (opt === solucionCorrecta) {
                if (feedback) {
                const gifOk = window.minionsFelices[Math.floor(Math.random() * window.minionsFelices.length)];
        feedback.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 10px;">
                <span style="color: green;">Spot on! Match correct. 🌟</span>
                <img src="${gifOk}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">
            </div>
               `;
                }
                if (typeof sonidoCorrcto !== 'undefined') sonidoCorrcto.play();
                
                // 🎉 Explosión de Confeti al acertar
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
                setTimeout(mostrarPreguntaContexto, 1200); // Transición rápida
            } else {
                if (feedback) {
        const gifKo = window.minionsTristes[Math.floor(Math.random() * window.minionsTristes.length)];
        feedback.innerHTML = `
            <div style="text-align: center; margin-top: 10px;">
                <p style="color: red; margin-bottom: 8px;">Not quite. This idiom is typically considered: <strong>${respuestaCorrecta}</strong></p>
                <img src="${gifKo}" style="width: 90px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            </div>
             `;
               }
                if (typeof sonidoIncorrecto !== 'undefined') sonidoIncorrecto.play();
                
                // Si falla, reactivamos botones para que pueda corregir tras un breve lapso
                setTimeout(() => {
                    botones.forEach(b => b.disabled = false);
                }, 1500);
            }
        };
        contenedorOpciones.appendChild(btn);
    });
}