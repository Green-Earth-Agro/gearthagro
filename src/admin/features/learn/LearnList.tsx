import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { fadeUp, staggerContainer } from '../../lib/motion';
import { useQuery } from '../../lib/useQuery';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { formatDate } from '../../lib/format';
import { listArticles } from './api';
import { TOPIC_LABELS } from './types';
import type { LearnArticle } from './types';

type Filter = 'all' | 'published' | 'drafts';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'drafts', label: 'Drafts' },
];

function matchesFilter(a: LearnArticle, filter: Filter): boolean {
  if (filter === 'all') return true;
  return filter === 'published' ? a.is_published : !a.is_published;
}

export function LearnList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const { data, loading, error, refetch } = useQuery('learn-articles', listArticles);

  const articles = useMemo(() => data ?? [], [data]);
  const visible = useMemo(() => articles.filter((a) => matchesFilter(a, filter)), [articles, filter]);
  const draftCount = useMemo(() => articles.filter((a) => !a.is_published).length, [articles]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title="Learn Articles"
        subtitle="Write and publish practical advice for farmers."
        actions={
          <button
            type="button"
            onClick={() => navigate('new')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-agro-primary-a0 px-3.5 py-2 font-agro-sans text-agro-sm font-semibold text-agro-text-inverse transition-opacity hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2} />
            New article
          </button>
        }
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
              {value === 'drafts' && draftCount > 0 && (
                <span className={active ? 'ml-1.5 opacity-80' : 'ml-1.5 text-agro-text-muted'}>{draftCount}</span>
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
          emptyTitle={filter === 'drafts' ? 'No drafts' : 'No articles yet'}
          emptyMessage="Write your first piece of advice for farmers."
          onRetry={refetch}
        >
          <div className="overflow-hidden rounded-xl border border-agro-surface-a40">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-agro-surface-a40 bg-agro-surface-a0 text-left">
                  <Th>Title</Th>
                  <Th className="hidden sm:table-cell">Topic</Th>
                  <Th>Status</Th>
                  <Th className="hidden md:table-cell">Updated</Th>
                </tr>
              </thead>
              <m.tbody key={filter} variants={staggerContainer} initial="hidden" animate="show">
                {visible.map((a) => (
                  <m.tr
                    key={a.id}
                    variants={fadeUp}
                    onClick={() => navigate(a.id)}
                    className="cursor-pointer border-b border-agro-surface-a30 bg-agro-surface-a0 transition-colors last:border-b-0 hover:bg-agro-surface-a10"
                  >
                    <Td>
                      <span className="font-agro-sans text-agro-sm font-semibold text-agro-text-primary">
                        {a.title}
                      </span>
                      <span className="block font-agro-sans text-agro-xs text-agro-text-muted line-clamp-1">
                        {a.summary}
                      </span>
                    </Td>
                    <Td className="hidden sm:table-cell text-agro-text-secondary">{TOPIC_LABELS[a.topic]}</Td>
                    <Td>
                      <StatusPill
                        label={a.is_published ? 'Published' : 'Draft'}
                        tone={a.is_published ? 'success' : 'muted'}
                      />
                    </Td>
                    <Td className="hidden md:table-cell text-agro-text-muted">{formatDate(a.updated_at)}</Td>
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
    <td className={`px-4 py-3 font-agro-sans text-agro-sm text-agro-text-primary ${className}`}>{children}</td>
  );
}
