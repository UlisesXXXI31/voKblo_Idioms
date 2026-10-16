 // ---- FUNCIONES DE NAVEGACIÓN Y LÓGICA DE LA APLICACIÓN ----
    function ocultarTodasLasPantallas() {
        const pantallas = document.querySelectorAll('.pantalla');
        pantallas.forEach(p => {
            p.classList.remove('pantalla-activa');
            p.classList.add('pantalla-oculta');
        });
    }

    function mostrarPantalla(idPantalla) {
        ocultarTodasLasPantallas();
        const pantalla = document.getElementById(idPantalla);
        if (pantalla) {
            pantalla.classList.remove("pantalla-oculta");
            pantalla.classList.add("pantalla-activa");
        }
    }

    // Función para obtener solo las palabras que el alumno quiere estudiar ahora
    function obtenerPalabrasSeleccionadas() {
    if (!leccionActual || !Array.isArray(leccionActual.palabras)) return [];

    const selector = document.getElementById("selector-bloque-examen");
    const opcion = selector ? selector.value : "todos";

        if (opcion === "todos" || opcion === "1") {
            if (opcion === "1") return leccionActual.palabras.slice(0, 20);
            return [...leccionActual.palabras];
        }

    const bloque = Number.parseInt(opcion, 10);
    if (!Number.isInteger(bloque) || bloque < 1) return [...leccionActual.palabras];
    const inicio = (bloque - 1) * 20;
    const fin = inicio + 20;

    const palabrasFiltradas = leccionActual.palabras.slice(inicio, fin);
    
    if (palabrasFiltradas.length === 0) {
        return [];
    }
    
    return palabrasFiltradas;
}

//funcion actualiza puntos
function actualizarPuntos() {
    // Buscamos el elemento directamente aquí
    const puntosTexto = document.getElementById("puntos"); 
    
    if (puntosTexto) {
        puntosTexto.textContent = `Puntos totales: ${puntos}`;
    }
}

//función mezclar palabras
function mezclarPalabras(array) {
    for (let indice = array.length - 1; indice > 0; indice--) {
        const otroIndice = Math.floor(Math.random() * (indice + 1));
        [array[indice], array[otroIndice]] = [array[otroIndice], array[indice]];
    }
    return array;
}

function mezclarCopia(elementos) {
    return mezclarPalabras([...elementos]);
}

function reproducirSonidoActividad(audio) {
    if (!audio || typeof audio.play !== "function") return;
    try {
        const reproduccion = audio.play();
        if (reproduccion && typeof reproduccion.catch === "function") {
            reproduccion.catch(error => console.warn("No se pudo reproducir el sonido de la actividad.", error));
        }
    } catch (error) {
        console.warn("No se pudo reproducir el sonido de la actividad.", error);
    }
}

 function mostrarActividadVacia() {
     const contenedor = document.getElementById("actividad-juego");
     if (contenedor) contenedor.textContent = "This block has no words. Choose another block or lesson.";
     if (typeof window.actualizarBarraProgreso === "function") window.actualizarBarraProgreso(0, 0);
 }

 function mostrarActividadCompletada(contenedor, mensaje) {
     actividadCompletada = true;
     if (!contenedor) return;

     contenedor.innerHTML = "";
     const titulo = document.createElement("h3");
     titulo.textContent = "Activity completed! 🏆";
     const descripcion = document.createElement("p");
     descripcion.textContent = mensaje;
     contenedor.append(titulo, descripcion);

     const trofeos = window.gifsCopasVictoria || [];
     if (trofeos.length > 0) {
         const imagen = document.createElement("img");
         imagen.src = trofeos[Math.floor(Math.random() * trofeos.length)];
         imagen.alt = "Victory trophy";
         imagen.style.cssText = "display:block;width:100%;max-width:260px;margin:20px auto;border-radius:12px";
         contenedor.appendChild(imagen);
     }

     if (typeof window.actualizarBarraProgreso === "function") {
         window.actualizarBarraProgreso(1, 1);
     }
 }

 // Context uses the same selected block as every other activity.
     function filtrarPalabrasParaActividad() {
     return obtenerPalabrasSeleccionadas();
 }