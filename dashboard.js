const authToken = localStorage.getItem('authToken');
const welcomeName = localStorage.getItem('welcomeName') || 'Learner';
const expertise = localStorage.getItem('authExpertise') || 'Learner';

if (!authToken) {
    window.location.href = 'login.html';
}

document.getElementById('welcomeName').textContent = welcomeName;

const authLinks = document.getElementById('authLinks');
if (authLinks) {
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
            throw new Error('Failed to load user info');
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

function updatePointsSummary(user) {
    const points = user?.totalPoints || 0;
    const remaining = Math.max(300 - points, 0);
    document.getElementById('totalPoints').textContent = points;
    document.getElementById('premiumUnlock').textContent = points >= 300 ? 'Unlocked 🎉' : `${remaining} more points to premium`;
    document.getElementById('lastLogin').textContent = user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Today';
    localStorage.setItem('totalPoints', points);
}

function createProfileSummary(user) {
    const profileSummary = document.createElement('div');
    profileSummary.className = 'feature-item';
    profileSummary.innerHTML = `
        <div class="feature-icon">👤</div>
        <h3>Profile Summary</h3>
        <p><strong>${user.fullName || welcomeName}</strong></p>
        <p>You are learning: <strong>${user.expertise || expertise}</strong>.</p>
        <p>Current focus: <strong>${user.totalPoints >= 300 ? 'Premium growth' : 'Daily login streak'}</strong></p>
    `;

    const section = document.querySelector('.features-grid');
    if (section) {
        section.insertBefore(profileSummary, section.firstChild);
    }
}

function loadCourseProgress() {
    const aiProgress = JSON.parse(localStorage.getItem('courseProgress_ai-mastery')) || {};
    const aiCompleted = Object.keys(aiProgress).length;
    const aiTotal = 25;
    const aiPercent = Math.round((aiCompleted / aiTotal) * 100);

    document.getElementById('aiProgress').textContent = `${aiPercent}%`;
    document.getElementById('aiCompleted').textContent = `${aiCompleted}/${aiTotal} lessons`;

    const completedModules = aiCompleted > 0 ? 1 : 0;
    const activeProjects = aiCompleted > 10 ? 2 : 1;
    const weeklyHours = Math.min(aiCompleted * 0.3, 10);
    const nextMilestone = aiCompleted > 15 ? 'Advanced AI' : aiCompleted > 5 ? 'Midjourney' : 'ChatGPT';

    localStorage.setItem('completedModules', completedModules);
    localStorage.setItem('activeProjects', activeProjects);
    localStorage.setItem('weeklyHours', weeklyHours);
    localStorage.setItem('nextMilestone', nextMilestone);

    document.getElementById('completedModules').textContent = completedModules;
    document.getElementById('activeProjects').textContent = activeProjects;
    document.getElementById('weeklyHours').textContent = weeklyHours;
    document.getElementById('nextMilestone').textContent = nextMilestone;
}

let completedModules = localStorage.getItem('completedModules');
let activeProjects = localStorage.getItem('activeProjects');
let weeklyHours = localStorage.getItem('weeklyHours');
let nextMilestone = localStorage.getItem('nextMilestone');

async function initDashboard() {
    const user = await fetchUserInfo();
    if (user) {
        updatePointsSummary(user);
        createProfileSummary(user);
    } else {
        updatePointsSummary({ totalPoints: Number(localStorage.getItem('totalPoints') || 0), lastLogin: null, expertise });
        createProfileSummary({ fullName: welcomeName, expertise, totalPoints: Number(localStorage.getItem('totalPoints') || 0) });
    }

    if (!completedModules) {
        loadCourseProgress();
    } else {
        document.getElementById('completedModules').textContent = completedModules;
        document.getElementById('activeProjects').textContent = activeProjects;
        document.getElementById('weeklyHours').textContent = weeklyHours;
        document.getElementById('nextMilestone').textContent = nextMilestone;
    }
}

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

initDashboard();
