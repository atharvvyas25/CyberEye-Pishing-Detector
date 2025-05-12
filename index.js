// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animations
gsap.from('.hero-section h1', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.hero-section p', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.3,
    ease: 'power3.out'
});

gsap.from('.cta-button', {
    duration: 1,
    y: 20,
    opacity: 0,
    delay: 0.6,
    stagger: 0.2,
    ease: 'power3.out'
});

// URL Scan Functionality
async function scanUrl() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a URL to scan');
        return;
    }
    
    // Create scan animation container
    const scanAnimation = document.createElement('div');
    scanAnimation.className = 'scan-animation';
    scanAnimation.innerHTML = `
        <div class="scan-text">Analyzing URL for threats...</div>
        <div class="scan-progress"></div>
    `;
    
    // Replace input with animation
    const inputContainer = urlInput.parentElement.parentElement;
    inputContainer.style.display = 'none';
    inputContainer.parentElement.appendChild(scanAnimation);
    
    // Terminal flicker effect
    const scanText = scanAnimation.querySelector('.scan-text');
    const originalText = scanText.textContent;
    let flickerCount = 0;
    const maxFlickers = 20;
    
    function flicker() {
        if (flickerCount < maxFlickers) {
            scanText.textContent = generateBinary(originalText.length);
            flickerCount++;
            setTimeout(flicker, Math.random() * 100);
        } else {
            scanText.textContent = originalText;
        }
    }
    
    flicker();
    
    try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate and display result
        const result = generateUrlResult();
        result.url = url;
        displayResult(result, inputContainer.parentElement);
        
        // Re-enable input
        inputContainer.style.display = 'block';
        scanAnimation.remove();
        
        // Update recent scans
        updateRecentScans();
    } catch (error) {
        showError('An error occurred while scanning the URL');
        inputContainer.style.display = 'block';
        scanAnimation.remove();
    }
}

// Email Scan Functionality
async function scanEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (!email) {
        showError('Please enter email content to scan');
        return;
    }
    
    // Create scan animation container
    const scanAnimation = document.createElement('div');
    scanAnimation.className = 'scan-animation';
    scanAnimation.innerHTML = `
        <div class="scan-text">Analyzing email content for threats...</div>
        <div class="scan-progress"></div>
    `;
    
    // Replace input with animation
    const inputContainer = emailInput.parentElement.parentElement;
    inputContainer.style.display = 'none';
    inputContainer.parentElement.appendChild(scanAnimation);
    
    // Terminal flicker effect
    const scanText = scanAnimation.querySelector('.scan-text');
    const originalText = scanText.textContent;
    let flickerCount = 0;
    const maxFlickers = 20;
    
    function flicker() {
        if (flickerCount < maxFlickers) {
            scanText.textContent = generateBinary(originalText.length);
            flickerCount++;
            setTimeout(flicker, Math.random() * 100);
        } else {
            scanText.textContent = originalText;
        }
    }
    
    flicker();
    
    try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate and display result
        const result = generateEmailResult(email);
        result.url = email;
        displayResult(result, inputContainer.parentElement);
        
        // Re-enable input
        inputContainer.style.display = 'block';
        scanAnimation.remove();
        
        // Update recent scans
        updateRecentScans();
    } catch (error) {
        showError('An error occurred while scanning the email');
        inputContainer.style.display = 'block';
        scanAnimation.remove();
    }
}

// Generate random binary for terminal effect
function generateBinary(length) {
    return Array.from({length}, () => Math.random() > 0.5 ? '1' : '0').join('');
}

