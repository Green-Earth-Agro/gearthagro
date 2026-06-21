import { useMemo, useState } from 'react';
import { ShieldX } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useQuery } from '../../lib/useQuery';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { Switch } from '../../components/Switch';
import { formatDateTime } from '../../lib/format';
import { getAudit, getMatrix, setPermission } from './api';
import { ROLE_COLUMNS } from './types';
import type { PermissionDef, RoleName } from './types';

const roleLabel = (role: string): string => ROLE_COLUMNS.find((c) => c.role === role)?.label ?? role;

export function AccessControl() {
  const { role: viewerRole, user } = useAuth();

  if (viewerRole !== 'super_admin') {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
        <PageHeader title="Access Control" />
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <ShieldX className="size-9 text-agro-text-muted" strokeWidth={1.75} />
          <p className="font-agro-sans text-agro-base font-semibold text-agro-text-primary">Super admin only</p>
          <p className="max-w-sm font-agro-sans text-agro-sm text-agro-text-muted">
            Only a super admin can view and change the permission matrix.
          </p>
        </div>
      </div>
    );
  }

  return <Matrix userId={user?.id ?? null} />;
}

function Matrix({ userId }: { userId: string | null }) {
  const matrix = useQuery('access-matrix', getMatrix);
  const audit = useQuery('access-audit', () => getAudit(20));
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const groups = useMemo(() => {
    const perms = matrix.data?.permissions ?? [];
    const map = new Map<string, PermissionDef[]>();
    for (const p of perms) {
      const arr = map.get(p.category);
      if (arr) arr.push(p);
      else map.set(p.category, [p]);
    }
    return [...map.entries()];
  }, [matrix.data]);

  const setVal = (role: RoleName, key: string, val: boolean) =>
    matrix.setData((prev) =>
      prev ? { ...prev, values: { ...prev.values, [role]: { ...prev.values[role], [key]: val } } } : prev,
    );

  const toggle = async (role: RoleName, key: string, current: boolean) => {
    if (role === 'super_admin') return; // ceiling role is read-only here
    const next = !current;
    const id = `${role}:${key}`;
    setBusyKey(id);
    setErr(null);
    setVal(role, key, next); // optimistic
    try {
      await setPermission(role, key, next, userId);
      audit.refetch();
    } catch (e) {
      setVal(role, key, current); // revert
      setErr(e instanceof Error ? e.message : 'Could not save the change.');
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title="Access Control"
        subtitle="The permission each role is granted. Super admin is the ceiling and stays read-only."
      />

      {err && (
        <p className="mt-4 rounded-lg border border-agro-danger-a10 bg-agro-danger-a20 px-3 py-2 font-agro-sans text-agro-sm text-agro-danger-a0">
          {err}
        </p>
      )}

      <div className="mt-6">
        <QueryBoundary
          loading={matrix.loading}
          error={matrix.error}
          isEmpty={(matrix.data?.permissions.length ?? 0) === 0}
          emptyTitle="No permissions"
          emptyMessage="The permission matrix has not been seeded."
          onRetry={matrix.refetch}
        >
          <div className="overflow-x-auto rounded-xl border border-agro-surface-a40">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-agro-surface-a40 bg-agro-surface-a0 text-left">
                  <th className="px-4 py-3 font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted">
                    Permission
                  </th>
                  {ROLE_COLUMNS.map((c) => (
                    <th
                      key={c.role}
                      className="px-4 py-3 text-center font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted"
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              {groups.map(([category, perms]) => (
                <tbody key={category}>
                  <tr className="bg-agro-surface-a10">
                    <td
                      colSpan={ROLE_COLUMNS.length + 1}
                      className="px-4 py-2 font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-secondary"
                    >
                      {category}
                    </td>
                  </tr>
                  {perms.map((p) => (
                    <tr key={p.key} className="border-t border-agro-surface-a30 bg-agro-surface-a0">
                      <td className="px-4 py-3 align-top">
                        <p className="font-agro-sans text-agro-sm font-medium text-agro-text-primary">{p.label}</p>
                        {p.description && (
                          <p className="font-agro-sans text-agro-xs text-agro-text-muted">{p.description}</p>
                        )}
                      </td>
                      {ROLE_COLUMNS.map((c) => {
                        const checked = matrix.data?.values[c.role]?.[p.key] ?? false;
                        const id = `${c.role}:${p.key}`;
                        return (
                          <td key={c.role} className="px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <Switch
                                checked={checked}
                                disabled={c.role === 'super_admin' || busyKey === id}
                                onChange={() => toggle(c.role, p.key, checked)}
                                label={`${p.label} for ${c.label}`}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </QueryBoundary>
      </div>

      {/* ── Audit trail ── */}
      <section className="mt-8">
        <h2 className="font-agro-sans text-agro-sm font-semibold uppercase tracking-wide text-agro-text-muted">
          Recent changes
        </h2>
        <div className="mt-3">
          <QueryBoundary
            loading={audit.loading}
            error={audit.error}
            isEmpty={(audit.data?.length ?? 0) === 0}
            emptyTitle="No changes yet"
            emptyMessage="Permission changes will be logged here."
            onRetry={audit.refetch}
          >
            <ul className="divide-y divide-agro-surface-a30 overflow-hidden rounded-xl border border-agro-surface-a40 bg-agro-surface-a0">
              {audit.data?.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="font-agro-sans text-agro-sm text-agro-text-primary">
                    {e.change_type === 'updated'
                      ? `${e.new_value ? 'Enabled' : 'Disabled'} ${e.permission_label || e.permission_key}`
                      : `${e.change_type} ${e.permission_label || e.permission_key}`}
                    <span className="text-agro-text-muted"> · {roleLabel(e.role_name)}</span>
                  </span>
                  <span className="shrink-0 font-agro-sans text-agro-xs text-agro-text-muted">
                    {formatDateTime(e.changed_at)}
                  </span>
                </li>
              ))}
            </ul>
          </QueryBoundary>
        </div>
      </section>
    </div>
  );
}
