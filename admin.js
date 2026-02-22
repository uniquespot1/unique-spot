/***********************
 Admin Panel (localStorage) + Photo Upload
***********************/
const DEFAULT_PIN = "1234";

const DEFAULT_PRODUCTS = [
  { id:"p1",  name:"Smart Watch",         price:8500,  cat:"smartwatches",  img:"images/watch.jpg" },
  { id:"p2",  name:"Wireless Headphones", price:3500,  cat:"electronics",   img:"images/headphones.jpg" },
  { id:"p3",  name:"Mobile Phone",        price:65000, cat:"mobilephones", img:"images/phone.jpg" },
  { id:"p4",  name:"Bluetooth Speaker",   price:6000,  cat:"electronics",   img:"images/speaker.jpg" },
  { id:"p5",  name:"Gaming Mouse",        price:2500,  cat:"gaming",        img:"images/mouse.jpg" },
  { id:"p6",  name:"T-Shirt",             price:2900,  cat:"fashion",       img:"images/tshirt.jpg" },
  { id:"p7",  name:"Face Cream",          price:1800,  cat:"beauty",        img:"images/cream.jpg" },
  { id:"p8",  name:"Laptop Bag",          price:4500,  cat:"electronics",   img:"images/bag.jpg" },
  { id:"p9",  name:"Power Bank",          price:5200,  cat:"electronics",   img:"images/powerbank.jpg" },
  { id:"p10", name:"Home Lamp",           price:3900,  cat:"homeitems",     img:"images/lamp.jpg" },
];

const LS_PRODUCTS = "us_products_v1";
const LS_ADMIN_PIN = "us_admin_pin_v1";
const LS_ADMIN_AUTH = "us_admin_auth_v1";

function $(id){ return document.getElementById(id); }

function getPin(){ return localStorage.getItem(LS_ADMIN_PIN) || DEFAULT_PIN; }
function setPin(pin){ localStorage.setItem(LS_ADMIN_PIN, pin); }

function getProducts(){
  try{
    const raw = localStorage.getItem(LS_PRODUCTS);
    if(!raw) return DEFAULT_PRODUCTS.slice();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : DEFAULT_PRODUCTS.slice();
  }catch{
    return DEFAULT_PRODUCTS.slice();
  }
}
function saveProducts(arr){ localStorage.setItem(LS_PRODUCTS, JSON.stringify(arr)); }

function genId(products){ return "p" + (products.length + 1); }
function money(n){ return "Rs. " + Number(n||0).toLocaleString("en-LK"); }

function setAuth(v){ localStorage.setItem(LS_ADMIN_AUTH, v ? "1":"0"); }
function isAuthed(){ return localStorage.getItem(LS_ADMIN_AUTH) === "1"; }

let editingId = null;
// ✅ photo upload dataURL (temporary)
let pickedImageDataUrl = "";

function showPanel(){
  $("adminLogin").classList.add("hidden");
  $("adminPanel").classList.remove("hidden");
  render();
  resetForm();
}
function showLogin(){
  $("adminLogin").classList.remove("hidden");
  $("adminPanel").classList.add("hidden");
}

function resetPreview(){
  pickedImageDataUrl = "";
  const img = $("imgPreview");
  if(img){ img.style.display = "none"; img.src = ""; }
  const file = $("pFile");
  if(file) file.value = "";
}

function resetForm(){
  editingId = null;
  $("formTitle").textContent = "Add Product";
  $("pId").value = "(auto)";
  $("pName").value = "";
  $("pPrice").value = "";
  $("pCat").value = "electronics";
  $("pImg").value = ""; // optional path
  resetPreview();
}

