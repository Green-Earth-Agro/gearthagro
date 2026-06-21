import { supabase } from '../../lib/supabase';
import type { AdminSupportRequest, SupportPatch, SupportRequestEvent } from './types';

// Staff listing: requests + farmer contact, gated inside the RPC by user_roles.
export async function listRequests(): Promise<AdminSupportRequest[]> {
  const { data, error } = await supabase.rpc('get_support_requests_admin');
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminSupportRequest[];
}

// Single request + its event timeline. Farmer contact only comes from the admin RPC
// (joins auth.users), so we pull the list and pick; events come from the table.
export async function getRequest(
  id: string,
): Promise<{ request: AdminSupportRequest | null; events: SupportRequestEvent[] }> {
  const [requests, eventsRes] = await Promise.all([
    listRequests(),
    supabase
      .from('support_request_events')
      .select('*')
      .eq('request_id', id)
      .order('created_at', { ascending: true }),
  ]);
  if (eventsRes.error) throw new Error(eventsRes.error.message);
  return {
    request: requests.find((r) => r.id === id) ?? null,
    events: (eventsRes.data ?? []) as SupportRequestEvent[],
  };
}

// Staff handles a request (status + the fields that step needs). The status-change
// trigger writes the timeline event automatically.
export async function updateRequest(id: string, patch: SupportPatch): Promise<void> {
  const { error } = await supabase.from('support_requests').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}
