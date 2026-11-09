import * as THREE from 'three';
import { mostrarPersonaje, ocultarPersonaje } from './visorPersonajes.js';

const informacionObjetos = {

    "Tocadisco": {
        titulo: "Tocadiscos",
        texto: "El tocadiscos es un dispositivo mecánico y eléctrico diseñado para reproducir música grabada en discos de vinilo. Su funcionamiento consiste en hacer girar el disco a una velocidad constante mientras una aguja recorre sus surcos, transformando las vibraciones en señales sonoras. Estos aparatos fueron muy populares durante gran parte del siglo XX y representaron una de las principales formas de entretenimiento musical en los hogares. Generalmente estaban fabricados con madera, metal y componentes eléctricos, y algunos modelos incorporaban acabados decorativos que los convertían también en piezas de mobiliario. Su presencia en una residencia como la Casa Patiño permite imaginar cómo era la vida cotidiana y el entretenimiento de las familias acomodadas de aquella época."
    },

    "Telefono": {
        titulo: "Teléfono antiguo",
        texto: "Este teléfono representa una de las tecnologías de comunicación más características de finales del siglo XIX y comienzos del siglo XX. Permitía establecer conversaciones a distancia mediante señales eléctricas transmitidas a través de líneas telefónicas. Sus componentes podían incluir una estructura de metal, madera o baquelita, además de piezas mecánicas, cables y elementos acústicos. A diferencia de los teléfonos actuales, muchos modelos antiguos tenían un diseño robusto y elegante, con auriculares separados y mecanismos de marcación particulares. Su presencia recuerda la importancia de las comunicaciones en las residencias de familias con actividad empresarial y relaciones comerciales nacionales e internacionales."
    },

    "Cofre": {
        titulo: "Cofre",
        texto: "El cofre es un recipiente diseñado para conservar y proteger pertenencias personales, documentos, joyas y otros objetos de valor. Tradicionalmente se elaboraba con madera resistente, reforzada con herrajes metálicos, bisagras y cerraduras que proporcionaban mayor seguridad. Algunos ejemplares también incorporaban tallados, relieves o revestimientos ornamentales que reflejaban el estilo artístico de su época. Antes de la existencia de cajas de seguridad modernas, estos muebles cumplían una función importante dentro de las viviendas, ya que permitían mantener protegidos los bienes familiares y recuerdos personales. Por su apariencia y utilidad, el cofre también podía formar parte de la decoración de una habitación."
    },

    "Jarra": {
        titulo: "Jarra",
        texto: "La jarra es un recipiente doméstico utilizado para almacenar, conservar y servir diferentes tipos de líquidos, como agua, leche o bebidas preparadas. Dependiendo de su época y lugar de fabricación, podía elaborarse con cerámica esmaltada, porcelana, vidrio o metal, materiales que ofrecían distintas características de resistencia, conservación y apariencia. Las piezas de porcelana y cerámica solían presentar decoraciones pintadas, relieves y acabados esmaltados, mientras que las de metal podían incorporar detalles ornamentales y asas elaboradas. Este tipo de utensilio era habitual en los comedores y espacios de recepción de las residencias. Su diseño no solamente respondía a una necesidad práctica, sino que también podía reflejar los gustos estéticos, las costumbres y el nivel de refinamiento doméstico de sus propietarios."
    },

    "Cuadro1": {
        titulo: "Cuadro decorativo",
        texto: "Los cuadros decorativos constituyen elementos artísticos que permiten representar paisajes, retratos, acontecimientos históricos o composiciones ornamentales. Durante los siglos XIX y XX, las pinturas y reproducciones artísticas ocuparon un lugar importante en la decoración de residencias particulares, especialmente en salones y habitaciones destinadas a recibir visitas. Dependiendo de la técnica empleada, podían realizarse sobre lienzo, madera u otros soportes, utilizando pinturas al óleo, acuarelas u otros materiales. Sus marcos frecuentemente estaban elaborados en madera tallada, yeso ornamentado o metal, y podían presentar acabados dorados. Además de embellecer los ambientes, estas obras transmitían intereses culturales, preferencias artísticas y una determinada imagen social de sus propietarios."
    },

    "Cuadro2": {
        titulo: "Cuadro decorativo",
        texto: "Esta obra forma parte de los elementos visuales que enriquecen la ambientación interior de la Casa Patiño. Los cuadros eran utilizados tradicionalmente para decorar paredes, complementar el mobiliario y aportar personalidad a los distintos espacios de una residencia. Podían representar escenas naturales, figuras humanas, paisajes o motivos artísticos, dependiendo de las preferencias de sus propietarios. Su elaboración podía involucrar técnicas pictóricas sobre lienzo o soportes rígidos, acompañadas de marcos ornamentales de madera y otros materiales. En las residencias de familias acomodadas, la selección y distribución de pinturas también podía expresar interés por el arte, la cultura y las tendencias decorativas de su tiempo."
    },

    "Estaño": {
        titulo: "Estaño",
        texto: "El estaño es un elemento químico metálico de símbolo Sn, conocido por su apariencia plateada, su relativa suavidad y su resistencia a la corrosión. Se obtiene principalmente a partir del mineral casiterita, mediante procesos de extracción y fundición que permiten separar el metal de otros componentes presentes en el mineral. Este recurso tuvo una importancia extraordinaria en la historia económica de Bolivia, especialmente durante el auge minero de finales del siglo XIX y gran parte del siglo XX. Su explotación impulsó el desarrollo de centros mineros, actividades comerciales y redes de exportación. Simón I. Patiño llegó a convertirse en uno de los empresarios más influyentes de esta industria, por lo que el estaño constituye un elemento fundamental para comprender su trayectoria y la transformación económica del país."
    },

    "SiilaDeRuedas": {
        titulo: "Silla de ruedas",
        texto: "La silla de ruedas es un dispositivo de movilidad diseñado para facilitar el desplazamiento de personas que presentan dificultades para caminar o mantenerse de pie. A lo largo de su evolución, estos elementos pasaron de ser estructuras artesanales de madera y metal a modelos más ligeros, resistentes y funcionales, fabricados con acero, aluminio y otros materiales. Generalmente cuentan con un asiento, respaldo, reposabrazos, ruedas posteriores de mayor tamaño y ruedas delanteras que permiten orientar el desplazamiento. Su presencia en una residencia histórica permite recordar que las necesidades de movilidad y asistencia personal también formaban parte de la vida cotidiana de las familias de aquella época."
    },

    "Simon": {
        titulo: "Simon",
        texto: ""
    },

    "Albina": {
        titulo: "Albina",
        texto: ""
    },

    "Carrusel1": {
        titulo: "Carrusel",
        texto: "Las figuras de caballos de carrusel evocan una de las formas de entretenimiento popular más reconocidas de finales del siglo XIX y comienzos del siglo XX. Los carruseles tradicionales estaban compuestos por figuras de animales, especialmente caballos, colocadas sobre una plataforma giratoria. Estas figuras podían fabricarse en madera tallada, metal u otros materiales, y posteriormente decorarse con pinturas de colores, detalles ornamentales y accesorios que imitaban los arreos de los animales. Los caballos de carrusel se convirtieron en símbolos de diversión y recreación, especialmente en ferias, parques y espacios de entretenimiento familiar."
    },

    "Carrusel2": {
        titulo: "Carrusel",
        texto: "Este caballo representa otra de las figuras ornamentales características de los antiguos carruseles. Su diseño busca reproducir la apariencia y postura de un caballo en movimiento, incorporando detalles decorativos que aportan realismo y atractivo visual. En los carruseles históricos, estas figuras podían presentar cuerpos de madera tallada, estructuras metálicas y acabados pintados a mano. Además de cumplir una función recreativa, con el paso del tiempo se convirtieron en piezas representativas de la estética de los parques de diversiones tradicionales y de una época en la que los mecanismos giratorios y las figuras artesanales constituían una de las principales atracciones para niños y adultos."
    }

};


