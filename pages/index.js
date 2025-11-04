import Link from "next/link";
import AppointmentForm from "../components/AppointmentForm";
import { HeartPulse, ShieldCheck, Clock8 } from "lucide-react";

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="card p-5 flex gap-4">
      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <Icon size={20} />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-6 pt-4">
        <div className="card p-8 sm:p-12 bg-gradient-to-br from-white to-blue-50 border-blue-100">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Smart Healthcare Appointment System</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Submit your symptoms and preferred visit time. We securely store your details
            and present them in a streamlined dashboard for quick clinic intake.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="#form" className="btn-primary">Book Now</Link>
            <Link href="/appointments" className="btn-secondary">View Dashboard</Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Feature icon={HeartPulse} title="Patient-friendly" desc="Clean, mobile-first form that reduces friction and speeds up intake." />
        <Feature icon={ShieldCheck} title="Secure by design" desc="Data stored in MongoDB with server-side validation on submission." />
        <Feature icon={Clock8} title="Time efficient" desc="Preferred date and time ensures better scheduling alignment." />
      </section>

      <section id="form" className="card p-6 sm:p-8">
        <h2 className="section-title mb-2">Symptom Input Form</h2>
        <p className="text-gray-600 mb-6">Provide your details and we’ll prepare for your visit.</p>
        <AppointmentForm />
      </section>
    </div>
  );
}
