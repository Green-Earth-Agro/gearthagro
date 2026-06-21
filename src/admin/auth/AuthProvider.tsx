import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserPosition, UserRole } from '../types/auth';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

interface AdminAuthValue {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  position: UserPosition | null;
  fullName: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AdminAuthValue | null>(null);

interface StaffRecord {
  role: UserRole;
  position: UserPosition;
}

// Reads the caller's own active role row. Mirrors the mobile RoleGuard query, so the
// same self-read RLS policy applies. Returns null when there's no active staff row.
async function loadStaffRecord(userId: string): Promise<StaffRecord | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role, position, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;
  return {
    role: data.role as UserRole,
    position: data.position as UserPosition,
  };
}

// Display name for the staff member, from auth metadata (user_roles has no name column).
function displayNameOf(user: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  return (meta.full_name as string) || (meta.name as string) || user.email || null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [staff, setStaff] = useState<StaffRecord | null>(null);
  // Guards against out-of-order resolution when auth events fire in quick succession.
  const loadToken = useRef(0);

  const applySession = useCallback(async (next: Session | null) => {
    const token = ++loadToken.current;
    setSession(next);
    if (!next?.user) {
      setStaff(null);
      setStatus('signedOut');
      return;
    }
    const record = await loadStaffRecord(next.user.id);
    if (token !== loadToken.current) return; // a newer event superseded this one
    setStaff(record);
    setStatus('signedIn');
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) void applySession(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      void applySession(next);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback<AdminAuthValue['signIn']>(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error: error ? error.message : null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AdminAuthValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      role: staff?.role ?? null,
      position: staff?.position ?? null,
      fullName: displayNameOf(session?.user ?? null),
      signIn,
      signOut,
    }),
    [status, session, staff, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AdminAuthValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
