const products = [
{
name: "TV",
price: 3000,
image: "tv.jpg"
},
{
name: "Headphones",
price: 3000,
image: "headphones.jpg"
},
{
name: "T-Shirt",
price: 1200,
image: "tshirt.jpg"
}
];

const productContainer = document.getElementById("products");

products.forEach(product => {

const div = document.createElement("div");
div.className = "product";

div.innerHTML = `
<img src="${product.image}">
<h3>${product.name}</h3>
<p>Rs ${product.price}</p>
<button onclick="addToCart()">Add to Cart</button>
<button onclick="orderWhatsApp('${product.name}')">Order on WhatsApp</button>
`;

productContainer.appendChild(div);

});

let cart = 0;

function addToCart(){
cart++;
document.getElementById("cart-count").innerText = cart;
}

function orderWhatsApp(productName){
let phone = "94700000000"; // your WhatsApp number
let message = `I want to buy ${productName}`;
window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
}
