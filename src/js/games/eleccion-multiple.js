let eleccionPalabras = [];
let eleccionIndice = 0;


function iniciarEleccionMultiple() {
    eleccionPalabras = obtenerPalabrasSeleccionadas();
    eleccionPalabras.sort(() => Math.random() - 0.5);
    eleccionIndice = 0;
    
    // Dejamos el contenedor listo con espacio para el sub-juego sin tocar la barra externa
    const actividadJuego = document.getElementById("actividad-juego");
    if (actividadJuego && !document.getElementById("interfaz-opciones")) {
        const subContenedor = document.createElement("div");
        subContenedor.id = "interfaz-opciones";
        actividadJuego.appendChild(subContenedor);
    }

    mostrarPreguntaEleccion();
}
function mostrarPreguntaEleccion() {
    const contenedorPrincipal = document.getElementById("actividad-juego");
    if (!contenedorPrincipal) return;
    
    // 1. Si la actividad terminó, mostramos el mensaje final
    if (eleccionIndice >= eleccionPalabras.length) {

        const gifAleatorio = gifsMinions[Math.floor(Math.random() * gifsMinions.length)];

        contenedorPrincipal.innerHTML = `
            <div style='text-align:center; padding: 20px;'>
            <h3 style="color: #ffb300; font-size: 1.8rem; margin-bottom: 10px; font-weight: bold;">Activity Completed! 🏆</h3>
            <p style="font-size: 1.1rem; color: #555; margin-bottom: 20px;">You have mastered the register and nuances of these C2 idioms.</p>
            
            <div style="margin: 20px auto; max-width: 260px;">
                <img src="${copaAleatoria}" 
                     alt="Victory Trophy" 
                     style="width: 100%; border-radius: 12px; box-shadow: 0 6px 20px rgba(255, 179, 0, 0.3);">
            </div>
        </div>`;
        if (typeof actualizarBarraProgreso === 'function') actualizarBarraProgreso(0, 0);
        guardarPuntuacionEnHistorial(); 
        return;
    }

    const palabra = eleccionPalabras[eleccionIndice];
    const opciones = ["formal", "informal", "idiomatic/neutral"];
    
    // 🎯 CORRECCIÓN: Usamos 'contenedorPrincipal' en lugar de la variable inexistente 'interfazJuego'
    contenedorPrincipal.innerHTML = `
        <p style="color: #666; font-size: 0.95rem; margin-bottom: 1.5rem; font-weight: 500;">
            Pregunta ${eleccionIndice + 1} de ${eleccionPalabras.length}
        </p>
        <p><strong>C2 Idiom:</strong> <span style="font-size: 1.2rem; color: #0070f3;">${palabra.ingles}</span></p>
        <p style="font-style: italic; color: #555; margin-bottom: 1.5rem;">
            <strong>Usage Note:</strong> ${palabra.contexto_uso || "Advanced descriptive context..."}
        </p>
        <p><em>Select the correct register:</em></p>
        <div id="opciones-multiple"></div>
        <div id="mensaje-feedback" style="margin-top:1rem; font-weight: bold; min-height: 20px;"></div>
    `;
    
    // 5. 🚀 Actualizamos la barra (ahora sí, compartida y a salvo)
    if (typeof window.actualizarBarraProgreso === 'function') {
        window.actualizarBarraProgreso(eleccionIndice, eleccionPalabras.length);
    } else if (typeof actualizarBarraProgreso === 'function') {
        actualizarBarraProgreso(eleccionIndice, eleccionPalabras.length);
    }
    
    const opcionesContainer = document.getElementById("opciones-multiple");
    const feedback = document.getElementById("mensaje-feedback");
    
    opciones.forEach(opcion => {
        const btn = document.createElement("button");
        btn.textContent = opcion.charAt(0).toUpperCase() + opcion.slice(1);
        btn.className = "btn-opcion";
        btn.style.margin = "0.3rem";
        
        btn.addEventListener("click", () => {
            const respuestaCorrecta = (palabra.formalidad || "informal").toLowerCase().trim();
            const botones = opcionesContainer.querySelectorAll("button");
            botones.forEach(b => b.disabled = true);
            
            if (opcion === respuestaCorrecta) {
                if (feedback) {
                    const gifOk = minionsFelices[Math.floor(Math.random() * minionsFelices.length)];
        feedback.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 10px;">
                <span style="color: green;">Spot on! Match correct. 🌟</span>
                <img src="${gifOk}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">
            </div>
             `;
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
                    const gifKo = minionsTristes[Math.floor(Math.random() * minionsTristes.length)];
        feedback.innerHTML = `
            <div style="text-align: center; margin-top: 10px;">
                <p style="color: red; margin-bottom: 8px;">Not quite. This idiom is typically considered: <strong>${respuestaCorrecta}</strong></p>
                <img src="${gifKo}" style="width: 90px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            </div>
              `;
                }
                if (typeof sonidoIncorrecto !== 'undefined') sonidoIncorrecto.play();
                
                puntos = Math.max(0, puntos - 1);
                actualizarPuntos();
                
                setTimeout(() => {
                    botones.forEach(b => b.disabled = false);
                    if (feedback) feedback.textContent = "";
                }, 1500);
            }
        });
        if (opcionesContainer) opcionesContainer.appendChild(btn);
    });
}