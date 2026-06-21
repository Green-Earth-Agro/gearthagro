import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { Search } from 'lucide-react';
import { fadeUp, staggerContainer, enter } from '../../lib/motion';
import { useQuery } from '../../lib/useQuery';
import { useDebounced } from '../../lib/useDebounced';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { ROLE_LABELS } from '../../types/auth';
import type { UserPosition, UserRole } from '../../types/auth';
import { getAnalytics, getRegistrations, searchUsers } from './api';
import { POSITION_LABELS, ROLE_OPTIONS } from './types';
import type { SearchParams, UserRow } from './types';

const PAGE_SIZE = 10;

export function UsersWorkspace() {
  const navigate = useNavigate();
  const analytics = useQuery('user-analytics', getAnalytics);
  const registrations = useQuery('user-registrations', getRegistrations);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 300);
  const [role, setRole] = useState<UserRole | ''>('');
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, isActive]);

  // Position isn't a filter — the list is grouped by it instead.
  const params: SearchParams = { search: debouncedSearch, role, position: '', isActive, page, pageSize: PAGE_SIZE };
  const users = useQuery(`users:${JSON.stringify(params)}`, () => searchUsers(params));

  const groups = useMemo(() => {
    const rows = users.data?.users ?? [];
    return [
      { key: 'farmer', label: 'Farmers', rows: rows.filter((u) => u.position === 'farmer') },
      { key: 'staff', label: 'Staff', rows: rows.filter((u) => u.position === 'staff') },
    ].filter((g) => g.rows.length > 0);
  }, [users.data]);

  const total = users.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader title="Users" subtitle="Who is on GreenEarth Agro, and how the base is growing." />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Overview" delay={0}>
          <QueryBoundary loading={analytics.loading} error={analytics.error} onRetry={analytics.refetch}>
            {analytics.data && (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-agro-heading text-agro-3xl font-bold text-agro-text-primary">
                    {analytics.data.total_users.toLocaleString()}
                  </span>
                  <span className="font-agro-sans text-agro-sm text-agro-text-muted">total users</span>
                </div>
                <div className="mt-1 flex gap-4 font-agro-sans text-agro-sm text-agro-text-muted">
                  <span>{analytics.data.active_users.toLocaleString()} active</span>
                  <span>{analytics.data.inactive_users.toLocaleString()} inactive</span>
                </div>

                <Breakdown
                  title="By role"
                  data={analytics.data.users_by_role}
                  label={(k) => ROLE_LABELS[k as UserRole] ?? k}
                />
                <Breakdown
                  title="By position"
                  data={analytics.data.users_by_position}
                  label={(k) => POSITION_LABELS[k as UserPosition] ?? k}
                />
              </div>
            )}
          </QueryBoundary>
        </Card>

        <Card title="Registrations" delay={0.06}>
          <QueryBoundary
            loading={registrations.loading}
            error={registrations.error}
            isEmpty={(registrations.data?.length ?? 0) === 0}
            emptyTitle="No registration data"
            onRetry={registrations.refetch}
          >
            {registrations.data && <RegistrationChart points={registrations.data} />}
          </QueryBoundary>
        </Card>
      </div>

      {/* ── Filters ── */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-agro-text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full rounded-lg border border-agro-surface-a40 bg-agro-surface-a0 py-2 pl-9 pr-3 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20"
          />
        </div>
        <Select value={role} onChange={(v) => setRole(v as UserRole | '')} label="Role">
          <option value="">All roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </Select>
        <Select
          value={isActive === null ? '' : isActive ? 'active' : 'inactive'}
          onChange={(v) => setIsActive(v === '' ? null : v === 'active')}
          label="Status"
        >
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {/* ── User list ── */}
      <div className="mt-4">
        <QueryBoundary
          loading={users.loading}
          error={users.error}
          isEmpty={(users.data?.users.length ?? 0) === 0}
          emptyTitle="No users found"
          emptyMessage="Try a different search or filter."
          onRetry={users.refetch}
        >
          <div className="flex flex-col gap-6">
            {groups.map((group) => {
              const incomplete = group.rows.filter((u) => !u.profileComplete).length;
              return (
                <div key={group.key}>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-agro-sans text-agro-sm font-semibold text-agro-text-primary">
                      {group.label}
                    </h3>
                    <span className="font-agro-sans text-agro-xs text-agro-text-muted">{group.rows.length}</span>
                    {incomplete > 0 && (
                      <span className="rounded-full bg-agro-warning-a20 px-2 py-0.5 font-agro-sans text-agro-xs font-medium text-agro-warning-a0">
                        {incomplete} incomplete {incomplete === 1 ? 'profile' : 'profiles'}
                      </span>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-xl border border-agro-surface-a40">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-agro-surface-a40 bg-agro-surface-a0 text-left">
                          <Th>User</Th>
                          <Th className="hidden sm:table-cell">Role</Th>
                          <Th>Status</Th>
                        </tr>
                      </thead>
                      <m.tbody key={`${group.key}-${page}`} variants={staggerContainer} initial="hidden" animate="show">
                        {group.rows.map((u) => (
                          <UserRowItem key={u.user_id} user={u} onClick={() => navigate(u.user_id)} />
                        ))}
                      </m.tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="font-agro-sans text-agro-xs text-agro-text-muted">
              {rangeStart}–{rangeEnd} of {total.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <PageButton disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </PageButton>
              <span className="font-agro-sans text-agro-xs text-agro-text-muted">
                Page {page} of {pageCount}
              </span>
              <PageButton disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>
                Next
              </PageButton>
            </div>
          </div>
        </QueryBoundary>
      </div>
    </div>
  );
}

function UserRowItem({ user, onClick }: { user: UserRow; onClick: () => void }) {
  return (
    <m.tr
      variants={fadeUp}
      onClick={onClick}
      className="cursor-pointer border-b border-agro-surface-a30 bg-agro-surface-a0 transition-colors last:border-b-0 hover:bg-agro-surface-a10"
    >
      <Td>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-agro-sans text-agro-sm font-semibold text-agro-text-primary">
            {user.full_name || 'Unnamed'}
          </span>
          {!user.profileComplete && (
            <span className="rounded-full bg-agro-warning-a20 px-2 py-0.5 font-agro-sans text-agro-xs font-medium text-agro-warning-a0">
              Incomplete profile
            </span>
          )}
        </div>
        <span className="block font-agro-sans text-agro-xs text-agro-text-muted">
          {user.email || user.phone || '—'}
        </span>
      </Td>
      <Td className="hidden sm:table-cell text-agro-text-secondary">{ROLE_LABELS[user.role]}</Td>
      <Td>
        <StatusPill label={user.is_active ? 'Active' : 'Inactive'} tone={user.is_active ? 'success' : 'muted'} />
      </Td>
    </m.tr>
  );
}

function Card({ title, children, delay = 0 }: { title: string; children: ReactNode; delay?: number }) {
  return (
    <m.section
      initial={enter.initial}
      animate={enter.animate}
      transition={{ ...enter.transition, delay }}
      className="rounded-xl border border-agro-surface-a40 bg-agro-surface-a0 p-5"
    >
      <h2 className="font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </m.section>
  );
}

function Breakdown({
  title,
  data,
  label,
}: {
  title: string;
  data: Record<string, number>;
  label: (key: string) => string;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  if (entries.length === 0) return null;
  return (
    <div className="mt-4 border-t border-agro-surface-a30 pt-3">
      <p className="font-agro-sans text-agro-xs text-agro-text-muted">{title}</p>
      <div className="mt-2 flex flex-col gap-1.5">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-24 shrink-0 font-agro-sans text-agro-sm text-agro-text-secondary">
              {label(key)}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-agro-surface-a20">
              <div
                className="h-full rounded-full bg-agro-primary-a0"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right font-agro-sans text-agro-sm tabular-nums text-agro-text-primary">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationChart({ points }: { points: { month: string; count: number }[] }) {
  const recent = points.slice(-12);
  const max = Math.max(1, ...recent.map((p) => p.count));
  return (
    <div className="flex h-40 items-end gap-1.5">
      {recent.map((p) => (
        <div key={p.month} className="flex flex-1 flex-col items-center gap-1.5" title={`${p.month}: ${p.count}`}>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t bg-agro-primary-a0"
              style={{ height: `${Math.max(2, (p.count / max) * 100)}%` }}
            />
          </div>
          <span className="font-agro-sans text-[10px] text-agro-text-muted">{p.month.slice(-2)}</span>
        </div>
      ))}
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-agro-surface-a40 bg-agro-surface-a0 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-secondary outline-none focus:border-agro-primary-a20"
    >
      {children}
    </select>
  );
}

function PageButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-agro-surface-a40 px-3 py-1.5 font-agro-sans text-agro-xs font-medium text-agro-text-secondary transition-colors hover:bg-agro-surface-a20 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 font-agro-sans text-agro-sm text-agro-text-primary ${className}`}>
      {children}
    </td>
  );
}
