/* =========================================================
   EDITOR INTERACTIVO DE PRODUCTO
========================================================= */

const escenarioProducto = document.getElementById("escenarioProducto");
const productoPrincipal = document.getElementById("productoPrincipal");

const botonesSabor = document.querySelectorAll(".boton-sabor");
const botonesCategoria = document.querySelectorAll(".categoria-elemento");
const tarjetasElemento = document.querySelectorAll(".tarjeta-elemento");
const botonesColor = document.querySelectorAll(".color-fondo");

const colorPersonalizado = document.getElementById("colorPersonalizado");
const codigoHex = document.getElementById("codigoHex");
const botonAplicarHex = document.getElementById("botonAplicarHex");

const botonAumentar = document.getElementById("botonAumentar");
const botonReducir = document.getElementById("botonReducir");
const botonGirar = document.getElementById("botonGirar");
const botonFrente = document.getElementById("botonFrente");
const botonAtras = document.getElementById("botonAtras");
const botonEliminarElemento = document.getElementById("botonEliminarElemento");
const botonReiniciarEditor = document.getElementById("botonReiniciarEditor");
const botonTomarFoto = document.getElementById("botonTomarFoto");
const nombreElementoSeleccionado = document.getElementById(
    "nombreElementoSeleccionado"
);

let elementoSeleccionado = null;
let elementoArrastrado = null;
let desplazamientoX = 0;
let desplazamientoY = 0;
let contadorZ = 10;

/* Caja visual con controles tipo Canva */
let cajaSeleccion = null;
let modoTransformacion = null;
let datosTransformacion = null;

function crearCajaSeleccion() {
    if (!escenarioProducto || cajaSeleccion) {
        return;
    }

    cajaSeleccion = document.createElement("div");
    cajaSeleccion.className = "caja-seleccion oculto";

    ["sup-izq", "sup-der", "inf-izq", "inf-der"].forEach(function (posicion) {
        const control = document.createElement("button");
        control.type = "button";
        control.className = `control-redimensionar ${posicion}`;
        control.dataset.tipo = "redimensionar";
        control.setAttribute("aria-label", "Cambiar tamaño");
        cajaSeleccion.appendChild(control);
    });

    const controlRotar = document.createElement("button");
    controlRotar.type = "button";
    controlRotar.className = "control-rotar";
    controlRotar.dataset.tipo = "rotar";
    controlRotar.setAttribute("aria-label", "Girar elemento");
    controlRotar.textContent = "↻";
    cajaSeleccion.appendChild(controlRotar);

    cajaSeleccion.addEventListener("pointerdown", iniciarTransformacionControl);
    escenarioProducto.appendChild(cajaSeleccion);
}

function actualizarCajaSeleccion() {
    if (!cajaSeleccion || !elementoSeleccionado || !escenarioProducto) {
        if (cajaSeleccion) {
            cajaSeleccion.classList.add("oculto");
        }
        return;
    }

    const rectEscenario = escenarioProducto.getBoundingClientRect();
    const rectElemento = elementoSeleccionado.getBoundingClientRect();

    cajaSeleccion.classList.remove("oculto");
    cajaSeleccion.style.left = `${rectElemento.left - rectEscenario.left}px`;
    cajaSeleccion.style.top = `${rectElemento.top - rectEscenario.top}px`;
    cajaSeleccion.style.width = `${rectElemento.width}px`;
    cajaSeleccion.style.height = `${rectElemento.height}px`;
    cajaSeleccion.style.zIndex = String(
        Number(elementoSeleccionado.style.zIndex || 5) + 100
    );
}

