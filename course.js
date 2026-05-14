const authToken = localStorage.getItem('authToken');
const welcomeName = localStorage.getItem('welcomeName') || 'Learner';

if (!authToken) {
    window.location.href = 'login.html';
}

document.getElementById('authLinks').innerHTML = `<a href="#" class="nav-link logout-link">Logout</a> <span class="nav-link">${welcomeName}</span>`;

// Get course ID from URL
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id') || localStorage.getItem('selectedCourse');

if (!courseId) {
    window.location.href = 'courses.html';
}

// Course data structure
const courses = {
    'ai-mastery': {
        title: 'AI Tools Mastery',
        description: 'Complete guide to AI productivity tools, ChatGPT, Midjourney, and workflow automation.',
        category: 'AI & Automation',
        totalLessons: 25,
        totalDuration: '8 hours',
        rating: '4.8',
        reviews: '2.1k',
        students: '15,000+',
        lessons: [
            {
                id: 1,
                title: 'Welcome to AI Tools Mastery',
                duration: '5 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://example.com/video1.mp4',
                description: 'Welcome to the AI Tools Mastery course! In this comprehensive program, you\'ll learn how to leverage artificial intelligence to supercharge your productivity and creativity.',
                resources: [
                    { type: 'pdf', name: 'Course Syllabus', url: 'syllabus.pdf' },
                    { type: 'pdf', name: 'AI Tools Checklist', url: 'checklist.pdf' },
                    { type: 'link', name: 'Recommended AI Tools', url: 'https://tools.example.com' }
                ]
            },
            {
                id: 2,
                title: 'Understanding AI Fundamentals',
                duration: '12 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://example.com/video2.mp4',
                description: 'Learn the basics of artificial intelligence, machine learning, and how AI tools work behind the scenes.',
                resources: [
                    { type: 'pdf', name: 'AI Fundamentals Guide', url: 'ai-fundamentals.pdf' }
                ]
            },
            {
                id: 3,
                title: 'Getting Started with ChatGPT',
                duration: '15 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://example.com/video3.mp4',
                description: 'Master the art of prompt engineering and learn how to get the best results from ChatGPT.',
                resources: [
                    { type: 'pdf', name: 'Prompt Engineering Guide', url: 'prompt-guide.pdf' },
                    { type: 'pdf', name: 'ChatGPT Templates', url: 'chatgpt-templates.pdf' }
                ]
            },
            {
                id: 4,
                title: 'Creating Content with AI',
                duration: '18 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://example.com/video4.mp4',
                description: 'Use AI to generate blog posts, social media content, marketing copy, and more.',
                resources: [
                    { type: 'pdf', name: 'Content Creation Templates', url: 'content-templates.pdf' }
                ]
            },
            {
                id: 5,
                title: 'AI Image Generation with Midjourney',
                duration: '20 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://example.com/video5.mp4',
                description: 'Create stunning visuals and artwork using AI-powered image generation tools.',
                resources: [
                    { type: 'pdf', name: 'Midjourney Prompt Guide', url: 'midjourney-guide.pdf' }
                ]
            }
        ]
    },
    'web-dev': {
        title: 'Modern Web Development',
        description: 'Build responsive websites with HTML, CSS, JavaScript, and modern frameworks.',
        category: 'Programming & Development',
        totalLessons: 30,
        totalDuration: '12 hours',
        rating: '4.9',
        reviews: '1.8k',
        students: '12,000+',
        lessons: [
            {
                id: 1,
                title: 'Introduction to Web Development',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://example.com/web1.mp4',
                description: 'Learn what web development is and why it\'s an essential skill in today\'s digital world.',
                resources: [
                    { type: 'pdf', name: 'Web Dev Roadmap', url: 'web-roadmap.pdf' }
                ]
            }
        ]
    },
    'freelance': {
        title: 'Freelancing Mastery',
        description: 'Launch your freelance career with client acquisition, pricing, and project management.',
        category: 'Business & Freelancing',
        totalLessons: 20,
        totalDuration: '6 hours',
        rating: '4.7',
        reviews: '950',
        students: '8,000+',
        lessons: [
            {
                id: 1,
                title: 'Freelancing Mindset',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://example.com/freelance1.mp4',
                description: 'Develop the right mindset for freelancing success and learn what it takes to be a successful freelancer.',
                resources: [
                    { type: 'pdf', name: 'Freelancer Mindset Guide', url: 'freelance-mindset.pdf' }
                ]
            }
        ]
    }
};

