// Settings Page JavaScript
let hasUnsavedChanges = false;

// Initialize settings page
document.addEventListener('DOMContentLoaded', function() {
    initMenuToggle();
    initTabs();
    initSettings();
    initFormHandlers();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// Menu toggle functionality
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar && mainContent) {
        menuToggle.addEventListener('click', function() {
            const isCollapsed = sidebar.classList.contains('collapsed');
            
            if (isCollapsed) {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('sidebar-collapsed');
                menuToggle.innerHTML = '<span>☰</span>';
                menuToggle.title = 'Masquer le menu';
            } else {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('sidebar-collapsed');
                menuToggle.innerHTML = '<span>✕</span>';
                menuToggle.title = 'Afficher le menu';
            }
        });
    }
}

// Initialize tabs
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Initialize settings
function initSettings() {
    // Save all button
    const saveAllBtn = document.getElementById('saveAllBtn');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllSettings);
    }
    
    // Load saved settings
    loadSettings();
    
    // Mark as changed when user modifies settings
    trackChanges();
}

// Initialize form handlers
function initFormHandlers() {
    // Handle form inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            hasUnsavedChanges = true;
            updateSaveButton();
        });
    });
    
    // Handle toggle switches
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            hasUnsavedChanges = true;
            updateSaveButton();
            
            // Add visual feedback
            const slider = this.nextElementSibling;
            slider.style.transform = 'scale(1.1)';
            setTimeout(() => {
                slider.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Track changes
function trackChanges() {
    const formElements = document.querySelectorAll('input, select');
    formElements.forEach(element => {
        element.addEventListener('input', () => {
            hasUnsavedChanges = true;
            updateSaveButton();
        });
    });
}

// Update save button state
function updateSaveButton() {
    const saveBtn = document.getElementById('saveAllBtn');
    if (saveBtn) {
        if (hasUnsavedChanges) {
            saveBtn.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)';
            saveBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
                </svg>
                Modifications non sauvées
            `;
        } else {
            saveBtn.style.background = 'linear-gradient(135deg, #FF8C00 0%, #FF6B35 100%)';
            saveBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                    <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2"/>
                    <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2"/>
                </svg>
                Sauvegarder tout
            `;
        }
    }
}

// Save all settings
function saveAllSettings() {
    if (!hasUnsavedChanges) {
        showMessage('Aucune modification à sauvegarder', 'info');
        return;
    }
    
    // Simulate saving process
    const saveBtn = document.getElementById('saveAllBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
            <div class="spinner"></div>
            Sauvegarde...
        `;
    }
    
    // Collect all settings
    const settings = collectAllSettings();
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage for demo
        localStorage.setItem('canalplus_admin_settings', JSON.stringify(settings));
        
        hasUnsavedChanges = false;
        updateSaveButton();
        
        if (saveBtn) {
            saveBtn.disabled = false;
        }
        
        showMessage('Paramètres sauvegardés avec succès', 'success');
        
        // Add success animation to all setting cards
        const settingCards = document.querySelectorAll('.setting-card');
        settingCards.forEach(card => {
            card.style.borderColor = '#2ed573';
            setTimeout(() => {
                card.style.borderColor = '#333';
            }, 1000);
        });
    }, 1500);
}

// Collect all settings
function collectAllSettings() {
    const settings = {
        general: {
            appName: document.getElementById('appName')?.value || '',
            appVersion: document.getElementById('appVersion')?.value || '',
            environment: document.getElementById('environment')?.value || '',
            defaultLanguage: document.getElementById('defaultLanguage')?.value || '',
            timezone: document.getElementById('timezone')?.value || '',
            dateFormat: document.getElementById('dateFormat')?.value || '',
            emailNotifications: document.getElementById('emailNotifications')?.checked || false,
            pushNotifications: document.getElementById('pushNotifications')?.checked || false,
            securityAlerts: document.getElementById('securityAlerts')?.checked || false
        },
        security: {
            twoFactorAuth: document.getElementById('twoFactorAuth')?.checked || false,
            ssoLogin: document.getElementById('ssoLogin')?.checked || false,
            sessionDuration: document.getElementById('sessionDuration')?.value || '',
            maxLoginAttempts: document.getElementById('maxLoginAttempts')?.value || '',
            minPasswordLength: document.getElementById('minPasswordLength')?.value || '',
            requireSpecialChars: document.getElementById('requireSpecialChars')?.checked || false,
            requireNumbers: document.getElementById('requireNumbers')?.checked || false,
            requireUppercase: document.getElementById('requireUppercase')?.checked || false,
            passwordExpiry: document.getElementById('passwordExpiry')?.value || '',
            loginLogs: document.getElementById('loginLogs')?.checked || false,
            adminLogs: document.getElementById('adminLogs')?.checked || false,
            errorLogs: document.getElementById('errorLogs')?.checked || false,
            logRetention: document.getElementById('logRetention')?.value || ''
        },
        lastModified: new Date().toISOString()
    };
    
    return settings;
}

// Load settings
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('canalplus_admin_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            applySettings(settings);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
    }
}

// Apply settings
function applySettings(settings) {
    if (settings.general) {
        const general = settings.general;
        if (general.appName) document.getElementById('appName').value = general.appName;
        if (general.environment) document.getElementById('environment').value = general.environment;
        if (general.defaultLanguage) document.getElementById('defaultLanguage').value = general.defaultLanguage;
        if (general.timezone) document.getElementById('timezone').value = general.timezone;
        if (general.dateFormat) document.getElementById('dateFormat').value = general.dateFormat;
        
        document.getElementById('emailNotifications').checked = general.emailNotifications;
        document.getElementById('pushNotifications').checked = general.pushNotifications;
        document.getElementById('securityAlerts').checked = general.securityAlerts;
    }
    
    if (settings.security) {
        const security = settings.security;
        document.getElementById('twoFactorAuth').checked = security.twoFactorAuth;
        document.getElementById('ssoLogin').checked = security.ssoLogin;
        
        if (security.sessionDuration) document.getElementById('sessionDuration').value = security.sessionDuration;
        if (security.maxLoginAttempts) document.getElementById('maxLoginAttempts').value = security.maxLoginAttempts;
        if (security.minPasswordLength) document.getElementById('minPasswordLength').value = security.minPasswordLength;
        if (security.passwordExpiry) document.getElementById('passwordExpiry').value = security.passwordExpiry;
        if (security.logRetention) document.getElementById('logRetention').value = security.logRetention;
        
        document.getElementById('requireSpecialChars').checked = security.requireSpecialChars;
        document.getElementById('requireNumbers').checked = security.requireNumbers;
        document.getElementById('requireUppercase').checked = security.requireUppercase;
        document.getElementById('loginLogs').checked = security.loginLogs;
        document.getElementById('adminLogs').checked = security.adminLogs;
        document.getElementById('errorLogs').checked = security.errorLogs;
    }
}

// Prevent navigation with unsaved changes
window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Update current time
function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// Show message function
function showMessage(message, type = 'info') {
    // Create toast message
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#3742fa'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Add spinner CSS
const style = document.createElement('style');
style.textContent = `
    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff40;
        border-top: 2px solid #ffffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
