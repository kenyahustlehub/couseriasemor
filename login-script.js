const getApiUrl = (path) => {
    const isLocalPreview = window.location.hostname === '127.0.0.1' && window.location.port === '3000';
    return isLocalPreview ? `http://127.0.0.1:3005${path}` : path;
};

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    let email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showMessage('Email and password are required', 'error');
        return;
    }

    // Normalize email to match server-side normalization
    email = email.toLowerCase();

    try {
        const response = await fetch(getApiUrl('/api/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                localDate: new Date().toISOString().split('T')[0],
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('welcomeName', data.user.fullName || 'Learner');
            if (data.user && data.user.expertise) {
                localStorage.setItem('authExpertise', data.user.expertise);
            }
            if (data.user && typeof data.user.totalPoints !== 'undefined') {
                localStorage.setItem('totalPoints', data.user.totalPoints);
            }
            if (data.user && data.user.lastLogin) {
                localStorage.setItem('lastLogin', data.user.lastLogin);
            }

            const totalPoints = data.user?.totalPoints ?? 0;
            const pointsDetails = `You have <strong>${totalPoints} points</strong> saved and ready to grow.`;
            showMessage(`<strong>Welcome back, ${data.user.fullName || 'Learner'}!</strong> ${data.message}<br>${pointsDetails}`, 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1600);
        } else {
            const messageText = data.message || 'Login failed. Check your email and password, or reset your password.';
            showMessage(`${messageText} <a href="forgot-password.html">Forgot password?</a>`, 'error');
        }
    } catch (error) {
        showMessage('Something went wrong while signing in. Please try again in a moment.', 'error');
    }
});

function showSavedLoginSummary() {
    const points = Number(localStorage.getItem('totalPoints') || 0);
    const lastLogin = localStorage.getItem('lastLogin');
    const streakText = document.getElementById('streakText');
    const streakPoints = document.getElementById('streakPoints');
    const streakReminder = document.getElementById('streakReminder');

    if (points > 0) {
        streakText.textContent = `We saved ${points} points from your last session. Keep your streak alive by logging in daily.`;
        streakPoints.textContent = `${points} pts`;
    } else {
        streakText.textContent = 'Your streak starts now — log in daily to earn 10 points each day.';
        streakPoints.textContent = '0 pts';
    }

    if (lastLogin) {
        streakReminder.textContent = `Last signed in: ${new Date(lastLogin).toLocaleDateString()}. Your points are safe.`;
    } else {
        streakReminder.textContent = 'Daily logins build your premium unlock progress. No reset, no restart.';
    }
}

// Google Login Handler
const googleLoginButton = document.getElementById('googleLogin');
if (googleLoginButton) {
    googleLoginButton.addEventListener('click', startGoogleLogin);
}

async function startGoogleLogin() {
    try {
        const configResponse = await fetch(getApiUrl('/api/google-config'));
        const config = await configResponse.json();

        if (!config.clientId) {
            showMessage('Google login is not configured for this deployment.', 'error');
            return;
        }

        const state = createRandomState();
        sessionStorage.setItem('google_oauth_state', state);

        const redirectUri = `${window.location.origin}/login.html`;
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
        showMessage('Unable to start Google login. Try again later.', 'error');
    }
}

async function finishGoogleLogin(idToken, state) {
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

    finishGoogleLogin(idToken, state);
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    messageDiv.className = 'message ' + type;
}

showSavedLoginSummary();
parseGoogleRedirect();

// Logout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logout-link')) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('welcomeName');
        window.location.href = 'login.html';
    }
});

