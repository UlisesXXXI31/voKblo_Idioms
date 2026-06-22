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
                feedback.textContent = "Spot on! 🌟";
                feedback.style.color = "green";
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
                        actividadJuego.innerHTML = `
                            <div style="text-align: center; padding: 20px;">
                                <h3>Activity Completed! 🏆</h3>
                                <p>Excellent! You have matched all the advanced expressions.</p>
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
                feedback.textContent = "Not quite. Try another combination! ❌";
                feedback.style.color = "red";
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