# Smart Healthcare Appointment System (Frontend + MongoDB)

A Next.js app with Tailwind CSS that lets users submit symptom and appointment details, stores them in MongoDB, and displays them on a dashboard.

## Tech Stack
- Next.js (Pages Router)
- Tailwind CSS
- MongoDB (Mongoose)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root and set your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/healthcare
```

3. Run the development server:

```bash
npm run dev
```

4. Open the app at `http://localhost:3000`.

- Home page contains the Symptom Input Form.
- Dashboard at `/appointments` shows the list of records.

## MongoDB Atlas Quick Setup
- Create a free cluster in MongoDB Atlas
- Add a database user (username/password)
- Allow network access from `0.0.0.0/0` for development
- Use the provided connection string in `.env.local`

## Project Structure
```
smart-healthcare/
├── pages/
│   ├── index.js
│   ├── appointments.js
│   └── api/
│       └── appointments.js
├── components/
│   ├── Navbar.js
│   ├── AppointmentForm.js
│   └── AppointmentList.js
├── lib/
│   └── mongodb.js
├── models/
│   └── Appointment.js
├── styles/
│   └── globals.css
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── package.json
├── .env.local (not committed)
```

## Notes
- API endpoints:
  - `POST /api/appointments` to create an appointment
  - `GET /api/appointments` to list appointments
- Minimal validation and error handling are included.
