require('dotenv').config();

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  initializeDb,
  loadUsers,
  findUserByEmail,
  findUserByResetToken,
  createUser,
  updateUser,
  dbPath,
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;
const publicPath = path.join(__dirname, '..');

app.use(compression());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

const topbarTemplate = fs.readFileSync(path.join(publicPath, 'components', 'topbar', 'topbar.html'), 'utf8');
const topbarHeadMarkup = '<link rel="stylesheet" href="/components/topbar/topbar.css">\n<script src="/topbar-config.js"></script>';
const topbarBodyMarkup = topbarTemplate
  .replace(/<link[^>]+>\s*/i, '')
  .replace(/<script[^>]+src="\/topbar-config\.js"[^>]*><\/script>\s*/i, '')
  .trim();

app.use(async (req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path === '/topbar-config.js') return next();
  const isHtml = req.path === '/' || req.path.endsWith('.html');
  if (!isHtml) return next();

  const targetPath = req.path === '/'
    ? path.join(publicPath, 'index.html')
    : path.join(publicPath, decodeURIComponent(req.path));

  if (!targetPath.startsWith(publicPath)) return next();
  if (!fs.existsSync(targetPath)) return next();

  console.log(`[topbar] injecting into ${req.path} -> ${targetPath}`);
  let html = fs.readFileSync(targetPath, 'utf8');
  if (html.includes('id="top-info-bar"') || html.includes('/components/topbar/topbar.css')) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }

  if (topbarHeadMarkup && /<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${topbarHeadMarkup}\n</head>`);
  }
  if (/<body[^>]*>/i.test(html)) {
    html = html.replace(/<body([^>]*)>/i, `<body$1>\n${topbarBodyMarkup}`);
  }

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.use(express.static(publicPath));

// Serve topbar config from environment as a small JS payload.
// This allows keeping API keys out of static HTML and injecting them at runtime from the server.
app.get('/topbar-config.js', (req, res) => {
  const newsdataApiKey = process.env.NEWDATA_API_KEY || '';
  const mediastackApiKey = process.env.MEDIASTACK_API_KEY || '';
  const defaultCityName = process.env.TOPBAR_DEFAULT_CITY_NAME || 'Nairobi';
  const defaultLat = parseFloat(process.env.TOPBAR_DEFAULT_LAT) || -1.286389;
  const defaultLon = parseFloat(process.env.TOPBAR_DEFAULT_LON) || 36.817223;

  const payload = `window.TOPBAR_CONFIG = window.TOPBAR_CONFIG || {` +
    `newsdataApiKey: ${JSON.stringify(newsdataApiKey)},` +
    `mediastackApiKey: ${JSON.stringify(mediastackApiKey)},` +
    `defaultCity: ${JSON.stringify({ name: defaultCityName, lat: defaultLat, lon: defaultLon })}` +
  `};`;

  res.set('Content-Type', 'application/javascript; charset=utf-8');
  // Avoid aggressive caching so changes to .env are reflected on reload during development
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(payload);
});

function initializeStorage() {
  initializeDb();
  console.log(`✅ Using SQLite storage at backend/${path.basename(dbPath)}`);
  console.log('📝 User registrations will be saved to SQLite database.');
}

function createToken(user) {
  return Buffer.from(`${user.id}:${user.email}`).toString('base64');
}

function decodeToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [id, email] = decoded.split(':');
    if (!id || !email) return null;
    return { id, email };
  } catch {
    return null;
  }
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.body.authToken || req.query.authToken || req.headers['x-auth-token'];
}

function getUserFromRequest(req) {
  const token = getAuthToken(req);
  if (!token) return null;
  return decodeToken(token);
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function getClientDate(clientDate) {
  if (!clientDate) {
    return getCurrentDate();
  }

  const normalizedDate = String(clientDate).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    return normalizedDate;
  }

  const parsed = new Date(normalizedDate);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  console.warn(`⚠️ Invalid localDate received from client: ${JSON.stringify(clientDate)}. Using server date fallback.`);

  return getCurrentDate();
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { fullName, email, password, expertise, localDate } = req.body;

  if (!fullName || !email || !password || !expertise) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'Looks like this email is already registered. Try signing in or resetting your password.' });
    }

    const today = getClientDate(localDate);
    let user;
    try {
      user = await createUser({
        fullName,
        email: normalizedEmail,
        password,
        expertise,
        lastLogin: new Date().toISOString(),
        totalPoints: 10,
        lastRewardDate: today,
      });
    } catch (err) {
      if (err && err.message && err.message.includes('Email already registered')) {
        return res.status(400).json({ message: 'Looks like this email is already registered. Try signing in or resetting your password.' });
      }
      throw err;
    }

    console.log(`✅ User registered: ${email}`);

    const token = createToken({ id: user.id, email: user.email });

    res.status(201).json({
      message: 'Welcome to COUSERIASEMOR! Your new account is ready and you earned 10 welcome points. Your points are stored safely and keep growing with daily logins.',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        expertise: user.expertise,
        totalPoints: user.totalPoints,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again in a moment.' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password. Forgot your password? Reset it now.' });
    }

    const today = getClientDate(req.body.localDate);
    let pointsEarned = 0;
    let updatedUser = user;

    if (user.lastRewardDate !== today) {
      const newTotal = (user.totalPoints || 0) + 10;
      updatedUser = await updateUser(normalizedEmail, {
        lastLogin: new Date().toISOString(),
        totalPoints: newTotal,
        lastRewardDate: today,
      });
      pointsEarned = 10;
    } else {
      updatedUser = await updateUser(normalizedEmail, {
        lastLogin: new Date().toISOString(),
      });
    }

    const rewardMessage = pointsEarned > 0
      ? `You earned +10 points for today's login!`
      : `Your point total is safe and remains unchanged for today.`;

    const token = createToken({ id: updatedUser.id, email: updatedUser.email });
    console.log(`✅ User logged in: ${email}`);

    res.json({
      message: `Login successful. ${rewardMessage} Total points: ${updatedUser.totalPoints}. Keep logging in daily to unlock premium.`,
      token,
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        expertise: updatedUser.expertise,
        totalPoints: updatedUser.totalPoints,
        lastLogin: updatedUser.lastLogin,
        lastRewardDate: updatedUser.lastRewardDate,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again later.' });
  }
});

