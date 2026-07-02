const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
  createUser,
  getUserByEmail,
  getUserByEmailRaw,
  getUserById,
  updateUserProfile,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getUserCourseProgress,
  updateCourseProgress,
  addUserPoints,
  getUserDashboardStats,
  setResetToken,
  updateUserPassword,
  applyDailyLoginReward,
} = require('./supabase-client');

const router = express.Router();

function createUserResponse(user) {
  return {
    id: user.id,
    fullName: user.fullName || '',
    email: user.email,
    expertise: user.expertise || 'Beginner',
    totalPoints: user.totalPoints || 0,
    lastLogin: user.lastLogin || null,
    createdAt: user.createdAt || null,
  };
}

function decodeAuthToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [id, email] = decoded.split(':');
    return { id, email };
  } catch {
    return null;
  }
}

function resolveAuth(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) return null;
  return decodeAuthToken(authHeader.slice(7).trim());
}

async function registerHandler(req, res) {
  try {
    const { fullName, email, password, expertise } = req.body;
    if (!fullName || !email || !password || !expertise) {
      return res.status(400).json({ message: 'Full name, email, password, and expertise are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(normalizedEmail, passwordHash, fullName, expertise, 10);
    await addUserPoints(user.id, 10, 'signup', null, 'Welcome bonus');

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');
    res.status(201).json({ message: 'Registration successful', token, user: createUserResponse(user) });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
}

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const rawUser = await getUserByEmailRaw(normalizedEmail);
    if (!rawUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, rawUser.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = await applyDailyLoginReward(rawUser.id);
    const token = Buffer.from(`${rawUser.id}:${rawUser.email}`).toString('base64');
    res.json({ message: 'Login successful', token, user: createUserResponse(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Login failed' });
  }
}

async function googleAuthHandler(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google authentication is not configured on the server.' });
    }

    const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    const googleResponse = await fetch(tokenInfoUrl);
    if (!googleResponse.ok) {
      return res.status(401).json({ message: 'Invalid Google ID token' });
    }

    const profile = await googleResponse.json();
    if (profile.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: 'Google client ID mismatch' });
    }

    if (profile.iss !== 'https://accounts.google.com' && profile.iss !== 'accounts.google.com') {
      return res.status(401).json({ message: 'Invalid Google token issuer' });
    }

    if (!profile.email_verified) {
      return res.status(401).json({ message: 'Google email address is not verified' });
    }

    const email = String(profile.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: 'Google profile did not return an email address' });
    }

    const fullName = profile.name || email.split('@')[0];
    const existingUserRaw = await getUserByEmailRaw(email);
    let user;

    if (existingUserRaw) {
      user = await applyDailyLoginReward(existingUserRaw.id);
    } else {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      user = await createUser(email, passwordHash, fullName, 'Beginner', 10);
    }

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');
    res.json({ message: 'Signed in with Google', token, user: createUserResponse(user) });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: error.message || 'Google sign-in failed' });
  }
}

async function userInfoHandler(req, res) {
  try {
    const auth = resolveAuth(req);
    if (!auth || !auth.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await getUserById(auth.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(createUserResponse(user));
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ message: error.message || 'Could not load user info' });
  }
}

router.post('/register', registerHandler);
router.post('/auth/register', registerHandler);
router.post('/login', loginHandler);
router.post('/auth/login', loginHandler);
router.post('/auth/google', googleAuthHandler);
router.get('/google-config', (req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID || null });
});
router.get('/user-info', userInfoHandler);
router.get('/user/profile', userInfoHandler);

router.post('/password-reset/request', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required to request a password reset.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await getUserByEmailRaw(normalizedEmail);
    if (!user) {
      return res.status(404).json({ message: 'No account found for that email address.' });
    }

    const resetToken = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString();
    await setResetToken(user.id, resetToken, expiresAt);

    res.json({ message: 'Reset code created successfully. Use it to confirm your password reset.', resetCode: resetToken });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Unable to create password reset request.' });
  }
});

router.post('/password-reset/confirm', async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ message: 'Email, reset code, and new password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await getUserByEmailRaw(normalizedEmail);
    if (!user || !user.reset_token || user.reset_token !== token) {
      return res.status(400).json({ message: 'Invalid reset code or email.' });
    }

    if (!user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ message: 'Reset code has expired. Request a new code.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await updateUserPassword(normalizedEmail, passwordHash);

    res.json({ message: 'Password updated successfully. You can now log in with your new password.' });
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    res.status(500).json({ message: 'Unable to reset your password right now.' });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const category = req.query.category;
    const courses = category ? await getCoursesByCategory(category) : await getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/courses/:courseId', async (req, res) => {
  try {
    const course = await getCourseById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/progress/:courseId', async (req, res) => {
  try {
    const auth = resolveAuth(req);
    if (!auth || !auth.id) return res.status(401).json({ message: 'Unauthorized' });

    const progress = await getUserCourseProgress(auth.id, req.params.courseId);
    res.json(progress || { user_id: auth.id, course_id: req.params.courseId, progress_percentage: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/progress/:courseId', async (req, res) => {
  try {
    const auth = resolveAuth(req);
    if (!auth || !auth.id) return res.status(401).json({ message: 'Unauthorized' });

    const progress = await updateCourseProgress(auth.id, req.params.courseId, req.body);
    res.json({ message: 'Progress updated', progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/dashboard', async (req, res) => {
  try {
    const auth = resolveAuth(req);
    if (!auth || !auth.id) return res.status(401).json({ message: 'Unauthorized' });

    const stats = await getUserDashboardStats(auth.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
