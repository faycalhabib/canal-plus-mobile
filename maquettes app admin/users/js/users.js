// Users Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initUsersPage();
    initNavigation();
    initSearch();
    initFilters();
    initTable();
    initPagination();
    initModal();
    initTime();
    initMenuToggle();
    generateSampleUsers();
});

// Sample users data
let usersData = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 20;
let sortColumn = 'name';
let sortDirection = 'asc';

function initUsersPage() {
    console.log('Page de gestion des utilisateurs initialisée');
    
    // Animation d'entrée
    const elements = document.querySelectorAll('.stat-card, .table-container');
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
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                const section = this.dataset.section;
                updatePageTitle(section);
                
                this.style.transform = 'translateX(10px)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
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
    }
}

function initSearch() {
    const searchInput = document.getElementById('userSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            filterUsers();
        });
    }
}

function initFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const filterMenu = document.getElementById('filterMenu');
    
    if (filterBtn && filterMenu) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', function() {
            filterMenu.classList.add('hidden');
        });
        
        filterMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Écouter les changements de filtres
        const filterCheckboxes = filterMenu.querySelectorAll('input[type="checkbox"]');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                filterUsers();
            });
        });
    }
    
    // Boutons d'action
    initActionButtons();
}

function initActionButtons() {
    const addUserBtn = document.getElementById('addUserBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            showMessage('Ouverture du formulaire de création d\'utilisateur', 'info');
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportUsers();
        });
    }
}

function initTable() {
    const selectAll = document.getElementById('selectAll');
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.user-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    // Tri des colonnes
    const sortableHeaders = document.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.dataset.sort;
            sortUsers(column);
        });
    });
}

function initPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderUsers();
                updatePagination();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderUsers();
                updatePagination();
            }
        });
    }
}

function initModal() {
    const modal = document.getElementById('userModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeModal();
        });
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', function() {
            closeModal();
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
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

function generateSampleUsers() {
    const names = [
        'Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Moreau', 'Luc Bernard',
        'Anne Petit', 'Michel Roux', 'Catherine Leroy', 'Philippe Simon', 'Isabelle Laurent',
        'François Blanc', 'Nathalie Girard', 'Alain Faure', 'Sylvie André', 'Thierry Mercier',
        'Valérie Rousseau', 'Christophe Garnier', 'Sandrine Chevalier', 'Olivier François', 'Céline Gauthier'
    ];
    
    const domains = ['gmail.com', 'outlook.fr', 'orange.fr', 'free.fr', 'hotmail.com'];
    const subscriptions = ['premium', 'standard', 'free'];
    const statuses = ['active', 'inactive', 'suspended'];
    
    for (let i = 0; i < 100; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const email = `${name.toLowerCase().replace(' ', '.')}${i}@${domains[Math.floor(Math.random() * domains.length)]}`;
        const subscription = subscriptions[Math.floor(Math.random() * subscriptions.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const lastLogin = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        usersData.push({
            id: i + 1,
            name: name,
            email: email,
            subscription: subscription,
            status: status,
            lastLogin: lastLogin,
            joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            country: Math.random() > 0.8 ? 'Belgique' : 'France'
        });
    }
    
    filteredUsers = [...usersData];
    renderUsers();
    updatePagination();
    updateStats();
}

function filterUsers() {
    const searchQuery = document.getElementById('userSearch').value.toLowerCase().trim();
    const statusFilters = getCheckedFilters('status');
    const subscriptionFilters = getCheckedFilters('subscription');
    const locationFilters = getCheckedFilters('location');
    
    filteredUsers = usersData.filter(user => {
        const matchesSearch = !searchQuery || 
            user.name.toLowerCase().includes(searchQuery) ||
            user.email.toLowerCase().includes(searchQuery);
        
        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(user.status);
        const matchesSubscription = subscriptionFilters.length === 0 || subscriptionFilters.includes(user.subscription);
        const matchesLocation = locationFilters.length === 0 || 
            (locationFilters.includes('france') && user.country === 'France') ||
            (locationFilters.includes('belgium') && user.country === 'Belgique') ||
            (locationFilters.includes('other') && !['France', 'Belgique'].includes(user.country));
        
        return matchesSearch && matchesStatus && matchesSubscription && matchesLocation;
    });
    
    currentPage = 1;
    renderUsers();
    updatePagination();
}

function getCheckedFilters(type) {
    const filterMap = {
        'status': ['active', 'inactive', 'suspended'],
        'subscription': ['premium', 'standard', 'free'],
        'location': ['france', 'belgium', 'other']
    };
    
    const values = filterMap[type] || [];
    const checked = [];
    
    values.forEach(value => {
        const checkbox = document.querySelector(`input[value="${value}"]`);
        if (checkbox && checkbox.checked) {
            checked.push(value);
        }
    });
    
    return checked;
}

function sortUsers(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    filteredUsers.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];
        
        if (column === 'lastLogin' || column === 'joinDate') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Mettre à jour l'indicateur de tri
    document.querySelectorAll('.sortable').forEach(header => {
        header.classList.remove('sorted');
        const icon = header.querySelector('.sort-icon');
        icon.textContent = '↕️';
    });
    
    const currentHeader = document.querySelector(`[data-sort="${column}"]`);
    if (currentHeader) {
        currentHeader.classList.add('sorted');
        const icon = currentHeader.querySelector('.sort-icon');
        icon.textContent = sortDirection === 'asc' ? '↑' : '↓';
    }
    
    renderUsers();
}

function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const pageUsers = filteredUsers.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="user-checkbox" data-user-id="${user.id}">
            </td>
            <td>
                <div class="user-info">
                    <div class="user-avatar">${user.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="user-details">
                        <h4>${user.name}</h4>
                        <p>ID: ${user.id}</p>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="subscription-badge ${user.subscription}">${getSubscriptionLabel(user.subscription)}</span>
            </td>
            <td>
                <span class="status-badge ${user.status}">${getStatusLabel(user.status)}</span>
            </td>
            <td>${formatDate(user.lastLogin)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewUser(${user.id})" title="Voir">👁️</button>
                    <button class="action-btn edit" onclick="editUser(${user.id})" title="Modifier">✏️</button>
                    <button class="action-btn suspend" onclick="suspendUser(${user.id})" title="Suspendre">🚫</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Ajouter les événements aux checkboxes
    const checkboxes = tbody.querySelectorAll('.user-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateBulkActions();
        });
    });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage + 1;
    const endIndex = Math.min(currentPage * usersPerPage, filteredUsers.length);
    
    // Mettre à jour les informations
    document.getElementById('showingFrom').textContent = startIndex;
    document.getElementById('showingTo').textContent = endIndex;
    document.getElementById('totalUsers').textContent = filteredUsers.length.toLocaleString();
    
    // Mettre à jour les boutons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    
    // Générer les numéros de page
    const paginationNumbers = document.getElementById('paginationNumbers');
    if (paginationNumbers) {
        paginationNumbers.innerHTML = '';
        
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function() {
                currentPage = i;
                renderUsers();
                updatePagination();
            });
            paginationNumbers.appendChild(pageBtn);
        }
    }
}

