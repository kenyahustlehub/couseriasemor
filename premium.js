const authToken = localStorage.getItem('authToken');

if (!authToken) {
    window.location.href = 'login.html';
}

const authLinks = document.getElementById('authLinks');
if (authLinks) {
    const welcomeName = localStorage.getItem('welcomeName') || 'Learner';
    authLinks.innerHTML = `<a href="#" class="nav-link logout-link">Logout</a> <span class="nav-link">${welcomeName}</span>`;
}

const premiumAction = document.getElementById('premiumAction');
const premiumSummary = document.getElementById('premiumSummary');

async function fetchUserInfo() {
    try {
        const response = await fetch('/api/user-info', {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
            throw new Error('Unable to load account');
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

function updatePremiumView(user) {
    const points = user.totalPoints || 0;
    const remaining = Math.max(300 - points, 0);

    if (points >= 300) {
        premiumSummary.innerHTML = `You are eligible for premium access. Start the premium course now or explore premium learning modules.`;
        premiumAction.textContent = 'Open Premium Course';
        premiumAction.onclick = () => {
            window.location.href = 'course.html?id=premium';
        };
        premiumAction.classList.add('btn-primary');
    } else {
        premiumSummary.innerHTML = `You have <strong>${points}</strong> points. Earn <strong>${remaining}</strong> more points to unlock premium learning.`;
        premiumAction.textContent = 'Keep earning points';
        premiumAction.onclick = () => {
            window.location.href = 'dashboard.html';
        };
        premiumAction.classList.remove('btn-primary');
    }
}

async function initPremium() {
    const user = await fetchUserInfo();
    if (user) {
        updatePremiumView(user);
    } else {
        premiumSummary.innerHTML = 'Unable to load your account. Please log in again to continue.';
        premiumAction.textContent = 'Return to login';
        premiumAction.onclick = () => { window.location.href = 'login.html'; };
    }
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

initPremium();
