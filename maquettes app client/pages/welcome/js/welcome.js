// Welcome Screen JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Version detection
    const appVersion = document.getElementById('appVersion');
    const version = getAppVersion();
    appVersion.textContent = version;
    
    // Animation des feature cards
    initFeatureAnimations();
    
    // Gestion des boutons
    initButtonHandlers();
    
    // Parallax effect léger
    initParallaxEffect();
});

// Fonction de détection de version (même que splash)
function getAppVersion() {
    const buildDate = new Date();
    const year = buildDate.getFullYear();
    const month = String(buildDate.getMonth() + 1).padStart(2, '0');
    const day = String(buildDate.getDate()).padStart(2, '0');
    
    const major = 1;
    const minor = 0;
    const patch = parseInt(`${year}${month}${day}`) % 100;
    
    return `${major}.${minor}.${patch}`;
}

// Animation des feature cards avec intersection observer
function initFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    featureCards.forEach(card => {
        observer.observe(card);
    });
}

// Gestion des clics sur les boutons
function initButtonHandlers() {
    const startBtn = document.getElementById('startBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    // Bouton Commencer
    startBtn.addEventListener('click', function() {
        // Animation ripple
        createRippleEffect(this);
        
        // Transition vers choix d'authentification
        setTimeout(() => {
            window.location.href = '../../auth/html/choix.html';
        }, 300);
    });
    
    // Bouton Se connecter
    loginBtn.addEventListener('click', function() {
        // Transition vers connexion directe
        setTimeout(() => {
            window.location.href = '../../auth/html/connexion.html';
        }, 200);
    });
}

// Effet ripple sur les boutons
function createRippleEffect(button) {
    const ripple = button.querySelector('.btn-ripple');
    if (ripple) {
        ripple.style.width = '0';
        ripple.style.height = '0';
        
        setTimeout(() => {
            ripple.style.width = '300px';
            ripple.style.height = '300px';
        }, 10);
    }
}

// Effet parallax léger sur scroll
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const tvMockup = document.querySelector('.tv-mockup');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (tvMockup) {
            tvMockup.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Animation au hover des feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.feature-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.feature-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Easter egg - double clic sur le logo
document.querySelector('.header-logo').addEventListener('dblclick', function() {
    this.style.animation = 'none';
    setTimeout(() => {
        this.style.animation = 'bounce 0.6s ease-in-out';
    }, 10);
    
    // Affichage message secret
    const secretMsg = document.createElement('div');
    secretMsg.textContent = '🎉 Canal+ Premium Unlocked!';
    secretMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(230,0,18,0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1000;
        animation: fadeInOut 2s ease-in-out;
    `;
    
    document.body.appendChild(secretMsg);
    setTimeout(() => {
        document.body.removeChild(secretMsg);
    }, 2000);
});

// Style pour l'animation fadeInOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style);
