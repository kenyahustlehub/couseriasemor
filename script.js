let registrationData = {};

// Registration Form Handler
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const expertise = document.getElementById('expertise').value;
    const messageDiv = document.getElementById('message');

    // Validation
    if (!fullName || !email || !password || !expertise) {
        showMessage('All fields are required', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email', 'error');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                email,
                password,
                expertise,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and welcome details
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            if (data.user && data.user.expertise) {
                localStorage.setItem('authExpertise', data.user.expertise);
            }
            localStorage.setItem('welcomeName', data.user.fullName || 'Learner');

            showMessage('🎉 Account created! Redirecting to your dashboard...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1800);
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

// Google Signup Handler
document.getElementById('googleSignup').addEventListener('click', () => {
    // For now, just show a message that Google signup is coming soon
    showMessage('Google signup coming soon! Please use the form below.', 'info');
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Logout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logout-link')) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('welcomeName');
        localStorage.removeItem('authExpertise');
        window.location.href = 'login.html';
    }
});
