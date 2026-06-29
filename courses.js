import { requireAuth } from './auth-client.js';

requireAuth();

const container = document.getElementById('coursesList');
if (!container) throw new Error('Courses list not found');

const courses = [
  { title: 'Modern Web Development', description: 'Learn HTML, CSS, and JavaScript.' },
  { title: 'AI Tools Mastery', description: 'Use AI to improve writing and productivity.' },
  { title: 'Cybersecurity Essentials', description: 'Protect systems and data securely.' },
];

container.innerHTML = courses.map(course => `
  <section class="course-card card">
    <h3>${course.title}</h3>
    <p>${course.description}</p>
  </section>
`).join('');
