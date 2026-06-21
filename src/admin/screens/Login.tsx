import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { FullScreen } from '../components/FullScreen';
import logo from '../../assets/logo/agro_logo.svg';

export function Login() {
  const { status, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === 'loading') return <FullScreen>Loading…</FullScreen>;
  // Already authenticated: let the gate sort out staff-vs-not at the destination.
  if (status === 'signedIn') return <Navigate to="/" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) setError('Those details did not match. Check your email and password.');
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-agro-surface-a10 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="GreenEarth Agro" className="size-12" />
          <div>
            <h1 className="font-agro-heading text-agro-2xl font-bold tracking-tight text-agro-text-primary">
              Staff Console
            </h1>
            <p className="mt-1 font-agro-sans text-agro-sm text-agro-text-muted">
              Sign in with your GreenEarth Agro staff account.
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-xl border border-agro-surface-a40 bg-agro-surface-a0 p-6"
        >
          <label className="flex flex-col gap-1.5">
            <span className="font-agro-sans text-agro-sm font-medium text-agro-text-secondary">
              Email
            </span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2.5 font-agro-sans text-agro-base text-agro-text-primary outline-none transition-colors focus:border-agro-primary-a20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-agro-sans text-agro-sm font-medium text-agro-text-secondary">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2.5 font-agro-sans text-agro-base text-agro-text-primary outline-none transition-colors focus:border-agro-primary-a20"
            />
          </label>

          {error && (
            <p className="font-agro-sans text-agro-sm text-agro-danger-a10" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-agro-primary-a0 px-4 py-2.5 font-agro-sans text-agro-base font-semibold text-agro-text-inverse transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="size-[18px] animate-spin" strokeWidth={2} />
            ) : (
              <Lock className="size-[18px]" strokeWidth={2} />
            )}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
