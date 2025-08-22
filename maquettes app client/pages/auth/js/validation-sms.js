// Validation SMS JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page de validation
    initValidationPage();
    
    // Initialisation du formulaire
    initValidationForm();
    
    // Démarrer le timer
    startCountdown();
});

// Initialisation de la page de validation
function initValidationPage() {
    // Récupérer le numéro de téléphone depuis le localStorage ou l'URL
    const phoneNumber = getPhoneNumber();
    if (phoneNumber) {
        displayPhoneNumber(phoneNumber);
    }
}

// Récupérer le numéro de téléphone
function getPhoneNumber() {
    // Essayer de récupérer depuis localStorage
    const storedPhone = localStorage.getItem('registrationPhone');
    if (storedPhone) {
        return storedPhone;
    }
    
    // Valeur par défaut si pas trouvé
    return '+235 XX XX XX XX';
}

// Afficher le numéro de téléphone masqué
function displayPhoneNumber(phoneNumber) {
    const phoneDisplay = document.getElementById('phoneDisplay');
    
    // Masquer une partie du numéro pour la sécurité
    if (phoneNumber.includes('+235')) {
        const digits = phoneNumber.replace('+235 ', '').replace(/\s/g, '');
        if (digits.length >= 8) {
            const masked = `+235 ${digits.substring(0, 2)} XX XX ${digits.substring(6, 8)}`;
            phoneDisplay.textContent = masked;
        } else {
            phoneDisplay.textContent = phoneNumber;
        }
    } else {
        phoneDisplay.textContent = phoneNumber;
    }
}

// Initialisation du formulaire de validation
function initValidationForm() {
    const form = document.getElementById('verificationForm');
    const codeInputs = document.querySelectorAll('.code-digit');
    const submitBtn = document.getElementById('submitBtn');
    const resendBtn = document.getElementById('resendBtn');
    
    // Gestion des champs de code
    initCodeInputs(codeInputs);
    
    // Validation du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        validateCode(codeInputs, submitBtn);
    });
    
    // Bouton de renvoi
    resendBtn.addEventListener('click', function() {
        resendCode();
    });
}

// Initialisation des champs de code
function initCodeInputs(inputs) {
    inputs.forEach((input, index) => {
        // Saisie de chiffres uniquement
        input.addEventListener('input', function(e) {
            const value = e.target.value.replace(/[^0-9]/g, '');
            e.target.value = value;
            
            // Marquer comme rempli
            if (value) {
                e.target.classList.add('filled');
                // Passer au champ suivant
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else {
                e.target.classList.remove('filled');
            }
            
            // Supprimer les erreurs
            e.target.classList.remove('error');
            
            // Vérifier si tous les champs sont remplis
            checkAllFieldsFilled(inputs);
        });
        
        // Gestion du backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
                inputs[index - 1].value = '';
                inputs[index - 1].classList.remove('filled');
            }
        });
        
        // Gestion du collage
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            
            if (pastedData.length === 6) {
                inputs.forEach((inp, idx) => {
                    if (idx < pastedData.length) {
                        inp.value = pastedData[idx];
                        inp.classList.add('filled');
                    }
                });
                inputs[5].focus();
                checkAllFieldsFilled(inputs);
            }
        });
    });
}

// Vérifier si tous les champs sont remplis
function checkAllFieldsFilled(inputs) {
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
    const submitBtn = document.getElementById('submitBtn');
    
    if (allFilled) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
    }
}

