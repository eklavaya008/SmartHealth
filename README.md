# Smart Healthcare Appointment System

A full-stack web application that helps patients book medical appointments with intelligent disease prediction based on symptoms. The system matches patients with the right specialist and provides doctors with a dashboard to manage their appointments.

## Features

- **Symptom-based disease prediction** — Enter symptoms to get an instant predicted condition and recommended medical specialty
- **Doctor selection** — Browse and select doctors filtered by specialty
- **Appointment booking** — Patients can schedule appointments with their preferred date and time
- **Doctor dashboard** — Authenticated doctors can view and manage their appointments (confirm, complete, cancel, add notes)
- **Responsive UI** — Modern, mobile-friendly interface with animated interactions

## Tech Stack

| Layer      | Technologies                          |
| ---------- | ------------------------------------- |
| Frontend   | HTML, CSS, JavaScript (vanilla)       |
| Backend    | Node.js, Express                      |
| Database   | MongoDB, Mongoose                     |
| Auth       | JWT, bcryptjs                         |

## Project Structure

```
├── public/                 # Frontend static files
│   ├── css/                # Stylesheets
│   ├── js/                 # Client-side JavaScript
│   ├── assets/             # Images and logos
│   └── *.html              # Application pages
├── server/
│   ├── lib/                # Database connection & disease prediction
│   ├── middleware/         # JWT authentication middleware
│   ├── models/             # Mongoose schemas (Doctor, Appointment)
│   ├── routes/             # API route handlers
│   └── server.js           # Express app entry point
├── scripts/
│   └── seedDoctors.js      # Database seeding script
├── package.json
└── .env                    # Environment variables (not committed)
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/healthcare-app
JWT_SECRET=your-secret-key-here
PORT=3000
```

| Variable      | Description                                      |
| ------------- | ------------------------------------------------ |
| `MONGODB_URI` | MongoDB connection string                        |
| `JWT_SECRET`  | Secret key for signing JWT tokens                |
| `PORT`        | Server port (default: `3000`)                    |

### 4. Seed the database

Populate the database with sample doctors:

```bash
npm run seed
```

### 5. Start the server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The app will be available at **http://localhost:3000**.

## Pages

| Route        | Description                              |
| ------------ | ---------------------------------------- |
| `/`          | Home — book an appointment               |
| `/login`     | Doctor login                             |
| `/dashboard` | Doctor appointment management dashboard  |
| `/about`     | About the system                         |
| `/contact`   | Contact information                      |

## API Endpoints

### Auth

| Method | Endpoint          | Description        | Auth |
| ------ | ----------------- | ------------------ | ---- |
| POST   | `/api/auth/login` | Doctor login       | No   |

### Doctors

| Method | Endpoint          | Description                    | Auth |
| ------ | ----------------- | ------------------------------ | ---- |
| GET    | `/api/doctors`    | List all doctors               | No   |
| GET    | `/api/doctors?specialty=<name>` | Filter by specialty | No   |

### Appointments

| Method | Endpoint                | Description              | Auth |
| ------ | ----------------------- | ------------------------ | ---- |
| POST   | `/api/appointments`     | Create an appointment    | No   |
| GET    | `/api/appointments`     | Get doctor's appointments| Yes  |
| PATCH  | `/api/appointments/:id` | Update appointment status| Yes  |

### Health Check

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | `/api/health`  | Server health check|

## Demo Doctor Credentials

After running `npm run seed`, you can log in with any seeded doctor account:

| Email                         | Password   | Specialty          |
| ----------------------------- | ---------- | ------------------ |
| sarah.johnson@hospital.com    | doctor123  | Cardiology         |
| michael.chen@hospital.com     | doctor123  | Pulmonology        |
| emily.rodriguez@hospital.com  | doctor123  | Gastroenterology   |
| james.wilson@hospital.com     | doctor123  | Neurology          |
| lisa.anderson@hospital.com    | doctor123  | Dermatology        |
| robert.taylor@hospital.com    | doctor123  | General Medicine   |
| jennifer.martinez@hospital.com| doctor123  | Rheumatology       |
| david.brown@hospital.com      | doctor123  | Orthopedics        |

## How It Works

1. **Patient visits the home page** and fills in their details and symptoms.
2. **Disease prediction runs client-side** as symptoms are typed, suggesting a condition and specialty.
3. **Matching doctors are loaded** based on the predicted specialty.
4. **Patient selects a doctor** and submits the appointment request.
5. **Doctor logs in** to the dashboard to view, confirm, or update appointment status.

## Supported Specialties

- Cardiology
- Pulmonology
- Gastroenterology
- Neurology
- Dermatology
- General Medicine
- Rheumatology
- Orthopedics

## Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `npm start`   | Start the production server          |
| `npm run dev` | Start with nodemon (auto-reload)     |
| `npm run seed`| Seed the database with sample doctors|

## License

ISC
