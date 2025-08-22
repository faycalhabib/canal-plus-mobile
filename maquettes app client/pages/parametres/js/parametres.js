// Paramètres JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page de paramètres
    initSettingsPage();
    
    // Initialisation des contrôles
    initControls();
    
    // Chargement des paramètres sauvegardés
    loadSettings();
});

// Initialisation de la page de paramètres
function initSettingsPage() {
    // Initialiser les événements des boutons principaux
    initHeaderActions();
    
    // Initialiser le contrôle parental
    initParentalControls();
    
    // Initialiser les contrôles de volume
    initVolumeControls();
    
    // Initialiser les actions de stockage
    initStorageActions();
}

// Initialisation des actions du header
function initHeaderActions() {
    const resetBtn = document.getElementById('resetBtn');
    
    resetBtn.addEventListener('click', function() {
        showResetConfirmation();
    });
}

// Afficher la confirmation de réinitialisation
function showResetConfirmation() {
    const modal = document.createElement('div');
    modal.className = 'reset-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h3>Réinitialiser les paramètres</h3>
            <p>Cette action restaurera tous les paramètres à leurs valeurs par défaut. Cette action est irréversible.</p>
            <div class="modal-actions">
                <button class="modal-btn cancel" id="cancelReset">Annuler</button>
                <button class="modal-btn danger" id="confirmReset">Réinitialiser</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const cancelBtn = modal.querySelector('#cancelReset');
    const confirmBtn = modal.querySelector('#confirmReset');
    
    cancelBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    confirmBtn.addEventListener('click', function() {
        resetAllSettings();
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', function() {
        modal.remove();
    });
}

// Réinitialiser tous les paramètres
function resetAllSettings() {
    // Supprimer les paramètres du localStorage
    localStorage.removeItem('userSettings');
    
    // Recharger les paramètres par défaut
    loadDefaultSettings();
    
    showSuccess('Paramètres réinitialisés avec succès');
}

// Initialisation des contrôles
function initControls() {
    // Tous les toggles
    const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            saveSettings();
            handleToggleChange(this);
        });
    });
    
    // Tous les selects
    const selects = document.querySelectorAll('.setting-select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            saveSettings();
            handleSelectChange(this);
        });
    });
    
    // Inputs de temps
    const timeInputs = document.querySelectorAll('.time-input');
    timeInputs.forEach(input => {
        input.addEventListener('change', function() {
            saveSettings();
        });
    });
}

// Gestion des changements de toggle
function handleToggleChange(toggle) {
    const id = toggle.id;
    
    switch(id) {
        case 'parentalControl':
            toggleParentalSettings(toggle.checked);
            break;
        case 'dataSaver':
            handleDataSaver(toggle.checked);
            break;
        case 'autoDownload':
            handleAutoDownload(toggle.checked);
            break;
        case 'highContrast':
            handleHighContrast(toggle.checked);
            break;
    }
}

// Gestion des changements de select
function handleSelectChange(select) {
    const id = select.id;
    const value = select.value;
    
    switch(id) {
        case 'videoQuality':
            handleVideoQuality(value);
            break;
        case 'fontSize':
            handleFontSize(value);
            break;
        case 'subtitles':
            handleSubtitles(value);
            break;
    }
}

// Initialisation du contrôle parental
function initParentalControls() {
    const parentalToggle = document.getElementById('parentalControl');
    const setPinBtn = document.getElementById('setPinBtn');
    
    setPinBtn.addEventListener('click', function() {
        showPinSetupModal();
    });
    
    // État initial
    toggleParentalSettings(parentalToggle.checked);
}

// Afficher/masquer les paramètres parentaux
function toggleParentalSettings(show) {
    const parentalSettings = document.querySelectorAll('.parental-setting');
    
    parentalSettings.forEach(setting => {
        if (show) {
            setting.classList.remove('hidden');
        } else {
            setting.classList.add('hidden');
        }
    });
}

