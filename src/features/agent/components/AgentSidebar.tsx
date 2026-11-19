import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Inbox, BookOpen, BarChart2, LogOut, X, ShieldAlert } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { BRAND_ASSET_PATHS } from '@/lib/constants';
import { clearCurrentUser, getCurrentUser } from '@/lib/authSession';

interface AgentSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface AgentNavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  badge?: string | number;
  isAccent?: boolean;
}

const NAV_ITEMS: AgentNavItem[] = [
  { to: '/agent', label: 'Ticket Queue', icon: Inbox, end: true },
  { to: '/agent/kb', label: 'Knowledge Base', icon: BookOpen },
  { to: '/agent/performance', label: 'My Performance', icon: BarChart2 },
];

export const AgentSidebar: React.FC<AgentSidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { theme, customLogoUrl } = useTheme();
  const isSupervisor = currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'team_lead';

  const handleSignOut = () => {
    clearCurrentUser();
    onCloseMobile();
    navigate('/login');
  };

  const activeLogo =
    customLogoUrl || (theme === 'light' ? BRAND_ASSET_PATHS.logoLight : BRAND_ASSET_PATHS.logoDark);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-surface text-foreground transition-all duration-200">
      <div className="flex flex-col border-b border-border p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <NavLink
            to="/agent"
            className="w-full h-15 rounded-2xl bg-surface-subtle dark:bg-[#1E2225] border border-border shadow-sm px-3 py-1.5 flex items-center justify-center hover:opacity-95"
          >
            <img src={activeLogo} alt="Resolyx" className="w-full h-full object-contain" />
          </NavLink>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden ml-2 p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSupervisor ? (
          <NavLink
            to="/admin"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-[10px] font-bold text-brand-indigo hover:bg-brand-indigo/20 transition-colors"
          >
            <span>Return to Management Console</span>
            <span>&rarr;</span>
          </NavLink>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldAlert className="h-3 w-3 shrink-0" />
            <span className="truncate">Support Agent • Frontline Queue</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive ? 'bg-brand-indigo text-white shadow-sm font-semibold' : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-foreground-muted group-hover:text-foreground'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${isActive ? 'bg-white/20 text-white' : item.isAccent ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-surface-subtle text-foreground-muted border border-border'}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border bg-surface-subtle/30 space-y-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="h-8 w-8 rounded-xl bg-brand-indigo text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            {currentUser.avatarInitials || 'SA'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{currentUser.name || 'Support Agent'}</p>
            <p className="text-[10px] text-foreground-muted truncate">{currentUser.title || 'Support Agent'}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 border-r border-border h-screen sticky top-0 w-64 z-40">
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-surface shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
