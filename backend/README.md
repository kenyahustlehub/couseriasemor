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
2. Create `.env` in the backend directory with Supabase keys and Google configuration:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   VITE_SUPABASE_ANON_KEY=your-anon-key
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   NEWDATA_API_KEY=your-newsdata-key
   MEDIASTACK_API_KEY=your-mediastack-key
   TOPBAR_DEFAULT_CITY_NAME=Nairobi
   TOPBAR_DEFAULT_LAT=-1.286389
   TOPBAR_DEFAULT_LON=36.817223
   ```
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
