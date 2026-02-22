/* ==============================
   UNIQUE SPOT - SCRIPT
   Cart + Category + Search + WhatsApp Order
============================== */

const SHOP_WHATSAPP = "94776939483"; // ✅ your number

// Sample products (உன் admin panel மூலம் update பண்ணலாம்)
let PRODUCTS = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "Smart Watch", price: 8500, cat: "smartwatches", img: "images/watch.jpg" },
  { id: 2, name: "Wireless Headphones", price: 3500, cat: "electronics", img: "images/headphone.jpg" },
  { id: 3, name: "Mobile Phone", price: 65000, cat: "mobilephones", img: "images/phone.jpg" },
  { id: 4, name: "Bluetooth Speaker", price: 6000, cat: "electronics", img: "images/speaker.jpg" },
  { id: 5, name: "Gaming Mouse", price: 2500, cat: "gaming", img: "images/mouse.jpg" },
  { id: 6, name: "T-Shirt", price: 2900, cat: "fashion", img: "images/tshirt.jpg" },
  { id: 7, name: "Face Cream", price: 1800, cat: "beauty", img: "images/cream.jpg" },
  { id: 8, name: "Laptop Bag", price: 4500, cat: "fashion", img: "images/bag.jpg" },
  { id: 9, name: "Power Bank", price: 5200, cat: "electronics", img: "images/powerbank.jpg" },
  { id: 10, name: "Home Lamp", price: 3900, cat: "homeitems", img: "images/lamp.jpg" },
];

localStorage.setItem("products", JSON.stringify(PRODUCTS));

const DELIVERY_DATA = {
  Colombo:   { fee: 350, cities: ["Colombo 01","Colombo 02","Dehiwala","Maharagama","Nugegoda"] },
  Gampaha:   { fee: 450, cities: ["Negombo","Wattala","Ja-Ela","Kadawatha","Gampaha"] },
  Kalutara:  { fee: 500, cities: ["Panadura","Kalutara","Beruwala"] },
  Kandy:     { fee: 550, cities: ["Kandy","Peradeniya","Katugastota"] },
  Galle:     { fee: 600, cities: ["Galle","Hikkaduwa"] },
  Matara:    { fee: 650, cities: ["Matara","Weligama"] },
  Jaffna:    { fee: 900, cities: ["Jaffna","Nallur"] },
  Batticaloa:{ fee: 850, cities: ["Batticaloa","Kattankudy"] },
  Trincomalee:{ fee: 850, cities: ["Trincomalee","Kinniya"] },
  Other:     { fee: 800, cities: ["Other"] }
};

function moneyRs(n){
  return "Rs. " + Number(n || 0).toLocaleString("en-LK");
}

/* ===== CART HELPERS ===== */
function getCart(){
  try { return JSON.parse(localStorage.getItem("cart")) || []; }
  catch(e){ return []; }
}
function setCart(items){
  localStorage.setItem("cart", JSON.stringify(items || []));
  updateCartCountBadge();
}
function updateCartCountBadge(){
  const cart = getCart();
  const count = cart.reduce((a,i)=>a + (Number(i.qty)||1), 0);
  const el = document.getElementById("cartCount");
  if(el) el.textContent = count;
}

