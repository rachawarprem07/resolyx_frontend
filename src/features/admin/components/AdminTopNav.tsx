import React, { useState } from 'react';
import { Menu, PanelLeftClose, PanelLeft, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { AdminNotificationsDropdown } from './AdminNotificationsDropdown';
import { AdminProfileDropdown } from './AdminProfileDropdown';
import { AdminSearchModal } from './AdminSearchModal';

interface AdminTopNavProps {
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
  onOpenMobileMenu: () => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  isSidebarCollapsed,
  onToggleSidebarCollapse,
  onOpenMobileMenu,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-20 w-full border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Drawer Trigger, Desktop Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onToggleSidebarCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>

        <div className="hidden sm:block h-4 w-px bg-border/80" />

        <AdminBreadcrumbs />
      </div>

      {/* Right Controls: Operational Pill, Search Bar, Notifications, ThemeToggle & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Platform Status: All Systems Operational</span>
        </div>

        {/* Modern Spotlight Search Bar placed directly near Notifications */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-surface-subtle/60 hover:bg-surface-subtle hover:border-brand-indigo/40 text-xs text-foreground-muted hover:text-foreground transition-all duration-150 shadow-xs group"
          title="Search console (^K)"
        >
          <Search className="h-3.5 w-3.5 text-foreground-muted group-hover:text-brand-indigo transition-colors" />
          <span className="hidden sm:inline text-[11px] font-medium">Search console...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono text-foreground-muted bg-surface rounded-md border border-border/80 shadow-xs">
            ^ K
          </kbd>
        </button>

        <AdminNotificationsDropdown />
        <ThemeToggle />
        <div className="h-5 w-px bg-border/80 mx-1 hidden sm:block" />
        <AdminProfileDropdown />

        <AdminSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </header>
  );
};
