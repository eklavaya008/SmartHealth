import AppointmentList from "../components/AppointmentList";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Appointments Dashboard</h1>
        <p className="text-gray-600">All submitted appointments with filters and quick stats.</p>
      </div>
      <AppointmentList />
    </div>
  );
}
