import { apiKey } from "./env.js";

// Variables del htlm
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

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

    buscarImagenes(terminoBusqueda);

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

function buscarImagenes(termino) {
    // console.log(termino);

    const key = apiKey;
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}`;

    console.log(url);

    fetch(url)
        .then(resultado =>{
            return resultado.json();
        })
        .then(datos => {
            
            // console.log(datos.hits);
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


}
// Fin mostrar imagenes

function limpiarHtml() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
