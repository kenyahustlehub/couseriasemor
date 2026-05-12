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
http://localhost:3000
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
- 💾 In-memory database (ready for real DB)
- 📱 Smooth animations and transitions

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

## 💡 Next Steps

1. Replace in-memory database with real database (MongoDB, PostgreSQL)
2. Add password hashing (bcrypt)
3. Implement JWT authentication
4. Add email verification
5. Create learning dashboard
6. Build course content pages

---

**Made with ❤️ by COUSERIASEMOR Team**
