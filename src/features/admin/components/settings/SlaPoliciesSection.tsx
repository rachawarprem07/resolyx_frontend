import React, { useState } from 'react';
import { Clock, Plus, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import type { SlaPolicy, SlaPriority } from '../../types/sla.types';
import { getStoredSlaPolicies, saveStoredSlaPolicies } from '@/lib/slaStorage';
import { CreateEditSlaModal } from './CreateEditSlaModal';

export const SlaPoliciesSection: React.FC = () => {
  const [policies, setPolicies] = useState<SlaPolicy[]>(getStoredSlaPolicies);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<SlaPolicy | null>(null);

  const handleSave = (policy: SlaPolicy) => {
    const exists = policies.some((p) => p.id === policy.id);
    const updated = exists ? policies.map((p) => (p.id === policy.id ? policy : p)) : [...policies, policy];
    setPolicies(updated);
    saveStoredSlaPolicies(updated);
  };

  const handleDelete = (id: string) => {
    const updated = policies.filter((p) => p.id !== id);
    setPolicies(updated);
    saveStoredSlaPolicies(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = policies.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    setPolicies(updated);
    saveStoredSlaPolicies(updated);
  };

  const getPriorityBadge = (p: SlaPriority) => {
    switch (p) {
      case 'Urgent':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'High':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Medium':
        return 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20';
      case 'Low':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-indigo" />
            <h2 className="text-sm font-bold text-foreground">SLA Policies & Response Targets</h2>
          </div>
          <p className="text-xs text-foreground-muted mt-0.5">
            Configure enterprise SLA tiers, response deadlines, and resolution expectations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPolicy(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create SLA Policy</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="p-4 rounded-xl border border-border bg-surface-subtle/50 hover:bg-surface-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-foreground">{policy.name}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getPriorityBadge(policy.priority)}`}>
                  {policy.priority} Priority
                </span>
                {policy.isDefault && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-brand-indigo/10 text-brand-indigo">
                    SYSTEM DEFAULT
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground-muted line-clamp-1">{policy.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-foreground-muted pt-0.5">
                <span className="font-semibold text-foreground">Response: {policy.responseTimeHours}h</span>
                <span>•</span>
                <span>Resolution: {policy.resolutionTimeHours}h</span>
                <span>•</span>
                <span>{policy.businessHoursOnly ? 'Business Hours Only' : '24/7 Calendar'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleToggleActive(policy.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                  policy.isActive
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-500/30 bg-slate-500/10 text-slate-500'
                }`}
              >
                {policy.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                <span>{policy.isActive ? 'Active' : 'Inactive'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingPolicy(policy);
                  setModalOpen(true);
                }}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-brand-indigo hover:bg-brand-indigo/10"
                title="Edit Policy"
              >
                <Edit3 className="h-4 w-4" />
              </button>

              {!policy.isDefault && (
                <button
                  type="button"
                  onClick={() => handleDelete(policy.id)}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-rose-600 hover:bg-rose-500/10"
                  title="Delete Policy"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateEditSlaModal
        isOpen={modalOpen}
        initialPolicy={editingPolicy}
        onClose={() => {
          setModalOpen(false);
          setEditingPolicy(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

