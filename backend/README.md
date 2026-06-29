# COUSERIASEMOR Backend

This backend serves the Supabase-backed API for COUSERIASEMOR.

## Files

- `server.js` - Express API and static file hosting
- `supabase-client.js` - Supabase query helpers
- `supabase-routes.js` - API routes for authentication, courses, and progress

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` in the root with Supabase keys.
3. Start the backend:
   ```bash
   npm start
   ```

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/profile`
- `GET /api/courses`
- `GET /api/progress/:courseId`
- `POST /api/progress/:courseId`
