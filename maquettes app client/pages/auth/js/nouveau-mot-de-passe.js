// Nouveau mot de passe JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'autorisation de récupération
    checkRecoveryAuthorization();
    
    // Initialisation du formulaire
    initPasswordForm();
});

// Vérifier l'autorisation de récupération
function checkRecoveryAuthorization() {
    const authorized = localStorage.getItem('recoveryAuthorized');
    if (!authorized) {
        // Rediriger vers la page de connexion si pas autorisé
        window.location.href = 'connexion.html';
        return;
    }
}

// Initialisation du formulaire de mot de passe
function initPasswordForm() {
    const form = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');
    
    // Initialisation des toggles de visibilité
    initPasswordToggles();
    
    // Validation en temps réel du mot de passe
    newPasswordInput.addEventListener('input', function() {
        validatePasswordStrength(this.value);
        checkFormValidity();
    });
    
    // Validation de la confirmation
    confirmPasswordInput.addEventListener('input', function() {
        checkFormValidity();
    });
    
    // Validation du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        validatePasswordForm();
    });
}

// Initialisation des toggles de visibilité
function initPasswordToggles() {
    const newPasswordToggle = document.getElementById('newPasswordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    newPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(newPasswordInput, newPasswordToggle);
    });
    
    confirmPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
    });
}

// Basculer la visibilité du mot de passe
function togglePasswordVisibility(input, toggleButton) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const svg = toggleButton.querySelector('svg');
    if (type === 'password') {
        // Icône pour masquer le mot de passe
        svg.innerHTML = '<path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
        // Icône pour afficher le mot de passe
        svg.innerHTML = '<path d="M17.94 17.94C16.2309 19.2322 14.1875 19.9537 12 20C10.6879 19.9979 9.38855 19.7306 8.18182 19.2M12 15C10.3431 15 9 13.6569 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868M3 13C3 13 6.63636 6 12 6C12.9237 6.00109 13.8411 6.14235 14.7157 6.41667M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
}

// Valider la force du mot de passe
function validatePasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const lengthCriteria = document.getElementById('lengthCriteria');
    const letterCriteria = document.getElementById('letterCriteria');
    const numberCriteria = document.getElementById('numberCriteria');
    
    // Réinitialiser les classes
    strengthFill.className = 'strength-fill';
    strengthText.className = 'strength-text';
    
    // Vérifier les critères
    const hasLength = password.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    // Mettre à jour les critères visuels
    updateCriteria(lengthCriteria, hasLength);
    updateCriteria(letterCriteria, hasLetter);
    updateCriteria(numberCriteria, hasNumber);
    
    // Calculer la force
    const criteriaCount = [hasLength, hasLetter, hasNumber].filter(Boolean).length;
    
    if (password.length === 0) {
        strengthText.textContent = 'Saisissez votre mot de passe';
        return 'none';
    } else if (criteriaCount === 1) {
        strengthFill.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Mot de passe faible';
        return 'weak';
    } else if (criteriaCount === 2) {
        strengthFill.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Mot de passe moyen';
        return 'medium';
    } else if (criteriaCount === 3) {
        strengthFill.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Mot de passe fort';
        return 'strong';
    }
    
    return 'none';
}

// Mettre à jour l'affichage d'un critère
function updateCriteria(criteriaElement, isValid) {
    const icon = criteriaElement.querySelector('.criteria-icon');
    
    if (isValid) {
        criteriaElement.classList.add('valid');
        icon.textContent = '✓';
    } else {
        criteriaElement.classList.remove('valid');
        icon.textContent = '✗';
    }
}

// Vérifier la validité du formulaire
function checkFormValidity() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitBtn');
    
    // Vérifier les critères du mot de passe
    const hasLength = newPassword.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
    
    const isValid = hasLength && hasLetter && hasNumber && passwordsMatch;
    
    submitBtn.disabled = !isValid;
}

// Validation du formulaire de mot de passe
function validatePasswordForm() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitBtn');
    
    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
        showError('Les mots de passe ne correspondent pas');
        return;
    }
    
    // Vérifier les critères
    if (newPassword.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    if (!/[a-zA-Z]/.test(newPassword)) {
        showError('Le mot de passe doit contenir au moins une lettre');
        return;
    }
    
    if (!/[0-9]/.test(newPassword)) {
        showError('Le mot de passe doit contenir au moins un chiffre');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Mise à jour...';
    
    // Simulation de mise à jour du mot de passe
    setTimeout(() => {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
        
        // Nettoyer le localStorage
        localStorage.removeItem('recoveryPhone');
        localStorage.removeItem('recoveryAuthorized');
        
        showSuccess('Mot de passe modifié avec succès !');
        
        setTimeout(() => {
            // Rediriger vers la connexion avec un message de succès
            localStorage.setItem('passwordResetSuccess', 'true');
            window.location.href = 'connexion.html';
        }, 2000);
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
    
    document.querySelector('.password-form').appendChild(errorElement);
    
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
    
    document.querySelector('.password-form').appendChild(successElement);
}

// Supprimer tous les messages
function removeMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
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
`;
document.head.appendChild(style);