function iniciarTransformacionControl(evento) {
    const tipo = evento.target.dataset.tipo;

    if (!tipo || !elementoSeleccionado) {
        return;
    }

    evento.preventDefault();
    evento.stopPropagation();

    const rectElemento = elementoSeleccionado.getBoundingClientRect();
    const centroX = rectElemento.left + rectElemento.width / 2;
    const centroY = rectElemento.top + rectElemento.height / 2;

    const transformacion = obtenerTransformacion(elementoSeleccionado);

    datosTransformacion = {
        centroX: centroX,
        centroY: centroY,
        distanciaInicial: Math.max(
            1,
            Math.hypot(evento.clientX - centroX, evento.clientY - centroY)
        ),
        escalaInicial: transformacion.escala,
        giroInicial: transformacion.giro,
        anguloInicial: Math.atan2(
            evento.clientY - centroY,
            evento.clientX - centroX
        )
    };

    modoTransformacion = tipo;

    window.addEventListener("pointermove", transformarConControl);
    window.addEventListener("pointerup", finalizarTransformacionControl, {
        once: true
    });
}

function transformarConControl(evento) {
    if (!elementoSeleccionado || !datosTransformacion) {
        return;
    }

    if (modoTransformacion === "redimensionar") {
        const distanciaActual = Math.max(
            1,
            Math.hypot(
                evento.clientX - datosTransformacion.centroX,
                evento.clientY - datosTransformacion.centroY
            )
        );

        const nuevaEscala =
            datosTransformacion.escalaInicial *
            (distanciaActual / datosTransformacion.distanciaInicial);

        elementoSeleccionado.dataset.escala = String(
            Math.min(4, Math.max(0.25, nuevaEscala))
        );

        actualizarTransformacion(elementoSeleccionado);
        actualizarCajaSeleccion();
    }

    if (modoTransformacion === "rotar") {
        const anguloActual = Math.atan2(
            evento.clientY - datosTransformacion.centroY,
            evento.clientX - datosTransformacion.centroX
        );

        const diferenciaGrados =
            (anguloActual - datosTransformacion.anguloInicial) *
            (180 / Math.PI);

        elementoSeleccionado.dataset.giro = String(
            datosTransformacion.giroInicial + diferenciaGrados
        );

        actualizarTransformacion(elementoSeleccionado);
        actualizarCajaSeleccion();
    }
}

function finalizarTransformacionControl() {
    modoTransformacion = null;
    datosTransformacion = null;
    window.removeEventListener("pointermove", transformarConControl);
}

if (productoPrincipal) {
    productoPrincipal.dataset.nombre = "Galletas Amor";
    productoPrincipal.dataset.giro = "0";
    productoPrincipal.dataset.escala = "1";
    productoPrincipal.dataset.esProducto = "true";

    productoPrincipal.addEventListener("click", function (evento) {
        evento.stopPropagation();
        seleccionarElemento(productoPrincipal);
    });

    productoPrincipal.addEventListener(
        "pointerdown",
        iniciarArrastreElemento
    );
}

function seleccionarElemento(elemento) {
    document.querySelectorAll(".elemento-escenario, #productoPrincipal").forEach(function (item) {
        item.classList.remove("seleccionado");
    });

    elementoSeleccionado = elemento;

    if (!elementoSeleccionado) {
        if (nombreElementoSeleccionado) {
            nombreElementoSeleccionado.textContent = "Ninguno";
        }

        actualizarCajaSeleccion();
        return;
    }

    elementoSeleccionado.classList.add("seleccionado");

    if (nombreElementoSeleccionado) {
        nombreElementoSeleccionado.textContent =
            elementoSeleccionado.dataset.nombre || "Elemento";
    }

    requestAnimationFrame(actualizarCajaSeleccion);
}

function obtenerTransformacion(elemento) {
    return {
        giro: Number(elemento.dataset.giro || 0),
        escala: Number(elemento.dataset.escala || 1)
    };
}

function actualizarTransformacion(elemento) {
    const transformacion = obtenerTransformacion(elemento);

    elemento.style.transform =
        `translate(-50%, -50%) rotate(${transformacion.giro}deg) ` +
        `scale(${transformacion.escala})`;

    if (elemento === elementoSeleccionado) {
        requestAnimationFrame(actualizarCajaSeleccion);
    }
}