// Generate URL scan result
function generateUrlResult() {
    // 70% chance of safe, 30% chance of suspicious/phishing
    const isSafe = Math.random() < 0.7;
    
    if (isSafe) {
        return {
            verdict: 'SAFE',
            confidence: Math.floor(Math.random() * 20),
            flags: ['URL matches known safe domain', 'No suspicious patterns detected', 'Valid SSL certificate']
        };
    } else {
        // 50% chance of suspicious, 50% chance of phishing
        const isPhishing = Math.random() < 0.5;
        return {
            verdict: isPhishing ? 'PHISHING DETECTED!' : 'SUSPICIOUS',
            confidence: isPhishing ? 
                Math.floor(Math.random() * 30) + 70 : 
                Math.floor(Math.random() * 30) + 40,
            flags: isPhishing ? 
                ['URL mimics legitimate domain', 'Suspicious redirects detected', 'Multiple phishing indicators'] :
                ['URL uses IP address', 'Suspicious keywords found', 'Domain age < 1 year']
        };
    }
}

// Generate email scan result
function generateEmailResult(emailContent) {
    // 70% chance of safe, 30% chance of suspicious/phishing
    const isSafe = Math.random() < 0.7;
    
    if (isSafe) {
        return {
            verdict: 'SAFE',
            confidence: Math.floor(Math.random() * 20),
            flags: [
                'No suspicious content detected',
                'Sender domain verified',
                'No malicious attachments'
            ]
        };
    } else {
        // 50% chance of suspicious, 50% chance of phishing
        const isPhishing = Math.random() < 0.5;
        return {
            verdict: isPhishing ? 'PHISHING DETECTED!' : 'SUSPICIOUS',
            confidence: isPhishing ? 
                Math.floor(Math.random() * 30) + 70 : 
                Math.floor(Math.random() * 30) + 40,
            flags: isPhishing ? 
                ['Sensitive information requested', 'Suspicious payment links', 'Multiple phishing indicators'] :
                ['Suspicious keywords found', 'Unusual sender patterns', 'Potential social engineering']
        };
    }
}

// Display scan result
function displayResult(result, container) {
    const resultPanel = document.createElement('div');
    resultPanel.className = 'result-panel';
    
    resultPanel.innerHTML = `
        <div class="verdict ${result.verdict.toLowerCase().replace('!', '')}">
            <i class="fas ${getVerdictIcon(result.verdict)}"></i>
            ${result.verdict}
        </div>
        <div class="confidence">
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${result.confidence}%"></div>
            </div>
            <span>Threat probability: ${result.confidence}%</span>
        </div>
        <ul class="flags-list">
            ${result.flags.map(flag => `
                <li>
                    <i class="fas fa-check-circle"></i>
                    ${flag}
                </li>
            `).join('')}
        </ul>
        <button onclick="reportUrl('${result.url}', '${result.verdict}')" class="report-button cyber-button mt-4">
            <i class="fas fa-flag"></i>
            Report ${result.url.includes('@') ? 'Email' : 'URL'}
        </button>
    `;
    
    container.appendChild(resultPanel);
    
    // Animate result panel
    setTimeout(() => {
        resultPanel.style.opacity = '1';
        resultPanel.style.transform = 'translateY(0)';
    }, 100);
    
    // Save to recent scans
    saveToRecentScans(result);
}

// Get verdict icon
function getVerdictIcon(verdict) {
    switch(verdict.toLowerCase()) {
        case 'safe':
            return 'fa-shield-alt';
        case 'suspicious':
            return 'fa-exclamation-triangle';
        case 'phishing detected!':
            return 'fa-skull-crossbones';
        default:
            return 'fa-question-circle';
    }
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

// Save scan result to recent scans
function saveToRecentScans(result) {
    // Only save URL scans, skip email scans
    if (result.url.includes('@')) {
        return;
    }
    
    let recentScans = JSON.parse(localStorage.getItem('recentScans') || '[]');
    
    recentScans.unshift({
        url: result.url,
        status: result.verdict.toLowerCase().replace('!', ''),
        timestamp: new Date().toISOString(),
        confidence: result.confidence,
        flags: result.flags
    });
    
    recentScans = recentScans.slice(0, 10);
    localStorage.setItem('recentScans', JSON.stringify(recentScans));
    updateRecentScans();
}

// Report URL/Email function
function reportUrl(url, status) {
    let reports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    reports.push({
        url: url,
        status: status.toLowerCase().replace('!', ''),
        timestamp: new Date().toISOString(),
        reportedBy: 'user'
    });
    
    localStorage.setItem('reports', JSON.stringify(reports));
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${url.includes('@') ? 'Email' : 'URL'} reported successfully!
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateX(100%)';
        setTimeout(() => successMessage.remove(), 500);
    }, 3000);
}

