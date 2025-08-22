// Content Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initContentPage();
    initNavigation();
    initSearch();
    initFilters();
    initViewToggle();
    initUpload();
    initPagination();
    initModal();
    initTime();
    initMenuToggle();
    generateSampleContent();
});

// Sample content data
let contentData = [];
let filteredContent = [];
let currentPage = 1;
const contentPerPage = 24;
let currentView = 'grid';
let sortBy = 'title';

function initContentPage() {
    console.log('Page de gestion du contenu initialisée');
    
    // Animation d'entrée
    const elements = document.querySelectorAll('.stat-card, .content-grid');
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
    const searchInput = document.getElementById('contentSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterContent();
        });
    }
}

function initFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const filterMenu = document.getElementById('filterMenu');
    const filterToggle = document.getElementById('filterToggle');
    const filterClose = document.getElementById('filterClose');
    const filterReset = document.getElementById('filterReset');
    const filterApply = document.getElementById('filterApply');
    const sortSelect = document.getElementById('sortSelect');
    
    let filtersVisible = true;
    
    if (filterBtn && filterMenu) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterMenu.classList.toggle('hidden');
            this.classList.toggle('active');
        });
        
        if (filterClose) {
            filterClose.addEventListener('click', function() {
                filterMenu.classList.add('hidden');
                filterBtn.classList.remove('active');
            });
        }
        
        document.addEventListener('click', function() {
            filterMenu.classList.add('hidden');
            filterBtn.classList.remove('active');
        });
        
        filterMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        const filterCheckboxes = filterMenu.querySelectorAll('input[type="checkbox"]');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateFilterCount();
            });
        });
        
        if (filterReset) {
            filterReset.addEventListener('click', function() {
                filterCheckboxes.forEach(checkbox => {
                    checkbox.checked = checkbox.value === 'movie' || checkbox.value === 'series' || 
                                     checkbox.value === 'live' || checkbox.value === 'published' || 
                                     checkbox.value === '4k' || checkbox.value === 'hd';
                });
                updateFilterCount();
                filterContent();
            });
        }
        
        if (filterApply) {
            filterApply.addEventListener('click', function() {
                filterContent();
                filterMenu.classList.add('hidden');
                filterBtn.classList.remove('active');
            });
        }
    }
    
    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            filtersVisible = !filtersVisible;
            const contentGrid = document.getElementById('contentGrid');
            
            if (filtersVisible) {
                contentGrid.classList.remove('filters-hidden');
                this.innerHTML = '<span>👁️</span>';
                this.title = 'Masquer les filtres';
                this.classList.remove('active');
            } else {
                contentGrid.classList.add('filters-hidden');
                this.innerHTML = '<span>🙈</span>';
                this.title = 'Afficher les filtres';
                this.classList.add('active');
            }
            
            // Animation du bouton
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortBy = this.value;
            sortContent();
        });
    }
    
    // Initialiser le compteur de filtres
    updateFilterCount();
    initActionButtons();
}

function initActionButtons() {
    const addContentBtn = document.getElementById('addContentBtn');
    const bulkPublishBtn = document.getElementById('bulkPublishBtn');
    const bulkArchiveBtn = document.getElementById('bulkArchiveBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    if (addContentBtn) {
        addContentBtn.addEventListener('click', function() {
            openUploadModal();
        });
    }
    
    if (bulkPublishBtn) {
        bulkPublishBtn.addEventListener('click', function() {
            bulkAction('publish');
        });
    }
    
    if (bulkArchiveBtn) {
        bulkArchiveBtn.addEventListener('click', function() {
            bulkAction('archive');
        });
    }
    
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', function() {
            bulkAction('delete');
        });
    }
}

function initViewToggle() {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const contentGrid = document.getElementById('contentGrid');
    
    if (gridViewBtn && listViewBtn && contentGrid) {
        gridViewBtn.addEventListener('click', function() {
            currentView = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            contentGrid.classList.remove('list-view');
            renderContent();
        });
        
        listViewBtn.addEventListener('click', function() {
            currentView = 'list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            contentGrid.classList.add('list-view');
            renderContent();
        });
    }
}

function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadSave = document.getElementById('uploadSave');
    const uploadCancel = document.getElementById('uploadCancel');
    const uploadModalClose = document.getElementById('uploadModalClose');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
        
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }
    
    if (uploadSave) {
        uploadSave.addEventListener('click', function() {
            saveNewContent();
        });
    }
    
    if (uploadCancel) {
        uploadCancel.addEventListener('click', function() {
            closeUploadModal();
        });
    }
    
    if (uploadModalClose) {
        uploadModalClose.addEventListener('click', function() {
            closeUploadModal();
        });
    }
}

function initPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderContent();
                updatePagination();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredContent.length / contentPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderContent();
                updatePagination();
            }
        });
    }
}

function initModal() {
    const modal = document.getElementById('contentModal');
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

function generateSampleContent() {
    const titles = [
        'Le Parrain', 'Pulp Fiction', 'Le Seigneur des Anneaux', 'Matrix', 'Gladiator',
        'Inception', 'Interstellar', 'The Dark Knight', 'Forrest Gump', 'Titanic',
        'Avatar', 'Star Wars', 'Jurassic Park', 'Terminator', 'Alien',
        'Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Crown', 'Narcos'
    ];
    
    const types = ['movie', 'series', 'live', 'sport'];
    const statuses = ['published', 'pending', 'scheduled', 'archived'];
    const qualities = ['4k', 'hd', 'sd'];
    const genres = ['Action', 'Drame', 'Comédie', 'Thriller', 'Sci-Fi'];
    
    for (let i = 0; i < 100; i++) {
        const title = titles[Math.floor(Math.random() * titles.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        const genre = genres[Math.floor(Math.random() * genres.length)];
        
        contentData.push({
            id: i + 1,
            title: `${title} ${i > 19 ? 'S' + Math.floor(i/20) : ''}`,
            type: type,
            status: status,
            quality: quality,
            genre: genre,
            rating: (Math.random() * 5).toFixed(1),
            views: Math.floor(Math.random() * 1000000),
            duration: Math.floor(Math.random() * 180) + 60,
            description: `Description captivante pour ${title}.`,
            releaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            addedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
    }
    
    filteredContent = [...contentData];
    sortContent();
    renderContent();
    updatePagination();
    updateStats();
}

function filterContent() {
    const searchQuery = document.getElementById('contentSearch').value.toLowerCase().trim();
    const typeFilters = getCheckedFilters('type');
    const statusFilters = getCheckedFilters('status');
    const qualityFilters = getCheckedFilters('quality');
    
    filteredContent = contentData.filter(content => {
        const matchesSearch = !searchQuery || 
            content.title.toLowerCase().includes(searchQuery) ||
            content.genre.toLowerCase().includes(searchQuery);
        
        const matchesType = typeFilters.length === 0 || typeFilters.includes(content.type);
        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(content.status);
        const matchesQuality = qualityFilters.length === 0 || qualityFilters.includes(content.quality);
        
        return matchesSearch && matchesType && matchesStatus && matchesQuality;
    });
    
    currentPage = 1;
    sortContent();
    renderContent();
    updatePagination();
}

function updateFilterCount() {
    const filterCount = document.getElementById('filterCount');
    if (!filterCount) return;
    
    const allCheckboxes = document.querySelectorAll('#filterMenu input[type="checkbox"]');
    const checkedCount = document.querySelectorAll('#filterMenu input[type="checkbox"]:checked').length;
    const totalCount = allCheckboxes.length;
    
    if (checkedCount === totalCount) {
        // Tous les filtres sont cochés - pas de filtrage actif
        filterCount.classList.add('hidden');
        filterCount.textContent = '0';
    } else {
        // Certains filtres sont décochés - filtrage actif
        const activeFilters = totalCount - checkedCount;
        filterCount.classList.remove('hidden');
        filterCount.textContent = activeFilters.toString();
    }
}

function getCheckedFilters(type) {
    const filterMap = {
        'type': ['movie', 'series', 'live', 'sport'],
        'status': ['published', 'pending', 'scheduled', 'archived'],
        'quality': ['4k', 'hd', 'sd']
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

function sortContent() {
    filteredContent.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (sortBy === 'date') {
            aValue = new Date(a.addedDate);
            bValue = new Date(b.addedDate);
            return bValue - aValue;
        }
        
        if (sortBy === 'popularity') {
            return b.views - a.views;
        }
        
        if (sortBy === 'rating') {
            return b.rating - a.rating;
        }
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
    });
}

function renderContent() {
    const contentGrid = document.getElementById('contentGrid');
    if (!contentGrid) return;
    
    const startIndex = (currentPage - 1) * contentPerPage;
    const endIndex = startIndex + contentPerPage;
    const pageContent = filteredContent.slice(startIndex, endIndex);
    
    contentGrid.innerHTML = '';
    
    pageContent.forEach(content => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="content-thumbnail">
                <div class="content-placeholder">${getContentIcon(content.type)}</div>
                <div class="content-overlay">
                    <div class="play-button">▶️</div>
                </div>
            </div>
            <div class="content-info">
                <div class="content-header">
                    <h3 class="content-title">${content.title}</h3>
                    <input type="checkbox" class="content-checkbox" data-content-id="${content.id}">
                </div>
                <div class="content-meta">
                    <span class="content-badge ${content.type}">${getTypeLabel(content.type)}</span>
                    <span class="content-badge ${content.status}">${getStatusLabel(content.status)}</span>
                    <span class="quality-badge">${content.quality.toUpperCase()}</span>
                </div>
                <p class="content-description">${content.description}</p>
                <div class="content-footer">
                    <div class="content-stats">
                        <span>⭐ ${content.rating}</span>
                        <span>👁️ ${formatNumber(content.views)}</span>
                        <span>⏱️ ${content.duration}min</span>
                    </div>
                    <div class="content-actions">
                        <button class="action-btn view" onclick="viewContent(${content.id})" title="Voir">👁️</button>
                        <button class="action-btn edit" onclick="editContent(${content.id})" title="Modifier">✏️</button>
                        <button class="action-btn delete" onclick="deleteContent(${content.id})" title="Supprimer">🗑️</button>
                    </div>
                </div>
            </div>
        `;
        contentGrid.appendChild(card);
    });
    
    const checkboxes = contentGrid.querySelectorAll('.content-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateBulkActions();
        });
    });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredContent.length / contentPerPage);
    const startIndex = (currentPage - 1) * contentPerPage + 1;
    const endIndex = Math.min(currentPage * contentPerPage, filteredContent.length);
    
    document.getElementById('showingFrom').textContent = startIndex;
    document.getElementById('showingTo').textContent = endIndex;
    document.getElementById('totalContent').textContent = filteredContent.length.toLocaleString();
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    
    const paginationNumbers = document.getElementById('paginationNumbers');
    if (paginationNumbers) {
        paginationNumbers.innerHTML = '';
        
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function() {
                currentPage = i;
                renderContent();
                updatePagination();
            });
            paginationNumbers.appendChild(pageBtn);
        }
    }
}

function updateBulkActions() {
    const checkboxes = document.querySelectorAll('.content-checkbox:checked');
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
    const totalContent = contentData.length;
    const publishedContent = contentData.filter(c => c.status === 'published').length;
    const pendingContent = contentData.filter(c => c.status === 'pending').length;
    const liveContent = contentData.filter(c => c.type === 'live').length;
    
    animateNumber(document.querySelector('.stat-card:nth-child(1) .stat-value'), totalContent);
    animateNumber(document.querySelector('.stat-card:nth-child(2) .stat-value'), publishedContent);
    animateNumber(document.querySelector('.stat-card:nth-child(3) .stat-value'), pendingContent);
    animateNumber(document.querySelector('.stat-card:nth-child(4) .stat-value'), liveContent);
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

function getContentIcon(type) {
    const icons = {
        movie: '🎬',
        series: '📺',
        live: '🔴',
        sport: '⚽'
    };
    return icons[type] || '🎬';
}

function getTypeLabel(type) {
    const labels = {
        movie: 'Film',
        series: 'Série',
        live: 'Live',
        sport: 'Sport'
    };
    return labels[type] || type;
}

function getStatusLabel(status) {
    const labels = {
        published: 'Publié',
        pending: 'En attente',
        scheduled: 'Programmé',
        archived: 'Archivé'
    };
    return labels[status] || status;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Actions de contenu
function viewContent(contentId) {
    const content = contentData.find(c => c.id === contentId);
    if (!content) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 200px 1fr; gap: 30px;">
            <div class="content-preview">
                <div style="width: 200px; height: 120px; background: linear-gradient(135deg, #333, #222); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 15px;">
                    ${getContentIcon(content.type)}
                </div>
                <div style="text-align: center;">
                    <span class="quality-badge">${content.quality.toUpperCase()}</span>
                </div>
            </div>
            <div class="content-details">
                <h2 style="color: #FF8C00; margin: 0 0 20px 0;">${content.title}</h2>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <div>
                        <p><strong>Type:</strong> <span class="content-badge ${content.type}">${getTypeLabel(content.type)}</span></p>
                        <p><strong>Statut:</strong> <span class="content-badge ${content.status}">${getStatusLabel(content.status)}</span></p>
                        <p><strong>Genre:</strong> ${content.genre}</p>
                        <p><strong>Durée:</strong> ${content.duration} minutes</p>
                    </div>
                    <div>
                        <p><strong>Note:</strong> ⭐ ${content.rating}/5</p>
                        <p><strong>Vues:</strong> 👁️ ${formatNumber(content.views)}</p>
                        <p><strong>Description:</strong> ${content.description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    openModal();
}

function editContent(contentId) {
    showMessage(`Édition du contenu ID: ${contentId}`, 'info');
}

function deleteContent(contentId) {
    const content = contentData.find(c => c.id === contentId);
    if (!content) return;
    
    if (confirm(`Supprimer "${content.title}" ?`)) {
        const index = contentData.findIndex(c => c.id === contentId);
        if (index > -1) {
            contentData.splice(index, 1);
            filterContent();
            updateStats();
            showMessage('Contenu supprimé', 'success');
        }
    }
}

function bulkAction(action) {
    const selectedCheckboxes = document.querySelectorAll('.content-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.contentId));
    
    if (selectedIds.length === 0) return;
    
    let message = '';
    switch (action) {
        case 'publish':
            message = `Publication de ${selectedIds.length} contenu(s)`;
            selectedIds.forEach(id => {
                const content = contentData.find(c => c.id === id);
                if (content) content.status = 'published';
            });
            break;
        case 'archive':
            message = `Archivage de ${selectedIds.length} contenu(s)`;
            selectedIds.forEach(id => {
                const content = contentData.find(c => c.id === id);
                if (content) content.status = 'archived';
            });
            break;
        case 'delete':
            if (!confirm(`Supprimer ${selectedIds.length} contenu(s) ?`)) return;
            message = `Suppression de ${selectedIds.length} contenu(s)`;
            selectedIds.forEach(id => {
                const index = contentData.findIndex(c => c.id === id);
                if (index > -1) contentData.splice(index, 1);
            });
            break;
    }
    
    showMessage(message, 'success');
    filterContent();
    updateStats();
    updateBulkActions();
}

function handleFiles(files) {
    if (files.length > 0) {
        const uploadArea = document.getElementById('uploadArea');
        const uploadForm = document.getElementById('uploadForm');
        
        uploadArea.classList.add('hidden');
        uploadForm.classList.remove('hidden');
        
        const firstFile = files[0];
        const titleInput = document.getElementById('contentTitle');
        if (titleInput) {
            titleInput.value = firstFile.name.replace(/\.[^/.]+$/, "");
        }
    }
}

function saveNewContent() {
    const title = document.getElementById('contentTitle').value;
    const type = document.getElementById('contentType').value;
    const genre = document.getElementById('contentGenre').value;
    const description = document.getElementById('contentDescription').value;
    
    if (!title.trim()) {
        showMessage('Le titre est requis', 'error');
        return;
    }
    
    const newContent = {
        id: Math.max(...contentData.map(c => c.id)) + 1,
        title: title,
        type: type,
        status: 'pending',
        quality: 'hd',
        genre: genre || 'Divers',
        rating: 0,
        views: 0,
        duration: Math.floor(Math.random() * 120) + 60,
        description: description || 'Nouveau contenu',
        releaseDate: new Date(),
        addedDate: new Date()
    };
    
    contentData.unshift(newContent);
    filterContent();
    updateStats();
    closeUploadModal();
    showMessage('Contenu ajouté!', 'success');
}

function openModal() {
    const modal = document.getElementById('contentModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('contentModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function openUploadModal() {
    const modal = document.getElementById('uploadModal');
    const uploadArea = document.getElementById('uploadArea');
    const uploadForm = document.getElementById('uploadForm');
    
    if (modal) {
        uploadArea.classList.remove('hidden');
        uploadForm.classList.add('hidden');
        
        document.getElementById('contentTitle').value = '';
        document.getElementById('contentType').value = 'movie';
        document.getElementById('contentGenre').value = '';
        document.getElementById('contentDescription').value = '';
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
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

function showMessage(message, type = 'info') {
    const existingMessages = document.querySelectorAll('.admin-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageEl = document.createElement('div');
    messageEl.className = 'admin-message';
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#FF8C00'};
        color: #fff;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        max-width: 400px;
    `;
    
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 4000);
}