let currentLessonIndex = 0;
let courseProgress = JSON.parse(localStorage.getItem(`courseProgress_${courseId}`)) || {};

function initializeCourse() {
    const course = courses[courseId];
    if (!course) {
        window.location.href = 'courses.html';
        return;
    }

    // Update course header
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseDescription').textContent = course.description;
    document.querySelector('.course-category').textContent = course.category;

    // Update progress
    updateProgress();

    // Load lessons
    loadLessons();

    // Load current lesson
    loadLesson(currentLessonIndex);
}

function loadLessons() {
    const course = courses[courseId];
    const lessonsList = document.getElementById('lessonsList');

    lessonsList.innerHTML = '';

    course.lessons.forEach((lesson, index) => {
        const lessonItem = document.createElement('div');
        lessonItem.className = `lesson-item ${lesson.completed ? 'completed' : ''} ${index === currentLessonIndex ? 'active' : ''}`;
        lessonItem.onclick = () => selectLesson(index);

        lessonItem.innerHTML = `
            <div class="lesson-status">
                ${lesson.completed ? '✓' : index + 1}
            </div>
            <div class="lesson-info">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-meta">${lesson.duration} • ${lesson.type}</div>
            </div>
        `;

        lessonsList.appendChild(lessonItem);
    });
}

function selectLesson(index) {
    currentLessonIndex = index;
    loadLessons();
    loadLesson(index);
}

function loadLesson(index) {
    const course = courses[courseId];
    const lesson = course.lessons[index];

    if (!lesson) return;

    // Update lesson header
    document.getElementById('currentLessonTitle').textContent = lesson.title;
    document.querySelector('.lesson-duration').textContent = lesson.duration;
    document.querySelector('.lesson-type').textContent = lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1);

    // Update video container
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `
        <div class="video-placeholder">
            <div class="play-button" onclick="playVideo('${lesson.videoUrl}')">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
            <div class="video-info">
                <h3>${lesson.title}</h3>
                <p>${lesson.description.split('.')[0]}</p>
            </div>
        </div>
    `;

    // Update lesson content
    document.getElementById('lessonDescription').innerHTML = lesson.description;

    // Update resources
    const resourcesContainer = document.getElementById('lessonResources');
    if (lesson.resources && lesson.resources.length > 0) {
        resourcesContainer.innerHTML = `
            <h4>Resources</h4>
            <div class="resource-list">
                ${lesson.resources.map(resource => `
                    <div class="resource-item">
                        <span class="resource-icon">${getResourceIcon(resource.type)}</span>
                        <a href="${resource.url}" class="resource-link" ${resource.type === 'link' ? 'target="_blank"' : ''}>${resource.name}</a>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        resourcesContainer.innerHTML = '';
    }

    // Update navigation
    updateNavigation();
}

function getResourceIcon(type) {
    switch (type) {
        case 'pdf': return '📄';
        case 'link': return '🔗';
        case 'doc': return '📋';
        default: return '📄';
    }
}

function playVideo(videoUrl) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `
        <div class="video-player">
            <video controls autoplay style="width: 100%; max-height: 400px; background: #000;">
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;

    // Mark lesson as completed when video ends
    const video = videoContainer.querySelector('video');
    video.addEventListener('ended', () => {
        markLessonCompleted(currentLessonIndex);
    });
}

function markLessonCompleted(index) {
    const course = courses[courseId];
    course.lessons[index].completed = true;
    courseProgress[index] = true;
    localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(courseProgress));
    updateProgress();
    loadLessons();
}

function updateProgress() {
    const course = courses[courseId];
    const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
    const progressPercent = Math.round((completedLessons / course.lessons.length) * 100);

    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressPercent').textContent = `${progressPercent}%`;
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevLesson');
    const nextBtn = document.getElementById('nextLesson');

    prevBtn.disabled = currentLessonIndex === 0;
    nextBtn.disabled = currentLessonIndex === courses[courseId].lessons.length - 1;

    prevBtn.onclick = () => currentLessonIndex > 0 && selectLesson(currentLessonIndex - 1);
    nextBtn.onclick = () => currentLessonIndex < courses[courseId].lessons.length - 1 && selectLesson(currentLessonIndex + 1);
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

// Initialize course when page loads
document.addEventListener('DOMContentLoaded', initializeCourse);
