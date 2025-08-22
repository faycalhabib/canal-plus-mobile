// Historique JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page d'historique
    initHistoryPage();
    
    // Initialisation des filtres
    initFilters();
    
    // Initialisation des vues
    initViewOptions();
    
    // Initialisation des actions
    initActions();
});

// Initialisation de la page d'historique
function initHistoryPage() {
    loadHistoryData();
    updateStats();
}

// Charger les données d'historique
function loadHistoryData() {
    const historyData = getHistoryData();
    displayHistory(historyData);
}

// Récupérer les données d'historique (simulation)
function getHistoryData() {
    const stored = localStorage.getItem('watchHistory');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Données d'exemple
    return [
        {
            id: 1,
            title: "Le Seigneur des Anneaux",
            type: "movie",
            duration: 178,
            watchedAt: new Date(2025, 0, 18),
            progress: 100,
            watchTime: 178,
            thumbnail: ""
        },
        {
            id: 2,
            title: "Breaking Bad - S01E01",
            type: "series",
            duration: 47,
            watchedAt: new Date(2025, 0, 17),
            progress: 85,
            watchTime: 40,
            thumbnail: ""
        },
        {
            id: 3,
            title: "Match PSG vs Real Madrid",
            type: "sport",
            duration: 120,
            watchedAt: new Date(2025, 0, 16),
            progress: 100,
            watchTime: 120,
            thumbnail: ""
        },
        {
            id: 4,
            title: "Journal de 20h",
            type: "news",
            duration: 30,
            watchedAt: new Date(2025, 0, 15),
            progress: 100,
            watchTime: 30,
            thumbnail: ""
        },
        {
            id: 5,
            title: "Planète Terre",
            type: "documentary",
            duration: 60,
            watchedAt: new Date(2025, 0, 14),
            progress: 45,
            watchTime: 27,
            thumbnail: ""
        }
    ];
}

// Afficher l'historique
function displayHistory(data) {
    const historyContent = document.getElementById('historyContent');
    const emptyState = document.getElementById('emptyState');
    
    if (data.length === 0) {
        historyContent.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    historyContent.innerHTML = '';
    
    data.forEach(item => {
        const itemElement = createHistoryItem(item);
        historyContent.appendChild(itemElement);
    });
}

// Créer un élément d'historique
function createHistoryItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'history-item';
    itemDiv.setAttribute('data-id', item.id);
    
    const typeLabels = {
        movie: 'Film',
        series: 'Série',
        sport: 'Sport',
        news: 'Actualités',
        documentary: 'Documentaire'
    };
    
    const statusClass = item.progress === 100 ? 'completed' : item.progress > 0 ? 'in-progress' : 'not-started';
    
    itemDiv.innerHTML = `
        <div class="item-thumbnail">
            <div class="play-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5,3 19,12 5,21 5,3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>
                </svg>
            </div>
        </div>
        <div class="item-info">
            <div class="item-title">${item.title}</div>
            <div class="item-details">
                <span class="item-type">${typeLabels[item.type]}</span>
                <span class="item-duration">${item.duration} min</span>
                <span class="item-date">${formatDate(item.watchedAt)}</span>
            </div>
            <div class="progress-info">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${item.progress}%"></div>
                </div>
                <span class="progress-text">${item.progress}%</span>
            </div>
        </div>
        <div class="item-actions">
            <button class="action-btn primary" onclick="continueWatching(${item.id})">
                ${item.progress === 100 ? 'Revoir' : 'Continuer'}
            </button>
            <button class="action-btn" onclick="addToFavorites(${item.id})">Favoris</button>
            <button class="action-btn danger" onclick="removeFromHistory(${item.id})">Supprimer</button>
        </div>
    `;
    
    return itemDiv;
}

// Mettre à jour les statistiques
function updateStats() {
    const historyData = getHistoryData();
    
    const totalWatched = historyData.length;
    const totalTime = historyData.reduce((sum, item) => sum + item.watchTime, 0);
    const completedCount = historyData.filter(item => item.progress === 100).length;
    const inProgressCount = historyData.filter(item => item.progress > 0 && item.progress < 100).length;
    
    document.getElementById('totalWatched').textContent = totalWatched;
    document.getElementById('totalTime').textContent = formatTime(totalTime);
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('inProgressCount').textContent = inProgressCount;
}

// Formater le temps
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
}

