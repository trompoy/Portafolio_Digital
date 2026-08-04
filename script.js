const URL_EDITOR_IMAGEN = "editor-imagen/index.html";

document.addEventListener("DOMContentLoaded", () => {

    const inicioExpovisual = document.getElementById("inicioExpovisual");
    const menuProyectos = document.getElementById("menuProyectos");
    const portadaProducto = document.getElementById("portadaProducto");
    const pantallaSabores = document.getElementById("pantallaSabores");
    const pantallaComposicion = document.getElementById("pantallaComposicion");
    const pantallaGastronomia = document.getElementById("pantallaGastronomia");

    const abrirProyecto = document.getElementById("abrirProyecto");
    const abrirProducto = document.getElementById("abrirProducto");
    const abrirGastronomiaInicio = document.getElementById("abrirGastronomiaInicio");
    const abrirRetrato = document.getElementById("abrirRetrato");

    const volverPortadaInicial = document.getElementById("volverPortadaInicial");

    const volverMenuDesdeProducto = document.getElementById("volverMenuDesdeProducto");
    const volverMenuDesdeSabores = document.getElementById("volverMenuDesdeSabores");
    const volverMenuDesdeComposicion = document.getElementById("volverMenuDesdeComposicion");

    const luzMouse = document.getElementById("luzMouse");
    const logoPortada = document.getElementById("logoPortada");
    const logoGigante = document.getElementById("logoGigante");
    const botonExplorar = document.getElementById("botonExplorar");

    const volverPortada = document.getElementById("volverPortada");
    const volverSabores = document.getElementById("volverSabores");

    const escenario = document.getElementById("escenario");
    const imagenComposicion = document.getElementById("imagenComposicion");
    const tituloSabor = document.getElementById("tituloSabor");

    const panelFondos = document.getElementById("panelFondos");
    const abrirPanelFondos = document.getElementById("abrirPanelFondos");
    const cerrarPanel = document.getElementById("cerrarPanel");

    const botonEngranaje = document.getElementById("botonEngranaje");
    const desplegableAvanzado = document.getElementById("desplegableAvanzado");
    const botonOpcionesAvanzadas = document.getElementById("botonOpcionesAvanzadas");

    const botonesColor = document.querySelectorAll(".color-fondo");
    const selectorColor = document.getElementById("selectorColor");
    const colorHex = document.getElementById("colorHex");
    const aplicarHex = document.getElementById("aplicarHex");
    const mensajeError = document.getElementById("mensajeError");

    const pistaCarrusel = document.getElementById("pistaCarrusel");
    const tarjetasCarrusel = document.querySelectorAll(".tarjeta-carrusel");
    const flechaIzquierda = document.getElementById("flechaIzquierda");
    const flechaDerecha = document.getElementById("flechaDerecha");
    const nombreSaborActivo = document.getElementById("nombreSaborActivo");

    /* =========================================
       ELEMENTOS DE GASTRONOMÍA
    ========================================= */

    const botonIrGastronomia = document.getElementById("irGastronomia");
    const botonVolverGastronomia = document.getElementById("volverDesdeGastronomia");
    const contenedorParticulas = document.getElementById("contenedorParticulas");
    const botonVerFotografia = document.getElementById("verFotografiaGastronomica");
    const marcoGastronomia = document.getElementById("marcoGastronomia");
    const visorGastronomia = document.getElementById("visorGastronomia");
    const cerrarVisorGastronomia = document.getElementById("cerrarVisorGastronomia");
    const cerrarVisorFondo = document.getElementById("cerrarVisorFondo");

    let indiceActual = 2;

    /* =========================================
       FUNCIONES DE NAVEGACIÓN
    ========================================= */

    const pantallaRetrato = document.getElementById("pantallaRetrato");

    const pantallas = [
        inicioExpovisual,
        menuProyectos,
        portadaProducto,
        pantallaSabores,
        pantallaComposicion,
        pantallaGastronomia,
        pantallaRetrato
    ];

    function ocultarPantallas() {
        pantallas.forEach((pantalla) => {
            pantalla?.classList.add("oculto");
            pantalla?.classList.remove("entrando", "saliendo");
        });
    }

    function actualizarNavegacion(pantallaNueva) {
        // Ya no hay menú lateral que actualizar; se conserva la función
        // (y su llamada en mostrarConAnimacion/cambiarPantalla) por si en
        // el futuro se necesita reaccionar al cambio de pantalla.
    }

    function mostrarConAnimacion(pantallaNueva) {
        if (!pantallaNueva) return;

        ocultarPantallas();
        actualizarNavegacion(pantallaNueva);

        pantallaNueva.classList.remove("oculto");
        pantallaNueva.classList.add("entrando");
        window.scrollTo(0, 0);

        setTimeout(() => {
            pantallaNueva.classList.remove("entrando");
        }, 850);
    }

    function cambiarPantalla(pantallaActual, pantallaNueva) {
        if (!pantallaNueva) return;

        actualizarNavegacion(pantallaNueva);

        if (!pantallaActual || pantallaActual.classList.contains("oculto")) {
            mostrarConAnimacion(pantallaNueva);
            return;
        }

        pantallaActual.classList.add("saliendo");

        setTimeout(() => {
            pantallaActual.classList.add("oculto");
            pantallaActual.classList.remove("saliendo");

            pantallaNueva.classList.remove("oculto");
            pantallaNueva.classList.add("entrando");
            window.scrollTo(0, 0);

            setTimeout(() => {
                pantallaNueva.classList.remove("entrando");
            }, 850);
        }, 600);
    }

    function obtenerPantallaVisible() {
        return document.querySelector(".pantalla:not(.oculto)");
    }

    function mostrarInicio() {
        mostrarConAnimacion(inicioExpovisual);

        if (abrirPanelFondos) {
            abrirPanelFondos.style.display = "none";
        }

        panelFondos?.classList.add("cerrado");
    }

    function mostrarMenuProyectos() {
        mostrarConAnimacion(menuProyectos);

        if (abrirPanelFondos) {
            abrirPanelFondos.style.display = "none";
        }

        panelFondos?.classList.add("cerrado");
    }

    function mostrarProducto() {
        mostrarConAnimacion(portadaProducto);

        if (abrirPanelFondos) {
            abrirPanelFondos.style.display = "none";
        }

        panelFondos?.classList.add("cerrado");
    }

    function mostrarSabores() {
        mostrarConAnimacion(pantallaSabores);

        if (abrirPanelFondos) {
            abrirPanelFondos.style.display = "none";
        }

        panelFondos?.classList.add("cerrado");
        actualizarCarrusel();
    }

    function mostrarComposicion(sabor, rutaImagen) {
        if (!rutaImagen) {
            alert("Todavía falta agregar la fotografía completa de este sabor.");
            return;
        }

        mostrarConAnimacion(pantallaComposicion);

        const nombre = sabor.charAt(0).toUpperCase() + sabor.slice(1);

        if (tituloSabor) {
            tituloSabor.textContent = `Sabor ${nombre}`;
        }

        if (imagenComposicion) {
            imagenComposicion.style.display = "block";
            imagenComposicion.src = rutaImagen;
            imagenComposicion.alt =
                `Composición fotográfica de Galletas Amor sabor ${nombre}`;

            imagenComposicion.onerror = () => {
                alert(`No se encontró la imagen: ${rutaImagen}`);
            };
        }

        if (escenario) {
            escenario.style.backgroundColor = "#F8D8E4";
        }

        if (pantallaComposicion) {
            pantallaComposicion.style.backgroundColor = "#F8D8E4";
        }

        panelFondos?.classList.add("cerrado");

        if (abrirPanelFondos) {
            abrirPanelFondos.style.display = "block";
        }
    }

    function mostrarGastronomia() {
        const pantallaVisible = obtenerPantallaVisible();

        crearParticulas();
        cambiarPantalla(pantallaVisible, pantallaGastronomia);
    }

    /* =========================================
   RETRATO CINEMATOGRÁFICO - JavaScript
========================================= */

// Elementos
const volverDesdeRetrato = document.getElementById("volverDesdeRetrato");
const verRetratoCompleto = document.getElementById("verRetratoCompleto");
const marcoRetratoCine = document.getElementById("marcoRetratoCine");
const imagenRetratoCine = document.getElementById("imagenRetratoCine");
const visorRetratoCine = document.getElementById("visorRetratoCine");
const cerrarVisorFondoCine = document.getElementById("cerrarVisorFondoCine");
const cerrarVisorRetratoCine = document.getElementById("cerrarVisorRetratoCine");
const fotoRetratoAmpliadaCine = document.getElementById("fotoRetratoAmpliadaCine");

// Función para mostrar la sección de retrato
function mostrarRetrato() {
    const pantallaVisible = obtenerPantallaVisible();
    cambiarPantalla(pantallaVisible, pantallaRetrato);
}

// Abrir visor
function abrirVisorRetratoCine() {
    if (!visorRetratoCine) return;
    const src = imagenRetratoCine?.src || "img/retrato/retrato-principal.jpg";
    if (fotoRetratoAmpliadaCine) {
        fotoRetratoAmpliadaCine.src = src;
    }
    visorRetratoCine.classList.add("abierto");
    visorRetratoCine.setAttribute("aria-hidden", "false");
    document.body.classList.add("visor-abierto");
}

// Cerrar visor
function cerrarVisorRetratoCineFn() {
    if (!visorRetratoCine) return;
    visorRetratoCine.classList.remove("abierto");
    visorRetratoCine.setAttribute("aria-hidden", "true");
    document.body.classList.remove("visor-abierto");
}

// ============================================
// EVENTOS
// ============================================

// Navegación
volverDesdeRetrato?.addEventListener("click", mostrarMenuProyectos);

// Abrir visor
verRetratoCompleto?.addEventListener("click", abrirVisorRetratoCine);
marcoRetratoCine?.addEventListener("click", abrirVisorRetratoCine);

// Cerrar visor
cerrarVisorRetratoCine?.addEventListener("click", cerrarVisorRetratoCineFn);
cerrarVisorFondoCine?.addEventListener("click", cerrarVisorRetratoCineFn);

// Tecla Escape
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarVisorRetratoCineFn();
    }
});