function render(){
  const products = getProducts();
  $("countPill").textContent = products.length;

  const q = ($("filterText").value || "").trim().toLowerCase();
  const list = q ? products.filter(p => (p.name||"").toLowerCase().includes(q)) : products;

  $("productRows").innerHTML = (list.map(p => `
    <tr>
      <td>${p.name || ""}</td>
      <td>${money(p.price)}</td>
      <td>${p.cat || ""}</td>
      <td>
        <div class="admin-actions">
          <button class="ghost" data-edit="${p.id}">Edit</button>
          <button class="danger" data-del="${p.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("")) || `<tr><td colspan="4" class="small">No products</td></tr>`;

  document.querySelectorAll("[data-edit]").forEach(btn=>{
    btn.onclick = () => startEdit(btn.getAttribute("data-edit"));
  });
  document.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick = () => delProduct(btn.getAttribute("data-del"));
  });
}

function startEdit(id){
  const products = getProducts();
  const p = products.find(x => x.id === id);
  if(!p) return;

  editingId = id;
  $("formTitle").textContent = "Edit Product";
  $("pId").value = p.id;
  $("pName").value = p.name || "";
  $("pPrice").value = p.price || "";
  $("pCat").value = p.cat || "electronics";

  // if img is a normal path, keep in input. If dataURL, clear input (optional)
  if((p.img || "").startsWith("data:image")){
    $("pImg").value = "";
    pickedImageDataUrl = p.img;
    const img = $("imgPreview");
    if(img){
      img.src = p.img;
      img.style.display = "block";
    }
  }else{
    $("pImg").value = p.img || "";
    resetPreview();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function delProduct(id){
  if(!confirm("Delete this product?")) return;
  let products = getProducts();
  products = products.filter(x => x.id !== id);
  saveProducts(products);
  render();
  resetForm();
}

function saveProduct(){
  const name = $("pName").value.trim();
  const price = Number($("pPrice").value);
  const cat = $("pCat").value;

  // ✅ image choose priority: uploaded photo > typed path
  const typedImg = $("pImg").value.trim();
  const img = pickedImageDataUrl || typedImg || "";

  if(!name){ alert("Enter product name"); return; }
  if(!price || price < 1){ alert("Enter valid price"); return; }

  const products = getProducts();

  if(editingId){
    const i = products.findIndex(x => x.id === editingId);
    if(i >= 0) products[i] = { ...products[i], name, price, cat, img };
  }else{
    const id = genId(products);
    products.push({ id, name, price, cat, img });
  }

  saveProducts(products);
  render();
  resetForm();
  alert("Saved ✅");
}

function exportJSON(){
  const products = getProducts();
  const box = $("exportBox");
  box.style.display = "block";
  box.textContent = JSON.stringify(products, null, 2);
}

function resetAll(){
  if(!confirm("Reset all products to default?")) return;
  saveProducts(DEFAULT_PRODUCTS.slice());
  render();
  resetForm();
  alert("Reset ✅");
}

function updateCartCount(){
  try{
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((s,i)=> s + (i.qty||0), 0);
    const el = $("cartCount");
    if(el) el.textContent = count;
  }catch{}
}

function login(){
  const pin = $("adminPin").value.trim();
  if(pin === getPin()){
    $("loginMsg").textContent = "Login success ✅";
    setAuth(true);
    showPanel();
  }else{
    $("loginMsg").textContent = "Wrong PIN ❌";
  }
}

function changePin(){
  const newPin = $("newPin").value.trim();
  if(newPin.length < 4){
    $("pinMsg").textContent = "PIN at least 4 digits/letters";
    return;
  }
  setPin(newPin);
  $("newPin").value = "";
  $("pinMsg").textContent = "PIN updated ✅";
}

function logout(){
  setAuth(false);
  showLogin();
}

/* ✅ Photo -> resize+compress -> dataURL */
function fileToDataURL(file){
  return new Promise((resolve, reject)=>{
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function compressImage(dataUrl, maxW=800, quality=0.82){
  return new Promise((resolve)=>{
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if(w > maxW){
        const ratio = maxW / w;
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      // jpeg smaller than png
      const out = canvas.toDataURL("image/jpeg", quality);
      resolve(out);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function onPickPhoto(){
  const fileInput = $("pFile");
  if(!fileInput || !fileInput.files || !fileInput.files[0]) return;

  const file = fileInput.files[0];

  // 1) read dataUrl
  const dataUrl = await fileToDataURL(file);
  // 2) compress
  const compressed = await compressImage(dataUrl, 800, 0.82);

  pickedImageDataUrl = compressed;

  // preview
  const img = $("imgPreview");
  if(img){
    img.src = compressed;
    img.style.display = "block";
  }

  // clear typed path (optional)
  $("pImg").value = "";
}

document.addEventListener("DOMContentLoaded", ()=>{
  updateCartCount();

  $("btnLogin").onclick = login;
  $("btnSave").onclick = saveProduct;
  $("btnReset").onclick = resetForm;
  $("filterText").oninput = render;
  $("btnExport").onclick = exportJSON;
  $("btnResetAll").onclick = resetAll;
  $("btnChangePin").onclick = changePin;
  $("btnLogout").onclick = logout;

  // ✅ photo upload event
  const file = $("pFile");
  if(file) file.addEventListener("change", onPickPhoto);

  if(isAuthed()) showPanel();
  else showLogin();
});
