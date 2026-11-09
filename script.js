import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { crearInteraccionObjetos } from './objetosInteraccion.js';
import { prepararObjetosAnimados, animarObjetos } from './objetosAnimados.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { crearSistemaRecorrido } from './recorrido.js';
import { crearMovimiento } from './movimiento.js';

const scene = new THREE.Scene();

// ==========================================
// CIELO
// ==========================================

const canvasCielo = document.createElement("canvas");
canvasCielo.width = 2;
canvasCielo.height = 512;

const contexto = canvasCielo.getContext("2d");
const texturaCielo = new THREE.CanvasTexture(canvasCielo);

scene.background = texturaCielo;

// ==========================================
// CAMBIAR CIELO
// ==========================================

function cambiarCielo(colores) {

    const degradado = contexto.createLinearGradient(
        0,
        0,
        0,
        canvasCielo.height
    );

    degradado.addColorStop(0, colores.arriba);
    degradado.addColorStop(0.5, colores.centro);
    degradado.addColorStop(1, colores.horizonte);

    contexto.fillStyle = degradado;

    contexto.fillRect(
        0,
        0,
        canvasCielo.width,
        canvasCielo.height
    );

    texturaCielo.needsUpdate = true;
}

// ==========================================
// SISTEMA DE TIEMPO
// ==========================================

const ambientes = {

    dia: {
        posicion: new THREE.Vector3(140, 87, 5),
        colorLuz: 0xfff2cc,
        intensidad: 4,
        colorAmbiental: 0xcfe8ff,
        intensidadAmbiental: 1.1,
        nubes: true,
        colorSol: 0xfff2cc,
        escalaSol: 1,

        cielo: {
            arriba: "#2d3973",
            centro: "#325a89",
            horizonte: "#A9D4F7"
        }
    },

    atardecer: {
        posicion: new THREE.Vector3(-41, 87, -218),
        colorLuz: 0xffa54d,
        intensidad: 3.5,
        colorAmbiental: 0xffb47d,
        intensidadAmbiental: 0.8,
        nubes: true,
        colorSol: 0xff9440,
        escalaSol: 1.2,

        cielo: {
            arriba: "#3b2140",
            centro: "#b05b4f",
            horizonte: "#ffb36b"
        }
    },

    noche: {
        posicion: new THREE.Vector3(-140, 87, 5),
        colorLuz: 0xbfd6ff,
        intensidad: 0.9,
        colorAmbiental: 0x1d2748,
        intensidadAmbiental: 0.25,
        nubes: false,
        colorSol: 0xe8f3ff,
        escalaSol: 0.7,

        cielo: {
            arriba: "#030611",
            centro: "#07152d",
            horizonte: "#132548"
        }
    }
};

// ==========================================
// CAMBIAR AMBIENTE
// ==========================================

function cambiarAmbiente(ambiente) {

    luzSol.position.copy(ambiente.posicion);
    sol.position.copy(ambiente.posicion);

    luzSol.color.setHex(ambiente.colorLuz);
    luzSol.intensity = ambiente.intensidad;

    luzAmbiente.color.setHex(ambiente.colorAmbiental);
    luzAmbiente.intensity = ambiente.intensidadAmbiental;

    sol.material.color.setHex(ambiente.colorSol);

    sol.scale.set(
        ambiente.escalaSol,
        ambiente.escalaSol,
        ambiente.escalaSol
    );

    cambiarCielo(ambiente.cielo);

    if (typeof nubes !== "undefined") {

        nubes.forEach((nube) => {
            nube.mesh.visible = ambiente.nubes;
        });

    }
}

// ==========================================
// BOTONES DE TIEMPO
// ==========================================

const btnDia = document.getElementById("btnDia");
const btnAtardecer = document.getElementById("btnAtardecer");
const btnNoche = document.getElementById("btnNoche");

btnDia.addEventListener("click", () => {
    cambiarAmbiente(ambientes.dia);
});

btnAtardecer.addEventListener("click", () => {
    cambiarAmbiente(ambientes.atardecer);
});

btnNoche.addEventListener("click", () => {
    cambiarAmbiente(ambientes.noche);
});

// ==========================================
// AMBIENTE INICIAL
// ==========================================

cambiarCielo(ambientes.dia.cielo);

// ==========================================
// NUBES
// ==========================================

const textureLoader = new THREE.TextureLoader();
const texturaNube = textureLoader.load("Imagenes/Nubes.png");

const materialNube = new THREE.MeshBasicMaterial({
    map: texturaNube,
    transparent: true,
    depthWrite: false
});

const nubes = [];

for (let i = 0; i < 80; i++) {

    const nube = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 10),
        materialNube.clone()
    );

    nube.position.set(
        Math.random() * 350 - 200,
        80 + Math.random() * 15,
        Math.random() * 500 - 200
    );

    const escala = 0.8 + Math.random() * 1.8;

    nube.scale.set(
        escala,
        escala,
        escala
    );

    scene.add(nube);

    nubes.push({
        mesh: nube,
        velocidad: 0.005 + Math.random() * 0.01
    });
}

