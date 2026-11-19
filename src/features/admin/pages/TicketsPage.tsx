import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Edit, ArrowUpRight, GitFork } from 'lucide-react';
import { updateTicket } from '@/lib/ticketsStorage';
import type { TicketWritePayload } from '@/lib/ticketsApi';
import { useTickets } from '@/hooks/useTickets';
import type { AgentTicket } from '@/features/agent/types/agent.types';
import { EditTicketModal } from '../components/tickets/EditTicketModal';

export const TicketsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeView = searchParams.get('view');

  const { tickets, isSyncing, syncError, refresh } = useTickets();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingTicket, setEditingTicket] = useState<AgentTicket | null>(null);

  const viewTitle = {
    feedback: 'My Feedback & CSAT Ratings',
    pending: 'Active & Pending Tickets',
    resolved: 'Resolved Tickets Today',
    unassigned: 'Unassigned Tickets Queue',
    overdue: 'Overdue Tickets (SLA Breached)',
    assigned: 'Recently Assigned Tickets',
    'sla-alerts': 'SLA Alerts & Urgent Risk',
  }[activeView || ''] || 'All Helpdesk Tickets';

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (activeView === 'feedback' && !t.csatRating) return false;
      if (activeView === 'pending' && t.status === 'Resolved') return false;
      if (activeView === 'resolved' && t.status !== 'Resolved') return false;
      if (
        activeView === 'unassigned' &&
        (t.status === 'Resolved' ||
          (t.assignedAgent &&
            t.assignedAgent.toLowerCase() !== 'unassigned' &&
            t.assignedAgent.trim() !== ''))
      )
        return false;
      if (
        activeView === 'overdue' &&
        (t.status === 'Resolved' ||
          (t.slaMinutesRemaining > 0 &&
            (!t.slaDeadline || !t.slaDeadline.toLowerCase().includes('overdue'))))
      )
        return false;
      if (
        activeView === 'sla-alerts' &&
        t.priority !== 'Urgent' &&
        (t.slaMinutesRemaining || 120) > 60
      )
        return false;
      if (statusFilter !== 'all' && t.status.toLowerCase() !== statusFilter.toLowerCase())
        return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, activeView, statusFilter, search]);

  const handleSaveTicket = async (ticketNumber: string, changes: TicketWritePayload) => {
    await updateTicket(ticketNumber, changes);
  };

  const getPriorityBadge = (p: string) => {
    if (p === 'Urgent') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    if (p === 'High') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{viewTitle}</h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">Inspect, filter, reassign, and edit enterprise tickets across routing teams.</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground shadow-subtle self-start sm:self-auto">
          {filteredTickets.length} Tickets
        </span>
      </div>

      {syncError && (
        <div role="alert" className="flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 text-xs text-rose-600 dark:text-rose-400">
          <span>Could not load tickets from the server: {syncError}</span>
          <button type="button" onClick={() => void refresh()} className="font-semibold underline">Retry</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by ID, title, requester, or company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'Open', 'Investigating', 'Suggested', 'Resolved'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === st ? 'bg-brand-indigo text-white shadow-sm' : 'bg-surface border border-border text-foreground-muted hover:text-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/50 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-foreground-muted">
                    {isSyncing ? 'Loading tickets…' : 'No tickets found. When inquiries arrive or tickets are created, they will appear here.'}
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-surface-subtle/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-brand-indigo whitespace-nowrap">{t.id}</td>
                  <td className="px-4 py-3 max-w-xs sm:max-w-md">
                    <p className="font-semibold text-foreground truncate">{t.title}</p>
                    <span className="text-[10px] text-foreground-muted">{t.category}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-medium text-foreground">{t.customerName}</p>
                    <p className="text-[10px] text-foreground-muted">{t.company}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-surface-subtle border border-border text-[11px] font-medium text-foreground">
                      {t.assignedTeam || 'No team'}
                    </span>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-foreground-muted">
                      {t.assignmentSource === 'rule' && (
                        <GitFork className="h-3 w-3 text-brand-indigo" aria-label="Assigned by rule" />
                      )}
                      {t.assignedAgent}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getPriorityBadge(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo" /> {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingTicket(t)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-foreground"
                      >
                        <Edit className="h-3 w-3 text-brand-indigo" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/agent/resolve/${t.id}`)}
                        className="p-1 rounded-lg hover:bg-surface-subtle text-foreground-muted hover:text-foreground"
                        title="Open in Resolution Studio"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {editingTicket && (
        <EditTicketModal ticket={editingTicket} isOpen={Boolean(editingTicket)} onClose={() => setEditingTicket(null)} onSave={handleSaveTicket} />
      )}
    </div>
  );
};
