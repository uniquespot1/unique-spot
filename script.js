const whatsappNumber = "94776939483";

const products = [
  {
    id: 1,
    name: "Smart Watch",
    price: 8500,
    category: "smartwatches",
    stockType: "own",
    stockStatus: "instock",
    sourceLabel: "Own Stock",
    offer: "Hot Deal",
    image: "images/watch.jpg",
    description: "Premium smart watch with fitness tracking and notifications."
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 3500,
    category: "electronics",
    stockType: "local",
    stockStatus: "limited",
    sourceLabel: "Local Shop",
    offer: "Best Price",
    image: "images/headphones.jpg",
    description: "Comfortable wireless headphones with deep bass sound."
  },
  {
    id: 3,
    name: "Mobile Phone",
    price: 65000,
    category: "mobilephones",
    stockType: "dropshipping",
    stockStatus: "preorder",
    sourceLabel: "Dropshipping",
    offer: "New Arrival",
    image: "images/phone.jpg",
    description: "Latest smartphone with powerful performance and camera."
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 6000,
    category: "electronics",
    stockType: "own",
    stockStatus: "instock",
    sourceLabel: "Own Stock",
    offer: "Offer",
    image: "images/speaker.jpg",
    description: "Portable Bluetooth speaker with rich sound and battery life."
  },
  {
    id: 5,
    name: "Gaming Mouse",
    price: 2500,
    category: "gaming",
    stockType: "local",
    stockStatus: "instock",
    sourceLabel: "Local Shop",
    offer: "Sale",
    image: "images/mouse.jpg",
    description: "RGB gaming mouse with fast response and ergonomic design."
  },
  {
    id: 6,
    name: "T-Shirt",
    price: 2900,
    category: "fashion",
    stockType: "own",
    stockStatus: "instock",
    sourceLabel: "Own Stock",
    offer: "Trending",
    image: "images/tshirt.jpg",
    description: "Stylish casual t-shirt with soft cotton fabric."
  },
  {
    id: 7,
    name: "Face Cream",
    price: 1800,
    category: "beauty",
    stockType: "dropshipping",
    stockStatus: "preorder",
    sourceLabel: "Dropshipping",
    offer: "Special",
    image: "images/cream.jpg",
    description: "Skin care face cream for smooth and healthy glow."
  },
  {
    id: 8,
    name: "Laptop Bag",
    price: 4500,
    category: "fashion",
    stockType: "local",
    stockStatus: "limited",
    sourceLabel: "Local Shop",
    offer: "Limited",
    image: "images/bag.jpg",
    description: "Durable laptop bag with stylish look and safe storage."
  },
  {
    id: 9,
    name: "Power Bank",
    price: 5200,
    category: "electronics",
    stockType: "own",
    stockStatus: "instock",
    sourceLabel: "Own Stock",
    offer: "Fast Sell",
    image: "images/powerbank.jpg",
    description: "High capacity power bank with quick charging support."
  },
  {
    id: 10,
    name: "Home Lamp",
    price: 3900,
    category: "homeitems",
    stockType: "local",
    stockStatus: "instock",
    sourceLabel: "Local Shop",
    offer: "Discount",
    image: "images/lamp.jpg",
    description: "Elegant home lamp for modern interior lighting."
  }
];

let selectedCategory = "all";
let selectedStockType = "all";
let cart = JSON.parse(localStorage.getItem("uniqueSpotCart")) || [];

