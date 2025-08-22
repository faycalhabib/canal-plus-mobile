// Profil JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page de profil
    initProfilePage();
    
    // Initialisation du formulaire
    initProfileForm();
    
    // Initialisation des actions de sécurité
    initSecurityActions();
});

// Initialisation de la page de profil
function initProfilePage() {
    // Charger les données utilisateur
    loadUserData();
    
    // Initialiser l'avatar
    initAvatar();
}

// Charger les données utilisateur
function loadUserData() {
    // Récupérer les données depuis localStorage ou API
    const userData = getUserData();
    
    // Remplir les champs du formulaire
    populateForm(userData);
    
    // Mettre à jour les informations de base
    updateBasicInfo(userData);
}

// Récupérer les données utilisateur (simulation)
function getUserData() {
    // Dans une vraie application, ceci viendrait d'une API
    const storedData = localStorage.getItem('userData');
    
    if (storedData) {
        return JSON.parse(storedData);
    }
    
    // Données par défaut
    return {
        firstName: '',
        lastName: '',
        email: '',
        phone: getRegistrationPhone(),
        birthDate: '',
        address: '',
        language: 'fr',
        emailNotifications: true,
        smsNotifications: true,
        promotionalEmails: false,
        subscriptionDate: 'janvier 2025'
    };
}

// Récupérer le numéro d'inscription
function getRegistrationPhone() {
    const phone = localStorage.getItem('registrationPhone');
    if (phone) {
        return phone.replace('+235 ', '');
    }
    return '90 12 34 56';
}

// Remplir le formulaire avec les données
function populateForm(userData) {
    document.getElementById('firstName').value = userData.firstName || '';
    document.getElementById('lastName').value = userData.lastName || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('birthDate').value = userData.birthDate || '';
    document.getElementById('address').value = userData.address || '';
    document.getElementById('language').value = userData.language || 'fr';
    
    // Préférences
    document.getElementById('emailNotifications').checked = userData.emailNotifications !== false;
    document.getElementById('smsNotifications').checked = userData.smsNotifications !== false;
    document.getElementById('promotionalEmails').checked = userData.promotionalEmails === true;
}

// Mettre à jour les informations de base
function updateBasicInfo(userData) {
    const profileName = document.getElementById('profileName');
    const subscriptionDate = document.getElementById('subscriptionDate');
    
    // Nom complet
    const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
    profileName.textContent = fullName || 'Utilisateur Canal+';
    
    // Date d'abonnement
    subscriptionDate.textContent = userData.subscriptionDate || 'janvier 2025';
}

// Initialisation de l'avatar
function initAvatar() {
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    
    changeAvatarBtn.addEventListener('click', function() {
        // Simulation de changement d'avatar
        showInfo('Fonctionnalité de changement d\'avatar à venir');
    });
}

// Initialisation du formulaire
function initProfileForm() {
    const form = document.getElementById('profileForm');
    const saveBtn = document.getElementById('saveBtn');
    
    // Écouter les changements dans le formulaire
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            markFormAsChanged();
        });
        
        input.addEventListener('change', function() {
            markFormAsChanged();
        });
    });
    
    // Formatage du téléphone
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // Sauvegarde
    saveBtn.addEventListener('click', function(e) {
        e.preventDefault();
        saveProfile();
    });
}

// Marquer le formulaire comme modifié
function markFormAsChanged() {
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.style.opacity = '1';
    saveBtn.disabled = false;
}

// Formatage du numéro de téléphone
function formatPhoneNumber(e) {
    let input = e.target.value.replace(/\D/g, '');
    let formattedInput = '';
    
    // Format: 90 12 34 56
    for (let i = 0; i < input.length; i++) {
        if (i === 2 || i === 4 || i === 6) {
            formattedInput += ' ';
        }
        formattedInput += input[i];
    }
    
    e.target.value = formattedInput;
}

