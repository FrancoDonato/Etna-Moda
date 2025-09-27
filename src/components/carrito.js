
let cart = JSON.parse(localStorage.getItem('etna_moda_cart')) || [];

let cartCountSpan = document.querySelector('#cartCountSpan');
let cartItemsList = document.querySelector('#cartItemsList');
let cartSubtotalSpan = document.querySelector('#cartSubtotalSpan');
let clearCartBtn = document.querySelector('#clearCartBtn');
let checkoutBtn = document.querySelector('#checkoutBtn');

// Guarda el carrito en localStorage y actualiza el contador y la UI
const saveCart = () => {
    localStorage.setItem('etna_moda_cart', JSON.stringify(cart));
    updateCartCount();
    if (document.querySelector('#carritoDeCompras').classList.contains('show')) {
        renderCartItems();
    }
};

// Actualiza el contador de items en el navbar
export const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
};

// Agrega un producto al carrito (o aumenta la cantidad si ya existe)
export const addToCart = (product, quantity = 1) => {
    if (quantity < 1) return;
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    saveCart();
};

// Elimina un producto del carrito
const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== Number(productId));
    saveCart();
};

// Cambia la cantidad de un producto en el carrito
// Si la cantidad es 0, elimina el producto
const changeCartItemQuantity = (productId, newQuantity) => {
    const itemIndex = cart.findIndex(item => item.id === Number(productId));
    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }
        saveCart();
    }
};


// Renderizado del carrito en el DOM
const renderCartItems = () => {
    cartItemsList.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p>Su carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('item-cart-wrapper');
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
        <button class="btn btn-sm btn-link text-danger remove-item-btn" data-id="${item.id}">❌</button>
      `;
            cartItemsList.appendChild(cartItemDiv);
        });
    }
    cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)} ARS`;
};

// Listeners del carrito
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

// Abrir carrito y renderizar items
document.querySelector('#openCartBtn').addEventListener('click', () => {
    renderCartItems();
});

// Vaciar carrito
clearCartBtn.addEventListener('click', () => {
    if (cart.length > 0 && confirm('¿Está seguro que desea vaciar el carrito?')) {
        cart = [];
        saveCart();
        renderCartItems();
    }
});

// Finalizar compra

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Su carrito está vacío, agregue productos antes de finalizar su compra.');
        return;
    }
    // Mostrar el toast de compra completada
    const toastEl = document.getElementById('liveToast1');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    // Vaciar carrito y actualizar UI
    cart = [];
    saveCart();
    renderCartItems();
});
