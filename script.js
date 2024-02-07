let sliderElement = document.querySelector("#slider_password");
let buttonElement = document.querySelector("#button");
let sizePassword = document.querySelector("#value_password");
let password = document.querySelector("#random_password");

let containerPassword = document.querySelector("#container_password");

let charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#*&_-!$"
let newPassword = "";

sizePassword.innerHTML = sliderElement.value;

sliderElement.oninput = function(){
    sizePassword.innerHTML = this.value;
}

//GERA A SENHA
function generatePassword(){
    let pass = "";
    for(let i = 0, n = charset.length; i < sliderElement.value; i++){
        pass += charset.charAt(Math.floor(Math.random() * n));
    }

    password.innerHTML = pass;
    containerPassword.classList.remove("hide");
    newPassword = pass;
}

// Copia a senha
function copiarSenha() {
    navigator.clipboard.writeText(newPassword)
      .then(() => {
        alert("Senha copiada para a área de transferência!");
      })
      .catch(err => {
        console.error("Erro ao copiar:", err);
        alert("Cópia não suportada ou ocorreu um erro.");
      });
  }
  
  // Aciona a cópia ao clicar no botão
  const copiarButton = document.querySelector("#container_password button");
  copiarButton.addEventListener("click", copiarSenha);
  
