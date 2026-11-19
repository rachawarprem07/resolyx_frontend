import React, { useState, useEffect } from 'react';
import { X, Clock, Check, Plus } from 'lucide-react';
import type { SlaPolicy, SlaPriority } from '../../types/sla.types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (policy: SlaPolicy) => void;
  initialPolicy?: SlaPolicy | null;
}

export const CreateEditSlaModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialPolicy }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<SlaPriority>('Medium');
  const [responseTimeHours, setResponseTimeHours] = useState(2);
  const [resolutionTimeHours, setResolutionTimeHours] = useState(8);
  const [businessHoursOnly, setBusinessHoursOnly] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialPolicy) {
      setName(initialPolicy.name);
      setDescription(initialPolicy.description);
      setPriority(initialPolicy.priority);
      setResponseTimeHours(initialPolicy.responseTimeHours);
      setResolutionTimeHours(initialPolicy.resolutionTimeHours);
      setBusinessHoursOnly(initialPolicy.businessHoursOnly);
      setIsActive(initialPolicy.isActive);
    } else {
      setName('');
      setDescription('');
      setPriority('Medium');
      setResponseTimeHours(2);
      setResolutionTimeHours(8);
      setBusinessHoursOnly(true);
      setIsActive(true);
    }
  }, [initialPolicy, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initialPolicy ? initialPolicy.id : `sla-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `${priority} Priority SLA policy.`,
      priority,
      responseTimeHours: Number(responseTimeHours) || 1,
      resolutionTimeHours: Number(resolutionTimeHours) || 8,
      businessHoursOnly,
      isActive,
      isDefault: initialPolicy?.isDefault ?? false,
      createdAt: initialPolicy ? initialPolicy.createdAt : 'Just now',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-border shadow-elevated p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-indigo/10 text-brand-indigo"><Clock className="h-5 w-5" /></div>
            <div>
              <h3 className="text-base font-bold text-foreground">{initialPolicy ? 'Edit SLA Policy' : 'Create SLA Policy'}</h3>
              <p className="text-xs text-foreground-muted">Configure response and resolution thresholds</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-foreground-muted hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Policy Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Critical Enterprise Tier" className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as SlaPriority)} className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo">
                <option value="Urgent">Urgent</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Response (Hrs)</label>
              <input type="number" min="0.5" step="0.5" required value={responseTimeHours} onChange={(e) => setResponseTimeHours(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Resolution (Hrs)</label>
              <input type="number" min="1" step="1" required value={resolutionTimeHours} onChange={(e) => setResolutionTimeHours(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Operational target scope..." className="w-full p-2.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo" />
          </div>

          <div className="space-y-2 pt-1 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
              <input type="checkbox" checked={businessHoursOnly} onChange={(e) => setBusinessHoursOnly(e.target.checked)} className="rounded text-brand-indigo focus:ring-brand-indigo h-4 w-4" />
              <span>Count Business Hours Only (Mon-Fri 9AM-6PM)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded text-brand-indigo focus:ring-brand-indigo h-4 w-4" />
              <span>Active Policy (selectable in Teams & Rules)</span>
            </label>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:bg-surface-subtle">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-indigo hover:bg-brand-indigo-hover text-white flex items-center gap-1.5 shadow-sm">
              {initialPolicy ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{initialPolicy ? 'Save Changes' : 'Create SLA Policy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
