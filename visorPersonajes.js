
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// CONFIGURACIÓN DEL VISOR
const contenedor = document.getElementById('visorPersonaje');

const escena = new THREE.Scene();

const camara = new THREE.PerspectiveCamera(
    35,
    1,
    0.1,
    100
);

const renderizador = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderizador.setPixelRatio(window.devicePixelRatio);
renderizador.setClearColor(0x000000, 0);
renderizador.outputColorSpace = THREE.SRGBColorSpace;

contenedor.appendChild(renderizador.domElement);


// CONTROLES DEL VISOR 3D
const controles = new OrbitControls(
    camara,
    renderizador.domElement
);

controles.enableDamping = true;
controles.dampingFactor = 0.05;

// PERMITIR DESPLAZAMIENTO DE LA VISTA
controles.enablePan = true;
controles.screenSpacePanning = true;

// PERMITIR ACERCAR Y ALEJAR
controles.enableZoom = true;

// CLIC IZQUIERDO: GIRAR EL PERSONAJE
// CLIC DERECHO: DESPLAZAR LA VISTA
controles.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
controles.mouseButtons.RIGHT = THREE.MOUSE.PAN;

// EVITAR MENÚ CONTEXTUAL
renderizador.domElement.addEventListener(
    'contextmenu',
    (evento) => evento.preventDefault()
);


// ILUMINACIÓN
const luzAmbiente = new THREE.AmbientLight(0xffffff, 2);
escena.add(luzAmbiente);

const luzPrincipal = new THREE.DirectionalLight(0xffffff, 3);
luzPrincipal.position.set(4, 6, 5);
escena.add(luzPrincipal);

const luzRelleno = new THREE.DirectionalLight(0xffffff, 1.5);
luzRelleno.position.set(-4, 3, -4);
escena.add(luzRelleno);

// CARGADOR GLB
const cargador = new GLTFLoader();

let modeloActual = null;
let animacionActiva = false;
let marcoAnimacion = null;

// MODELOS DISPONIBLES
const modelos = {
    Simon: './Simon I. Patiño 3d model.glb',
    Albina: './esposa 3d model.glb'
};

// AJUSTAR TAMAÑO Y POSICIÓN DEL MODELO
function encuadrarModelo(modelo) {
    const caja = new THREE.Box3().setFromObject(modelo);
    const centro = caja.getCenter(new THREE.Vector3());
    const tamano = caja.getSize(new THREE.Vector3());

    modelo.position.sub(centro);

    const altura = tamano.y || 1;
    modelo.scale.setScalar(3 / altura);

    const esfera = new THREE.Sphere();
    new THREE.Box3().setFromObject(modelo).getBoundingSphere(esfera);

    controles.target.set(0, 1, 0);

    const distancia = Math.max(esfera.radius * -2, 5);

    camara.position.set(
        distancia * 0,
        distancia * 0,
        distancia * 1
    );

    camara.near = 0.1;
    camara.far = distancia * 20;
    camara.updateProjectionMatrix();

    controles.update();
}

// MOSTRAR PERSONAJE
export function mostrarPersonaje(nombre) {
    const ruta = modelos[nombre];

    if (!ruta) {
        console.error('No existe el modelo:', nombre);
        return;
    }

    detenerAnimacion();

    if (modeloActual) {
        escena.remove(modeloActual);
        modeloActual = null;
    }

    cargador.load(
        ruta,
        (gltf) => {
            modeloActual = gltf.scene;

            escena.add(modeloActual);

            ajustarTamano();
            encuadrarModelo(modeloActual);

            renderizador.render(escena, camara);
            iniciarAnimacion();
        },
        undefined,
        (error) => {
            console.error('Error al cargar el personaje:', error);
        }
    );
}

// AJUSTAR VISOR
function ajustarTamano() {
    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;

    if (!ancho || !alto) return;

    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();

    renderizador.setSize(ancho, alto);
}

// ANIMACIÓN
function animar() {
    if (!animacionActiva) return;

    marcoAnimacion = requestAnimationFrame(animar);

    controles.update();
    renderizador.render(escena, camara);
}

function iniciarAnimacion() {
    if (animacionActiva) return;

    animacionActiva = true;
    animar();
}

// DETENER VISOR
export function ocultarPersonaje() {
    detenerAnimacion();
}

function detenerAnimacion() {
    animacionActiva = false;

    if (marcoAnimacion !== null) {
        cancelAnimationFrame(marcoAnimacion);
        marcoAnimacion = null;
    }
}

// REDIMENSIONAR
window.addEventListener('resize', ajustarTamano);
