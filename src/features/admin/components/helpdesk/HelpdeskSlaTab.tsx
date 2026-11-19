import React, { useState } from 'react';
import { Clock, Sliders, CheckCircle2, ShieldAlert, Calendar, Plus } from 'lucide-react';
import { ConfigureSlaModal } from './ConfigureSlaModal';
import type { PriorityLevel } from '../../types/admin.types';

interface HelpdeskSlaTabProps {
  priorities: PriorityLevel[];
  onUpdatePriority: (updated: PriorityLevel) => void;
  onDeletePriority?: (id: string) => void;
}

export const HelpdeskSlaTab: React.FC<HelpdeskSlaTabProps> = ({
  priorities,
  onUpdatePriority,
  onDeletePriority,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenConfig = (priority: PriorityLevel | null) => {
    setSelectedPriority(priority);
    setIsModalOpen(true);
  };

  const formatMinutes = (mins?: number) => {
    if (!mins) return '1h';
    if (mins >= 60) return `${mins / 60}h`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* 1. SLA Performance Banner & Add Action */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Service Level Agreements (SLA)</h2>
          <p className="text-xs text-foreground-muted">
            Configure custom SLA names, response times, and target resolution policies across
            priority tiers.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>98.4% On-Time</span>
          </div>
          <button
            type="button"
            onClick={() => handleOpenConfig(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo-hover text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add SLA Tier</span>
          </button>
        </div>
      </div>

      {/* 2. Configurable Priority Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {priorities.map((pri) => (
          <div
            key={pri.id}
            className="p-5 rounded-2xl bg-surface border border-border shadow-subtle flex flex-col justify-between space-y-4 hover:border-border-hover transition-colors"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${pri.color}`}>
                  {pri.name}
                </span>
                <span className="text-[10px] font-semibold text-foreground-muted">
                  {pri.coverage === '24x7' ? '24/7 Always' : 'Business Hours'}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                    Target Resolution
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-foreground">
                      {pri.slaHours < 1 ? `${pri.slaHours * 60}m` : `${pri.slaHours}h`}
                    </span>
                    <span className="text-xs text-foreground-muted">max</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                    First Response Target
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    Within {formatMinutes(pri.firstResponseMinutes)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-foreground-muted flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {pri.autoEscalate ? 'Auto-escalate ON' : 'Standard'}
              </span>
              <button
                type="button"
                onClick={() => handleOpenConfig(pri)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover hover:bg-brand-indigo/10 transition-colors"
              >
                <Sliders className="h-3 w-3" />
                <span>Configure SLA</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Global SLA Policies & Operating Schedule */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Calendar className="h-4 w-4 text-brand-indigo" />
          <h3 className="text-sm font-bold text-foreground">Global SLA Schedule & Timer Rules</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-subtle/50 border border-border space-y-1">
            <p className="font-bold text-foreground">Business Hours Schedule</p>
            <p className="text-foreground-muted">
              Monday through Friday, 09:00 – 18:00 (UTC). Tickets submitted after hours only count
              against SLA during business windows.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-subtle/50 border border-border space-y-1">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
              <span>Automatic SLA Timer Freezing</span>
            </p>
            <p className="text-foreground-muted">
              When a ticket is moved to "Waiting on Customer", the SLA counter freezes automatically
              until the customer replies.
            </p>
          </div>
        </div>
      </div>

      <ConfigureSlaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        priority={selectedPriority}
        onSave={onUpdatePriority}
        onDelete={onDeletePriority}
      />
    </div>
  );
};
