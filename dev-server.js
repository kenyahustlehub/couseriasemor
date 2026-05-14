const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
  loadUsers,
  findUserByEmail,
  createUser,
} = require('./backend/storage');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

const VERIFICATION_CODE = '404315';

function createToken(user) {
  return Buffer.from(`${user.id}:${user.email}`).toString('base64');
}

// Register endpoint
app.post('/api/register', (req, res) => {
  const { fullName, email, password, expertise } = req.body;

  if (!fullName || !email || !password || !expertise) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = createUser({
    fullName,
    email,
    password,
    expertise,
    isVerified: true,
    verificationCode: VERIFICATION_CODE,
    verifiedAt: new Date().toISOString(),
  });

  console.log(`✅ User registered: ${email}`);
  
  const token = createToken({ id: user.id, email: user.email });
  res.status(201).json({
    message: `Account created! Verification code ${VERIFICATION_CODE} sent to ${email}. Welcome to COUSERIASEMOR!`,
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      expertise: user.expertise,
    },
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message: `Email not verified. Verification code ${VERIFICATION_CODE} has been sent to your email.`,
      requiresVerification: true,
      email,
    });
  }

  const token = createToken({ id: user.id, email: user.email });
  console.log(`✅ User logged in: ${email}`);
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      expertise: user.expertise,
    },
  });
});

// Verify email endpoint
app.post('/api/verify-email', (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (verificationCode !== VERIFICATION_CODE) {
    return res.status(400).json({ message: `Invalid code. Use: ${VERIFICATION_CODE}` });
  }

  const token = createToken({ id: user.id, email: user.email });
  res.json({
    message: 'Email verified! Welcome to COUSERIASEMOR! 🎉',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      expertise: user.expertise,
    },
  });
});

// Get all users (for debugging)
app.get('/api/users', (req, res) => {
  const users = loadUsers();
  const safe = users.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    expertise: u.expertise,
    isVerified: u.isVerified,
  }));
  res.json({ users: safe, total: users.length });
});

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/course.html', (req, res) => res.sendFile(path.join(__dirname, 'course.html')));
app.get('/courses.html', (req, res) => res.sendFile(path.join(__dirname, 'courses.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
✨ COUSERIASEMOR dev server running at http://localhost:${PORT}`);
  console.log('📝 Users stored in: backend/users.json');
  console.log(`🔐 Verification code: ${VERIFICATION_CODE}`);
  console.log('📊 API: POST /api/register, POST /api/login, GET /api/users');
});
