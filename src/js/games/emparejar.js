let emparejarPalabras = [];
let emparejarPares = [];
let emparejarSeleccionados = [];
let emparejarBloque = 0;
const BLOQUE_TAMANIO = 10;
let bloquePalabrasActual = []; 


function iniciarEmparejar() {
    const actividadJuego = document.getElementById("actividad-juego");

    if (actividadJuego) {
        actividadJuego.innerHTML = "";
        emparejarPalabras = obtenerPalabrasSeleccionadas();
        emparejarPares = [];
        emparejarSeleccionados = [];
        emparejarBloque = 0;
        cargarBloqueEmparejar();
    }
}

function cargarBloqueEmparejar() {
    const actividadJuego = document.getElementById("actividad-juego");
    emparejarSeleccionados = [];
    
    if (actividadJuego) actividadJuego.innerHTML = "";
    
    const inicio = emparejarBloque * BLOQUE_TAMANIO;
    const fin = Math.min(inicio + BLOQUE_TAMANIO, emparejarPalabras.length);
    
    bloquePalabrasActual = emparejarPalabras.slice(inicio, fin); 
    
    // Almacenamos la cantidad de parejas iniciales del bloque para la barra de progreso
    if (!actividadJuego.dataset.parejasTotales || actividadJuego.dataset.bloqueActual !== emparejarBloque.toString()) {
        actividadJuego.dataset.parejasTotales = bloquePalabrasActual.length.toString();
        actividadJuego.dataset.bloqueActual = emparejarBloque.toString();
    }
    
    // Actualización inicial de la barra para el bloque actual
    actualizarProgresoEmparejar();

    const inglesArr = bloquePalabrasActual.map(p => p.ingles).sort(() => Math.random() - 0.5);
    const espanolArr = bloquePalabrasActual.map(p => p.espanol).sort(() => Math.random() - 0.5);
    
    if (actividadJuego) {
        actividadJuego.innerHTML = `
            <p style="text-align: center; margin-bottom: 1.5rem; font-style: italic; color: #555;">
                Match the English idioms with their correct Spanish translation:
            </p>
            
            <div id="contenedor-columnas-emparejar" style="display: flex; gap: 20px; justify-content: space-between; align-items: start;">
                <div id="palabras-aleman" style="flex: 1; display: flex; flex-direction: column; gap: 10px;"></div>
                
                <div id="palabras-espanol" style="flex: 1; display: flex; flex-direction: column; gap: 10px;"></div>
            </div>
            
            <div id="mensaje-feedback" style="margin-top: 1.5rem; text-align: center; font-weight: bold; min-height: 25px;"></div>
        `;
    }
    
    const contenedorIngles = document.getElementById("palabras-aleman"); // Conserva tu ID original para evitar romper estilos CSS ajenos
    const contenedorEspanol = document.getElementById("palabras-espanol");

    inglesArr.forEach(p => { 
        const btnIng = document.createElement("button");
        btnIng.textContent = p; 
        btnIng.className = "btn-palabra";
        btnIng.style.width = "100%"; // Ocupar todo el ancho de su columna
        btnIng.addEventListener("click", () => seleccionarEmparejar("aleman", btnIng, p)); 
        if (contenedorIngles) contenedorIngles.appendChild(btnIng);
    });

    espanolArr.forEach(espanol => {
        const btnEsp = document.createElement("button");
        btnEsp.textContent = espanol;
        btnEsp.className = "btn-palabra";
        btnEsp.style.width = "100%"; // Ocupar todo el ancho de su columna
        btnEsp.addEventListener("click", () => seleccionarEmparejar("espanol", btnEsp, espanol));
        if (contenedorEspanol) contenedorEspanol.appendChild(btnEsp);
    });
}

function seleccionarEmparejar(tipo, btn, valor) {
    if (emparejarSeleccionados.length === 2) return;
    if (emparejarSeleccionados.find(s => s.tipo === tipo)) return;
    
    btn.classList.add("seleccionada");
    emparejarSeleccionados.push({ tipo, btn, valor });
    
    if (emparejarSeleccionados.length === 2) {
        const feedback = document.getElementById("mensaje-feedback");
        let palabraIngles, palabraEspanol;
        
        if (emparejarSeleccionados[0].tipo === "aleman") {
            palabraIngles = emparejarSeleccionados[0].valor;
            palabraEspanol = emparejarSeleccionados[1].valor;
        } else {
            palabraIngles = emparejarSeleccionados[1].valor;
            palabraEspanol = emparejarSeleccionados[0].valor;
        }
        
        const correcto = bloquePalabrasActual.some(p => p.ingles === palabraIngles && p.espanol === palabraEspanol);
        
        if (correcto) {
            puntos++;
            actualizarRacha(); 
            actualizarPuntos();
            localStorage.setItem('puntosTotales', puntos.toString());
            
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
            
            emparejarSeleccionados.forEach(s => {
                s.btn.style.visibility = "hidden";
                s.btn.disabled = true;
            });
            
            // Eliminamos la pareja del bloque actual
            bloquePalabrasActual = bloquePalabrasActual.filter(p => !(p.ingles === palabraIngles && p.espanol === palabraEspanol));
            
            // Actualizamos la barra tras un acierto
            actualizarProgresoEmparejar();

            if (bloquePalabrasActual.length === 0) { 
                emparejarBloque++;
                const actividadJuego = document.getElementById("actividad-juego");
                
                if (emparejarBloque * BLOQUE_TAMANIO >= emparejarPalabras.length) {
                    if (actividadJuego) {
                        const copaAleatoria = gifsCopasVictoria[Math.floor(Math.random() * gifsCopasVictoria.length)];

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
                    
                    }
                    if (typeof guardarPuntuacionEnHistorial === 'function') guardarPuntuacionEnHistorial();
                } else {
                    setTimeout(() => {
                        cargarBloqueEmparejar();
                        if (feedback) feedback.textContent = "";
                    }, 1000);
                }
            }
        } else {
            puntos = Math.max(0, puntos - 1);
            actualizarPuntos();
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
            
            setTimeout(() => {
                emparejarSeleccionados.forEach(s => {
                    s.btn.classList.remove("seleccionada");
                });
                emparejarSeleccionados = [];
                if (feedback) feedback.textContent = "";
            }, 1000);
            return; // Evitamos limpiar el array antes de tiempo en el flujo asíncrono
        }
        emparejarSeleccionados = [];
    }
}

// 📊 Función auxiliar para calcular el progreso dinámico por bloques de emparejar
function actualizarProgresoEmparejar() {
    if (typeof window.actualizarBarraProgreso === 'function' || typeof actualizarBarraProgreso === 'function') {
        const fn = window.actualizarBarraProgreso || actualizarBarraProgreso;
        const actividadJuego = document.getElementById("actividad-juego");
        const totalParejasBloque = actividadJuego && actividadJuego.dataset.parejasTotales ? parseInt(actividadJuego.dataset.parejasTotales) : BLOQUE_TAMANIO;
        
        // El progreso se calcula en base a cuántas parejas quedan ocultas
        const resueltas = totalParejasBloque - bloquePalabrasActual.length;
        fn(resueltas, totalParejasBloque);
    }
}