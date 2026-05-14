document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showMessage('Email and password are required', 'error');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('welcomeName', data.user.fullName || 'Learner');
            if (data.user && data.user.expertise) {
                localStorage.setItem('authExpertise', data.user.expertise);
            }
            showMessage('Login successful! Redirecting to your dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1600);
        } else {
            // Check if this is an email verification error
            if (response.status === 403 && data.requiresVerification) {
                showMessage(
                    '📧 ' + data.message + '\n\nCheck your inbox and spam folder for the verification email.',
                    'error'
                );
                showResendOption(email);
            } else {
                hideResendOption();
                showMessage(data.message || 'Login failed', 'error');
            }
        }
    } catch (error) {
        hideResendOption();
        showMessage('Error: ' + error.message, 'error');
    }
});

const resendVerificationLink = document.getElementById('resendVerificationLink');
if (resendVerificationLink) {
    resendVerificationLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        if (!email) {
            showMessage('Please enter your email to resend the verification code.', 'error');
            return;
        }
        await resendVerificationCode(email);
    });
}

async function resendVerificationCode(email) {
    showMessage('📧 Resending verification email...', 'info');
    try {
        const response = await fetch('/api/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok && data.requiresVerification) {
            showMessage('✅ Verification email resent! Check your inbox and spam folder.', 'success');
            showResendOption(email);
        } else {
            hideResendOption();
            showMessage(data.message || 'Failed to resend verification email', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function showResendOption(email) {
    const resendHelp = document.getElementById('resendHelp');
    if (resendHelp) {
        resendHelp.style.display = 'block';
    }
}

function hideResendOption() {
    const resendHelp = document.getElementById('resendHelp');
    if (resendHelp) {
        resendHelp.style.display = 'none';
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    messageDiv.className = 'message ' + type;
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

