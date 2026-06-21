import { NavLink, Outlet } from 'react-router-dom';
import type { ComponentType } from 'react';
import {
  LayoutDashboard,
  Store,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Users,
  MapPin,
  Map,
  Headset,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { hasPermission, ROLE_LABELS } from '../types/auth';
import type { RolePermissions } from '../types/auth';
import { ThemeToggle } from './ThemeToggle';
import logo from '../../assets/logo/agro_logo.svg';

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  permission: keyof RolePermissions;
  ready?: boolean;
}

// Mirrors the mobile app's "Administration" section (MoreScreen), but gated per-item
// (the app shows all to anyone with admin-panel access; the web tightens to least
// privilege). Net visibility:
//   loan_officer → Overview, Farm Support, Land Offers
//   admin        → all except Access Control
//   super_admin  → all
// Produce Offers and Learn Articles map to the closest matrix permission (no dedicated
// produce/content permission exists), so they land at admin+; adjust if loan officers
// should handle produce. Only Overview is built; the rest are `ready: false` for now.
const NAV: NavItem[] = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, permission: 'canAccessAdminPanel', ready: true },
  { to: '/produce-offers', label: 'Produce Offers', icon: Store, permission: 'canManageFarmingOperations', ready: true },
  { to: '/learn', label: 'Learn Articles', icon: BookOpen, permission: 'canModifySystemSettings', ready: true },
  { to: '/farm-support', label: 'Farm Support', icon: HeartHandshake, permission: 'canRespondToSupportTickets', ready: true },
  { to: '/access-control', label: 'Access Control', icon: ShieldCheck, permission: 'canAssignRoles', ready: true },
  { to: '/users', label: 'User Analytics', icon: Users, permission: 'canViewAllUsers', ready: true },
  { to: '/locations', label: 'Location Management', icon: MapPin, permission: 'canModifySystemSettings' },
  { to: '/land-offers', label: 'Land Offers', icon: Map, permission: 'canReviewLandListings', ready: true },
  { to: '/support', label: 'Support Management', icon: Headset, permission: 'canManageSupportTickets', ready: true },
];

export function AdminLayout() {
  const { role, fullName, signOut } = useAuth();
  if (!role) return null; // RequireStaff guarantees a staff role upstream

  const items = NAV.filter((item) => hasPermission(role, item.permission));

  return (
    // h-dvh + overflow-hidden pins the shell to the viewport; only <main> scrolls,
    // so the sidebar stays put while content scrolls.
    <div className="flex h-dvh overflow-hidden bg-agro-surface-a10 text-agro-text-primary">
      <aside className="hidden h-dvh w-60 shrink-0 flex-col border-r border-agro-surface-a40 bg-agro-surface-a0 md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <img src={logo} alt="" className="size-7" />
          <span className="font-agro-heading text-agro-lg font-bold tracking-tight">
            Staff Console
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-1">
          {items.map(({ to, label, icon: Icon, ready }) => {
            if (!ready) {
              // Not yet wired: legible but clearly inert, with a marker.
              return (
                <div
                  key={to}
                  className="flex cursor-default items-center gap-3 rounded-md px-3 py-2 font-agro-sans text-agro-sm text-agro-text-muted"
                >
                  <Icon size={18} strokeWidth={1.75} />
                  <span>{label}</span>
                  <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-agro-text-disabled">
                    Soon
                  </span>
                </div>
              );
            }
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-md px-3 py-2 font-agro-sans text-agro-sm transition-colors',
                    isActive
                      ? 'bg-agro-surface-a20 font-medium text-agro-text-primary'
                      : 'text-agro-text-secondary hover:bg-agro-surface-a20 hover:text-agro-text-primary',
                  ].join(' ')
                }
              >
                <Icon size={18} strokeWidth={1.75} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-agro-surface-a40 p-3">
          <div className="px-2 pb-2">
            <p className="truncate font-agro-sans text-agro-sm font-semibold">{fullName}</p>
            <p className="font-agro-sans text-agro-xs text-agro-text-muted">{ROLE_LABELS[role]}</p>
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-agro-sans text-agro-sm text-agro-text-secondary transition-colors hover:bg-agro-surface-a20 hover:text-agro-text-primary"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
