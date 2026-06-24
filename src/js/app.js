

document.addEventListener("DOMContentLoaded", () => {

    

    // ---- LÓGICA DE AUTENTICACIÓN ----
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token || userRole !== 'student') {
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

    // 🎯 Reemplaza las listas en tu app.js con estos links estables:

window.minionsFelices = [
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTFzQlhWeE5zN3Y2V0EvZ2lmX2J5X2lkJnN0PXRydWUmY3Q9Zw/11sBLVxNs7v6WA/giphy.gif", // Aplauso
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2lCY3dFWGVnN2JpbmRoSVkmc3Q9dHJ1ZSZjdD1n/kiBcwEXeg7bindAhIY/giphy.gif"   // Baile
];

window.minionsTristes = [
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOVk1QmJEU2tTVGlZOFZJZm96Y3Q9Zw/9Y5BbDSkSTiY8/giphy.gif", // Llorando
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExWTNibWU3NjdMSk1LNCZjdD1n/Y3bme767LJMK4/giphy.gif"  // Decepción
];

window.gifsCopasVictoria = [
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM283cUUxWU43YUJPRlBSdzhFInternal/3o7qE1YN7aBOFPRw8E/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjZ1NGN3YjNkVjFjQm1TVGFFInternal/26u4cwb3dV1cBm9Ta/giphy.gif"
];

     // <<< INICIO CÓDIGO RACHA - Elemento DOM >>>
    const rachaElemento = document.getElementById('racha-display'); 
    // <<< FIN CÓDIGO RACHA - Elemento DOM >>>
  
    actualizarPuntos();
    actualizarRachaDisplay();
    

     // Registro del Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
navigator.serviceWorker.register('./service-worker.js', {
    scope: './' // <-- ¡AÑADE/CORRIGE ESTA LÍNEA!
})
// ... el resto de tu .then y .catch'
            
            .then(function(registration) {
                console.log('✅ SW registrado correctamente con scope:', registration.scope);
                
                // Opcional: Verificar updates
                registration.addEventListener('updatefound', function() {
                    const newWorker = registration.installing;
                    console.log('🔄 Nueva versión de SW encontrada');
                    
                    newWorker.addEventListener('statechange', function() {
                        console.log('📊 Estado del nuevo SW:', newWorker.state);
                    });
                });
            })
            .catch(function(error) {
                console.log('❌ Error registrando SW:', error);
                
                // Debug adicional
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    console.log('📋 SWs actualmente registrados:', registrations.length);
                });
            });
        });
    } else {
        console.log('❌ Service Worker no soportado en este navegador');
    }
}

// Ejecutar el registro
registerServiceWorker();
    

   

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
        mostrarListaPalabras(leccion);
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
            { id: "contexto", nombre: "Context (Bloques 20)" } 
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
            mostrarPantalla("pantalla-actividades");
            actividadJuego.innerHTML = "";
        };
    }

    if (btnVolverLecciones) {
        btnVolverLecciones.addEventListener("click", () => {
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
    if (!total || total === 0) {
        // Si no hay preguntas o volvemos al menú, ocultamos la barra
        const contenedorBarra = document.getElementById("barra-progreso-contenedor-raiz");
        if (contenedorBarra) contenedorBarra.style.display = "none";
        return;
    }

    const contenedorBarra = document.getElementById("barra-progreso-contenedor-raiz");
    const barra = document.getElementById("barra-progreso-element");

    if (contenedorBarra && barra) {
        // 🎯 1. Forzamos a que sea visible en cualquier actividad activa
        contenedorBarra.style.display = "block";

        // 🎯 2. Cálculo puro del porcentaje
        const porcentaje = (actual / total) * 100;
        
        // Ajuste para que la pregunta 1 muestre un pequeño rastro de color
        const anchoVisual = porcentaje === 0 ? 2 : porcentaje;
        
        // 🎯 3. Aplicamos el color de forma inmediata
        barra.style.width = `${anchoVisual}%`;

        console.log(`[Barra Estructurada] Posición: ${actual}/${total} (${porcentaje}%)`);
    } else {
        console.warn("⚠️ No se encontraron las IDs de la barra fija en el index.html");
    }
}

// Aseguramos el entorno global
window.actualizarBarraProgreso = actualizarBarraProgreso;
    // Iniciar actividad
    function iniciarActividad(idActividad) {
        actividadActual = idActividad;
        if (tituloActividad) {
            tituloActividad.textContent = {
                "flashcards": "Actividad: Flashcards",
                "traducir": "Actividad: Translate",
                "emparejar": "Actividad: Match",
                "eleccion-multiple": "Actividad: Multiple choice",
                "contexto": "Actividad: Context"
            }[idActividad] || "Actividad";
        }
        
        if (actividadJuego) {actividadJuego.innerHTML = `<!-- Contenedor exterior de la barra de progreso estilo Duolingo -->
            <div id="wrapper-progreso" style="background-color: #e0e0e0; border-radius: 10px; width: 100%; height: 12px; margin: 10px 0 20px 0; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                <div id="barra-progreso-juego" style="background-color: #4caf50; width: 0%; height: 100%; transition: width 0.4s ease-in-out; border-radius: 10px;"></div>
            </div>
            <!-- Contenedor dinámico secundario donde se renderizará el juego en sí -->
            <div id="contenido-sub-juego"></div>
        `;
        }

        //Modificamos el contenedor objetivo para que los juegos no borren la barra de progreso
    // cambiamos temporalmente la referencia o adaptando el flujo:
    const contenedorOriginal = actividadJuego;
    
    // Forzamos a que el renderizado de los juegos caiga en nuestro nuevo sub-contenedor
    const subContenedor = document.getElementById("contenido-sub-juego");

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
    
  


// 4. Botón Volver
const btnVolverContexto = document.getElementById("btn-volver-de-contexto");
if (btnVolverContexto) {
    btnVolverContexto.onclick = () => {
        mostrarPantalla("pantalla-actividades");
        mostrarActividades(); // Corregido el nombre (con 'r')
    };
}
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
            alert("¡Has terminado el repaso de este bloque!");
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
        mostrarPantalla("pantalla-actividades");
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

