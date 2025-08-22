// Support Page JavaScript
let currentTicket = null;
let tickets = [];
let filteredTickets = [];

// Initialize support page
document.addEventListener('DOMContentLoaded', function() {
    initMenuToggle();
    initSupportPage();
    initFilters();
    initModals();
    initChat();
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

// Initialize support page
function initSupportPage() {
    generateMockTickets();
    renderTickets();
    
    // Search functionality
    const searchInput = document.getElementById('ticketSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterTickets();
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshTickets();
        });
    }
    
    // New ticket button
    const newTicketBtn = document.getElementById('newTicketBtn');
    if (newTicketBtn) {
        newTicketBtn.addEventListener('click', function() {
            showNewTicketModal();
        });
    }
}

// Initialize filters
function initFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const agentFilter = document.getElementById('agentFilter');
    
    [statusFilter, priorityFilter, agentFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterTickets);
        }
    });
}

// Initialize modals
function initModals() {
    // Ticket modal
    const ticketModal = document.getElementById('ticketModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    
    if (modalClose) {
        modalClose.addEventListener('click', () => hideModal('ticketModal'));
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', () => hideModal('ticketModal'));
    }
    
    // New ticket modal
    const newTicketModal = document.getElementById('newTicketModal');
    const newTicketClose = document.getElementById('newTicketClose');
    const newTicketCancel = document.getElementById('newTicketCancel');
    const newTicketCreate = document.getElementById('newTicketCreate');
    
    if (newTicketClose) {
        newTicketClose.addEventListener('click', () => hideModal('newTicketModal'));
    }
    
    if (newTicketCancel) {
        newTicketCancel.addEventListener('click', () => hideModal('newTicketModal'));
    }
    
    if (newTicketCreate) {
        newTicketCreate.addEventListener('click', createNewTicket);
    }
    
    // Close modal on backdrop click
    [ticketModal, newTicketModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    hideModal(modal.id);
                }
            });
        }
    });
}

// Initialize chat
function initChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const assignBtn = document.getElementById('assignBtn');
    const priorityBtn = document.getElementById('priorityBtn');
    const closeBtn = document.getElementById('closeBtn');
    
    if (chatInput && sendBtn) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (assignBtn) {
        assignBtn.addEventListener('click', () => showAssignModal());
    }
    
    if (priorityBtn) {
        priorityBtn.addEventListener('click', () => showPriorityModal());
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeTicket());
    }
}

// Generate mock tickets
function generateMockTickets() {
    const users = [
        'marie.dupont@email.com', 'jean.martin@email.com', 'sophie.bernard@email.com',
        'pierre.durand@email.com', 'claire.petit@email.com', 'antoine.moreau@email.com',
        'julie.simon@email.com', 'thomas.michel@email.com', 'emma.leroy@email.com',
        'nicolas.garcia@email.com'
    ];
    
    const subjects = [
        'Impossible de se connecter à mon compte',
        'Problème de facturation - double prélèvement',
        'Contenu indisponible sur mobile',
        'Qualité vidéo dégradée en 4K',
        'Erreur lors du paiement',
        'Demande de remboursement',
        'Problème de streaming en direct',
        'Application qui plante au démarrage',
        'Contenu manquant dans ma liste',
        'Problème de synchronisation'
    ];
    
    const priorities = ['urgent', 'high', 'medium', 'low'];
    const statuses = ['open', 'pending', 'resolved', 'closed'];
    const categories = ['technical', 'billing', 'content', 'account', 'other'];
    
    tickets = [];
    
    for (let i = 1; i <= 50; i++) {
        const ticket = {
            id: `T${String(i).padStart(4, '0')}`,
            user: users[Math.floor(Math.random() * users.length)],
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            created: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            updated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            agent: Math.random() > 0.3 ? 'John Doe' : null,
            messages: generateTicketMessages()
        };
        
        tickets.push(ticket);
    }
    
    // Sort by priority and date
    tickets.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.updated) - new Date(a.updated);
    });
    
    filteredTickets = [...tickets];
}

