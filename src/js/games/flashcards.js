let listaFlashcards = [];
let indiceFlash = 0;

function iniciarFlashcards() {
    listaFlashcards = obtenerPalabrasSeleccionadas();

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
    
    mostrarPantalla("pantalla-flashcards");
    actualizarContenidoTarjeta();
}

function actualizarContenidoTarjeta() {
    const tarjeta = document.getElementById("tarjeta-objeto");
    if (!tarjeta) return;

    tarjeta.classList.remove("girada");
    const textoAlemanNode = document.getElementById("flash-texto-aleman");
    const textoEspanolNode = document.getElementById("flash-texto-espanol");
    const textoFraseNode = document.getElementById("flash-texto-frase");
    const progresoNode = document.getElementById("flash-progreso");

    if (indiceFlash >= listaFlashcards.length) {
        actividadCompletada = true;
        if (textoAlemanNode) textoAlemanNode.textContent = "Review complete!";
        if (textoEspanolNode) textoEspanolNode.textContent = "Well done.";
        if (textoFraseNode) textoFraseNode.textContent = "You have reviewed every card in this selection.";
        if (progresoNode) progresoNode.textContent = `Completed ${listaFlashcards.length} cards`;
        return;
    }

    const item = listaFlashcards[indiceFlash];
    actividadCompletada = false;
    if (textoAlemanNode) textoAlemanNode.textContent = item.ingles || "";
    if (textoEspanolNode) textoEspanolNode.textContent = item.espanol || "";
    if (textoFraseNode) textoFraseNode.textContent = item.frase || "";
    if (progresoNode) progresoNode.textContent = `Tarjeta ${indiceFlash + 1} de ${listaFlashcards.length}`;
}