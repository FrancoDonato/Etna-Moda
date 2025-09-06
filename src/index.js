import { getProducts } from "./api.js";

// Se llama a getProducts y se recorre el array armando una 
// tarjeta para cada uno
let productList = document.querySelector('#gallery-grid');

getProducts().then((products) => {
    let cardTemplate = '';

    products.forEach(p => {

        cardTemplate += `
        <div class ="card"> 
            <img src="${p.image}" class="card-image" alt="${p.title}">
            <div class = "card-body">
                <p class = "card-title">${p.title}</p>
                <h5 class = "card-price">$${p.price}</h5>
            </div>
        </div>     
        `;
    });
    productList.innerHTML = cardTemplate;
});
