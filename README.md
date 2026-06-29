# COUSERIASEMOR

COUSERIASEMOR is a learning platform rebuilt to use Supabase for authentication, course progress, points, certificates, and achievements.

## Run locally

1. Install dependencies:
```bash
npm install
```
2. Create a `.env` file in the project root with:
```env
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
3. Start the backend:
```bash
npm start
```
4. Open the app in a browser:
```bash
http://localhost:3005
```

## What is included

- Supabase-backed API routes in `backend/supabase-routes.js`
- Supabase client helpers in `backend/supabase-client.js`
- Auth pages: login, register, profile, dashboard, courses, premium
- Shared auth helper in `auth-client.js`
- Minimal CSS and JavaScript for frontend navigation

## Notes

This rebuild is Supabase-only and does not use local SQLite or JSON storage.
