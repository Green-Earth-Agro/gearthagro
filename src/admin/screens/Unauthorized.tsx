import { ShieldX } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

// Signed in, but not a staff role. Honest dead-end with a way back out.
export function Unauthorized() {
  const { fullName, signOut } = useAuth();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-agro-surface-a10 px-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <ShieldX className="size-10 text-agro-text-muted" strokeWidth={1.75} />
        <div>
          <h1 className="font-agro-heading text-agro-xl font-bold text-agro-text-primary">
            No console access
          </h1>
          <p className="mt-2 font-agro-sans text-agro-sm text-agro-text-muted">
            {fullName ? `You're signed in as ${fullName}, but this` : 'This'} account isn't a
            GreenEarth Agro staff member. If that's wrong, ask a super admin to grant you a role.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-lg border border-agro-surface-a40 px-4 py-2 font-agro-sans text-agro-sm font-medium text-agro-text-secondary transition-colors hover:bg-agro-surface-a20"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
