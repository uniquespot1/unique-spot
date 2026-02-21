let password = "admin123";

function login(){
let p=document.getElementById("pass").value;
if(p===password){
document.getElementById("adminPanel").style.display="block";
}else{
alert("Wrong password");
}
}

function addProduct(){
let name=document.getElementById("name").value;
let price=document.getElementById("price").value;
let image=document.getElementById("image").value;

let product = {name,price,image};

localStorage.setItem("newProduct", JSON.stringify(product));

alert("Product Added");
}