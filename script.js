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

  box.addEventListener("click", (e)=>{
    // Add to Cart
    const addBtn = e.target.closest("button[data-add]");
    if(addBtn){
      const id = Number(addBtn.getAttribute("data-add"));
      addToCart(id);
      return;
    }

    // WhatsApp Order (single product)
    const waBtn = e.target.closest("button[data-wa]");
    if(waBtn){
      const id = Number(waBtn.getAttribute("data-wa"));
      const p = PRODUCTS.find(x => x.id === id);
      if(!p) return;

      const msg =
`🛒 *Unique Spot - Quick Order*
📦 Product: *${p.name}*
💰 Price: *${moneyRs(p.price)}*

✅ Please send:
1) Name
2) Phone
3) Address
4) District / City

Payment: Cash on Delivery / Bank Transfer`;

      window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
      return;
    }
  }, { once:false });
}
