// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    initNavigation();
    initUserMenu();
    initSearch();
    initContentCarousels();
    updateCurrentTime();
    
    // Update time every minute
    setInterval(updateCurrentTime, 60000);
});

function initDashboard() {
    // Load user data
    loadUserData();
    
    // Load content data
    loadContentData();
    
    // Set default active section
    showSection('home');
}

function loadUserData() {
    // Simulate user data (in real app, this would come from API)
    const userData = {
        name: 'Fayçal Habibahmat',
        avatar: 'FH',
        subscription: 'Canal+ Premium',
        lastWatched: 'The Last of Us - S01E05'
    };
    
    // Update greeting
    const greeting = document.querySelector('.user-greeting h2');
    const timeGreeting = getTimeGreeting();
    if (greeting) {
        greeting.textContent = `${timeGreeting}, ${userData.name.split(' ')[0]}`;
    }
    
    // Update avatar
    const avatar = document.querySelector('.avatar-circle');
    if (avatar) {
        avatar.textContent = userData.avatar;
    }
    
    // Store user data for other functions
    window.userData = userData;
}

function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
}

function updateCurrentTime() {
    const timeElement = document.querySelector('.user-greeting p');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        timeElement.textContent = `Il est ${timeString}`;
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get section from data attribute or href
            const section = this.getAttribute('data-section') || this.getAttribute('href').replace('#', '');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update page title
    updatePageTitle(sectionName);
}

function updatePageTitle(section) {
    const titles = {
        'home': 'Accueil - Canal+',
        'live': 'En Direct - Canal+',
        'movies': 'Films - Canal+',
        'series': 'Séries - Canal+',
        'sport': 'Sport - Canal+'
    };
    
    document.title = titles[section] || 'Dashboard - Canal+';
}

function initUserMenu() {
    const userAvatar = document.querySelector('.user-avatar');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.add('hidden');
        });
        
        // Handle dropdown items
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const action = this.getAttribute('data-action');
                handleUserAction(action);
            });
        });
    }
}

function handleUserAction(action) {
    switch(action) {
        case 'profile':
            window.location.href = '../profil/html/profil.html';
            break;
        case 'subscription':
            window.location.href = '../abonnement/html/abonnement.html';
            break;
        case 'history':
            window.location.href = '../historique/html/historique.html';
            break;
        case 'settings':
            window.location.href = '../parametres/html/parametres.html';
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            console.log('Action non gérée:', action);
    }
}

function handleLogout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // Clear user data
        localStorage.removeItem('userData');
        localStorage.removeItem('userSettings');
        
        // Redirect to login
        window.location.href = '../auth/html/connexion.html';
    }
}

function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', function() {
            searchOverlay.classList.remove('hidden');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });
    }
    
    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', function() {
            searchOverlay.classList.add('hidden');
            if (searchInput) {
                searchInput.value = '';
            }
        });
    }
    
    // Close search on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay && !searchOverlay.classList.contains('hidden')) {
            searchOverlay.classList.add('hidden');
            if (searchInput) {
                searchInput.value = '';
            }
        }
    });
    
    // Handle search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                performSearch(query);
            } else {
                clearSearchResults();
            }
        });
    }
}

function performSearch(query) {
    // Simulate search results
    const searchResults = [
        { title: 'The Last of Us', type: 'Série', category: 'Drama' },
        { title: 'House of the Dragon', type: 'Série', category: 'Fantasy' },
        { title: 'Top Gun: Maverick', type: 'Film', category: 'Action' },
        { title: 'Stranger Things', type: 'Série', category: 'Sci-Fi' },
        { title: 'Avatar: The Way of Water', type: 'Film', category: 'Sci-Fi' }
    ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(searchResults);
}

function displaySearchResults(results) {
    const searchResultsContainer = document.querySelector('.search-results');
    if (!searchResultsContainer) return;
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);">
                <p>Aucun résultat trouvé</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result-item" style="padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer; transition: background 0.3s ease;">
            <h4 style="color: white; margin-bottom: 5px; font-size: 16px;">${result.title}</h4>
            <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px;">${result.type} • ${result.category}</p>
        </div>
    `).join('');
    
    searchResultsContainer.innerHTML = resultsHTML;
    
    // Add hover effects
    const resultItems = searchResultsContainer.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
        item.addEventListener('click', function() {
            // Handle result click
            console.log('Résultat sélectionné:', this.querySelector('h4').textContent);
        });
    });
}

function clearSearchResults() {
    const searchResultsContainer = document.querySelector('.search-results');
    if (searchResultsContainer) {
        searchResultsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);">
                <p>Commencez à taper pour rechercher...</p>
            </div>
        `;
    }
}

