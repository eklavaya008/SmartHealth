import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';
import { SPECIALTIES } from '../constants';

const EMPTY = {
  name: '',
  email: '',
  password: '',
  specialty: SPECIALTIES[0],
  qualifications: '',
  experience: '',
  hospital: '',
  phone: '',
  licenseNumber: '',
  bio: '',
};

export default function DoctorSignup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.doctorSignup({ ...form, experience: Number(form.experience) });
      login(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Application submitted</h1>
        <p className="mt-2 text-slate-600">
          Your profile is pending review by our team. You'll be listed publicly once approved — you can log in
          anytime to check your status.
        </p>
        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 text-white"
        >
          Go to my dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-800">Register as a Doctor</h1>
      <p className="mt-1 text-sm text-slate-500">
        New doctor accounts are reviewed by an admin before appearing publicly.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={set('name')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={set('email')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          type="password"
          required
          placeholder="Password (min 8 chars, letter + number)"
          value={form.password}
          onChange={set('password')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <select value={form.specialty} onChange={set('specialty')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          {SPECIALTIES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          required
          placeholder="Years of experience"
          value={form.experience}
          onChange={set('experience')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Qualifications (e.g. MD, FACC)"
          value={form.qualifications}
          onChange={set('qualifications')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Hospital / clinic"
          value={form.hospital}
          onChange={set('hospital')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Phone number"
          value={form.phone}
          onChange={set('phone')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Medical license number"
          value={form.licenseNumber}
          onChange={set('licenseNumber')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Short bio (optional)"
          value={form.bio}
          onChange={set('bio')}
          rows={3}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
        />
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-60 sm:col-span-2"
        >
          {loading ? 'Submitting...' : 'Submit application'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/doctor/login" className="font-medium text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
