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
    // 📊 ACTUALIZACIÓN EN TIEMPO REAL: Se ejecuta en cada pregunta con los datos frescos
    if (typeof actualizarBarraProgreso === 'function') {
        actualizarBarraProgreso(eleccionIndice, eleccionPalabras.length);
    }
    
    // Apuntamos al contenedor interno para NO destruir la barra de progreso superior
    const interfazJuego = document.getElementById("interfaz-opciones") || document.getElementById("actividad-juego");
    
    if (eleccionIndice >= eleccionPalabras.length) {
        if (interfazJuego) {
            interfazJuego.innerHTML = `
                <div style='text-align:center; padding: 20px;'>
                    <h3>Activity Completed! 👔</h3>
                    <p>You have mastered the register and nuances of these C2 idioms.</p>
                </div>`;
        }
        guardarPuntuacionEnHistorial(); 
        return;
    }
    
    const palabra = eleccionPalabras[eleccionIndice];
    const opciones = ["formal", "informal", "idiomatic/neutral"];
    
    if (interfazJuego) {
        interfazJuego.innerHTML = `
            <p><strong>C2 Idiom:</strong> <span style="font-size: 1.2rem; color: #0070f3;">${palabra.ingles}</span></p>
            <p style="font-style: italic; color: #555; margin-bottom: 1.5rem;">
                <strong>Usage Note:</strong> ${palabra.contexto_uso || "Advanced descriptive context..."}
            </p>
            <p><em>Select the correct register:</em></p>
            <div id="opciones-multiple"></div>
            <div id="mensaje-feedback" style="margin-top:1rem; font-weight: bold; min-height: 20px;"></div>
        `;
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
            
            // Bloqueamos temporalmente los botones para evitar clics dobles fantasmas
            const botones = opcionesContainer.querySelectorAll("button");
            botones.forEach(b => b.disabled = true);
            
            if (opcion === respuestaCorrecta) {
                if (feedback) {
                    feedback.textContent = "Spot on! Match correct. 🌟";
                    feedback.style.color = "green";
                }
                if (typeof sonidoCorrcto !== 'undefined') sonidoCorrcto.play();
                
                // 🎉 Confeti al 100%
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
                
                // Si falla, le dejamos reintentar la pregunta reactivando los botones en 1.5s
                setTimeout(() => {
                    botones.forEach(b => b.disabled = false);
                    if (feedback) feedback.textContent = "";
                }, 1500);
            }
        });
        if (opcionesContainer) opcionesContainer.appendChild(btn);
    });
}