// Role-permission matrix. The role_permissions table + RPCs are the *intended* policy
// surface (see CLAUDE.md / the access-control analysis). Mirrors the categories in the
// mobile permissionsService.getPermissionGroups().

export type RoleName = 'user' | 'loan_officer' | 'admin' | 'super_admin';

export const ROLE_COLUMNS: { role: RoleName; label: string }[] = [
  { role: 'user', label: 'User' },
  { role: 'loan_officer', label: 'Loan Officer' },
  { role: 'admin', label: 'Admin' },
  { role: 'super_admin', label: 'Super Admin' },
];

export interface PermissionDef {
  key: string;
  label: string;
  description: string;
  category: string;
}

export interface PermissionMatrix {
  permissions: PermissionDef[]; // ordered by category, then label
  values: Record<RoleName, Record<string, boolean>>;
}

export const CATEGORY_ORDER = [
  'Loan Management',
  'Land Leasing',
  'Analytics & Reporting',
  'User Management',
  'System Administration',
  'Support',
  'Other',
];

// permission_key → category. Keys not listed land in "Other".
export const PERMISSION_CATEGORY: Record<string, string> = {
  canViewOwnLoans: 'Loan Management',
  canApplyForLoans: 'Loan Management',
  canViewAllLoans: 'Loan Management',
  canReviewLoans: 'Loan Management',
  canApproveLoans: 'Loan Management',
  canRejectLoans: 'Loan Management',

  canListLand: 'Land Leasing',
  canViewOwnListings: 'Land Leasing',
  canEditOwnListings: 'Land Leasing',
  canDeleteOwnListings: 'Land Leasing',
  canViewAllListings: 'Land Leasing',
  canReviewLandListings: 'Land Leasing',
  canApproveLandListings: 'Land Leasing',
  canRejectLandListings: 'Land Leasing',
  canManageFarmingOperations: 'Land Leasing',
  canViewFarmingProgress: 'Land Leasing',
  canUpdateFarmingStatus: 'Land Leasing',
  canManageProfitSharing: 'Land Leasing',
  canOverrideFarmingOperations: 'Land Leasing',
  canModifyProfitSharing: 'Land Leasing',

  canViewAnalytics: 'Analytics & Reporting',
  canViewFarmerAnalytics: 'Analytics & Reporting',
  canViewLandAnalytics: 'Analytics & Reporting',
  canViewFarmingAnalytics: 'Analytics & Reporting',
  canViewOwnLandAnalytics: 'Analytics & Reporting',
  canViewProfitSharingReports: 'Analytics & Reporting',
  canViewSystemMetrics: 'Analytics & Reporting',

  canManageUsers: 'User Management',
  canAssignRoles: 'User Management',
  canViewAllUsers: 'User Management',

  canAccessAdminPanel: 'System Administration',
  canModifySystemSettings: 'System Administration',
  canViewAuditLogs: 'System Administration',

  canManageSupportTicketsSync: 'Support',
  canViewSupportTicketsSync: 'Support',
  canRespondToSupportTicketsSync: 'Support',
  canCloseSupportTicketsSync: 'Support',
};

export interface AuditEntry {
  id: string;
  role_name: string;
  permission_key: string;
  permission_label: string | null;
  old_value: boolean | null;
  new_value: boolean | null;
  change_type: string;
  changed_at: string;
}
