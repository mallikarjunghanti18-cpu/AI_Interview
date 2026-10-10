# AI Interviewer

An AI-powered interview practice application with a React + TypeScript frontend and FastAPI backend.

## Project structure

- `frontend/` — Vite, React and TypeScript client
- `backend/` — FastAPI API and interview logic
- `backend/requirements.txt` — Python dependencies

## Run locally

### Backend

1. Create a virtual environment.
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Set required API keys in a local environment file or environment variables. Never commit real secrets.
4. Start the API from the repository root: `python -m uvicorn backend.main:app --reload`

### Frontend

1. Enter `frontend/`.
2. Install dependencies with `npm install`.
3. Create `frontend/.env.local` based on `.env.example` and set `VITE_API_BASE_URL` to the backend URL.
4. Start the development server with `npm run dev`.

## Deployment

The frontend and backend can be deployed as separate Render services from this single repository. Configure each service's root directory as `frontend` or `backend`, respectively, and set environment variables in Render.

## Security

Do not commit `.env` files, API keys, tokens, passwords, or private credentials.