// Afficher la modal de configuration du PIN
function showPinSetupModal() {
    const modal = document.createElement('div');
    modal.className = 'pin-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h3>Définir le code PIN parental</h3>
            <p>Choisissez un code PIN à 4 chiffres pour sécuriser les paramètres parentaux.</p>
            <div class="pin-inputs">
                <input type="password" class="pin-digit" maxlength="1" pattern="[0-9]">
                <input type="password" class="pin-digit" maxlength="1" pattern="[0-9]">
                <input type="password" class="pin-digit" maxlength="1" pattern="[0-9]">
                <input type="password" class="pin-digit" maxlength="1" pattern="[0-9]">
            </div>
            <div class="modal-actions">
                <button class="modal-btn cancel" id="cancelPin">Annuler</button>
                <button class="modal-btn primary" id="savePin" disabled>Enregistrer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const pinInputs = modal.querySelectorAll('.pin-digit');
    const saveBtn = modal.querySelector('#savePin');
    const cancelBtn = modal.querySelector('#cancelPin');
    
    // Gestion des inputs PIN
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
            checkPinComplete();
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });
    
    function checkPinComplete() {
        const pin = Array.from(pinInputs).map(input => input.value).join('');
        saveBtn.disabled = pin.length !== 4;
    }
    
    saveBtn.addEventListener('click', function() {
        const pin = Array.from(pinInputs).map(input => input.value).join('');
        saveParentalPin(pin);
        modal.remove();
        showSuccess('Code PIN parental défini avec succès');
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', function() {
        modal.remove();
    });
    
    // Focus sur le premier input
    pinInputs[0].focus();
}

