// Abonnement JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page d'abonnement
    initSubscriptionPage();
    
    // Initialisation des actions rapides
    initQuickActions();
    
    // Initialisation de l'historique des factures
    initBillingHistory();
    
    // Initialisation des offres
    initOffers();
    
    // Initialisation de la zone de danger
    initDangerZone();
});

// Initialisation de la page d'abonnement
function initSubscriptionPage() {
    loadSubscriptionData();
    updateDates();
}

// Charger les données d'abonnement
function loadSubscriptionData() {
    const subscriptionData = getSubscriptionData();
    updateSubscriptionDisplay(subscriptionData);
}

// Récupérer les données d'abonnement (simulation)
function getSubscriptionData() {
    const stored = localStorage.getItem('subscriptionData');
    if (stored) {
        return JSON.parse(stored);
    }
    
    return {
        plan: 'Canal+ Premium',
        status: 'active',
        price: 15000,
        currency: 'FCFA',
        nextBilling: new Date(2025, 1, 15),
        subscriptionDate: new Date(2025, 0, 15),
        paymentMethod: 'Mobile Money',
        autoRenew: true
    };
}

// Mettre à jour l'affichage de l'abonnement
function updateSubscriptionDisplay(data) {
    const statusText = document.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = data.plan;
    }
    
    const priceElements = document.querySelectorAll('.detail-value');
    if (priceElements.length > 1) {
        priceElements[1].textContent = `${data.price.toLocaleString()} ${data.currency}`;
    }
    
    if (priceElements.length > 2) {
        priceElements[2].textContent = data.paymentMethod;
    }
}

// Mettre à jour les dates
function updateDates() {
    const subscriptionData = getSubscriptionData();
    
    const nextBillingElement = document.getElementById('nextBilling');
    if (nextBillingElement) {
        nextBillingElement.textContent = formatDate(subscriptionData.nextBilling);
    }
    
    const subscriptionDateElement = document.getElementById('subscriptionDate');
    if (subscriptionDateElement) {
        subscriptionDateElement.textContent = formatDate(subscriptionData.subscriptionDate);
    }
}

// Formater une date
function formatDate(date) {
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
}

