import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Ticket, BookOpen, User, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { clearCurrentUser, getCurrentUser } from '@/lib/authSession';
import { BRAND_ASSET_PATHS } from '@/lib/constants';

export const CustomerHeader: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { theme, customLogoUrl } = useTheme();

  const handleSignOut = () => {
    clearCurrentUser();
    navigate('/login');
  };

  const activeLogo =
    customLogoUrl || (theme === 'light' ? BRAND_ASSET_PATHS.logoLight : BRAND_ASSET_PATHS.logoDark);

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* 1. Brand & Navigation Tabs */}
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <NavLink
          to="/customer/tickets"
          className="h-10 w-32 rounded-xl bg-surface-subtle dark:bg-[#1E2225] border border-border px-2 py-1 flex items-center justify-center shrink-0 shadow-sm hover:opacity-95 transition-opacity"
        >
          <img src={activeLogo} alt="Resolyx" className="w-full h-full object-contain" />
        </NavLink>

        {/* Navigation Tabs: My Tickets & Knowledge Base */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <NavLink
            to="/customer/tickets"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-indigo text-white shadow-sm shadow-brand-indigo/25'
                  : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
              }`
            }
          >
            <Ticket className="h-4 w-4" />
            <span>My Tickets</span>
          </NavLink>

          <NavLink
            to="/customer/kb"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-indigo text-white shadow-sm shadow-brand-indigo/25'
                  : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
              }`
            }
          >
            <BookOpen className="h-4 w-4" />
            <span>Knowledge Base</span>
          </NavLink>
        </nav>
      </div>

      {/* 2. Right: Portal Badge, User Profile & Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-xs font-semibold text-brand-indigo select-none">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Customer Portal</span>
        </div>

        <div className="h-5 w-px bg-border/80 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-xs font-bold text-foreground">
              {currentUser.name || 'Customer'}
            </p>
            <p className="text-[11px] text-foreground-muted font-medium truncate max-w-[150px]">
              {currentUser.email || 'Customer Account'}
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet text-white font-bold text-xs flex items-center justify-center shadow-sm select-none">
            {currentUser.avatarInitials || (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
        </div>

        <ThemeToggle />

        <button
          type="button"
          onClick={handleSignOut}
          className="p-2 rounded-xl text-foreground-muted hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Sign out of portal"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
