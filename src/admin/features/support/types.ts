// Mirrors the mobile app's src/services/farmSupport/farmSupportService.ts and
// database/support_requests_schema.sql. Keep the vocabulary in sync.
import type { Tone } from '../../components/StatusPill';

export type SupportCategory = 'inputs' | 'labour' | 'advice';

export type SupportStatus =
  | 'received'
  | 'under_review'
  | 'approved'
  | 'scheduled'
  | 'answered'
  | 'completed'
  | 'not_approved'
  | 'cancelled';

export type SupportTiming = 'this_week' | 'few_weeks' | 'flexible';

export interface AdminSupportRequest {
  id: string;
  farmer_id: string;
  category: SupportCategory;
  description: string;
  item: string | null;
  quantity_text: string | null;
  crop: string | null;
  timing: SupportTiming | null;
  photo_url: string | null;
  status: SupportStatus;
  answer: string | null;
  decline_reason: string | null;
  scheduled_date: string | null;
  agent_id: string | null;
  answered_at: string | null;
  completed_at: string | null;
  client_created_at: string | null;
  created_at: string;
  updated_at: string;
  farmer_name: string | null;
  farmer_phone: string | null;
  farmer_email: string | null;
}

export interface SupportRequestEvent {
  id: string;
  request_id: string;
  status: string;
  note: string | null;
  created_at: string;
}

// Fields a staff member may patch as they handle a request.
export type SupportPatch = Partial<
  Pick<
    AdminSupportRequest,
    'status' | 'answer' | 'decline_reason' | 'scheduled_date' | 'answered_at' | 'completed_at' | 'agent_id'
  >
>;

export const CATEGORY_LABELS: Record<SupportCategory, string> = {
  inputs: 'Seeds & inputs',
  labour: 'Labour help',
  advice: 'Farm advice',
};

export const SUPPORT_STATUS_LABELS: Record<SupportStatus, string> = {
  received: 'Received',
  under_review: 'Under review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  answered: 'Answered',
  completed: 'Completed',
  not_approved: 'Not approved',
  cancelled: 'Cancelled',
};

export const SUPPORT_TIMING_LABELS: Record<SupportTiming, string> = {
  this_week: 'This week',
  few_weeks: 'In a few weeks',
  flexible: 'Any time',
};

export const STATUS_TONE: Record<SupportStatus, Tone> = {
  received: 'neutral',
  under_review: 'process',
  approved: 'process',
  scheduled: 'process',
  answered: 'process',
  completed: 'success',
  not_approved: 'danger',
  cancelled: 'muted',
};

const OPEN_STATUSES: SupportStatus[] = ['received', 'under_review', 'approved', 'scheduled'];
export const isOpenSupportStatus = (status: SupportStatus): boolean => OPEN_STATUSES.includes(status);

export const farmerLabel = (r: AdminSupportRequest): string =>
  r.farmer_name || r.farmer_phone || r.farmer_email || 'Unknown farmer';

// A short one-line gist for the list: structured item if present, else the words.
export const summaryLabel = (r: AdminSupportRequest): string => {
  if (r.item) return r.quantity_text ? `${r.item} · ${r.quantity_text}` : r.item;
  return r.description;
};
