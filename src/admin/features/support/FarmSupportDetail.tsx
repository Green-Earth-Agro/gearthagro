import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { Phone, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useQuery } from '../../lib/useQuery';
import { enter } from '../../lib/motion';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { formatDate, formatDateTime } from '../../lib/format';
import { CATEGORY_ICON } from './FarmSupportList';
import { getRequest, updateRequest } from './api';
import {
  CATEGORY_LABELS,
  SUPPORT_STATUS_LABELS,
  SUPPORT_TIMING_LABELS,
  STATUS_TONE,
  farmerLabel,
} from './types';
import type { AdminSupportRequest, SupportCategory, SupportPatch, SupportStatus } from './types';

type ActionKind = 'start_review' | 'approve' | 'answer' | 'decline' | 'schedule' | 'mark_completed' | 'cancel';

interface ActionDef {
  kind: ActionKind;
  label: string;
  input: 'text' | 'date' | 'confirm';
  placeholder?: string;
  confirmNote?: string;
  danger?: boolean;
}

const START_REVIEW: ActionDef = { kind: 'start_review', label: 'Start review', input: 'confirm' };
const APPROVE: ActionDef = { kind: 'approve', label: 'Approve request', input: 'confirm', confirmNote: 'Approve this request and let the farmer know it is moving forward.' };
const ANSWER: ActionDef = { kind: 'answer', label: 'Write an answer', input: 'text', placeholder: 'Your advice for the farmer…' };
const DECLINE: ActionDef = { kind: 'decline', label: 'Decline', input: 'text', placeholder: 'A plain, kind reason the farmer will read…', danger: true };
const SCHEDULE: ActionDef = { kind: 'schedule', label: 'Schedule', input: 'date' };
const COMPLETE: ActionDef = { kind: 'mark_completed', label: 'Mark as completed', input: 'confirm' };
const CANCEL: ActionDef = { kind: 'cancel', label: 'Cancel request', input: 'confirm', danger: true, confirmNote: 'This cancels the request. The farmer will see it as cancelled.' };

function actionsFor(status: SupportStatus, category: SupportCategory): ActionDef[] {
  const triage = category === 'advice' ? ANSWER : APPROVE;
  switch (status) {
    case 'received':
      return [START_REVIEW, triage, DECLINE, CANCEL];
    case 'under_review':
      return [triage, DECLINE, CANCEL];
    case 'approved':
      return [SCHEDULE, CANCEL];
    case 'scheduled':
      return [COMPLETE, CANCEL];
    case 'answered':
      return [COMPLETE];
    default:
      return [];
  }
}

