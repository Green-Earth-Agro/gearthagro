import { supabase } from '../../lib/supabase';
import type { AdminProduceOffer, OfferPatch, ProduceOfferEvent } from './types';

// Staff listing: offers + farmer contact, gated inside the RPC by user_roles.
export async function listOffers(): Promise<AdminProduceOffer[]> {
  const { data, error } = await supabase.rpc('get_produce_offers_admin');
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProduceOffer[];
}

// Single offer + its event timeline. Farmer contact only comes from the admin RPC
// (it joins auth.users, which a plain table select can't reach), so we pull the list
// and pick the offer; events come straight from the table (staff RLS allows it).
export async function getOffer(
  id: string,
): Promise<{ offer: AdminProduceOffer | null; events: ProduceOfferEvent[] }> {
  const [offers, eventsRes] = await Promise.all([
    listOffers(),
    supabase
      .from('produce_offer_events')
      .select('*')
      .eq('offer_id', id)
      .order('created_at', { ascending: true }),
  ]);
  if (eventsRes.error) throw new Error(eventsRes.error.message);
  return {
    offer: offers.find((o) => o.id === id) ?? null,
    events: (eventsRes.data ?? []) as ProduceOfferEvent[],
  };
}

// Staff progresses an offer (status + the fields that stage needs). The status-change
// trigger writes the timeline event automatically.
export async function updateOffer(id: string, patch: OfferPatch): Promise<void> {
  const { error } = await supabase.from('produce_offers').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}
