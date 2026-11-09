import * as THREE from 'three';
export function crearMovimiento(camera, controls) {
    let activo = false;
    const teclas = {w: false,a: false,s: false,d: false
    };

    // VELOCIDAD DE MOVIMIENTO
    const velocidad = 1;
    function presionarTecla(evento) {
        const tecla = evento.key.toLowerCase();
        if (tecla in teclas && activo) {
            teclas[tecla] = true;
            evento.preventDefault();
        }
    }
    function soltarTecla(evento) {

        const tecla = evento.key.toLowerCase();
        if (tecla in teclas) {
            teclas[tecla] = false;
        }
    }

    function activar() {
        activo = true;
    }

    function desactivar() {

        activo = false;
        Object.keys(teclas).forEach(tecla => {
            teclas[tecla] = false;
        });
    }

    window.addEventListener("keydown", presionarTecla);
    window.addEventListener("keyup", soltarTecla);

    function actualizar() {

        if (!activo) return;
        const direccion = new THREE.Vector3();
        camera.getWorldDirection(direccion);

        // Movimiento horizontal
        direccion.y = 0;
        direccion.normalize();

        // Dirección lateral
        const derecha = new THREE.Vector3()
            .crossVectors(direccion, camera.up)
            .normalize();
        const desplazamiento = new THREE.Vector3();

        // W: avanzar
        if (teclas.w) {
            desplazamiento.add(direccion);
        }

        // S: retroceder
        if (teclas.s) {
            desplazamiento.sub(direccion);
        }

        // A: izquierda
        if (teclas.a) {
            desplazamiento.sub(derecha);
        }

        // D: derecha
        if (teclas.d) {
            desplazamiento.add(derecha);
        }

        if (desplazamiento.lengthSq() > 0) {

            desplazamiento.normalize();
            desplazamiento.multiplyScalar(velocidad);

            // Mover cámara
            camera.position.add(desplazamiento);

            // Mover también el objetivo de OrbitControls
            controls.target.add(desplazamiento);
        }

        // Mantener altura mínima
        if (camera.position.y < 8) {

            const diferencia = 8 - camera.position.y;

            camera.position.y = 8;
            controls.target.y += diferencia;
        }
    }

    return {
        activar,
        desactivar,
        actualizar
    };
}