// Formater une date
function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Aujourd\'hui';
    } else if (diffDays === 2) {
        return 'Hier';
    } else if (diffDays <= 7) {
        return `Il y a ${diffDays - 1} jours`;
    } else {
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short' 
        });
    }
}

// Initialisation des filtres
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const periodFilter = document.getElementById('periodFilter');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    searchInput.addEventListener('input', applyFilters);
    periodFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
}

// Appliquer les filtres
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const periodFilter = document.getElementById('periodFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredData = getHistoryData();
    
    // Filtre de recherche
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.title.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtre de période
    if (periodFilter !== 'all') {
        const now = new Date();
        filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.watchedAt);
            switch(periodFilter) {
                case 'today':
                    return itemDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return itemDate >= weekAgo;
                case 'month':
                    return itemDate.getMonth() === now.getMonth() && 
                           itemDate.getFullYear() === now.getFullYear();
                case 'year':
                    return itemDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }
    
    // Filtre de type
    if (typeFilter !== 'all') {
        filteredData = filteredData.filter(item => item.type === typeFilter);
    }
    
    // Filtre de statut
    if (statusFilter !== 'all') {
        filteredData = filteredData.filter(item => {
            switch(statusFilter) {
                case 'completed':
                    return item.progress === 100;
                case 'in_progress':
                    return item.progress > 0 && item.progress < 100;
                case 'not_started':
                    return item.progress === 0;
                default:
                    return true;
            }
        });
    }
    
    displayHistory(filteredData);
}

// Initialisation des options de vue
function initViewOptions() {
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const historyContent = document.getElementById('historyContent');
    
    listViewBtn.addEventListener('click', function() {
        setActiveView('list');
        historyContent.className = 'history-content list-view';
        updateHistoryItems('list');
    });
    
    gridViewBtn.addEventListener('click', function() {
        setActiveView('grid');
        historyContent.className = 'history-content grid-view';
        updateHistoryItems('grid');
    });
    
    // Vue par défaut
    historyContent.className = 'history-content list-view';
}

// Définir la vue active
function setActiveView(view) {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => btn.classList.remove('active'));
    
    if (view === 'list') {
        document.getElementById('listViewBtn').classList.add('active');
    } else {
        document.getElementById('gridViewBtn').classList.add('active');
    }
}

// Mettre à jour les éléments d'historique selon la vue
function updateHistoryItems(view) {
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach(item => {
        if (view === 'grid') {
            item.classList.add('grid-item');
        } else {
            item.classList.remove('grid-item');
        }
    });
}

// Initialisation des actions
function initActions() {
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    clearAllBtn.addEventListener('click', function() {
        showClearAllModal();
    });
}

// Afficher la modal de suppression complète
function showClearAllModal() {
    const modal = document.createElement('div');
    modal.className = 'clear-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h3>Effacer tout l'historique</h3>
            <p>Cette action supprimera définitivement tout votre historique de visionnage. Cette action est irréversible.</p>
            <div class="modal-actions">
                <button class="modal-btn cancel" id="cancelClear">Annuler</button>
                <button class="modal-btn danger" id="confirmClear">Tout effacer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const cancelBtn = modal.querySelector('#cancelClear');
    const confirmBtn = modal.querySelector('#confirmClear');
    
    cancelBtn.addEventListener('click', () => modal.remove());
    confirmBtn.addEventListener('click', () => {
        clearAllHistory();
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

// Effacer tout l'historique
function clearAllHistory() {
    localStorage.removeItem('watchHistory');
    loadHistoryData();
    updateStats();
    showSuccess('Historique effacé avec succès');
}

// Actions sur les éléments
function continueWatching(itemId) {
    showInfo(`Reprise de la lecture du contenu ${itemId}`);
    // Ici on redirigerait vers le lecteur vidéo
}

function addToFavorites(itemId) {
    showSuccess(`Contenu ${itemId} ajouté aux favoris`);
}

function removeFromHistory(itemId) {
    const historyData = getHistoryData();
    const filteredData = historyData.filter(item => item.id !== itemId);
    
    localStorage.setItem('watchHistory', JSON.stringify(filteredData));
    loadHistoryData();
    updateStats();
    showSuccess('Élément supprimé de l\'historique');
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

// Styles pour les modals
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .clear-modal {
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
        color: #E60012;
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
        background: #E60012;
        color: white;
    }
    
    .modal-btn.danger:hover {
        background: #ff1a2e;
    }
`;
document.head.appendChild(style);