// Password reset request
app.post('/api/password-reset/request', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide your registered email address.' });
  }

  try {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({ message: 'We could not find an account with that email.' });
    }

    const resetToken = crypto.randomBytes(18).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    await updateUser(normalizedEmail, {
      resetToken,
      resetTokenExpires,
    });

    res.json({
      message: 'Your password reset code is generated here on the page. Copy it now and paste it on the reset page.',
      resetCode: resetToken,
      expires: resetTokenExpires,
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Unable to generate a password reset code right now. Please try again later.' });
  }
});

// Password reset confirmation
app.post('/api/password-reset/confirm', async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    return res.status(400).json({ message: 'Email, reset code, and new password are all required.' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || user.resetToken !== token) {
      return res.status(400).json({ message: 'The reset code is invalid or does not match this email.' });
    }

    if (!user.resetTokenExpires || new Date() > new Date(user.resetTokenExpires)) {
      return res.status(400).json({ message: 'The reset code has expired. Request a new one and try again.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Your password must be at least 6 characters long.' });
    }

    await updateUser(email, {
      password,
      resetToken: null,
      resetTokenExpires: null,
    });

    res.json({ message: 'Your password has been updated successfully. You can now sign in with your new password.' });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    res.status(500).json({ message: 'Unable to reset your password right now. Please try again later.' });
  }
});

app.get('/api/user-info', async (req, res) => {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return res.status(401).json({ message: 'Authentication is required.' });
  }

  try {
    const user = await findUserByEmail(auth.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      expertise: user.expertise,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
      totalPoints: user.totalPoints || 0,
      lastRewardDate: user.lastRewardDate,
    });
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ message: 'Unable to load profile data.' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await loadUsers();
    const safeUsers = allUsers.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      expertise: u.expertise,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
      totalPoints: u.totalPoints,
      lastRewardDate: u.lastRewardDate,
    }));
    res.json({ users: safeUsers, total: allUsers.length });
  } catch (error) {
    console.error('Users listing error:', error);
    res.status(500).json({ message: 'Unable to load users' });
  }
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
