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

async function fetchUserInfo() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return null;

    try {
        const response = await fetch('/api/user-info', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

async function ensurePremiumAccess() {
    if (courseId !== 'premium') return true;
    const user = await fetchUserInfo();
    return user && user.totalPoints >= 300;
}

// Course data structure
const courses = {
    'ai-mastery': {
        title: 'AI Tools Mastery',
        description: 'Complete guide to AI productivity tools, ChatGPT, Midjourney, and workflow automation.',
        category: 'AI & Automation',
        assetFolder: 'Ai tools mastery',
        totalLessons: 25,
        totalDuration: '8 hours',
        rating: '4.8',
        reviews: '2.1k',
        students: '15,000+',
        lessons: [
            {
                id: 1,
                title: 'Write a Contract for Business',
                duration: '8 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: '008 Write a Contract for Business.mp4',
                description: 'Learn how to draft a business contract clearly and confidently for your AI services and products.',
                resources: [
                    { type: 'pdf', name: 'Course Syllabus', url: 'course-syllabus.html' },
                    { type: 'pdf', name: 'AI Tools Checklist', url: 'ai-tools-checklist.html' },
                    { type: 'link', name: 'Recommended AI Tools', url: 'https://tools.example.com' }
                ]
            },
            {
                id: 2,
                title: 'Bulk Marketing Emails',
                duration: '12 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779190577/009_Bulk_Marketing_Emails_vthiv5.mp4',
                description: 'Learn how to build high-converting bulk email campaigns using AI-powered copy, segmentation, and automation.',
                resources: [
                    { type: 'pdf', name: 'AI Fundamentals Guide', url: 'ai-fundamentals-guide.html' },
                    { type: 'pdf', name: 'AI Fundamentals Cheat Sheet', url: 'ai-fundamentals-cheatsheet.html' }
                ]
            },
            {
                id: 3,
                title: 'Getting Started with ChatGPT',
                duration: '15 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'lesson-3.mp4',
                description: 'Master the art of prompt engineering and learn how to get the best results from ChatGPT.',
                resources: [
                    { type: 'pdf', name: 'Prompt Engineering Guide', url: 'prompt-engineering-guide.html' },
                    { type: 'pdf', name: 'ChatGPT Templates', url: 'chatgpt-templates.html' }
                ]
            },
            {
                id: 4,
                title: 'Creating Content with AI',
                duration: '18 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'lesson-4.mp4',
                description: 'Use AI to generate blog posts, social media content, marketing copy, and more.',
                resources: [
                    { type: 'pdf', name: 'Content Creation Templates', url: 'content-creation-templates.html' },
                    { type: 'pdf', name: 'AI Copywriting Checklist', url: 'ai-copywriting-checklist.html' }
                ]
            },
            {
                id: 5,
                title: 'AI Image Generation with Midjourney',
                duration: '20 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'lesson-5.mp4',
                description: 'Create stunning visuals and artwork using AI-powered image generation tools.',
                resources: [
                    { type: 'pdf', name: 'Midjourney Prompt Guide', url: 'midjourney-prompt-guide.html' },
                    { type: 'pdf', name: 'AI Image Generation Tips', url: 'ai-image-generation-tips.html' }
                ]
            }
        ]
    },
    'web-dev': {
        title: 'Modern Web Development',
        description: 'Build responsive websites with HTML, CSS, JavaScript, and modern frameworks.',
        category: 'Programming & Development',
        assetFolder: 'Modern web development',
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
                videoUrl: 'lesson-1.mp4',
                description: 'Learn what web development is and why it\'s an essential skill in today\'s digital world.',
                resources: [
                    { type: 'pdf', name: 'Web Dev Roadmap', url: 'web-dev-roadmap.pdf' }
                ]
            }
        ]
    },
    'freelance': {
        title: 'Freelancing Mastery',
        description: 'Launch your freelance career with client acquisition, pricing, and project management.',
        category: 'Business & Freelancing',
        assetFolder: 'Freelancing mastery',
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
                videoUrl: 'lesson-1.mp4',
                description: 'Develop the right mindset for freelancing success and learn what it takes to be a successful freelancer.',
                resources: [
                    { type: 'pdf', name: 'Freelancer Mindset Guide', url: 'freelancer-mindset-guide.pdf' }
                ]
            }
        ]
    },
    'premium': {
        title: 'Premium Growth Pass',
        description: 'Unlock premium mastery modules with advanced projects, exclusive resources, and career acceleration tools.',
        category: 'Premium & Career Growth',
        assetFolder: 'Premium course',
        totalLessons: 12,
        totalDuration: '20 hours',
        rating: '5.0',
        reviews: '1.2k',
        students: '3,500+',
        lessons: [
            {
                id: 1,
                title: 'Premium Launch Strategy',
                duration: '15 min',
                type: 'video',
                completed: false,
                videoUrl: '',
                description: 'Learn how to package your skills, define premium offers, and set up a strong growth path.',
                resources: [
                    { type: 'pdf', name: 'Premium Launch Checklist', url: '#' }
                ]
            },
            {
                id: 2,
                title: 'Premium Project Roadmap',
                duration: '18 min',
                type: 'video',
                completed: false,
                videoUrl: '',
                description: 'Build your own high-value project roadmap that attracts real clients and remote income.',
                resources: [
                    { type: 'pdf', name: 'Premium Project Planner', url: '#' }
                ]
            }
        ]
    }
};