export function FarmSupportDetail() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(`farm-support:${id}`, () => getRequest(id));

  const request = data?.request ?? null;
  const events = data?.events ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title={request ? CATEGORY_LABELS[request.category] : 'Request'}
        back={{ to: '/farm-support', label: 'Farm Support' }}
        actions={
          request ? <StatusPill label={SUPPORT_STATUS_LABELS[request.status]} tone={STATUS_TONE[request.status]} /> : undefined
        }
      />

      <div className="mt-6">
        <QueryBoundary
          loading={loading}
          error={error}
          isEmpty={!request}
          emptyTitle="Request not found"
          emptyMessage="It may have been removed."
          onRetry={refetch}
        >
          {request && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <FarmerCard request={request} delay={0} />
                <RequestCard request={request} delay={0.06} />
                <TimelineCard events={events} delay={0.12} />
              </div>
              <ActionPanel request={request} agentId={user?.id ?? null} onDone={refetch} />
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

function FarmerCard({ request, delay }: { request: AdminSupportRequest; delay?: number }) {
  return (
    <Card title="Farmer" delay={delay}>
      <p className="font-agro-sans text-agro-lg font-semibold text-agro-text-primary">
        {farmerLabel(request)}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {request.farmer_phone && (
          <a
            href={`tel:${request.farmer_phone}`}
            className="inline-flex items-center gap-2 font-agro-sans text-agro-sm text-agro-text-secondary transition-colors hover:text-agro-text-primary"
          >
            <Phone size={16} strokeWidth={1.75} />
            {request.farmer_phone}
          </a>
        )}
        {request.farmer_email && (
          <a
            href={`mailto:${request.farmer_email}`}
            className="inline-flex items-center gap-2 font-agro-sans text-agro-sm text-agro-text-secondary transition-colors hover:text-agro-text-primary"
          >
            <Mail size={16} strokeWidth={1.75} />
            {request.farmer_email}
          </a>
        )}
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

function RequestCard({ request, delay }: { request: AdminSupportRequest; delay?: number }) {
  const Icon = CATEGORY_ICON[request.category];
  return (
    <Card title="Request" delay={delay}>
      <div className="flex items-center gap-2 text-agro-text-secondary">
        <Icon size={16} strokeWidth={1.75} />
        <span className="font-agro-sans text-agro-sm font-medium">{CATEGORY_LABELS[request.category]}</span>
      </div>

      <p className="mt-3 font-agro-sans text-agro-base text-agro-text-primary">{request.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
        {request.item && <Fact label="Item" value={request.item} />}
        {request.quantity_text && <Fact label="Quantity" value={request.quantity_text} />}
        {request.crop && <Fact label="Crop" value={request.crop} />}
        {request.timing && <Fact label="Timing" value={SUPPORT_TIMING_LABELS[request.timing]} />}
        <Fact label="Submitted" value={formatDate(request.created_at)} />
        {request.scheduled_date && <Fact label="Scheduled" value={formatDate(request.scheduled_date)} />}
      </dl>

      {request.photo_url && (
        <img
          src={request.photo_url}
          alt="Photo from the farmer"
          className="mt-4 max-h-72 w-full rounded-lg border border-agro-surface-a30 object-cover"
        />
      )}

      {request.answer && (
        <div className="mt-4 rounded-lg border border-agro-surface-a30 bg-agro-surface-a10 p-3">
          <p className="font-agro-sans text-agro-xs text-agro-text-muted">Answer</p>
          <p className="mt-1 font-agro-sans text-agro-sm text-agro-text-primary">{request.answer}</p>
        </div>
      )}

      {request.decline_reason && (
        <div className="mt-4 rounded-lg border border-agro-surface-a30 bg-agro-surface-a10 p-3">
          <p className="font-agro-sans text-agro-xs text-agro-text-muted">Reason not approved</p>
          <p className="mt-1 font-agro-sans text-agro-sm text-agro-text-primary">{request.decline_reason}</p>
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
                  {SUPPORT_STATUS_LABELS[e.status as SupportStatus] ?? e.status}
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
  request,
  agentId,
  onDone,
}: {
  request: AdminSupportRequest;
  agentId: string | null;
  onDone: () => void;
}) {
  const actions = actionsFor(request.status, request.category);
  const [active, setActive] = useState<ActionDef | null>(null);
  const [text, setText] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reset = () => {
    setActive(null);
    setText('');
    setDateValue('');
    setErr(null);
  };

  const buildPatch = (def: ActionDef): SupportPatch | string => {
    switch (def.kind) {
      case 'start_review':
        return { status: 'under_review' };
      case 'approve':
        return { status: 'approved', agent_id: agentId };
      case 'answer':
        if (!text.trim()) return 'Write an answer first.';
        return { status: 'answered', answer: text.trim(), answered_at: new Date().toISOString(), agent_id: agentId };
      case 'decline':
        if (!text.trim()) return 'Give a short reason.';
        return { status: 'not_approved', decline_reason: text.trim() };
      case 'schedule':
        if (!dateValue) return 'Pick a date.';
        return { status: 'scheduled', scheduled_date: dateValue };
      case 'mark_completed':
        return { status: 'completed', completed_at: new Date().toISOString() };
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
      await updateRequest(request.id, patch);
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
          This request is {SUPPORT_STATUS_LABELS[request.status].toLowerCase()}. Nothing more to do.
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

            {active.input === 'text' && (
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={active.placeholder}
                className="resize-none rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20"
              />
            )}

            {active.input === 'date' && (
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20"
              />
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
