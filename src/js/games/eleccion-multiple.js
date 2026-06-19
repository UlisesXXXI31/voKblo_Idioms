   let eleccionPalabras = [];
let eleccionIndice = 0;

function iniciarEleccionMultiple() {
    eleccionPalabras = obtenerPalabrasSeleccionadas();
    eleccionPalabras.sort(() => Math.random() - 0.5);
    eleccionIndice = 0;
    mostrarPreguntaEleccion();
}

function mostrarPreguntaEleccion() {
    const actividadJuego = document.getElementById("actividad-juego");
    
    if (eleccionIndice >= eleccionPalabras.length) {
        if (actividadJuego) {
            actividadJuego.innerHTML = `
                <div style='text-align:center;'>
                    <h3>Activity Completed! 👔</h3>
                    <p>You have mastered the register and nuances of these C2 idioms.</p>
                </div>`;
        }
        guardarPuntuacionEnHistorial(); // Guarda los puntos al finalizar
        return;
    }
    
    const palabra = eleccionPalabras[eleccionIndice];
    
    // C2 Fix: Forzamos opciones fijas según el diseño de formalidad de tu base de datos
    const opciones = ["formal", "informal", "idiomatic/neutral"];
    
    if (actividadJuego) {
        actividadJuego.innerHTML = `
            <p><strong>C2 Idiom:</strong> <span style="font-size: 1.2rem; color: #0070f3;">${palabra.ingles}</span></p>
            <p style="font-style: italic; color: #555; margin-bottom: 1.5rem;">
                <strong>Usage Note:</strong> ${palabra.contexto_uso || "Advanced descriptive context..."}
            </p>
            <p><em>Select the correct register:</em></p>
            <div id="opciones-multiple"></div>
            <div id="mensaje-feedback" style="margin-top:1rem; font-weight: bold;"></div>
        `;
    }
    
    const opcionesContainer = document.getElementById("opciones-multiple");
    const feedback = document.getElementById("mensaje-feedback");
    
    opciones.forEach(opcion => {
        const btn = document.createElement("button");
        // Capitalizamos el texto para que estéticamente se vea mejor en el botón
        btn.textContent = opcion.charAt(0).toUpperCase() + opcion.slice(1);
        btn.className = "btn-opcion";
        btn.style.margin = "0.3rem";
        
        btn.addEventListener("click", () => {
            // Validamos contra la propiedad .formalidad de tu base de datos
            const respuestaCorrecta = (palabra.formalidad || "informal").toLowerCase().trim();
            
            if (opcion === respuestaCorrecta) {
                if (feedback) {
                    feedback.textContent = "Spot on! Match correct. 🌟";
                    feedback.style.color = "green";
                }
                if (typeof sonidoCorrcto !== 'undefined') sonidoCorrcto.play();
                confetti({
                         particleCount: 100,
                         spread: 70,
                         origin: { y: 0.6 }
                        });
                puntos++;
                actualizarRacha(); 
                actualizarPuntos();
                localStorage.setItem('puntosTotales', puntos.toString());
                eleccionIndice++;
                setTimeout(mostrarPreguntaEleccion, 1200);
            } else {
                if (feedback) {
                    feedback.textContent = `Not quite. This idiom is typically considered: ${respuestaCorrecta}`;
                    feedback.style.color = "red";
                }
                if (typeof sonidoIncorrecto !== 'undefined') sonidoIncorrecto.play();
                puntos = Math.max(0, puntos - 1);
                actualizarPuntos();
            }
        });
        if (opcionesContainer) opcionesContainer.appendChild(btn);
    });
}