// Validation du code
function validateCode(inputs, submitBtn) {
    const code = Array.from(inputs).map(input => input.value).join('');
    
    // Vérifier que le code est complet
    if (code.length !== 6) {
        showError('Veuillez saisir le code complet à 6 chiffres');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Vérification...';
    
    // Simulation de validation du code
    setTimeout(() => {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
        
        // Simuler la validation (dans une vraie app, ce serait un appel API)
        if (isValidCode(code)) {
            // Succès - nettoyer le localStorage et rediriger
            localStorage.removeItem('registrationPhone');
            showSuccess('Code validé avec succès !');
            
            setTimeout(() => {
                window.location.href = '../../dashboard/html/index.html';
            }, 1500);
        } else {
            // Erreur - marquer les champs en erreur
            inputs.forEach(input => {
                input.classList.add('error');
                input.value = '';
                input.classList.remove('filled');
            });
            
            showError('Code incorrect. Veuillez réessayer.');
            inputs[0].focus();
            
            // Supprimer les erreurs après animation
            setTimeout(() => {
                inputs.forEach(input => input.classList.remove('error'));
            }, 500);
        }
    }, 1500);
}

// Vérifier si le code est valide (simulation)
function isValidCode(code) {
    // Dans une vraie application, ceci ferait un appel API
    // Pour la démo, accepter certains codes
    const validCodes = ['123456', '000000', '111111'];
    return validCodes.includes(code);
}

// Démarrer le compte à rebours
function startCountdown() {
    let timeLeft = 60;
    const countdownElement = document.getElementById('countdown');
    const timerText = document.getElementById('timerText');
    const resendBtn = document.getElementById('resendBtn');
    
    const timer = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerText.classList.add('hidden');
            resendBtn.classList.remove('hidden');
        }
    }, 1000);
}

// Renvoyer le code
function resendCode() {
    const resendBtn = document.getElementById('resendBtn');
    const timerText = document.getElementById('timerText');
    
    // Désactiver temporairement le bouton
    resendBtn.disabled = true;
    resendBtn.textContent = 'Envoi en cours...';
    
    // Simulation d'envoi
    setTimeout(() => {
        resendBtn.disabled = false;
        resendBtn.textContent = 'Renvoyer le code';
        resendBtn.classList.add('hidden');
        timerText.classList.remove('hidden');
        
        // Redémarrer le timer
        document.getElementById('countdown').textContent = '60';
        startCountdown();
        
        showInfo('Un nouveau code a été envoyé à votre numéro.');
    }, 2000);
}

// Affichage des erreurs
function showError(message) {
    removeMessages();
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = `
        color: #ff4444;
        font-size: 14px;
        margin-top: 15px;
        text-align: center;
        animation: fadeIn 0.3s ease;
        padding: 10px;
        background: rgba(255, 68, 68, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(255, 68, 68, 0.3);
    `;
    errorElement.textContent = message;
    
    document.querySelector('.verification-form').appendChild(errorElement);
    
    setTimeout(() => {
        if (errorElement) {
            errorElement.remove();
        }
    }, 4000);
}

// Affichage des succès
function showSuccess(message) {
    removeMessages();
    
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.style.cssText = `
        color: #4CAF50;
        font-size: 14px;
        margin-top: 15px;
        text-align: center;
        animation: fadeIn 0.3s ease;
        padding: 10px;
        background: rgba(76, 175, 80, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(76, 175, 80, 0.3);
    `;
    successElement.textContent = message;
    
    document.querySelector('.verification-form').appendChild(successElement);
}

// Affichage des informations
function showInfo(message) {
    removeMessages();
    
    const infoElement = document.createElement('div');
    infoElement.className = 'info-message';
    infoElement.style.cssText = `
        color: #2196F3;
        font-size: 14px;
        margin-top: 15px;
        text-align: center;
        animation: fadeIn 0.3s ease;
        padding: 10px;
        background: rgba(33, 150, 243, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(33, 150, 243, 0.3);
    `;
    infoElement.textContent = message;
    
    document.querySelector('.resend-section').appendChild(infoElement);
    
    setTimeout(() => {
        if (infoElement) {
            infoElement.remove();
        }
    }, 4000);
}

// Supprimer tous les messages
function removeMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message, .info-message');
    messages.forEach(msg => msg.remove());
}

// Style pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);
