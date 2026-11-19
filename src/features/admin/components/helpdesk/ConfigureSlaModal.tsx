import React, { useState, useEffect } from 'react';
import { X, Clock, Check, BellRing, Trash2 } from 'lucide-react';
import { SlaCoveragePicker } from './SlaCoveragePicker';
import { SlaColorPicker } from './SlaColorPicker';
import { SlaTargetInputs } from './SlaTargetInputs';
import type { PriorityLevel } from '../../types/admin.types';

const DEFAULT_COLOR = 'text-blue-600 bg-blue-50 dark:bg-blue-950/40';

interface ConfigureSlaModalProps {
  isOpen: boolean;
  onClose: () => void;
  priority: PriorityLevel | null;
  onSave: (updated: PriorityLevel) => void;
  onDelete?: (id: string) => void;
}

export const ConfigureSlaModal: React.FC<ConfigureSlaModalProps> = ({
  isOpen,
  onClose,
  priority,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('Standard SLA');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [resolutionHours, setResolutionHours] = useState(8);
  const [firstResponseMinutes, setFirstResponseMinutes] = useState(60);
  const [coverage, setCoverage] = useState<'24x7' | 'business_hours'>('business_hours');
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (priority) {
      setName(priority.name);
      setColor(priority.color);
      setResolutionHours(priority.slaHours);
      setFirstResponseMinutes(priority.firstResponseMinutes || 60);
      setCoverage(priority.coverage || 'business_hours');
      setAutoEscalate(priority.autoEscalate ?? true);
    } else {
      setName('Custom SLA');
      setColor(DEFAULT_COLOR);
      setResolutionHours(4);
      setFirstResponseMinutes(30);
      setCoverage('business_hours');
      setAutoEscalate(true);
    }
  }, [priority, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: priority ? priority.id : `pri-${Date.now()}`,
      name: name.trim(),
      color,
      slaHours: Number(resolutionHours),
      firstResponseMinutes: Number(firstResponseMinutes),
      coverage,
      autoEscalate,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-surface border border-border shadow-elevated p-5 sm:p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-indigo/10 text-brand-indigo">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {priority ? 'Configure SLA Policy' : 'Create New SLA Tier'}
              </h3>
              <p className="text-xs text-foreground-muted">
                Custom name, response targets, and schedule
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              SLA Policy Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Critical (P1), Urgent, VIP Fast-Track"
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          <SlaColorPicker selectedColor={color} onSelectColor={setColor} />

          <SlaTargetInputs
            firstResponseMinutes={firstResponseMinutes}
            resolutionHours={resolutionHours}
            onChangeFirstResponse={setFirstResponseMinutes}
            onChangeResolution={setResolutionHours}
          />

          <SlaCoveragePicker coverage={coverage} onChange={setCoverage} />

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle/50 border border-border">
            <div className="flex items-center gap-2.5">
              <BellRing className="h-4 w-4 text-brand-indigo" />
              <div>
                <p className="text-xs font-semibold text-foreground">SLA Breach Warning</p>
                <p className="text-[10px] text-foreground-muted">
                  Alert supervisors when 75% of SLA has elapsed
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoEscalate}
              onClick={() => setAutoEscalate((v) => !v)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                autoEscalate ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                  autoEscalate ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            {priority && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(priority.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Tier</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:bg-surface-subtle"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaved || !name.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-indigo text-white hover:bg-brand-indigo-hover shadow-sm flex items-center gap-1.5 disabled:opacity-70"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4" /> Saved
                  </>
                ) : (
                  'Save SLA Settings'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
