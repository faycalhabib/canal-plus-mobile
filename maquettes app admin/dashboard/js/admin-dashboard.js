// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    initNavigation();
    initNotifications();
    initSearch();
    initTime();
    initKPICards();
    initQuickActions();
    initMenuToggle();
});

function initDashboard() {
    console.log('Dashboard Admin Canal+ initialisé');
    
    // Animation d'entrée pour les éléments
    const elements = document.querySelectorAll('.kpi-card, .action-btn, .activity-item');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer la classe active de tous les éléments
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Ajouter la classe active à l'élément cliqué
            this.classList.add('active');
            
            // Simuler le changement de section
            const section = this.dataset.section;
            updatePageTitle(section);
            
            // Animation de feedback
            this.style.transform = 'translateX(10px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

function updatePageTitle(section) {
    const pageTitle = document.querySelector('.page-title');
    const titles = {
        dashboard: 'Dashboard',
        users: 'Gestion des utilisateurs',
        content: 'Gestion du contenu',
        support: 'Support client',
        analytics: 'Analytics',
        settings: 'Paramètres'
    };
    
    if (pageTitle && titles[section]) {
        pageTitle.textContent = titles[section];
        
        // Animation du titre
        pageTitle.style.transform = 'scale(0.95)';
        pageTitle.style.opacity = '0.7';
        
        setTimeout(() => {
            pageTitle.style.transform = 'scale(1)';
            pageTitle.style.opacity = '1';
        }, 150);
    }
}

function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Animation du bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Simuler l'ouverture des notifications
            showNotificationMessage();
        });
    }
}

function showNotificationMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 80px;
        right: 30px;
        background: linear-gradient(135deg, rgba(255, 140, 0, 0.95), rgba(255, 165, 0, 0.9));
        color: #000;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">🔔</span>
            <div>
                <strong>3 nouvelles notifications</strong><br>
                <small>Cliquez pour voir les détails</small>
            </div>
        </div>
    `;
    
    // Ajouter les styles d'animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
    
    // Supprimer le message après 3 secondes
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);
}

function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length > 2) {
                // Simuler la recherche
                console.log('Recherche pour:', query);
                
                // Animation de feedback
                this.style.borderColor = '#FF8C00';
                this.style.boxShadow = '0 0 0 3px rgba(255, 140, 0, 0.2)';
                
                // Simuler les résultats après un délai
                setTimeout(() => {
                    showSearchResults(query);
                }, 500);
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.boxShadow = 'none';
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performGlobalSearch(this.value);
            }
        });
    }
}

function showSearchResults(query) {
    const results = [
        `Utilisateur: ${query}@canal.fr`,
        `Contenu: Film contenant "${query}"`,
        `Support: Ticket #${Math.floor(Math.random() * 1000)} - ${query}`
    ];
    
    console.log('Résultats de recherche:', results);
    
    // Dans une vraie application, cela afficherait une dropdown avec les résultats
    showMessage(`Recherche "${query}" - ${results.length} résultats trouvés`, 'info');
}

function performGlobalSearch(query) {
    if (query.trim()) {
        showMessage(`Recherche globale lancée pour: "${query}"`, 'success');
        console.log('Recherche globale pour:', query);
    }
}

function initTime() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }
}

function initKPICards() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    kpiCards.forEach(card => {
        card.addEventListener('click', function() {
            // Animation au clic
            this.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Simuler l'ouverture des détails
            const kpiType = this.querySelector('.kpi-content h3').textContent;
            showKPIDetails(kpiType);
        });
        
        // Animation au survol
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function showKPIDetails(kpiType) {
    const details = {
        'Utilisateurs actifs': 'Détails des utilisateurs connectés dans les dernières 24h',
        'Revenus du mois': 'Analyse détaillée des revenus et tendances',
        'Nouveau contenu': 'Liste du contenu ajouté récemment',
        'Tickets support': 'Vue d\'ensemble des tickets de support ouverts'
    };
    
    showMessage(`${kpiType}: ${details[kpiType] || 'Détails disponibles'}`, 'info');
}

function initQuickActions() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Animation au clic
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Simuler l'action
            const actionText = this.querySelector('span:last-child').textContent;
            performQuickAction(actionText);
        });
        
        // Animation au survol
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function performQuickAction(action) {
    const actions = {
        'Ajouter contenu': 'Ouverture du formulaire d\'ajout de contenu',
        'Nouveau utilisateur': 'Création d\'un nouveau compte utilisateur',
        'Newsletter': 'Interface d\'envoi de newsletter',
        'Rapport': 'Génération d\'un nouveau rapport'
    };
    
    showMessage(`${action}: ${actions[action] || 'Action en cours...'}`, 'success');
}

function showMessage(message, type = 'info') {
    // Supprimer les messages existants
    const existingMessages = document.querySelectorAll('.admin-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Créer le nouveau message
    const messageEl = document.createElement('div');
    messageEl.className = 'admin-message';
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getMessageColor(type)};
        color: ${type === 'info' ? '#000' : '#fff'};
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        border: 1px solid ${getMessageBorderColor(type)};
    `;
    
    messageEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">${getMessageIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageEl);
    
    // Supprimer le message après 4 secondes
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 4000);
}

function getMessageColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #4CAF50, #45a049)',
        error: 'linear-gradient(135deg, #f44336, #d32f2f)',
        warning: 'linear-gradient(135deg, #ff9800, #f57c00)',
        info: 'linear-gradient(135deg, #FF8C00, #FFA500)'
    };
    return colors[type] || colors.info;
}

function getMessageBorderColor(type) {
    const colors = {
        success: 'rgba(76, 175, 80, 0.3)',
        error: 'rgba(244, 67, 54, 0.3)',
        warning: 'rgba(255, 152, 0, 0.3)',
        info: 'rgba(255, 140, 0, 0.3)'
    };
    return colors[type] || colors.info;
}

function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar && mainContent) {
        // État initial du menu (ouvert par défaut)
        let isCollapsed = false;
        
        menuToggle.addEventListener('click', function() {
            isCollapsed = !isCollapsed;
            
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('sidebar-collapsed');
                this.innerHTML = '<span>☰</span>';
                this.title = 'Afficher le menu';
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('sidebar-collapsed');
                this.innerHTML = '<span>✕</span>';
                this.title = 'Masquer le menu';
            }
            
            // Animation du bouton
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
        
        // État initial du bouton
        menuToggle.innerHTML = '<span>✕</span>';
        menuToggle.title = 'Masquer le menu';
    }
}

function getMessageIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// Fonction utilitaire pour simuler les données en temps réel
function simulateRealTimeData() {
    setInterval(() => {
        // Simuler la mise à jour des KPIs
        updateKPIValues();
        
        // Simuler les nouvelles notifications
        if (Math.random() < 0.1) { // 10% de chance chaque seconde
            updateNotificationBadge();
        }
    }, 1000);
}

function updateKPIValues() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    
    kpiValues.forEach(value => {
        if (Math.random() < 0.05) { // 5% de chance de mise à jour
            const currentValue = value.textContent;
            
            // Animation de mise à jour
            value.style.transform = 'scale(1.1)';
            value.style.color = '#FF8C00';
            
            setTimeout(() => {
                value.style.transform = 'scale(1)';
                value.style.color = '#fff';
            }, 300);
        }
    });
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + 1;
        
        // Animation de la badge
        badge.style.transform = 'scale(1.3)';
        badge.style.background = '#FF8C00';
        
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
            badge.style.background = '#E60012';
        }, 300);
    }
}

// Initialiser les données en temps réel
setTimeout(() => {
    simulateRealTimeData();
}, 2000);
