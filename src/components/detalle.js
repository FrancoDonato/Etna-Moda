import { addToCart } from "../components/carrito.js";

export function modalDetalle(p) {
    let container = document.querySelector('#productDetailModal');
    let template = `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">${p.title}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-6 d-flex justify-content-center">
                    <img src="${p.image}" class="img-fluid" alt="${p.title}">
                </div>
                <div class="col-md-6 d-flex flex-column justify-content-center">
                    <p> ${p.description}</p>
                    <h4> $${p.price}</h4>
                    <div class="d-flex-1 align-items-center mt-3">
                        <label for="modal-quantity" class="me-2">Cantidad:</label>
                        <div class="input-group" style="width: 130px;">
                            <button class="btn btn-outline-secondary" type="button" id="modal-decrease-qty">-</button>
                            <input type="text" id="modal-quantity" class="form-control text-center" value="1" min="1" readonly>
                            <button class="btn btn-outline-secondary" type="button" id="modal-increase-qty">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <div class="modal-footer">
                <button type="button" class="btn-card" id="modal-add-to-cart">Agregar al carrito</button>
            </div>
        </div>
    </div>
    `;
    container.innerHTML = template;
    const bootstrapModal = new bootstrap.Modal(container);

    const decreaseBtn = container.querySelector('#modal-decrease-qty');
    const increaseBtn = container.querySelector('#modal-increase-qty');
    const quantityInput = container.querySelector('#modal-quantity');

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    container.querySelector('#modal-add-to-cart').addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(p, quantity);
        bootstrapModal.hide(); // Opcional: cerrar el modal después de agregar
    });

    bootstrapModal.show();

    //Toast de Agregado al carrito
    const toastTrigger = document.getElementById('modal-add-to-cart')
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastTrigger.addEventListener('click', () => {
            toastBootstrap.show()
        })
    }

}


