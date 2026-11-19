import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface Props {
  isCollapsed: boolean;
}

export const SidebarFooterCard: React.FC<Props> = ({ isCollapsed }) => {
  if (isCollapsed) {
    return (
      <div className="p-3 border-t border-border/70 flex justify-center">
        <span className="relative flex h-2.5 w-2.5" title="All Systems Operational">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      </div>
    );
  }

  return (
    <div className="p-2.5 border-t border-border/70 bg-gradient-to-b from-transparent to-surface-subtle/50">
      <div className="p-2.5 rounded-xl border border-border/60 bg-surface/80 backdrop-blur-sm shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-foreground truncate flex items-center gap-1">
              <span>Resolyx Pro</span>
              <Sparkles className="h-2.5 w-2.5 text-brand-indigo" />
            </p>
            <p className="text-[9px] text-foreground-muted truncate">99.98% SLA Uptime</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-subtle text-foreground-muted border border-border/60 text-[9px] font-mono shrink-0">
          <Shield className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
          <span>SOC2</span>
        </div>
      </div>
    </div>
  );
};

