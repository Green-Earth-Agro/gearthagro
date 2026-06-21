import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { UserRound, Loader2, Pencil } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useQuery } from '../../lib/useQuery';
import { enter } from '../../lib/motion';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { Switch } from '../../components/Switch';
import { ROLE_LABELS } from '../../types/auth';
import type { UserPosition, UserRole } from '../../types/auth';
import { getUserDetails, updateUserAccess } from './api';
import { POSITION_LABELS, POSITION_OPTIONS, ROLE_OPTIONS } from './types';
import type { UserDetail as UserDetailType } from './types';

export function UserDetail() {
  const { id = '' } = useParams();
  const { role: viewerRole } = useAuth();
  const canManage = viewerRole === 'super_admin';
  const { data, loading, error, refetch, setData } = useQuery(`user:${id}`, () => getUserDetails(id));

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title={data?.full_name || 'User'}
        back={{ to: '/users', label: 'Users' }}
        actions={
          data ? (
            <StatusPill label={data.is_active ? 'Active' : 'Inactive'} tone={data.is_active ? 'success' : 'muted'} />
          ) : undefined
        }
      />

      <div className="mt-6">
        <QueryBoundary
          loading={loading}
          error={error}
          isEmpty={!data}
          emptyTitle="User not found"
          emptyMessage="It may have been removed."
          onRetry={refetch}
        >
          {data && (
            <ProfileCard
              key={data.user_id}
              user={data}
              canManage={canManage}
              onSaved={(next) => setData((prev) => (prev ? { ...prev, ...next } : prev))}
            />
          )}
        </QueryBoundary>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="font-agro-sans text-agro-xs text-agro-text-muted">{label}</dt>
      <dd className="mt-0.5 font-agro-sans text-agro-sm text-agro-text-primary">{value}</dd>
    </div>
  );
}

// One card that swaps between a read-only profile and inline editing. Super-admins
// get an Edit affordance; Save commits via a silent in-place mutation (no refetch).
function ProfileCard({
  user,
  canManage,
  onSaved,
}: {
  user: UserDetailType;
  canManage: boolean;
  onSaved: (next: { role: UserRole; position: UserPosition; is_active: boolean }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [position, setPosition] = useState<UserPosition>(user.position);
  const [isActive, setIsActive] = useState(user.is_active);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const dirty = role !== user.role || position !== user.position || isActive !== user.is_active;

  const startEdit = () => {
    setRole(user.role);
    setPosition(user.position);
    setIsActive(user.is_active);
    setErr(null);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    setErr(null);
    try {
      await updateUserAccess(user.user_id, { role, position, is_active: isActive });
      onSaved({ role, position, is_active: isActive });
      setEditing(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <m.section
      initial={enter.initial}
      animate={enter.animate}
      transition={enter.transition}
      className="rounded-xl border border-agro-surface-a40 bg-agro-surface-a0 p-6"
    >
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="size-16 rounded-full border border-agro-surface-a30 object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-agro-surface-a20">
            <UserRound size={28} strokeWidth={1.75} className="text-agro-text-muted" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-agro-heading text-agro-xl font-bold text-agro-text-primary">
            {user.full_name || 'Unnamed user'}
          </p>
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="truncate font-agro-sans text-agro-sm text-agro-text-secondary transition-colors hover:text-agro-text-primary"
            >
              {user.email}
            </a>
          )}
        </div>
        {canManage && !editing && (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 font-agro-sans text-agro-sm font-medium text-agro-text-secondary transition-colors hover:bg-agro-surface-a20 hover:text-agro-text-primary"
          >
            <Pencil size={15} strokeWidth={1.75} />
            Edit
          </button>
        )}
      </div>

      <div className="mt-6 border-t border-agro-surface-a30 pt-5">
        <AnimatePresence mode="wait" initial={false}>
          {editing ? (
            <m.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-4"
            >
              <Field label="Role">
                <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={selectClass}>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Position">
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as UserPosition)}
                  className={selectClass}
                >
                  {POSITION_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {POSITION_LABELS[p]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Active">
                <Switch checked={isActive} onChange={setIsActive} label="Active" />
              </Field>

              {err && <p className="font-agro-sans text-agro-sm text-agro-danger-a10">{err}</p>}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={!dirty || saving}
                  onClick={save}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-agro-primary-a0 px-4 py-2.5 font-agro-sans text-agro-sm font-semibold text-agro-text-inverse transition-opacity hover:opacity-95 disabled:opacity-50"
                >
                  {saving && <Loader2 className="size-4 animate-spin" strokeWidth={2} />}
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-agro-surface-a40 px-4 py-2.5 font-agro-sans text-agro-sm font-medium text-agro-text-secondary transition-colors hover:bg-agro-surface-a20 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </m.div>
          ) : (
            <m.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                <Fact label="Role" value={ROLE_LABELS[user.role] ?? user.role} />
                <Fact label="Position" value={POSITION_LABELS[user.position] ?? user.position} />
                <Fact label="Status" value={user.is_active ? 'Active' : 'Inactive'} />
              </dl>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.section>
  );
}

const selectClass =
  'rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-agro-sans text-agro-sm text-agro-text-secondary">{label}</span>
      {children}
    </div>
  );
}

