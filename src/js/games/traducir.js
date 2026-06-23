// --- VARIABLES GLOBALES PARA TRADUCIR (SENTENCE TRANSFORMATION C2) ---
let traducirPalabras = [];
let traducirIndice = 0;
let palabrasSeleccionadasUser = []; // Guarda las palabras que el usuario va pinchando



function iniciarTraducir() {
    console.log("Iniciando actividad Sentence Transformation C2...");
    
    traducirPalabras = obtenerPalabrasSeleccionadas(); 

    if (!traducirPalabras || traducirPalabras.length === 0) {
        alert("Por favor, selecciona una lección y un bloque de modismos.");
        return;
    }

    traducirIndice = 0;
    // Mezclamos los modismos del bloque
    traducirPalabras.sort(() => Math.random() - 0.5);

    mostrarPalabraTraducir();
}

function mostrarPalabraTraducir() {
    // 📊 ACTUALIZACIÓN SEGURA Y GLOBAL DE LA BARRA DE PROGRESO (C2 FIXED)
    if (typeof window.actualizarBarraProgreso === 'function') {
        window.actualizarBarraProgreso(traducirIndice, traducirPalabras.length);
    } else if (typeof actualizarBarraProgreso === 'function') {
        actualizarBarraProgreso(traducirIndice, traducirPalabras.length);
    }

    const contenedor = document.getElementById("actividad-juego");
    if (!contenedor) return;

    if (traducirIndice >= traducirPalabras.length) {
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
        guardarPuntuacionEnHistorial(); 
        return;
    }

    const palabra = traducirPalabras[traducirIndice];
    palabrasSeleccionadasUser = []; // Reseteamos la selección del alumno

    // Extraemos la respuesta correcta del hueco (ej: "bite the bullet")
    const solucionCorrecta = (palabra.respuesta_cloze || palabra.ingles).trim().toLowerCase();
    
    // Separamos el modismo en palabras individuales para los bloques
    let bloquesPalabras = solucionCorrecta.split(" ");
    
    // Obtenemos la palabra clave (normalmente la última o la más representativa en mayúsculas)
    const palabraClave = bloquesPalabras[bloquesPalabras.length - 1].toUpperCase();

    // Mezclamos los bloques de palabras para que salgan desordenados
    let bloquesDesordenados = [...bloquesPalabras].sort(() => Math.random() - 0.5);

    contenedor.innerHTML = `
        <div class="actividad-card">
            <p style="color: #666; margin-bottom: 5px;">Sentence ${traducirIndice + 1} de ${traducirPalabras.length}</p>
            
            <p><strong>Original Sentence:</strong></p>
            <h4 style="color: #555; background: #f5f5f5; padding: 10px; border-radius: 6px; font-style: italic;">
                "${palabra.frase_formal || "We need to face this tough situation."}"
            </h4>
            
            <p style="margin-top: 15px;"><strong>Key Word to Use:</strong> <span style="color: #e91e63; font-weight: bold; font-size: 1.2rem;">${palabraClave}</span></p>
            
            <p style="margin-top: 15px;"><strong>Complete the transformation:</strong></p>
            <h4 style="color: #1976d2; margin-bottom: 20px;">
                "${palabra.frase_transformada || "We need to ____ and accept the consequences."}"
            </h4>
            
            <div id="zona-resultado" style="min-height: 45px; background: #fff; border: 2px dashed #ccc; border-radius: 8px; padding: 8px; margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 5px; align-items: center;">
                <span style="color: #aaa; font-size: 0.9rem;" id="placeholder-zona">Click the blocks below to build the idiom...</span>
            </div>
            
            <div id="zona-bloques" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 20px;"></div>
            
            <div id="mensaje-feedback" style="font-weight: bold; min-height: 25px; margin-bottom: 10px;"></div>
            
            <div style="display: flex; gap: 10px;">
                <button id="btn-borrar-todo" class="actividad-btn" style="background-color: #777; width: 30%;">Reset</button>
                <button id="btn-verificar-traduccion" class="actividad-btn" style="width: 70%;">Check Upgrade</button>
            </div>
        </div>
    `;

    const zonaResultado = document.getElementById("zona-resultado");
    const zonaBloques = document.getElementById("zona-bloques");
    const placeholder = document.getElementById("placeholder-zona");

    // Función interna para renderizar los bloques del pool desordenado
    const renderizarBloquesDisponibles = () => {
        zonaBloques.innerHTML = "";
        bloquesDesordenados.forEach((word, index) => {
            const btnWord = document.createElement("button");
            btnWord.textContent = word;
            btnWord.style.padding = "6px 12px";
            btnWord.style.cursor = "pointer";
            btnWord.style.border = "1px solid #1976d2";
            btnWord.style.borderRadius = "5px";
            btnWord.style.background = "#fff";
            btnWord.style.color = "#1976d2";
            btnWord.style.fontWeight = "bold";

            btnWord.onclick = () => {
                if (placeholder) placeholder.style.display = "none";
                
                // Mover a la selección del usuario
                palabrasSeleccionadasUser.push(word);
                
                // Crear el bloque visual en el resultado
                const blockRes = document.createElement("span");
                blockRes.textContent = word;
                blockRes.style.background = "#1976d2";
                blockRes.style.color = "#fff";
                blockRes.style.padding = "4px 10px";
                blockRes.style.borderRadius = "4px";
                blockRes.style.fontWeight = "bold";
                zonaResultado.appendChild(blockRes);

                // Quitar de los disponibles y re-renderizar
                bloquesDesordenados.splice(index, 1);
                renderizarBloquesDisponibles();
            };
            zonaBloques.appendChild(btnWord);
        });
    };

    // Evento resetear: Devuelve todas las palabras a su estado desordenado inicial
    document.getElementById("btn-borrar-todo").onclick = () => {
        bloquesDesordenados = solucionCorrecta.split(" ").sort(() => Math.random() - 0.5);
        palabrasSeleccionadasUser = [];
        zonaResultado.innerHTML = "";
        zonaResultado.appendChild(placeholder);
        placeholder.style.display = "block";
        renderizarBloquesDisponibles();
    };

    document.getElementById("btn-verificar-traduccion").onclick = () => verificarTraducir(solucionCorrecta);

    // Inicializamos los bloques
    renderizarBloquesDisponibles();
}

