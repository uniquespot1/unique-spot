const products = [
  { id: 1, name: "Smart Watch", price: 8500, img: "images/watch.jpg" },
  { id: 2, name: "Headphones", price: 3500, img: "images/headphone.jpg" },
  { id: 3, name: "Mobile Phone", price: 65000, img: "images/phone.jpg" },
  { id: 4, name: "Bluetooth Speaker", price: 6000, img: "images/speaker.jpg" },
  { id: 5, name: "Gaming Mouse", price: 2500, img: "images/mouse.jpg" },
  { id: 6, name: "T-Shirt", price: 2200, img: "images/tshirt.jpg" },
  { id: 7, name: "Face Cream", price: 1800, img: "images/cream.jpg" },
  { id: 8, name: "Laptop Bag", price: 4500, img: "images/bag.jpg" },
  { id: 9, name: "Power Bank", price: 5000, img: "images/powerbank.jpg" },
  { id: 10, name: "Home Lamp", price: 3200, img: "images/lamp.jpg" }
];

function getCart(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(c){ localStorage.setItem("cart", JSON.stringify(c)); }
function getReviews(){
  return JSON.parse(localStorage.getItem("reviews")) || [];
}
function starsDecimal(n){
  const full = Math.floor(n);
  const empty = 5 - full;
  return "★".repeat(full) + "☆".repeat(empty);
}

const params = new URLSearchParams(window.location.search);
const pid = Number(params.get("id"));
const product = products.find(p=>p.id===pid);

if(!product){
  document.body.innerHTML = "<h2 style='padding:20px'>Product not found</h2>";
  throw new Error("Product not found");
}

document.getElementById("pImage").src = product.img;
document.getElementById("pName").textContent = product.name;
document.getElementById("pPrice").textContent = "Rs. " + product.price.toLocaleString();

const reviews = getReviews().filter(r=>r.productId===pid);
const avg = reviews.length ? (reviews.reduce((s,x)=>s+x.rating,0)/reviews.length) : 0;
document.getElementById("pRating").textContent = avg ? `${starsDecimal(avg)}  (${avg.toFixed(1)} / 5)` : "No rating yet";

const reviewList = document.getElementById("reviewList");
reviewList.innerHTML = reviews.map(r=>`
  <div class="review-item">
    <b>${r.name}</b> — ${starsDecimal(r.rating)}<br>
    ${r.text}
  </div>
`).join("") || "No reviews yet.";

document.getElementById("addCartBtn").onclick=()=>{
  const cart=getCart();
  const f=cart.find(x=>x.id===pid);
  if(f) f.qty++;
  else cart.push({id:pid,qty:1});
  saveCart(cart);
  alert("Added to cart ✅");
};

document.getElementById("buyNowBtn").onclick=()=>{
  const cart=getCart();
  const f=cart.find(x=>x.id===pid);
  if(!f) cart.push({id:pid,qty:1});
  saveCart(cart);
  window.location.href="cart.html";
};