import { getProducts } from "./services/api.js";
import { modalDetalle } from "./components/detalle.js";
import { addToCart, updateCartCount } from "./components/carrito.js";

let productList = document.querySelector('#gallery-grid');
export let products = [];

// Renderizar productos
export function renderizarProductos(lista) {
    productList.innerHTML = '<div class="d-flex align-items-center"><strong role="status">Loading...</strong><div class="spinner-border ms-auto" aria-hidden="true"></div></div>';

    if (lista.length === 0) {
        productList.innerHTML = '<p class="text-muted">No se encontraron productos.</p>';
        return;
    }

    let cardTemplate = '';
    lista.forEach(p => {
        cardTemplate += `
      <div class="card" data-product-id="${p.id}" style="cursor: pointer;"> 
        <img src="${p.image}" class="card-image" alt="${p.title}">
        <div class="card-body">
          <p class="card-title">${p.title}</p>
          <h5 class="card-price">$${p.price}</h5>
        </div>
        <div>
          <button id="detalleItem-${p.id}" type="button" class="btn-card">Ver más</button>
          <button type="button" class="btn-card add-to-cart-btn">Agregar al carrito</button>
        </div>
      </div>`;
    });
    productList.innerHTML = cardTemplate;
}

// Inicializar productos
export async function iniciar() {
    try {
        products = await getProducts();   // <- trae productos de la API
        console.log("Productos obtenidos:", products);
        renderizarProductos(products);    // <- los renderiza en pantalla
    } catch (error) {
        console.error("Error al obtener productos:", error);
        productList.innerHTML = '<p class="text-danger">Error al cargar productos.</p>';
    }
}

// Llamadas iniciales
iniciar();
updateCartCount();

// Listener para clicks en cards
productList.addEventListener('click', (event) => {
    const target = event.target;
    const card = target.closest('.card');
    if (!card) return;

    const productId = card.dataset.productId;
    const product = products.find(p => p.id === Number(productId));

    if (product) {
        if (target.classList.contains('add-to-cart-btn')) {
            addToCart(product);

            // Mostrar toast de agregado
            const toastEl = document.getElementById('liveToast');
            const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
            toast.show();
        } else {
            modalDetalle(product);
        }
    }
});
