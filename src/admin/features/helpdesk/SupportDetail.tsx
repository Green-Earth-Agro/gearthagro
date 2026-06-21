import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { m } from 'motion/react';
import { Mail, Loader2, Send } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useQuery } from '../../lib/useQuery';
import { enter } from '../../lib/motion';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { formatDate, formatDateTime } from '../../lib/format';
import { addStaffReply, getTicket, setStatus } from './api';
import {
  PRIORITY_LABELS,
  PRIORITY_TONE,
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_TONE,
} from './types';
import type { SupportResponse, SupportTicket, TicketStatus } from './types';

export function SupportDetail() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { data, loading, error, refetch, setData } = useQuery(`ticket:${id}`, () => getTicket(id));

  const ticket = data?.ticket ?? null;

  const patchTicket = (patch: Partial<SupportTicket>) =>
    setData((prev) => (prev?.ticket ? { ...prev, ticket: { ...prev.ticket, ...patch } } : prev));

  const appendResponse = (r: SupportResponse) =>
    setData((prev) => (prev ? { ...prev, responses: [...prev.responses, r] } : prev));

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title={ticket?.subject || 'Ticket'}
        back={{ to: '/support', label: 'Support' }}
        actions={
          ticket ? (
            <div className="flex items-center gap-2">
              <StatusPill label={PRIORITY_LABELS[ticket.priority]} tone={PRIORITY_TONE[ticket.priority]} />
              <StatusPill label={STATUS_LABELS[ticket.status]} tone={STATUS_TONE[ticket.status]} />
            </div>
          ) : undefined
        }
      />

      <div className="mt-6">
        <QueryBoundary
          loading={loading}
          error={error}
          isEmpty={!ticket}
          emptyTitle="Ticket not found"
          emptyMessage="It may have been removed."
          onRetry={refetch}
        >
          {ticket && data && (
            <div className="flex flex-col gap-6">
              <MetaCard ticket={ticket} onStatus={(s, resolvedAt) => patchTicket({ status: s, resolved_at: resolvedAt })} />
              <Conversation ticket={ticket} responses={data.responses} />
              <ReplyBox
                ticket={ticket}
                authorId={user?.id ?? null}
                onSent={(r) => {
                  appendResponse(r);
                  patchTicket({ last_reply_by: 'staff', updated_at: r.created_at });
                }}
              />
            </div>
          )}
        </QueryBoundary>
      </div>
    </div>
  );
}

function Card({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <m.section
      initial={enter.initial}
      animate={enter.animate}
      transition={{ ...enter.transition, delay }}
      className="rounded-xl border border-agro-surface-a40 bg-agro-surface-a0 p-5"
    >
      {children}
    </m.section>
  );
}

function MetaCard({
  ticket,
  onStatus,
}: {
  ticket: SupportTicket;
  onStatus: (s: TicketStatus, resolvedAt: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const change = async (s: TicketStatus) => {
    if (s === ticket.status) return;
    setBusy(true);
    setErr(null);
    try {
      await setStatus(ticket.id, s);
      onStatus(s, s === 'resolved' || s === 'closed' ? new Date().toISOString() : ticket.resolved_at);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not update.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <div className="col-span-2">
          <dt className="font-agro-sans text-agro-xs text-agro-text-muted">From</dt>
          <dd className="mt-0.5">
            <a
              href={`mailto:${ticket.email}`}
              className="inline-flex items-center gap-1.5 font-agro-sans text-agro-sm text-agro-text-secondary transition-colors hover:text-agro-text-primary"
            >
              <Mail size={14} strokeWidth={1.75} />
              {ticket.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-agro-sans text-agro-xs text-agro-text-muted">Issue</dt>
          <dd className="mt-0.5 font-agro-sans text-agro-sm text-agro-text-primary">{ticket.issue_type}</dd>
        </div>
        <div>
          <dt className="font-agro-sans text-agro-xs text-agro-text-muted">Opened</dt>
          <dd className="mt-0.5 font-agro-sans text-agro-sm text-agro-text-primary">{formatDate(ticket.created_at)}</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-agro-surface-a30 pt-4">
        <p className="font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted">
          Status
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((s) => {
            const active = s === ticket.status;
            return (
              <button
                key={s}
                type="button"
                disabled={busy || active}
                onClick={() => change(s)}
                className={[
                  'rounded-lg px-3 py-1.5 font-agro-sans text-agro-sm font-medium transition-colors disabled:opacity-60',
                  active
                    ? 'bg-agro-surface-a20 text-agro-text-primary'
                    : 'border border-agro-surface-a40 text-agro-text-secondary hover:bg-agro-surface-a20',
                ].join(' ')}
              >
                {STATUS_LABELS[s]}
              </button>
            );
          })}
        </div>
        {err && <p className="mt-2 font-agro-sans text-agro-sm text-agro-danger-a10">{err}</p>}
      </div>
    </Card>
  );
}

function Bubble({ staff, time, children }: { staff: boolean; time: string; children: ReactNode }) {
  return (
    <div className={`flex ${staff ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 ${
          staff ? 'bg-agro-surface-a20' : 'border border-agro-surface-a30 bg-agro-surface-a10'
        }`}
      >
        <p className="mb-1 font-agro-sans text-agro-xs text-agro-text-muted">
          {staff ? 'Staff' : 'Farmer'} · {formatDateTime(time)}
        </p>
        <p className="whitespace-pre-wrap font-agro-sans text-agro-sm leading-relaxed text-agro-text-primary">
          {children}
        </p>
      </div>
    </div>
  );
}

function Conversation({ ticket, responses }: { ticket: SupportTicket; responses: SupportResponse[] }) {
  return (
    <Card delay={0.06}>
      <h2 className="font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted">
        Conversation
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {/* The opening message is the ticket description, from the farmer. */}
        <Bubble staff={false} time={ticket.created_at}>
          {ticket.description}
        </Bubble>
        {responses.map((r) => (
          <Bubble key={r.id} staff={r.is_staff_response} time={r.created_at}>
            {r.message}
          </Bubble>
        ))}
      </div>
    </Card>
  );
}

function ReplyBox({
  ticket,
  authorId,
  onSent,
}: {
  ticket: SupportTicket;
  authorId: string | null;
  onSent: (r: SupportResponse) => void;
}) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    setErr(null);
    try {
      const r = await addStaffReply(ticket.id, text.trim(), authorId);
      onSent(r);
      setText('');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not send. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card delay={0.12}>
      <h2 className="font-agro-sans text-agro-xs font-semibold uppercase tracking-wide text-agro-text-muted">
        Reply
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Write a reply to the farmer…"
        className="mt-3 w-full resize-y rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20"
      />
      {err && <p className="mt-2 font-agro-sans text-agro-sm text-agro-danger-a10">{err}</p>}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          disabled={sending || !text.trim()}
          onClick={send}
          className="flex items-center gap-2 rounded-lg bg-agro-primary-a0 px-5 py-2.5 font-agro-sans text-agro-sm font-semibold text-agro-text-inverse transition-opacity hover:opacity-95 disabled:opacity-50"
        >
          {sending ? <Loader2 className="size-4 animate-spin" strokeWidth={2} /> : <Send size={16} strokeWidth={2} />}
          {sending ? 'Sending…' : 'Send reply'}
        </button>
      </div>
    </Card>
  );
}