// Generate ticket messages
function generateTicketMessages() {
    const messages = [];
    const messageCount = Math.floor(Math.random() * 5) + 1;
    
    const userMessages = [
        'Bonjour, j\'ai un problème avec mon compte Canal+.',
        'Le problème persiste malgré mes tentatives.',
        'Pouvez-vous m\'aider rapidement s\'il vous plaît ?',
        'Merci pour votre aide.',
        'Le problème semble résolu maintenant.'
    ];
    
    const agentMessages = [
        'Bonjour, je vais vous aider avec votre problème.',
        'Pouvez-vous me donner plus de détails ?',
        'J\'ai identifié le problème, je vais le résoudre.',
        'Le problème devrait être résolu maintenant.',
        'N\'hésitez pas à nous recontacter si besoin.'
    ];
    
    for (let i = 0; i < messageCount; i++) {
        const isUser = i % 2 === 0;
        messages.push({
            id: i + 1,
            author: isUser ? 'Client' : 'Support',
            type: isUser ? 'user' : 'agent',
            content: isUser ? 
                userMessages[Math.floor(Math.random() * userMessages.length)] :
                agentMessages[Math.floor(Math.random() * agentMessages.length)],
            timestamp: new Date(Date.now() - (messageCount - i) * 60 * 60 * 1000)
        });
    }
    
    return messages;
}

// Filter tickets
function filterTickets() {
    const searchTerm = document.getElementById('ticketSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const priorityFilter = document.getElementById('priorityFilter')?.value || '';
    const agentFilter = document.getElementById('agentFilter')?.value || '';
    
    filteredTickets = tickets.filter(ticket => {
        const matchesSearch = !searchTerm || 
            ticket.id.toLowerCase().includes(searchTerm) ||
            ticket.user.toLowerCase().includes(searchTerm) ||
            ticket.subject.toLowerCase().includes(searchTerm);
            
        const matchesStatus = !statusFilter || ticket.status === statusFilter;
        const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
        
        let matchesAgent = true;
        if (agentFilter === 'unassigned') {
            matchesAgent = !ticket.agent;
        } else if (agentFilter === 'me') {
            matchesAgent = ticket.agent === 'John Doe';
        }
        
        return matchesSearch && matchesStatus && matchesPriority && matchesAgent;
    });
    
    renderTickets();
}

// Render tickets
function renderTickets() {
    const ticketsList = document.getElementById('ticketsList');
    if (!ticketsList) return;
    
    if (filteredTickets.length === 0) {
        ticketsList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🎫</div>
                <h3>Aucun ticket trouvé</h3>
                <p>Essayez de modifier vos filtres de recherche</p>
            </div>
        `;
        return;
    }
    
    ticketsList.innerHTML = filteredTickets.map(ticket => `
        <div class="ticket-item ${currentTicket?.id === ticket.id ? 'active' : ''}" 
             onclick="selectTicket('${ticket.id}')">
            <div class="ticket-header">
                <div class="ticket-id">${ticket.id}</div>
                <div class="ticket-priority ${ticket.priority}">${getPriorityLabel(ticket.priority)}</div>
            </div>
            <div class="ticket-subject">${ticket.subject}</div>
            <div class="ticket-meta">
                <div class="ticket-user">${ticket.user}</div>
                <div class="ticket-status ${ticket.status}">${getStatusLabel(ticket.status)}</div>
            </div>
            <div class="ticket-meta">
                <div class="ticket-time">${formatRelativeTime(ticket.updated)}</div>
                <div style="color: #888; font-size: 0.7rem;">
                    ${ticket.agent ? `Assigné à ${ticket.agent}` : 'Non assigné'}
                </div>
            </div>
        </div>
    `).join('');
}

// Select ticket
function selectTicket(ticketId) {
    currentTicket = tickets.find(t => t.id === ticketId);
    if (!currentTicket) return;
    
    renderTickets(); // Update active state
    renderChat();
    showChatInput();
}

// Render chat
function renderChat() {
    const chatTitle = document.getElementById('chatTitle');
    const chatStatus = document.getElementById('chatStatus');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!currentTicket) {
        if (chatTitle) chatTitle.textContent = 'Sélectionnez un ticket';
        if (chatStatus) chatStatus.textContent = '';
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="no-ticket-selected">
                    <div class="no-ticket-icon">💬</div>
                    <h3>Aucun ticket sélectionné</h3>
                    <p>Cliquez sur un ticket pour voir la conversation</p>
                </div>
            `;
        }
        return;
    }
    
    if (chatTitle) chatTitle.textContent = `${currentTicket.id} - ${currentTicket.subject}`;
    if (chatStatus) chatStatus.textContent = `${getStatusLabel(currentTicket.status)} • ${currentTicket.user}`;
    
    if (chatMessages) {
        chatMessages.innerHTML = currentTicket.messages.map(message => `
            <div class="message ${message.type}">
                <div class="message-content">${message.content}</div>
                <div class="message-meta">
                    <span class="message-author">${message.author}</span>
                    <span class="message-time">${formatTime(message.timestamp)}</span>
                </div>
            </div>
        `).join('');
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Show chat input
function showChatInput() {
    const chatInputContainer = document.getElementById('chatInputContainer');
    if (chatInputContainer) {
        chatInputContainer.classList.remove('hidden');
    }
}

// Send message
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput || !currentTicket) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add message to current ticket
    const newMessage = {
        id: currentTicket.messages.length + 1,
        author: 'Support',
        type: 'agent',
        content: message,
        timestamp: new Date()
    };
    
    currentTicket.messages.push(newMessage);
    currentTicket.updated = new Date();
    
    // Clear input
    chatInput.value = '';
    
    // Re-render chat
    renderChat();
    
    // Show success message
    showMessage('Message envoyé avec succès', 'success');
}

