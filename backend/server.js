require('dotenv').config();

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const { connectToDatabase } = require('./db');
const {
  generateVerificationCode,
  sendVerificationEmail,
  sendWelcomeEmail,
  emailAvailable,
} = require('./mail');

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
    const message = '❌ MONGODB_URI is not set.';
    console.warn(message + ' Running in fallback in-memory mode.');
    return;
  }

  try {
    usersCollection = await connectToDatabase();
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.warn('⚠️  Falling back to in-memory user storage.');
    usersCollection = null;
  }
}

function createToken(user) {
  return Buffer.from(`${user.id}:${user.email}`).toString('base64');
}

// Register endpoint - creates user and auto-logs them in (skip verification for now)
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

    // Create user (skip verification for now)
    const user = {
      fullName,
      email,
      password,
      expertise,
      isVerified: true, // Skip verification
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

    // Create token for auto-login
    const token = createToken({ id: user.id, email: user.email });

    res.status(201).json({
      message: 'Account created successfully! Welcome to COUSERIASEMOR!',
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

// Resend verification code endpoint for unverified users
app.post('/api/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required to resend verification code' });
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
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const verificationCode = generateVerificationCode();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    if (usersCollection) {
      await usersCollection.updateOne(
        { email },
        {
          $set: {
            verificationCode,
            codeExpiresAt,
            updatedAt: new Date().toISOString(),
          },
        }
      );
    } else {
      user.verificationCode = verificationCode;
      user.codeExpiresAt = codeExpiresAt;
      user.updatedAt = new Date().toISOString();
    }

    const emailSent = await sendVerificationEmail(email, verificationCode, user.fullName);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to resend verification email. Please try again later.' });
    }

    res.json({
      message: 'Verification code resent! Check your inbox and spam folder.',
      requiresVerification: true,
      email,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Resend failed. Please try again.' });
  }
});

// Login endpoint - checks if email is verified (skip for now)
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

    // Skip verification check for now
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

// Debug endpoint to test email configuration
app.get('/api/debug/test-email', async (req, res) => {
  const testEmail = req.query.email || 'test@example.com';

  console.log(`\n📧 Testing email configuration...`);
  console.log(`Gmail User: ${process.env.GMAIL_USER}`);
  console.log(`Gmail App Password: ${process.env.GMAIL_APP_PASSWORD ? '✓ Set' : '✗ Not set'}`);
  console.log(`Test Email To: ${testEmail}`);

  try {
    const { sendVerificationEmail } = require('./mail');
    const testCode = '123456';
    const emailSent = await sendVerificationEmail(testEmail, testCode, 'Test User');

    if (emailSent) {
      res.json({
        status: 'success',
        message: '✅ Test email sent successfully!',
        details: {
          to: testEmail,
          from: process.env.GMAIL_USER,
          subject: '🎓 Verify Your COUSERIASEMOR Account (TEST)',
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      res.status(500).json({
        status: 'failed',
        message: '❌ Failed to send test email. Check server logs for details.',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '❌ Email configuration error',
      error: error.message,
      details: {
        gmailUser: process.env.GMAIL_USER || 'NOT SET',
        hasPassword: !!process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  await initializeDatabase();
  console.log(`\n✨ COUSERIASEMOR server is running at http://0.0.0.0:${PORT}`);
  console.log(`🌐 Network access: http://YOUR_IP_ADDRESS:${PORT}`);
  console.log('📁 Backend logic is now isolated in /backend');
  console.log('⚡ Static files are served with compression and cache headers.');
  console.log(`📧 Email verification ${emailAvailable ? 'enabled' : 'disabled'}${emailAvailable ? '' : ' (will skip email sending until configured)'}`);
});
