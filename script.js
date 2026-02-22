/***************
 Unique Spot - script.js
 Works with:
 - #productList
 - #searchInput, #searchBtn
 - .sidebar li[data-cat]
 - #cartCount
****************/

const PRODUCTS = [
  { id: "p1", name: "Smart Watch", price: 8500, cat: "smartwatches", img: "images/watch.jpg" },
  { id: "p2", name: "Headphones", price: 3500, cat: "electronics", img: "images/headphones.jpg" },
  { id: "p3", name: "Mobile Phone", price: 65000, cat: "mobilephones", img: "images/phone.jpg" },
  { id: "p4", name: "Bluetooth Speaker", price: 6000, cat: "electronics", img: "images/speaker.jpg" },
  { id: "p5", name: "Gaming Mouse", price: 2500, cat: "gaming", img: "images/mouse.jpg" },
  { id: "p6", name: "T-Shirt", price: 2900, cat: "fashion", img: "images/tshirt.jpg" },
  { id: "p7", name: "Face Cream", price: 1800, cat: "beauty", img: "images/cream.jpg" },
  { id: "p8", name: "Laptop Bag", price: 4500, cat: "electronics", img: "images/bag.jpg" },
  { id: "p9", name: "Power Bank", price: 5200, cat: "electronics", img: "images/powerbank.jpg" },
  { id: "p10", name: "Home Lamp", price: 3900, cat: "homeitems", img: "images/lamp.jpg" },
];

// ---- helpers ----
function money(n){ return "Rs. " + Number(n).toLocaleString("en-LK"); }

function getCart(){
  try { return JSON.parse(localStorage.getItem("cart")) || []; }
  catch { return []; }
}
function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
}
function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,i)=> s + (i.qty||0), 0);
  const el = document.getElementById("cartCount");
  if(el) el.textContent = count;
}

function addToCart(id){
  const cart = getCart();
  const found = cart.find(x => x.id === id);
  if(found) found.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  updateCartCount();
  alert("Added to cart ✅");
}

function imgFallback(imgEl){
  // if image missing, show a clean placeholder
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = "https://via.placeholder.com/400x300?text=Unique+Spot";
  };
}

// ---- render ----
let currentCat = "all";
let currentQuery = "";

function renderProducts(){
  const wrap = document.getElementById("productList");
  if(!wrap) return;

  const q = currentQuery.trim().toLowerCase();
  let list = PRODUCTS.slice();

  if(currentCat !== "all"){
    list = list.filter(p => p.cat === currentCat);
  }
  if(q){
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }

  if(list.length === 0){
    wrap.innerHTML = `<div class="empty">No products found.</div>`;
    return;
  }

  wrap.innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${money(p.price)}</p>
      <button class="btn primary-btn" data-add="${p.id}">Add to Cart</button>
    </div>
  `).join("");

  // fallback for images
  wrap.querySelectorAll("img").forEach(imgFallback);

  // bind add to cart
  wrap.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const id = e.currentTarget.getAttribute("data-add");
      addToCart(id);
    });
  });
}

function setActiveCategoryLi(cat){
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  const active = document.querySelector(`.sidebar li[data-cat="${cat}"]`);
  if(active) active.classList.add("active");
}

function setupCategories(){
  document.querySelectorAll(".sidebar li[data-cat]").forEach(li=>{
    li.addEventListener("click", ()=>{
      const cat = li.getAttribute("data-cat");
      currentCat = cat || "all";
      setActiveCategoryLi(currentCat);
      renderProducts();
    });
  });
}

function setupSearch(){
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");

  if(btn){
    btn.addEventListener("click", ()=>{
      currentQuery = input ? input.value : "";
      renderProducts();
    });
  }

  if(input){
    input.addEventListener("keydown", (e)=>{
      if(e.key === "Enter"){
        currentQuery = input.value;
        renderProducts();
      }
    });
  }
}

// ---- init ----
document.addEventListener("DOMContentLoaded", ()=>{
  updateCartCount();
  setupCategories();
  setupSearch();
  // default active
  setActiveCategoryLi("all");
  renderProducts();
});
