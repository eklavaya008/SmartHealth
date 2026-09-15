export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-800">About SmartHealth</h1>
      <p className="mt-4 text-slate-600">
        SmartHealth helps patients describe their symptoms in plain language and get matched to the right medical
        specialty using a transparent, rule-based keyword engine — no black-box ML, no false certainty. From there
        you can book a real appointment slot with an admin-verified doctor and manage everything from your
        dashboard.
      </p>
      <p className="mt-4 text-slate-600">
        Doctors get their own dashboard to manage availability and appointments, and every new doctor account is
        reviewed by an admin before it goes live, so patients only ever book with verified practitioners.
      </p>
    </div>
  );
}
