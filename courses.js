const authToken = localStorage.getItem('authToken');
const welcomeName = localStorage.getItem('welcomeName') || 'Learner';

if (!authToken) {
    window.location.href = 'login.html';
}

document.getElementById('authLinks').innerHTML = `
        <div class="nav-user-menu">
            <button type="button" class="nav-link nav-user-toggle">${welcomeName}</button>
            <div class="nav-user-dropdown">
                <a href="profile.html" class="nav-link nav-user-item">Profile</a>
                <a href="#" class="nav-link nav-user-item logout-link">Logout</a>
            </div>
        </div>
    `;

function openCourse(courseId) {
    localStorage.setItem('selectedCourse', courseId);
    window.location.href = `course.html?id=${courseId}`;
}

async function fetchUserInfo() {
    try {
        const response = await fetch('/api/user-info', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Unable to load user info');
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

function updatePremiumCard(user) {
    const premiumButton = document.getElementById('premiumCourseButton');
    if (!premiumButton) return;

    if (user?.totalPoints >= 300) {
        premiumButton.textContent = 'Open Premium';
        premiumButton.onclick = () => {
            window.location.href = 'course.html?id=premium';
        };
    } else {
        premiumButton.textContent = 'Unlock with points';
        premiumButton.onclick = () => {
            window.location.href = 'premium.html';
        };
    }
}

async function initCourses() {
    const user = await fetchUserInfo();

    if (user) {
        updatePremiumCard(user);
    } else {
        updatePremiumCard({ totalPoints: Number(localStorage.getItem('totalPoints') || 0) });
    }
}

// Category filtering
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
    });
});

// Logout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logout-link')) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('welcomeName');
        localStorage.removeItem('authExpertise');
        localStorage.removeItem('selectedCourse');
        window.location.href = 'login.html';
    }
});

initCourses();
