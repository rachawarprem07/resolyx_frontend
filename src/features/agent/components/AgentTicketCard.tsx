import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, ArrowRight, Users } from 'lucide-react';
import type { AgentTicket, TicketPriority, TicketStatus } from '../types/agent.types';

interface AgentTicketCardProps {
  ticket: AgentTicket;
}

export const AgentTicketCard: React.FC<AgentTicketCardProps> = ({ ticket }) => {
  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'High':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Suggested':
        return 'bg-brand-violet/10 text-brand-violet border-brand-violet/20';
      case 'Investigating':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-brand-indigo/40 shadow-subtle transition-all space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-foreground-muted">{ticket.id}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(
              ticket.priority,
            )}`}
          >
            {ticket.priority}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
              ticket.status,
            )}`}
          >
            {ticket.status}
          </span>
          {ticket.assignedTeam && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
              <Users className="h-2.5 w-2.5" />
              <span>{ticket.assignedTeam}</span>
            </span>
          )}
          {ticket.aiSuggestion && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-violet/10 text-brand-violet border border-brand-violet/20">
              <Sparkles className="h-2.5 w-2.5" /> AI Draft Ready ({ticket.aiSuggestion.confidenceScore}%)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <Clock className="h-3.5 w-3.5" />
          <span>SLA Target: {ticket.slaDeadline}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm sm:text-base font-bold text-foreground hover:text-brand-indigo transition-colors">
          <Link to={`/agent/resolve/${ticket.id}`}>{ticket.title}</Link>
        </h3>
        <p className="text-xs text-foreground-muted mt-1">
          From: <span className="font-semibold text-foreground">{ticket.customerName}</span> (
          {ticket.company}) &bull; Category:{' '}
          <span className="font-medium text-foreground">{ticket.category}</span>
        </p>
      </div>

      <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {ticket.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-surface-subtle text-[10px] text-foreground-muted font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          to={`/agent/resolve/${ticket.id}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold shadow-sm transition-all self-end sm:self-auto"
        >
          <span>Resolve Ticket</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