// Actualizar el botón "abrirRetrato" del menú de proyectos
const abrirRetratoBtn = document.getElementById("abrirRetrato");
if (abrirRetratoBtn) {
    abrirRetratoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarRetrato();
    });
}

    /* =========================================
       EVENTOS DE NAVEGACIÓN GENERAL
    ========================================= */

    abrirProyecto?.addEventListener("click", mostrarMenuProyectos);
    abrirProducto?.addEventListener("click", mostrarProducto);
    abrirGastronomiaInicio?.addEventListener("click", mostrarGastronomia);
    abrirRetrato?.addEventListener("click", mostrarRetrato);

    volverPortadaInicial?.addEventListener("click", mostrarInicio);

    volverMenuDesdeProducto?.addEventListener("click", mostrarMenuProyectos);
    volverMenuDesdeSabores?.addEventListener("click", mostrarMenuProyectos);
    volverMenuDesdeComposicion?.addEventListener("click", mostrarMenuProyectos);

    /* =========================================
       EVENTOS DE NAVEGACIÓN DEL PROYECTO
    ========================================= */

    logoPortada?.addEventListener("click", mostrarSabores);
    logoGigante?.addEventListener("click", mostrarSabores);
    botonExplorar?.addEventListener("click", mostrarSabores);

    volverPortada?.addEventListener("click", mostrarProducto);
    volverSabores?.addEventListener("click", mostrarSabores);

    botonIrGastronomia?.addEventListener("click", mostrarGastronomia);

    botonVolverGastronomia?.addEventListener("click", mostrarMenuProyectos);

    /* =========================================
       EFECTO DE LUZ EN PORTADA DE PRODUCTO
    ========================================= */

    portadaProducto?.addEventListener("mousemove", (evento) => {
        if (!luzMouse) return;

        const rect = portadaProducto.getBoundingClientRect();

        luzMouse.style.left = `${evento.clientX - rect.left}px`;
        luzMouse.style.top = `${evento.clientY - rect.top}px`;
    });

    /* =========================================
       CARRUSEL
    ========================================= */

    function actualizarCarrusel() {
        if (!pistaCarrusel || tarjetasCarrusel.length === 0) {
            return;
        }

        const total = tarjetasCarrusel.length;

        if (indiceActual < 0) {
            indiceActual = 0;
        }

        if (indiceActual > total - 1) {
            indiceActual = total - 1;
        }

        const anchoTarjeta = 100 / 3;
        const desplazamiento = (indiceActual - 1) * anchoTarjeta;

        pistaCarrusel.style.transform =
            `translateX(-${desplazamiento}%)`;

        tarjetasCarrusel.forEach((tarjeta, indice) => {
            tarjeta.classList.remove("activa", "anterior", "siguiente");

            if (indice === indiceActual) {
                tarjeta.classList.add("activa");
            }

            if (indice === indiceActual - 1) {
                tarjeta.classList.add("anterior");
            }

            if (indice === indiceActual + 1) {
                tarjeta.classList.add("siguiente");
            }
        });

        const saborActivo = tarjetasCarrusel[indiceActual]?.dataset.sabor;

        if (nombreSaborActivo && saborActivo) {
            nombreSaborActivo.textContent =
                saborActivo.charAt(0).toUpperCase() + saborActivo.slice(1);
        }

        if (flechaIzquierda) {
            flechaIzquierda.disabled = indiceActual === 0;
        }

        if (flechaDerecha) {
            flechaDerecha.disabled = indiceActual === total - 1;
        }
    }

    flechaDerecha?.addEventListener("click", () => {
        if (indiceActual < tarjetasCarrusel.length - 1) {
            indiceActual++;
            actualizarCarrusel();
        }
    });

    flechaIzquierda?.addEventListener("click", () => {
        if (indiceActual > 0) {
            indiceActual--;
            actualizarCarrusel();
        }
    });

    tarjetasCarrusel.forEach((tarjeta, indice) => {
        tarjeta.addEventListener("click", () => {
            if (indice !== indiceActual) {
                indiceActual = indice;
                actualizarCarrusel();
                return;
            }

            mostrarComposicion(
                tarjeta.dataset.sabor,
                tarjeta.dataset.imagen
            );
        });
    });

    /* =========================================
       PANEL DE FONDOS
    ========================================= */

    abrirPanelFondos?.addEventListener("click", () => {
        panelFondos?.classList.remove("cerrado");
        abrirPanelFondos.style.display = "none";
    });

    cerrarPanel?.addEventListener("click", () => {
        panelFondos?.classList.add("cerrado");

        if (abrirPanelFondos) {
            abrirPanelFondos.style.display = "block";
        }
    });

    /* =========================================
       ENGRANAJE · OPCIONES AVANZADAS
    ========================================= */

    botonEngranaje?.addEventListener("click", (evento) => {
        evento.stopPropagation();
        const estaAbierto = !desplegableAvanzado?.classList.contains("oculto");

        desplegableAvanzado?.classList.toggle("oculto");
        botonEngranaje.classList.toggle("activo");
        botonEngranaje.setAttribute("aria-expanded", String(!estaAbierto));
    });

    document.addEventListener("click", (evento) => {
        if (
            desplegableAvanzado &&
            !desplegableAvanzado.classList.contains("oculto") &&
            !desplegableAvanzado.contains(evento.target) &&
            evento.target !== botonEngranaje
        ) {
            desplegableAvanzado.classList.add("oculto");
            botonEngranaje?.classList.remove("activo");
            botonEngranaje?.setAttribute("aria-expanded", "false");
        }
    });

    botonOpcionesAvanzadas?.addEventListener("click", () => {
        window.open(URL_EDITOR_IMAGEN, "_blank");
        desplegableAvanzado?.classList.add("oculto");
        botonEngranaje?.classList.remove("activo");
        botonEngranaje?.setAttribute("aria-expanded", "false");
    });

    function aplicarColor(color) {
        if (escenario) {
            escenario.style.backgroundColor = color;
        }

        if (pantallaComposicion) {
            pantallaComposicion.style.backgroundColor = color;
        }

        if (selectorColor) {
            selectorColor.value = color;
        }

        if (colorHex) {
            colorHex.value = color.toUpperCase();
        }

        botonesColor.forEach((boton) => {
            boton.classList.toggle(
                "activo",
                boton.dataset.color.toLowerCase() === color.toLowerCase()
            );
        });

        mensajeError?.classList.add("oculto");
    }

    botonesColor.forEach((boton) => {
        boton.addEventListener("click", () => {
            aplicarColor(boton.dataset.color);
        });
    });

    selectorColor?.addEventListener("input", () => {
        aplicarColor(selectorColor.value);
    });

    function esHexValido(valor) {
        return /^#[0-9A-Fa-f]{6}$/.test(valor);
    }

    aplicarHex?.addEventListener("click", () => {
        let valor = colorHex.value.trim();

        if (!valor.startsWith("#")) {
            valor = `#${valor}`;
        }

        if (!esHexValido(valor)) {
            mensajeError?.classList.remove("oculto");
            return;
        }

        aplicarColor(valor);
    });

    colorHex?.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            aplicarHex?.click();
        }
    });

    /* =========================================
       VISOR ANIMADO DE GASTRONOMÍA
    ========================================= */

    function abrirFotoGastronomica() {
        if (!visorGastronomia) {
            console.error("No se encontró #visorGastronomia en el HTML.");
            return;
        }

        visorGastronomia.classList.add("abierto");
        visorGastronomia.setAttribute("aria-hidden", "false");
        document.body.classList.add("visor-abierto");
    }

    function cerrarFotoGastronomica() {
        if (!visorGastronomia) return;

        visorGastronomia.classList.remove("abierto");
        visorGastronomia.setAttribute("aria-hidden", "true");
        document.body.classList.remove("visor-abierto");
    }

    botonVerFotografia?.addEventListener("click", abrirFotoGastronomica);
    marcoGastronomia?.addEventListener("click", abrirFotoGastronomica);
    cerrarVisorGastronomia?.addEventListener("click", cerrarFotoGastronomica);
    cerrarVisorFondo?.addEventListener("click", cerrarFotoGastronomica);

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarFotoGastronomica();
        }
    });

    /* =========================================
       PARTÍCULAS
    ========================================= */

    function crearParticulas() {
        if (!contenedorParticulas) return;

        contenedorParticulas.innerHTML = "";

        const cantidadParticulas = 34;

        for (let i = 0; i < cantidadParticulas; i++) {
            const particula = document.createElement("span");
            particula.classList.add("particula");

            const tamano = numeroAleatorio(3, 9);
            const posicion = numeroAleatorio(0, 100);
            const duracion = numeroAleatorio(7, 15);
            const retraso = numeroAleatorio(0, 8);
            const movimiento = numeroAleatorio(-100, 100);

            particula.style.width = `${tamano}px`;
            particula.style.height = `${tamano}px`;
            particula.style.left = `${posicion}%`;
            particula.style.animationDuration = `${duracion}s`;
            particula.style.animationDelay = `-${retraso}s`;
            particula.style.setProperty("--movimiento-x", `${movimiento}px`);

            contenedorParticulas.appendChild(particula);
        }
    }

    function numeroAleatorio(minimo, maximo) {
        return Math.random() * (maximo - minimo) + minimo;
    }

    if (abrirPanelFondos) {
        abrirPanelFondos.style.display = "none";
    }

    panelFondos?.classList.add("cerrado");
    actualizarCarrusel();
    mostrarInicio();

});