// CONFIGURACIÓN DE INTERACCIÓN
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let objetoSeleccionado = null;
let objetoHover = null;

// CREAR BORDE BLANCO

function crearBorde(objeto) {
    const bordes = [];
    objeto.traverse((parte) => {
        if (parte.isMesh && parte.geometry) {
            const geometriaBorde = new THREE.EdgesGeometry(parte.geometry,20);
            const materialBorde = new THREE.LineBasicMaterial({color: 0xffffff,transparent: true,opacity: 1});
            const borde = new THREE.LineSegments(geometriaBorde,materialBorde);
            borde.visible = false;
            parte.add(borde);
            bordes.push(borde);
        }
    });
    objeto.userData.bordesInteraccion = bordes;
}

// MOSTRAR / OCULTAR BORDE

function mostrarBorde(objeto) {
    if (!objeto || !objeto.userData.bordesInteraccion) {
        return;
    }
    objeto.userData.bordesInteraccion.forEach((borde) => {borde.visible = true;});
}

function ocultarBorde(objeto) {
    if (!objeto || !objeto.userData.bordesInteraccion) {
        return;
    }
    objeto.userData.bordesInteraccion.forEach((borde) => {borde.visible = false;});
}

// ENCONTRAR EL OBJETO PRINCIPAL

function obtenerObjetoPrincipal(parte, objetos) {
    let actual = parte;
    while (actual) {
        if (objetos.includes(actual)) {
            return actual;
        }
        actual = actual.parent;
    }
    return null;
}

// ACTUALIZAR HOVER

