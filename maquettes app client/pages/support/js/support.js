// Support JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initContactForm();
    initSearch();
});

function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Simulate form submission
        submitContactForm(data);
    });
}

function validateForm(data) {
    const required = ['firstName', 'lastName', 'email', 'subject', 'message'];
    const missing = required.filter(field => !data[field] || data[field].trim() === '');
    
    if (missing.length > 0) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'error');
        return false;
    }
    
    if (!data.consent) {
        showMessage('Vous devez accepter la politique de confidentialité', 'error');
        return false;
    }
    
    if (!isValidEmail(data.email)) {
        showMessage('Veuillez saisir une adresse email valide', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitContactForm(data) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
        </svg>
        Envoi en cours...
    `;
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
    }, 2000);
}

function initSearch() {
    const searchInput = document.getElementById('helpSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length > 2) {
            performHelpSearch(query);
        } else {
            clearSearchHighlights();
        }
    });
}

function performHelpSearch(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    let hasResults = false;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
            item.style.display = 'block';
            highlightText(item, query);
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    if (!hasResults) {
        showSearchNoResults();
    }
}

function highlightText(element, query) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<mark style="background: rgba(255, 140, 0, 0.3); color: white;">$1</mark>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedText;
            textNode.parentNode.replaceChild(wrapper, textNode);
        }
    });
}

function clearSearchHighlights() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.display = 'block';
        
        // Remove highlights
        const marks = item.querySelectorAll('mark');
        marks.forEach(mark => {
            mark.outerHTML = mark.innerHTML;
        });
    });
}

function showSearchNoResults() {
    const faqSections = document.querySelector('.faq-sections');
    if (!faqSections) return;
    
    const existingNoResults = faqSections.querySelector('.no-results');
    if (existingNoResults) return;
    
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.style.cssText = `
        text-align: center;
        padding: 40px;
        color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        margin: 20px 0;
    `;
    noResults.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 15px; color: rgba(255, 255, 255, 0.4);">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 style="margin-bottom: 10px; color: rgba(255, 255, 255, 0.8);">Aucun résultat trouvé</h3>
        <p>Essayez avec d'autres mots-clés ou <a href="contact.html" style="color: #FF8C00;">contactez-nous</a> directement.</p>
    `;
    
    faqSections.appendChild(noResults);
}

function startChat() {
    showMessage('Fonctionnalité de chat en cours de développement. Utilisez le formulaire de contact en attendant.', 'info');
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
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
        max-width: 400px;
        font-size: 14px;
        line-height: 1.4;
    `;
    messageEl.textContent = message;
    
    // Add animation styles
    if (!document.querySelector('#message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
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
    }
    
    document.body.appendChild(messageEl);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 5000);
}
