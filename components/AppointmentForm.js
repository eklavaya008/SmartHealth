import { useMemo, useState } from "react";
import { Send } from "lucide-react";

export default function AppointmentForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    symptoms: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const symptomsCount = form.symptoms.length;
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const preferredDateTime = `${form.preferredDate} ${form.preferredTime}`.trim();
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          gender: form.gender,
          symptoms: form.symptoms,
          preferredDateTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      setSuccess("Appointment submitted successfully.");
      setForm({ name: "", age: "", gender: "Male", symptoms: "", preferredDate: "", preferredTime: "" });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={updateField}
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            <p className="text-xs text-gray-500 mt-1">As shown on your ID.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={updateField}
              min={0}
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={updateField}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={form.preferredDate}
              onChange={updateField}
              required
              min={minDate}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Time</label>
            <input
              type="time"
              name="preferredTime"
              value={form.preferredTime}
              onChange={updateField}
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium mb-1">Symptoms</label>
            <span className="text-xs text-gray-500">{symptomsCount}/500</span>
          </div>
          <textarea
            name="symptoms"
            value={form.symptoms}
            onChange={(e) => {
              if (e.target.value.length <= 500) updateField(e);
            }}
            required
            rows={5}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your symptoms, duration, and any medications taken."
          />
        </div>

        {success && <div className="text-green-700 bg-green-50 border border-green-200 rounded p-2">{success}</div>}
        {error && <div className="text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
        >
          {submitting ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send size={16} />
          )}
          Submit Appointment
        </button>
      </form>
    </div>
  );
}
