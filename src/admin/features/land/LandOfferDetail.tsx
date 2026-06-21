import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useQuery } from '../../lib/useQuery';
import { enter } from '../../lib/motion';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { formatDate, formatDateTime, formatMoney } from '../../lib/format';
import { getOffer, updateOffer } from './api';
import {
  AVAILABILITY_LABELS,
  LAND_STATUS_LABELS,
  STATUS_TONE,
  farmerLabel,
  sizeLabel,
} from './types';
import type { AdminLandOffer, LandOfferStatus, LandPatch } from './types';

type ActionKind = 'plan_visit' | 'offer_terms' | 'activate' | 'end_agreement' | 'cancel';

interface ActionDef {
  kind: ActionKind;
  label: string;
  input: 'date' | 'terms' | 'agreement' | 'confirm';
  confirmNote?: string;
  danger?: boolean;
}

const ACTIONS_BY_STATUS: Record<LandOfferStatus, ActionDef[]> = {
  received: [
    { kind: 'plan_visit', label: 'Plan a visit', input: 'date' },
    { kind: 'offer_terms', label: 'Offer lease terms', input: 'terms' },
    { kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true },
  ],
  visit_planned: [
    { kind: 'offer_terms', label: 'Offer lease terms', input: 'terms' },
    { kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true },
  ],
  terms_offered: [{ kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true }],
  accepted: [
    { kind: 'activate', label: 'Start the agreement', input: 'agreement' },
    { kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true },
  ],
  active: [
    {
      kind: 'end_agreement',
      label: 'End the agreement',
      input: 'confirm',
      confirmNote: 'Mark this lease as ended.',
    },
  ],
  declined: [],
  ended: [],
  cancelled: [],
};

export function LandOfferDetail() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(`land-offer:${id}`, () => getOffer(id));

  const offer = data?.offer ?? null;
  const events = data?.events ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title={offer ? `Land · ${sizeLabel(offer)}` : 'Land offer'}
        back={{ to: '/land-offers', label: 'Land Offers' }}
        actions={offer ? <StatusPill label={LAND_STATUS_LABELS[offer.status]} tone={STATUS_TONE[offer.status]} /> : undefined}
      />

      <div className="mt-6">
        <QueryBoundary
          loading={loading}
          error={error}
          isEmpty={!offer}
          emptyTitle="Offer not found"
          emptyMessage="It may have been removed."
          onRetry={refetch}
        >
          {offer && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <FarmerCard offer={offer} delay={0} />
                <OfferFactsCard offer={offer} delay={0.06} />
                <TimelineCard events={events} delay={0.12} />
              </div>
              <ActionPanel offer={offer} agentId={user?.id ?? null} onDone={refetch} />
            </div>
          )}
        </QueryBoundary>
      </div>
    </div>
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