const productList = document.getElementById("productList");
const categoryList = document.getElementById("categoryList");
const stockTypeList = document.getElementById("stockTypeList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const cartWhatsAppBtn = document.getElementById("cartWhatsAppBtn");
const installBtn = document.getElementById("installBtn");

/* =========================
   HELPERS
========================= */
function formatPrice(price){
  return `Rs. ${price.toLocaleString()}`;
}

function getStockText(status){
  if(status === "instock") return "In Stock";
  if(status === "limited") return "Limited Stock";
  if(status === "preorder") return "Pre Order";
  if(status === "outstock") return "Out of Stock";
  return "";
}

function saveCart(){
  localStorage.setItem("uniqueSpotCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  cartCount.textContent = cart.length;
}

/* =========================
   PRODUCTS RENDER
========================= */
function renderProducts(){
  const searchValue = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(product => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;

    const stockTypeMatch =
      selectedStockType === "all" || product.stockType === selectedStockType;

    const searchMatch =
      product.name.toLowerCase().includes(searchValue);

    return categoryMatch && stockTypeMatch && searchMatch;
  });

  productList.innerHTML = "";

  if(filtered.length === 0){
    productList.innerHTML = `<p>No products found.</p>`;
    return;
  }

  filtered.forEach(product => {
    const waMessage = `Hello Unique Spot, I want to order ${product.name} - ${formatPrice(product.price)}`;
    const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-wrap">
        <span class="offer-badge">${product.offer}</span>
        <span class="stock-badge ${product.stockStatus}">${getStockText(product.stockStatus)}</span>
        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/logo.png'">
      </div>

      <div class="product-info">
        <span class="source-badge">${product.sourceLabel}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <p class="product-desc">${product.description}</p>

        <div class="product-btns">
          <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
          <a href="${waLink}" class="wa-btn" target="_blank">WhatsApp Order</a>
        </div>
      </div>
    `;

    productList.appendChild(card);
  });
}

/* =========================
   CART
========================= */
function addToCart(id){
  const product = products.find(p => p.id === id);
  if(product){
    cart.push(product);
    saveCart();
    renderCart();
    alert(product.name + " added to cart");
  }
}

function renderCart(){
  cartItems.innerHTML = "";

  if(cart.length === 0){
    cartItems.innerHTML = `<p>Your cart is empty.</p>`;
    cartTotal.textContent = "Rs. 0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.src='images/logo.png'">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)}</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;

    cartItems.appendChild(row);
  });

  cartTotal.textContent = formatPrice(total);
}

function removeFromCart(index){
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart(){
  cart = [];
  saveCart();
  renderCart();
}

function cartWhatsAppOrder(){
  if(cart.length === 0){
    alert("Your cart is empty");
    return;
  }

  let total = 0;
  let message = "Hello Unique Spot, I want to order these items:%0A%0A";

  cart.forEach((item, index) => {
    total += item.price;
    message += `${index + 1}. ${item.name} - ${formatPrice(item.price)}%0A`;
  });

  message += `%0ATotal: ${formatPrice(total)}`;

  const link = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(link, "_blank");
}

/* =========================
   FILTERS
========================= */
categoryList.addEventListener("click", (e) => {
  if(e.target.tagName === "LI"){
    document.querySelectorAll("#categoryList li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");
    selectedCategory = e.target.dataset.category;
    renderProducts();
  }
});

stockTypeList.addEventListener("click", (e) => {
  if(e.target.tagName === "LI"){
    document.querySelectorAll("#stockTypeList li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");
    selectedStockType = e.target.dataset.type;
    renderProducts();
  }
});

searchBtn.addEventListener("click", renderProducts);
searchInput.addEventListener("keyup", renderProducts);

/* =========================
   CART MODAL
========================= */
cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartModal.style.display = "flex";
  renderCart();
});

closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if(e.target === cartModal){
    cartModal.style.display = "none";
  }
});

clearCartBtn.addEventListener("click", clearCart);
cartWhatsAppBtn.addEventListener("click", cartWhatsAppOrder);

/* =========================
   PWA INSTALL
========================= */
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if(installBtn){
    installBtn.style.display = "inline-block";
  }
});

if(installBtn){
  installBtn.addEventListener("click", async () => {
    if(!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if(choiceResult.outcome === "accepted"){
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    deferredPrompt = null;
    installBtn.style.display = "none";
  });
}

window.addEventListener("appinstalled", () => {
  console.log("PWA was installed");
  if(installBtn){
    installBtn.style.display = "none";
  }
});

/* =========================
   SERVICE WORKER
========================= */
if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => {
        console.log("Service Worker registered successfully");
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}

/* =========================
   INIT
========================= */
updateCartCount();
renderProducts();
renderCart();
