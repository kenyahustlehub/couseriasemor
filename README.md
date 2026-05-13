# COUSERIASEMOR - Coding & Programming Learning Platform

Modern registration website for programming courses.

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Start server:**
```bash
npm start
```

3. **Open in browser:**
```
Live: https://couseriasemor.onrender.com
Local: http://localhost:3000
Network: http://YOUR_IP_ADDRESS:3000
```

## 📁 Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page with courses & features |
| `register.html` | User registration page |
| `login.html` | User login page |
| `style.css` | All styling (single file) |
| `script.js` | Registration form logic |
| `login-script.js` | Login form logic |
| `server.js` | Startup loader for backend logic |
| `backend/server.js` | Express API and static delivery |
| `backend/db.js` | MongoDB connection helper |
| `package.json` | Dependencies |

## 🎯 Features

- ✨ Modern landing page with course templates
- 📝 User registration with validation
- 🔑 Secure login system
- 🎨 Responsive design (mobile, tablet, desktop)
- 💾 MongoDB database (with in-memory fallback for local dev)
- 📱 Smooth animations and transitions
- ⚡ Gzip compression & cache optimization for fast loading

## 🔌 API Endpoints

```
POST /api/register - Register new user
POST /api/login    - Login user
GET /api/users     - Get all users (demo)
```

## 🗄️ Database Support

- The app now supports MongoDB via `MONGODB_URI`
- If no MongoDB link is provided, it falls back to in-memory storage for demo mode
- To use MongoDB, set your connection string before starting the server:

```bash
export MONGODB_URI="your-mongodb-connection-string"
npm start
```

## 📚 Course Templates

1. **Web Development** - HTML, CSS, JavaScript, React
2. **Python Programming** - Basics to Data Science
3. **Mobile Development** - React Native & Flutter
4. **Backend Development** - Node.js, Express, Databases
5. **Cloud & DevOps** - AWS, Docker, Kubernetes
6. **Data Science & AI** - ML, TensorFlow, Deep Learning

## � Deploy to Render

### Step 1: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)

### Step 2: Prepare for Deployment
1. Push your code to GitHub
2. Create a `.env` file locally with your MongoDB URI (see `.env.example`)
3. Make sure `.env` is in `.gitignore` (it already is)

### Step 3: Deploy on Render
1. Go to [Render.com](https://render.com)
2. Sign up and connect your GitHub account
3. Click **New** → **Web Service**
4. Select your COUSERIASEMOR repository
5. Set these values:
   - **Name:** couseriasemor
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
6. Add environment variables:
   - **Key:** `MONGODB_URI`
   - **Value:** Your MongoDB Atlas connection string
7. Click **Deploy**

Your site will be live at: `https://couseriasemor.onrender.com`

## � Email Verification Setup (NEW!)

### Local Development

1. **Enable 2-Factor Authentication on Gmail:**
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Click **Security** → **2-Step Verification**
   - Complete the setup

2. **Create an App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select **Mail** and **Windows Computer**
   - Gmail will show a 16-character password (copy it!)

3. **Update `.env` file:**
```
MONGODB_URI=your-mongodb-uri-here
PORT=3000
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

4. **Test Registration:**
   - User registers with email
   - Receives verification code email
   - Enters code to verify email
   - Auto-login after verification ✅
   - Receives welcome email 🎉

### Deployment on Render

Add these environment variables in Render dashboard:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `GMAIL_USER` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Your 16-character app password

**Features:**
✅ Registration with email verification
✅ Auto-send 6-digit code to email
✅ 15-minute code expiration
✅ Auto-login after verification
✅ Welcome email on successful verification
✅ Resend code functionality
✅ No third-party email service needed (free!)
✅ Works on Render (no blocking)

## 🔌 API Endpoints

```
POST /api/register        - Register new user (sends verification email)
POST /api/verify-email    - Verify email with code
POST /api/login           - Login user (requires verified email)
GET /api/users            - Get all users (demo)
```

## 💡 Next Steps

1. Add password hashing (bcrypt)
2. Implement JWT authentication properly
3. Create learning dashboard
4. Build course content pages
5. Add forgot password functionality

---

**Made with ❤️ by COUSERIASEMOR Team**