let currentLessonIndex = 0;
let courseProgress = JSON.parse(localStorage.getItem(`courseProgress_${courseId}`)) || {};

function getAssetUrl(course, fileName, subfolder) {
    if (!fileName) return '';
    if (/^(https?:)?\/\//.test(fileName) || fileName.startsWith('/')) {
        return fileName;
    }

    let folderPath = `assets/${course.assetFolder}`;
    if (subfolder) {
        folderPath += `/${subfolder}`;
    }

    return encodeURI(`${folderPath}/${fileName}`);
}

function getResourceUrl(course, resource, lesson) {
    if (!resource || !resource.url) return '#';
    if (resource.type === 'link' || /^(https?:)?\/\//.test(resource.url) || resource.url.startsWith('/')) {
        return resource.url;
    }
    return getAssetUrl(course, resource.url, lesson?.topicFolder);
}

function getVideoSourceType(url) {
    if (!url) return 'video/mp4';
    const lowered = url.split('?')[0].toLowerCase();
    if (lowered.endsWith('.m3u8')) return 'application/x-mpegURL';
    if (lowered.endsWith('.mpd')) return 'application/dash+xml';
    return 'video/mp4';
}

function formatTopicName(topicFolder) {
    if (!topicFolder) return '';
    return topicFolder
        .replace(/_/g, ' ')
        .replace(/\s+,\s+/g, ', ')
        .trim();
}

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

    const courseTopicEl = document.getElementById('courseTopic');
    if (courseTopicEl) {
        const topicName = formatTopicName(lesson.topicFolder || course.topicFolder);
        courseTopicEl.textContent = topicName ? `Topic: ${topicName}` : '';
    }

    // Update video container
    const videoUrl = lesson.videoUrl ? getAssetUrl(course, lesson.videoUrl, lesson.topicFolder) : '';
    const videoContainer = document.getElementById('videoContainer');

    if (videoUrl) {
        const sourceType = getVideoSourceType(videoUrl);
        videoContainer.innerHTML = `
            <div class="video-player">
                <video controls preload="metadata">
                    <source src="${videoUrl}" type="${sourceType}">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;

        const videoElement = videoContainer.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('ended', () => {
                markLessonCompleted(currentLessonIndex);
            });
            videoElement.play().catch(() => {
                // autoplay may require additional user interaction in some browsers
            });
        }
    } else {
        videoContainer.innerHTML = `
            <div class="video-player video-placeholder">
                <div class="placeholder-text">
                    <h3>Premium lesson content is coming soon.</h3>
                    <p>Check back for the full premium learning experience once you unlock access.</p>
                </div>
            </div>
        `;
    }

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
                        <a href="${getResourceUrl(course, resource, lesson)}" class="resource-link" ${resource.type === 'link' ? 'target="_blank"' : ''}>${resource.name}</a>
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
    const sourceType = getVideoSourceType(videoUrl);
    videoContainer.innerHTML = `
        <div class="video-player">
            <video controls autoplay style="width: 100%; max-height: 400px; background: #000;">
                <source src="${videoUrl}" type="${sourceType}">
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
window.addEventListener('DOMContentLoaded', async () => {
    const allowed = await ensurePremiumAccess();
    if (!allowed) {
        window.location.href = 'premium.html';
        return;
    }
    initializeCourse();
});
