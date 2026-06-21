import { supabase } from '../../lib/supabase';
import { CATEGORY_ORDER, PERMISSION_CATEGORY, ROLE_COLUMNS } from './types';
import type { AuditEntry, PermissionDef, PermissionMatrix, RoleName } from './types';

interface PermRow {
  permission_key: string;
  permission_label: string;
  permission_description: string | null;
  permission_value: boolean;
  is_enabled: boolean;
}

// Fetch every role's permissions and fold them into one matrix. get_role_permissions
// is super-admin-gated, so this throws "Not authorized" for anyone else.
export async function getMatrix(): Promise<PermissionMatrix> {
  const roles = ROLE_COLUMNS.map((c) => c.role);
  const results = await Promise.all(
    roles.map((role) => supabase.rpc('get_role_permissions', { target_role: role })),
  );

  const values = { user: {}, loan_officer: {}, admin: {}, super_admin: {} } as Record<
    RoleName,
    Record<string, boolean>
  >;
  const defMap = new Map<string, PermissionDef>();

  results.forEach((res, i) => {
    if (res.error) throw new Error(res.error.message);
    const role = roles[i];
    for (const row of (res.data ?? []) as PermRow[]) {
      values[role][row.permission_key] = row.permission_value;
      if (!defMap.has(row.permission_key)) {
        defMap.set(row.permission_key, {
          key: row.permission_key,
          label: row.permission_label,
          description: row.permission_description ?? '',
          category: PERMISSION_CATEGORY[row.permission_key] ?? 'Other',
        });
      }
    }
  });

  const permissions = [...defMap.values()].sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    return a.label.localeCompare(b.label);
  });

  return { permissions, values };
}

export async function setPermission(
  role: RoleName,
  key: string,
  value: boolean,
  userId: string | null,
): Promise<void> {
  const { error } = await supabase.rpc('update_role_permission', {
    target_role: role,
    target_permission: key,
    new_value: value,
    updated_by_user: userId,
  });
  if (error) throw new Error(error.message);
}

export async function getAudit(limit = 20): Promise<AuditEntry[]> {
  const { data, error } = await supabase
    .from('role_permissions_audit')
    .select('id, role_name, permission_key, permission_label, old_value, new_value, change_type, changed_at')
    .order('changed_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as AuditEntry[];
}
