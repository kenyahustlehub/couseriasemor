const express = require('express');
const bcrypt = require('bcryptjs');
const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getUserCourseProgress,
  updateCourseProgress,
  addUserPoints,
  getUserDashboardStats,
} = require('./supabase-client');

const router = express.Router();

router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(email, passwordHash, firstName || '', lastName || '');
    await addUserPoints(user.id, 10, 'signup', null, 'Welcome bonus');

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');
    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/profile', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const category = req.query.category;
    const courses = category ? await getCoursesByCategory(category) : await getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/courses/:courseId', async (req, res) => {
  try {
    const course = await getCourseById(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/progress/:courseId', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const progress = await getUserCourseProgress(userId, req.params.courseId);
    res.json(progress || { user_id: userId, course_id: req.params.courseId, progress_percentage: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/progress/:courseId', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const progress = await updateCourseProgress(userId, req.params.courseId, req.body);
    res.json({ message: 'Progress updated', progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/dashboard', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const stats = await getUserDashboardStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
