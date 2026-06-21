import { m } from 'motion/react';
import { useAuth } from '../auth/AuthProvider';
import { fadeUp, staggerContainer, enter } from '../lib/motion';
import { hasPermission, ROLE_LABELS } from '../types/auth';
import type { RolePermissions } from '../types/auth';

// First name only, for a warmer greeting.
function firstName(name: string | null): string {
  if (!name) return 'there';
  return name.split(/[\s@]/)[0] || 'there';
}

interface Capability {
  label: string;
  detail: string;
  permission: keyof RolePermissions;
}

const CAPABILITIES: Capability[] = [
  { label: 'Review loan applications', detail: 'Read and recommend on farmer loan requests.', permission: 'canReviewLoans' },
  { label: 'Approve or reject loans', detail: 'Make the final call on loan applications.', permission: 'canApproveLoans' },
  { label: 'Review land listings', detail: 'Assess land leasing offers from farmers.', permission: 'canReviewLandListings' },
  { label: 'Answer support requests', detail: 'Respond to farmers needing help.', permission: 'canRespondToSupportTickets' },
  { label: 'Manage users', detail: 'View and manage farmer and staff accounts.', permission: 'canManageUsers' },
  { label: 'Assign roles', detail: 'Grant or change staff roles and permissions.', permission: 'canAssignRoles' },
  { label: 'View analytics', detail: 'Registration, loan, and land performance.', permission: 'canViewAnalytics' },
];

export function Dashboard() {
  const { role, fullName } = useAuth();
  if (!role) return null;

  const available = CAPABILITIES.filter((c) => hasPermission(role, c.permission));

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 md:px-10 md:py-10">
      <m.header
        initial={enter.initial}
        animate={enter.animate}
        transition={enter.transition}
        className="border-b border-agro-surface-a40 pb-6"
      >
        <p className="font-agro-sans text-agro-sm font-medium text-agro-primary-a20">
          {ROLE_LABELS[role]}
        </p>
        <h1 className="mt-1 font-agro-heading text-agro-3xl font-bold tracking-tight text-agro-text-primary">
          Welcome back, {firstName(fullName)}.
        </h1>
        <p className="mt-2 font-agro-sans text-agro-base text-agro-text-muted">
          This is the GreenEarth Agro staff console. The sections below are what your role can do;
          the workspaces open from the sidebar as they come online.
        </p>
      </m.header>

      <section className="mt-8">
        <h2 className="font-agro-sans text-agro-sm font-semibold uppercase tracking-wide text-agro-text-muted">
          What you can do
        </h2>
        <m.ul
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mt-4 divide-y divide-agro-surface-a40 overflow-hidden rounded-xl border border-agro-surface-a40 bg-agro-surface-a0"
        >
          {available.map((c) => (
            <m.li variants={fadeUp} key={c.label} className="flex flex-col gap-0.5 px-5 py-4">
              <span className="font-agro-sans text-agro-base font-semibold text-agro-text-primary">
                {c.label}
              </span>
              <span className="font-agro-sans text-agro-sm text-agro-text-muted">{c.detail}</span>
            </m.li>
          ))}
        </m.ul>
      </section>
    </div>
  );
}
