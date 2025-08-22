// Connexion JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des icônes de connexion
    initAuthIcons();
    
    // Initialisation du formulaire
    initAuthForm();
});

// Initialisation de l'icône d'activation horizontale unique
function initAuthIcons() {
    const phoneOption = document.getElementById('phoneOption');
    const decoderOption = document.getElementById('decoderOption');
    const toggleSlider = document.querySelector('.toggle-slider');
    const phoneFormSection = document.getElementById('phoneFormSection');
    const decoderFormSection = document.getElementById('decoderFormSection');
    
    phoneOption.addEventListener('click', function() {
        // Activer l'option téléphone
        phoneOption.classList.add('active');
        decoderOption.classList.remove('active');
        
        // Déplacer le slider vers la gauche
        toggleSlider.style.transform = 'translateX(0)';
        
        // Afficher le formulaire téléphone
        phoneFormSection.classList.remove('hidden');
        decoderFormSection.classList.add('hidden');
    });
    
    decoderOption.addEventListener('click', function() {
        // Activer l'option décodeur
        decoderOption.classList.add('active');
        phoneOption.classList.remove('active');
        
        // Déplacer le slider vers la droite
        toggleSlider.style.transform = 'translateX(190px)';
        
        // Afficher le formulaire décodeur
        decoderFormSection.classList.remove('hidden');
        phoneFormSection.classList.add('hidden');
    });
}

// Initialisation du formulaire de connexion
function initAuthForm() {
    const authForm = document.getElementById('authForm');
    const phoneInput = document.getElementById('phoneInput');
    const decoderInput = document.getElementById('decoderInput');
    const submitBtn = document.getElementById('submitBtn');
    const password = document.getElementById('password');
    const decoderPassword = document.getElementById('decoderPassword');
    
    // Formatage automatique du numéro de téléphone
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // Formatage automatique du numéro de décodeur
    decoderInput.addEventListener('input', formatDecoderNumber);
    
    // Validation du formulaire
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Vérifier quelle option est active
        const phoneOption = document.getElementById('phoneOption');
        if (phoneOption.classList.contains('active')) {
            validatePhoneLogin();
        } else {
            validateDecoderLogin();
        }
    });
    
    // Initialisation des icônes oeil pour les mots de passe
    initPasswordToggles();
    
    // Gestion du lien "Mot de passe oublié"
    initForgotPassword();
}

// Initialisation des icônes oeil pour masquer/afficher les mots de passe
function initPasswordToggles() {
    // Téléphone
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    // Décodeur
    const decoderPasswordToggle = document.getElementById('decoderPasswordToggle');
    const decoderPasswordInput = document.getElementById('decoderPassword');
    
    // Gestionnaire pour le mot de passe téléphone
    passwordToggle.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, passwordToggle);
    });
    
    // Gestionnaire pour le mot de passe décodeur
    decoderPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(decoderPasswordInput, decoderPasswordToggle);
    });
}

// Fonction pour basculer la visibilité du mot de passe
function togglePasswordVisibility(input, toggleButton) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    // Changer l'icône
    const svg = toggleButton.querySelector('svg');
    if (type === 'password') {
        // Icône pour masquer le mot de passe
        svg.innerHTML = '<path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
        // Icône pour afficher le mot de passe
        svg.innerHTML = '<path d="M17.94 17.94C16.2309 19.2322 14.1875 19.9537 12 20C10.6879 19.9979 9.38855 19.7306 8.18182 19.2M12 15C10.3431 15 9 13.6569 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868M3 13C3 13 6.63636 6 12 6C12.9237 6.00109 13.8411 6.14235 14.7157 6.41667M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
}

// Formatage du numéro de téléphone
function formatPhoneNumber(e) {
    let input = e.target.value.replace(/\D/g, ''); // Supprimer tous les caractères non numériques
    let formattedInput = '';
    
    // Formatage pour le code pays +235
    // Format: 90 12 34 56
    for (let i = 0; i < input.length; i++) {
        if (i === 2 || i === 4 || i === 6) {
            formattedInput += ' ';
        }
        formattedInput += input[i];
    }
    
    e.target.value = formattedInput;
}

