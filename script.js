// Registration Form Handler
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    let email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const expertise = document.getElementById('expertise').value;

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

    // normalize email to prevent duplicate registrations (server also normalizes)
    email = email.toLowerCase();

    try {
        const nameParts = fullName.split(' ').filter(Boolean);
        const firstName = nameParts.shift() || '';
        const lastName = nameParts.join(' ');

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            saveUserState(data.user);

            showMessage('🎉 Welcome aboard! You earned 10 welcome points. Redirecting to your dashboard...', 'success');

            setTimeout(() => {
                window.location.href = 'welcome.html';
            }, 1600);
        } else {
            const messageText = data.message || 'Registration failed. Please try again or use a different email.';
            showMessage(`${messageText} <a href="login.html">Already registered?</a>`, 'error');
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

