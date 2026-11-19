import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, Clock, AlertCircle, BookOpen, Users } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { AgentAiAssistCard } from '../components/AgentAiAssistCard';
import { AgentCustomerCard } from '../components/AgentCustomerCard';
import { KbInsertModal } from '../components/KbInsertModal';
import type { TicketStatus, AgentTicket } from '../types/agent.types';

export const AgentResolutionPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { tickets } = useTickets();
  const ticket: AgentTicket | undefined = tickets.find((t) => t.id === ticketId) || tickets[0];

  const [replyMode, setReplyMode] = useState<'public' | 'internal'>('public');
  const [replyText, setReplyText] = useState('');
  const [status, setStatus] = useState<TicketStatus>(ticket?.status || 'Open');
  const [isResolvedSuccess, setIsResolvedSuccess] = useState(false);
  const [isKbModalOpen, setIsKbModalOpen] = useState(false);

  if (!ticket) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="p-4 rounded-full bg-surface-subtle inline-block border border-border">
          <AlertCircle className="h-8 w-8 text-foreground-muted mx-auto" />
        </div>
        <h2 className="text-lg font-bold text-foreground">No Active Ticket Selected</h2>
        <p className="text-xs text-foreground-muted">
          There are currently no tickets in your queue. When a ticket arrives, click &quot;Resolve&quot; to open the Resolution Studio.
        </p>
        <div className="pt-2">
          <Link
            to="/agent"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Ticket Queue</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyAiDraft = () => {
    if (ticket.aiSuggestion) setReplyText(ticket.aiSuggestion.draftReply);
  };

  const handleInsertKb = (solution: string) => {
    setReplyText((prev) => (prev ? `${prev}\n\n${solution}` : solution));
  };

  const handleResolveAndSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setStatus('Resolved');
    setIsResolvedSuccess(true);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* 1. Header with Breadcrumbs & SLA Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            to="/agent"
            className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-foreground-muted hover:text-foreground transition-all"
            title="Back to queue"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-foreground-muted">{ticket.id}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {ticket.priority} Priority
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {status}
              </span>
              {ticket.assignedTeam && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                  <Users className="h-2.5 w-2.5" />
                  <span>{ticket.assignedTeam}</span>
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-bold text-foreground mt-0.5">{ticket.title}</h1>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold self-start sm:self-auto">
          <Clock className="h-4 w-4 animate-pulse" />
          <span>SLA Deadline: {ticket.slaDeadline} remaining</span>
        </div>
      </div>

      {/* 2. Customer Metadata Card */}
      <AgentCustomerCard ticket={ticket} />

      {/* 3. Customer Thread */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Customer Inquiry</h2>
        {ticket.conversation.map((msg) => (
          <div key={msg.id} className="p-4 rounded-xl bg-surface-subtle/70 border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">{msg.senderName} ({msg.senderRole || 'Client'})</span>
              <span className="text-foreground-muted font-mono text-[11px]">{msg.timestamp}</span>
            </div>
            <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* 4. AI Copilot Suggested Resolution Box */}
      {ticket.aiSuggestion && (
        <AgentAiAssistCard suggestion={ticket.aiSuggestion} onApplyDraft={handleApplyAiDraft} />
      )}

      {/* 5. Agent Reply & Resolution Editor */}
      <form onSubmit={handleResolveAndSend} className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReplyMode('public')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                replyMode === 'public' ? 'bg-brand-indigo text-white' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Public Reply
            </button>
            <button
              type="button"
              onClick={() => setReplyMode('internal')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                replyMode === 'internal' ? 'bg-amber-500 text-white' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Internal Note
            </button>
            <button
              type="button"
              onClick={() => setIsKbModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-brand-indigo/10 text-xs font-semibold text-foreground transition-all ml-1"
            >
              <BookOpen className="h-3.5 w-3.5 text-brand-indigo" />
              <span>Browse KB</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted hidden sm:inline">Set Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TicketStatus)}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface-subtle text-foreground text-xs font-medium focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="Investigating">Investigating</option>
              <option value="Suggested">Suggested</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalate to Manager</option>
            </select>
          </div>
        </div>

        <textarea
          rows={7}
          required
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={replyMode === 'public' ? 'Type resolution message or click "Apply AI Draft" / "Browse KB"...' : 'Add private notes for helpdesk team...'}
          className="w-full p-3.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo focus:outline-none font-sans leading-relaxed"
        />

        {isResolvedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Reply dispatched & Ticket marked as RESOLVED! SLA target achieved.</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-foreground-muted flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Notifies {ticket.customerEmail}</span>
          </p>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold shadow-sm transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send Reply & Resolve Ticket</span>
          </button>
        </div>
      </form>

      {/* KB Insertion Modal */}
      <KbInsertModal
        isOpen={isKbModalOpen}
        onClose={() => setIsKbModalOpen(false)}
        onInsertSolution={handleInsertKb}
      />
    </div>
  );
};
