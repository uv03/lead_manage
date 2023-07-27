const fname=document.getElementById("fname");
const email=document.getElementById("email");
const phone=document.getElementById("phone");

const form=document.getElementById("form");

form.addEventListener("click",(e)=>{
    e.preventDefault();
    console.log(fname.value);
    console.log(email.value);
    console.log(phone.value);

})

