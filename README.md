# COUSERIASEMOR - Coding & Programming Learning Platform

Simple learning portal with registration and login backed by JSON file storage.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```
2. Start the app:
```bash
npm start
```
3. Open in browser:
```bash
http://localhost:3000
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page |
| `register.html` | Registration page |
| `login.html` | Login page |
| `dashboard.html` | User dashboard |
| `script.js` | Registration form logic |
| `login-script.js` | Login form logic |
| `style.css` | App styling |
| `server.js` | App entrypoint |
| `backend/server.js` | Express API and static file hosting |
| `backend/storage.js` | JSON-based user storage |
| `backend/users.json` | Persisted user data |

## 🎯 Features

- User registration without email verification
- Login with email and password
- Redirects to `dashboard.html` after login
- Persistent user storage in `backend/users.json`
- Responsive design for desktop and mobile
- Clean, minimal backend with Express

## 🔌 API Endpoints

```
POST /api/register - Register a new user
POST /api/login    - Login an existing user
GET /api/users     - List users (demo only)
```

## 🗄️ Storage

Users are stored locally in `backend/users.json`. No external database is required.

## 🛠️ Notes

- The app uses `dotenv` for optional environment variables.
- No email verification is used.
- No MongoDB or email provider dependencies are required.

## 💡 Next Improvements

1. Add password hashing
2. Add a proper session or JWT token flow
3. Expand dashboard course content
4. Add account recovery and profile management

---

**COUSERIASEMOR**
