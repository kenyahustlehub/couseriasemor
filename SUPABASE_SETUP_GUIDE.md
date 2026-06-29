# Supabase Setup Guide

This project uses Supabase for authentication and course data storage.

## Required tables

Create the following tables in your Supabase project:

- `users`
- `courses`
- `course_progress`
- `points`

## Environment

Add a `.env` file in the project root:

```
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Start the app

```bash
npm install
npm start
```

Then open `http://localhost:3005`.
