import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allow, children }) {
  const { role, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center py-24 text-slate-500">Loading...</div>;
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
