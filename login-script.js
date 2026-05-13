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
            localStorage.setItem('token', data.token);
            showMessage('Login successful! Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            // Check if this is an email verification error
            if (response.status === 403 && data.requiresVerification) {
                showMessage(
                    '📧 ' + data.message + '\n\nCheck your inbox and spam folder for the verification email.',
                    'error'
                );
            } else {
                showMessage(data.message || 'Login failed', 'error');
            }
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

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

