import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroResponsePaneProps {
  isAutoResolved: boolean;
  onToggleAutoResolved: () => void;
}

/**
 * HeroResponsePane — Right workspace panel showing the AI-generated reply and Auto-resolved tag.
 */
export const HeroResponsePane: React.FC<HeroResponsePaneProps> = ({
  isAutoResolved,
  onToggleAutoResolved,
}) => {
  return (
    <div className="flex-[1.4] p-3.5 sm:p-4 md:p-5 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/20 text-left">
      <div>
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/60 dark:border-slate-800/80">
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            AI-generated response
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50 px-2.5 py-0.5 text-[10px] font-semibold">
            <Sparkles className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Agent</span>
          </span>
        </div>

        {/* AI Generated Message Bubble */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Generate a smart, helpful reply. We can recommend steps to help you change your
              billing info. In minutes on your team, for credit online account.
            </p>
          </div>
        </div>

        {/* Auto-resolved Indicator Banner */}
        <div className="mt-3">
          <button
            type="button"
            onClick={onToggleAutoResolved}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:opacity-80 transition cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAutoResolved ? 'Auto-resolved' : 'Under Review'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
