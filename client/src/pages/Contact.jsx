export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-800">Contact</h1>
      <p className="mt-4 text-slate-600">
        Questions or feedback about SmartHealth? Reach out at{' '}
        <a href="mailto:support@smarthealth.example" className="text-brand-700 hover:underline">
          support@smarthealth.example
        </a>
        .
      </p>
    </div>
  );
}
