// Role/permission model — kept in sync with the mobile app's src/types/auth.ts.
// This is the single source of truth for the web console's authorization UI.
// The real enforcement lives in Supabase (RLS + role-gated RPCs); this matrix only
// decides what the staff UI offers to show.

export type UserPosition = 'farmer' | 'staff';

export type UserRole =
  | 'user'          // Basic farmer role
  | 'loan_officer'  // Review loans + land listings, read-only analytics
  | 'admin'         // Full admin access (loans + land)
  | 'super_admin';  // System super admin

// Roles permitted into the staff console at all. A plain `user` is rejected.
export const STAFF_ROLES: readonly UserRole[] = ['loan_officer', 'admin', 'super_admin'];

export const isStaffRole = (role: UserRole | null | undefined): role is UserRole =>
  !!role && STAFF_ROLES.includes(role);

// Position is a deterministic projection of role, never set independently: the
// base `user` role is always a farmer, every elevated role is always staff. The
// DB enforces the same equivalence as a CHECK constraint
// (database/security/10_enforce_position_role_invariant.sql), so this is the one
// place the UI should compute position from a chosen role.
export const positionForRole = (role: UserRole): UserPosition =>
  role === 'user' ? 'farmer' : 'staff';

export interface RolePermissions {
  // Loan Management
  canViewAllLoans: boolean;
  canReviewLoans: boolean;
  canApproveLoans: boolean;
  canRejectLoans: boolean;

  // Land Leasing Management
  canViewAllListings: boolean;
  canReviewLandListings: boolean;
  canApproveLandListings: boolean;
  canRejectLandListings: boolean;
  canManageFarmingOperations: boolean;

  // Analytics & Reporting
  canViewAnalytics: boolean;
  canViewSystemMetrics: boolean;

  // User Management
  canManageUsers: boolean;
  canAssignRoles: boolean;
  canViewAllUsers: boolean;

  // System Administration
  canAccessAdminPanel: boolean;
  canModifySystemSettings: boolean;
  canViewAuditLogs: boolean;

  // Support & Customer Service
  canManageSupportTickets: boolean;
  canViewSupportTickets: boolean;
  canRespondToSupportTickets: boolean;
  canCloseSupportTickets: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  user: {
    canViewAllLoans: false,
    canReviewLoans: false,
    canApproveLoans: false,
    canRejectLoans: false,
    canViewAllListings: false,
    canReviewLandListings: false,
    canApproveLandListings: false,
    canRejectLandListings: false,
    canManageFarmingOperations: false,
    canViewAnalytics: false,
    canViewSystemMetrics: false,
    canManageUsers: false,
    canAssignRoles: false,
    canViewAllUsers: false,
    canAccessAdminPanel: false,
    canModifySystemSettings: false,
    canViewAuditLogs: false,
    canManageSupportTickets: false,
    canViewSupportTickets: true,
    canRespondToSupportTickets: false,
    canCloseSupportTickets: false,
  },
  loan_officer: {
    canViewAllLoans: true,
    canReviewLoans: true,
    canApproveLoans: false,
    canRejectLoans: false,
    canViewAllListings: true,
    canReviewLandListings: true,
    canApproveLandListings: false,
    canRejectLandListings: false,
    canManageFarmingOperations: false,
    canViewAnalytics: true,
    canViewSystemMetrics: false,
    canManageUsers: false,
    canAssignRoles: false,
    canViewAllUsers: false,
    canAccessAdminPanel: true,
    canModifySystemSettings: false,
    canViewAuditLogs: false,
    canManageSupportTickets: false,
    canViewSupportTickets: true,
    canRespondToSupportTickets: true,
    canCloseSupportTickets: false,
  },
  admin: {
    canViewAllLoans: true,
    canReviewLoans: true,
    canApproveLoans: true,
    canRejectLoans: true,
    canViewAllListings: true,
    canReviewLandListings: true,
    canApproveLandListings: true,
    canRejectLandListings: true,
    canManageFarmingOperations: true,
    canViewAnalytics: true,
    canViewSystemMetrics: true,
    canManageUsers: true,
    canAssignRoles: false, // Only super admin can assign roles
    canViewAllUsers: true,
    canAccessAdminPanel: true,
    canModifySystemSettings: true,
    canViewAuditLogs: true,
    canManageSupportTickets: true,
    canViewSupportTickets: true,
    canRespondToSupportTickets: true,
    canCloseSupportTickets: true,
  },
  super_admin: {
    canViewAllLoans: true,
    canReviewLoans: true,
    canApproveLoans: true,
    canRejectLoans: true,
    canViewAllListings: true,
    canReviewLandListings: true,
    canApproveLandListings: true,
    canRejectLandListings: true,
    canManageFarmingOperations: true,
    canViewAnalytics: true,
    canViewSystemMetrics: true,
    canManageUsers: true,
    canAssignRoles: true,
    canViewAllUsers: true,
    canAccessAdminPanel: true,
    canModifySystemSettings: true,
    canViewAuditLogs: true,
    canManageSupportTickets: true,
    canViewSupportTickets: true,
    canRespondToSupportTickets: true,
    canCloseSupportTickets: true,
  },
};

export const hasPermission = (role: UserRole, permission: keyof RolePermissions): boolean =>
  ROLE_PERMISSIONS[role][permission];

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  loan_officer: 2,
  admin: 3,
  super_admin: 4,
};

// `user` is the role for a normal account; whether they farm is the *position*
// (farmer/staff), not the role. So the role label here stays neutral.
export const ROLE_LABELS: Record<UserRole, string> = {
  user: 'User',
  loan_officer: 'Loan Officer',
  admin: 'Admin',
  super_admin: 'Super Admin',
};
