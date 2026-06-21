import { supabase } from '../../lib/supabase';
import type { SupportResponse, SupportTicket, TicketStats, TicketStatus } from './types';

const PAGE_SIZE = 15;
export const TICKETS_PAGE_SIZE = PAGE_SIZE;

interface ListParams {
  status: TicketStatus | '';
  search: string;
  page: number;
}

// Strip characters that would break a PostgREST or() filter string.
const sanitize = (s: string) => s.replace(/[(),]/g, ' ').trim();

export async function listTickets({ status, search, page }: ListParams): Promise<{ tickets: SupportTicket[]; total: number }> {
  let q = supabase
    .from('helpdesk_tickets')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false });

  if (status) q = q.eq('status', status);
  const s = sanitize(search);
  if (s) q = q.or(`subject.ilike.%${s}%,email.ilike.%${s}%,ticket_number.ilike.%${s}%`);

  const { data, error, count } = await q.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) throw new Error(error.message);
  return { tickets: (data ?? []) as SupportTicket[], total: count ?? 0 };
}

export async function getStats(): Promise<TicketStats> {
  const { data, error } = await supabase.from('helpdesk_tickets').select('status, priority, last_reply_by');
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as { status: TicketStatus; priority: string; last_reply_by: string }[];
  const stats: TicketStats = { total: rows.length, open: 0, in_progress: 0, resolved: 0, closed: 0, awaiting: 0, urgent: 0 };
  for (const r of rows) {
    stats[r.status] += 1;
    if (r.priority === 'urgent') stats.urgent += 1;
    if (r.last_reply_by === 'user') stats.awaiting += 1;
  }
  return stats;
}

export async function getTicket(
  id: string,
): Promise<{ ticket: SupportTicket | null; responses: SupportResponse[] }> {
  const [ticketRes, responsesRes] = await Promise.all([
    supabase.from('helpdesk_tickets').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('helpdesk_responses')
      .select('*')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true }),
  ]);
  if (ticketRes.error) throw new Error(ticketRes.error.message);
  if (responsesRes.error) throw new Error(responsesRes.error.message);
  return {
    ticket: (ticketRes.data as SupportTicket) ?? null,
    responses: (responsesRes.data ?? []) as SupportResponse[],
  };
}

// Staff reply. The on_response_added trigger flips last_reply_by → 'staff' and bumps
// updated_at on the ticket. Returns the inserted row so the thread can append silently.
export async function addStaffReply(ticketId: string, message: string, userId: string | null): Promise<SupportResponse> {
  const { data, error } = await supabase
    .from('helpdesk_responses')
    .insert({ ticket_id: ticketId, user_id: userId, is_staff_response: true, message })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as SupportResponse;
}

export async function setStatus(ticketId: string, status: TicketStatus): Promise<void> {
  const patch: Record<string, unknown> = { status };
  if (status === 'resolved' || status === 'closed') patch.resolved_at = new Date().toISOString();
  const { error } = await supabase.from('helpdesk_tickets').update(patch).eq('id', ticketId);
  if (error) throw new Error(error.message);
}
