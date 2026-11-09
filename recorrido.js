import * as THREE from 'three';

// Crea y controla el recorrido guiado y la navegación dentro de la habitación.
export function crearSistemaRecorrido({camera,controls,video3D,btnObjetos,btnSalir,btnSiguiente,btnAtras,presentacion,botonesPrincipales,
    ayudaMovimiento,
    flechasHabitacion
}) {

    // Puntos que sigue la cámara durante el recorrido.
    const caminoObjetos = [
        {
            posicion: camera.position.clone(),
            mirar: new THREE.Vector3(20, 8, 0)
        },
        {
            posicion: new THREE.Vector3(6.66, 8, -110.67),
            mirar: new THREE.Vector3(0, 0, 0)
        },
        {
            posicion: new THREE.Vector3(6.66, 8, 99),
            mirar: new THREE.Vector3(-150, 0, 150)
        },

        {
            posicion: new THREE.Vector3(-19.50, 8, 96.76),
            mirar: new THREE.Vector3(-500, 0, 1000*11)
        },


        {
            posicion: new THREE.Vector3(-72, 8, 100),
            mirar: new THREE.Vector3(-1000, 0, 0)
        },
        {
            posicion: new THREE.Vector3(-69, 8, 110),
            mirar: new THREE.Vector3(-1000, 0, 0),
            mirarFinal: new THREE.Vector3(-1900, 8, -50)
        }
    ];

    let puntoActual = 0;
    let progreso = 0;
    const velocidad = 0.009;

    let animandoObjetos = false;
    let animandoRegreso = false;
    let modoHabitacion = false;
    let recorridoPausado = false;
    let puntoDestinoRegreso = 0;

    let giroCamara = 0;
    const velocidadGiro = 0.01;
    let posicionMouseX = 0;

    window.addEventListener("mousemove", (evento) => {
        posicionMouseX = evento.clientX;
    });

    // Iniciar el recorrido guiado.
    btnObjetos.addEventListener("click", () => {
        puntoActual = 0;
        progreso = 0;
        recorridoPausado = false;

        animandoObjetos = true;
        animandoRegreso = false;
        modoHabitacion = false;
        

        video3D.visible = false;
        flechasHabitacion.style.display = "none";
        controls.enabled = false;

        presentacion.style.display = "none";
        botonesPrincipales.style.display = "none";
        btnSalir.style.display = "none";
        btnSiguiente.style.display = "none";
        btnAtras.style.display = "none";
        ayudaMovimiento.style.display = "none";
    });

    // CONTINUAR EL RECORRIDO DESDE LA PARADA INTERMEDIA
    btnSiguiente.addEventListener("click", () => {
    if (!recorridoPausado) return;

        recorridoPausado = false;
        animandoObjetos = true;
        progreso = 0;

        // OCULTAR EL BOTÓN SIGUIENTE
        btnSiguiente.style.display = "none";
        console.log("Continuando recorrido...");
    });

        // RETROCEDER DESDE LA HABITACIÓN HASTA LA PARADA INTERMEDIA
    btnAtras.addEventListener("click", () => {

        if (!modoHabitacion || animandoRegreso) return;

        puntoDestinoRegreso = 3;

        modoHabitacion = false;
        recorridoPausado = false;

        video3D.visible = false;
        flechasHabitacion.style.display = "none";

        progreso = 0;
        animandoRegreso = true;
        animandoObjetos = false;

        btnAtras.style.display = "none";
        btnSiguiente.style.display = "none";
        btnSalir.style.display = "none";

        console.log("Retrocediendo hacia la parada intermedia...");
    });
    // SALIR DE LA HABITACIÓN O DE LA PARADA INTERMEDIA
    btnSalir.addEventListener("click", () => {

        if (animandoRegreso) return;
        modoHabitacion = false;
        recorridoPausado = false;
        video3D.visible = false;
        flechasHabitacion.style.display = "none";
        // NO MODIFICAMOS puntoActual.
        // Así regresa desde el lugar donde se encuentra.
        progreso = 0;
        puntoDestinoRegreso = 0;
        animandoRegreso = true;
        animandoObjetos = false;
        btnAtras.style.display = "none";
        btnSalir.style.display = "none";
        btnSiguiente.style.display = "none";
        ayudaMovimiento.style.display = "none";
        console.log("Iniciando regreso desde el punto:", puntoActual);
    });
    

    // Actualizar el recorrido.
    function actualizar() {

        if (animandoObjetos) {

            if (recorridoPausado) {
            return animandoObjetos || animandoRegreso || modoHabitacion;
            }
            const puntoInicio = caminoObjetos[puntoActual].posicion;
            const puntoFinal = caminoObjetos[puntoActual + 1].posicion;

            progreso += velocidad;

            camera.position.lerpVectors(
                puntoInicio,
                puntoFinal,
                progreso
            );

            camera.lookAt(
                caminoObjetos[puntoActual + 1].mirar
            );

            if (progreso >= 1) {

    progreso = 0;
    puntoActual++;

                // DETENERSE EN LA NUEVA PARADA
                if (puntoActual === 3) {
                    camera.position.copy(caminoObjetos[3].posicion);
                    camera.lookAt(caminoObjetos[3].mirar);
                    recorridoPausado = true;
                    animandoObjetos = false;
                    // MOSTRAR BOTONES EN LA PARADA
                    btnSiguiente.style.display = "block";
                    btnSalir.style.display = "block";
                    console.log("Recorrido pausado en la nueva parada");
                    return true;
                }

            if (puntoActual >= caminoObjetos.length - 1) {
                giroCamara = camera.rotation.y;
                modoHabitacion = true;
                btnSiguiente.style.display = "none";
                btnAtras.style.display = "block";
                video3D.visible = true;
                flechasHabitacion.style.display = "flex";
                btnSalir.style.display = "block";
                animandoObjetos = false;
                console.log("Recorrido terminado");
                }
            }
        }

        // RECORRIDO DE REGRESO
        if (animandoRegreso) {

            const puntoInicio = caminoObjetos[puntoActual].posicion;
            const puntoFinal = caminoObjetos[puntoActual - 1].posicion;

            progreso += velocidad;

            camera.position.lerpVectors(
                puntoInicio,
                puntoFinal,
                progreso
            );

            camera.lookAt(
                caminoObjetos[puntoActual - 1].mirar
            );

            if (progreso >= 1) {

                progreso = 0;
                puntoActual--;

                if (puntoActual <= puntoDestinoRegreso) {
animandoRegreso = false;

// COMPROBAR SI ES UN REGRESO A LA PARADA INTERMEDIA
if (puntoDestinoRegreso === 3) {

    // FIJAR CÁMARA EN LA PARADA INTERMEDIA
    camera.position.copy(caminoObjetos[3].posicion);
    camera.lookAt(caminoObjetos[3].mirar);

    recorridoPausado = true;
    btnAtras.style.display = "none";
    // VOLVER A MOSTRAR LOS BOTONES
    btnSiguiente.style.display = "block";
    btnSalir.style.display = "block";

    console.log("Regreso a la parada intermedia terminado");

} else {

    // REGRESO COMPLETO AL MENÚ
    camera.position.copy(caminoObjetos[0].posicion);
    camera.lookAt(caminoObjetos[0].mirar);

    controls.target.copy(caminoObjetos[0].mirar);
    controls.enabled = false;

    presentacion.style.display = "block";
    botonesPrincipales.style.display = "flex";

    btnSalir.style.display = "none";
    btnSiguiente.style.display = "none";
    btnAtras.style.display = "none";

    ayudaMovimiento.style.display = "none";

    console.log("Regreso al menú terminado");
}
                }
            }
        }

        girarHabitacion();

        return animandoObjetos || animandoRegreso || modoHabitacion || recorridoPausado;
    }

    // Girar la cámara según la posición horizontal del cursor.
    function girarHabitacion() {

        if (!modoHabitacion) return;

        const anchoPantalla = window.innerWidth;

        if (posicionMouseX < anchoPantalla * 0.30) {
            giroCamara += velocidadGiro;
        }

        if (posicionMouseX > anchoPantalla * 0.70) {
            giroCamara -= velocidadGiro;
        }

        camera.rotation.y = giroCamara;
    }

    return actualizar;
}