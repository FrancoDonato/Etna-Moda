//Importamos el llamado a la Api desde api.js

import { getProducts } from "./services/api.js";
import { modalDetalle } from "./components/detalle.js";


//Traemos los elementos necesarios desde el HTML

let productList = document.querySelector('#gallery-grid');

//Declaro products como un arrray

export let products = [];

//Defino la funcion asincrona iniciar, la cual renderizara en primera instancia todos los cards
//espero la promesa, y manejo el resultado con await esperando el resultado
//y catch manejando el error

export async function iniciar() {
  try {
    products = await getProducts();
    renderizarProductos(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}
//Llamo a la funcion iniciar para que renderice todos los productos

iniciar();

//Realice la funcion que se encargara de reenderizar los productos

export function renderizarProductos(lista) {
  productList.innerHTML = '<div class="d-flex align-items-center"><strong role="status">Loading...</strong><div class="spinner-border ms-auto" aria-hidden="true"></div></div>';

  if (lista.length === 0) {
    productList.innerHTML = '<p class="text-muted">No se encontraron productos.</p>';
    return;
  }

  let cardTemplate = '';

  lista.forEach(p => {
    cardTemplate += `
        <div class ="card"> 
          <img src="${p.image}" class="card-image" alt="${p.title}">
          <div class = "card-body">
            <p class = "card-title">${p.title}</p>
            <h5 class = "card-price">$${p.price}</h5>
          </div>
          <div>
            <button id="detalleItem-${p.id}" type="button" class="btn-card">Ver más</button>
            <button id="agregarItem-${p.id}" type="button" class="btn-card">Agregar al carrito</button>
          </div>
        </div>     
        `;
  })
  productList.innerHTML = cardTemplate;
  //Asigno eventos al botón ver más
  lista.forEach((p) => {
    let btn = document.querySelector(`#detalleItem-${p.id}`);
    btn.addEventListener('click', () => {
      modalDetalle(p);
    })
  })

}
