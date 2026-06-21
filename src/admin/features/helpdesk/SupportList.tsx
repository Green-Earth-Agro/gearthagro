import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { Search } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../lib/motion';
import { useQuery } from '../../lib/useQuery';
import { useDebounced } from '../../lib/useDebounced';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { formatDate } from '../../lib/format';
import { getStats, listTickets, TICKETS_PAGE_SIZE } from './api';
import { PRIORITY_LABELS, PRIORITY_TONE, STATUS_LABELS, STATUS_OPTIONS, STATUS_TONE } from './types';
import type { TicketStatus } from './types';

const FILTERS: { value: TicketStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  ...STATUS_OPTIONS.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
];

export function SupportList() {
  const navigate = useNavigate();
  const stats = useQuery('ticket-stats', getStats);
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 300);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

  const params = { status, search: debouncedSearch, page };
  const tickets = useQuery(`tickets:${JSON.stringify(params)}`, () => listTickets(params));

  const total = tickets.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / TICKETS_PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * TICKETS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * TICKETS_PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader title="Support" subtitle="Help-desk tickets from the app." />

      {stats.data && (
        <p className="mt-4 font-agro-sans text-agro-sm text-agro-text-muted">
          <span className="text-agro-text-primary">{stats.data.open}</span> open
          {' · '}
          <span className={stats.data.awaiting > 0 ? 'text-agro-warning-a10' : ''}>
            {stats.data.awaiting} awaiting reply
          </span>
          {' · '}
          <span className={stats.data.urgent > 0 ? 'text-agro-danger-a10' : ''}>{stats.data.urgent} urgent</span>
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {FILTERS.map(({ value, label }) => {
          const active = status === value;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setStatus(value)}
              className={[
                'rounded-full px-3.5 py-1.5 font-agro-sans text-agro-sm font-medium transition-colors',
                active
                  ? 'bg-agro-surface-a20 text-agro-text-primary'
                  : 'border border-agro-surface-a40 text-agro-text-secondary hover:bg-agro-surface-a20',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-3">
        <Search
          size={16}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-agro-text-muted"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subject, email, or ticket number…"
          className="w-full rounded-lg border border-agro-surface-a40 bg-agro-surface-a0 py-2 pl-9 pr-3 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20"
        />
      </div>

      <div className="mt-4">
        <QueryBoundary
          loading={tickets.loading}
          error={tickets.error}
          isEmpty={(tickets.data?.tickets.length ?? 0) === 0}
          emptyTitle="No tickets"
          emptyMessage="Nothing matches this filter yet."
          onRetry={tickets.refetch}
        >
          <div className="overflow-hidden rounded-xl border border-agro-surface-a40">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-agro-surface-a40 bg-agro-surface-a0 text-left">
                  <Th>Ticket</Th>
                  <Th className="hidden sm:table-cell">Priority</Th>
                  <Th>Status</Th>
                  <Th className="hidden md:table-cell">Updated</Th>
                </tr>
              </thead>
              <m.tbody key={JSON.stringify(params)} variants={staggerContainer} initial="hidden" animate="show">
                {tickets.data?.tickets.map((t) => (
                  <m.tr
                    key={t.id}
                    variants={fadeUp}
                    onClick={() => navigate(t.id)}
                    className="cursor-pointer border-b border-agro-surface-a30 bg-agro-surface-a0 transition-colors last:border-b-0 hover:bg-agro-surface-a10"
                  >
                    <Td>
                      <span className="font-agro-sans text-agro-sm font-semibold text-agro-text-primary">
                        {t.subject}
                      </span>
                      <span className="block font-agro-sans text-agro-xs text-agro-text-muted">
                        {t.ticket_number} · {t.email}
                      </span>
                      {t.last_reply_by === 'user' && t.status !== 'closed' && (
                        <span className="mt-0.5 inline-block font-agro-sans text-agro-xs font-medium text-agro-warning-a10">
                          Awaiting your reply
                        </span>
                      )}
                    </Td>
                    <Td className="hidden sm:table-cell">
                      <StatusPill label={PRIORITY_LABELS[t.priority]} tone={PRIORITY_TONE[t.priority]} />
                    </Td>
                    <Td>
                      <StatusPill label={STATUS_LABELS[t.status]} tone={STATUS_TONE[t.status]} />
                    </Td>
                    <Td className="hidden md:table-cell text-agro-text-muted">{formatDate(t.updated_at)}</Td>
                  </m.tr>
                ))}
              </m.tbody>
            </table>
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

function PageButton({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: ReactNode }) {
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
    <td className={`px-4 py-3 font-agro-sans text-agro-sm text-agro-text-primary ${className}`}>{children}</td>
  );
}
