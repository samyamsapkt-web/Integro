# SIaaS Setup Guide

## Supabase

1. Create a Supabase project.
2. Open the SQL editor.
3. Run [schema.sql](C:\Users\samya\Downloads\SIaaS Software\supabase\schema.sql).

This creates `profiles`, `user_settings`, `workflows`, and `workflow_runs`, and turns on row-level security.

## Authentication

### Email/password

Email/password works once auth is enabled in Supabase.

### Google sign-in

1. Create an OAuth app in Google Cloud Console.
2. Add these callback URLs:
   - `http://localhost:5173/auth/callback`
   - `https://your-frontend-domain.onrender.com/auth/callback`
3. In Supabase, open `Authentication -> Providers -> Google`.
4. Enable Google and paste the client ID and secret.

### GitHub sign-in

1. Create a GitHub OAuth app.
2. Add the redirect URL Supabase gives you.
3. Enable GitHub in `Authentication -> Providers -> GitHub`.

## Environment

Copy [frontend/.env.example](C:\Users\samya\Downloads\SIaaS Software\frontend\.env.example) to `frontend/.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:4000
```

Copy [backend/.env.example](C:\Users\samya\Downloads\SIaaS Software\backend\.env.example) to `backend/.env`:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AI_PROVIDER_MODE=groq
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
```

## Sign-in / sign-up integration

Frontend auth files:

- [supabase.js](C:\Users\samya\Downloads\SIaaS Software\frontend\src\lib\supabase.js)
- [AuthContext.jsx](C:\Users\samya\Downloads\SIaaS Software\frontend\src\context\AuthContext.jsx)
- [AuthPage.jsx](C:\Users\samya\Downloads\SIaaS Software\frontend\src\pages\AuthPage.jsx)
- [AuthCallbackPage.jsx](C:\Users\samya\Downloads\SIaaS Software\frontend\src\pages\AuthCallbackPage.jsx)

Backend auth file:

- [requireAuth.js](C:\Users\samya\Downloads\SIaaS Software\backend\src\middleware\requireAuth.js)

Flow:

1. User signs in with email or OAuth from the frontend.
2. Supabase returns a session.
3. Protected frontend routes check that session.
4. Frontend sends the access token to the backend in the `Authorization` header.
5. Backend validates the token with Supabase and attaches the user to `req.user`.

## Groq AI integration

The live AI provider in this version is Groq using `llama-3.3-70b-versatile`.

Files involved:

- [aiRouter.js](C:\Users\samya\Downloads\SIaaS Software\backend\src\services\aiRouter.js)
- [config.js](C:\Users\samya\Downloads\SIaaS Software\backend\src\config.js)
- [WorkflowBuilderPage.jsx](C:\Users\samya\Downloads\SIaaS Software\frontend\src\pages\WorkflowBuilderPage.jsx)
- [SettingsPage.jsx](C:\Users\samya\Downloads\SIaaS Software\frontend\src\pages\SettingsPage.jsx)

How it works:

1. A user creates or runs a workflow.
2. The backend loads the saved workflow prompt.
3. `aiRouter.js` sends that workflow to Groq's OpenAI-compatible chat completions endpoint.
4. Groq returns structured JSON.
5. SIaaS stores the summary and output in `workflow_runs`.

If `GROQ_API_KEY` is missing, the app safely falls back to demo mode so the product remains usable during setup.

## Run locally

```bash
npm run install:backend
npm run install:frontend
npm run dev:backend
npm run dev:frontend
```

## Deploy on Render

This app is already structured for Render with [render.yaml](C:\Users\samya\Downloads\SIaaS Software\render.yaml). The backend uses `process.env.PORT`, which is what Render expects for web services. The frontend is a static Vite build and uses a rewrite rule so React Router works on refresh.

Important: this is a Node/Express stack, not a Flask stack. If you deploy this as-is, choose Node services in Render, not Python.

Frontend:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

Backend:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

If you use the Render Blueprint flow, these values are already described in `render.yaml`. You only need to replace the placeholder frontend and backend URLs with your actual Render service names.

Backend env vars you will need in Render:

- `FRONTEND_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_PROVIDER_MODE=groq`
- `GROQ_API_KEY`
- `GROQ_MODEL=llama-3.3-70b-versatile`
