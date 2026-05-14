const authToken = localStorage.getItem('authToken');
const welcomeName = localStorage.getItem('welcomeName') || 'Learner';
const expertise = localStorage.getItem('authExpertise') || 'Learner';

if (!authToken) {
    window.location.href = 'login.html';
}

document.getElementById('welcomeName').textContent = welcomeName;

const authLinks = document.getElementById('authLinks');
if (authLinks) {
    authLinks.innerHTML = `<a href="#" class="nav-link logout-link">Logout</a> <span class="nav-link">${welcomeName}</span>`;
}

function openCourse(courseId) {
    localStorage.setItem('selectedCourse', courseId);
    window.location.href = `course.html?id=${courseId}`;
}

// Load course progress
function loadCourseProgress() {
    const aiProgress = JSON.parse(localStorage.getItem('courseProgress_ai-mastery')) || {};
    const aiCompleted = Object.keys(aiProgress).length;
    const aiTotal = 25; // Total lessons in AI course
    const aiPercent = Math.round((aiCompleted / aiTotal) * 100);

    document.getElementById('aiProgress').textContent = `${aiPercent}%`;
    document.getElementById('aiCompleted').textContent = `${aiCompleted}/${aiTotal} lessons`;

    // Update overall progress
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

if (!completedModules) {
    loadCourseProgress();
} else {
    document.getElementById('completedModules').textContent = completedModules;
    document.getElementById('activeProjects').textContent = activeProjects;
    document.getElementById('weeklyHours').textContent = weeklyHours;
    document.getElementById('nextMilestone').textContent = nextMilestone;
}

// Update profile summary
const profileSummary = document.createElement('div');
profileSummary.className = 'feature-item';
profileSummary.innerHTML = `
    <div class="feature-icon">👤</div>
    <h3>Profile Summary</h3>
    <p><strong>${welcomeName}</strong></p>
    <p>You are learning: <strong>${expertise}</strong>.</p>
    <p>Current focus: <strong>AI Tools & Freelancing</strong></p>
`;

const section = document.querySelector('.features-grid');
if (section) {
    section.insertBefore(profileSummary, section.firstChild);
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

// Load progress on page load
document.addEventListener('DOMContentLoaded', loadCourseProgress);