function agregarElemento(imagen, nombre) {
    if (!escenarioProducto) {
        return;
    }

    const elemento = document.createElement("img");

    elemento.src = imagen;
    elemento.alt = nombre;
    elemento.className = "elemento-escenario";
    elemento.draggable = false;
    elemento.dataset.nombre = nombre;
    elemento.dataset.giro = "0";
    elemento.dataset.escala = "1";

    const variacion = Math.random() * 12 - 6;

    elemento.style.left = `${50 + variacion}%`;
    elemento.style.top = `${50 + variacion}%`;
    elemento.style.zIndex = String(++contadorZ);

    elemento.addEventListener("pointerdown", iniciarArrastreElemento);
    elemento.addEventListener("click", function (evento) {
        evento.stopPropagation();
        seleccionarElemento(elemento);
    });

    escenarioProducto.appendChild(elemento);
    seleccionarElemento(elemento);
}

function iniciarArrastreElemento(evento) {
    evento.preventDefault();
    evento.stopPropagation();

    elementoArrastrado = evento.currentTarget;
    seleccionarElemento(elementoArrastrado);

    const rectanguloElemento = elementoArrastrado.getBoundingClientRect();

    desplazamientoX = evento.clientX - rectanguloElemento.left;
    desplazamientoY = evento.clientY - rectanguloElemento.top;

    elementoArrastrado.setPointerCapture(evento.pointerId);
    elementoArrastrado.addEventListener(
        "pointermove",
        moverElemento
    );
    elementoArrastrado.addEventListener(
        "pointerup",
        terminarArrastreElemento,
        { once: true }
    );
    elementoArrastrado.addEventListener(
        "pointercancel",
        terminarArrastreElemento,
        { once: true }
    );
}

function moverElemento(evento) {
    if (!elementoArrastrado || !escenarioProducto) {
        return;
    }

    const rectanguloEscenario = escenarioProducto.getBoundingClientRect();
    const rectanguloElemento = elementoArrastrado.getBoundingClientRect();

    let izquierda =
        evento.clientX -
        rectanguloEscenario.left -
        desplazamientoX +
        rectanguloElemento.width / 2;

    let arriba =
        evento.clientY -
        rectanguloEscenario.top -
        desplazamientoY +
        rectanguloElemento.height / 2;

    izquierda = Math.max(
        rectanguloElemento.width / 2,
        Math.min(
            rectanguloEscenario.width - rectanguloElemento.width / 2,
            izquierda
        )
    );

    arriba = Math.max(
        rectanguloElemento.height / 2,
        Math.min(
            rectanguloEscenario.height - rectanguloElemento.height / 2,
            arriba
        )
    );

    elementoArrastrado.style.left =
        `${(izquierda / rectanguloEscenario.width) * 100}%`;

    elementoArrastrado.style.top =
        `${(arriba / rectanguloEscenario.height) * 100}%`;

    actualizarCajaSeleccion();
}

function terminarArrastreElemento(evento) {
    if (!elementoArrastrado) {
        return;
    }

    try {
        elementoArrastrado.releasePointerCapture(evento.pointerId);
    } catch (error) {
        // El navegador puede liberar el puntero automáticamente.
    }

    elementoArrastrado.removeEventListener("pointermove", moverElemento);
    elementoArrastrado = null;
}

function cambiarCategoria(categoria) {
    botonesCategoria.forEach(function (boton) {
        boton.classList.toggle(
            "activa",
            boton.dataset.categoria === categoria
        );
    });

    tarjetasElemento.forEach(function (tarjeta) {
        tarjeta.classList.toggle(
            "oculto",
            tarjeta.dataset.categoria !== categoria
        );
    });
}

