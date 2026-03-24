# INNOVISR SIaaS

SIaaS stands for Smart Integration as a Service. This starter stack gives you a full trial-ready product scaffold for a landing page, pricing page, Supabase auth, onboarding, personalized dashboard, workflow builder, settings, and an Express backend.

This repository is built with a React frontend and a Node/Express backend. It is not a Flask app right now, so you do not need Flask ports or Python deployment config unless you decide to rewrite the backend later.

## Stack

- Frontend: React, Vite, React Router, Supabase JS
- Backend: Node.js, Express
- Database/Auth: Supabase
- Deployment target: Render

## Project structure

```text
frontend/   React app
backend/    Express API
supabase/   SQL schema and policies
```

## Quick start

1. Create a Supabase project.
2. Run the SQL in [schema.sql](C:\Users\samya\Downloads\SIaaS Software\supabase\schema.sql).
3. Copy [frontend/.env.example](C:\Users\samya\Downloads\SIaaS Software\frontend\.env.example) to `frontend/.env`.
4. Copy [backend/.env.example](C:\Users\samya\Downloads\SIaaS Software\backend\.env.example) to `backend/.env`.
5. Run `npm run install:backend`.
6. Run `npm run install:frontend`.
7. Run `npm run dev:backend`.
8. Run `npm run dev:frontend`.

Full setup details are in [SETUP.md](C:\Users\samya\Downloads\SIaaS Software\SETUP.md).

## Render deployment

This repo now includes [render.yaml](C:\Users\samya\Downloads\SIaaS Software\render.yaml), so it is ready to connect to GitHub and deploy as a Render Blueprint.

- `siaas-web`: static frontend service
- `siaas-api`: Node web service

You still need to fill in the real environment variables in Render:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `GROQ_MODEL`
