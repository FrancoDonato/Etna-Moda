import { getProducts } from "../services/api.js";
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

//Declaro products como un arrray

btnBuscador.addEventListener('click', () => {
    const texto = productBuscado.value.toLowerCase();
    const categoria = category.value;
    const min = precioMin.value ? parseFloat(precioMin.value) : 0;
    const max = precioMax.value ? parseFloat(precioMax.value) : Infinity;


    const filtrados = products.filter(p => {
        const coincideTexto = p.title.toLowerCase().includes(texto);
        const coincideCategoria = categoria === "" || p.category === categoria;
        const coincidePrecio = p.price >= min && p.price <= max;

        return coincideTexto && coincideCategoria && coincidePrecio;
    }
    );

    renderizarProductos(filtrados);
});

//Creo la funcion para que al tocar el boton de busqueda limpie los filtros de busqueda
btnClear.addEventListener('click', () => {
    iniciar();
    productBuscado.value = "";
    category.value = "todas";
    precioMin.value = "";
    precioMax.value = "";
});