// Initialisation des actions rapides
function initQuickActions() {
    const renewBtn = document.getElementById('renewBtn');
    const upgradeBtn = document.getElementById('upgradeBtn');
    const paymentBtn = document.getElementById('paymentBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    renewBtn.addEventListener('click', handleRenew);
    upgradeBtn.addEventListener('click', handleUpgrade);
    paymentBtn.addEventListener('click', handlePayment);
    pauseBtn.addEventListener('click', handlePause);
}

// Gestion du renouvellement
function handleRenew() {
    showRenewModal();
}

// Afficher la modal de renouvellement
function showRenewModal() {
    const modal = document.createElement('div');
    modal.className = 'renew-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h3>Renouveler l'abonnement</h3>
            <p>Choisissez la durée de renouvellement :</p>
            <div class="renew-options">
                <label class="renew-option">
                    <input type="radio" name="duration" value="1" checked>
                    <span class="option-content">
                        <strong>1 mois</strong>
                        <span class="option-price">15 000 FCFA</span>
                    </span>
                </label>
                <label class="renew-option">
                    <input type="radio" name="duration" value="3">
                    <span class="option-content">
                        <strong>3 mois</strong>
                        <span class="option-price">42 000 FCFA</span>
                        <span class="option-savings">Économisez 3 000 FCFA</span>
                    </span>
                </label>
                <label class="renew-option">
                    <input type="radio" name="duration" value="12">
                    <span class="option-content">
                        <strong>12 mois</strong>
                        <span class="option-price">150 000 FCFA</span>
                        <span class="option-savings">Économisez 30 000 FCFA</span>
                    </span>
                </label>
            </div>
            <div class="modal-actions">
                <button class="modal-btn cancel" id="cancelRenew">Annuler</button>
                <button class="modal-btn primary" id="confirmRenew">Renouveler</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const cancelBtn = modal.querySelector('#cancelRenew');
    const confirmBtn = modal.querySelector('#confirmRenew');
    
    cancelBtn.addEventListener('click', () => modal.remove());
    confirmBtn.addEventListener('click', () => {
        const selectedDuration = modal.querySelector('input[name="duration"]:checked').value;
        processRenewal(selectedDuration);
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

// Traiter le renouvellement
function processRenewal(duration) {
    showInfo('Traitement du renouvellement en cours...');
    
    setTimeout(() => {
        const subscriptionData = getSubscriptionData();
        const currentNext = subscriptionData.nextBilling;
        currentNext.setMonth(currentNext.getMonth() + parseInt(duration));
        
        subscriptionData.nextBilling = currentNext;
        localStorage.setItem('subscriptionData', JSON.stringify(subscriptionData));
        
        updateDates();
        showSuccess(`Abonnement renouvelé pour ${duration} mois !`);
    }, 2000);
}

// Gestion de l'amélioration
function handleUpgrade() {
    showInfo('Redirection vers les offres d\'amélioration...');
    document.querySelector('.offers-section').scrollIntoView({ behavior: 'smooth' });
}

// Gestion du paiement
function handlePayment() {
    showPaymentModal();
}

// Afficher la modal de paiement
function showPaymentModal() {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h3>Méthodes de paiement</h3>
            <div class="payment-methods">
                <div class="payment-method active">
                    <div class="method-icon">📱</div>
                    <div class="method-info">
                        <h4>Mobile Money</h4>
                        <p>+235 90 12 34 56</p>
                    </div>
                    <div class="method-status">Actuel</div>
                </div>
                <div class="payment-method">
                    <div class="method-icon">💳</div>
                    <div class="method-info">
                        <h4>Carte bancaire</h4>
                        <p>Ajouter une carte</p>
                    </div>
                    <button class="add-method-btn">Ajouter</button>
                </div>
            </div>
            <div class="modal-actions">
                <button class="modal-btn cancel" id="cancelPayment">Fermer</button>
                <button class="modal-btn primary" id="changePayment">Modifier</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const cancelBtn = modal.querySelector('#cancelPayment');
    const changeBtn = modal.querySelector('#changePayment');
    
    cancelBtn.addEventListener('click', () => modal.remove());
    changeBtn.addEventListener('click', () => {
        showInfo('Fonctionnalité de modification à venir');
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

// Gestion de la pause
function handlePause() {
    showInfo('Fonctionnalité de suspension à venir');
}

// Initialisation de l'historique des factures
function initBillingHistory() {
    generateBillingHistory();
    
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    downloadAllBtn.addEventListener('click', downloadAllBills);
}

// Générer l'historique des factures
function generateBillingHistory() {
    const billingList = document.getElementById('billingList');
    const bills = generateBillsData();
    
    billingList.innerHTML = '';
    
    bills.forEach(bill => {
        const billElement = document.createElement('div');
        billElement.className = 'billing-item';
        billElement.innerHTML = `
            <div class="billing-info">
                <div class="billing-date">${formatDate(bill.date)}</div>
                <div class="billing-description">${bill.description}</div>
            </div>
            <div class="billing-amount">${bill.amount.toLocaleString()} FCFA</div>
            <div class="billing-actions">
                <button class="billing-btn" onclick="viewBill('${bill.id}')">Voir</button>
                <button class="billing-btn" onclick="downloadBill('${bill.id}')">Télécharger</button>
            </div>
        `;
        billingList.appendChild(billElement);
    });
}

// Générer les données de facturation
function generateBillsData() {
    const bills = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 6; i++) {
        const billDate = new Date(currentDate);
        billDate.setMonth(billDate.getMonth() - i);
        
        bills.push({
            id: `bill_${i + 1}`,
            date: billDate,
            description: 'Canal+ Premium - Abonnement mensuel',
            amount: 15000,
            status: 'paid'
        });
    }
    
    return bills;
}

// Voir une facture
function viewBill(billId) {
    showInfo(`Affichage de la facture ${billId}`);
}

// Télécharger une facture
function downloadBill(billId) {
    showInfo(`Téléchargement de la facture ${billId}`);
}

// Télécharger toutes les factures
function downloadAllBills() {
    showInfo('Téléchargement de toutes les factures en cours...');
    
    setTimeout(() => {
        showSuccess('Toutes les factures ont été téléchargées');
    }, 2000);
}

// Initialisation des offres
function initOffers() {
    const offerBtns = document.querySelectorAll('.offer-btn');
    
    offerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            handleOfferSelection(plan);
        });
    });
}

// Gestion de la sélection d'offre
function handleOfferSelection(plan) {
    showInfo(`Changement vers ${plan} à venir`);
}

// Initialisation de la zone de danger
function initDangerZone() {
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', handleCancellation);
}

// Gestion de la résiliation
function handleCancellation() {
    if (confirm('Êtes-vous sûr de vouloir résilier votre abonnement ?')) {
        showInfo('Fonctionnalité de résiliation à venir');
    }
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

// Styles pour les animations
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
    
    .renew-modal, .payment-modal {
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
        max-width: 500px;
        width: 90%;
        position: relative;
        z-index: 1;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-content h3 {
        color: #FF8C00;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 20px;
    }
    
    .modal-content p {
        color: #cccccc;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 15px;
    }
    
    .renew-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .renew-option {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .renew-option:hover {
        background: rgba(255, 255, 255, 0.08);
    }
    
    .option-content {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .option-price {
        color: #FF8C00;
        font-weight: 600;
    }
    
    .option-savings {
        color: #4CAF50;
        font-size: 12px;
    }
    
    .payment-methods {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .payment-method {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }
    
    .payment-method.active {
        border-color: #4CAF50;
        background: rgba(76, 175, 80, 0.05);
    }
    
    .method-icon {
        font-size: 24px;
    }
    
    .method-info {
        flex: 1;
    }
    
    .method-info h4 {
        color: white;
        font-size: 16px;
        margin-bottom: 5px;
    }
    
    .method-info p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin: 0;
    }
    
    .method-status {
        color: #4CAF50;
        font-size: 12px;
        font-weight: 600;
    }
    
    .add-method-btn {
        background: rgba(255, 140, 0, 0.1);
        border: 1px solid #FF8C00;
        border-radius: 6px;
        padding: 8px 12px;
        color: #FF8C00;
        font-size: 12px;
        cursor: pointer;
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
    
    .modal-btn.primary {
        background: #FF8C00;
        color: white;
    }
    
    .modal-btn.primary:hover {
        background: #ff9f1a;
    }
`;
document.head.appendChild(style);
