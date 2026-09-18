import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export function Loader() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center text-on-surface">
      <div className="flex flex-col items-center gap-3">
        <Logo size={48} className="animate-pulse" />
        <span className="font-label-caps text-label-caps text-outline">BOOTING SEKALE NODES…</span>
      </div>
    </div>
  );
}

/** Redirects unauthenticated users to the login page. */
export function RequireAuth({ children }) {
  const auth = useAuth();
  const { user, loading } = auth || {};
  const location = useLocation();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/signin" replace state={{ from: location }} />;
  return children;
}

/** Redirects already-authenticated users away from the login page. */
export function GuestOnly({ children }) {
  const auth = useAuth();
  const { user, loading } = auth || {};
  if (loading) return <Loader />;
  if (user) return <Navigate to="/home" replace />;
  return children;
}
