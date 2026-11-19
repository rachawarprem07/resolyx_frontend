import React, { useState } from 'react';
import { Menu, Clock, CheckCircle2, Coffee } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getCurrentUser } from '@/lib/authSession';
import { useTickets } from '@/hooks/useTickets';

interface AgentTopNavProps {
  onOpenMobileMenu: () => void;
}

export const AgentTopNav: React.FC<AgentTopNavProps> = ({ onOpenMobileMenu }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const currentUser = getCurrentUser();
  const { tickets } = useTickets();
  const urgentCount = tickets.filter(
    (t) => (t.priority === 'Urgent' || t.slaMinutesRemaining < 120) && t.status !== 'Resolved'
  ).length;

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* 1. Mobile Hamburger & Status */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">Resolution Workspace</span>
          <span className="hidden sm:inline-block h-3 w-px bg-border" />
          <button
            type="button"
            onClick={() => setIsAvailable((prev) => !prev)}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              isAvailable
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
            }`}
            title="Click to toggle availability"
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                <span>Available for Tickets</span>
              </>
            ) : (
              <>
                <Coffee className="h-3 w-3" />
                <span>On Break (Paused)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Urgent SLA Banner, Theme Toggle, & Profile */}
      <div className="flex items-center gap-3">
        {/* SLA Status Indicator */}
        {urgentCount > 0 ? (
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <Clock className="h-3 w-3 animate-pulse" />
            <span>{urgentCount} {urgentCount === 1 ? 'Ticket' : 'Tickets'} Nearing SLA Target</span>
          </div>
        ) : (
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Queue SLA Healthy</span>
          </div>
        )}

        <ThemeToggle />

        {/* Agent Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-8 w-8 rounded-xl bg-brand-indigo text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {currentUser.avatarInitials || 'SA'}
          </div>
          <div className="hidden sm:block text-left text-xs leading-tight">
            <p className="font-semibold text-foreground">{currentUser.name || 'Support Agent'}</p>
            <p className="text-[10px] text-foreground-muted">{currentUser.title || 'Support Agent'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

