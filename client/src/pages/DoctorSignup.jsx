import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Phone,
  Award,
  Briefcase,
  Building2,
  BadgeCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';
import AuthLayout from '../components/AuthLayout';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
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
      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-md flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>
        <h1 className="mt-5 font-display text-2xl font-bold text-slate-900">Application submitted</h1>
        <p className="mt-2 text-slate-600">
          Your profile is pending review by our team. You'll be listed publicly once approved — you can log in
          anytime to check your status.
        </p>
        <Button onClick={() => navigate('/doctor/dashboard')} className="mt-6">
          Go to my dashboard
        </Button>
      </div>
    );
  }

  return (
    <AuthLayout
      wide
      title="Register as a doctor"
      subtitle="New doctor accounts are reviewed by an admin before appearing publicly."
      tagline="Join a platform built on verified care."
    >
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField icon={User} required placeholder="Full name" value={form.name} onChange={set('name')} />
        </div>
        <div className="sm:col-span-2">
          <TextField icon={Mail} type="email" required placeholder="Email" value={form.email} onChange={set('email')} />
        </div>
        <div className="sm:col-span-2">
          <TextField
            icon={Lock}
            type="password"
            required
            placeholder="Password (min 8 chars, letter + number)"
            value={form.password}
            onChange={set('password')}
          />
        </div>
        <TextField as="select" value={form.specialty} onChange={set('specialty')}>
          {SPECIALTIES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </TextField>
        <TextField
          icon={Briefcase}
          type="number"
          min="0"
          required
          placeholder="Years of experience"
          value={form.experience}
          onChange={set('experience')}
        />
        <TextField icon={Award} required placeholder="Qualifications (e.g. MD, FACC)" value={form.qualifications} onChange={set('qualifications')} />
        <TextField icon={Building2} required placeholder="Hospital / clinic" value={form.hospital} onChange={set('hospital')} />
        <TextField icon={Phone} required placeholder="Phone number" value={form.phone} onChange={set('phone')} />
        <TextField icon={BadgeCheck} required placeholder="Medical license number" value={form.licenseNumber} onChange={set('licenseNumber')} />
        <div className="sm:col-span-2">
          <TextField as="textarea" placeholder="Short bio (optional)" value={form.bio} onChange={set('bio')} rows={3} />
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-red-600 sm:col-span-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
        <Button type="submit" disabled={loading} className="w-full sm:col-span-2">
          {loading ? 'Submitting...' : 'Submit application'}
        </Button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/doctor/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
