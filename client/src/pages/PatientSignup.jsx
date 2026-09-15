import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';
import AuthLayout from '../components/AuthLayout';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

const EMPTY = { name: '', email: '', password: '', phone: '', dob: '', gender: 'Male' };

export default function PatientSignup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.patientSignup(form);
      login(data);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Book appointments and track your visits"
      tagline="Find the right doctor in minutes, not days."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField icon={User} required placeholder="Full name" value={form.name} onChange={set('name')} />
        <TextField icon={Mail} type="email" required placeholder="Email" value={form.email} onChange={set('email')} />
        <TextField
          icon={Lock}
          type="password"
          required
          placeholder="Password (min 8 chars, letter + number)"
          value={form.password}
          onChange={set('password')}
        />
        <TextField icon={Phone} required placeholder="Phone number" value={form.phone} onChange={set('phone')} />
        <div className="grid grid-cols-2 gap-3">
          <TextField icon={Calendar} type="date" required value={form.dob} onChange={set('dob')} />
          <TextField as="select" value={form.gender} onChange={set('gender')}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </TextField>
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/patient/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
