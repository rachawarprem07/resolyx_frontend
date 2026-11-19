import React, { useState } from 'react';
import { MessageSquare, Mail, Grid } from 'lucide-react';
import { HeroAppHeader } from './HeroAppHeader';
import { HeroInboxPane } from './HeroInboxPane';
import { HeroResponsePane } from './HeroResponsePane';

/**
 * HeroAppContent — Coordinates inner app workspace:
 * Header bar, mini icon rail, inbox queue, and AI response panel.
 */
export const HeroAppContent: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<'billing' | 'renewal'>('billing');
  const [isAutoResolved, setIsAutoResolved] = useState<boolean>(true);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white select-none">
      <HeroAppHeader />

      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800/80 min-h-[260px] sm:min-h-[290px]">
        {/* Left Navigation Mini Rail */}
        <div className="hidden md:flex w-11 flex-col items-center py-3 gap-3 border-r border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            type="button"
            className="p-1.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            aria-label="Messages"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600"
            aria-label="Mail"
          >
            <Mail className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600"
            aria-label="Grid"
          >
            <Grid className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Column 1: Ticket Queue / Inbox */}
        <HeroInboxPane
          selectedTicket={selectedTicket}
          onSelectTicket={(ticket) => setSelectedTicket(ticket)}
        />

        {/* Column 2: AI-Generated Response Panel */}
        <HeroResponsePane
          isAutoResolved={isAutoResolved}
          onToggleAutoResolved={() => setIsAutoResolved((prev) => !prev)}
        />
      </div>
    </div>
  );
};
