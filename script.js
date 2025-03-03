let sliderElement = document.querySelector("#slider_password");
let buttonElement = document.querySelector("#button");
let sizePassword = document.querySelector("#value_password");
let password = document.querySelector("#random_password");

let containerPassword = document.querySelector("#container_password");
let tooltip = document.querySelector("#tooltip");

let charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#*&_-!$"
let newPassword = "";

// Atualiza o tamanho da senha conforme o slider
sizePassword.innerHTML = sliderElement.value;

sliderElement.oninput = function() {
    sizePassword.innerHTML = this.value;
}

// Função para gerar a senha
function generatePassword() {
    let pass = "";
    for (let i = 0, n = charset.length; i < sliderElement.value; i++) {
        pass += charset.charAt(Math.floor(Math.random() * n));
    }

    password.innerHTML = pass;
    containerPassword.classList.remove("hidden");
    newPassword = pass;
}

// Função para copiar a senha
function copyPassword() {
    navigator.clipboard.writeText(newPassword)
        .then(() => {
            // Exibe o tooltip de "Senha copiada!"
            tooltip.textContent = "Senha copiada!";
            tooltip.classList.add('opacity-100');
            setTimeout(() => {
                tooltip.classList.remove('opacity-100');
                tooltip.classList.add('opacity-0');
            }, 2000);
        })
        .catch(err => {
            console.error("Erro ao copiar:", err);
            alert("Cópia não suportada ou ocorreu um erro.");
        });
}

// Aciona a cópia ao clicar na senha ou no botão
const copyButton = document.querySelector("#copy_button");
copyButton.addEventListener("click", copyPassword);

// Aciona a cópia ao clicar na senha gerada
password.addEventListener("click", copyPassword);