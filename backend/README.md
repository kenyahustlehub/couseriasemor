# COUSERIASEMOR Backend

This folder contains the backend server and user storage for COUSERIASEMOR.

## Files

- `server.js` - Express server and API endpoints.
- `storage.js` - Local JSON-based user storage helper.
- `users.json` - User database stored in JSON format.

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Open in browser:
   ```
   http://localhost:3000
   ```

## API Endpoints

- `POST /api/register` - register a new user
- `POST /api/login` - login with email and password
- `GET /api/users` - list registered users (for development)

## Important note about persistence

This app now uses SQLite local database storage at `backend/database.sqlite`.

- It works for local development and keeps user records in a single file.
- It is more reliable than JSON file storage, but may still be lost on some ephemeral deployment environments.

If users keep disappearing after deployment, the host may be resetting the filesystem. For production-grade persistence, use a managed database service such as PostgreSQL, MongoDB, or Supabase.