function aplicarColorFondo(color) {
    if (!escenarioProducto) {
        return;
    }

    escenarioProducto.style.backgroundColor = color;

    if (colorPersonalizado) {
        colorPersonalizado.value = color;
    }

    if (codigoHex) {
        codigoHex.value = color;
    }

    botonesColor.forEach(function (boton) {
        boton.classList.toggle(
            "activo",
            boton.dataset.color.toLowerCase() === color.toLowerCase()
        );
    });
}

function esColorHexValido(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

function reiniciarEditor() {
    if (!escenarioProducto) {
        return;
    }

    escenarioProducto
        .querySelectorAll(".elemento-escenario")
        .forEach(function (elemento) {
            elemento.remove();
        });

    seleccionarElemento(null);
    aplicarColorFondo("#f7b6c4");

    if (productoPrincipal) {
        productoPrincipal.src = "img/amor-fresas.png";
        productoPrincipal.style.left = "50%";
        productoPrincipal.style.top = "50%";
        productoPrincipal.style.zIndex = "5";
        productoPrincipal.dataset.giro = "0";
        productoPrincipal.dataset.escala = "1";
        actualizarTransformacion(productoPrincipal);
    }

    botonesSabor.forEach(function (boton) {
        boton.classList.toggle(
            "activo",
            boton.dataset.sabor === "fresa"
        );
    });

    cambiarCategoria("fresa");
}

botonesSabor.forEach(function (boton) {
    boton.addEventListener("click", function () {
        botonesSabor.forEach(function (item) {
            item.classList.remove("activo");
        });

        boton.classList.add("activo");

        if (productoPrincipal) {
            productoPrincipal.src = boton.dataset.producto;
            productoPrincipal.alt =
                `Galletas Amor sabor ${boton.dataset.sabor}`;
            productoPrincipal.dataset.nombre =
                `Galletas Amor ${boton.dataset.sabor}`;
        }

        cambiarCategoria(boton.dataset.sabor);
    });
});

botonesCategoria.forEach(function (boton) {
    boton.addEventListener("click", function () {
        cambiarCategoria(boton.dataset.categoria);
    });
});

tarjetasElemento.forEach(function (tarjeta) {
    tarjeta.addEventListener("click", function () {
        agregarElemento(
            tarjeta.dataset.imagen,
            tarjeta.dataset.nombre
        );
    });
});

botonesColor.forEach(function (boton) {
    boton.addEventListener("click", function () {
        aplicarColorFondo(boton.dataset.color);
    });
});

if (colorPersonalizado) {
    colorPersonalizado.addEventListener("input", function () {
        aplicarColorFondo(colorPersonalizado.value);
    });
}

if (botonAplicarHex) {
    botonAplicarHex.addEventListener("click", function () {
        const color = codigoHex.value.trim();

        if (!esColorHexValido(color)) {
            codigoHex.focus();
            codigoHex.style.borderColor = "#ff4f91";
            return;
        }

        codigoHex.style.borderColor = "";
        aplicarColorFondo(color);
    });
}

if (codigoHex) {
    codigoHex.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            botonAplicarHex.click();
        }
    });
}

if (escenarioProducto) {
    escenarioProducto.addEventListener("click", function (evento) {
        if (evento.target === escenarioProducto) {
            seleccionarElemento(null);
        }
    });
}

if (botonAumentar) {
    botonAumentar.addEventListener("click", function () {
        if (!elementoSeleccionado) {
            return;
        }

        const transformacion = obtenerTransformacion(elementoSeleccionado);

        elementoSeleccionado.dataset.escala = String(
            Math.min(3, transformacion.escala + 0.1)
        );

        actualizarTransformacion(elementoSeleccionado);
    });
}

if (botonReducir) {
    botonReducir.addEventListener("click", function () {
        if (!elementoSeleccionado) {
            return;
        }

        const transformacion = obtenerTransformacion(elementoSeleccionado);

        elementoSeleccionado.dataset.escala = String(
            Math.max(0.3, transformacion.escala - 0.1)
        );

        actualizarTransformacion(elementoSeleccionado);
    });
}

