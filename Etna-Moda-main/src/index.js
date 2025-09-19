//Importamos el llamado a la Api desde api.js

import { getProducts } from "./services/api.js";
import { modalDetalle } from "./components/detalle.js";


//los elementos necesarios desde el HTML

let productList = document.querySelector('#gallery-grid');
let cartCountSpan = document.querySelector('#cartCountSpan');
let addToCartMessage = document.querySelector('#addToCartMessage');
let cartItemsList = document.querySelector('#cartItemsList');
let cartSubtotalSpan = document.querySelector('#cartSubtotalSpan');
let clearCartBtn = document.querySelector('#clearCartBtn');
let checkoutBtn = document.querySelector('#checkoutBtn');

//Declaro products como un arrray

export let products = [];

//Defino la funcion asincrona iniciar, la cual renderizara en primera instancia todos los cards
//espero la promesa, y manejo el resultado con await esperando el resultado

let cart = JSON.parse(localStorage.getItem('etna_moda_cart')) || [];

// Guarda el carrito en localStorage y actualiza la UI
const saveCart = () => {
    localStorage.setItem('etna_moda_cart', JSON.stringify(cart));
    updateCartCount();
    // Si el offcanvas del carrito está abierto, lo vuelve a renderizar
    if (document.querySelector('#carritoDeCompras').classList.contains('show')) {
        renderCartItems();
    }
};

// Actualiza el contador de items en el navbar
const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
};

// Muestra un mensaje temporal (ej. "Item agregado al carrito")
export const displayAddToCartMessage = (message, isError = false) => {
    addToCartMessage.textContent = message;
    addToCartMessage.classList.remove('error');
    if (isError) {
        addToCartMessage.classList.add('error');
    }
    addToCartMessage.style.display = 'block';
    setTimeout(() => {
        addToCartMessage.style.display = 'none';
    }, 3000);
};

// Agrega un producto al carrito
export const addToCart = (product, quantity = 1) => {
    if (quantity < 1) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    saveCart();
    displayAddToCartMessage(`${quantity} x ${product.title} agregado al carrito!`);
};

// Elimina un item del carrito
const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== Number(productId));
    saveCart();
};

// Cambia la cantidad de un item en el carrito, o lo elimina si la cantidad es 0
const changeCartItemQuantity = (productId, newQuantity) => {
    const itemIndex = cart.findIndex(item => item.id === Number(productId));
    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1); // Elimina el item si la cantidad es 0 o menor
        }
        saveCart();
    }
};

// Event Listeners para el Carrito
cartItemsList.addEventListener('click', (event) => {
    const target = event.target;
    const productId = target.dataset.id;
    if (!productId) return;
    const itemInCart = cart.find(item => item.id === Number(productId));

    if (target.classList.contains('remove-item-btn')) {
        removeFromCart(productId);
    } else if (target.classList.contains('increase-cart-item') && itemInCart) {
        changeCartItemQuantity(productId, itemInCart.quantity + 1);
    } else if (target.classList.contains('decrease-cart-item') && itemInCart) {
        changeCartItemQuantity(productId, itemInCart.quantity - 1);
    }
});
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
updateCartCount(); // Actualiza el contador al cargar la página

// Se utiliza event delegation en la lista de productos para manejar los clicks de forma eficiente.
// Se agrega un único listener al contenedor padre en lugar de uno por cada botón/tarjeta.
productList.addEventListener('click', (event) => {
    const target = event.target;

    // Busca el elemento .card más cercano al elemento clickeado
    const card = target.closest('.card');
    if (!card) return; // Si no se encuentra una card, no hace nada

    const productId = card.dataset.productId;
    const product = products.find(p => p.id === Number(productId));

    if (product) {
        // Si el click fue en el botón de agregar al carrito, lo añade al carrito.
        if (target.classList.contains('add-to-cart-btn')) {
            addToCart(product);
        } else {
            // De lo contrario, cualquier otro click en la card abre el modal de detalle.
            modalDetalle(product);
        }
    }
});

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
        <div class="card" data-product-id="${p.id}" style="cursor: pointer;"> 
          <img src="${p.image}" class="card-image" alt="${p.title}">
          <div class = "card-body">
            <p class = "card-title">${p.title}</p>
            <h5 class = "card-price">$${p.price}</h5>
          </div>
          <div>
            <button id="detalleItem-${p.id}" type="button" class="btn-card">Ver más</button>
            <button type="button" class="btn-card add-to-cart-btn">Agregar al carrito</button>
          </div>
        </div>     
        `;
  })
  productList.innerHTML = cardTemplate;
}

const renderCartItems = () => {
    cartItemsList.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p>Su carrito esta vacio.</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('d-flex', 'align-items-center', 'mb-3');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: contain;">
                <div class="mx-2 flex-grow-1">
                    <p class="mb-0 small">${item.title}</p>
                    <p class="mb-0 small text-muted">$${item.price.toFixed(2)}</p>
                </div>
                <div class="input-group input-group-sm" style="width: 95px;">
                    <button class="btn btn-outline-secondary decrease-cart-item" data-id="${item.id}" type="button">-</button>
                    <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary increase-cart-item" data-id="${item.id}" type="button">+</button>
                </div>
                <button class="btn btn-sm btn-link text-danger remove-item-btn" data-id="${item.id}">&times;</button>
            `;
            cartItemsList.appendChild(cartItemDiv);
        });
    }
    cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)} ARS`;
};

document.querySelector('#openCartBtn').addEventListener('click', () => {
    renderCartItems();
});

clearCartBtn.addEventListener('click', () => {
    if (cart.length > 0 && confirm('¿Está seguro que desea vaciar el carrito?')) {
        cart = [];
        saveCart();
        renderCartItems();
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Su carrito esta vacio, agregue productos antes de finalizar su compra.');
        return;
    }
    alert('Aqui iriamos a finalizar la compra :P ');
    cart = [];
    saveCart();
    renderCartItems();
});
