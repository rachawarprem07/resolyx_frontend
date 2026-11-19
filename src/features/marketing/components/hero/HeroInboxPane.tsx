import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroInboxPaneProps {
  selectedTicket: 'billing' | 'renewal';
  onSelectTicket: (ticket: 'billing' | 'renewal') => void;
}

/**
 * HeroInboxPane — Left ticket queue with Inbox status and customer conversation items.
 */
export const HeroInboxPane: React.FC<HeroInboxPaneProps> = ({ selectedTicket, onSelectTicket }) => {
  return (
    <div className="flex-1 sm:max-w-[240px] md:max-w-[280px] p-3 sm:p-4 bg-white dark:bg-slate-950 flex flex-col justify-start">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <span className="h-2 w-2 rounded-sm border border-slate-400" />
          <span>Inbox</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer">
          <span>Filter all</span>
          <ChevronDown className="h-3 w-3" />
        </div>
      </div>

      {/* Ticket 1: Active Billing Info */}
      <div
        onClick={() => onSelectTicket('billing')}
        className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer mb-2 border ${
          selectedTicket === 'billing'
            ? 'bg-slate-50/90 dark:bg-slate-900/70 border-indigo-500/40 shadow-sm'
            : 'border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-900/40'
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 overflow-hidden text-[10px] font-bold">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
              alt="Customer"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>IC</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block truncate">
              Incoming customer
            </span>
            <p className="text-xs font-medium text-slate-900 dark:text-white truncate mt-0.5">
              How do I update my billing info?
            </p>
          </div>
        </div>
      </div>

      {/* Ticket 2: Jennifer Smith */}
      <div
        onClick={() => onSelectTicket('renewal')}
        className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer border ${
          selectedTicket === 'renewal'
            ? 'bg-slate-50/90 dark:bg-slate-900/70 border-indigo-500/40 shadow-sm'
            : 'border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-900/40'
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 overflow-hidden text-[10px] font-bold">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
              alt="Jennifer Smith"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>JS</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                Jennifer Smith
              </span>
              <span className="text-[10px] text-slate-400">Yesterday</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              How does credit card to raw billing info?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