function initContentCarousels() {
    // Add scroll behavior to carousels
    const carousels = document.querySelectorAll('.content-carousel');
    
    carousels.forEach(carousel => {
        // Add mouse wheel horizontal scrolling
        carousel.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            }
        });
    });
}

function loadContentData() {
    // Simulate content data
    const contentData = {
        continueWatching: [
            { title: 'The Last of Us', subtitle: 'S01E05', progress: 65, duration: '54 min' },
            { title: 'House of the Dragon', subtitle: 'S01E08', progress: 23, duration: '68 min' },
            { title: 'Succession', subtitle: 'S04E03', progress: 89, duration: '59 min' },
            { title: 'The Bear', subtitle: 'S02E07', progress: 12, duration: '28 min' }
        ],
        recommended: [
            { title: 'Wednesday', subtitle: 'Série • 2022', rating: '8.1' },
            { title: 'Top Gun: Maverick', subtitle: 'Film • 2022', rating: '8.3' },
            { title: 'Stranger Things', subtitle: 'Série • 2022', rating: '8.7' },
            { title: 'Everything Everywhere', subtitle: 'Film • 2022', rating: '7.8' }
        ],
        newContent: [
            { title: 'Avatar 2', subtitle: 'Nouveau film', badge: 'NOUVEAU' },
            { title: 'The Menu', subtitle: 'Thriller • 2022', badge: 'NOUVEAU' },
            { title: 'Glass Onion', subtitle: 'Mystère • 2022', badge: 'NOUVEAU' },
            { title: 'Emancipation', subtitle: 'Drame • 2022', badge: 'NOUVEAU' }
        ],
        trending: [
            { title: 'Mercredi', subtitle: 'Tendance #1', trend: '↗️' },
            { title: 'The Crown', subtitle: 'Tendance #2', trend: '↗️' },
            { title: 'Emily in Paris', subtitle: 'Tendance #3', trend: '↗️' },
            { title: 'Dahmer', subtitle: 'Tendance #4', trend: '↗️' }
        ]
    };
    
    // Populate carousels
    populateCarousel('continue-watching', contentData.continueWatching, 'continue');
    populateCarousel('recommended', contentData.recommended, 'recommended');
    populateCarousel('new-content', contentData.newContent, 'new');
    populateCarousel('trending', contentData.trending, 'trending');
    
    // Populate other sections
    populateSection('live', generateLiveContent());
    populateSection('movies', generateMoviesContent());
    populateSection('series', generateSeriesContent());
    populateSection('sport', generateSportContent());
}

function populateCarousel(carouselId, data, type) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const cardsHTML = data.map(item => createContentCard(item, type)).join('');
    carousel.innerHTML = cardsHTML;
}

function createContentCard(item, type) {
    let progressHTML = '';
    let badgeHTML = '';
    let metaHTML = '';
    
    if (type === 'continue' && item.progress) {
        progressHTML = `
            <div class="progress-overlay">
                <div class="progress-bar" style="width: ${item.progress}%"></div>
            </div>
        `;
        metaHTML = `
            <div class="card-meta">
                <span>${item.progress}% regardé</span>
                <span>${item.duration}</span>
            </div>
        `;
    } else if (type === 'recommended' && item.rating) {
        metaHTML = `
            <div class="card-meta">
                <span>⭐ ${item.rating}</span>
                <span>HD</span>
            </div>
        `;
    } else if (type === 'new' && item.badge) {
        badgeHTML = `
            <div style="position: absolute; top: 10px; right: 10px; background: #E60012; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">
                ${item.badge}
            </div>
        `;
    } else if (type === 'trending' && item.trend) {
        metaHTML = `
            <div class="card-meta">
                <span>${item.trend} Tendance</span>
                <span>HD</span>
            </div>
        `;
    }
    
    return `
        <div class="content-card" onclick="playContent('${item.title}')">
            <div class="card-image">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                ${progressHTML}
                ${badgeHTML}
            </div>
            <div class="card-content">
                <div class="card-title">${item.title}</div>
                <div class="card-subtitle">${item.subtitle}</div>
                ${metaHTML}
            </div>
        </div>
    `;
}

