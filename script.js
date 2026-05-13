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
            // Store registration data for verification
            registrationData = { fullName, email, password, expertise };
            
            // Show verification form
            document.getElementById('registrationSection').style.display = 'none';
            document.getElementById('verificationSection').style.display = 'block';
            document.getElementById('verifyEmail').textContent = email;
            document.getElementById('verificationCode').focus();
            
            showVerificationMessage('✅ Check your email for the verification code!', 'success');
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

// Email Verification Form Handler
document.getElementById('verificationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = registrationData.email;
    const verificationCode = document.getElementById('verificationCode').value.trim();

    if (!verificationCode || verificationCode.length !== 6) {
        showVerificationMessage('Please enter a valid 6-digit code', 'error');
        return;
    }

    try {
        const response = await fetch('/api/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                verificationCode,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and welcome details
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            localStorage.setItem('welcomeName', data.user.fullName || 'Learner');
            
            showVerificationMessage('🎉 Email verified! Redirecting to your welcome page...', 'success');
            
            setTimeout(() => {
                window.location.href = 'welcome.html';
            }, 1800);
        } else {
            showVerificationMessage(data.message || 'Verification failed', 'error');
        }
    } catch (error) {
        showVerificationMessage('Error: ' + error.message, 'error');
    }
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
}

function showVerificationMessage(message, type) {
    const messageDiv = document.getElementById('verificationMessage');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function goBackToRegister(e) {
    e.preventDefault();
    document.getElementById('registrationSection').style.display = 'block';
    document.getElementById('verificationSection').style.display = 'none';
    document.getElementById('registrationForm').reset();
    document.getElementById('message').textContent = '';
}

async function resendCode(e) {
    e.preventDefault();

    if (!registrationData.email) {
        showVerificationMessage('No registration email found. Please register again.', 'error');
        return;
    }

    showVerificationMessage('📧 Resending code to ' + registrationData.email + '...', 'info');

    try {
        const response = await fetch('/api/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: registrationData.email }),
        });

        const data = await response.json();

        if (response.ok && data.requiresVerification) {
            showVerificationMessage('✅ New code sent! Check your email.', 'success');
        } else {
            showVerificationMessage(data.message || 'Failed to resend code', 'error');
        }
    } catch (error) {
        showVerificationMessage('Error: ' + error.message, 'error');
    }
}

// Logout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logout-link')) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('welcomeName');
        window.location.href = 'login.html';
    }
});
