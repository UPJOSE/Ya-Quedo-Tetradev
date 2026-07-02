import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? <>{children}</> : <Navigate to="/catalog" replace />;
}
