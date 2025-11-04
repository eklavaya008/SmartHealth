import { connectToDatabase } from "../../lib/mongodb";
import Appointment from "../../models/Appointment";

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (err) {
    if (err?.code === "NO_MONGODB_URI") {
      return res.status(503).json({ error: "Server not configured: set MONGODB_URI in .env.local" });
    }
    return res.status(500).json({ error: "Database connection error" });
  }

  if (req.method === "POST") {
    try {
      const { name, age, gender, symptoms, preferredDateTime } = req.body || {};

      if (!name || (!age && age !== 0) || !gender || !symptoms || !preferredDateTime) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const created = await Appointment.create({
        name,
        age: Number(age),
        gender,
        symptoms,
        preferredDateTime,
      });
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: "Failed to create appointment" });
    }
  }

  if (req.method === "GET") {
    try {
      const appts = await Appointment.find({}).sort({ createdAt: -1 });
      return res.status(200).json(appts);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
