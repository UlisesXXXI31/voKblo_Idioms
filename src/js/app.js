

document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById("splash-screen");
    const splashStartedAt = performance.now();
    const minimumSplashDuration = 1000;

    function hideSplashScreen() {
        if (!splashScreen) return;

        const remainingDuration = Math.max(
            0,
            minimumSplashDuration - (performance.now() - splashStartedAt)
        );

        window.setTimeout(() => {
            splashScreen.classList.add("splash-screen--hidden");
            splashScreen.addEventListener("transitionend", () => {
                splashScreen.remove();
            }, { once: true });
            window.setTimeout(() => splashScreen.remove(), 350);
        }, remainingDuration);
    }

    // ---- LÓGICA DE AUTENTICACIÓN ----
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token || userRole !== 'student') {
        splashScreen?.remove();
        window.location.href = 'pages/login.html';
        return; // Detener la ejecución del script
    }

    // A partir de aquí, el usuario está autenticado como alumno
    const appContainer = document.getElementById("app-container");
    if (appContainer) {
        appContainer.classList.remove('pantalla-oculta');
        appContainer.classList.add('pantalla-activa');
    }
    
    // ---- VARIABLES GLOBALES Y ELEMENTOS DEL DOM ----
    
   
    // Elementos del DOM
    const pantallaLecciones = document.getElementById("pantalla-lecciones");
    const pantallaActividades = document.getElementById("pantalla-actividades");
    const pantallaActividad = document.getElementById("pantalla-actividad");
    const leccionesContainer = document.getElementById("lecciones-container");
    const actividadesContainer = document.getElementById("actividades-container");
    const actividadJuego = document.getElementById("actividad-juego");
    const tituloLeccion = document.getElementById("titulo-leccion");
    const tituloActividad = document.getElementById("titulo-actividad");
    const puntosTexto = document.getElementById("puntos");
    const btnReiniciarPuntos = document.getElementById("btn-reiniciar-puntos");
    const btnVerHistorial = document.getElementById("btn-ver-historial");
    const btnGuardarPuntos = document.getElementById("btn-guardar-puntos");
    const pantallaListaPalabras = document.getElementById("pantalla-lista-palabras");
    const listaPalabrasContainer = document.getElementById("lista-palabras-container");
    const tituloListaLeccion = document.getElementById("titulo-lista-leccion");
    const btnIrActividades = document.getElementById("btn-ir-actividades");
    const btnVolverLista = document.getElementById("btn-volver-lista");
    const pantallaHistorial = document.getElementById("pantalla-historial");
    const contenedorHistorial = document.getElementById("historial-container");
    const btnSalirHistorial = document.getElementById("btn-salir-historial");
    const btnVolverLecciones = document.getElementById("btn-volver-lecciones");
    const btnVolverActividades = document.getElementById("btn-volver-actividades");
    const btnLogout = document.getElementById('btn-logout');

   

// configuración robusta:Variable globales gifs

window.minionsFelices = [
    "https://i.imgur.com/h2Upoow.gif", // Minion celebrando/bailando limpio
    "https://i.imgur.com/gSawMde.gif"  // Minions gritando con ganas
];

window.minionsTristes = [
    "https://i.imgur.com/J1aQmdL.gif", // presentador desesperado
    "https://i.imgur.com/IKrsnZ4.gif"  // Minion confundido / "¿Qué?!"
];

