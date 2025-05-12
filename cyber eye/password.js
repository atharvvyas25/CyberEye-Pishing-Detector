// Common password blacklist
const passwordBlacklist = [
    "123456", "password", "12345678", "qwerty", "123456789", "12345",
    "1234", "111111", "1234567", "dragon", "123123", "baseball",
    "abc123", "football", "monkey", "letmein", "shadow", "master",
    "666666", "qwertyuiop", "123321", "mustang", "1234567890",
    "michael", "654321", "superman", "1qaz2wsx", "7777777",
    "121212", "000000", "qazwsx", "123qwe", "killer", "trustno1",
    "jordan", "jennifer", "zxcvbnm", "asdfgh", "hunter", "buster",
    "soccer", "harley", "batman", "andrew", "tigger", "sunshine",
    "iloveyou", "fuckme", "2000", "charlie", "robert", "thomas",
    "hockey", "ranger", "daniel", "starwars", "klaster", "112233",
    "george", "computer", "michelle", "jessica", "pepper", "1111",
    "zxcvbn", "555555", "11111111", "131313", "freedom", "777777",
    "pass", "maggie", "159753", "aaaaaa", "ginger", "princess",
    "joshua", "cheese", "amanda", "summer", "love", "ashley",
    "nicole", "chelsea", "biteme", "matthew", "access", "yankees",
    "987654321", "dallas", "austin", "thunder", "taylor", "matrix",
    "mobilemail", "mom", "monitor", "monitoring", "montana", "moon",
    "moscow"
];

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleIcon = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const strengthMeterFill = document.getElementById('strengthMeterFill');
    const strengthText = document.getElementById('strengthText');
    const strengthPercentage = document.getElementById('strengthPercentage');
    const passwordContainer = document.querySelector('.password-container');
    
    // Reset animations
    strengthMeterFill.style.width = '0';
    strengthText.classList.remove('visible');
    strengthPercentage.classList.remove('visible');
    
    if (!password) {
        alert('Please enter a password');
        return;
    }

    // Check if password is in blacklist
    const isBlacklisted = passwordBlacklist.includes(password.toLowerCase());
    
    // Remove existing warning if any
    const existingWarning = document.getElementById('blacklistWarning');
    if (existingWarning) {
        existingWarning.remove();
    }

    if (isBlacklisted) {
        // Create new warning
        const blacklistWarning = document.createElement('div');
        blacklistWarning.id = 'blacklistWarning';
        blacklistWarning.className = 'blacklist-warning';
        blacklistWarning.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>This password is commonly used and unsafe. Avoid it.</span>
            </div>
        `;
        
        // Insert warning after the strength meter
        const strengthMeter = document.querySelector('.strength-meter');
        strengthMeter.parentNode.insertBefore(blacklistWarning, strengthMeter.nextSibling);
    }

    // Requirements
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Update requirement indicators
    updateRequirement('lengthReq', hasLength);
    updateRequirement('uppercaseReq', hasUppercase);
    updateRequirement('numberReq', hasNumber);
    updateRequirement('specialReq', hasSpecial);

    // Calculate strength
    let strength = 0;
    if (hasLength) strength += 25;
    if (hasUppercase) strength += 25;
    if (hasNumber) strength += 25;
    if (hasSpecial) strength += 25;

    // If password is blacklisted, force strength to be low
    if (isBlacklisted) {
        strength = Math.min(strength, 25);
    }

    // Animate the meter
    setTimeout(() => {
        strengthMeterFill.style.width = `${strength}%`;
        
        // Set color based on strength
        if (strength <= 25) {
            strengthMeterFill.style.backgroundColor = '#ef4444'; // Red
            strengthText.textContent = isBlacklisted ? 'Very Weak (Blacklisted)' : 'Poor Password';
        } else if (strength <= 50) {
            strengthMeterFill.style.backgroundColor = '#f59e0b'; // Yellow
            strengthText.textContent = 'Weak Password';
        } else if (strength <= 75) {
            strengthMeterFill.style.backgroundColor = '#3b82f6'; // Blue
            strengthText.textContent = 'Good Password';
        } else {
            strengthMeterFill.style.backgroundColor = '#10b981'; // Green
            strengthText.textContent = 'Strong Password';
        }

        // Show percentage and text with animation
        strengthPercentage.textContent = `${strength}%`;
        setTimeout(() => {
            strengthPercentage.classList.add('visible');
            strengthText.classList.add('visible');
        }, 500);
    }, 100);
}

function updateRequirement(id, isValid) {
    const element = document.getElementById(id);
    const icon = element.querySelector('i');
    
    if (isValid) {
        element.classList.add('valid');
        icon.className = 'fas fa-check';
    } else {
        element.classList.remove('valid');
        icon.className = 'fas fa-times';
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const checkButton = document.getElementById('checkButton');
    if (checkButton) {
        checkButton.addEventListener('click', checkPassword);
    }

    // Add event listener for Enter key on password input
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }

    // Add event listener for password toggle
    const toggleButton = document.querySelector('.password-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', togglePasswordVisibility);
    }
}); 