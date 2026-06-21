import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeUp, staggerContainer } from '../../lib/motion';
import { useQuery } from '../../lib/useQuery';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { formatDate } from '../../lib/format';
import { listOffers } from './api';
import {
  AVAILABILITY_LABELS,
  LAND_STATUS_LABELS,
  STATUS_TONE,
  farmerLabel,
  isOpenLandStatus,
  sizeLabel,
} from './types';
import type { AdminLandOffer } from './types';

type Filter = 'open' | 'all' | 'closed';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'all', label: 'All' },
  { value: 'closed', label: 'Closed' },
];

function matchesFilter(offer: AdminLandOffer, filter: Filter): boolean {
  if (filter === 'all') return true;
  return filter === 'open' ? isOpenLandStatus(offer.status) : !isOpenLandStatus(offer.status);
}

export function LandOffersList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('open');
  const { data, loading, error, refetch } = useQuery('land-offers', listOffers);

  const offers = useMemo(() => data ?? [], [data]);
  const visible = useMemo(() => offers.filter((o) => matchesFilter(o, filter)), [offers, filter]);
  const openCount = useMemo(() => offers.filter((o) => isOpenLandStatus(o.status)).length, [offers]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title="Land Offers"
        subtitle="Review land offered by farmers, plan visits, and agree lease terms."
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
          emptyTitle={filter === 'open' ? 'No open offers' : 'No offers'}
          emptyMessage={
            filter === 'open'
              ? 'New land offers from farmers will show up here.'
              : 'Nothing matches this filter yet.'
          }
          onRetry={refetch}
        >
          <div className="overflow-hidden rounded-xl border border-agro-surface-a40">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-agro-surface-a40 bg-agro-surface-a0 text-left">
                  <Th>Farmer</Th>
                  <Th>Size</Th>
                  <Th className="hidden md:table-cell">Location</Th>
                  <Th className="hidden lg:table-cell">Availability</Th>
                  <Th>Status</Th>
                  <Th className="hidden sm:table-cell">Submitted</Th>
                </tr>
              </thead>
              <m.tbody key={filter} variants={staggerContainer} initial="hidden" animate="show">
                {visible.map((offer) => (
                  <m.tr
                    key={offer.id}
                    variants={fadeUp}
                    onClick={() => navigate(offer.id)}
                    className="cursor-pointer border-b border-agro-surface-a30 bg-agro-surface-a0 transition-colors last:border-b-0 hover:bg-agro-surface-a10"
                  >
                    <Td>
                      <span className="font-agro-sans text-agro-sm font-semibold text-agro-text-primary">
                        {farmerLabel(offer)}
                      </span>
                    </Td>
                    <Td>{sizeLabel(offer)}</Td>
                    <Td className="hidden md:table-cell text-agro-text-muted">
                      <span className="line-clamp-1">{offer.location}</span>
                    </Td>
                    <Td className="hidden lg:table-cell text-agro-text-muted">
                      {AVAILABILITY_LABELS[offer.availability]}
                    </Td>
                    <Td>
                      <StatusPill label={LAND_STATUS_LABELS[offer.status]} tone={STATUS_TONE[offer.status]} />
                    </Td>
                    <Td className="hidden sm:table-cell text-agro-text-muted">
                      {formatDate(offer.created_at)}
                    </Td>
                  </m.tr>
                ))}
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
