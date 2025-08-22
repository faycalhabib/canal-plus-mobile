// Inscription JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des icônes d'inscription
    initAuthIcons();
    
    // Initialisation du formulaire
    initAuthForm();
    
    // Version detection
    initVersionDisplay();
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

// Initialisation du formulaire d'inscription
function initAuthForm() {
    const authForm = document.getElementById('authForm');
    const phoneInput = document.getElementById('phoneInput');
    const decoderInput = document.getElementById('decoderInput');
    // const countryCode = document.getElementById('countryCode'); // Plus nécessaire avec le nouveau design
    const submitBtn = document.getElementById('submitBtn');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const decoderPassword = document.getElementById('decoderPassword');
    const confirmDecoderPassword = document.getElementById('confirmDecoderPassword');
    
    // Mise à jour du placeholder selon le code pays
    updatePlaceholder();
    
    // Formatage automatique du numéro de téléphone
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // Formatage automatique du numéro de décodeur
    decoderInput.addEventListener('input', formatDecoderNumber);
    
    // Validation du formulaire
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Vérifier quelle icône est active
        const phoneToggle = document.getElementById('phoneToggle');
        if (phoneToggle.classList.contains('active')) {
            validatePhoneForm();
        } else {
            validateDecoderForm();
        }
    });
    
    // Initialisation des icônes oeil pour les mots de passe
    initPasswordToggles();
}

// Initialisation des icônes oeil pour masquer/afficher les mots de passe
function initPasswordToggles() {
    // Téléphone
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Décodeur
    const decoderPasswordToggle = document.getElementById('decoderPasswordToggle');
    const decoderPasswordInput = document.getElementById('decoderPassword');
    
    const confirmDecoderPasswordToggle = document.getElementById('confirmDecoderPasswordToggle');
    const confirmDecoderPasswordInput = document.getElementById('confirmDecoderPassword');
    
    // Gestionnaire pour le mot de passe téléphone
    passwordToggle.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, passwordToggle);
    });
    
    // Gestionnaire pour la confirmation du mot de passe téléphone
    confirmPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
    });
    
    // Gestionnaire pour le mot de passe décodeur
    decoderPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(decoderPasswordInput, decoderPasswordToggle);
    });
    
    // Gestionnaire pour la confirmation du mot de passe décodeur
    confirmDecoderPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(confirmDecoderPasswordInput, confirmDecoderPasswordToggle);
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

// Mise à jour du placeholder selon le code pays
function updatePlaceholder() {
    const phoneInput = document.getElementById('phoneInput');
    phoneInput.placeholder = '90 12 34 56';
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

// Validation du formulaire téléphone
function validatePhoneForm() {
    const phoneInput = document.getElementById('phoneInput');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');
    const acceptCGU = document.getElementById('acceptCGU');
    const phoneValue = phoneInput.value.replace(/\s/g, ''); // Supprimer les espaces pour validation
    
    // Vérifier si la case CGU est cochée
    if (!acceptCGU.checked) {
        showError('Veuillez accepter les Conditions Générales d\'Utilisation');
        return;
    }
    
    // Vérifier si le champ téléphone est vide
    if (!phoneValue) {
        showError('Veuillez entrer un numéro de téléphone');
        return;
    }
    
    // Vérifier la longueur selon le code pays
    const selectedCode = '+235'; // Code pays fixe pour le Tchad
    let isValid = false;
    
    switch(selectedCode) {
        case '+33': // France
        case '+213': // Algérie
        case '+225': // Côte d'Ivoire
            isValid = phoneValue.length === 9; // 9 chiffres après le code pays
            break;
        case '+228': // Togo
        case '+229': // Bénin
        case '+223': // Mali
        case '+226': // Burkina Faso
        case '+224': // Guinée
            isValid = phoneValue.length === 8; // 8 chiffres après le code pays
            break;
        case '+242': // Congo
            isValid = phoneValue.length === 9; // 9 chiffres après le code pays
            break;
        case '+221': // Sénégal
            isValid = phoneValue.length === 9; // 9 chiffres après le code pays
            break;
        default:
            isValid = phoneValue.length >= 8 && phoneValue.length <= 10;
    }
    
    if (!isValid) {
        showError('Numéro de téléphone invalide');
        return;
    }
    
    // Vérifier si le mot de passe est vide
    if (!password.value) {
        showError('Veuillez entrer un mot de passe');
        return;
    }
    
    // Vérifier si le mot de passe contient au moins 6 caractères
    if (password.value.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    // Vérifier si les mots de passe correspondent
    if (password.value !== confirmPassword.value) {
        showError('Les mots de passe ne correspondent pas');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Envoi du code...';
    
    // Simulation d'envoi du code SMS
    setTimeout(() => {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
            
        // Sauvegarder le numéro pour la validation SMS
        const fullPhoneNumber = `+235 ${phoneInput.value}`;
        localStorage.setItem('registrationPhone', fullPhoneNumber);
            
        // Redirection vers validation SMS
        setTimeout(() => {
            window.location.href = 'validation-sms.html';
        }, 1500);
    }, 1500);
}

// Validation du formulaire décodeur
function validateDecoderForm() {
    const decoderInput = document.getElementById('decoderInput');
    const decoderPassword = document.getElementById('decoderPassword');
    const confirmDecoderPassword = document.getElementById('confirmDecoderPassword');
    const submitBtn = document.getElementById('submitBtn');
    const acceptCGU = document.getElementById('acceptCGU');
    const decoderValue = decoderInput.value.replace(/-/g, ''); // Supprimer les tirets pour validation
    
    // Vérifier si la case CGU est cochée
    if (!acceptCGU.checked) {
        showError('Veuillez accepter les Conditions Générales d\'Utilisation');
        return;
    }
    
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
        showError('Veuillez entrer un mot de passe');
        return;
    }
    
    // Vérifier si le mot de passe contient au moins 6 caractères
    if (decoderPassword.value.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    // Vérifier si les mots de passe correspondent
    if (decoderPassword.value !== confirmDecoderPassword.value) {
        showError('Les mots de passe ne correspondent pas');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Vérification...';
    
    // Simulation de vérification du numéro de décodeur
    setTimeout(() => {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
        
        // Redirection vers le dashboard (succès)
        window.location.href = '../../dashboard/html/index.html';
    }, 1500);
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

// Affichage de la version
function initVersionDisplay() {
    const versionElements = document.querySelectorAll('#appVersion');
    const version = getAppVersion();
    
    versionElements.forEach(element => {
        if (element) {
            element.textContent = version;
        }
    });
}

// Fonction de détection de version
function getAppVersion() {
    const buildDate = new Date();
    const year = buildDate.getFullYear();
    const month = String(buildDate.getMonth() + 1).padStart(2, '0');
    const day = String(buildDate.getDate()).padStart(2, '0');
    
    const major = 1;
    const minor = 0;
    const patch = parseInt(`${year}${month}${day}`) % 100;
    
    return `${major}.${minor}.${patch}`;
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