function actualizarHover(objetos, renderer, camera) {
    raycaster.setFromCamera(mouse, camera);
    const intersecciones = raycaster.intersectObjects(objetos,true);
    let nuevoObjeto = null;
    for (const interseccion of intersecciones) {
        if (!interseccion.object.isMesh) {
            continue;
        }
        nuevoObjeto = obtenerObjetoPrincipal(interseccion.object,objetos);
        if (nuevoObjeto) {
            break;
        }
    }

    // Si cambió el objeto
    if (nuevoObjeto !== objetoHover) {
        // Quitar borde del anterior
        if (objetoHover) {
            ocultarBorde(objetoHover);
        }
        // Mostrar borde del nuevo
        if (nuevoObjeto) {
            mostrarBorde(nuevoObjeto);
            renderer.domElement.style.cursor = "pointer";
        } else {
            renderer.domElement.style.cursor = "default";
        }
        objetoHover = nuevoObjeto;
    }
}

// CLICK SOBRE OBJETO

function seleccionarObjeto(objetos, camera) {
    raycaster.setFromCamera(mouse, camera);
    const intersecciones = raycaster.intersectObjects(objetos,true);
    for (const interseccion of intersecciones) {
        if (!interseccion.object.isMesh) {
            continue;
        }
        const objeto = obtenerObjetoPrincipal(interseccion.object,objetos);
        if (!objeto) {
            continue;
        }
        mostrarInformacion(objeto);
        break;
    }
}

// VENTANA DE INFORMACIÓN


function mostrarInformacion(objeto) {

    const informacion = informacionObjetos[objeto.name];

    if (!informacion) {
        console.log("No hay información para:", objeto.name);
        return;
    }

    const ventana = document.getElementById("ventanaObjeto");
    const contenidoComun = document.getElementById("contenidoComun");
    const contenidoBiografia = document.getElementById("contenidoBiografia");

    // PERSONAJES: SIMÓN Y ALBINA
    if (objeto.name === "Simon" || objeto.name === "Albina") {

        ventana.classList.add("modoBiografia");

        contenidoComun.style.display = "none";
        contenidoBiografia.style.display = "block";

        const nombre = document.getElementById("nombrePersonaje");
        const fechas = document.getElementById("fechasPersonaje");
        const biografia = document.getElementById("textoBiografia");

        if (objeto.name === "Simon") {

            nombre.textContent = "Simón I. Patiño";
            fechas.textContent = "1860 – 1947";

            biografia.textContent =
                "Simón I. Patiño fue un empresario minero boliviano, " +
                "conocido por su participación en el desarrollo de la " +
                "industria del estaño. Su actividad empresarial tuvo " +
                "una gran influencia en la economía boliviana.";

            mostrarPersonaje("Simon");

        } else {

            nombre.textContent = "Albina Rodríguez";
            fechas.textContent = "";

            biografia.textContent =
                "Albina Rodríguez fue la esposa de Simón I. Patiño " +
                "y formó parte de su entorno familiar e histórico.";

            mostrarPersonaje("Albina");
        }

    } else {

        // OBJETOS COMUNES
        ventana.classList.remove("modoBiografia");

        contenidoBiografia.style.display = "none";
        contenidoComun.style.display = "block";

        document.getElementById("tituloObjeto").textContent =
            informacion.titulo;

        document.getElementById("textoObjeto").textContent =
            informacion.texto;

        ocultarPersonaje();
    }

    ventana.style.display = "block";
    objetoSeleccionado = objeto;
}


// CERRAR VENTANA

function cerrarInformacion() {

    const ventana = document.getElementById("ventanaObjeto");

    ventana.style.display = "none";

    ventana.classList.remove("modoBiografia");

    document.getElementById("contenidoBiografia").style.display = "none";
    document.getElementById("contenidoComun").style.display = "block";

    ocultarPersonaje();

    objetoSeleccionado = null;
}

// FUNCIÓN PRINCIPAL

export function crearInteraccionObjetos(objetos,camera,renderer) 
    {
    if (!objetos || objetos.length === 0) {
        console.warn("No hay objetos para interactuar.");
        return function () {};
    }
    // Crear bordes para todos los objetos
    objetos.forEach((objeto) => {
        crearBorde(objeto);
    });

    // MOVIMIENTO DEL MOUSE

    renderer.domElement.addEventListener(
        "mousemove",
        (evento) => {
            mouse.x =
                (evento.clientX / window.innerWidth) * 2 - 1;
            mouse.y =
                -(evento.clientY / window.innerHeight) * 2 + 1;
        }
    );

    // CLICK

    renderer.domElement.addEventListener(
    "click",
    () => {

        const ventana = document.getElementById("ventanaObjeto");
        // Si la ventana está abierta,
        // no seleccionar otro objeto
        if (ventana.style.display === "block") {
            return;
        }
        seleccionarObjeto(objetos,camera);
    }
);

    // BOTÓN CERRAR

    const botonCerrar =
    document.getElementById("cerrarVentanaObjeto");
if (botonCerrar) {
    botonCerrar.addEventListener(
        "click",
        (evento) => {
            evento.stopPropagation();
            cerrarInformacion();
        }
    );
}

    // FUNCIÓN QUE SE EJECUTA EN ANIMATE()

    return function actualizarInteraccion() {
        actualizarHover(objetos,renderer,camera
        );
    };

}