// Formatage du numéro de décodeur
function formatDecoderNumber(e) {
    let input = e.target.value.replace(/[^0-9]/g, ''); // Supprimer tous les caractères non numériques
    let formattedInput = '';
    
    // Formater en XXXX-XXXX-XXXX
    for (let i = 0; i < input.length; i++) {
        if (i === 4 || i === 8) {
            formattedInput += '-';
        }
        formattedInput += input[i];
    }
    
    e.target.value = formattedInput;
}

// Validation de la connexion par téléphone
function validatePhoneLogin() {
    const phoneInput = document.getElementById('phoneInput');
    const password = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const phoneValue = phoneInput.value.replace(/\s/g, ''); // Supprimer les espaces pour validation
    
    // Vérifier si le champ téléphone est vide
    if (!phoneValue) {
        showError('Veuillez entrer un numéro de téléphone');
        return;
    }
    
    // Vérifier la longueur (8 chiffres pour le Tchad)
    if (phoneValue.length !== 8) {
        showError('Numéro de téléphone invalide');
        return;
    }
    
    // Vérifier si le mot de passe est vide
    if (!password.value) {
        showError('Veuillez entrer votre mot de passe');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Connexion...';
    
    // Simulation de connexion
    setTimeout(() => {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
        
        // Redirection vers le dashboard (succès)
        window.location.href = '../../dashboard/html/index.html';
    }, 1500);
}

// Validation de la connexion par décodeur
function validateDecoderLogin() {
    const decoderInput = document.getElementById('decoderInput');
    const decoderPassword = document.getElementById('decoderPassword');
    const submitBtn = document.getElementById('submitBtn');
    const decoderValue = decoderInput.value.replace(/-/g, ''); // Supprimer les tirets pour validation
    
    // Vérifier si le champ décodeur est vide
    if (!decoderValue) {
        showError('Veuillez entrer le numéro de votre décodeur');
        return;
    }
    
    // Vérifier la longueur (14 chiffres)
    if (decoderValue.length !== 14) {
        showError('Le numéro de décodeur doit contenir 14 chiffres');
        return;
    }
    
    // Vérifier si le mot de passe est vide
    if (!decoderPassword.value) {
        showError('Veuillez entrer votre mot de passe');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Connexion...';
    
    // Simulation de connexion
    setTimeout(() => {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
        
        // Redirection vers le dashboard (succès)
        window.location.href = '../../dashboard/html/index.html';
    }, 1500);
}

// Gestion du lien "Mot de passe oublié"
function initForgotPassword() {
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Rediriger vers la page de mot de passe oublié
        window.location.href = 'mot-de-passe-oublie.html';
    });
}

// Affichage des erreurs
function showError(message) {
    // Créer un élément d'erreur s'il n'existe pas déjà
    let errorElement = document.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: #ff4444;
            font-size: 14px;
            margin-top: 5px;
            text-align: left;
            animation: fadeIn 0.3s ease;
        `;
        document.querySelector('.auth-form').appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Supprimer l'erreur après 3 secondes
    setTimeout(() => {
        if (errorElement) {
            errorElement.remove();
        }
    }, 3000);
}

// Affichage des informations
function showInfo(message) {
    // Créer un élément d'information s'il n'existe pas déjà
    let infoElement = document.querySelector('.info-message');
    if (!infoElement) {
        infoElement = document.createElement('div');
        infoElement.className = 'info-message';
        infoElement.style.cssText = `
            color: #4CAF50;
            font-size: 14px;
            margin-top: 5px;
            text-align: center;
            animation: fadeIn 0.3s ease;
            padding: 10px;
            background: rgba(76, 175, 80, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(76, 175, 80, 0.3);
        `;
        document.querySelector('.form-footer-links').appendChild(infoElement);
    }
    
    infoElement.textContent = message;
    
    // Supprimer l'information après 5 secondes
    setTimeout(() => {
        if (infoElement) {
            infoElement.remove();
        }
    }, 5000);
}

// Style pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
