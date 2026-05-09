# ParkSmart — Ifrane Smart Parking System

A real-time parking availability management system for Ifrane city and Al Akhawayn University (AUI), built with React, FastAPI, and MySQL.

## Live Demo

- **Frontend:** https://parksmart-blush.vercel.app
- **Backend API:** https://parksmart-production.up.railway.app/docs

---

##  Project Overview

ParkSmart is a web application that allows:
- **Users** to view real-time parking availability across 10 lots in Ifrane and AUI, and make reservations
- **Agents** to manage their assigned parking lot by registering car entries and exits
- **Admins** to monitor all lots, manage users and agents, and view analytics

---

##  Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React 18.3, TypeScript, Vite, Tailwind CSS |
| Mapping | Leaflet.js, OpenStreetMap |
| Backend | Python, FastAPI, Uvicorn |
| Database | MySQL, SQLAlchemy ORM |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Vercel (frontend), Railway (backend + DB) |

---

##  Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL 8+

### Backend Setup

```bash
# Navigate to backend folder
cd "Parking system/backend"

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and set your DATABASE_URL, JWT_SECRET

# Seed the database
python -m app.seed

# Run the backend
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd "Parking system/Parking system"

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL=http://localhost:8000

# Run the frontend
npm run dev
```

---

##  Default Credentials

### Admin
| Field | Value |
|-------|-------|
| Email | admin@ifrane-parking.ma |
| Password | Admin@12345 |

### Agents
| Code | Email | Password |
|------|-------|----------|
| AGT-001 | agt001@ifrane-parking.ma | Agent@12345 |
| AGT-002 | agt002@ifrane-parking.ma | Agent@12345 |
| AGT-003 | agt003@ifrane-parking.ma | Agent@12345 |
| AGT-004 | agt004@ifrane-parking.ma | Agent@12345 |
| AGT-005 | agt005@ifrane-parking.ma | Agent@12345 |

---

##  Project Structure
parksmart/
├── Parking system/
│   ├── backend/          # FastAPI backend
│   │   ├── app/
│   │   │   ├── routers/  # API endpoints
│   │   │   ├── models.py # Database models
│   │   │   ├── schemas.py
│   │   │   ├── seed.py   # Initial data
│   │   │   └── main.py
│   │   └── requirements.txt
│   ├── src/              # React frontend
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── agent/
│   │   │   └── user/
│   │   └── lib/
└── README.md

## License

This project was developed as a class project at Al Akhawayn University in Ifrane (AUI).