// Update recent scans display
function updateRecentScans() {
    const recentScansContainer = document.querySelector('.recent-scans');
    if (!recentScansContainer) return;
    
    let recentScans = JSON.parse(localStorage.getItem('recentScans') || '[]');
    
    // If no scans, add dummy data
    if (recentScans.length === 0) {
        recentScans = [
            { url: 'https://example.com', status: 'safe', timestamp: '2 minutes ago' },
            { url: 'https://suspicious-site.net', status: 'phishing', timestamp: '5 minutes ago' },
            { url: 'https://legitimate-site.org', status: 'safe', timestamp: '10 minutes ago' }
        ];
    }
    
    recentScansContainer.innerHTML = '';
    
    recentScans.forEach((scan, index) => {
        const scanElement = createScanElement(scan);
        scanElement.style.opacity = '0';
        scanElement.style.transform = 'translateX(-20px)';
        recentScansContainer.appendChild(scanElement);
        
        // Animate each scan item with a delay
        setTimeout(() => {
            scanElement.style.transition = 'all 0.5s ease';
            scanElement.style.opacity = '1';
            scanElement.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Create scan element
function createScanElement(scan) {
    const scanElement = document.createElement('div');
    scanElement.className = 'scan-item bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-emerald-500 transition-all duration-300';
    
    const statusColor = {
        safe: 'text-emerald-500',
        suspicious: 'text-yellow-500',
        phishing: 'text-red-500'
    };
    
    const statusIcon = {
        safe: 'fa-shield-alt',
        suspicious: 'fa-exclamation-triangle',
        phishing: 'fa-skull-crossbones'
    };
    
    const isLongUrl = scan.url.length > 30;
    const displayUrl = isLongUrl ? scan.url.substring(0, 30) + '...' : scan.url;
    
    scanElement.innerHTML = `
        <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <i class="fas ${statusIcon[scan.status]} ${statusColor[scan.status]} text-xl"></i>
                <div class="flex-1 min-w-0">
                    <div class="font-medium text-white">
                        ${displayUrl}
                        ${isLongUrl ? `
                            <button class="text-blue-400 hover:text-blue-300 text-sm ml-2 see-more-btn">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        ` : ''}
                    </div>
                    <div class="text-sm ${statusColor[scan.status]}">${scan.status.toUpperCase()}</div>
                </div>
            </div>
            <div class="text-gray-400 text-sm">${scan.timestamp}</div>
        </div>
        ${isLongUrl ? `
            <div class="mt-2 text-gray-300 text-sm hidden full-url">
                ${scan.url}
            </div>
        ` : ''}
    `;
    
    // Add click handler for "See More" button
    if (isLongUrl) {
        const seeMoreBtn = scanElement.querySelector('.see-more-btn');
        const fullUrl = scanElement.querySelector('.full-url');
        const urlDisplay = scanElement.querySelector('.font-medium');
        
        seeMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fullUrl.classList.toggle('hidden');
            const icon = seeMoreBtn.querySelector('i');
            if (fullUrl.classList.contains('hidden')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    }
    
    return scanElement;
}

// Initialize counters
function initCounters() {
    const threatCounter = document.querySelector('.threat-counter');
    const scanCounter = document.querySelector('.scan-counter');
    
    if (threatCounter && scanCounter) {
        animateCounter(threatCounter, 42);
        animateCounter(scanCounter, 156);
    }
}

// Animate counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Threat Log Simulation
const threatMessages = [
    'Scanning URL: example.com...',
    'Analyzing email content...',
    'Checking for malicious patterns...',
    'Verifying SSL certificate...',
    'Running AI-powered threat detection...',
    'Scanning for phishing attempts...',
    'Analyzing attachment security...',
    'Checking domain reputation...'
];

// Initialize threat log
function initThreatLog() {
    const threatLog = document.querySelector('.threat-messages');
    if (!threatLog) return;
    
    let currentIndex = 0;
    
    const addThreatMessage = () => {
        const message = document.createElement('div');
        message.className = 'threat-message';
        message.textContent = threatMessages[currentIndex];
        
        threatLog.appendChild(message);
        
        // Remove old messages if more than 5
        if (threatLog.children.length > 5) {
            threatLog.removeChild(threatLog.children[0]);
        }
        
        currentIndex = (currentIndex + 1) % threatMessages.length;
    };
    
    // Add initial messages
    for (let i = 0; i < 3; i++) {
        addThreatMessage();
    }
    
    // Add new message every 3 seconds
    setInterval(addThreatMessage, 3000);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize threat log
    initThreatLog();
    
    // Initialize counters
    initCounters();
    
    // Initialize recent scans
    updateRecentScans();
    
    // Add scan button functionality
    const urlScanBtn = document.querySelector('button:has(i.fa-shield-alt)');
    const emailScanBtn = document.getElementById('emailScanBtn');
    
    if (urlScanBtn) {
        urlScanBtn.addEventListener('click', () => {
            const urlInput = document.getElementById('urlInput');
            const url = urlInput.value.trim();
            
            if (!url) {
                showError('Please enter a URL to scan');
                return;
            }
            
            startScanAnimation(urlScanBtn.parentElement, url, 'url');
        });
    }
    
    if (emailScanBtn) {
        emailScanBtn.addEventListener('click', () => {
            const emailInput = document.getElementById('emailInput');
            const email = emailInput.value.trim();
            
            if (!email) {
                showError('Please enter email content to scan');
                return;
            }
            
            startScanAnimation(emailScanBtn.parentElement, email, 'email');
        });
    }

    // Initialize mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
    mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // Handle active states for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.cyber-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll Down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll Up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Scroll Reveal Animations
const scrollReveal = () => {
    const elements = document.querySelectorAll('.scroll-reveal');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', scrollReveal);

// Run counter animations when dashboard section is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const dashboardSection = document.querySelector('#dashboard');
if (dashboardSection) {
    observer.observe(dashboardSection);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-reveal class to elements
document.querySelectorAll('section').forEach(section => {
    section.classList.add('scroll-reveal');
});

// Initialize scroll reveal on load
scrollReveal();

// Add these new functions after the existing code
function startScanAnimation(container, input, type) {
    // Create scan animation container
    const scanAnimation = document.createElement('div');
    scanAnimation.className = 'scan-animation';
    scanAnimation.innerHTML = `
        <div class="scan-text">Analyzing ${type === 'url' ? 'URL' : 'email'} for threats...</div>
        <div class="scan-progress"></div>
    `;
    
    // Replace input with animation
    const inputContainer = container.querySelector('.relative');
    inputContainer.style.display = 'none';
    container.appendChild(scanAnimation);
    
    // Terminal flicker effect
    const scanText = scanAnimation.querySelector('.scan-text');
    const originalText = scanText.textContent;
    let flickerCount = 0;
    const maxFlickers = 20;
    
    function flicker() {
        if (flickerCount < maxFlickers) {
            scanText.textContent = generateBinary(originalText.length);
            flickerCount++;
            setTimeout(flicker, Math.random() * 100);
        } else {
            scanText.textContent = originalText;
        }
    }
    
    flicker();
    
    // Simulate scan delay
    setTimeout(() => {
        // Hide animation
        scanAnimation.style.display = 'none';
        
        // Generate and display result
        const result = type === 'url' ? generateUrlResult() : generateEmailResult(input);
        result.url = input;
        displayResult(result, container);
        
        // Re-enable input
        inputContainer.style.display = 'block';
        scanAnimation.remove();
        
        // Update recent scans
            updateRecentScans();
    }, 3000);
}
