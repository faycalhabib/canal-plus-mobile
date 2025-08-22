// Mot de passe oublié JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du formulaire
    initRecoveryForm();
});

// Initialisation du formulaire de récupération
function initRecoveryForm() {
    const form = document.getElementById('recoveryForm');
    const phoneInput = document.getElementById('phoneInput');
    const submitBtn = document.getElementById('submitBtn');
    
    // Formatage automatique du numéro de téléphone
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // Validation du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        validateRecoveryForm();
    });
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

// Validation du formulaire de récupération
function validateRecoveryForm() {
    const phoneInput = document.getElementById('phoneInput');
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
    
    // Vérifier le format (doit commencer par 9, 6, 7 ou 2)
    const firstDigit = phoneValue[0];
    if (!['9', '6', '7', '2'].includes(firstDigit)) {
        showError('Numéro de téléphone invalide pour le Tchad');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Envoi en cours...';
    
    // Simulation d'envoi du code de récupération
    setTimeout(() => {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
        
        // Sauvegarder le numéro pour la page suivante
        const fullPhoneNumber = `+235 ${phoneInput.value}`;
        localStorage.setItem('recoveryPhone', fullPhoneNumber);
        
        // Simuler la vérification du numéro (dans une vraie app, ce serait un appel API)
        if (isRegisteredPhone(phoneValue)) {
            showSuccess('Code de récupération envoyé !');
            
            setTimeout(() => {
                window.location.href = 'validation-recuperation.html';
            }, 1500);
        } else {
            showError('Ce numéro n\'est associé à aucun compte Canal+');
        }
    }, 2000);
}

// Vérifier si le numéro est enregistré (simulation)
function isRegisteredPhone(phoneNumber) {
    // Dans une vraie application, ceci ferait un appel API
    // Pour la démo, accepter certains numéros
    const registeredNumbers = [
        '90123456', '91234567', '92345678', '93456789',
        '60123456', '61234567', '62345678', '63456789',
        '70123456', '71234567', '72345678', '73456789'
    ];
    
    return registeredNumbers.includes(phoneNumber) || phoneNumber.startsWith('90');
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
        text-align: left;
        animation: fadeIn 0.3s ease;
        padding: 10px;
        background: rgba(255, 68, 68, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(255, 68, 68, 0.3);
    `;
    errorElement.textContent = message;
    
    document.querySelector('.recovery-form').appendChild(errorElement);
    
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
    
    document.querySelector('.recovery-form').appendChild(successElement);
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
