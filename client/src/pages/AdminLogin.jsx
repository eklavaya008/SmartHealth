import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.adminLogin(form);
      login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-800/60 p-8 shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700 text-slate-300">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-center font-display text-xl font-bold text-white">Admin access</h1>
        <p className="mt-1 text-center text-sm text-slate-400">Restricted to platform administrators</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <TextField
            dark
            icon={Mail}
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            dark
            icon={Lock}
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && (
            <p className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          <Button type="submit" variant="dark" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
