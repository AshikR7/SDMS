# Student Directory Management System

A full-stack CRUD application for managing student records, with an optional AI assistant for answering questions about the directory in natural language.

## Project Description

Student Directory is a single-page web application that allows a user to add, view, edit, and delete student records. All student data is persisted in PostgreSQL — nothing is stored in browser storage or hard-coded in the frontend. The project also includes a Gemini-powered AI assistant that can answer questions about the current student data (e.g. enrollment counts, courses offered).

## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Axios |
| Backend | Python, Django, Django REST Framework |
| Database | PostgreSQL |
| AI Assistant | Google Gemini API (`google-genai`) |
| API Testing | Postman / DRF Browsable API |
| Version Control | Git + GitHub |

> **Note on stack:** the original spec called for FastAPI as the backend framework. This implementation uses **Django + Django REST Framework** instead, covering the same REST/CRUD requirements (parameterized queries via the Django ORM, `.env`-based configuration, CORS, validation, and correct HTTP status codes). See **Assumptions & Limitations** below.

## PostgreSQL Database Setup

1. Make sure PostgreSQL is installed and running locally.
2. Create the database:
   ```sql
   CREATE DATABASE studentdb;
   ```
3. Django's `migrate` command (see Backend setup below) creates the `students` table automatically, based on the `Student` model — you do not need to write `CREATE TABLE` by hand.

**Table: `students`**

| Field | Type / Constraint |
|---|---|
| id | Primary key, auto-generated |
| name | Required |
| email | Required, unique |
| course | Required |
| age | Required, must be greater than 0 (enforced by a `CheckConstraint`) |
| created_at | Auto-generated on creation |

## Backend Installation & Run Instructions

```bash
cd backend_api
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in the same folder as `manage.py`:
```env
SECRET_KEY=your-generated-django-secret-key
DEBUG=True

DB_NAME=studentdb
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

GEMINI_API_KEY=your_gemini_api_key
```

Generate a real `SECRET_KEY`:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Run migrations and start the server:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://localhost:8000`. Swagger/browsable API available at `http://localhost:8000/api/students/`.

## Frontend Installation & Run Instructions

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and talks to the backend at `http://localhost:8000/api`.

## Running the Complete Application

1. Start PostgreSQL.
2. Start the backend: `python manage.py runserver` (from `backend_api/`).
3. Start the frontend: `npm run dev` (from `frontend/`).
4. Open `http://localhost:5173` in a browser.
5. Add, view, edit, and delete students through the form and table.
6. Refresh the page — records persist because they're read from PostgreSQL on load, not from local state.

## API Endpoints

| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| GET | `/api/students/` | Get all students (newest first) | 200 OK |
| POST | `/api/students/` | Add a student | 201 Created |
| PUT | `/api/students/{id}/` | Update a student | 200 OK |
| DELETE | `/api/students/{id}/` | Delete a student | 204 No Content |
| POST | `/api/assistant/` | Ask the AI assistant a question | 200 OK |

**Error responses:**
- `400 Bad Request` — missing/invalid fields (blank name/email/course, age ≤ 0)
- `409 Conflict` — duplicate email on create or update
- `404 Not Found` — student ID does not exist (update/delete)

## AI Assistant

`POST /api/assistant/` adds a Gemini-powered chat assistant on top of the student directory, exposed in the frontend as a chat panel below the student table.

**Request:**
```json
{ "message": "How many students are enrolled?" }
```

**Response:**
```json
{ "message": "How many students are enrolled?", "response": "There are currently 5 students enrolled, across Computer Science and Data Science." }
```

**How it works:**
- Each request pulls a live summary of the current student data (total count, distinct courses) from PostgreSQL and injects it into the prompt sent to Gemini, so answers reflect real data rather than the model's general knowledge.
- The assistant is **read-only** — it can answer questions about the data, but it cannot add, edit, or delete students. Any such request is explained back to the user; changes must go through the app's normal Add/Edit/Delete UI.
- The Gemini API key is read from `.env` (`GEMINI_API_KEY`) and never hard-coded or committed.
- Model used: `gemini-2.5-flash-lite`.

**Limitation:** each request is stateless — the assistant does not remember earlier messages in the conversation. The frontend chat panel displays a running conversation visually, but every message is sent to Gemini independently, with no shared history. Follow-up questions that depend on earlier context (e.g. "what about *that* student") will not resolve correctly.

## Assumptions & Limitations

- **Framework substitution:** built with Django REST Framework instead of the originally specified FastAPI. All functional requirements (validation, parameterized queries via the ORM, `.env` config, CORS, correct status codes) are met using Django's equivalent tooling.
- **No authentication:** the app is single-user by design — there is no login, session, or per-user data separation. Anyone with access to the frontend can manage all student records.
- **AI assistant is additive, not part of the core grading spec** — it does not replace or modify the required CRUD functionality, and the app is fully usable with the assistant panel ignored.
- **AI assistant has no persistent memory** across messages or sessions (see Limitation above).
- Trailing slashes: API routes use DRF's default trailing-slash convention (`/api/students/`, not `/api/students`). Django's `APPEND_SLASH` will redirect a request without the slash, but direct no-redirect clients (e.g. some Postman configurations) should include it explicitly.
