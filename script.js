let products = [
{
name:"tv",
price:3000,
image:"tv.jpg"
},
{
name:"Headphones",
price:3000,
image:"https://images.unsplash.com/photo-1585386959984-a4155223169c"
},
{
name:"T-Shirt",
price:1200,
image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
}
];

let cart = [];

function displayProducts(){
let container = document.getElementById("products");
container.innerHTML="";

products.forEach((p,i)=>{
container.innerHTML+=`
<div class="product">
<img src="${p.image}">
<h3>${p.name}</h3>
<p>Rs ${p.price}</p>

<button onclick="addToCart(${i})">Add to Cart</button>
<button onclick="orderNow('${p.name}', '${p.price}')">Order on WhatsApp</button>

</div>
`;
});
}

displayProducts();

function addToCart(i){
cart.push(products[i]);
document.getElementById("cart-count").innerText = cart.length;
}

function orderNow(name, price){
let phone="94776939483";
let message = `Hello Unique Spot, I want to order:

Product: ${name}
Price: Rs ${price}`;

let url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

window.open(url, "_blank");
}
