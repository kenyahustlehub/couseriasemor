require('dotenv').config();

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const { connectToDatabase } = require('./db');
const { generateVerificationCode, sendVerificationEmail, sendWelcomeEmail } = require('./mail');

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..');

let users = [];
let usersCollection = null;

app.use(compression());
app.use(bodyParser.json());
app.use(express.static(publicPath, { maxAge: '30d' }));

async function initializeDatabase() {
  if (!process.env.MONGODB_URI) {
    console.log('⚠️  No MongoDB URI found. Running in fallback in-memory mode.');
    return;
  }

  try {
    usersCollection = await connectToDatabase();
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.log('⚠️  Falling back to in-memory user storage.');
  }
}

function createToken(user) {
  return Buffer.from(`${user.id}:${user.email}`).toString('base64');
}

// Register endpoint - creates unverified user and sends verification email
app.post('/api/register', async (req, res) => {
  const { fullName, email, password, expertise } = req.body;

  if (!fullName || !email || !password || !expertise) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email already exists
    if (usersCollection) {
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    } else {
      if (users.find((u) => u.email === email)) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user with unverified status
    const user = {
      fullName,
      email,
      password,
      expertise,
      isVerified: false,
      verificationCode,
      codeExpiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (usersCollection) {
      const result = await usersCollection.insertOne(user);
      user.id = result.insertedId.toString();
    } else {
      user.id = Date.now().toString();
      users.push(user);
    }

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode, fullName);

    if (!emailSent) {
      return res.status(500).json({ 
        message: 'Registration failed: Could not send verification email. Please check your email configuration.' 
      });
    }

    res.status(201).json({
      message: 'Registration successful! Check your email for the verification code.',
      email,
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Verify email endpoint - checks verification code
app.post('/api/verify-email', async (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  try {
    let user;

    if (usersCollection) {
      user = await usersCollection.findOne({ email });
    } else {
      user = users.find((u) => u.email === email);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if code matches
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code expired
    if (new Date() > new Date(user.codeExpiresAt)) {
      return res.status(400).json({ message: 'Verification code expired. Please register again.' });
    }

    // Mark user as verified
    if (usersCollection) {
      await usersCollection.updateOne(
        { email },
        {
          $set: {
            isVerified: true,
            verificationCode: null,
            codeExpiresAt: null,
            verifiedAt: new Date().toISOString(),
          },
        }
      );
    } else {
      user.isVerified = true;
      user.verificationCode = null;
      user.codeExpiresAt = null;
      user.verifiedAt = new Date().toISOString();
    }

    // Send welcome email
    await sendWelcomeEmail(email, user.fullName);

    // Create token for auto-login
    const userId = user.id || (user._id ? user._id.toString() : null);
    const token = createToken({ id: userId, email: user.email });

    res.json({
      message: 'Email verified successfully! Welcome to COUSERIASEMOR! 🎉',
      token,
      user: {
        id: userId,
        fullName: user.fullName,
        email: user.email,
        expertise: user.expertise,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
});

// Login endpoint - checks if email is verified
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    let user;

    if (usersCollection) {
      user = await usersCollection.findOne({ email, password });
    } else {
      user = users.find((u) => u.email === email && u.password === password);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email first. Check your inbox for the verification code.',
        email,
        requiresVerification: true
      });
    }

    const userId = user.id || (user._id ? user._id.toString() : null);
    const token = createToken({ id: userId, email: user.email });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
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

app.get('/api/users', async (req, res) => {
  if (usersCollection) {
    const allUsers = await usersCollection
      .find({}, { projection: { password: 0, verificationCode: 0 } })
      .toArray();
    return res.json({ users: allUsers });
  }

  res.json({ users });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`\n✨ COUSERIASEMOR server is running at http://localhost:${PORT}`);
  console.log('📁 Backend logic is now isolated in /backend');
  console.log('⚡ Static files are served with compression and cache headers.');
  console.log('📧 Email verification enabled!');
});
