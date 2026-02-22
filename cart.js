// ==== CONFIG: உங்கள் WhatsApp number (country code உடன்) ====
// Sri Lanka example: 9477XXXXXXX  (0 போடாதே)
const WHATSAPP_NUMBER = "94776939483"; // <-- இதை உன் number-ஆ மாற்று

// ✅ Must login to access cart
function getSession(){
  try { return JSON.parse(localStorage.getItem("sessionUser")); }
  catch { return null; }
}
const sessionNow = getSession();
if(!sessionNow){
  alert("Cart பார்க்க Login/Register வேண்டும் ✅");
  window.location.href = "login.html";
}

// ===== DELIVERY FEES (Edit as you like) =====
const DELIVERY_FEES = {
  NEGOMBO: 300,
  COLOMBO: 450,
  GAMPAHA: 400,
  KANDY: 700,
  KURUNEGALA: 650,
  KALUTARA: 550,
  JAFFNA: 1200,
  BATTICALOA: 1100
};

function getSelectedArea(){
  const el = document.getElementById("deliveryArea");
  return el ? el.value : "NEGOMBO";
}

// ===== Orders storage for delivered->review control =====
function getOrders(){
  try { return JSON.parse(localStorage.getItem("orders")) || []; } catch { return []; }
}
function saveOrders(orders){
  localStorage.setItem("orders", JSON.stringify(orders));
}

function getCart(){
  try { return JSON.parse(localStorage.getItem("cart")) || []; }
  catch { return []; }
}
function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById("cartCount");
  if(el) el.textContent = count;
}

// Products for cart calculations
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

function findProduct(id){
  return products.find(p=>p.id===id);
}

const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const itemsTotalEl = document.getElementById("itemsTotal");
const deliveryFeeEl = document.getElementById("deliveryFee");
const grandTotalEl = document.getElementById("grandTotal");

const clearCartBtn = document.getElementById("clearCartBtn");
const waOrderBtn = document.getElementById("waOrderBtn");

function money(n){ return "Rs. " + Number(n).toLocaleString(); }

// ===== PAYMENT UI =====
function getSelectedPayment(){
  const selected = document.querySelector('input[name="payMethod"]:checked');
  return selected ? selected.value : "COD";
}
function updateBankUI(){
  const method = getSelectedPayment();
  const bankBox = document.getElementById("bankDetails");
  if(bankBox) bankBox.style.display = (method === "BANK") ? "block" : "none";
}
document.querySelectorAll('input[name="payMethod"]').forEach(r=>{
  r.addEventListener("change", updateBankUI);
});
updateBankUI();

// ===== Order ID =====
function generateOrderId(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  const rand = Math.floor(1000 + Math.random()*9000);
  return `US-${y}${m}${day}-${hh}${mm}-${rand}`;
}
const orderIdTextEl = document.getElementById("orderIdText");
let ORDER_ID = generateOrderId();
if(orderIdTextEl) orderIdTextEl.textContent = ORDER_ID;

function calcTotals(cart){
  const itemsTotal = cart.reduce((sum, it) => {
    const p = findProduct(it.id);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);

  const area = getSelectedArea();
  const delivery = itemsTotal > 0 ? (DELIVERY_FEES[area] ?? 0) : 0;
  const grand = itemsTotal + delivery;

  return { itemsTotal, delivery, grand, area };
}

function renderCart(){
  const cart = getCart();
  updateCartBadge();

  if(!cartItemsEl) return;

  if(cart.length === 0){
    cartItemsEl.innerHTML = "";
    if(cartEmptyEl) cartEmptyEl.style.display = "block";
    if(itemsTotalEl) itemsTotalEl.textContent = money(0);
    if(deliveryFeeEl) deliveryFeeEl.textContent = money(0);
    if(grandTotalEl) grandTotalEl.textContent = money(0);
    return;
  }

  if(cartEmptyEl) cartEmptyEl.style.display = "none";
  cartItemsEl.innerHTML = "";

  cart.forEach(it => {
    const p = findProduct(it.id);
    if(!p) return;

    const lineTotal = p.price * it.qty;

    cartItemsEl.innerHTML += `
      <div class="cart-item" data-id="${it.id}">
        <img src="${p.img}" alt="${p.name}" />
        <div class="info">
          <h4>${p.name}</h4>
          <div class="price">${money(p.price)} x ${it.qty} = ${money(lineTotal)}</div>
        </div>

        <div class="qty">
          <button class="minus">-</button>
          <span>${it.qty}</span>
          <button class="plus">+</button>
        </div>

        <button class="remove-btn remove">Remove</button>
      </div>
    `;
  });

  // totals
  const t = calcTotals(cart);
  itemsTotalEl.textContent = money(t.itemsTotal);
  deliveryFeeEl.textContent = money(t.delivery);
  grandTotalEl.textContent = money(t.grand);

  // events
  document.querySelectorAll(".cart-item .plus").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const id = Number(e.target.closest(".cart-item").dataset.id);
      changeQty(id, +1);
    });
  });
  document.querySelectorAll(".cart-item .minus").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const id = Number(e.target.closest(".cart-item").dataset.id);
      changeQty(id, -1);
    });
  });
  document.querySelectorAll(".cart-item .remove").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const id = Number(e.target.closest(".cart-item").dataset.id);
      removeItem(id);
    });
  });
}

