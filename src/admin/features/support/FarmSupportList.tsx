import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { Sprout, Users, MessageCircle } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { fadeUp, staggerContainer } from '../../lib/motion';
import { useQuery } from '../../lib/useQuery';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { formatDate } from '../../lib/format';
import { listRequests } from './api';
import {
  CATEGORY_LABELS,
  SUPPORT_STATUS_LABELS,
  STATUS_TONE,
  farmerLabel,
  isOpenSupportStatus,
  summaryLabel,
} from './types';
import type { AdminSupportRequest, SupportCategory } from './types';

export const CATEGORY_ICON: Record<SupportCategory, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  inputs: Sprout,
  labour: Users,
  advice: MessageCircle,
};

type Filter = 'open' | 'all' | 'closed';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'all', label: 'All' },
  { value: 'closed', label: 'Closed' },
];

function matchesFilter(req: AdminSupportRequest, filter: Filter): boolean {
  if (filter === 'all') return true;
  return filter === 'open' ? isOpenSupportStatus(req.status) : !isOpenSupportStatus(req.status);
}

export function FarmSupportList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('open');
  const { data, loading, error, refetch } = useQuery('farm-support', listRequests);

  const requests = useMemo(() => data ?? [], [data]);
  const visible = useMemo(() => requests.filter((r) => matchesFilter(r, filter)), [requests, filter]);
  const openCount = useMemo(() => requests.filter((r) => isOpenSupportStatus(r.status)).length, [requests]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title="Farm Support"
        subtitle="Review requests for inputs, labour, and advice, then arrange the help."
      />

      <div className="mt-6 flex items-center gap-2">
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={[
                'rounded-full px-3.5 py-1.5 font-agro-sans text-agro-sm font-medium transition-colors',
                active
                  ? 'bg-agro-surface-a20 text-agro-text-primary'
                  : 'border border-agro-surface-a40 text-agro-text-secondary hover:bg-agro-surface-a20',
              ].join(' ')}
            >
              {label}
              {value === 'open' && openCount > 0 && (
                <span className={active ? 'ml-1.5 opacity-80' : 'ml-1.5 text-agro-text-muted'}>
                  {openCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <QueryBoundary
          loading={loading}
          error={error}
          isEmpty={visible.length === 0}
          emptyTitle={filter === 'open' ? 'No open requests' : 'No requests'}
          emptyMessage={
            filter === 'open'
              ? 'New support requests from farmers will show up here.'
              : 'Nothing matches this filter yet.'
          }
          onRetry={refetch}
        >
          <div className="overflow-hidden rounded-xl border border-agro-surface-a40">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-agro-surface-a40 bg-agro-surface-a0 text-left">
                  <Th>Farmer</Th>
                  <Th>Category</Th>
                  <Th className="hidden md:table-cell">Request</Th>
                  <Th>Status</Th>
                  <Th className="hidden sm:table-cell">Submitted</Th>
                </tr>
              </thead>
              <m.tbody key={filter} variants={staggerContainer} initial="hidden" animate="show">
                {visible.map((req) => {
                  const Icon = CATEGORY_ICON[req.category];
                  return (
                    <m.tr
                      key={req.id}
                      variants={fadeUp}
                      onClick={() => navigate(req.id)}
                      className="cursor-pointer border-b border-agro-surface-a30 bg-agro-surface-a0 transition-colors last:border-b-0 hover:bg-agro-surface-a10"
                    >
                      <Td>
                        <span className="font-agro-sans text-agro-sm font-semibold text-agro-text-primary">
                          {farmerLabel(req)}
                        </span>
                      </Td>
                      <Td>
                        <span className="inline-flex items-center gap-1.5 text-agro-text-secondary">
                          <Icon size={15} strokeWidth={1.75} />
                          {CATEGORY_LABELS[req.category]}
                        </span>
                      </Td>
                      <Td className="hidden md:table-cell text-agro-text-muted">
                        <span className="line-clamp-1">{summaryLabel(req)}</span>
                      </Td>
                      <Td>
                        <StatusPill label={SUPPORT_STATUS_LABELS[req.status]} tone={STATUS_TONE[req.status]} />
                      </Td>
                      <Td className="hidden sm:table-cell text-agro-text-muted">
                        {formatDate(req.created_at)}
                      </Td>
                    </m.tr>
                  );
                })}
              </m.tbody>
            </table>
          </div>
        </QueryBoundary>
      </div>
    </div>
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
