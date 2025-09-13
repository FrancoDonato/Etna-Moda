// Se exporta la funcion getProducts para obtener los productos de la api

export function getProducts() {
  let resp = fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then((data) => data);
  console.log(resp);
  return resp;
}