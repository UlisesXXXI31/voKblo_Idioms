let listaFlashcards = [];
let indiceFlash = 0;

function iniciarFlashcards() {
    listaFlashcards = obtenerPalabrasSeleccionadas(); // Tu función de bloques de 20

    if (!listaFlashcards || listaFlashcards.length === 0) {
        alert("Selecciona primero una lección y bloque.");
        return;
    }

    indiceFlash = 0;
    mezclarPalabras(listaFlashcards);
    
    // 📊 Sincronización segura de la barra de progreso al iniciar
    if (typeof window.actualizarBarraProgreso === 'function') {
        window.actualizarBarraProgreso(indiceFlash, listaFlashcards.length);
    } else if (typeof actualizarBarraProgreso === 'function') {
        actualizarBarraProgreso(indiceFlash, listaFlashcards.length);
    }
    
    mostrarPantalla("pantalla-flashcards"); // Asegúrate de que este ID existe en el HTML
    actualizarContenidoTarjeta();
}

function actualizarContenidoTarjeta() {
    // 📊 Actualizamos la barra de progreso en tiempo real cada vez que cambia la tarjeta
    if (typeof window.actualizarBarraProgreso === 'function') {
        window.actualizarBarraProgreso(indiceFlash, listaFlashcards.length);
    } else if (typeof actualizarBarraProgreso === 'function') {
        actualizarBarraProgreso(indiceFlash, listaFlashcards.length);
    }

    const item = listaFlashcards[indiceFlash];
    const tarjeta = document.getElementById("tarjeta-objeto");

    if (!tarjeta) return;

    // 1. Resetear el giro siempre al cambiar de palabra
    tarjeta.classList.remove("girada");

    // 2. Cambiar los textos (Usamos los IDs que pusimos en el HTML)
    // C2 Fix: Cambiar las referencias internas si es necesario, manteniendo los IDs de tu HTML estables
    const textoAlemanNode = document.getElementById("flash-texto-aleman");
    if (textoAlemanNode) textoAlemanNode.textContent = item.ingles;
    
    const textoEspanolNode = document.getElementById("flash-texto-espanol");
    if (textoEspanolNode) textoEspanolNode.textContent = item.espanol;
    
    const textoFraseNode = document.getElementById("flash-texto-frase");
    if (textoFraseNode) textoFraseNode.textContent = item.frase || "";
    
    const progresoNode = document.getElementById("flash-progreso");
    if (progresoNode) progresoNode.textContent = `Tarjeta ${indiceFlash + 1} de ${listaFlashcards.length}`;
}