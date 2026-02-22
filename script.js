/***********************
 Unique Spot - script.js (FULL)
 - Product listing
 - Category filter
 - Search
 - Cart count
 - Add to cart
 - Product click -> product.html?id=...
************************/

/* ✅ Product Data (Rs - Sri Lanka) */
const PRODUCTS = [
  { id:"p1",  name:"Smart Watch",        price:8500,  cat:"smartwatches",  img:"images/watch.jpg" },
  { id:"p2",  name:"Wireless Headphones",price:3500,  cat:"electronics",   img:"images/headphones.jpg" },
  { id:"p3",  name:"Mobile Phone",       price:65000, cat:"mobilephones", img:"images/phone.jpg" },
  { id:"p4",  name:"Bluetooth Speaker",  price:6000,  cat:"electronics",   img:"images/speaker.jpg" },
  { id:"p5",  name:"Gaming Mouse",       price:2500,  cat:"gaming",        img:"images/mouse.jpg" },
  { id:"p6",  name:"T-Shirt",            price:2900,  cat:"fashion",       img:"images/tshirt.jpg" },
  { id:"p7",  name:"Face Cream",         price:1800,  cat:"beauty",        img:"images/cream.jpg" },
  { id:"p8",  name:"Laptop Bag",         price:4500,  cat:"electronics",   img:"images/bag.jpg" },
  { id:"p9",  name:"Power Bank",         price:5200,  cat:"electronics",   img:"images/powerbank.jpg" },
  { id:"p10", name:"Home Lamp",          price:3900,  cat:"homeitems",     img:"images/lamp.jpg" },
];

/* ✅ Helpers */
function money(n){
  return "Rs. " + Number(n).toLocaleString("en-LK");
}

function $(id){ return document.getElementById(id); }

function getCart(){
  try { return JSON.parse(localStorage.getItem("cart")) || []; }
  catch { return []; }
}
function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
}
function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  const el = $("cartCount");
  if(el) el.textContent = count;
}

/* ✅ Add to cart */
function addToCart(productId){
  const cart = getCart();
  const found = cart.find(x => x.id === productId);
  if(found) found.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  saveCart(cart);
  updateCartCount();
  alert("Added to cart ✅");
}

/* ✅ Product lookup */
function findProduct(id){
  return PRODUCTS.find(p => p.id === id) || null;
}

/* ✅ Image fallback if image missing */
function setImageFallback(imgEl, label){
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = "https://via.placeholder.com/400x300?text=" + encodeURIComponent(label || "Unique Spot");
  };
}

/* ✅ State */
let currentCat = "all";
let currentQuery = "";

/* ✅ Render products */
function renderProducts(){
  const wrap = $("productList");
  if(!wrap) return;

  let list = PRODUCTS.slice();

  // category filter
  if(currentCat !== "all"){
    list = list.filter(p => p.cat === currentCat);
  }

  // search filter
  const q = currentQuery.trim().toLowerCase();
  if(q){
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }

  // empty
  if(list.length === 0){
    wrap.innerHTML = `<div class="empty">No products found.</div>`;
    return;
  }

  // render cards
  wrap.innerHTML = list.map(p => `
    <div class="card" data-open="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${money(p.price)}</p>
      <button class="primary-btn" data-add="${p.id}">Add to Cart</button>
    </div>
  `).join("");

  // image fallback
  wrap.querySelectorAll("img").forEach(img => {
    const title = img.getAttribute("alt") || "Unique Spot";
    setImageFallback(img, title);
  });

  // open product page on card click (except button)
  wrap.querySelectorAll(".card[data-open]").forEach(card => {
    card.addEventListener("click", (e) => {
      const isButton = e.target && e.target.matches("[data-add]");
      if(isButton) return;
      const id = card.getAttribute("data-open");
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });
  });

  // add to cart
  wrap.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-add");
      addToCart(id);
    });
  });
}

/* ✅ Sidebar categories */
function setupCategories(){
  const items = document.querySelectorAll(".sidebar li[data-cat]");
  if(!items.length) return;

  items.forEach(li => {
    li.addEventListener("click", () => {
      currentCat = li.getAttribute("data-cat") || "all";

      // active class
      items.forEach(x => x.classList.remove("active"));
      li.classList.add("active");

      renderProducts();
    });
  });
}

/* ✅ Search */
function setupSearch(){
  const input = $("searchInput");
  const btn = $("searchBtn");

  if(btn){
    btn.addEventListener("click", () => {
      currentQuery = input ? input.value : "";
      renderProducts();
    });
  }

  if(input){
    input.addEventListener("keydown", (e) => {
      if(e.key === "Enter"){
        currentQuery = input.value;
        renderProducts();
      }
    });
  }
}

/* ✅ Init */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupCategories();
  setupSearch();
  renderProducts();
});