/* ===== PRODUCTS RENDER (INDEX) ===== */
function renderProducts(list){
  const box = document.getElementById("productList");
  if(!box) return;

  box.innerHTML = "";
  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4 style="color:#111;">${p.name}</h4>
      <p style="color:#111;">${moneyRs(p.price)}</p>
      <button class="btn primary-btn" type="button" data-add="${p.id}">Add to Cart</button>
    `;
    box.appendChild(card);
  });

  box.addEventListener("click", (e)=>{
    const btn = e.target.closest("button[data-add]");
    if(!btn) return;
    const id = Number(btn.getAttribute("data-add"));
    addToCart(id);
  }, { once:false });
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;

  const cart = getCart();
  const found = cart.find(x=>x.id===id);
  if(found) found.qty = Number(found.qty||1) + 1;
  else cart.push({ ...p, qty: 1 });

  setCart(cart);
  alert("Added to cart ✅");
}

/* ===== CATEGORY FILTER ===== */
function bindCategories(){
  const sidebar = document.querySelector(".sidebar ul");
  if(!sidebar) return;

  sidebar.addEventListener("click", (e)=>{
    const li = e.target.closest("li[data-cat]");
    if(!li) return;

    sidebar.querySelectorAll("li").forEach(x=>x.classList.remove("active"));
    li.classList.add("active");

    const cat = li.getAttribute("data-cat");
    if(cat === "all") renderProducts(PRODUCTS);
    else renderProducts(PRODUCTS.filter(p=>p.cat===cat));
  });
}

/* ===== SEARCH ===== */
function bindSearch(){
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  if(!input || !btn) return;

  btn.addEventListener("click", ()=>{
    const q = input.value.trim().toLowerCase();
    if(!q) return renderProducts(PRODUCTS);
    renderProducts(PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)));
  });

  input.addEventListener("keydown", (e)=>{
    if(e.key === "Enter") btn.click();
  });
}

/* ===== ORDER ID ===== */
function generateOrderId(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  const rand = Math.random().toString(36).slice(2,7).toUpperCase();
  return `US-${y}${m}${day}-${rand}`;
}

/* ===== CART PAGE ===== */
function renderCartPage(){
  const cartItemsEl = document.getElementById("cartItems");
  if(!cartItemsEl) return;

  const emptyEl = document.getElementById("emptyCart");
  const cart = getCart();

  cartItemsEl.innerHTML = "";

  if(cart.length === 0){
    if(emptyEl) emptyEl.style.display = "block";
  }else{
    if(emptyEl) emptyEl.style.display = "none";
    cart.forEach((p, idx)=>{
      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div class="info">
          <h4 style="color:#111;">${p.name}</h4>
          <div class="price" style="color:#111;">${moneyRs(p.price)}</div>
        </div>
        <div class="qty">
          <button type="button" data-act="minus" data-idx="${idx}">-</button>
          <span style="color:#111;">${p.qty}</span>
          <button type="button" data-act="plus" data-idx="${idx}">+</button>
        </div>
        <button type="button" class="remove-btn" data-act="remove" data-idx="${idx}">Remove</button>
      `;
      cartItemsEl.appendChild(item);
    });
  }

  cartItemsEl.addEventListener("click", (e)=>{
    const btn = e.target.closest("button");
    if(!btn) return;
    const act = btn.getAttribute("data-act");
    const idx = Number(btn.getAttribute("data-idx"));
    const cart = getCart();
    if(!cart[idx]) return;

    if(act==="minus") cart[idx].qty = Math.max(1, Number(cart[idx].qty)-1);
    if(act==="plus") cart[idx].qty = Number(cart[idx].qty)+1;
    if(act==="remove") cart.splice(idx,1);

    setCart(cart);
    renderCartPage();
    updateTotalsOnCart();
  }, { once:false });

  const orderBox = document.getElementById("orderIdBox");
  if(orderBox){
    let oid = sessionStorage.getItem("orderId");
    if(!oid){
      oid = generateOrderId();
      sessionStorage.setItem("orderId", oid);
    }
    orderBox.textContent = "Order ID: " + oid;
  }

  const district = document.getElementById("districtSelect");
  const city = document.getElementById("citySelect");

  if(district && city){
    district.addEventListener("change", ()=>{
      city.innerHTML = `<option value="">Select City</option>`;
      const d = district.value;
      if(DELIVERY_DATA[d]){
        DELIVERY_DATA[d].cities.forEach(c=>{
          const opt = document.createElement("option");
          opt.value = c;
          opt.textContent = c;
          city.appendChild(opt);
        });
      }
      updateTotalsOnCart();
    });
    city.addEventListener("change", updateTotalsOnCart);
  }

  const bankDetails = document.getElementById("bankDetails");
  document.querySelectorAll('input[name="pay"]').forEach(r=>{
    r.addEventListener("change", ()=>{
      const val = document.querySelector('input[name="pay"]:checked')?.value;
      if(bankDetails) bankDetails.style.display = (val==="Bank Transfer") ? "block" : "none";
    });
  });

  const clearBtn = document.getElementById("clearCartBtn");
  if(clearBtn){
    clearBtn.addEventListener("click", ()=>{
      setCart([]);
      renderCartPage();
      updateTotalsOnCart();
    });
  }

  const waBtn = document.getElementById("waOrderBtn");
  if(waBtn) waBtn.addEventListener("click", sendWhatsAppOrder);

  updateTotalsOnCart();
}

function getDeliveryFee(){
  const d = document.getElementById("districtSelect")?.value || "";
  return Number(DELIVERY_DATA[d]?.fee || 0);
}

function updateTotalsOnCart(){
  const cart = getCart();
  const sub = cart.reduce((a,p)=> a + (Number(p.price)*Number(p.qty)), 0);
  const fee = getDeliveryFee();
  const grand = sub + fee;

  const subEl = document.getElementById("subTotal");
  const feeEl = document.getElementById("deliveryFee");
  const grandEl = document.getElementById("grandTotal");

  if(subEl) subEl.textContent = moneyRs(sub);
  if(feeEl) feeEl.textContent = moneyRs(fee);
  if(grandEl) grandEl.textContent = moneyRs(grand);
}

function sendWhatsAppOrder(){
  const cart = getCart();
  if(cart.length === 0) return alert("Cart is empty!");

  const name = (document.getElementById("cusName")?.value || "").trim();
  const phone = (document.getElementById("cusPhone")?.value || "").trim();
  const address = (document.getElementById("cusAddress")?.value || "").trim();
  const district = (document.getElementById("districtSelect")?.value || "").trim();
  const city = (document.getElementById("citySelect")?.value || "").trim();
  const payment = document.querySelector('input[name="pay"]:checked')?.value || "Cash on Delivery";

  if(!name || !phone || !address || !district){
    alert("Please fill Name, Phone, Address and District!");
    return;
  }

  const orderId = sessionStorage.getItem("orderId") || generateOrderId();
  sessionStorage.setItem("orderId", orderId);

  const sub = cart.reduce((a,p)=> a + (Number(p.price)*Number(p.qty)), 0);
  const fee = getDeliveryFee();
  const grand = sub + fee;

  let items = "";
  cart.forEach((p,i)=>{
    items += `${i+1}) ${p.name} x${p.qty} = ${moneyRs(Number(p.price)*Number(p.qty))}\n`;
  });

  const msg =
`🛒 *Unique Spot - New Order*
🆔 Order ID: *${orderId}*

👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}
🏙 District: ${district}
🏘 City: ${city || "-"}

💳 Payment: *${payment}*

📦 Items:
${items}
Subtotal: ${moneyRs(sub)}
Delivery Fee: ${moneyRs(fee)}
*Grand Total: ${moneyRs(grand)}*

✅ Please confirm availability & delivery time.`;

  window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", ()=>{
  updateCartCountBadge();
  renderProducts(PRODUCTS);
  bindCategories();
  bindSearch();
  renderCartPage();
});
