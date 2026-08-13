# HCM — Hospital Management System

A full-stack legacy Hospital Management System built with **Next.js 16** (frontend) and **Django 5** (backend), connected to a **Neon PostgreSQL** database.

---

## Project Structure

```
HSM/
├── client/          # Next.js 16 frontend (App Router + TypeScript + Tailwind v4)
├── server/          # Django 5 backend (DRF + SimpleJWT + Neon PostgreSQL)
└── plan.prd         # Product Requirements Document
```

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 20.x LTS |
| Python | 3.12 |
| npm | 10.x |
| Git | any |

---

## 🚀 Backend Setup (`server/`)

### 1. Create & Activate Virtual Environment

```powershell
# From HSM/ root — PowerShell (Windows)
python -m venv server\.venv

# Activate (PowerShell)
server\.venv\Scripts\Activate.ps1

# Activate (CMD)
server\.venv\Scripts\activate.bat

# Activate (macOS / Linux / WSL)
source server/.venv/bin/activate
```

> **Note**: You should see `(.venv)` prefix in your prompt once activated.

### 2. Install Python Dependencies

```powershell
cd server
pip install -r requirements.txt

# Dev dependencies (testing + linting)
pip install -r requirements-dev.txt
```

### 3. Configure Environment Variables

```powershell
# Copy the template
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

The `.env` already contains your Neon PostgreSQL `DATABASE_URL`. Open it and **change `SECRET_KEY`** before doing anything else:

```env
SECRET_KEY=generate-a-long-random-string-here
```

Generate a secret key:
```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. Run Migrations (connects to Neon DB)

```powershell
# From server/ (venv active)
python manage.py migrate
```

Expected output: applied migrations on the Neon database.

### 7. Create Superuser

```powershell
python manage.py createsuperuser
```

### 8. Start Development Server

```powershell
python manage.py runserver
```

Backend running at: **http://localhost:8000**  
Django Admin: **http://localhost:8000/admin/**  
API Root: **http://localhost:8000/api/v1/**

### 9. Verify DB Connection

```powershell
python manage.py dbshell
# Should open a psql shell connected to Neon. Type \dt to list tables.
```

---

## 🎨 Frontend Setup (`client/`)

### 1. Install Dependencies

```powershell
cd client
npm install
```

### 2. Install Additional Packages

```powershell
npm install axios zustand react-hook-form zod @hookform/resolvers
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-hot-toast
```

### 3. Configure Environment

```powershell
# client/.env.local already exists pointing to localhost:8000
# If your backend runs on a different port, edit:
# NEXT_PUBLIC_API_URL=http://localhost:<port>/api/v1
```

### 4. Start Development Server

```powershell
npm run dev
```

Frontend running at: **http://localhost:3000**

---

## ✅ Verify Full-Stack Connection

1. Start Django: `python manage.py runserver` (in `server/`)
2. Start Next.js: `npm run dev` (in `client/`)
3. Open browser → `http://localhost:3000`
4. Open Network tab → confirm API calls hit `http://localhost:8000/api/v1/`

---

## 🛠️ Development Commands

### Backend

| Command | Description |
|---|---|
| `python manage.py runserver` | Start dev server |
| `python manage.py makemigrations` | Generate migrations |
| `python manage.py migrate` | Apply migrations |
| `python manage.py createsuperuser` | Create admin user |
| `python manage.py shell` | Django REPL |
| `python manage.py dbshell` | psql shell on Neon DB |
| `pytest` | Run all tests |
| `black .` | Format Python code |
| `ruff check .` | Lint Python code |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format |

---

## 📦 Key Dependencies

### Backend
- `Django 5.2` — web framework
- `djangorestframework` — REST API
- `djangorestframework-simplejwt` — JWT auth
- `django-cors-headers` — CORS for Next.js
- `psycopg[binary]` — PostgreSQL driver (v3, NOT psycopg2)
- `dj-database-url` — parse `DATABASE_URL` env var
- `python-decouple` — `.env` file loading

### Frontend
- `Next.js 16` — App Router, TypeScript
- `Tailwind CSS v4` — utility styling
- `shadcn/ui` — component library
- `axios` — HTTP client (see `lib/api-client.ts`)
- `zustand` — state management
- `@tanstack/react-query` — server state + caching
- `react-hook-form` + `zod` — form validation

---

## 🗄️ Database

**Provider**: Neon PostgreSQL (serverless)  
**Connection**: `DATABASE_URL` in `server/.env`  
**SSL**: Required (`sslmode=require&channel_binding=require`)  
**Driver**: `psycopg` v3

> **Important**: Never commit `server/.env` to git. It contains real database credentials.

---

## 🏗️ Architecture

See [`plan.prd`](./plan.prd) for the full Product Requirements Document including module breakdown, API contract, and milestones.

---

## 🔐 Environment Variables Reference

### `server/.env`

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key — generate with `get_random_secret_key()` |
| `DEBUG` | `True` for dev, `False` for prod |
| `DJANGO_SETTINGS_MODULE` | `config.settings.development` or `config.settings.production` |
| `DATABASE_URL` | Full Neon PostgreSQL connection string |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | Default: `60` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | Default: `7` |

### `client/.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Django backend API base URL |