function changeQty(id, delta){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;

  item.qty += delta;
  if(item.qty <= 0){
    const idx = cart.findIndex(i=>i.id===id);
    if(idx>=0) cart.splice(idx,1);
  }
  saveCart(cart);
  renderCart();
}

function removeItem(id){
  const cart = getCart().filter(i=>i.id!==id);
  saveCart(cart);
  renderCart();
}

if(clearCartBtn){
  clearCartBtn.addEventListener("click", ()=>{
    localStorage.removeItem("cart");
    renderCart();
  });
}

function buildWhatsAppMessage(){
  const cart = getCart();
  const name = (document.getElementById("custName")?.value || "").trim();
  const addr = (document.getElementById("custAddress")?.value || "").trim();
  const phone = (document.getElementById("custPhone")?.value || "").trim();

  const t = calcTotals(cart);

  const payMethod = getSelectedPayment();
  const payText = (payMethod === "BANK") ? "Bank Transfer" : "Cash on Delivery (COD)";

  let lines = [];
  lines.push("🛒 *New Order - Unique-Spot*");
  lines.push(`🧾 Order ID: *${ORDER_ID}*`);
  lines.push(`🚚 Delivery Area: ${t.area}`);
  lines.push(`💳 Payment: ${payText}`);

  if(name) lines.push(`👤 Name: ${name}`);
  if(phone) lines.push(`📞 Phone: ${phone}`);
  if(addr) lines.push(`📍 Address: ${addr}`);

  if(payMethod === "BANK"){
    lines.push("");
    lines.push("🏦 Bank Details:");
    lines.push("Bank: People’s Bank");
    lines.push("Account Name: Unique Spot");
    lines.push("Account No: 1234567890");
    lines.push("Branch: Negombo");
    lines.push("➡️ Transfer செய்து receipt screenshot அனுப்புகிறேன்.");
  }

  lines.push("");
  lines.push("*Items:*");

  cart.forEach(it=>{
    const p = findProduct(it.id);
    if(!p) return;
    lines.push(`- ${p.name} x ${it.qty} = Rs. ${(p.price*it.qty).toLocaleString()}`);
  });

  lines.push("");
  lines.push(`Items Total: Rs. ${t.itemsTotal.toLocaleString()}`);
  lines.push(`Delivery: Rs. ${t.delivery.toLocaleString()}`);
  lines.push(`*Grand Total: Rs. ${t.grand.toLocaleString()}*`);

  return { text: lines.join("\n"), totals: t, paymentText: payText };
}

if(waOrderBtn){
  waOrderBtn.addEventListener("click", ()=>{
    // MUST LOGIN already enforced (cart page redirect)
    const cart = getCart();
    if(cart.length === 0){
      alert("Cart empty 😅");
      return;
    }

    if(!WHATSAPP_NUMBER || WHATSAPP_NUMBER === "94770000000"){
      alert("cart.js ல WHATSAPP_NUMBER change பண்ணு (உன் number).");
      return;
    }

    // Save order history for delivered->review control
    const session = getSession();
    const result = buildWhatsAppMessage();
    const cartNow = getCart();

    const orderRecord = {
      orderId: ORDER_ID,
      userEmail: session.email,
      area: result.totals.area,
      payment: result.paymentText,
      itemsTotal: result.totals.itemsTotal,
      deliveryFee: result.totals.delivery,
      grandTotal: result.totals.grand,
      status: "placed",
      createdAt: Date.now(),
      items: cartNow.map(it=>{
        const p = findProduct(it.id);
        return { id: it.id, name: p?.name || "Item", qty: it.qty };
      })
    };
    const orders = getOrders();
    orders.push(orderRecord);
    saveOrders(orders);

    // Open WhatsApp
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(result.text)}`;
    window.open(url, "_blank");

    // New Order ID for next order
    ORDER_ID = generateOrderId();
    if(orderIdTextEl) orderIdTextEl.textContent = ORDER_ID;
  });
}

// Delivery dropdown change => totals refresh
const deliveryAreaEl = document.getElementById("deliveryArea");
if(deliveryAreaEl){
  deliveryAreaEl.addEventListener("change", ()=> renderCart());
}

// Auto fill from session
const session = getSession();
if(session){
  const nameEl = document.getElementById("custName");
  const phoneEl = document.getElementById("custPhone");
  const addrEl = document.getElementById("custAddress");

  if(nameEl && !nameEl.value) nameEl.value = session.name || "";
  if(phoneEl && !phoneEl.value) phoneEl.value = session.phone || "";
  if(addrEl && !addrEl.value) addrEl.value = session.address || "";
}

// init
renderCart();

updateCartBadge();
