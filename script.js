let products = [
{
name:"Smart Watch",
price:4500,
image:"https://i.imgur.com/Z6X9K5S.png",
category:"Electronics"
},
{
name:"Headphones",
price:3000,
image:"https://i.imgur.com/9sY2F4K.png",
category:"Electronics"
},
{
name:"T-Shirt",
price:1200,
image:"https://i.imgur.com/3dL8XcQ.png",
category:"Clothes"
},
{
name:"Phone Case",
price:800,
image:"https://i.imgur.com/3v3QZ4F.png",
category:"Accessories"
}
];

let cart = [];

function displayProducts(list){
let container = document.getElementById("products");
container.innerHTML="";

list.forEach((p,i)=>{
container.innerHTML+=`
<div class="product">
<img src="${p.image}">
<h3>${p.name}</h3>
<p>Rs ${p.price}</p>
<button onclick="addToCart(${i})">Add to Cart</button>
<button onclick="orderNow('${p.name}')">Order</button>
</div>
`;
});
}

displayProducts(products);

function addToCart(i){
cart.push(products[i]);
document.getElementById("cart-count").innerText = cart.length;
alert("Added to cart");
}

document.getElementById("search").addEventListener("keyup", function(){
let value = this.value.toLowerCase();
let filtered = products.filter(p => p.name.toLowerCase().includes(value));
displayProducts(filtered);
});

function orderNow(product){
let phone="94776939483";
let message="Hello Unique Spot, I want to order: " + product;
window.open(`https://wa.me/${phone}?text=${message}`);
}
