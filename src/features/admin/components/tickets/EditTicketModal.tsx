import React, { useEffect, useState } from 'react';
import { X, Check, Info } from 'lucide-react';
import type { AgentTicket } from '@/features/agent/types/agent.types';
import type { SupportTeam } from '@/features/admin/types/team.types';
import { getStoredTeams } from '@/lib/teamsStorage';
import { teamsApi } from '@/lib/teamsApi';
import { getUsersApi, type UserDetail } from '@/lib/apiClient';
import type { TicketWritePayload } from '@/lib/ticketsApi';

interface EditTicketModalProps {
  ticket: AgentTicket;
  isOpen: boolean;
  onClose: () => void;
  /** Receives only the changed fields. Changing the agent/team records a manual assignment. */
  onSave: (ticketNumber: string, changes: TicketWritePayload) => Promise<void>;
}

const selectCls = 'w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs';

export const EditTicketModal: React.FC<EditTicketModalProps> = ({ ticket, isOpen, onClose, onSave }) => {
  const [teams, setTeams] = useState<SupportTeam[]>(getStoredTeams);
  const [agents, setAgents] = useState<UserDetail[]>([]);
  const [title, setTitle] = useState(ticket.title);
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [teamId, setTeamId] = useState<string>(ticket.assignedTeamId ?? '');
  const [agentId, setAgentId] = useState<string>(ticket.assignedAgentId ? String(ticket.assignedAgentId) : '');
  const [tagsInput, setTagsInput] = useState(ticket.tags.join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    teamsApi.list().then(setTeams).catch(() => undefined);
    getUsersApi()
      .then((users) => setAgents(users.filter((u) => u.is_active && u.role !== 'customer')))
      .catch(() => undefined);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const changes: TicketWritePayload = {};
    if (title.trim() !== ticket.title) changes.subject = title.trim();
    if (status !== ticket.status) changes.status = status;
    if (priority !== ticket.priority) changes.priority = priority;
    if (tags.join('|') !== ticket.tags.join('|')) changes.tags = tags;
    if (teamId !== (ticket.assignedTeamId ?? '')) changes.assigned_team_id = teamId ? Number(teamId) : 0;
    if (agentId !== (ticket.assignedAgentId ? String(ticket.assignedAgentId) : '')) {
      changes.assigned_agent_id = agentId ? Number(agentId) : 0;
    }
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(ticket.id, changes);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the ticket.');
    } finally {
      setSaving(false);
    }
  };

  const activeTeams = teams.filter((t) => t.isActive !== false || t.id === ticket.assignedTeamId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Edit Ticket • {ticket.id}</h3>
            <p className="text-xs text-foreground-muted">{ticket.customerName} {ticket.company && `(${ticket.company})`}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded-lg text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>
          )}
          <div>
            <label htmlFor="edit-title" className="block text-xs font-semibold text-foreground mb-1">Subject / Issue Title</label>
            <input
              id="edit-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-status" className="block text-xs font-semibold text-foreground mb-1">Status</label>
              <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value as AgentTicket['status'])} className={selectCls}>
                <option value="Open">Open</option>
                <option value="Investigating">Investigating</option>
                <option value="Suggested">Suggested</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-priority" className="block text-xs font-semibold text-foreground mb-1">Priority</label>
              <select id="edit-priority" value={priority} onChange={(e) => setPriority(e.target.value as AgentTicket['priority'])} className={selectCls}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-team" className="block text-xs font-semibold text-foreground mb-1">Assigned Team</label>
              <select id="edit-team" value={teamId} onChange={(e) => setTeamId(e.target.value)} className={selectCls}>
                <option value="">No team</option>
                {activeTeams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-agent" className="block text-xs font-semibold text-foreground mb-1">Assigned Agent</label>
              <select id="edit-agent" value={agentId} onChange={(e) => setAgentId(e.target.value)} className={selectCls}>
                <option value="">Unassigned</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.full_name || a.email}</option>
                ))}
                {agentId && !agents.some((a) => String(a.id) === agentId) && (
                  <option value={agentId}>{ticket.assignedAgent}</option>
                )}
              </select>
            </div>
          </div>
          {ticket.assignmentSource === 'rule' && (
            <p className="flex items-start gap-1.5 text-[11px] text-foreground-muted">
              <Info className="h-3.5 w-3.5 mt-px shrink-0" />
              Assigned automatically by an assignment rule. Changing the assignee makes it a manual assignment, which rules will not overwrite by default.
            </p>
          )}

          <div>
            <label htmlFor="edit-tags" className="block text-xs font-semibold text-foreground mb-1">Tags (comma-separated)</label>
            <input
              id="edit-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs font-mono"
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface-subtle">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 disabled:opacity-60">
              <Check className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
