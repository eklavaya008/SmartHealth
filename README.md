# SmartHealth

A full-stack doctor appointment booking platform. Patients describe their symptoms and get
matched to a medical specialty by a transparent, rule-based keyword engine, then book a real
time slot with an admin-verified doctor. Doctors manage their own profile, availability, and
appointments; admins review and approve new doctor accounts before they go live.

## Tech Stack

| Layer    | Technologies                                             |
| -------- | --------------------------------------------------------- |
| Frontend | React (Vite), React Router, Tailwind CSS, Axios           |
| Backend  | Node.js, Express                                          |
| Database | MongoDB, Mongoose                                         |
| Auth     | JWT (httpOnly cookies), bcryptjs                           |

## Features

- **Three roles, each with real accounts**: patients and doctors self-register and log in;
  an admin (seeded, not self-registered) reviews and approves/rejects new doctors.
- **Symptom prediction, not a black box**: a weighted, word-boundary keyword matcher ranks
  the top 3 likely conditions with a confidence score and the matched keywords — computed
  server-side so it can't be spoofed by the client, and re-verified at booking time.
- **Real time-slot booking**: doctors define weekly availability windows; patients pick an
  actually-open slot. A partial unique index plus a live availability check prevent
  double-booking.
- **Enforced appointment lifecycle**: `pending → confirmed → completed`, or cancellation from
  either side — invalid transitions (e.g. going backwards) are rejected server-side.
- **Security baseline for a real deployment**: httpOnly/secure session cookies (not
  localStorage), helmet, rate limiting (tighter on auth routes), input validation on every
  route, centralized error handling that never leaks internals, and a fail-fast check that
  refuses to boot without a real `JWT_SECRET`.

## Project Structure

```
├── client/                 # React app (Vite)
│   └── src/
│       ├── api/             # axios wrappers per resource
│       ├── components/      # Navbar, PredictionPanel, DoctorCard, SlotPicker, ...
│       ├── context/         # AuthContext (session state)
│       └── pages/           # one file per route
├── server/
│   ├── app.js               # Express app (middleware + routes), no listen()
│   ├── server.js            # entry point: connects to DB, starts listening
│   ├── config/               # env validation, DB connection
│   ├── constants/            # shared enums (specialties)
│   ├── controllers/          # route handlers
│   ├── lib/                  # diseasePrediction, slot generation, JWT helpers
│   ├── middleware/            # authenticate, authorize, error handling, rate limits
│   ├── models/                # Patient, Doctor, Admin, Appointment (Mongoose)
│   ├── routes/                 # /api/auth, /api/doctors, /api/appointments, /api/admin, /api/predict
│   ├── scripts/                 # seedAdmin.js, seedDoctors.js
│   ├── tests/                    # node:test integration tests (auth, booking)
│   └── validators/               # express-validator rule sets per route
├── package.json             # server deps + scripts
└── .env.example
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A MongoDB connection string — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)

## Getting Started

### 1. Install dependencies (server + client)

```bash
npm install
cd client && npm install && cd ..
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

| Variable      | Description                                                        |
| ------------- | -------------------------------------------------------------------|
| `MONGODB_URI` | MongoDB connection string                                          |
| `JWT_SECRET`  | Secret for signing JWTs — **must be at least 32 characters**       |
| `PORT`        | API server port (default `3000`)                                   |
| `NODE_ENV`    | `development` \| `production` \| `test`                            |
| `CLIENT_URL`  | Origin allowed by CORS (the Vite dev server, default `http://localhost:5173`) |

The server refuses to start if `MONGODB_URI` or a sufficiently long `JWT_SECRET` are missing.

### 3. Seed initial data

```bash
npm run seed:doctors                                                      # 8 demo doctors, already approved (password: doctor123)
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=ChangeMe123 npm run seed:admin # one admin account
```

### 4. Run it

In one terminal:

```bash
npm run dev          # API on http://localhost:3000
```

In another:

```bash
cd client && npm run dev   # React app on http://localhost:5173 (proxies /api to :3000)
```

Open **http://localhost:5173**. In production, `npm run build` inside `client/` and the
Express server will serve the built client directly (see `server/app.js`).

## Roles & Access

| Route prefix         | Who                                   |
| --------------------- | -------------------------------------- |
| `/patient/*`          | Any signed-up patient                  |
| `/doctor/*`            | Any signed-up doctor (dashboard works regardless of approval status; public listing requires `approved`) |
| `/admin/*`             | Seeded admin account only (`/admin/login`, not linked in the nav) |

New doctor accounts start as `pending` and are invisible in the public doctor list/booking
flow until an admin approves them from `/admin/dashboard`.

## API Overview

| Area          | Base path             | Notes                                                            |
| -------------- | ---------------------- | ------------------------------------------------------------------ |
| Auth            | `/api/auth`             | `/patient/signup`, `/patient/login`, `/doctor/signup`, `/doctor/login`, `/admin/login`, `/me`, `/logout` |
| Doctors          | `/api/doctors`           | Public list/detail (approved only); `/me/profile`, `/me/availability` (doctor-only) |
| Appointments      | `/api/appointments`       | `/slots`, book, `/me` (patient), `/doctor/me`, `/:id/status` (doctor), `/:id/cancel` (patient) |
| Admin              | `/api/admin/doctors`       | List by status, approve/reject/deactivate (admin-only)            |
| Prediction          | `/api/predict`              | `POST { symptoms }` → ranked condition/specialty matches           |
| Health               | `/api/health`                 | Liveness check                                                      |

## Testing

```bash
npm test
```

Runs integration tests (`server/tests/`) against a dedicated `smarthealth_test` database
using Node's built-in test runner — covers signup/login/session handling across roles and
the full booking lifecycle (slot generation, conflict rejection, status transitions,
ownership checks, cancellation).

## Scripts

| Command              | Description                                      |
| --------------------- | ------------------------------------------------- |
| `npm start`            | Start the API server                              |
| `npm run dev`           | Start the API server with nodemon                 |
| `npm run seed:doctors`  | Seed 8 demo, pre-approved doctors                  |
| `npm run seed:admin`    | Create an admin account from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars |
| `npm test`               | Run the integration test suite                     |

## License

ISC
