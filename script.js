// ========= PRODUCTS (10) =========
const products = [
  { id: 1, name: "Smart Watch", price: 8500, img: "images/watch.jpg", cat: "smartwatches", tags: "watch smart" },
  { id: 2, name: "Headphones", price: 3500, img: "images/headphone.jpg", cat: "electronics", tags: "headphone headset" },
  { id: 3, name: "Mobile Phone", price: 65000, img: "images/phone.jpg", cat: "mobilephones", tags: "phone mobile smartphone" },
  { id: 4, name: "Bluetooth Speaker", price: 6000, img: "images/speaker.jpg", cat: "electronics", tags: "speaker bluetooth" },
  { id: 5, name: "Gaming Mouse", price: 2500, img: "images/mouse.jpg", cat: "gaming", tags: "mouse gaming" },
  { id: 6, name: "T-Shirt", price: 2200, img: "images/tshirt.jpg", cat: "fashion", tags: "tshirt fashion" },
  { id: 7, name: "Face Cream", price: 1800, img: "images/cream.jpg", cat: "beauty", tags: "cream beauty" },
  { id: 8, name: "Laptop Bag", price: 4500, img: "images/bag.jpg", cat: "fashion", tags: "bag laptop" },
  { id: 9, name: "Power Bank", price: 5000, img: "images/powerbank.jpg", cat: "electronics", tags: "powerbank charger" },
  { id: 10, name: "Home Lamp", price: 3200, img: "images/lamp.jpg", cat: "homeitems", tags: "lamp home" }
];

// ========= CART STORAGE =========
function getCart(){
  try { return JSON.parse(localStorage.getItem("cart")) || []; }
  catch { return []; }
}
function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
}
function cartCount(){
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
function updateCartBadge(){
  const el = document.getElementById("cartCount");
  if(el) el.textContent = cartCount();
}

// ========= SESSION / ORDERS / REVIEWS =========
function getSession(){
  try { return JSON.parse(localStorage.getItem("sessionUser")); }
  catch { return null; }
}
function clearSession(){
  localStorage.removeItem("sessionUser");
}
function getOrders(){
  try { return JSON.parse(localStorage.getItem("orders")) || []; } catch { return []; }
}
function getReviews(){
  try { return JSON.parse(localStorage.getItem("reviews")) || []; } catch { return []; }
}
function saveReviews(r){ localStorage.setItem("reviews", JSON.stringify(r)); }

function canReviewProduct(productId){
  const session = getSession();
  if(!session) return false;
  const orders = getOrders().filter(o => o.userEmail === session.email && o.status === "delivered");
  return orders.some(o => (o.items||[]).some(it => it.id === productId));
}

function findMyReview(productId){
  const session = getSession();
  if(!session) return null;
  const reviews = getReviews();
  return reviews.find(r => r.productId === productId && r.email === session.email) || null;
}

function starsDecimal(n){
  const full = Math.floor(n);
  const empty = 5 - full;
  return "★".repeat(full) + "☆".repeat(empty);
}

// ========= PRODUCT DETAILS OPEN =========
function openProduct(id){
  window.location.href = "product.html?id=" + id;
}

// ========= RENDER PRODUCTS =========
const productList = document.getElementById("productList");

function renderProducts(list){
  if(!productList) return;
  productList.innerHTML = "";

  list.forEach(p => {
    productList.innerHTML += `
      <div class="card" onclick="openProduct(${p.id})" data-id="${p.id}">
        <img src="${p.img}" alt="${p.name}" />
        <h4>${p.name}</h4>
        <p>Rs. ${p.price.toLocaleString()}</p>
        <button class="btn primary-btn addBtn" onclick="event.stopPropagation();">Add to Cart</button>

        <div class="review-box" data-pid="${p.id}">
          <div class="stars" id="avg-${p.id}">No rating yet</div>
          <div class="muted" id="count-${p.id}">0 reviews</div>
          <div id="list-${p.id}"></div>
          <div class="review-actions">
            <button class="small-btn primary writeReview" data-id="${p.id}" style="display:none;">Write Review</button>
          </div>
        </div>
      </div>
    `;
  });

  // Add to cart
  document.querySelectorAll(".addBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const id = Number(card.dataset.id);
      addToCart(id);
    });
  });

  // Reviews fill + button enable/edit label
  const allReviews = getReviews();

  list.forEach(p=>{
    const pr = allReviews.filter(r => r.productId === p.id);
    const avg = pr.length ? (pr.reduce((s,x)=>s+x.rating,0)/pr.length) : 0;

    const avgEl = document.getElementById(`avg-${p.id}`);
    const countEl = document.getElementById(`count-${p.id}`);
    const listEl = document.getElementById(`list-${p.id}`);

    if(avgEl){
      avgEl.textContent = avg ? `${starsDecimal(avg)}  (${avg.toFixed(1)} / 5)` : "No rating yet";
    }
    if(countEl) countEl.textContent = `${pr.length} reviews`;

    if(listEl){
      const latest = pr.slice().sort((a,b)=>b.createdAt-a.createdAt).slice(0,2);
      listEl.innerHTML = latest.map(r => `
        <div class="review-item">
          <b>${r.name}</b> — ${starsDecimal(r.rating)}<br/>
          ${r.text}
        </div>
      `).join("") || "";
    }

    const btn = document.querySelector(`.writeReview[data-id="${p.id}"]`);
    if(btn){
      if(canReviewProduct(p.id)){
        btn.style.display = "inline-block";
        const myRev = findMyReview(p.id);
        btn.textContent = myRev ? "Edit Review" : "Write Review";
      }else{
        btn.style.display = "none";
      }
    }
  });

  // Write/Edit review
  document.querySelectorAll(".writeReview").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const pid = Number(btn.dataset.id);
      const session = getSession();
      if(!session){
        alert("Login வேண்டும்");
        window.location.href="login.html";
        return;
      }

      let reviews = getReviews();
      const existing = reviews.find(r => r.productId === pid && r.email === session.email);

      let ratingStr = prompt("Rating 1-5 (எத்தனை star?)", existing ? existing.rating : "");
      const rating = Number(ratingStr);
      if(!(rating>=1 && rating<=5)){
        alert("1 முதல் 5 வரை மட்டும்");
        return;
      }

      let text = prompt("Review எழுதுங்க:", existing ? existing.text : "");
      if(!text || text.trim().length < 2){
        alert("Review எழுதுங்க");
        return;
      }

      if(existing){
        existing.rating = rating;
        existing.text = text.trim();
        existing.createdAt = Date.now();
        alert("Review updated ✅");
      }else{
        reviews.push({
          productId: pid,
          email: session.email,
          name: session.name || "Customer",
          rating,
          text: text.trim(),
          createdAt: Date.now()
        });
        alert("Review added ✅");
      }

      saveReviews(reviews);
      renderProducts(products);
    });
  });
}