// ==========================================
// CÁMARA Y RENDERER
// ==========================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(36.21, 33.10, -163.00);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);

// =========================================
// RENDERER 3D PARA ELEMENTOS HTML
// =========================================

const cssRenderer = new CSS3DRenderer();

cssRenderer.setSize(
    window.innerWidth,
    window.innerHeight
);

cssRenderer.domElement.style.position = "fixed";
cssRenderer.domElement.style.top = "0";
cssRenderer.domElement.style.left = "0";
cssRenderer.domElement.style.pointerEvents = "none";

document.body.appendChild(cssRenderer.domElement);

// =========================================
// VIDEO DE YOUTUBE DENTRO DEL MUNDO 3D
// =========================================

const elementoVideo = document.getElementById("videoYoutube3D");

const video3D = new CSS3DObject(elementoVideo);

// POSICIÓN DEL VIDEO
video3D.position.set(
    -70,
    9,
    91
);

//video3D.rotation.y = Math.PI / 2;

// TAMAÑO DEL VIDEO
video3D.scale.set(
    0.02,
    0.02,
    0.01
);

// Agregarlo a la escena
scene.add(video3D);
video3D.visible = false;

// ==========================================
// CONTROLES
// ==========================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);
// SISTEMA DE MOVIMIENTO WASD
const movimiento = crearMovimiento(camera, controls);

controls.enableDamping = true;
controls.enabled = false;
controls.enableRotate = true;
controls.enableZoom = false;
controls.enablePan = false;

const posicionInicial = camera.position.clone();
const objetivoInicial = controls.target.clone();

// ==========================================
// LUCES
// ==========================================

const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(luzAmbiente);

const luzDireccional = new THREE.DirectionalLight(
    0xffffff,
    3
);

luzDireccional.position.set(10, 15, 10);
scene.add(luzDireccional);

renderer.shadowMap.enabled = true;

// ==========================================
// SOL
// ==========================================

const geometriaSol = new THREE.SphereGeometry(8, 32, 32);

const materialSol = new THREE.MeshBasicMaterial({
    color: 0xffdd66
});

const sol = new THREE.Mesh(
    geometriaSol,
    materialSol
);

sol.position.set(112.33, 180.29, 237.94);
scene.add(sol);

// ==========================================
// LUZ DEL SOL
// ==========================================

const luzSol = new THREE.DirectionalLight(
    0xfffff0,
    0.5
);

luzSol.position.set(112.33, 81.29, 237.94);
luzSol.castShadow = true;

scene.add(luzSol);

// ==========================================
// CARGAR CASA
// ==========================================

let objetosAnimados = [];
let objetosInteractivos = [];
let actualizarInteraccionObjetos = () => {};

const loader = new GLTFLoader();

loader.load(
    "Casa_Simon_Oficial.glb",

    function(gltf) {

        const casa = gltf.scene;

        casa.position.set(0, 0, 0);

        // Activar sombras en todos los objetos de la casa
        casa.traverse(function(objeto) {

            if (objeto.isMesh) {
                objeto.castShadow = true;
                objeto.receiveShadow = true;
            }

        });

        scene.add(casa);

        objetosAnimados = [];
        objetosInteractivos = [];

        casa.traverse((objeto) => {

            // OBJETOS QUE PUEDEN MOSTRAR INFORMACIÓN
            if (
                objeto.name === "Tocadisco" ||
                objeto.name === "Telefono" ||
                objeto.name === "Cofre" ||
                objeto.name === "Jarra" ||
                objeto.name === "Cuadro1" ||
                objeto.name === "Cuadro2" ||
                objeto.name === "Estaño" ||
                objeto.name === "SiilaDeRuedas" ||
                objeto.name === "Simon" ||
                objeto.name === "Albina" ||
                objeto.name === "Carrusel1" ||
                objeto.name === "Carrusel2"
            ) {

                objetosInteractivos.push(objeto);

            }

            // OBJETOS QUE SÍ DEBEN GIRAR
            if (
                objeto.name === "Tocadisco" ||
                objeto.name === "Telefono" ||
                objeto.name === "Cofre" ||
                objeto.name === "Jarra" ||
                objeto.name === "Cuadro1" ||
                objeto.name === "Cuadro2" ||
                objeto.name === "Estaño" ||
                objeto.name === "SiilaDeRuedas"
            ) {

                objetosAnimados.push(objeto);

            }

        });

        prepararObjetosAnimados(objetosAnimados);

        actualizarInteraccionObjetos = crearInteraccionObjetos(
            objetosInteractivos,
            camera,
            renderer
        );

        console.log("Interacción de objetos activada");
        console.log("Casa cargada correctamente");
    },

    function(xhr) {

        console.log(
            (xhr.loaded / xhr.total * 100) + "% cargado"
        );

    },

    function(error) {

        console.error(
            "Error al cargar la casa:",
            error
        );

    }
);

