import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { enter } from '../../lib/motion';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useQuery } from '../../lib/useQuery';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { formatDate, formatDateTime, formatMoney } from '../../lib/format';
import { getOffer, updateOffer } from './api';
import {
  STATUS_LABELS,
  STATUS_TONE,
  TIMING_LABELS,
  farmerLabel,
  quantityLabel,
} from './types';
import type { AdminProduceOffer, OfferPatch, OfferStatus } from './types';

type ActionKind = 'plan_visit' | 'make_offer' | 'plan_pickup' | 'mark_collected' | 'mark_paid' | 'cancel';

interface ActionDef {
  kind: ActionKind;
  label: string;
  input: 'date' | 'price' | 'confirm';
  danger?: boolean;
}

// Which actions a staff member can take from each status.
const ACTIONS_BY_STATUS: Record<OfferStatus, ActionDef[]> = {
  received: [
    { kind: 'plan_visit', label: 'Plan a visit', input: 'date' },
    { kind: 'make_offer', label: 'Make a price offer', input: 'price' },
    { kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true },
  ],
  visit_planned: [
    { kind: 'make_offer', label: 'Make a price offer', input: 'price' },
    { kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true },
  ],
  offer_made: [{ kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true }],
  accepted: [
    { kind: 'plan_pickup', label: 'Plan pickup', input: 'date' },
    { kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true },
  ],
  pickup_planned: [
    { kind: 'mark_collected', label: 'Mark as collected', input: 'confirm' },
    { kind: 'cancel', label: 'Cancel offer', input: 'confirm', danger: true },
  ],
  collected: [{ kind: 'mark_paid', label: 'Mark as paid', input: 'confirm' }],
  paid: [],
  declined: [],
  cancelled: [],
};

export function ProduceOfferDetail() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(`produce-offer:${id}`, () => getOffer(id));

  const offer = data?.offer ?? null;
  const events = data?.events ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title={offer ? `${offer.crop_type} · ${quantityLabel(offer)}` : 'Offer'}
        back={{ to: '/produce-offers', label: 'Produce Offers' }}
        actions={offer ? <StatusPill label={STATUS_LABELS[offer.status]} tone={STATUS_TONE[offer.status]} /> : undefined}
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

function FarmerCard({ offer, delay }: { offer: AdminProduceOffer; delay?: number }) {
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
          {offer.farm_location}
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

function OfferFactsCard({ offer, delay }: { offer: AdminProduceOffer; delay?: number }) {
  return (
    <Card title="Offer" delay={delay}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
        <Fact label="Crop" value={offer.crop_type} />
        <Fact label="Quantity" value={quantityLabel(offer)} />
        <Fact label="Ready" value={TIMING_LABELS[offer.ready_timing]} />
        <Fact
          label="Price offered"
          value={
            offer.price_offered != null
              ? `${formatMoney(offer.price_offered, offer.currency)}${offer.price_unit ? ` · ${offer.price_unit}` : ''}`
              : '—'
          }
        />
        <Fact label="Visit" value={formatDate(offer.visit_date)} />
        <Fact label="Pickup" value={formatDate(offer.pickup_date)} />
        <Fact label="Submitted" value={formatDate(offer.created_at)} />
        <Fact label="Collected" value={formatDate(offer.collected_at)} />
        <Fact label="Paid" value={formatDate(offer.paid_at)} />
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
                  {STATUS_LABELS[e.status as OfferStatus] ?? e.status}
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
  offer: AdminProduceOffer;
  agentId: string | null;
  onDone: () => void;
}) {
  const actions = ACTIONS_BY_STATUS[offer.status];
  const [active, setActive] = useState<ActionDef | null>(null);
  const [dateValue, setDateValue] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reset = () => {
    setActive(null);
    setDateValue('');
    setPrice('');
    setPriceUnit('');
    setErr(null);
  };

  const buildPatch = (def: ActionDef): OfferPatch | string => {
    switch (def.kind) {
      case 'plan_visit':
        if (!dateValue) return 'Pick a visit date.';
        return { status: 'visit_planned', visit_date: dateValue };
      case 'make_offer': {
        const value = Number(price);
        if (!price || Number.isNaN(value) || value < 0) return 'Enter a valid price.';
        return {
          status: 'offer_made',
          price_offered: value,
          price_unit: priceUnit.trim() || null,
          agent_id: agentId,
        };
      }
      case 'plan_pickup':
        if (!dateValue) return 'Pick a pickup date.';
        return { status: 'pickup_planned', pickup_date: dateValue };
      case 'mark_collected':
        return { status: 'collected', collected_at: new Date().toISOString() };
      case 'mark_paid':
        return { status: 'paid', paid_at: new Date().toISOString() };
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
          This offer is {STATUS_LABELS[offer.status].toLowerCase()}. Nothing more to do.
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
          <p className="font-agro-sans text-agro-sm font-semibold text-agro-text-primary">
            {active.label}
          </p>

          {active.input === 'date' && (
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20"
            />
          )}

          {active.input === 'price' && (
            <div className="flex flex-col gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                placeholder={`Price (${offer.currency})`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20"
              />
              <input
                type="text"
                placeholder="Per what? e.g. per bag"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20"
              />
            </div>
          )}

          {active.input === 'confirm' && (
            <p className="font-agro-sans text-agro-sm text-agro-text-muted">
              {active.kind === 'cancel'
                ? 'This cancels the offer. The farmer will see it as cancelled.'
                : 'Confirm this update.'}
            </p>
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
