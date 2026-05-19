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

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    messageDiv.className = 'message ' + type;
}

showSavedLoginSummary();

// Logout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logout-link')) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('welcomeName');
        window.location.href = 'login.html';
    }
});

