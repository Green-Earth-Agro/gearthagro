import type { UserPosition, UserRole } from '../../types/auth';

export interface UserAnalytics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  users_by_role: Record<string, number>;
  users_by_position: Record<string, number>;
}

export interface RegistrationPoint {
  month: string;
  count: number;
}

// A row of the user list (from search_users → personal_information jsonb).
export interface UserRow {
  user_id: string;
  role: UserRole;
  position: UserPosition;
  is_active: boolean;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  profileComplete: boolean; // has a profile with a name
  total_count: number;
}

// A single user (from get_user_details, which computes clean fields).
export interface UserDetail {
  user_id: string;
  role: UserRole;
  position: UserPosition;
  is_active: boolean;
  full_name: string | null;
  email: string | null;
  avatar: string | null;
}

export interface SearchParams {
  search: string;
  role: UserRole | '';
  position: UserPosition | '';
  isActive: boolean | null;
  page: number; // 1-based
  pageSize: number;
}

export const POSITION_LABELS: Record<UserPosition, string> = {
  farmer: 'Farmer',
  staff: 'Staff',
};

export const ROLE_OPTIONS: UserRole[] = ['user', 'loan_officer', 'admin', 'super_admin'];
export const POSITION_OPTIONS: UserPosition[] = ['farmer', 'staff'];
