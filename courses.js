const authToken = localStorage.getItem('authToken');
const welcomeName = localStorage.getItem('welcomeName') || 'Learner';

if (!authToken) {
    window.location.href = 'login.html';
}

document.getElementById('authLinks').innerHTML = `<a href="#" class="nav-link logout-link">Logout</a> <span class="nav-link">${welcomeName}</span>`;

function openCourse(courseId) {
    // Store the selected course in localStorage for the course page
    localStorage.setItem('selectedCourse', courseId);
    window.location.href = `course.html?id=${courseId}`;
}

// Category filtering
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        // For now, just scroll to courses section
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
