// Initialize reports on page load
document.addEventListener('DOMContentLoaded', () => {
    loadReports();
    initializeReportForm();
});

// Load and display reports
function loadReports() {
    const reportsContainer = document.querySelector('.reports-container');
    const emailReportsContainer = document.querySelector('.email-reports-container');
    if (!reportsContainer || !emailReportsContainer) return;

    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    // Separate URL and email reports
    const urlReports = reports.filter(report => !report.url.includes('@'));
    const emailReports = reports.filter(report => report.url.includes('@'));
    
    // Display URL reports
    if (urlReports.length === 0) {
        reportsContainer.innerHTML = `
            <div class="no-reports">
                <i class="fas fa-shield-alt text-4xl mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">No URL Reports Yet</h3>
                <p class="text-gray-400">Start by reporting suspicious URLs</p>
            </div>
        `;
    } else {
        reportsContainer.innerHTML = urlReports.map(report => createReportElement(report)).join('');
    }

    // Display email reports
    if (emailReports.length === 0) {
        emailReportsContainer.innerHTML = `
            <div class="no-reports">
                <i class="fas fa-envelope text-4xl mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">No Email Reports Yet</h3>
                <p class="text-gray-400">Start by reporting suspicious emails</p>
            </div>
        `;
    } else {
        emailReportsContainer.innerHTML = emailReports.map(report => createReportElement(report)).join('');
    }

    // Add click handlers for See More buttons
    document.querySelectorAll('.see-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const fullUrl = button.parentElement.nextElementSibling;
            const icon = button.querySelector('i');
            
            if (fullUrl.classList.contains('hidden')) {
                fullUrl.classList.remove('hidden');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                fullUrl.classList.add('hidden');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

// Create report element
function createReportElement(report) {
    const isLongUrl = report.url.length > 30;
    const displayUrl = isLongUrl ? report.url.substring(0, 30) + '...' : report.url;
    
    return `
        <div class="report-item ${report.status.toLowerCase()}">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <h3 class="text-lg font-semibold mb-1">${displayUrl}</h3>
                        ${isLongUrl ? `
                            <button class="see-more-btn text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        ` : ''}
                    </div>
                    <div class="full-url hidden text-sm text-gray-400 break-all">${report.url}</div>
                    <span class="text-sm ${getStatusColor(report.status)}">${report.status.toUpperCase()}</span>
                </div>
                <span class="text-sm text-gray-400">${formatDate(report.timestamp)}</span>
            </div>
            <div class="flex items-center gap-2">
                <i class="fas ${getStatusIcon(report.status)}"></i>
                <span class="text-sm text-gray-400">Reported by ${report.reportedBy}</span>
            </div>
        </div>
    `;
}

// Initialize report form
function initializeReportForm() {
    const reportForm = document.querySelector('#reportForm');
    if (!reportForm) return;

    reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

        const url = document.querySelector('#reportUrl').value.trim();
            const status = document.querySelector('input[name="status"]:checked')?.value;

            if (!url || !status) {
            showError('Please fill in all fields');
                return;
            }

        const report = {
            url,
            status,
            timestamp: new Date().toISOString(),
            reportedBy: 'user'
        };
        
        // Save report
        let reports = JSON.parse(localStorage.getItem('reports') || '[]');
        reports.unshift(report);
        localStorage.setItem('reports', JSON.stringify(reports));
        
        // Show success message
        showSuccess('Report submitted successfully');
        
        // Reload reports
        loadReports();
        
        // Reset form
        reportForm.reset();
    });
}

// Get status color
function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'safe':
            return 'text-emerald-500';
        case 'suspicious':
            return 'text-yellow-500';
        case 'phishing':
            return 'text-red-500';
        default:
            return 'text-gray-400';
    }
}

// Get status icon
function getStatusIcon(status) {
    switch(status.toLowerCase()) {
        case 'safe':
            return 'fa-shield-alt';
        case 'suspicious':
            return 'fa-exclamation-triangle';
        case 'phishing':
            return 'fa-skull-crossbones';
        default:
            return 'fa-question-circle';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Otherwise show full date
    return date.toLocaleDateString();
}

// Show success message
function showSuccess(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateX(100%)';
        setTimeout(() => successMessage.remove(), 500);
    }, 3000);
}

// Show error message
function showError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.style.opacity = '0';
        errorMessage.style.transform = 'translateX(100%)';
        setTimeout(() => errorMessage.remove(), 500);
    }, 3000);
} 

// Initialize mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

// Handle active states for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
});

// Set active link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Fix navbar on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.cyber-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}); 