function addToCart(productId){
  const cart = getCart();
  const found = cart.find(i => i.id === productId);
  if(found) found.qty += 1;
  else cart.push({id: productId, qty: 1});
  saveCart(cart);
  updateCartBadge();
  alert("Added to cart ✅");
}

// ========= SEARCH =========
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function applySearch(){
  const value = (searchInput?.value || "").toLowerCase().trim();
  if(!value){
    renderProducts(products);
    return;
  }
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value) || p.tags.includes(value)
  );
  renderProducts(filtered);
}

if(searchInput) searchInput.addEventListener("keyup", applySearch);
if(searchBtn) searchBtn.addEventListener("click", applySearch);

// ========= CATEGORY FILTER =========
const categoryItems = document.querySelectorAll(".sidebar li");
categoryItems.forEach(item => {
  item.addEventListener("click", () => {
    categoryItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const cat = item.getAttribute("data-cat");
    if(cat === "all") renderProducts(products);
    else renderProducts(products.filter(p => p.cat === cat));

    if(searchInput) searchInput.value = "";
  });
});

// ========= LOGIN UI =========
function updateLoginUI(){
  const user = getSession();
  const loginLink = document.getElementById("loginLink");
  const userHello = document.getElementById("userHello");
  const logoutBtn = document.getElementById("logoutBtn");
  const accountLink = document.getElementById("accountLink");
  const ordersLink = document.getElementById("ordersLink");

  if(user){
    if(loginLink) loginLink.style.display = "none";
    if(userHello) userHello.textContent = `Hi, ${user.name}`;
    if(logoutBtn) logoutBtn.style.display = "inline";
    if(accountLink) accountLink.style.display = "inline";
    if(ordersLink) ordersLink.style.display = "inline";
  }else{
    if(loginLink) loginLink.style.display = "inline";
    if(userHello) userHello.textContent = "";
    if(logoutBtn) logoutBtn.style.display = "none";
    if(accountLink) accountLink.style.display = "none";
    if(ordersLink) ordersLink.style.display = "none";
  }

  if(logoutBtn){
    logoutBtn.onclick = (e)=>{
      e.preventDefault();
      clearSession();
      updateLoginUI();
      alert("Logged out ✅");
    };
  }
}

// ========= INIT =========
renderProducts(products);
updateCartBadge();
updateLoginUI();
