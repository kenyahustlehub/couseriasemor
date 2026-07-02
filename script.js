const getApiUrl = (path) => {
    const isLocalPreview = window.location.hostname === '127.0.0.1' && window.location.port === '3000';
    return isLocalPreview ? `http://127.0.0.1:3005${path}` : path;
};

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
        const response = await fetch(getApiUrl('/api/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                email,
                password,
                expertise,
                localDate: new Date().toISOString().split('T')[0],
            }),
        });

        const data = await response.json();

        if (response.ok) {
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            if (data.user && data.user.expertise) {
                localStorage.setItem('authExpertise', data.user.expertise);
            }
            if (data.user && typeof data.user.totalPoints !== 'undefined') {
                localStorage.setItem('totalPoints', data.user.totalPoints);
            }
            localStorage.setItem('welcomeName', data.user.fullName || 'Learner');

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
    startGoogleSignup();
});

async function startGoogleSignup() {
    try {
        const configResponse = await fetch(getApiUrl('/api/google-config'));
        const config = await configResponse.json();

        if (!config.clientId) {
            showMessage('Google signup is not configured for this deployment.', 'error');
            return;
        }

        const state = createRandomState();
        sessionStorage.setItem('google_oauth_state', state);

        const redirectUri = `${window.location.origin}/register.html`;
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', config.clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('response_type', 'id_token');
        authUrl.searchParams.set('scope', 'openid email profile');
        authUrl.searchParams.set('nonce', state);
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('prompt', 'select_account');

        window.location.href = authUrl.toString();
    } catch (error) {
        showMessage('Unable to start Google signup. Try again later.', 'error');
    }
}

async function finishGoogleSignup(idToken, state) {
    try {
        const response = await fetch(getApiUrl('/api/auth/google'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken, state }),
        });

        const data = await response.json();
        if (!response.ok) {
            showMessage(data.message || 'Google sign-in failed. Please try again.', 'error');
            return;
        }

        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        if (data.user && data.user.expertise) {
            localStorage.setItem('authExpertise', data.user.expertise);
        }
        if (data.user && typeof data.user.totalPoints !== 'undefined') {
            localStorage.setItem('totalPoints', data.user.totalPoints);
        }
        localStorage.setItem('welcomeName', data.user.fullName || 'Learner');

        showMessage('Google sign-in successful! Redirecting to your dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1200);
    } catch (error) {
        showMessage('Google sign-in failed. Please try again.', 'error');
    }
}

function createRandomState() {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function parseGoogleRedirect() {
    if (!window.location.hash.includes('id_token=')) {
        return;
    }

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const idToken = hashParams.get('id_token');
    const state = hashParams.get('state');
    const storedState = sessionStorage.getItem('google_oauth_state');
    sessionStorage.removeItem('google_oauth_state');

    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

    if (!idToken || !state || state !== storedState) {
        showMessage('Google sign-in failed. Please try again.', 'error');
        return;
    }

    finishGoogleSignup(idToken, state);
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message;
    messageDiv.className = 'message ' + type;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

parseGoogleRedirect();

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
