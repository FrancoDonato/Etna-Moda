
import { renderizarProductos } from "../index.js";
import { iniciar } from "../index.js";
import { products } from "../index.js";
//Creo la funcion para que al tocar el boton de busqueda filtre los resultados
//Traemos los elementos necesarios desde el HTML

let productBuscado = document.querySelector('#ItemFiltrado');
let btnBuscador = document.querySelector('#button-buscador');
let btnClear = document.querySelector('#button-clear');
let category = document.querySelector('#category-filter');
let precioMax = document.querySelector('#filter-max');
let precioMin = document.querySelector('#filter-min');

// Función que aplica filtros
function aplicarFiltros() {
    const texto = productBuscado.value.toLowerCase();
    const categoria = category.value;
    const min = precioMin.value ? parseFloat(precioMin.value) : 0;
    const max = precioMax.value ? parseFloat(precioMax.value) : Infinity;

    const filtrados = products.filter(p => {
        const coincideTexto = texto === "" || p.title.toLowerCase().includes(texto);
        const coincideCategoria = categoria === "todas" || categoria === "" || p.category === categoria;
        const coincidePrecio = p.price >= min && p.price <= max;

        return coincideTexto && coincideCategoria && coincidePrecio;
    });

    renderizarProductos(filtrados);
}

// Al hacer click en buscar 
btnBuscador.addEventListener('click', aplicarFiltros);

// Al escribir en la barra de búsqueda
productBuscado.addEventListener('input', aplicarFiltros);

// Al cambiar categoría
category.addEventListener('change', aplicarFiltros);

// Al cambiar precios
precioMin.addEventListener('input', aplicarFiltros);
precioMax.addEventListener('input', aplicarFiltros);

// Botón limpiar
btnClear.addEventListener('click', () => {
    iniciar();
    productBuscado.value = "";
    category.value = "todas";
    precioMin.value = "";
    precioMax.value = "";
});
