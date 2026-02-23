/* =========================
   UNIQUE SPOT - script.js
   ========================= */

const WA_NUMBER = "94776939483";

/* PRODUCTS DATA (நீங்க அதிகம் add பண்ணலாம்) */
const products = [
  { id: 1, name: "Smart Watch", price: 8500,  cat: "smartwatches", img: "images/products/watch.jpg" },
  { id: 2, name: "Wireless Headphones", price: 3500, cat: "electronics", img: "images/products/headphones.jpg" },
  { id: 3, name: "Mobile Phone", price: 65000, cat: "mobilephones", img: "images/products/mobile.jpg" },
  { id: 4, name: "Bluetooth Speaker", price: 6000, cat: "electronics", img: "images/products/speaker.jpg" },
  { id: 5, name: "Gaming Mouse", price: 2500, cat: "gaming", img: "images/products/mouse.jpg" },
  { id: 6, name: "T-Shirt", price: 2900, cat: "fashion", img: "images/products/tshirt.jpg" },
  { id: 7, name: "Face Cream", price: 1800, cat: "beauty", img: "images/products/cream.jpg" },
  { id: 8, name: "Laptop Bag", price: 4500, cat: "electronics", img: "images/products/bag.jpg" },
  { id: 9, name: "Power Bank", price: 5200, cat: "electronics", img: "images/products/powerbank.jpg" },
  { id: 10, name: "Home Lamp", price: 3900, cat: "homeitems", img: "images/products/lamp.jpg" }
];

/* STATE */
let activeCategory = "all";
let searchText = "";

/* ELEMENTS */
const productList = document.getElementById("productList");
const cartCountEl = document.getElementById("cartCount");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

/* ============ HELPERS ============ */
function formatLKR(amount) {
  // Rs. 65,000 format
  return "Rs. " + Number(amount).toLocaleString("en-LK");
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCountEl) cartCountEl.textContent = totalQty;
}

function buildWhatsAppLink(product) {
  const msg =
    `Hello Unique Spot,%0A` +
    `I want to order:%0A` +
    `Product: ${product.name}%0A` +
    `Price: ${formatLKR(product.price)}%0A%0A` +
    `Please confirm availability.`;
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

/* ============ RENDER PRODUCTS ============ */
function renderProducts() {
  if (!productList) return;

  let list = [...products];

  // category filter
  if (activeCategory !== "all") {
    list = list.filter(p => p.cat === activeCategory);
  }

  // search filter
  if (searchText.trim() !== "") {
    const q = searchText.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }

  // render html
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML = `<div class="empty">No products found.</div>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    // image fallback (image missing இருந்தால்)
    const imgSrc = p.img || "https://via.placeholder.com/300x200?text=Product";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Product'">
      <h4>${p.name}</h4>
      <p>${formatLKR(p.price)}</p>

      <div class="card-actions">
        <button class="btn primary-btn" data-add="${p.id}">Add to Cart</button>
        <a class="wa-link" href="${buildWhatsAppLink(p)}" target="_blank">
          <button class="btn whatsapp-btn" type="button">WhatsApp Order</button>
        </a>
      </div>
    `;

    productList.appendChild(card);
  });

  // attach add-to-cart events
  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-add"));
      addToCart(id);
    });
  });
}

/* ============ CART LOGIC ============ */
function addToCart(productId) {
  const cart = getCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }

  saveCart(cart);

  // small feedback
  alert(`${product.name} added to cart ✅`);
}

/* ============ CATEGORY CLICK (SIDEBAR) ============ */
function setupCategoryClicks() {
  const cats = document.querySelectorAll(".sidebar li[data-cat]");
  if (!cats.length) return;

  cats.forEach(li => {
    li.addEventListener("click", () => {
      // active class change
      cats.forEach(x => x.classList.remove("active"));
      li.classList.add("active");

      activeCategory = li.getAttribute("data-cat");
      renderProducts();
    });
  });
}

/* ============ SEARCH ============ */
function setupSearch() {
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      searchText = searchInput ? searchInput.value : "";
      renderProducts();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        searchText = searchInput.value;
        renderProducts();
      }
    });
  }
}

/* ============ INIT ============ */
function init() {
  updateCartCount();
  setupCategoryClicks();
  setupSearch();
  renderProducts();
}

init();