// ==========================================
// CAMBIAR TAMAÑO DE PANTALLA
// ==========================================

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    cssRenderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// ==========================================
// COORDENADAS
// ==========================================

const coordenadas = document.getElementById("coordenadas");

// ==========================================
// BOTONES E INTERFAZ
// ==========================================

const btnEntorno = document.getElementById("btnEntorno");
const btnSalirVista = document.getElementById("btnSalirVista");

const presentacion = document.getElementById("presentacion");
const botonesPrincipales = document.getElementById("botonesPrincipales");
const ayudaMovimiento = document.getElementById("ayudaMovimiento");

const btnGaleria = document.getElementById("btnGaleria");
const btnHistoria = document.getElementById("btnHistoria");

// ==========================================
// SISTEMA DE RECORRIDO (MÓDULO EXTERNO)
// ==========================================

const actualizarRecorrido = crearSistemaRecorrido({camera,controls,video3D,
    btnObjetos: document.getElementById("btnObjetos"),
    btnSalir: document.getElementById("btnSalir"),
    btnSiguiente: document.getElementById("btnSiguiente"),
    btnAtras: document.getElementById("btnAtras"),
    presentacion,
    botonesPrincipales,
    ayudaMovimiento,
    flechasHabitacion: document.getElementById("flechasHabitacion")

});

// ==========================================
// ACTIVAR MODO VISTA
// ==========================================

btnEntorno.addEventListener("click", () => {

    controls.enabled = true;

    // ACTIVAR MOVIMIENTO WASD
    movimiento.activar();

    presentacion.style.display = "none";
    botonesPrincipales.style.display = "none";

    btnSalirVista.style.display = "block";
    ayudaMovimiento.style.display = "block";

});

// ==========================================
// SALIR DEL MODO VISTA
// ==========================================

btnSalirVista.addEventListener("click", () => {

    controls.enabled = false;

    camera.position.copy(posicionInicial);
    controls.target.copy(objetivoInicial);
    movimiento.desactivar();
    controls.update();

    presentacion.style.display = "block";
    botonesPrincipales.style.display = "flex";

    btnSalirVista.style.display = "none";
    ayudaMovimiento.style.display = "none";

});

// ==========================================
// NAVEGACIÓN: GALERÍA E HISTORIA
// ==========================================

btnGaleria.addEventListener("click", () => {
    window.location.href = "galeria.html";
});

btnHistoria.addEventListener("click", () => {
    window.location.href = "Historia.html";
});
document.getElementById("btnUbicacion").addEventListener("click", () => {
    window.location.href = "mapa.html";
});

// ==========================================
// MÚSICA DE FONDO
// ==========================================

const musicaFondo = document.getElementById("musicaFondo");
const btnMusica = document.getElementById("btnMusica");
const volumenMusica = document.getElementById("volumenMusica");

// Volumen inicial
musicaFondo.volume = 0.5;

// Reproducir música después de la primera interacción
function iniciarMusica() {

    musicaFondo.play().catch(() => {
        console.log("El navegador bloqueó el autoplay.");
    });

    document.removeEventListener("click", iniciarMusica);
}

document.addEventListener("click", iniciarMusica);

// Botón mute / activar
btnMusica.addEventListener("click", (evento) => {

    evento.stopPropagation();

    musicaFondo.muted = !musicaFondo.muted;

    if (musicaFondo.muted) {
        btnMusica.textContent = "🔇";
    } else {
        btnMusica.textContent = "🔊";
    }

});

// Control de volumen
volumenMusica.addEventListener("input", (evento) => {

    musicaFondo.volume = evento.target.value;

    if (musicaFondo.volume > 0) {
        musicaFondo.muted = false;
        btnMusica.textContent = "🔊";
    }

});

// ==========================================
// FUNCIÓN ANIMATE
// ==========================================

function animate() {

    requestAnimationFrame(animate);

    animarObjetos(objetosAnimados);
    actualizarInteraccionObjetos();
    movimiento.actualizar();
    // Actualizar el recorrido externo.
    const recorridoActivo = actualizarRecorrido();

    if (!recorridoActivo) {
        controls.update();
    }

    if (camera.position.y < 8) {
        camera.position.y = 8;
    }

    // ======================================
    // ANIMACIÓN DE NUBES
    // ======================================

    nubes.forEach((nube) => {

        nube.mesh.lookAt(camera.position);

        nube.mesh.position.x += nube.velocidad;

        if (nube.mesh.position.x > 100) {

            nube.mesh.position.x = -300;

            nube.mesh.position.z =
                Math.random() * 200 + 150;

            nube.mesh.position.y =
                80 + Math.random() * 15;

        }

    });

    // ======================================
    // ACTUALIZAR COORDENADAS
    // ======================================

    /*coordenadas.textContent =
        "X: " + camera.position.x.toFixed(2) +
        " | Y: " + camera.position.y.toFixed(2) +
        " | Z: " + camera.position.z.toFixed(2);
    */
    // ======================================
    // RENDERIZAR
    // ======================================

    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);

}

animate();