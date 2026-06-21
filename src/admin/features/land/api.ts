import { supabase } from '../../lib/supabase';
import type { AdminLandOffer, LandOfferEvent, LandPatch } from './types';

// Staff listing: land offers + farmer contact, gated inside the RPC by user_roles.
export async function listOffers(): Promise<AdminLandOffer[]> {
  const { data, error } = await supabase.rpc('get_land_offers_admin');
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminLandOffer[];
}

// Single offer + its event timeline. Farmer contact only comes from the admin RPC
// (joins auth.users), so we pull the list and pick; events come from the table.
export async function getOffer(
  id: string,
): Promise<{ offer: AdminLandOffer | null; events: LandOfferEvent[] }> {
  const [offers, eventsRes] = await Promise.all([
    listOffers(),
    supabase
      .from('land_offer_events')
      .select('*')
      .eq('offer_id', id)
      .order('created_at', { ascending: true }),
  ]);
  if (eventsRes.error) throw new Error(eventsRes.error.message);
  return {
    offer: offers.find((o) => o.id === id) ?? null,
    events: (eventsRes.data ?? []) as LandOfferEvent[],
  };
}

// Staff progresses an offer. The status-change trigger writes the timeline event.
export async function updateOffer(id: string, patch: LandPatch): Promise<void> {
  const { error } = await supabase.from('land_offers').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}
