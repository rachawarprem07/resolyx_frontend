import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Check } from 'lucide-react';
import type { SupportTeam, RoutingStrategy } from '../../types/team.types';
import type { SlaPolicy } from '../../types/sla.types';
import { TeamUsersMultiSelect } from './TeamUsersMultiSelect';
import { getStoredSlaPolicies } from '@/lib/slaStorage';
import { getUsersApi, type UserDetail } from '@/lib/apiClient';

export interface TeamFormValues {
  name: string;
  description: string;
  routingStrategy: RoutingStrategy;
  slaTargetHours: number;
  leadUserId: number | null;
  memberIds: number[];
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Persists the team; reject with an Error to show its message in the form. */
  onSave: (values: TeamFormValues) => Promise<void>;
  initialTeam?: SupportTeam | null;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTeam,
}) => {
  const [name, setName] = useState('');
  const [leadUserId, setLeadUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routingStrategy, setRoutingStrategy] = useState<RoutingStrategy>('Round-Robin');
  const [slaTargetHours, setSlaTargetHours] = useState(2);
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [activeSlaPolicies, setActiveSlaPolicies] = useState<SlaPolicy[]>([]);

  useEffect(() => {
    setActiveSlaPolicies(getStoredSlaPolicies().filter((p) => p.isActive));
    setError(null);
    if (initialTeam) {
      setName(initialTeam.name);
      setLeadUserId(initialTeam.leadUserId ?? null);
      setRoutingStrategy(initialTeam.routingStrategy);
      setSlaTargetHours(initialTeam.slaTargetHours);
      setDescription(initialTeam.description);
      setSelectedMembers(initialTeam.memberIds || []);
    } else {
      setName('');
      setLeadUserId(null);
      setRoutingStrategy('Round-Robin');
      setSlaTargetHours(2);
      setDescription('');
      setSelectedMembers([]);
    }
  }, [initialTeam, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setUsersLoading(true);
    getUsersApi()
      .then((list) => setUsers(list.filter((u) => u.is_active && u.role !== 'customer')))
      .catch(() => setError('Could not load agents from the server.'))
      .finally(() => setUsersLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        routingStrategy,
        slaTargetHours: Number(slaTargetHours),
        leadUserId,
        memberIds: selectedMembers,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the team.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-surface border border-border shadow-elevated p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-indigo/10 text-brand-indigo"><Users className="h-5 w-5" /></div>
            <div>
              <h3 className="text-base font-bold text-foreground">{initialTeam ? 'Edit Support Team' : 'Create Support Team'}</h3>
              <p className="text-xs text-foreground-muted">Assign members via multi-select and configure routing policies</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>
          )}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Team Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Network & Infrastructure Ops" className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Routing Strategy</label>
              <select value={routingStrategy} onChange={(e) => setRoutingStrategy(e.target.value as RoutingStrategy)} className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo">
                <option value="Round-Robin">Round-Robin</option><option value="Least Loaded">Least Loaded</option><option value="Skill-Based">Skill-Based</option><option value="Manual Broadcast">Manual Broadcast</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Target SLA Policy <span className="text-[10px] text-foreground-muted font-normal">(Settings → SLA)</span>
              </label>
              <select value={slaTargetHours} onChange={(e) => setSlaTargetHours(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo">
                {activeSlaPolicies.map((p) => (
                  <option key={p.id} value={p.responseTimeHours}>
                    {p.name} ({p.responseTimeHours}h response)
                  </option>
                ))}
                {!activeSlaPolicies.some((p) => p.responseTimeHours === slaTargetHours) && (
                  <option value={slaTargetHours}>{slaTargetHours} hours (Custom)</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="team-lead" className="block text-xs font-semibold text-foreground mb-1">Team Lead</label>
            <select id="team-lead" value={leadUserId ?? ''} onChange={(e) => setLeadUserId(e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo">
              <option value="">No lead</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
              ))}
            </select>
          </div>

          {/* User Multi Select Component */}
          <div>
            <TeamUsersMultiSelect users={users} isLoading={usersLoading} selectedUserIds={selectedMembers} onChange={setSelectedMembers} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Primary responsibilities and triage scope..." className="w-full p-2.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo" />
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:bg-surface-subtle">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-indigo hover:bg-brand-indigo-hover text-white flex items-center gap-1.5 shadow-sm disabled:opacity-60">
              {initialTeam ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{initialTeam ? 'Save Changes' : 'Create Team'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