// Refresh tickets
function refreshTickets() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 500);
    }
    
    generateMockTickets();
    renderTickets();
    showMessage('Tickets actualisés', 'success');
}

// Show new ticket modal
function showNewTicketModal() {
    showModal('newTicketModal');
}

// Create new ticket
function createNewTicket() {
    const user = document.getElementById('ticketUser')?.value.trim();
    const subject = document.getElementById('ticketSubject')?.value.trim();
    const priority = document.getElementById('ticketPriority')?.value;
    const category = document.getElementById('ticketCategory')?.value;
    const description = document.getElementById('ticketDescription')?.value.trim();
    
    if (!user || !subject || !description) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    const newTicket = {
        id: `T${String(tickets.length + 1).padStart(4, '0')}`,
        user: user,
        subject: subject,
        priority: priority,
        status: 'open',
        category: category,
        created: new Date(),
        updated: new Date(),
        agent: null,
        messages: [{
            id: 1,
            author: 'Client',
            type: 'user',
            content: description,
            timestamp: new Date()
        }]
    };
    
    tickets.unshift(newTicket);
    filterTickets();
    hideModal('newTicketModal');
    clearNewTicketForm();
    showMessage('Ticket créé avec succès', 'success');
}

// Clear new ticket form
function clearNewTicketForm() {
    const fields = ['ticketUser', 'ticketSubject', 'ticketDescription'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
    
    const priority = document.getElementById('ticketPriority');
    const category = document.getElementById('ticketCategory');
    if (priority) priority.value = 'medium';
    if (category) category.value = 'technical';
}

// Show/hide modals
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Close ticket
function closeTicket() {
    if (!currentTicket) return;
    
    if (confirm('Êtes-vous sûr de vouloir fermer ce ticket ?')) {
        currentTicket.status = 'closed';
        currentTicket.updated = new Date();
        
        renderTickets();
        renderChat();
        showMessage('Ticket fermé avec succès', 'success');
    }
}

// Utility functions
function getPriorityLabel(priority) {
    const labels = {
        urgent: 'Urgent',
        high: 'Élevée',
        medium: 'Moyenne',
        low: 'Faible'
    };
    return labels[priority] || priority;
}

function getStatusLabel(status) {
    const labels = {
        open: 'Ouvert',
        pending: 'En attente',
        resolved: 'Résolu',
        closed: 'Fermé'
    };
    return labels[status] || status;
}

function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return date.toLocaleDateString('fr-FR');
}

function formatTime(date) {
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

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
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
