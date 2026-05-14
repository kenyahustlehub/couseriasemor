require('dotenv').config();

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const {
  loadUsers,
  findUserByEmail,
  createUser,
} = require('./storage');

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..');

app.use(compression());
app.use(bodyParser.json());
app.use(express.static(publicPath, { maxAge: '30d' }));

function initializeStorage() {
  console.log('✅ Using JSON file storage at backend/users.json');
  console.log('📝 User registrations will be saved to JSON file.');
}

function createToken(user) {
  return Buffer.from(`${user.id}:${user.email}`).toString('base64');
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { fullName, email, password, expertise } = req.body;

  if (!fullName || !email || !password || !expertise) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = createUser({
      fullName,
      email,
      password,
      expertise,
    });

    console.log(`✅ User registered: ${email}`);

    const token = createToken({ id: user.id, email: user.email });

    res.status(201).json({
      message: 'Account created successfully! Redirecting to your dashboard.',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        expertise: user.expertise,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});



// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

app.get('/api/users', (req, res) => {
  const allUsers = loadUsers();
  // Don't send passwords or sensitive data
  const safeUsers = allUsers.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    expertise: u.expertise,
    isVerified: u.isVerified,
    createdAt: u.createdAt,
  }));
  res.json({ users: safeUsers, total: allUsers.length });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  initializeStorage();
  console.log(`\n✨ COUSERIASEMOR server is running at http://0.0.0.0:${PORT}`);
  console.log(`🌐 Network access: http://YOUR_IP_ADDRESS:${PORT}`);
  console.log('📁 Backend logic is now isolated in /backend');
  console.log('⚡ Static files are served with compression and cache headers.');
});
