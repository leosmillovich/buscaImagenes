const resultado = document.getElementById('resultado')
const submit = document.getElementById('form');
const paginacionDiv = document.getElementById('paginacion');
const entrada = document.getElementById('entrada');

const imagenesPorPagina = 20;
let totalPaginas;
let iterador;
let paginaActual = 1;

submit.addEventListener('submit', validarFormulario);

function validarFormulario(e) {
    e.preventDefault()
    consultaApi();
}

function consultaApi() {
    
    const entrada = document.getElementById('entrada').value;
    const key = '28269124-e2ae67b0c4e96f523d48407fb';
    const url = `https://pixabay.com/api/?key=${key}&q=${entrada}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            imprimirImagenes(resultado.hits)
        })

}

function imprimirImagenes(imagenes) {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

    imagenes.forEach(imagen => {
        const { previewURL, largeImageURL } = imagen;

        resultado.innerHTML += `
        <div class="card">
         <img src="${previewURL}">
         <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
        </div>
         `
    });

    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }


    imprimirPaginador()
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / imagenesPorPagina))
}

function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const { value, done } = iterador.next()
        if (done) return;

        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('btnPaginador');

        boton.onclick = () => {
            paginaActual = value;
            consultaApi();
        }

        paginacionDiv.appendChild(boton);
    }
}