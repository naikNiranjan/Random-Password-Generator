class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.generatePassword();
    }

    initializeElements() {
        this.lengthSlider = document.getElementById('length');
        this.lengthValue = document.getElementById('lengthValue');
        this.passwordOutput = document.getElementById('passwordOutput');
        this.strengthIndicator = document.getElementById('strengthIndicator');
        this.strengthText = document.getElementById('strengthText');
        this.copyBtn = document.getElementById('copyBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
        
        this.checkboxes = {
            upper: document.getElementById('incUpper'),
            lower: document.getElementById('incLower'),
            numbers: document.getElementById('incNum'),
            symbols: document.getElementById('incSyb')
        };
    }

    setupEventListeners() {
        this.lengthSlider.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthSlider.value;
            this.generatePassword();
        });

        document.querySelectorAll('.length-adjust').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const currentValue = parseInt(this.lengthSlider.value);
                if (action === 'increase' && currentValue < 32) {
                    this.lengthSlider.value = currentValue + 1;
                } else if (action === 'decrease' && currentValue > 6) {
                    this.lengthSlider.value = currentValue - 1;
                }
                this.lengthValue.textContent = this.lengthSlider.value;
                this.generatePassword();
            });
        });

        Object.values(this.checkboxes).forEach(checkbox => {
            checkbox.addEventListener('change', () => this.generatePassword());
        });

        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.regenerateBtn.addEventListener('click', () => this.generatePassword());
    }

    generatePassword() {
        const charset = this.getCharset();
        if (!charset) {
            this.passwordOutput.value = 'Please select at least one option';
            return;
        }

        const length = parseInt(this.lengthSlider.value);
        let password = '';
        
        // Ensure at least one character from each selected type
        const requiredChars = this.getRequiredCharacters();
        password = requiredChars.join('');

        // Fill the rest randomly
        while (password.length < length) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

       
        password = this.shuffleString(password);
        
        this.passwordOutput.value = password;
        this.updateStrengthIndicator(password);
    }

    getCharset() {
        const charsets = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        return Object.entries(this.checkboxes)
            .filter(([_, checkbox]) => checkbox.checked)
            .map(([key]) => charsets[key])
            .join('');
    }

    getRequiredCharacters() {
        const required = [];
        if (this.checkboxes.upper.checked) required.push(this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
        if (this.checkboxes.lower.checked) required.push(this.getRandomChar('abcdefghijklmnopqrstuvwxyz'));
        if (this.checkboxes.numbers.checked) required.push(this.getRandomChar('0123456789'));
        if (this.checkboxes.symbols.checked) required.push(this.getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?'));
        return required;
    }

    getRandomChar(charset) {
        return charset[Math.floor(Math.random() * charset.length)];
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    updateStrengthIndicator(password) {
        const strength = this.calculatePasswordStrength(password);
        const strengthColors = {
            0: ['#dc3545', 'Very Weak'],
            1: ['#ffc107', 'Weak'],
            2: ['#fd7e14', 'Medium'],
            3: ['#28a745', 'Strong'],
            4: ['#20c997', 'Very Strong']
        };

        const [color, text] = strengthColors[strength];
        this.strengthIndicator.style.width = `${(strength + 1) * 20}%`;
        this.strengthIndicator.style.backgroundColor = color;
        this.strengthText.textContent = text;
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 12) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;
        return strength;
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.passwordOutput.value);
            this.copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 1500);
        } catch (err) {
            console.error('Failed to copy password:', err);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});