function updateBulkActions() {
    const checkboxes = document.querySelectorAll('.user-checkbox:checked');
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.querySelector('.selected-count');
    
    if (checkboxes.length > 0) {
        bulkActions.classList.remove('hidden');
        selectedCount.textContent = `${checkboxes.length} sélectionné${checkboxes.length > 1 ? 's' : ''}`;
    } else {
        bulkActions.classList.add('hidden');
    }
}

function updateStats() {
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(u => u.status === 'active').length;
    const premiumUsers = usersData.filter(u => u.subscription === 'premium').length;
    const suspendedUsers = usersData.filter(u => u.status === 'suspended').length;
    
    // Mettre à jour les statistiques avec animation
    animateNumber(document.querySelector('.stat-card:nth-child(1) .stat-value'), totalUsers);
    animateNumber(document.querySelector('.stat-card:nth-child(2) .stat-value'), activeUsers);
    animateNumber(document.querySelector('.stat-card:nth-child(3) .stat-value'), premiumUsers);
    animateNumber(document.querySelector('.stat-card:nth-child(4) .stat-value'), suspendedUsers);
}

function animateNumber(element, targetValue) {
    if (!element) return;
    
    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function getSubscriptionLabel(subscription) {
    const labels = {
        premium: 'Premium',
        standard: 'Standard',
        free: 'Gratuit'
    };
    return labels[subscription] || subscription;
}

function getStatusLabel(status) {
    const labels = {
        active: 'Actif',
        inactive: 'Inactif',
        suspended: 'Suspendu'
    };
    return labels[status] || status;
}

function formatDate(date) {
    const now = new Date();
    const diffTime = now - new Date(date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return new Date(date).toLocaleDateString('fr-FR');
}

// Actions utilisateur
function viewUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div>
                <h3 style="color: #FF8C00; margin-bottom: 15px;">Informations personnelles</h3>
                <p><strong>Nom:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Pays:</strong> ${user.country}</p>
            </div>
            <div>
                <h3 style="color: #FF8C00; margin-bottom: 15px;">Abonnement</h3>
                <p><strong>Type:</strong> <span class="subscription-badge ${user.subscription}">${getSubscriptionLabel(user.subscription)}</span></p>
                <p><strong>Statut:</strong> <span class="status-badge ${user.status}">${getStatusLabel(user.status)}</span></p>
                <p><strong>Inscription:</strong> ${formatDate(user.joinDate)}</p>
                <p><strong>Dernière connexion:</strong> ${formatDate(user.lastLogin)}</p>
            </div>
        </div>
    `;
    
    openModal();
}

function editUser(userId) {
    showMessage(`Édition de l'utilisateur ID: ${userId}`, 'info');
}

function suspendUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`Êtes-vous sûr de vouloir suspendre l'utilisateur ${user.name} ?`)) {
        user.status = user.status === 'suspended' ? 'active' : 'suspended';
        renderUsers();
        updateStats();
        showMessage(`Utilisateur ${user.status === 'suspended' ? 'suspendu' : 'réactivé'}`, 'success');
    }
}

function exportUsers() {
    const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
    const usersToExport = selectedCheckboxes.length > 0 
        ? Array.from(selectedCheckboxes).map(cb => usersData.find(u => u.id == cb.dataset.userId))
        : filteredUsers;
    
    showMessage(`Export de ${usersToExport.length} utilisateurs en cours...`, 'success');
    
    // Simuler l'export
    setTimeout(() => {
        showMessage('Export terminé avec succès!', 'success');
    }, 2000);
}

function openModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function showMessage(message, type = 'info') {
    const existingMessages = document.querySelectorAll('.admin-message');
    existingMessages.forEach(msg => msg.remove());
    
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
    
    if (!document.querySelector('#message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
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
    
    document.body.appendChild(messageEl);
    
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
            
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
        
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