if (botonGirar) {
    botonGirar.addEventListener("click", function () {
        if (!elementoSeleccionado) {
            return;
        }

        const transformacion = obtenerTransformacion(elementoSeleccionado);

        elementoSeleccionado.dataset.giro =
            String(transformacion.giro + 15);

        actualizarTransformacion(elementoSeleccionado);
    });
}

if (botonFrente) {
    botonFrente.addEventListener("click", function () {
        if (!elementoSeleccionado) {
            return;
        }

        elementoSeleccionado.style.zIndex = String(++contadorZ);
    });
}

if (botonAtras) {
    botonAtras.addEventListener("click", function () {
        if (!elementoSeleccionado) {
            return;
        }

        const zActual = Number(
            elementoSeleccionado.style.zIndex || 1
        );

        elementoSeleccionado.style.zIndex =
            String(Math.max(1, zActual - 1));
    });
}

if (botonEliminarElemento) {
    botonEliminarElemento.addEventListener("click", function () {
        if (!elementoSeleccionado) {
            return;
        }

        if (elementoSeleccionado.dataset.esProducto === "true") {
            return;
        }

        elementoSeleccionado.remove();
        seleccionarElemento(null);
    });
}

if (botonReiniciarEditor) {
    botonReiniciarEditor.addEventListener("click", reiniciarEditor);
}

if (botonTomarFoto) {
    botonTomarFoto.addEventListener("click", async function () {
        if (!escenarioProducto) {
            return;
        }

        if (typeof html2canvas !== "function") {
            alert(
                "No se pudo cargar la herramienta de descarga. " +
                "Revisa tu conexión a Internet y vuelve a intentarlo."
            );
            return;
        }

        seleccionarElemento(null);

        const textoOriginal = botonTomarFoto.textContent;
        botonTomarFoto.disabled = true;
        botonTomarFoto.textContent = "Preparando foto...";

        const flash = document.createElement("div");
        flash.className = "flash-fotografia";
        document.body.appendChild(flash);

        setTimeout(function () {
            flash.remove();
        }, 650);

        try {
            /* Espera a que desaparezca el flash antes de capturar */
            await new Promise(function (resolver) {
                setTimeout(resolver, 280);
            });

            const canvasCaptura = await html2canvas(escenarioProducto, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                logging: false
            });

            canvasCaptura.toBlob(function (blob) {
                if (!blob) {
                    alert("No se pudo crear la imagen.");
                    return;
                }

                const enlace = document.createElement("a");
                const fecha = new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replaceAll(":", "-");

                enlace.href = URL.createObjectURL(blob);
                enlace.download = `bodegon-amor-${fecha}.jpg`;

                document.body.appendChild(enlace);
                enlace.click();
                enlace.remove();

                setTimeout(function () {
                    URL.revokeObjectURL(enlace.href);
                }, 1000);
            }, "image/jpeg", 0.95);
        } catch (error) {
            console.error("Error al descargar la composición:", error);

            alert(
                "No se pudo descargar la composición. " +
                "Abre el proyecto con Live Server y vuelve a intentarlo."
            );
        } finally {
            botonTomarFoto.disabled = false;
            botonTomarFoto.textContent = textoOriginal;
        }
    });
}

/* Atajos del editor */

document.addEventListener("keydown", function (evento) {
    if (
        evento.key === "Delete" ||
        evento.key === "Backspace"
    ) {
        if (
            elementoSeleccionado &&
            document.activeElement.tagName !== "INPUT"
        ) {
            if (elementoSeleccionado.dataset.esProducto !== "true") {
                elementoSeleccionado.remove();
                seleccionarElemento(null);
            }
        }
    }

    if (evento.key === "Escape") {
        seleccionarElemento(null);
    }
});

window.addEventListener("resize", function () {
    actualizarCajaSeleccion();
});

crearCajaSeleccion();
reiniciarEditor();