// Sauvegarder le PIN parental
function saveParentalPin(pin) {
    const settings = getSettings();
    settings.parentalPin = pin;
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

// Initialisation des contrôles de volume
function initVolumeControls() {
    const volumeSlider = document.getElementById('defaultVolume');
    const volumeValue = document.getElementById('volumeValue');
    
    volumeSlider.addEventListener('input', function() {
        volumeValue.textContent = this.value + '%';
        saveSettings();
    });
}

// Initialisation des actions de stockage
function initStorageActions() {
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    
    clearCacheBtn.addEventListener('click', function() {
        clearCache();
    });
}

// Vider le cache
function clearCache() {
    const btn = document.getElementById('clearCacheBtn');
    const originalText = btn.textContent;
    
    btn.disabled = true;
    btn.textContent = 'Suppression...';
    
    setTimeout(() => {
        // Simulation de suppression du cache
        updateStorageDisplay(0.8); // Réduire l'utilisation
        
        btn.disabled = false;
        btn.textContent = originalText;
        
        showSuccess('Cache vidé avec succès');
    }, 2000);
}

// Mettre à jour l'affichage du stockage
function updateStorageDisplay(newUsageGb) {
    const storageUsed = document.querySelector('.storage-used');
    const storageText = document.querySelector('.storage-text');
    const maxStorage = 5; // 5 Go
    
    const percentage = (newUsageGb / maxStorage) * 100;
    storageUsed.style.width = percentage + '%';
    storageText.textContent = `${newUsageGb.toFixed(1)} Go utilisés sur ${maxStorage} Go disponibles`;
}

// Gestion des fonctionnalités spécifiques
function handleDataSaver(enabled) {
    if (enabled) {
        showInfo('Mode économie de données activé');
    }
}

function handleAutoDownload(enabled) {
    if (enabled) {
        showInfo('Téléchargements automatiques activés');
    }
}

function handleHighContrast(enabled) {
    if (enabled) {
        document.body.classList.add('high-contrast');
        showInfo('Mode contraste élevé activé');
    } else {
        document.body.classList.remove('high-contrast');
    }
}

function handleVideoQuality(quality) {
    showInfo(`Qualité vidéo définie sur ${quality}`);
}

function handleFontSize(size) {
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    document.body.classList.add(`font-size-${size}`);
    
    const sizeLabels = {
        small: 'Petit',
        normal: 'Normal',
        large: 'Grand',
        xlarge: 'Très grand'
    };
    
    showInfo(`Taille du texte : ${sizeLabels[size]}`);
}

function handleSubtitles(language) {
    const languageLabels = {
        off: 'Désactivés',
        fr: 'Français',
        ar: 'العربية',
        en: 'English'
    };
    
    showInfo(`Sous-titres : ${languageLabels[language]}`);
}

// Gestion des paramètres
function getSettings() {
    const stored = localStorage.getItem('userSettings');
    if (stored) {
        return JSON.parse(stored);
    }
    return getDefaultSettings();
}

function getDefaultSettings() {
    return {
        videoQuality: 'auto',
        autoPlay: true,
        subtitles: 'off',
        defaultVolume: 70,
        newContentNotif: true,
        reminderNotif: true,
        promoNotif: false,
        quietStart: '22:00',
        quietEnd: '08:00',
        parentalControl: false,
        maxAge: 'all',
        dataSaver: false,
        autoDownload: false,
        fontSize: 'normal',
        highContrast: false,
        audioDescription: false
    };
}

function saveSettings() {
    const settings = {};
    
    // Récupérer tous les paramètres depuis le formulaire
    const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    toggles.forEach(toggle => {
        settings[toggle.id] = toggle.checked;
    });
    
    const selects = document.querySelectorAll('.setting-select');
    selects.forEach(select => {
        settings[select.id] = select.value;
    });
    
    const timeInputs = document.querySelectorAll('.time-input');
    timeInputs.forEach(input => {
        settings[input.id] = input.value;
    });
    
    const volumeSlider = document.getElementById('defaultVolume');
    if (volumeSlider) {
        settings.defaultVolume = parseInt(volumeSlider.value);
    }
    
    // Conserver le PIN s'il existe
    const currentSettings = getSettings();
    if (currentSettings.parentalPin) {
        settings.parentalPin = currentSettings.parentalPin;
    }
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

function loadSettings() {
    const settings = getSettings();
    
    // Appliquer les paramètres aux contrôles
    Object.keys(settings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = settings[key];
                handleToggleChange(element);
            } else if (element.tagName === 'SELECT') {
                element.value = settings[key];
                handleSelectChange(element);
            } else if (element.type === 'time') {
                element.value = settings[key];
            } else if (element.type === 'range') {
                element.value = settings[key];
                const volumeValue = document.getElementById('volumeValue');
                if (volumeValue) {
                    volumeValue.textContent = settings[key] + '%';
                }
            }
        }
    });
    
    // Appliquer les paramètres d'accessibilité
    if (settings.fontSize && settings.fontSize !== 'normal') {
        handleFontSize(settings.fontSize);
    }
    
    if (settings.highContrast) {
        handleHighContrast(true);
    }
}

function loadDefaultSettings() {
    const defaultSettings = getDefaultSettings();
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    loadSettings();
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

// Styles pour les modals et animations
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
    
    .reset-modal, .pin-modal {
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
        color: #FF8C00;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
    }
    
    .modal-content p {
        color: #cccccc;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 20px;
    }
    
    .pin-inputs {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 20px;
    }
    
    .pin-digit {
        width: 50px;
        height: 50px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: white;
    }
    
    .pin-digit:focus {
        outline: none;
        border-color: #FF8C00;
        box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.2);
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
    
    .modal-btn.danger:hover {
        background: #ff6666;
    }
    
    .modal-btn.primary {
        background: #FF8C00;
        color: white;
    }
    
    .modal-btn.primary:hover:not(:disabled) {
        background: #ff9f1a;
    }
    
    .modal-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    /* Styles d'accessibilité */
    .font-size-small {
        font-size: 0.9em;
    }
    
    .font-size-large {
        font-size: 1.1em;
    }
    
    .font-size-xlarge {
        font-size: 1.2em;
    }
    
    .high-contrast {
        filter: contrast(1.5);
    }
    
    .high-contrast .settings-section {
        border-color: rgba(255, 255, 255, 0.3);
    }
    
    .high-contrast .setting-item {
        border-color: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);
