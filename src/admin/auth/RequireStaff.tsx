import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { isStaffRole } from '../types/auth';
import { FullScreen } from '../components/FullScreen';
import { Unauthorized } from '../screens/Unauthorized';

// Outer access layer. The real boundary is Supabase RLS + role-gated RPCs; this just
// decides what the SPA renders. Three honest states: still resolving, not signed in,
// signed in but not staff.
export function RequireStaff({ children }: { children: ReactNode }) {
  const { status, role } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <FullScreen>Checking your access…</FullScreen>;
  }

  if (status === 'signedOut') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isStaffRole(role)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
}
