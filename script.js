const whatsappNumber = "94776939483";

const products = [
  {
    id: 1,
    name: "Smart Watch",
    price: 8500,
    category: "smartwatches",
    image: "images/watch.jpg"
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 3500,
    category: "electronics",
    image: "images/headphones.jpg"
  },
  {
    id: 3,
    name: "Mobile Phone",
    price: 65000,
    category: "mobilephones",
    image: "images/phone.jpg"
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 6000,
    category: "electronics",
    image: "images/speaker.jpg"
  },
  {
    id: 5,
    name: "Gaming Mouse",
    price: 2500,
    category: "gaming",
    image: "images/mouse.jpg"
  },
  {
    id: 6,
    name: "T-Shirt",
    price: 2900,
    category: "fashion",
    image: "images/tshirt.jpg"
  },
  {
    id: 7,
    name: "Face Cream",
    price: 1800,
    category: "beauty",
    image: "images/cream.jpg"
  },
  {
    id: 8,
    name: "Laptop Bag",
    price: 4500,
    category: "fashion",
    image: "images/bag.jpg"
  },
  {
    id: 9,
    name: "Power Bank",
    price: 5200,
    category: "electronics",
    image: "images/powerbank.jpg"
  },
  {
    id: 10,
    name: "Home Lamp",
    price: 3900,
    category: "homeitems",
    image: "images/lamp.jpg"
  }
];

let selectedCategory = "all";
let cart = JSON.parse(localStorage.getItem("uniqueSpotCart")) || [];

const productList = document.getElementById("productList");
const categoryList = document.getElementById("categoryList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCartBtn");
const cartWhatsAppBtn = document.getElementById("cartWhatsAppBtn");

function formatPrice(price){
  return `Rs. ${price.toLocaleString()}`;
}

function saveCart(){
  localStorage.setItem("uniqueSpotCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  cartCount.textContent = cart.length;
}

function renderProducts(){
  const searchValue = searchInput.value.toLowerCase().trim();

  const filteredProducts = products.filter(product => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;

    const searchMatch =
      product.name.toLowerCase().includes(searchValue);

    return categoryMatch && searchMatch;
  });

  productList.innerHTML = "";

  if(filteredProducts.length === 0){
    productList.innerHTML = `<p>No products found.</p>`;
    return;
  }

  filteredProducts.forEach(product => {
    const whatsappMessage = `Hello Unique Spot, I want to order ${product.name} - ${formatPrice(product.price)}`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onerror="this.src='images/logo.png'">
      <h3>${product.name}</h3>
      <p class="price">${formatPrice(product.price)}</p>
      <div class="product-buttons">
        <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        <a class="whatsapp-btn" href="${whatsappLink}" target="_blank">WhatsApp Order</a>
      </div>
    `;

    productList.appendChild(card);
  });
}

function addToCart(productId){
  const product = products.find(item => item.id === productId);
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

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.src='images/logo.png'">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)}</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;

    cartItems.appendChild(cartItem);
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

  let message = "Hello Unique Spot, I want to order these items:%0A%0A";
  let total = 0;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} - ${formatPrice(item.price)}%0A`;
    total += item.price;
  });

  message += `%0ATotal: ${formatPrice(total)}`;

  const link = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(link, "_blank");
}

categoryList.addEventListener("click", (e) => {
  if(e.target.tagName === "LI"){
    document.querySelectorAll("#categoryList li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");
    selectedCategory = e.target.dataset.category;
    renderProducts();
  }
});

searchBtn.addEventListener("click", renderProducts);
searchInput.addEventListener("keyup", renderProducts);

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

updateCartCount();
renderProducts();
renderCart();
