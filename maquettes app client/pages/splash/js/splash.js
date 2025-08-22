// Splash Screen JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const splashContainer = document.getElementById('splashContainer');
    
    // Version detection et mise à jour
    const appVersion = document.getElementById('appVersion');
    const version = getAppVersion();
    appVersion.textContent = version;
    
    // Simulation du chargement avec progression
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 20;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            // Animation de sortie après chargement complet
            setTimeout(() => {
                splashContainer.classList.add('exit');
                
                // Transition vers la page suivante
                setTimeout(() => {
                    // Redirection vers welcome page
                    window.location.href = '../../welcome/html/welcome.html';
                }, 600);
            }, 500);
        }
    }, 200);
    
    // Fallback - transition automatique après 3.5 secondes max
    setTimeout(() => {
        if (!splashContainer.classList.contains('exit')) {
            clearInterval(loadingInterval);
            splashContainer.classList.add('exit');
            
            setTimeout(() => {
                window.location.href = '../../welcome/html/welcome.html';
            }, 600);
        }
    }, 3500);
});

// Fonction de détection de version
function getAppVersion() {
    // Version basée sur la date de build ou configuration
    const buildDate = new Date();
    const year = buildDate.getFullYear();
    const month = String(buildDate.getMonth() + 1).padStart(2, '0');
    const day = String(buildDate.getDate()).padStart(2, '0');
    
    // Version format: MAJOR.MINOR.PATCH
    const major = 1;
    const minor = 0;
    const patch = parseInt(`${year}${month}${day}`) % 100; // Patch basé sur la date
    
    return `${major}.${minor}.${patch}`;
}

// Fonction alternative pour version statique
function getStaticVersion() {
    return "1.2.5"; // Version fixe
}

// Animation supplémentaire pour le logo au clic (easter egg)
document.querySelector('.logo').addEventListener('click', function() {
    this.style.animation = 'logoScale 0.3s ease-in-out';
    setTimeout(() => {
        this.style.animation = 'logoScale 2s ease-in-out infinite alternate';
    }, 300);
});
