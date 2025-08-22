// Analytics Page JavaScript
let charts = {};
let currentDateRange = '30d';

// Initialize analytics page
document.addEventListener('DOMContentLoaded', function() {
    initMenuToggle();
    initAnalytics();
    initCharts();
    initTables();
    initRealTimeStats();
    initExportModal();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    setInterval(updateRealTimeStats, 5000); // Update every 5 seconds
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

// Initialize analytics
function initAnalytics() {
    // Date range picker
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            currentDateRange = this.value;
            updateAllData();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', showExportModal);
    }
    
    // Chart controls
    const chartControls = document.querySelectorAll('.chart-control');
    chartControls.forEach(control => {
        control.addEventListener('click', function() {
            const metric = this.dataset.metric;
            const container = this.closest('.chart-container');
            
            // Update active state
            container.querySelectorAll('.chart-control').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart
            updateAudienceChart(metric);
        });
    });
}

// Initialize charts
function initCharts() {
    initAudienceChart();
    initContentChart();
    initDeviceChart();
    initRevenueChart();
}

// Audience Chart
function initAudienceChart() {
    const ctx = document.getElementById('audienceChart');
    if (!ctx) return;
    
    const data = generateAudienceData('users');
    
    charts.audience = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Utilisateurs',
                data: data.values,
                borderColor: '#FF8C00',
                backgroundColor: 'rgba(255, 140, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#888'
                    }
                },
                y: {
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#888',
                        callback: function(value) {
                            return value >= 1000 ? (value / 1000) + 'k' : value;
                        }
                    }
                }
            }
        }
    });
}

// Content Performance Chart
function initContentChart() {
    const ctx = document.getElementById('contentChart');
    if (!ctx) return;
    
    charts.content = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Films', 'Séries', 'Sport', 'Documentaires', 'Actualités'],
            datasets: [{
                label: 'Vues (millions)',
                data: [12.5, 8.3, 15.2, 4.1, 6.8],
                backgroundColor: [
                    '#FF8C00',
                    '#2ed573',
                    '#3742fa',
                    '#ffa502',
                    '#ff4757'
                ],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#888'
                    }
                },
                y: {
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#888'
                    }
                }
            }
        }
    });
}

// Device Distribution Chart
function initDeviceChart() {
    const ctx = document.getElementById('deviceChart');
    if (!ctx) return;
    
    charts.device = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Mobile', 'Desktop', 'Tablet', 'TV', 'Autres'],
            datasets: [{
                data: [45, 25, 15, 12, 3],
                backgroundColor: [
                    '#FF8C00',
                    '#2ed573',
                    '#3742fa',
                    '#ffa502',
                    '#ff4757'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#888',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

// Revenue Chart
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const labels = generateDateLabels(currentDateRange);
    
    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Abonnements',
                    data: generateRevenueData(labels.length, 800000, 1200000),
                    borderColor: '#FF8C00',
                    backgroundColor: 'rgba(255, 140, 0, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'VOD',
                    data: generateRevenueData(labels.length, 200000, 400000),
                    borderColor: '#2ed573',
                    backgroundColor: 'rgba(46, 213, 115, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Publicité',
                    data: generateRevenueData(labels.length, 100000, 300000),
                    borderColor: '#3742fa',
                    backgroundColor: 'rgba(55, 66, 250, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#888'
                    }
                },
                y: {
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#888',
                        callback: function(value) {
                            return '€' + (value / 1000) + 'k';
                        }
                    }
                }
            }
        }
    });
}

// Initialize tables
function initTables() {
    generateTopContentTable();
    generateGeoTable();
    
    // Table actions
    const viewAllContent = document.getElementById('viewAllContent');
    const viewAllRegions = document.getElementById('viewAllRegions');
    
    if (viewAllContent) {
        viewAllContent.addEventListener('click', () => {
            showMessage('Fonctionnalité à venir', 'info');
        });
    }
    
    if (viewAllRegions) {
        viewAllRegions.addEventListener('click', () => {
            showMessage('Fonctionnalité à venir', 'info');
        });
    }
}

// Generate top content table
function generateTopContentTable() {
    const tableBody = document.getElementById('topContentTable');
    if (!tableBody) return;
    
    const content = [
        { title: 'The Last of Us', views: '2.4M', duration: '45:32', rating: 4.8, trend: 'up' },
        { title: 'House of the Dragon', views: '2.1M', duration: '52:15', rating: 4.6, trend: 'up' },
        { title: 'Stranger Things 4', views: '1.9M', duration: '38:42', rating: 4.7, trend: 'stable' },
        { title: 'The Bear', views: '1.7M', duration: '28:33', rating: 4.9, trend: 'up' },
        { title: 'Euphoria', views: '1.5M', duration: '41:18', rating: 4.5, trend: 'down' }
    ];
    
    tableBody.innerHTML = content.map(item => `
        <tr>
            <td>${item.title}</td>
            <td>${item.views}</td>
            <td>${item.duration}</td>
            <td>⭐ ${item.rating}</td>
            <td class="trend-${item.trend}">
                ${item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '→'}
            </td>
        </tr>
    `).join('');
}

