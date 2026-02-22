function getSession(){
  try { return JSON.parse(localStorage.getItem("sessionUser")); } catch { return null; }
}
function getOrders(){
  try { return JSON.parse(localStorage.getItem("orders")) || []; } catch { return []; }
}
function saveOrders(orders){
  localStorage.setItem("orders", JSON.stringify(orders));
}

const session = getSession();
if(!session){
  alert("Orders பார்க்க Login/Register வேண்டும் ✅");
  window.location.href = "login.html";
}

const ordersList = document.getElementById("ordersList");
const ordersEmpty = document.getElementById("ordersEmpty");

function money(n){ return "Rs. " + Number(n).toLocaleString(); }

function render(){
  const all = getOrders();
  const mine = all.filter(o => (o.userEmail||"") === (session.email||""));

  if(mine.length === 0){
    ordersEmpty.style.display = "block";
    ordersList.innerHTML = "";
    return;
  }
  ordersEmpty.style.display = "none";
  ordersList.innerHTML = "";

  mine.slice().reverse().forEach(o=>{
    const itemsHtml = o.items.map(it => `• ${it.name} x ${it.qty}`).join("<br/>");

    ordersList.innerHTML += `
      <div class="order-card" data-id="${o.orderId}">
        <div class="order-head">
          <div><b>Order ID:</b> ${o.orderId}</div>
          <div class="status ${o.status}">${o.status.toUpperCase()}</div>
        </div>

        <div class="order-body">
          <div><b>Area:</b> ${o.area}</div>
          <div><b>Payment:</b> ${o.payment}</div>
          <div style="margin-top:8px">${itemsHtml}</div>
        </div>

        <div class="order-foot">
          <div><b>Total:</b> ${money(o.grandTotal)}</div>
          ${
            o.status !== "delivered"
              ? `<button class="btn ok-btn markDelivered">✅ Delivered / Received</button>`
              : `<div class="muted">Now you can review delivered products ✅</div>`
          }
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".markDelivered").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      const card = e.target.closest(".order-card");
      const id = card.dataset.id;

      const orders = getOrders();
      const idx = orders.findIndex(x => x.orderId === id && x.userEmail === session.email);
      if(idx >= 0){
        orders[idx].status = "delivered";
        saveOrders(orders);
        alert("Marked as Delivered ✅ Now you can review products!");
        render();
      }
    });
  });
}

render();