function populateSection(sectionId, data) {
    const section = document.querySelector(`#${sectionId} .${sectionId}-grid`);
    if (!section) return;
    
    const cardsHTML = data.map(item => createGridCard(item)).join('');
    section.innerHTML = cardsHTML;
}

function createGridCard(item) {
    return `
        <div class="grid-card" onclick="playContent('${item.title}')">
            <div class="grid-card-image">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
            <div class="grid-card-content">
                <div class="grid-card-title">${item.title}</div>
                <div class="grid-card-description">${item.description}</div>
            </div>
        </div>
    `;
}

function generateLiveContent() {
    return [
        { title: 'Canal+ Sport', description: 'Match en direct • PSG vs Real Madrid' },
        { title: 'Canal+ Cinéma', description: 'Première TV • The Batman' },
        { title: 'Canal+ Série', description: 'Nouvelle saison • House of the Dragon' },
        { title: 'Canal+ Docs', description: 'Documentaire • Notre Planète' },
        { title: 'Canal+ Kids', description: 'Dessins animés • Les Indestructibles' },
        { title: 'Canal+ News', description: 'Journal • 20h00' }
    ];
}

function generateMoviesContent() {
    return [
        { title: 'Top Gun: Maverick', description: 'Action • 2022 • Tom Cruise dans la suite épique' },
        { title: 'Avatar: La Voie de l\'Eau', description: 'Sci-Fi • 2022 • Le retour sur Pandora' },
        { title: 'Black Panther: Wakanda Forever', description: 'Superhéros • 2022 • L\'héritage continue' },
        { title: 'The Batman', description: 'Action • 2022 • Robert Pattinson dans le rôle titre' },
        { title: 'Doctor Strange 2', description: 'Fantastique • 2022 • Multivers de la folie' },
        { title: 'Jurassic World: Dominion', description: 'Aventure • 2022 • La fin de la saga' }
    ];
}

function generateSeriesContent() {
    return [
        { title: 'House of the Dragon', description: 'Fantasy • 2022 • Le prequel de Game of Thrones' },
        { title: 'The Last of Us', description: 'Post-apocalyptique • 2023 • Adaptation du jeu vidéo' },
        { title: 'Wednesday', description: 'Comédie noire • 2022 • La famille Addams' },
        { title: 'Stranger Things 4', description: 'Sci-Fi • 2022 • La saison finale approche' },
        { title: 'Euphoria', description: 'Drame • 2022 • Zendaya dans un rôle saisissant' },
        { title: 'The Bear', description: 'Comédie dramatique • 2022 • Dans les cuisines de Chicago' }
    ];
}

function generateSportContent() {
    return [
        { title: 'Ligue 1', description: 'Football • PSG vs Marseille • Dimanche 21h00' },
        { title: 'Premier League', description: 'Football • Manchester United vs Liverpool' },
        { title: 'Champions League', description: 'Football • Real Madrid vs Bayern Munich' },
        { title: 'NBA', description: 'Basketball • Lakers vs Warriors • En direct' },
        { title: 'Roland Garros', description: 'Tennis • Finale messieurs • Dimanche 15h00' },
        { title: 'Formule 1', description: 'Course • Grand Prix de Monaco • Dimanche 15h00' }
    ];
}

function playContent(title) {
    // Simulate content playback
    showMessage(`Lecture de "${title}" en cours...`, 'success');
    
    // In a real app, this would navigate to the player
    console.log('Playing content:', title);
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    messageEl.textContent = message;
    
    // Add animation styles
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
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}