window.gifsCopasVictoria = [
    "https://cdnl.iconscout.com/lottie/premium/thumb/copa-trofeo-rays-animation-gif-download-11682257.gif" // Trofeo de oro con destellos
    
];

     // <<< INICIO CÓDIGO RACHA - Elemento DOM >>>
    const rachaElemento = document.getElementById('racha-display'); 
    // <<< FIN CÓDIGO RACHA - Elemento DOM >>>
  
    actualizarPuntos();
    actualizarRachaDisplay();
    

    // Lógica de cerrar sesión
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userData');
            window.location.href = 'pages/login.html'; // Redirigir a la página de login
        });
    }

    function mostrarLecciones() {
        if (!leccionesContainer) return;
        leccionesContainer.innerHTML = "";
        datosLecciones.lecciones.forEach(leccion => {
            const btn = document.createElement("button");
            btn.textContent = leccion.nombre;
            btn.className = "leccion-btn";
            btn.addEventListener("click", () => {
                seleccionarLeccion(leccion);
            });
            leccionesContainer.appendChild(btn);
        });
    }

    function seleccionarLeccion(leccion) {
        leccionActual = leccion;
        if (tituloLeccion) tituloLeccion.textContent = leccion.nombre;
        actualizarSelectorBloques(leccion);
        mostrarListaPalabras(leccion);
    }

    function actualizarSelectorBloques(leccion) {
        const selector = document.getElementById("selector-bloque-examen");
        if (!selector) return;

        const total = leccion.palabras.length;
        const bloques = Math.ceil(total / 20);
        selector.innerHTML = "";
        for (let numero = 1; numero <= bloques; numero++) {
            const inicio = (numero - 1) * 20 + 1;
            const fin = Math.min(numero * 20, total);
            const opcion = document.createElement("option");
            opcion.value = numero.toString();
            opcion.textContent = `Block ${numero} (${inicio} - ${fin})`;
            selector.appendChild(opcion);
        }
        const todos = document.createElement("option");
        todos.value = "todos";
        todos.textContent = "General review";
        selector.appendChild(todos);
        selector.value = "1";
    }

    function mostrarListaPalabras(leccion) {
        mostrarPantalla("pantalla-lista-palabras");
        if (!pantallaListaPalabras || !listaPalabrasContainer || !tituloListaLeccion) return;
        leccionActual = leccion;
        tituloListaLeccion.textContent = `Palabras de la lección: ${leccion.nombre}`;
        listaPalabrasContainer.innerHTML = "";
        const tabla = document.createElement("table");
        tabla.innerHTML = "<thead><tr><th>English</th><th>Español</th></tr></thead><tbody></tbody>";
        leccion.palabras.forEach(par => {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td>${par.ingles}</td><td>${par.espanol}</td>`;
            tabla.querySelector("tbody").appendChild(fila);
        });
        listaPalabrasContainer.appendChild(tabla);
    }

    

    function mostrarActividades() {
        if (!actividadesContainer) return;
        actividadesContainer.innerHTML = "";
        const actividades = [
            { id: "flashcards", nombre: "Flashcards" },
            { id: "traducir", nombre: "Sentence transformation" },
            { id: "emparejar", nombre: "Match the idioms" },
            { id: "eleccion-multiple", nombre: "register & Nuances" },
            { id: "contexto", nombre: "Context quiz" }
        ];
        actividades.forEach(act => {
            const btn = document.createElement("button");
            btn.textContent = act.nombre;
            btn.className = "actividad-btn";
            btn.addEventListener("click", () => {
                iniciarActividad(act.id);
            });
            actividadesContainer.appendChild(btn);
        });
    }

   
  
        

    if (btnReiniciarPuntos) {
        btnReiniciarPuntos.addEventListener("click", () => {
            puntos = 0;
            actualizarPuntos();
        });
    }

    // Botones de navegación
    if (btnIrActividades) {
        btnIrActividades.addEventListener("click", () => {
            mostrarPantalla("pantalla-actividades");
            mostrarActividades();
            actividadJuego.innerHTML = "";
        });
    }

    if (btnVolverActividades) {
        btnVolverActividades.onclick = () => {
            sesionActividad++;
            mostrarPantalla("pantalla-actividades");
            actividadJuego.innerHTML = "";
        };
    }

    if (btnVolverLecciones) {
        btnVolverLecciones.addEventListener("click", () => {
            sesionActividad++;
            mostrarPantalla("pantalla-lecciones");
            mostrarLecciones();
            actividadJuego.innerHTML = "";
        });
    }

    if (btnVolverLista) {
        btnVolverLista.addEventListener("click", () => {
            mostrarPantalla("pantalla-lecciones");
            mostrarLecciones();
        });
    }

    if (btnVerHistorial) {
        btnVerHistorial.addEventListener("click", () => {
            mostrarHistorial();
            mostrarPantalla("pantalla-historial");
        });
    }

    if (btnGuardarPuntos) {
        btnGuardarPuntos.addEventListener("click", () => {
            guardarPuntuacionEnHistorial();
        });
    }

    if (btnSalirHistorial) {
        btnSalirHistorial.addEventListener("click", () => {
            mostrarPantalla("pantalla-lecciones");
            mostrarLecciones();
        });
    }
  
// --- DENTRO DEL EVENTO DOMContentLoaded ---

// 1. Botón para ABRIR el ranking
// IMPORTANTE: Verificar que en el HTML el botón tenga id="btn-ranking"
const btnRanking = document.getElementById('btn-ranking'); 
if (btnRanking) {
    btnRanking.addEventListener('click', () => {
        mostrarPantalla('pantalla-ranking'); // Usa tu función de navegación
        cargarDatosRanking();               // Llama a la función de cargar datos
    });
}

// 2. Botón para VOLVER (el que está dentro de la pantalla ranking)
const btnVolverRanking = document.getElementById('btn-volver-ranking');
if (btnVolverRanking) {
    btnVolverRanking.addEventListener('click', () => {
        mostrarPantalla('pantalla-lecciones');
         mostrarLecciones();// Cambia 'pantalla-principal' por el ID de tu menú
    });
}
    
// ---------------------------------------------

  
    // --- VARIABLES GLOBALES DE APOYO PARA PROGRESO ---
   //✨ FUNCIÓN CORREGIDA Y GENÉRICA:
function actualizarBarraProgreso(actual, total) {
    const contenedorBarra = document.getElementById("barra-progreso-contenedor-raiz");
    const barra = document.getElementById("barra-progreso-element");
    if (!contenedorBarra || !barra) return;
    if (!Number.isFinite(total) || total <= 0) {
        contenedorBarra.style.display = "none";
        barra.style.width = "0%";
        return;
    }

    contenedorBarra.style.display = "block";
    const porcentaje = Math.max(0, Math.min(100, (actual / total) * 100));
    barra.style.width = `${porcentaje === 0 ? 2 : porcentaje}%`;
}

// Aseguramos el entorno global
window.actualizarBarraProgreso = actualizarBarraProgreso;
    // Iniciar actividad
    function iniciarActividad(idActividad) {
        sesionActividad++;
        actividadActual = idActividad;
        actividadCompletada = false;
        if (tituloActividad) {
            tituloActividad.textContent = {
                "flashcards": "Actividad: Flashcards",
                "traducir": "Actividad: Translate",
                "emparejar": "Actividad: Match",
                "eleccion-multiple": "Actividad: Multiple choice",
                "contexto": "Actividad: Context"
            }[idActividad] || "Actividad";
        }
        
        if (actividadJuego) actividadJuego.innerHTML = "";
        if (typeof window.actualizarBarraProgreso === "function") window.actualizarBarraProgreso(0, 0);

        mostrarPantalla("pantalla-actividad");
           if (idActividad === "flashcards"){
               iniciarFlashcards();
        } else if (idActividad === "traducir") {
            iniciarTraducir();
        } else if (idActividad === "emparejar") {
            iniciarEmparejar();
        } else if (idActividad === "eleccion-multiple") {
            iniciarEleccionMultiple();
        }else if (idActividad === "contexto") {
           iniciarContexto();
    }
}  

    // Iniciar la aplicación mostrando la primera pantalla
    mostrarPantalla("pantalla-lecciones");
    mostrarLecciones();
    actualizarPuntos();
    hideSplashScreen();
  


    //------FLASHCARDS---------
    // Girar al tocar la tarjeta
const objTarjeta = document.getElementById("tarjeta-objeto");
if (objTarjeta) {
    objTarjeta.onclick = () => objTarjeta.classList.toggle("girada");
}

// Botón Siguiente
const btnSig = document.getElementById("btn-flash-next");
if (btnSig) {
    btnSig.onclick = () => {
        if (indiceFlash < listaFlashcards.length - 1) {
            indiceFlash++;
            actualizarContenidoTarjeta();
        } else {
            indiceFlash = listaFlashcards.length;
            actualizarContenidoTarjeta();
        }
    };
}

// Botón Anterior
const btnAnt = document.getElementById("btn-flash-prev");
if (btnAnt) {
    btnAnt.onclick = () => {
        if (indiceFlash > 0) {
            indiceFlash--;
            actualizarContenidoTarjeta();
        }
    };
}

// Botón Volver
const btnVol = document.getElementById("btn-flash-volver");
if (btnVol) {
    btnVol.onclick = () => {
        sesionActividad++;
        mostrarPantalla("pantalla-actividades");
        mostrarActividades();
    };
}

function mostrarPopUpGif(urlGif, duracion = 1500) {
    // 1. Creamos la capa negra de fondo (overlay) que cubre la pantalla
    const overlay = document.createElement("div");
    overlay.id = "minion-pop-up-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; // Fondo oscuro semitransparente
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "99999"; // Por encima de TODO
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.2s ease-out";

    // 2. Creamos la caja del GIF con una animación de escalado (Pop)
    const cajaContenedora = document.createElement("div");
    cajaContenedora.style.transform = "scale(0.7)";
    cajaContenedora.style.transition = "transform 0.2s ease-out";
    
    const img = document.createElement("img");
    img.src = urlGif;
    img.style.width = "280px"; // 📐 Tamaño mayor y vistoso
    img.style.height = "auto";
    img.style.borderRadius = "15px";
    img.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";

    cajaContenedora.appendChild(img);
    overlay.appendChild(cajaContenedora);
    document.body.appendChild(overlay);

    // 3. Activamos las animaciones de entrada un milisegundo después de meterlo al DOM
    setTimeout(() => {
        overlay.style.opacity = "1";
        cajaContenedora.style.transform = "scale(1)";
    }, 10);

    // 4. Lo desvanecemos y destruimos automáticamente cuando pase el tiempo (duracion)
    setTimeout(() => {
        overlay.style.opacity = "0";
        cajaContenedora.style.transform = "scale(0.8)";
        
        // Esperamos a que termine la animación de salida para borrarlo del HTML
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 200);
    }, duracion);
}

// Lo hacemos accesible para todos los archivos del juego
window.mostrarPopUpGif = mostrarPopUpGif;
});
