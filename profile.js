const authToken = localStorage.getItem('authToken');

if (!authToken) {
    window.location.href = 'login.html';
}

const authLinks = document.getElementById('authLinks');
if (authLinks) {
    const welcomeName = localStorage.getItem('welcomeName') || 'Learner';
    authLinks.innerHTML = `
        <div class="nav-user-menu">
            <button type="button" class="nav-link nav-user-toggle">${welcomeName}</button>
            <div class="nav-user-dropdown">
                <a href="profile.html" class="nav-link nav-user-item">Profile</a>
                <a href="#" class="nav-link nav-user-item logout-link">Logout</a>
            </div>
        </div>
    `;
}

async function fetchUserProfile() {
    try {
        const response = await fetch('/api/user-info', {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
            throw new Error('Unable to load profile');
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

function showProfile(user) {
    document.getElementById('profileName').textContent = user.fullName || 'Learner';
    document.getElementById('profileEmail').textContent = user.email || 'Not set';
    document.getElementById('profileExpertise').textContent = user.expertise || 'Beginner';
    document.getElementById('totalPoints').textContent = user.totalPoints || 0;

    const joinedDate = user.createdAt ? new Date(user.createdAt) : null;
    document.getElementById('joinedDate').textContent = joinedDate && !isNaN(joinedDate) ? joinedDate.toLocaleDateString() : '-';

    const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;
    document.getElementById('lastLogin').textContent = lastLoginDate && !isNaN(lastLoginDate) ? lastLoginDate.toLocaleString() : 'Today';

    const premiumStatus = document.getElementById('premiumStatus');
    const premiumNote = document.getElementById('premiumNote');
    if (user.totalPoints >= 300) {
        premiumStatus.textContent = 'Unlocked 🎉';
        premiumNote.textContent = 'You have premium access. Great job staying active!';
    } else {
        const remaining = 300 - (user.totalPoints || 0);
        premiumStatus.textContent = 'Locked';
        premiumNote.textContent = `Earn ${remaining} more points to unlock premium courses.`;
    }
}

function showOfflineProfile() {
    const profileName = localStorage.getItem('welcomeName') || 'Learner';
    const expertise = localStorage.getItem('authExpertise') || 'Beginner';
    document.getElementById('profileName').textContent = profileName;
    document.getElementById('profileEmail').textContent = 'Not available offline';
    document.getElementById('profileExpertise').textContent = expertise;
    document.getElementById('totalPoints').textContent = localStorage.getItem('totalPoints') || 0;
    document.getElementById('joinedDate').textContent = '-';
    document.getElementById('lastLogin').textContent = '-';
    document.getElementById('premiumStatus').textContent = 'Loading...';
    document.getElementById('premiumNote').textContent = 'Connect again to see full account data.';
}

async function initProfile() {
    const user = await fetchUserProfile();
    if (user) {
        showProfile(user);
        localStorage.setItem('totalPoints', user.totalPoints || 0);
    } else {
        showOfflineProfile();
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

initProfile();
