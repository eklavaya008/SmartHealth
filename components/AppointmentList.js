import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("All");

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch");
        if (!cancelled) setAppointments(data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter((a) => {
      const matchesQ = !q ||
        a.name?.toLowerCase().includes(q) ||
        String(a.age).includes(q) ||
        a.symptoms?.toLowerCase().includes(q) ||
        a.preferredDateTime?.toLowerCase().includes(q);
      const matchesG = gender === "All" || a.gender === gender;
      return matchesQ && matchesG;
    });
  }, [appointments, query, gender]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const male = appointments.filter((a) => a.gender === "Male").length;
    const female = appointments.filter((a) => a.gender === "Female").length;
    const other = appointments.filter((a) => a.gender === "Other").length;
    return { total, male, female, other };
  }, [appointments]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} color="blue" />
        <Stat label="Male" value={stats.male} color="emerald" />
        <Stat label="Female" value={stats.female} color="rose" />
        <Stat label="Other" value={stats.other} color="amber" />
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative max-w-md w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, symptoms, or time..."
            className="w-full border rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading appointments...
        </div>
      ) : error ? (
        <div className="text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>
      ) : !filtered.length ? (
        <div className="text-gray-600">No appointments match your filters.</div>
      ) : (
        <div className="overflow-x-auto card">
          <table className="min-w-full text-sm">
            <thead className="table-header">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Age</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Symptoms</th>
                <th className="px-4 py-2">Preferred Time</th>
                <th className="px-4 py-2">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a._id} className={`border-t ${i % 2 ? "bg-gray-50/60" : "bg-white"} hover:bg-gray-50/90`}>
                  <td className="px-4 py-2 font-medium">{a.name}</td>
                  <td className="px-4 py-2">{a.age}</td>
                  <td className="px-4 py-2">
                    <Badge color={a.gender === "Male" ? "emerald" : a.gender === "Female" ? "rose" : "amber"}>{a.gender}</Badge>
                  </td>
                  <td className="px-4 py-2 max-w-xl whitespace-pre-wrap">{a.symptoms}</td>
                  <td className="px-4 py-2">{a.preferredDateTime}</td>
                  <td className="px-4 py-2 text-gray-500">{new Date(a.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Badge({ children, color = "blue" }) {
  const map = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs ${map[color] || map.blue}`}>
      {children}
    </span>
  );
}

function Stat({ label, value, color = "blue" }) {
  const ring = {
    blue: "ring-blue-100",
    emerald: "ring-emerald-100",
    rose: "ring-rose-100",
    amber: "ring-amber-100",
  };
  const dot = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  };
  return (
    <div className={`card p-4 ring-1 ${ring[color] || ring.blue}`}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className={`inline-block h-2 w-2 rounded-full ${dot[color] || dot.blue}`} />
        {label}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
