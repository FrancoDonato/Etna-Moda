export function modalDetalle(p) {
    let container = document.querySelector('#productModal');
    let template = `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">${p.title}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-6">
                    <img src="${p.image}" class= "img-fluid" alt="${p.title}">
                </div>
                <div class="col-md-6">
                    <p> ${p.description}</p>
                    <h4> $${p.price}</h4>
                </div>
            </div>
        </div>
            <div class="modal-footer">
                <button type="button" class="btn-card">Agregar al carrito</button>
            </div>
        </div>
    </div>
    `;
    container.innerHTML = template;
    const bootstrapModal = new bootstrap.Modal(container);
    bootstrapModal.show();
}