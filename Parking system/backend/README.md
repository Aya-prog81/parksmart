# Ifrane Smart Parking — Backend (FastAPI + MySQL)

REST API for the Ifrane Smart Parking system. Built with **FastAPI**, **SQLAlchemy 2**, **MySQL**, and **JWT** auth. Matches the React frontend in the parent folder.

## ✨ What's included

- **JWT authentication** — register, login (user), login (agent by code), `/auth/me`.
- **Role-based access control** — `user`, `agent`, `admin` roles with dependency guards.
- **Parking lots** — public list + admin CRUD.
- **Reservations** — users can book a spot (debits lot availability), list their own, or cancel (refunds availability).
- **Agent controls** — `/agent/enter` and `/agent/exit` adjust the lot's live counter.
- **Admin analytics** — users list, agents list, and an analytics summary (capacity, occupancy per lot, revenue today).
- **Seed script** — creates the 5 Arabic-named lots, 4 agents (`AGT-001`…`AGT-004`), and an admin account that match the frontend mock data exactly.

## 📋 Prerequisites

1. **Python 3.10+** — check with `python --version`
2. **MySQL Server 8+** — install from https://dev.mysql.com/downloads/installer/ (Windows), or `brew install mysql` (Mac), or `sudo apt install mysql-server` (Linux).

## 🚀 Setup

### 1. Create the MySQL database

Open a terminal and log into MySQL:

```bash
mysql -u root -p
```

Then inside the MySQL prompt:

```sql
CREATE DATABASE ifrane_parking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

> The `utf8mb4` charset is required so Arabic lot names (`موقف الجامعة` …) save correctly.

### 2. Configure environment variables

Copy `.env.example` to `.env` and edit the MySQL credentials:

```bash
cd backend
copy .env.example .env    # Windows
# cp .env.example .env    # Mac/Linux
```

Edit `.env` and set `DATABASE_URL` to match your MySQL user / password:

```
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/ifrane_parking
```

### 3. Install Python dependencies

From the `backend/` folder:

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

### 4. Seed the database

```bash
python -m app.seed
```

This creates the tables and inserts:

| Type      | Credentials                                                      |
| --------- | ---------------------------------------------------------------- |
| **Admin** | email `admin@ifrane-parking.ma` · password `Admin@12345`          |
| **Agents**| codes `AGT-001`, `AGT-002`, `AGT-003`, `AGT-004` · password `Agent@12345` |
| **Lots**  | 5 parking lots matching the frontend (موقف الجامعة / المدينة / السوق / الأسد / الحديقة) |

### 5. Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

- API root: http://localhost:8000
- Interactive docs (Swagger): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc

## 🔑 API endpoints

### Auth

| Method | Path                 | Body                                          | Description                |
| ------ | -------------------- | --------------------------------------------- | -------------------------- |
| POST   | `/auth/register`     | `{full_name,email,phone?,password}`           | Create a regular user      |
| POST   | `/auth/login`        | `{email,password}`                            | Log in as user/admin       |
| POST   | `/auth/agent/login`  | `{agent_code,password}`                       | Log in as an agent         |
| GET    | `/auth/me`           | — (Bearer token)                              | Return the current user    |

### Parking lots

| Method | Path            | Access  | Body                                   |
| ------ | --------------- | ------- | -------------------------------------- |
| GET    | `/lots`         | public  | —                                      |
| GET    | `/lots/{id}`    | public  | —                                      |
| POST   | `/lots`         | admin   | ParkingLotCreate                       |
| PATCH  | `/lots/{id}`    | admin   | ParkingLotUpdate (partial)             |
| DELETE | `/lots/{id}`    | admin   | —                                      |

### Reservations

| Method | Path                                | Access | Body                                           |
| ------ | ----------------------------------- | ------ | ---------------------------------------------- |
| POST   | `/reservations`                     | user   | `{lot_id,duration_hours,payment_method?}`      |
| GET    | `/reservations/me`                  | user   | —                                              |
| GET    | `/reservations`                     | admin  | —                                              |
| POST   | `/reservations/{id}/cancel`         | user   | —                                              |

### Agent

| Method | Path              | Access | Description                          |
| ------ | ----------------- | ------ | ------------------------------------ |
| GET    | `/agent/my-lot`   | agent  | Return the agent's assigned lot      |
| POST   | `/agent/enter`    | agent  | A car entered — decrement available  |
| POST   | `/agent/exit`     | agent  | A car left — increment available     |

### Admin

| Method | Path               | Access | Description                          |
| ------ | ------------------ | ------ | ------------------------------------ |
| GET    | `/admin/users`     | admin  | All regular users                    |
| GET    | `/admin/agents`    | admin  | All agents                           |
| GET    | `/admin/analytics` | admin  | Totals + per-lot occupancy + today's revenue |

## 🧪 Quick smoke test (curl / PowerShell Invoke-RestMethod)

```bash
# 1. Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"فيروز","email":"test@example.com","password":"test1234"}'

# 2. Login (save the access_token from the response)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'

# 3. List lots
curl http://localhost:8000/lots

# 4. Book a spot (replace TOKEN)
curl -X POST http://localhost:8000/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"lot_id":1,"duration_hours":2}'
```

## 🗂️ Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py                 # env vars
│   ├── database.py               # SQLAlchemy engine / Base / get_db
│   ├── models.py                 # User, ParkingLot, Reservation
│   ├── schemas.py                # Pydantic request/response models
│   ├── security.py               # bcrypt + JWT helpers
│   ├── deps.py                   # get_current_user, require_admin, require_agent
│   ├── main.py                   # FastAPI app + CORS + routers
│   ├── seed.py                   # Seeds lots, agents, admin
│   └── routers/
│       ├── auth.py
│       ├── lots.py
│       ├── reservations.py
│       ├── agent.py
│       └── admin.py
├── requirements.txt
├── .env.example
└── README.md
```

## 🔒 Notes

- Tables are auto-created on startup (`Base.metadata.create_all`). For production, swap to Alembic migrations.
- Change `JWT_SECRET` in `.env` before deploying.
- The frontend dev server (Vite, port 5173) is allow-listed in CORS via `CORS_ORIGINS` in `.env`.
