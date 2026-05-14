const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(__dirname));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/course.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'course.html'));
});

app.get('/courses.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'courses.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Mock API endpoints for testing
app.post('/api/register', express.json(), (req, res) => {
    const { name, email, password } = req.body;
    const token = 'test-token-' + Date.now();
    res.json({
        success: true,
        token,
        user: { name, email }
    });
});

app.post('/api/login', express.json(), (req, res) => {
    const { email, password } = req.body;
    const token = 'test-token-' + Date.now();
    res.json({
        success: true,
        token,
        user: { email }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Dev server running at http://localhost:${PORT}`);
    console.log(`📱 Dashboard: http://localhost:${PORT}/dashboard.html`);
    console.log(`📚 Courses: http://localhost:${PORT}/courses.html`);
});
