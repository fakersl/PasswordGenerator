// PasswordGenerator Module - Versão moderna e otimizada
const PasswordGenerator = (() => {
    // Cache de elementos DOM
    const elements = {};
    
    // Configurações
    const config = {
        minLength: 8,
        maxLength: 32,
        defaultLength: 15,
        charsets: {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "@#*&_-!$%+="
        },
        strengthLevels: [
            { min: 8, max: 11, text: "Fraca", color: "text-red-400", barColor: "bg-red-500", bars: 1 },
            { min: 12, max: 15, text: "Média", color: "text-yellow-400", barColor: "bg-yellow-500", bars: 2 },
            { min: 16, max: 19, text: "Forte", color: "text-green-400", barColor: "bg-green-500", bars: 3 },
            { min: 20, max: 32, text: "Muito Forte", color: "text-blue-400", barColor: "bg-blue-500", bars: 4 }
        ]
    };
    
    // Estado da aplicação
    let state = {
        currentPassword: "",
        passwordLength: config.defaultLength,
        options: {
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true
        },
        history: []
    };
    
    // Inicialização
    const init = () => {
        cacheElements();
        bindEvents();
        updatePasswordLengthDisplay();
        updateStrengthIndicator();
        loadHistory();
        updateSliderThumb();
        updateCheckboxVisuals();
    };
    
    // Cache de elementos DOM para melhor performance
    const cacheElements = () => {
        elements.slider = document.querySelector("#slider_password");
        elements.generateBtn = document.querySelector("#generate_btn");
        elements.sizePassword = document.querySelector("#value_password");
        elements.password = document.querySelector("#random_password");
        elements.placeholder = document.querySelector("#placeholder_text");
        elements.passwordDisplay = document.querySelector("#password_display");
        elements.copyButton = document.querySelector("#copy_button");
        elements.strengthText = document.querySelector("#strength_text");
        elements.toast = document.querySelector("#toast");
        elements.toastMessage = document.querySelector("#toast_message");
        elements.increaseBtn = document.querySelector("#increase_btn");
        elements.decreaseBtn = document.querySelector("#decrease_btn");
        elements.passwordHistory = document.querySelector("#password_history");
        elements.clearHistory = document.querySelector("#clear_history");
        
        // Strength bars
        elements.strengthBars = [
            document.querySelector("#strength_bar_1"),
            document.querySelector("#strength_bar_2"),
            document.querySelector("#strength_bar_3"),
            document.querySelector("#strength_bar_4")
        ];
        
        // Option checkboxes
        elements.uppercase = document.querySelector("#uppercase");
        elements.lowercase = document.querySelector("#lowercase");
        elements.numbers = document.querySelector("#numbers");
        elements.symbols = document.querySelector("#symbols");
    };
    
    // Vincular eventos
    const bindEvents = () => {
        // Evento do slider
        elements.slider.addEventListener("input", handleSliderChange);
        
        // Evento do botão de gerar
        elements.generateBtn.addEventListener("click", generatePassword);
        
        // Eventos dos botões de incremento/decremento
        elements.increaseBtn.addEventListener("click", () => adjustLength(1));
        elements.decreaseBtn.addEventListener("click", () => adjustLength(-1));
        
        // Evento de cópia
        elements.copyButton.addEventListener("click", copyPassword);
        
        // Eventos dos checkboxes
        elements.uppercase.addEventListener("change", updateOptions);
        elements.lowercase.addEventListener("change", updateOptions);
        elements.numbers.addEventListener("change", updateOptions);
        elements.symbols.addEventListener("change", updateOptions);
        
        // Evento do histórico
        elements.clearHistory.addEventListener("click", clearHistory);
        
        // Eventos de hover no display de senha
        elements.passwordDisplay.addEventListener("mouseenter", showCopyButton);
        elements.passwordDisplay.addEventListener("mouseleave", hideCopyButton);
        
        // Evento de toque para mobile
        elements.passwordDisplay.addEventListener("touchstart", handleTouchStart);
        
        // Evento de redimensionamento para atualizar slider
        window.addEventListener('resize', updateSliderThumb);
    };
    
    // Manipular mudança no slider
    const handleSliderChange = (e) => {
        state.passwordLength = parseInt(e.target.value);
        updatePasswordLengthDisplay();
        updateStrengthIndicator();
        updateSliderThumb();
    };
    
    // Ajustar comprimento com os botões +/-
    const adjustLength = (change) => {
        const newLength = state.passwordLength + change;
        if (newLength >= config.minLength && newLength <= config.maxLength) {
            state.passwordLength = newLength;
            elements.slider.value = newLength;
            updatePasswordLengthDisplay();
            updateStrengthIndicator();
            updateSliderThumb();
        }
    };
    
    // Atualizar a posição do thumb do slider
    const updateSliderThumb = () => {
        const thumb = document.querySelector('.slider-thumb');
        const slider = elements.slider;
        const percentage = (slider.value - slider.min) / (slider.max - slider.min);
        thumb.style.left = `calc(${percentage * 100}% + ${8 - percentage * 16}px)`;
    };
    
    // Atualizar exibição do tamanho da senha
    const updatePasswordLengthDisplay = () => {
        elements.sizePassword.textContent = state.passwordLength;
    };
    
    // Atualizar opções de caracteres
    const updateOptions = () => {
        state.options.uppercase = elements.uppercase.checked;
        state.options.lowercase = elements.lowercase.checked;
        state.options.numbers = elements.numbers.checked;
        state.options.symbols = elements.symbols.checked;
        
        // Atualizar visual dos checkboxes
        updateCheckboxVisuals();
    };
    
    // Atualizar visual dos checkboxes
    const updateCheckboxVisuals = () => {
        const checkboxes = [
            { element: elements.uppercase, visual: document.querySelector('label[for="uppercase"] .checkbox-visual') },
            { element: elements.lowercase, visual: document.querySelector('label[for="lowercase"] .checkbox-visual') },
            { element: elements.numbers, visual: document.querySelector('label[for="numbers"] .checkbox-visual') },
            { element: elements.symbols, visual: document.querySelector('label[for="symbols"] .checkbox-visual') }
        ];
        
        checkboxes.forEach(({ element, visual }) => {
            const icon = visual.querySelector('.checkbox-icon');
            
            if (element.checked) {
                visual.style.background = '#8b5cf6';
                visual.style.borderColor = '#8b5cf6';
                icon.style.display = 'block';
            } else {
                visual.style.background = 'transparent';
                visual.style.borderColor = '#a78bfa';
                icon.style.display = 'none';
            }
        });
    };
    
    // Atualizar indicador de força
    const updateStrengthIndicator = () => {
        const strengthLevel = config.strengthLevels.find(level => 
            state.passwordLength >= level.min && state.passwordLength <= level.max
        );
        
        if (strengthLevel) {
            elements.strengthText.textContent = strengthLevel.text;
            elements.strengthText.style.color = getComputedStyle(document.documentElement).getPropertyValue(`--${strengthLevel.color.split('-')[1]}-color`) || '#f59e0b';
            
            // Atualizar barras de força
            elements.strengthBars.forEach((bar, index) => {
                if (index < strengthLevel.bars) {
                    bar.style.background = getComputedStyle(document.documentElement).getPropertyValue(`--${strengthLevel.barColor.split('-')[1]}-color`) || '#f59e0b';
                } else {
                    bar.style.background = '#4b5563';
                }
            });
        }
    };
    
    // Gerar senha
    const generatePassword = () => {
        try {
            // Verificar se pelo menos uma opção está selecionada
            const selectedCharsets = Object.keys(state.options)
                .filter(key => state.options[key])
                .map(key => config.charsets[key]);
            
            if (selectedCharsets.length === 0) {
                showToast("Selecione pelo menos um tipo de caractere!", "error");
                return;
            }
            
            // Combinar todos os caracteres disponíveis
            const allChars = selectedCharsets.join('');
            
            // Gerar senha usando crypto.getRandomValues para melhor segurança
            const randomValues = new Uint32Array(state.passwordLength);
            crypto.getRandomValues(randomValues);
            
            let pass = "";
            for (let i = 0; i < state.passwordLength; i++) {
                pass += allChars[randomValues[i] % allChars.length];
            }
            
            // Atualizar estado
            state.currentPassword = pass;
            
            // Atualizar UI
            updatePasswordDisplay();
            addToHistory(pass);
            
            // Feedback visual
            elements.generateBtn.classList.add('shake');
            setTimeout(() => {
                elements.generateBtn.classList.remove('shake');
            }, 500);
            
        } catch (error) {
            console.error("Erro ao gerar senha:", error);
            showToast("Erro ao gerar senha. Tente novamente.", "error");
        }
    };
    
    // Atualizar exibição da senha
    const updatePasswordDisplay = () => {
        elements.password.textContent = state.currentPassword;
        elements.placeholder.classList.add("hidden");
        elements.password.classList.remove("hidden");
        elements.passwordDisplay.style.background = 'rgba(31, 41, 55, 0.8)';
    };
    
    // Mostrar botão de copiar
    const showCopyButton = () => {
        if (state.currentPassword) {
            elements.copyButton.style.opacity = '1';
        }
    };
    
    // Esconder botão de copiar
    const hideCopyButton = () => {
        elements.copyButton.style.opacity = '0';
    };
    
    // Manipular toque para mobile
    const handleTouchStart = () => {
        if (state.currentPassword) {
            showCopyButton();
            setTimeout(hideCopyButton, 3000);
        }
    };
    
    // Copiar senha
    const copyPassword = async () => {
        if (!state.currentPassword) return;
        
        try {
            await navigator.clipboard.writeText(state.currentPassword);
            showToast("Senha copiada com sucesso!", "success");
        } catch (err) {
            console.error("Erro ao copiar:", err);
            
            // Fallback para navegadores mais antigos
            if (fallbackCopyToClipboard()) {
                showToast("Senha copiada com sucesso!", "success");
            } else {
                showToast("Cópia não suportada. Selecione e copie manualmente.", "error");
            }
        }
    };
    
    // Fallback para cópia em navegadores mais antigos
    const fallbackCopyToClipboard = () => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = state.currentPassword;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            return false;
        }
    };
    
    // Mostrar notificação toast
    const showToast = (message, type = "success") => {
        elements.toastMessage.textContent = message;
        
        // Atualizar ícone baseado no tipo
        const icon = elements.toast.querySelector(".toast-icon");
        if (type === "success") {
            icon.className = "fas fa-check-circle toast-icon";
            icon.style.color = "#10b981";
        } else {
            icon.className = "fas fa-exclamation-circle toast-icon";
            icon.style.color = "#ef4444";
        }
        
        elements.toast.style.opacity = "1";
        elements.toast.style.transform = "translateX(-50%) translateY(0)";
        
        setTimeout(() => {
            elements.toast.style.opacity = "0";
            elements.toast.style.transform = "translateX(-50%) translateY(1rem)";
        }, 3000);
    };
    
    // Adicionar ao histórico
    const addToHistory = (password) => {
        // Limitar histórico a 5 itens
        if (state.history.length >= 5) {
            state.history.pop();
        }
        
        state.history.unshift({
            password: password,
            timestamp: new Date().toLocaleTimeString()
        });
        
        updateHistoryDisplay();
        saveHistory();
    };
    
    // Atualizar exibição do histórico
    const updateHistoryDisplay = () => {
        if (state.history.length === 0) {
            elements.passwordHistory.innerHTML = '<p class="empty-history">Nenhuma senha gerada ainda</p>';
            return;
        }
        
        elements.passwordHistory.innerHTML = state.history.map(item => `
            <div class="history-item">
                <div class="history-password">${item.password}</div>
                <div class="history-time">${item.timestamp}</div>
            </div>
        `).join('');
    };
    
    // Limpar histórico
    const clearHistory = () => {
        state.history = [];
        updateHistoryDisplay();
        saveHistory();
    };
    
    // Carregar histórico do localStorage
    const loadHistory = () => {
        try {
            const saved = localStorage.getItem('passwordHistory');
            if (saved) {
                state.history = JSON.parse(saved);
                updateHistoryDisplay();
            }
        } catch (e) {
            console.error("Erro ao carregar histórico:", e);
        }
    };
    
    // Salvar histórico no localStorage
    const saveHistory = () => {
        try {
            localStorage.setItem('passwordHistory', JSON.stringify(state.history));
        } catch (e) {
            console.error("Erro ao salvar histórico:", e);
        }
    };
    
    // API pública
    return {
        init,
        generatePassword,
        copyPassword
    };
})();

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', PasswordGenerator.init);
} else {
    PasswordGenerator.init();
}