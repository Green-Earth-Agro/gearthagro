// Mirrors the mobile app's src/services/support/supportService.ts and
// database/support/create_helpdesk_tables.sql. The in-app help desk, separate
// from Farm Support (support_requests).
import type { Tone } from '../../components/StatusPill';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string;
  issue_type: string;
  subject: string;
  description: string;
  email: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  last_reply_by: 'user' | 'staff';
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface SupportResponse {
  id: string;
  ticket_id: string;
  user_id: string | null;
  is_staff_response: boolean;
  message: string;
  created_at: string;
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const STATUS_TONE: Record<TicketStatus, Tone> = {
  open: 'neutral',
  in_progress: 'process',
  resolved: 'success',
  closed: 'muted',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PRIORITY_TONE: Record<TicketPriority, Tone> = {
  low: 'muted',
  medium: 'neutral',
  high: 'warning',
  urgent: 'danger',
};

export const STATUS_OPTIONS: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

export interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  awaiting: number; // last reply by user
  urgent: number;
}
