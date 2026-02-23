function getUsers(){
  try { return JSON.parse(localStorage.getItem("users")) || []; }
  catch { return []; }
}
function saveUsers(users){
  localStorage.setItem("users", JSON.stringify(users));
}
function setSession(user){
  localStorage.setItem("sessionUser", JSON.stringify(user));
}
function showMsg(text, ok=false){
  const el = document.getElementById("authMsg");
  if(!el) return;
  el.textContent = text;
  el.className = "auth-msg " + (ok ? "ok" : "bad");
}

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formTitle = document.getElementById("formTitle");
const formSub = document.getElementById("formSub");

function setMode(mode){
  if(mode === "login"){
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    formTitle.textContent = "Login";
    formSub.textContent = "Login to continue";
    showMsg("");
  }else{
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
    formTitle.textContent = "Register";
    formSub.textContent = "Create your account";
    showMsg("");
  }
}

loginTab?.addEventListener("click", ()=>setMode("login"));
registerTab?.addEventListener("click", ()=>setMode("register"));

registerForm?.addEventListener("submit", (e)=>{
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const pass = document.getElementById("regPassword").value;

  if(pass.length < 6){
    showMsg("Password at least 6 characters வேண்டும்.");
    return;
  }

  const users = getUsers();
  if(users.find(u => u.email === email)){
    showMsg("This email already registed .");
    return;
  }

  const user = { name, email, phone, address: "", pass };
  users.push(user);
  saveUsers(users);

  setSession({ name, email, phone, address: "" });

  showMsg("Account created ✅ Redirecting...", true);
  setTimeout(()=> window.location.href = "index.html", 800);
});

loginForm?.addEventListener("submit", (e)=>{
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const pass = document.getElementById("loginPassword").value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.pass === pass);

  if(!user){
    showMsg("Email / Password wrong 😅");
    return;
  }

  setSession({ name: user.name, email: user.email, phone: user.phone || "", address: user.address || "" });
  showMsg("Login success ✅ Redirecting...", true);
  setTimeout(()=> window.location.href = "index.html", 600);

});