// Sauvegarder le profil
function saveProfile() {
    const saveBtn = document.getElementById('saveBtn');
    
    // Récupérer les données du formulaire
    const formData = getFormData();
    
    // Validation
    if (!validateFormData(formData)) {
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    saveBtn.disabled = true;
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
        </svg>
        Sauvegarde...
    `;
    
    // Simulation de sauvegarde
    setTimeout(() => {
        // Sauvegarder dans localStorage
        localStorage.setItem('userData', JSON.stringify(formData));
        
        // Mettre à jour les informations de base
        updateBasicInfo(formData);
        
        // Réactiver le bouton
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        saveBtn.style.opacity = '0.6';
        
        showSuccess('Profil sauvegardé avec succès !');
    }, 1500);
}

// Récupérer les données du formulaire
function getFormData() {
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        birthDate: document.getElementById('birthDate').value,
        address: document.getElementById('address').value.trim(),
        language: document.getElementById('language').value,
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        promotionalEmails: document.getElementById('promotionalEmails').checked,
        subscriptionDate: document.getElementById('subscriptionDate').textContent
    };
}

// Valider les données du formulaire
function validateFormData(data) {
    // Validation de l'email
    if (data.email && !isValidEmail(data.email)) {
        showError('Adresse e-mail invalide');
        return false;
    }
    
    // Validation du téléphone
    if (data.phone && !isValidPhone(data.phone)) {
        showError('Numéro de téléphone invalide');
        return false;
    }
    
    return true;
}

// Valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Valider le téléphone
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\s/g, '');
    return cleanPhone.length === 8 && /^[0-9]+$/.test(cleanPhone);
}

// Initialisation des actions de sécurité
function initSecurityActions() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    // Changer le mot de passe
    changePasswordBtn.addEventListener('click', function() {
        if (confirm('Vous allez être redirigé vers la page de changement de mot de passe. Continuer ?')) {
            // Rediriger vers la page de changement de mot de passe
            window.location.href = '../../auth/html/nouveau-mot-de-passe.html';
        }
    });
    
    // Supprimer le compte
    deleteAccountBtn.addEventListener('click', function() {
        showDeleteAccountModal();
    });
}

// Afficher la modal de suppression de compte
function showDeleteAccountModal() {
    const modal = document.createElement('div');
    modal.className = 'delete-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h3>Supprimer le compte</h3>
            <p>Cette action est irréversible. Toutes vos données seront définitivement supprimées.</p>
            <p>Tapez <strong>SUPPRIMER</strong> pour confirmer :</p>
            <input type="text" id="confirmDelete" class="modal-input" placeholder="SUPPRIMER">
            <div class="modal-actions">
                <button class="modal-btn cancel" id="cancelDelete">Annuler</button>
                <button class="modal-btn danger" id="confirmDeleteBtn" disabled>Supprimer définitivement</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Gestion de la modal
    const confirmInput = modal.querySelector('#confirmDelete');
    const confirmBtn = modal.querySelector('#confirmDeleteBtn');
    const cancelBtn = modal.querySelector('#cancelDelete');
    
    confirmInput.addEventListener('input', function() {
        confirmBtn.disabled = this.value !== 'SUPPRIMER';
    });
    
    confirmBtn.addEventListener('click', function() {
        if (confirmInput.value === 'SUPPRIMER') {
            deleteAccount();
            modal.remove();
        }
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', function() {
        modal.remove();
    });
}

// Supprimer le compte
function deleteAccount() {
    showInfo('Suppression du compte en cours...');
    
    setTimeout(() => {
        // Nettoyer le localStorage
        localStorage.clear();
        
        // Rediriger vers la page d'accueil
        window.location.href = '../../welcome/html/welcome.html';
    }, 2000);
}

// Affichage des messages
function showError(message) {
    showMessage(message, 'error');
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showInfo(message) {
    showMessage(message, 'info');
}

function showMessage(message, type) {
    // Supprimer les messages existants
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    
    const colors = {
        error: '#ff4444',
        success: '#4CAF50',
        info: '#2196F3'
    };
    
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(26, 26, 26, 0.95);
        color: ${colors[type]};
        padding: 15px 20px;
        border-radius: 12px;
        border: 1px solid ${colors[type]};
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        if (messageElement) {
            messageElement.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageElement.remove(), 300);
        }
    }, 4000);
}

// Styles pour les animations et la modal
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .delete-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        position: relative;
        z-index: 1;
    }
    
    .modal-content h3 {
        color: #ff4444;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
    }
    
    .modal-content p {
        color: #cccccc;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 15px;
    }
    
    .modal-input {
        width: 100%;
        padding: 12px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: white;
        font-size: 14px;
        margin-bottom: 20px;
    }
    
    .modal-input:focus {
        outline: none;
        border-color: #ff4444;
        box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
    }
    
    .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }
    
    .modal-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .modal-btn.cancel {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .modal-btn.cancel:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .modal-btn.danger {
        background: #ff4444;
        color: white;
    }
    
    .modal-btn.danger:hover:not(:disabled) {
        background: #ff6666;
    }
    
    .modal-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);
