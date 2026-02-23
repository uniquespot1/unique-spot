// ===== Unique Spot - script.js (FULL) =====

// ✅ Your WhatsApp number (Sri Lanka) - no + sign
const SHOP_WHATSAPP = "94776939483";

// ===== Products Data =====
// NOTE: The img path must be correct: images/filename.png.png
const PRODUCTS = [
  { id: 1, name: "Smart Watch", price: 8500, cat: "smartwatches", img: "images/smartwatch.jpg" },
  { id: 2, name: "Wireless Headphones", price: 3500, cat: "electronics", img: "images/headphones.jpg" },
  { id: 3, name: "Mobile Phone", price: 65000, cat: "mobilephones", img: "images/mobile.jpg" },
  { id: 4, name: "Bluetooth Speaker", price: 6000, cat: "electronics", img: "images/speaker.jpg" },
  { id: 5, name: "Gaming Mouse", price: 2500, cat: "gaming", img: "images/mouse.jpg" },
  { id: 6, name: "T-Shirt", price: 2900, cat: "fashion", img: "images/tshirt.jpg" },
  { id: 7, name: "Face Cream", price: 1800, cat: "beauty", img: "images/facecream.jpg" },
  { id: 8, name: "Laptop Bag", price: 4500, cat: "fashion", img: "images/laptopbag.jpg" },
  { id: 9, name: "Power Bank", price: 5200, cat: "electronics", img: "images/powerbank.jpg" },
  { id: 10, name: "Home Lamp", price: 3900, cat: "homeitems", img: "images/homelamp.jpg" },
];

// ===== Helpers =====
function moneyRs(n){
  try {
    return "Rs. " + Number(n).toLocaleString("en-LK");
  } catch {
    return "Rs. " + n;
  }
}

function loadCart(){
  try {
    return JSON.parse(localStorage.getItem("cart_items") || "[]");
  } catch {
    return [];
  }
}

function saveCart(items){
  localStorage.setItem("cart_items", JSON.stringify(items));
}

function setCartCount(){
  const badge = document.getElementById("cartCount");
  if(!badge) return;
  const cart = loadCart();
  const totalQty = cart.reduce((s, it) => s + (it.qty || 1), 0);
  badge.textContent = totalQty;
}

// ===== Cart Actions =====
function addToCart(productId){
  const cart = loadCart();
  const found = cart.find(x => x.id === productId);

  if(found){
    found.qty = (found.qty || 1) + 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  setCartCount();
  alert("Added to cart ✅");
}

// ===== Render Products =====
function renderProducts(list){
  const box = document.getElementById("productList");
  if(!box) return;

  box.innerHTML = "";

  // If empty
  if(!list.length){
    box.innerHTML = `<div class="empty">No products found.</div>`;
    return;
  }

  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" onerror="this.src='images/placeholder.png'">
      <h4 style="color:#111;">${p.name}</h4>
      <p style="color:#111;">${moneyRs(p.price)}</p>

      <div style="display:flex; gap:10px; margin-top:6px;">
        <button class="btn primary-btn" type="button" data-add="${p.id}">
          Add to Cart
        </button>

        <button class="btn wa-mini" type="button" data-wa="${p.id}">
          WhatsApp Order
        </button>
      </div>
    `;
    box.appendChild(card);
  });
}

// ===== Filters =====
let activeCat = "all";

function applyFilters(){
  const searchInput = document.getElementById("searchInput");
  const q = (searchInput ? searchInput.value : "").trim().toLowerCase();

  let filtered = PRODUCTS.slice();

  if(activeCat !== "all"){
    filtered = filtered.filter(p => p.cat === activeCat);
  }

  if(q){
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }

  renderProducts(filtered);
}

// ===== WhatsApp Single-Product Quick Order =====
function openWhatsAppOrder(product){
  const msg =
`🛒 *Unique Spot - Quick Order*
📦 Product: *${product.name}*
💰 Price: *${moneyRs(product.price)}*

✅ Please send:
1) Name
2) Phone
3) Address
4) District / City

Payment: Cash on Delivery / Bank Transfer`;

  window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", ()=>{
  setCartCount();
  renderProducts(PRODUCTS);

  // Category click
  document.querySelectorAll(".sidebar li").forEach(li=>{
    li.addEventListener("click", ()=>{
      document.querySelectorAll(".sidebar li").forEach(x=>x.classList.remove("active"));
      li.classList.add("active");
      activeCat = li.getAttribute("data-cat") || "all";
      applyFilters();
    });
  });

  // Search
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if(searchBtn){
    searchBtn.addEventListener("click", applyFilters);
  }
  if(searchInput){
    searchInput.addEventListener("keyup", (e)=>{
      if(e.key === "Enter") applyFilters();
    });
  }

  // Buttons (event delegation)
  const productList = document.getElementById("productList");
  if(productList){
    productList.addEventListener("click", (e)=>{
      const addBtn = e.target.closest("button[data-add]");
      if(addBtn){
        const id = Number(addBtn.getAttribute("data-add"));
        addToCart(id);
        return;
      }

      const waBtn = e.target.closest("button[data-wa]");
      if(waBtn){
        const id = Number(waBtn.getAttribute("data-wa"));
        const p = PRODUCTS.find(x => x.id === id);
        if(p) openWhatsAppOrder(p);
      }
    });
  }
});
