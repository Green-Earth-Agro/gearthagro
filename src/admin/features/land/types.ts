// Mirrors the mobile app's src/services/landLease/landLeaseService.ts and
// database/land_offers_schema.sql. Keep the status vocabulary in sync.
import type { Tone } from '../../components/StatusPill';

export type LandOfferStatus =
  | 'received'
  | 'visit_planned'
  | 'terms_offered'
  | 'accepted'
  | 'declined'
  | 'active'
  | 'ended'
  | 'cancelled';

export type LandSizeUnit = 'acres' | 'plots';
export type LandAvailability = 'one_year' | 'two_years' | 'three_plus' | 'flexible';

export interface AdminLandOffer {
  id: string;
  farmer_id: string;
  land_size: number;
  size_unit: LandSizeUnit;
  location: string;
  availability: LandAvailability;
  note: string | null;
  status: LandOfferStatus;
  visit_date: string | null;
  terms_amount: number | null;
  terms_text: string | null;
  currency: string;
  agreement_start: string | null;
  agreement_end: string | null;
  agent_id: string | null;
  client_created_at: string | null;
  created_at: string;
  updated_at: string;
  farmer_name: string | null;
  farmer_phone: string | null;
  farmer_email: string | null;
}

export interface LandOfferEvent {
  id: string;
  offer_id: string;
  status: string;
  note: string | null;
  created_at: string;
}

// Fields a staff member may patch as they progress a land offer.
export type LandPatch = Partial<
  Pick<
    AdminLandOffer,
    'status' | 'visit_date' | 'terms_amount' | 'terms_text' | 'agreement_start' | 'agreement_end' | 'agent_id'
  >
>;

export const LAND_UNIT_LABELS: Record<LandSizeUnit, string> = {
  acres: 'Acres',
  plots: 'Plots',
};

export const AVAILABILITY_LABELS: Record<LandAvailability, string> = {
  one_year: 'About 1 year',
  two_years: 'About 2 years',
  three_plus: '3 years or more',
  flexible: 'Flexible',
};

export const LAND_STATUS_LABELS: Record<LandOfferStatus, string> = {
  received: 'Received',
  visit_planned: 'Visit planned',
  terms_offered: 'Terms offered',
  accepted: 'Accepted',
  declined: 'Declined',
  active: 'Agreement active',
  ended: 'Ended',
  cancelled: 'Cancelled',
};

export const STATUS_TONE: Record<LandOfferStatus, Tone> = {
  received: 'neutral',
  visit_planned: 'process',
  terms_offered: 'process',
  accepted: 'process',
  active: 'success',
  ended: 'muted',
  declined: 'danger',
  cancelled: 'muted',
};

const OPEN_STATUSES: LandOfferStatus[] = ['received', 'visit_planned', 'terms_offered', 'accepted', 'active'];
export const isOpenLandStatus = (status: LandOfferStatus): boolean => OPEN_STATUSES.includes(status);

export const sizeLabel = (o: AdminLandOffer): string =>
  `${o.land_size} ${LAND_UNIT_LABELS[o.size_unit] ?? o.size_unit}`;

export const farmerLabel = (o: AdminLandOffer): string =>
  o.farmer_name || o.farmer_phone || o.farmer_email || 'Unknown farmer';
