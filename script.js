let products = [
 {name:"iPhone 13", price:250000, image:"phone.jpg"},
 {name:"Headset", price:5000, image:"headset.jpg"},
 {name:"T-Shirt", price:3000, image:"shirt.jpg"}
];

let cart = [];

function displayProducts(list){
let html="";
list.forEach((p,i)=>{
html+=`
<div class="card">
<img src="${p.image}" width="150">
<h3>${p.name}</h3>
<p>Rs ${p.price}</p>
<button onclick="addCart(${i})">Add to Cart</button>
</div>
`;
});
document.getElementById("products").innerHTML=html;
}

displayProducts(products);

function searchProduct(){
let value=document.getElementById("search").value.toLowerCase();
let filtered=products.filter(p=>p.name.toLowerCase().includes(value));
displayProducts(filtered);
}

function addCart(i){
cart.push(products[i]);
alert("Added to cart");
}

function openCart(){
alert("Cart Items: "+cart.length);
}
