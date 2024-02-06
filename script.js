let sliderElement = document.querySelector("#slider_password");
let buttonElement = document.querySelector("#button");

let sizePassword = document.querySelector("#value_password");
let password = document.querySelector("#random_password");

let containerPassword = document.querySelector("#container_password");

let charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#*&_-!"
let newPassword = "";

sizePassword.innerHTML = sliderElement.value;

sliderElement.oninput = function(){
    sizePassword.innerHTML = this.value;
}

function generatePassword(){
    let pass = "";
    for(let i = 0, n = charset.length; i < sliderElement.value; i++){
        pass += charset.charAt(Math.floor(Math.random() * n));
    }

    password.innerHTML = pass;
    containerPassword.classList.remove("hide");
    newPassword = pass;
}

function copyPassword(){
    navigator.clipboard.writeText(newPassword);
}