// Generate geographic table
function generateGeoTable() {
    const tableBody = document.getElementById('geoTable');
    if (!tableBody) return;
    
    const regions = [
        { region: 'Île-de-France', users: '45.2k', sessions: '128k', revenue: '€245k', share: '32%' },
        { region: 'Auvergne-Rhône-Alpes', users: '28.1k', sessions: '78k', revenue: '€156k', share: '18%' },
        { region: 'Nouvelle-Aquitaine', users: '22.3k', sessions: '61k', revenue: '€118k', share: '14%' },
        { region: 'Occitanie', users: '19.8k', sessions: '54k', revenue: '€102k', share: '12%' },
        { region: 'Hauts-de-France', users: '18.5k', sessions: '49k', revenue: '€95k', share: '11%' }
    ];
    
    tableBody.innerHTML = regions.map(region => `
        <tr>
            <td>${region.region}</td>
            <td>${region.users}</td>
            <td>${region.sessions}</td>
            <td>${region.revenue}</td>
            <td>${region.share}</td>
        </tr>
    `).join('');
}

// Initialize real-time stats
function initRealTimeStats() {
    updateRealTimeStats();
}

// Update real-time stats
function updateRealTimeStats() {
    const stats = {
        onlineUsers: Math.floor(Math.random() * 2000) + 11000,
        activeStreams: Math.floor(Math.random() * 1000) + 7500,
        bandwidth: (Math.random() * 0.8 + 2.0).toFixed(1),
        newSubscribers: Math.floor(Math.random() * 50) + 120
    };
    
    const onlineUsers = document.getElementById('onlineUsers');
    const activeStreams = document.getElementById('activeStreams');
    const bandwidth = document.getElementById('bandwidth');
    const newSubscribers = document.getElementById('newSubscribers');
    
    if (onlineUsers) onlineUsers.textContent = stats.onlineUsers.toLocaleString();
    if (activeStreams) activeStreams.textContent = stats.activeStreams.toLocaleString();
    if (bandwidth) bandwidth.textContent = stats.bandwidth + ' Gbps';
    if (newSubscribers) newSubscribers.textContent = '+' + stats.newSubscribers;
}

// Update audience chart
function updateAudienceChart(metric) {
    if (!charts.audience) return;
    
    const data = generateAudienceData(metric);
    const labels = {
        users: 'Utilisateurs',
        sessions: 'Sessions',
        views: 'Vues'
    };
    
    charts.audience.data.labels = data.labels;
    charts.audience.data.datasets[0].label = labels[metric];
    charts.audience.data.datasets[0].data = data.values;
    charts.audience.update();
}

// Update all data
function updateAllData() {
    // Update KPIs with animation
    animateKPIUpdate();
    
    // Update charts
    Object.keys(charts).forEach(chartKey => {
        if (charts[chartKey]) {
            if (chartKey === 'audience') {
                const activeControl = document.querySelector('.chart-control.active');
                const metric = activeControl ? activeControl.dataset.metric : 'users';
                updateAudienceChart(metric);
            } else if (chartKey === 'revenue') {
                const labels = generateDateLabels(currentDateRange);
                charts.revenue.data.labels = labels;
                charts.revenue.data.datasets.forEach((dataset, index) => {
                    const baseValues = [800000, 200000, 100000];
                    const maxValues = [1200000, 400000, 300000];
                    dataset.data = generateRevenueData(labels.length, baseValues[index], maxValues[index]);
                });
                charts.revenue.update();
            }
        }
    });
    
    // Update tables
    generateTopContentTable();
    generateGeoTable();
    
    showMessage('Données mises à jour', 'success');
}

// Animate KPI update
function animateKPIUpdate() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues.forEach(value => {
        value.style.transform = 'scale(1.05)';
        value.style.color = '#FF8C00';
        
        setTimeout(() => {
            value.style.transform = 'scale(1)';
            value.style.color = '#fff';
        }, 300);
    });
}

// Export modal
function initExportModal() {
    const exportModal = document.getElementById('exportModal');
    const exportModalClose = document.getElementById('exportModalClose');
    const exportCancel = document.getElementById('exportCancel');
    const exportConfirm = document.getElementById('exportConfirm');
    
    if (exportModalClose) {
        exportModalClose.addEventListener('click', () => hideModal('exportModal'));
    }
    
    if (exportCancel) {
        exportCancel.addEventListener('click', () => hideModal('exportModal'));
    }
    
    if (exportConfirm) {
        exportConfirm.addEventListener('click', performExport);
    }
    
    // Close on backdrop click
    if (exportModal) {
        exportModal.addEventListener('click', function(e) {
            if (e.target === exportModal) {
                hideModal('exportModal');
            }
        });
    }
}

// Show export modal
function showExportModal() {
    showModal('exportModal');
}

// Perform export
function performExport() {
    const format = document.getElementById('exportFormat')?.value || 'pdf';
    const period = document.getElementById('exportPeriod')?.value || '30d';
    
    // Simulate export process
    showMessage('Export en cours...', 'info');
    
    setTimeout(() => {
        hideModal('exportModal');
        showMessage(`Rapport ${format.toUpperCase()} généré avec succès`, 'success');
    }, 2000);
}

// Utility functions
function generateDateLabels(range) {
    const labels = [];
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (days <= 7) {
            labels.push(date.toLocaleDateString('fr-FR', { weekday: 'short' }));
        } else if (days <= 30) {
            labels.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
        } else {
            labels.push(date.toLocaleDateString('fr-FR', { month: 'short' }));
        }
    }
    
    return labels;
}

function generateAudienceData(metric) {
    const labels = generateDateLabels(currentDateRange);
    const baseValues = {
        users: 100000,
        sessions: 150000,
        views: 300000
    };
    
    const base = baseValues[metric] || baseValues.users;
    const values = labels.map(() => {
        return Math.floor(Math.random() * base * 0.4 + base * 0.8);
    });
    
    return { labels, values };
}

function generateRevenueData(length, min, max) {
    const data = [];
    for (let i = 0; i < length; i++) {
        data.push(Math.floor(Math.random() * (max - min) + min));
    }
    return data;
}

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
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
