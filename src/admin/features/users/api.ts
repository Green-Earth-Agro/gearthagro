import { supabase } from '../../lib/supabase';
import type { UserPosition, UserRole } from '../../types/auth';
import type {
  RegistrationPoint,
  SearchParams,
  UserAnalytics,
  UserDetail,
  UserRow,
} from './types';

export async function getAnalytics(): Promise<UserAnalytics> {
  const { data, error } = await supabase.rpc('get_user_analytics');
  if (error) throw new Error(error.message);
  return data as UserAnalytics;
}

export async function getRegistrations(): Promise<RegistrationPoint[]> {
  const { data, error } = await supabase.rpc('get_user_registration_analytics');
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as { month: string; count: number | string }[];
  return rows.map((r) => ({ month: r.month, count: Number(r.count) }));
}

interface RawSearchRow {
  user_id: string;
  role: string;
  position: string;
  is_active: boolean;
  user_profiles: { personal_information: Record<string, string | null> | null } | null;
  total_count: number | string;
}

export async function searchUsers(p: SearchParams): Promise<{ users: UserRow[]; total: number }> {
  const { data, error } = await supabase.rpc('search_users', {
    search_term: p.search.trim() || null,
    user_role: p.role || null,
    user_position: p.position || null,
    is_user_active: p.isActive,
    page_size: p.pageSize,
    page_offset: (p.page - 1) * p.pageSize,
  });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as RawSearchRow[];
  const users: UserRow[] = rows.map((r) => {
    const pi = r.user_profiles?.personal_information ?? {};
    return {
      user_id: r.user_id,
      role: r.role as UserRole,
      position: r.position as UserPosition,
      is_active: r.is_active,
      full_name: pi.fullName ?? null,
      email: pi.email ?? null,
      phone: pi.phoneNumber ?? null,
      profileComplete: Boolean(pi.fullName),
      total_count: Number(r.total_count ?? 0),
    };
  });
  return { users, total: users[0]?.total_count ?? 0 };
}

// Super-admin edit. Role/position/active live in both user_roles (access-control
// source) and user_metadata (admin/analytics mirror) with no sync trigger, so the
// admin_update_user_access RPC writes both in one transaction, gated to super_admin.
// See database/user_admin_update.sql.
export async function updateUserAccess(
  userId: string,
  patch: { role: UserRole; position: UserPosition; is_active: boolean },
): Promise<void> {
  const { error } = await supabase.rpc('admin_update_user_access', {
    p_user_id: userId,
    p_role: patch.role,
    p_position: patch.position,
    p_is_active: patch.is_active,
  });
  if (error) throw new Error(error.message);
}

export async function getUserDetails(id: string): Promise<UserDetail | null> {
  const { data, error } = await supabase.rpc('get_user_details', { p_user_id: id });
  if (error) throw new Error(error.message);
  const row = ((data ?? []) as Record<string, unknown>[])[0];
  if (!row) return null;
  return {
    user_id: row.user_id as string,
    role: row.role as UserRole,
    position: row.position as UserPosition,
    is_active: row.is_active as boolean,
    full_name: (row.full_name as string) ?? null,
    email: (row.email as string) ?? null,
    avatar: (row.avatar as string) ?? null,
  };
}