function verificarTraducir() {
    const inputElement = document.getElementById("input-traduccion");
    const feedback = document.getElementById("mensaje-feedback");
    
    if (!inputElement || !feedback) return;
    
    const palabra = traducirPalabras[traducirIndice];
    const textoUsuario = inputElement.value.trim().toLowerCase();
    
    // Asumimos que la respuesta correcta está en palabra.ingles (o cámbialo por tu propiedad real)
    const solucionCorrecta = palabra.ingles.trim().toLowerCase();
    
    // Deshabilitamos el botón de verificar temporalmente
    const btnVerificar = document.getElementById("btn-verificar-traducir");
    if (btnVerificar) btnVerificar.disabled = true;

    if (textoUsuario === solucionCorrecta) {
        // 🍏 CASO: ACIERTO
        const gifOk = window.minionsFelices[Math.floor(Math.random() * window.minionsFelices.length)];
        feedback.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 10px;">
                <span style="color: green;">Spot on! Match correct. 🌟</span>
                <img src="${gifOk}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">
            </div>
        `;
        if (typeof sonidoCorrcto !== 'undefined') sonidoCorrcto.play();
        
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        
        puntos++;
        if (typeof actualizarRacha === 'function') actualizarRacha(); 
        if (typeof actualizarPuntos === 'function') actualizarPuntos();
        localStorage.setItem('puntosTotales', puntos.toString());
        traducirIndice++;
        
        setTimeout(mostrarPreguntaTraducir, 1200);
        
    } else {
        // 🍎 CASO: FALLO (Minion Triste)
        const gifKo = window.minionsTristes[Math.floor(Math.random() * window.minionsTristes.length)];
        feedback.innerHTML = `
            <div style="text-align: center; margin-top: 10px;">
                <p style="color: red; margin-bottom: 8px;">Not quite. Correct: <strong>${palabra.ingles}</strong></p>
                <img src="${gifKo}" style="width: 90px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            </div>
        `;
        if (typeof sonidoIncorrecto !== 'undefined') sonidoIncorrecto.play();
        
        puntos = Math.max(0, puntos - 1);
        if (typeof actualizarPuntos === 'function') actualizarPuntos();
        
        setTimeout(() => {
            if (btnVerificar) btnVerificar.disabled = false;
            feedback.innerHTML = "";
        }, 2000);
    }
}