function FarmerCard({ offer, delay }: { offer: AdminLandOffer; delay?: number }) {
  return (
    <Card title="Farmer" delay={delay}>
      <p className="font-agro-sans text-agro-lg font-semibold text-agro-text-primary">
        {farmerLabel(offer)}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {offer.farmer_phone && (
          <a
            href={`tel:${offer.farmer_phone}`}
            className="inline-flex items-center gap-2 font-agro-sans text-agro-sm text-agro-text-secondary transition-colors hover:text-agro-text-primary"
          >
            <Phone size={16} strokeWidth={1.75} />
            {offer.farmer_phone}
          </a>
        )}
        {offer.farmer_email && (
          <a
            href={`mailto:${offer.farmer_email}`}
            className="inline-flex items-center gap-2 font-agro-sans text-agro-sm text-agro-text-secondary transition-colors hover:text-agro-text-primary"
          >
            <Mail size={16} strokeWidth={1.75} />
            {offer.farmer_email}
          </a>
        )}
        <p className="inline-flex items-center gap-2 font-agro-sans text-agro-sm text-agro-text-secondary">
          <MapPin size={16} strokeWidth={1.75} />
          {offer.location}
        </p>
      </div>
    </Card>
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

function OfferFactsCard({ offer, delay }: { offer: AdminLandOffer; delay?: number }) {
  const agreement =
    offer.agreement_start || offer.agreement_end
      ? `${formatDate(offer.agreement_start)} – ${formatDate(offer.agreement_end)}`
      : '—';
  return (
    <Card title="Land" delay={delay}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
        <Fact label="Size" value={sizeLabel(offer)} />
        <Fact label="Availability" value={AVAILABILITY_LABELS[offer.availability]} />
        <Fact
          label="Terms"
          value={
            offer.terms_amount != null
              ? `${formatMoney(offer.terms_amount, offer.currency)}${offer.terms_text ? ` · ${offer.terms_text}` : ''}`
              : '—'
          }
        />
        <Fact label="Visit" value={formatDate(offer.visit_date)} />
        <Fact label="Agreement" value={agreement} />
        <Fact label="Submitted" value={formatDate(offer.created_at)} />
      </dl>
      {offer.note && (
        <div className="mt-4 border-t border-agro-surface-a30 pt-3">
          <p className="font-agro-sans text-agro-xs text-agro-text-muted">Note from farmer</p>
          <p className="mt-1 font-agro-sans text-agro-sm text-agro-text-primary">{offer.note}</p>
        </div>
      )}
    </Card>
  );
}

function TimelineCard({
  events,
  delay,
}: {
  events: { id: string; status: string; created_at: string }[];
  delay?: number;
}) {
  return (
    <Card title="History" delay={delay}>
      {events.length === 0 ? (
        <p className="font-agro-sans text-agro-sm text-agro-text-muted">No history yet.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {events.map((e) => (
            <li key={e.id} className="flex items-start gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-agro-primary-a0" />
              <div>
                <p className="font-agro-sans text-agro-sm font-medium text-agro-text-primary">
                  {LAND_STATUS_LABELS[e.status as LandOfferStatus] ?? e.status}
                </p>
                <p className="font-agro-sans text-agro-xs text-agro-text-muted">
                  {formatDateTime(e.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

function ActionPanel({
  offer,
  agentId,
  onDone,
}: {
  offer: AdminLandOffer;
  agentId: string | null;
  onDone: () => void;
}) {
  const actions = ACTIONS_BY_STATUS[offer.status];
  const [active, setActive] = useState<ActionDef | null>(null);
  const [dateValue, setDateValue] = useState('');
  const [amount, setAmount] = useState('');
  const [termsText, setTermsText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reset = () => {
    setActive(null);
    setDateValue('');
    setAmount('');
    setTermsText('');
    setStartDate('');
    setEndDate('');
    setErr(null);
  };

  const buildPatch = (def: ActionDef): LandPatch | string => {
    switch (def.kind) {
      case 'plan_visit':
        if (!dateValue) return 'Pick a visit date.';
        return { status: 'visit_planned', visit_date: dateValue };
      case 'offer_terms': {
        const value = Number(amount);
        if (!amount || Number.isNaN(value) || value < 0) return 'Enter a valid amount.';
        return {
          status: 'terms_offered',
          terms_amount: value,
          terms_text: termsText.trim() || null,
          agent_id: agentId,
        };
      }
      case 'activate':
        if (!startDate || !endDate) return 'Pick start and end dates.';
        if (endDate < startDate) return 'End date must be after the start.';
        return { status: 'active', agreement_start: startDate, agreement_end: endDate };
      case 'end_agreement':
        return { status: 'ended' };
      case 'cancel':
        return { status: 'cancelled' };
    }
  };

  const submit = async (def: ActionDef) => {
    const patch = buildPatch(def);
    if (typeof patch === 'string') {
      setErr(patch);
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      await updateOffer(offer.id, patch);
      reset();
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not save. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20';

  if (actions.length === 0) {
    return (
      <m.aside
        initial={enter.initial}
        animate={enter.animate}
        transition={{ ...enter.transition, delay: 0.06 }}
        className="h-fit rounded-xl border border-agro-surface-a40 bg-agro-surface-a0 p-5"
      >
        <h2 className="font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted">
          Actions
        </h2>
        <p className="mt-3 font-agro-sans text-agro-sm text-agro-text-muted">
          This offer is {LAND_STATUS_LABELS[offer.status].toLowerCase()}. Nothing more to do.
        </p>
      </m.aside>
    );
  }

  return (
    <m.aside
      initial={enter.initial}
      animate={enter.animate}
      transition={{ ...enter.transition, delay: 0.06 }}
      className="h-fit rounded-xl border border-agro-surface-a40 bg-agro-surface-a0 p-5"
    >
      <h2 className="font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted">
        Actions
      </h2>

      <AnimatePresence mode="wait" initial={false}>
        {!active ? (
          <m.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-3 flex flex-col gap-2"
          >
            {actions.map((def) => (
              <button
                key={def.kind}
                type="button"
                onClick={() => {
                  setErr(null);
                  setActive(def);
                }}
                className={[
                  'rounded-lg px-4 py-2.5 font-agro-sans text-agro-sm font-semibold transition-colors',
                  def.danger
                    ? 'border border-agro-danger-a10 text-agro-danger-a10 hover:bg-agro-danger-a20'
                    : 'bg-agro-primary-a0 text-agro-text-inverse hover:opacity-95',
                ].join(' ')}
              >
                {def.label}
              </button>
            ))}
          </m.div>
        ) : (
          <m.div
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={enter.transition}
            className="mt-3 flex flex-col gap-3"
          >
            <p className="font-agro-sans text-agro-sm font-semibold text-agro-text-primary">{active.label}</p>

            {active.input === 'date' && (
              <input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} className={inputClass} />
            )}

            {active.input === 'terms' && (
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  placeholder={`Amount (${offer.currency})`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Terms, e.g. per acre per year, for 2 years"
                  value={termsText}
                  onChange={(e) => setTermsText(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {active.input === 'agreement' && (
              <div className="flex flex-col gap-2">
                <label className="font-agro-sans text-agro-xs text-agro-text-muted">Start date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
                <label className="mt-1 font-agro-sans text-agro-xs text-agro-text-muted">End date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
              </div>
            )}

            {active.input === 'confirm' && active.confirmNote && (
              <p className="font-agro-sans text-agro-sm text-agro-text-muted">{active.confirmNote}</p>
            )}

            {err && <p className="font-agro-sans text-agro-sm text-agro-danger-a10">{err}</p>}

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => submit(active)}
                className={[
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-agro-sans text-agro-sm font-semibold transition-opacity disabled:opacity-60',
                  active.danger
                    ? 'bg-agro-danger-a10 text-agro-text-inverse'
                    : 'bg-agro-primary-a0 text-agro-text-inverse',
                ].join(' ')}
              >
                {submitting && <Loader2 className="size-4 animate-spin" strokeWidth={2} />}
                {submitting ? 'Saving…' : 'Confirm'}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={reset}
                className="rounded-lg border border-agro-surface-a40 px-4 py-2.5 font-agro-sans text-agro-sm font-medium text-agro-text-secondary transition-colors hover:bg-agro-surface-a20 disabled:opacity-60"
              >
                Back
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.aside>
  );
}
