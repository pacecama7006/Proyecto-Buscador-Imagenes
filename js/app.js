import { apiKey } from "./env.js";

// Variables del htlm
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

// Variable para el paginador
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
};

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        // console.log('Agrega un término de búsqueda');
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();

}
// Fin validarFormulario

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3','rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }
    
}
// Fin mostrar alerta

function buscarImagenes() {
    // console.log(termino);
    const termino = document.querySelector('#termino').value;
    const key = apiKey;
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    // console.log(url);

    fetch(url)
        .then(resultado =>{
            
            return resultado.json();
        })
        .then(datos => {
            
            // console.log(datos);
            // console.log(datos.hits);

            totalPaginas = calcularPaginas(datos.totalHits);
            // console.log(totalPaginas);

            mostrarImagenes(datos.hits);
        })
        .catch(error => {
            console.log(error);
        })
}
// Fin buscar imagenes

function mostrarImagenes(imagenes) {
    // console.log(imagenes);
    limpiarHtml();

    // Iteramos sobre el arreglo de imágenes y construir el html
    imagenes.forEach(imagen => {
        const {pageURL, previewURL, likes, views, webformatURL, largeImageURL}= imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light">Vistas</span></p>
                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Vista previa</a>
                    </div>
                </div>
            </div>
        `;
    });

    // Limpiamos el paginador previo
    limpiarPaginadorPrevio();

    // Generamos el paginador en el Html
    imprimirPaginador();

}
// Fin mostrar imagenes

function limpiarHtml() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
// Fin limpiarHtml

// Función que me permite calcular el total de páginas a crear en el paginador
function calcularPaginas(total) {
    return parseInt(Math.ceil(total/registrosPorPagina));
}

/**Generador que va a registrar la cantidad de elementos deacuerdo
 * a las páginas. Recordar que para crear un generador se pone
 * un * antes del nombre
 */
function *crearPaginador(total) {
    // console.log(total);
    for (let i = 1; i <= total; i++) {
        // console.log(i);
        // Registro los valores internamente en el generador
        yield i;
    }
}

function imprimirPaginador() {
    /**Llamo al generador para calcular el número de páginas */
    iterador = crearPaginador(totalPaginas);
    // con .next despierta el generador y se quita de suspended
    // console.log(iterador.next().done);

    while (true) {
        // accedo a las propiedades del generador crearPaginador con
        // el .next
        const {value, done} = iterador.next();

        // Si ya llegó al final, ya no hace nada
        if(done) return;

        /**En caso contrario genera un botón por cada elemento en el
         * generador
         */
        const boton = document.createElement('a');
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-5', 'rounded');

        boton.onclick = () =>{
            // Me trae el valor de la página que estoy dando click
            // console.log(value);
            // Le doy valor a paginaActual con el value del generador
            paginaActual = value;
            // console.log(paginaActual);

            // Vuelvo a consultar la api
            buscarImagenes();
        };

        paginacionDiv.appendChild(boton);
    }
}
// Fin imprimirPaginador

function limpiarPaginadorPrevio() {
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
}
