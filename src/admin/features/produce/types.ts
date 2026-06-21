// Mirrors the mobile app's src/services/produce/produceService.ts and
// database/produce_offers_schema.sql. Keep the status vocabulary in sync.
import type { Tone } from '../../components/StatusPill';

export type OfferStatus =
  | 'received'
  | 'visit_planned'
  | 'offer_made'
  | 'accepted'
  | 'declined'
  | 'pickup_planned'
  | 'collected'
  | 'paid'
  | 'cancelled';

export type OfferUnit = 'bags' | 'crates' | 'boxes' | 'tubers' | 'bunches' | 'other';
export type ReadyTiming = 'now' | 'one_week' | 'two_weeks';

export interface AdminProduceOffer {
  id: string;
  farmer_id: string;
  crop_type: string;
  quantity: number;
  unit: OfferUnit;
  ready_timing: ReadyTiming;
  farm_location: string;
  note: string | null;
  status: OfferStatus;
  price_offered: number | null;
  price_unit: string | null;
  currency: string;
  agent_id: string | null;
  visit_date: string | null;
  pickup_date: string | null;
  collected_at: string | null;
  paid_at: string | null;
  client_created_at: string | null;
  created_at: string;
  updated_at: string;
  farmer_name: string | null;
  farmer_phone: string | null;
  farmer_email: string | null;
}

export interface ProduceOfferEvent {
  id: string;
  offer_id: string;
  status: string;
  note: string | null;
  created_at: string;
}

// Fields a staff member may patch as they progress an offer.
export type OfferPatch = Partial<
  Pick<
    AdminProduceOffer,
    'status' | 'price_offered' | 'price_unit' | 'visit_date' | 'pickup_date' | 'collected_at' | 'paid_at' | 'agent_id'
  >
>;

export const UNIT_LABELS: Record<OfferUnit, string> = {
  bags: 'Bags',
  crates: 'Crates',
  boxes: 'Boxes',
  tubers: 'Tubers',
  bunches: 'Bunches',
  other: 'Other',
};

export const TIMING_LABELS: Record<ReadyTiming, string> = {
  now: 'Ready now',
  one_week: 'In about 1 week',
  two_weeks: 'In about 2 weeks',
};

export const STATUS_LABELS: Record<OfferStatus, string> = {
  received: 'Received',
  visit_planned: 'Visit planned',
  offer_made: 'Price offered',
  accepted: 'Accepted',
  declined: 'Declined',
  pickup_planned: 'Pickup planned',
  collected: 'Collected',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

export const STATUS_TONE: Record<OfferStatus, Tone> = {
  received: 'neutral',
  visit_planned: 'process',
  offer_made: 'process',
  accepted: 'process',
  pickup_planned: 'process',
  collected: 'success',
  paid: 'success',
  declined: 'danger',
  cancelled: 'muted',
};

// Open = still needs staff attention (mirrors produceService.OPEN_STATUSES).
const OPEN_STATUSES: OfferStatus[] = ['received', 'visit_planned', 'offer_made', 'accepted', 'pickup_planned'];
export const isOpenStatus = (status: OfferStatus): boolean => OPEN_STATUSES.includes(status);

export const quantityLabel = (o: AdminProduceOffer): string =>
  `${o.quantity} ${UNIT_LABELS[o.unit] ?? o.unit}`;

export const farmerLabel = (o: AdminProduceOffer): string =>
  o.farmer_name || o.farmer_phone || o.farmer_email || 'Unknown farmer';
