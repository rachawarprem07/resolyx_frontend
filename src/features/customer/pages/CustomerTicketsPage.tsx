import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Send,
  X,
  MessageSquare,
  BookOpen,
  Layers,
} from 'lucide-react';
import { createTicket, updateTicket } from '@/lib/ticketsStorage';
import { metaOf } from '@/lib/ticketsApi';
import { useTickets } from '@/hooks/useTickets';
import { getCurrentUser } from '@/lib/authSession';
import type { AgentTicket, TicketMessage, TicketPriority, TicketStatus } from '@/features/agent/types/agent.types';

const SLA_HOURS: Record<TicketPriority, number> = { Urgent: 1, High: 4, Medium: 8, Low: 24 };

export const CustomerTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const { tickets, syncError } = useTickets();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Investigating' | 'Resolved'>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<AgentTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New ticket form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Technical Support');
  const [newPriority, setNewPriority] = useState<TicketPriority>('Medium');
  const [newDescription, setNewDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{ title?: string; description?: string; submit?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // The API returns only the signed-in customer's tickets.
  const myTickets = tickets;

  // Apply search and status filters
  const filteredTickets = useMemo(() => {
    return myTickets.filter((t) => {
      // Status filter
      if (statusFilter === 'Open' && t.status !== 'Open') return false;
      if (statusFilter === 'Investigating' && t.status !== 'Investigating' && t.status !== 'Suggested') return false;
      if (statusFilter === 'Resolved' && t.status !== 'Resolved') return false;

      // Priority filter
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;

      // Search query
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      const inId = t.id.toLowerCase().includes(q);
      const inTitle = t.title.toLowerCase().includes(q);
      const inCat = (t.category || '').toLowerCase().includes(q);
      const inAgent = (t.assignedAgent || '').toLowerCase().includes(q);
      const inMsg = (t.conversation || []).some((m) => m.content.toLowerCase().includes(q));

      return inId || inTitle || inCat || inAgent || inMsg;
    });
  }, [myTickets, statusFilter, priorityFilter, search]);

  // KPI Metrics
  const totalCount = myTickets.length;
  const activeCount = myTickets.filter((t) => t.status === 'Open' || t.status === 'Investigating' || t.status === 'Suggested').length;
  const investigatingCount = myTickets.filter((t) => t.status === 'Investigating' || t.status === 'Suggested').length;
  const resolvedCount = myTickets.filter((t) => t.status === 'Resolved').length;

  // Handle Create Ticket submission (assignment rules run on the backend)
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { title?: string; description?: string } = {};
    if (!newTitle.trim()) errors.title = 'Please enter a ticket subject';
    if (!newDescription.trim()) errors.description = 'Please describe the issue or request';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsSubmitting(true);

    const initialMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      senderName: currentUser.name || 'Customer',
      timestamp: new Date().toISOString(),
      content: newDescription.trim(),
    };

    try {
      const created = await createTicket({
        subject: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        priority: newPriority,
        status: 'Open',
        source: 'Web Portal',
        customer_name: currentUser.name,
        customer_company: currentUser.department,
        tags: [newCategory, 'Portal Submission'],
        due_date: new Date(Date.now() + SLA_HOURS[newPriority] * 3600 * 1000).toISOString(),
        meta: { conversation: [initialMessage] },
      });

      setNewTitle('');
      setNewDescription('');
      setNewPriority('Medium');
      setIsCreateOpen(false);
      setSuccessToast(`Ticket #${created.id} created successfully! Our support team has been notified.`);
      setTimeout(() => setSuccessToast(null), 4000);
      setSelectedTicket(created);
    } catch (err) {
      setFormErrors({ submit: err instanceof Error ? err.message : 'Could not create the ticket. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle customer message reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      senderName: currentUser.name || 'Customer',
      timestamp: new Date().toISOString(),
      content: replyText.trim(),
    };
    const nextTicket: AgentTicket = {
      ...selectedTicket,
      conversation: [...(selectedTicket.conversation || []), newMessage],
    };

    setReplyError(null);
    try {
      const updated = await updateTicket(selectedTicket.id, {
        meta: metaOf(nextTicket),
        ...(selectedTicket.status === 'Resolved' ? { status: 'Open' } : {}),
      });
      setSelectedTicket(updated);
      setReplyText('');
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : 'Could not send your reply.');
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Resolved</span>
          </span>
        );
      case 'Investigating':
      case 'Suggested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            <span>In Progress</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
            <Clock className="h-3.5 w-3.5" />
            <span>Open</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <AlertTriangle className="h-3 w-3" />
            Urgent
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-surface-subtle text-foreground-muted border border-border">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Toast Notification */}
      {syncError && (
        <div role="alert" className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 text-xs text-rose-600 dark:text-rose-400">
          Could not refresh your tickets: {syncError}
        </div>
      )}

      {successToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Support Tickets
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
              {myTickets.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Track, update, and submit technical requests directly to the Resolyx engineering team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/customer/kb')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-foreground text-xs sm:text-sm font-semibold transition-colors"
          >
            <BookOpen className="h-4 w-4 text-brand-indigo" />
            <span>Search Knowledge Base</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs sm:text-sm font-bold shadow-sm shadow-brand-indigo/30 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Ticket</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Scorecard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-indigo" />
            Total Requests
          </span>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{totalCount}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            Active Requests
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
            {activeCount}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            In Progress
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {investigatingCount}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Resolved
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {resolvedCount}
          </div>
        </div>
      </div>

      {/* 3. Search and Status Filters */}
      <div className="p-4 rounded-2xl bg-surface border border-border space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(['All', 'Open', 'Investigating', 'Resolved'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  statusFilter === tab
                    ? 'bg-brand-indigo text-white shadow-sm'
                    : 'bg-surface-subtle text-foreground-muted hover:text-foreground border border-border'
                }`}
              >
                {tab === 'All' ? 'All Tickets' : tab === 'Investigating' ? 'In Progress' : tab}
              </button>
            ))}
          </div>

          {/* Search Box & Priority Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full h-9 pl-9 pr-8 rounded-xl border border-border bg-surface-subtle text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-foreground-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-border bg-surface-subtle text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Ticket List */}
      {filteredTickets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center mx-auto">
            <Ticket className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {search || statusFilter !== 'All'
                ? 'No tickets match your filters'
                : 'No support requests yet'}
            </h3>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1.5 leading-relaxed">
              {search || statusFilter !== 'All'
                ? 'Try resetting your search query or status filter to see other tickets.'
                : 'Whenever you experience an issue or have a technical inquiry, submit a ticket and our engineering team will assist you.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {(search || statusFilter !== 'All' || priorityFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-surface-subtle border border-border text-xs font-semibold hover:bg-surface transition-colors"
              >
                Reset Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo text-white text-xs sm:text-sm font-semibold hover:bg-brand-indigo-hover shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Ticket</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const messagesCount = ticket.conversation?.length || 1;
            const lastMsg = ticket.conversation?.[ticket.conversation.length - 1];

            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="group p-5 rounded-2xl border border-border bg-surface hover:border-brand-indigo/50 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-brand-indigo px-2 py-0.5 rounded-md bg-brand-indigo/10 border border-brand-indigo/20">
                      {ticket.id}
                    </span>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                    <span className="text-xs text-foreground-muted font-medium px-2 py-0.5 rounded-md bg-surface-subtle border border-border">
                      {ticket.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-brand-indigo transition-colors truncate">
                    {ticket.title}
                  </h3>

                  {lastMsg && (
                    <p className="text-xs text-foreground-muted line-clamp-1">
                      <span className="font-semibold text-foreground">
                        {lastMsg.sender === 'customer' ? 'You: ' : 'Support: '}
                      </span>
                      {lastMsg.content}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 text-xs text-foreground-muted shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <span className="flex items-center gap-1 font-medium">
                    <MessageSquare className="h-3.5 w-3.5 text-brand-indigo" />
                    <span>{messagesCount} {messagesCount === 1 ? 'Message' : 'Messages'}</span>
                  </span>

                  <span className="text-[11px] text-foreground-muted font-medium">
                    Assigned: <strong className="text-foreground">{ticket.assignedAgent || 'Support Team'}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Create New Ticket Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden text-foreground">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface/50">
              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-brand-indigo" />
                  <span>Submit Support Request</span>
                </h2>
                <p className="text-xs text-foreground-muted">
                  Provide detailed information to help our engineers diagnose your issue quickly.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-left">
              {formErrors.submit && (
                <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
                  {formErrors.submit}
                </p>
              )}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1.5">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Database replication delay on cluster us-east-1"
                  className={`w-full h-10 px-3.5 rounded-xl border bg-surface-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 ${
                    formErrors.title
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-border focus:border-brand-indigo focus:ring-brand-indigo/20'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-surface-subtle text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-indigo/20"
                  >
                    <option value="Technical Support">Technical Support</option>
                    <option value="Infrastructure & Cloud">Infrastructure & Cloud</option>
                    <option value="Database & Storage">Database & Storage</option>
                    <option value="Authentication & Security">Authentication & Security</option>
                    <option value="Billing & Invoicing">Billing & Invoicing</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1.5">
                    Priority & SLA
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-surface-subtle text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-indigo/20"
                  >
                    <option value="Urgent">Urgent (1 hour SLA)</option>
                    <option value="High">High (4 hours SLA)</option>
                    <option value="Medium">Medium (8 hours SLA)</option>
                    <option value="Low">Low (24 hours SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the symptoms, steps to reproduce, error codes, and impacted environments..."
                  className={`w-full p-3.5 rounded-xl border bg-surface-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 ${
                    formErrors.description
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-border focus:border-brand-indigo focus:ring-brand-indigo/20'
                  }`}
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.description}</p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-surface-subtle transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs sm:text-sm font-bold shadow-sm shadow-brand-indigo/30 transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Ticket Conversation & Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden text-foreground">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4 bg-surface/50">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-brand-indigo px-2.5 py-0.5 rounded-md bg-brand-indigo/10 border border-brand-indigo/20">
                    {selectedTicket.id}
                  </span>
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-subtle border border-border">
                    {selectedTicket.category}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                  {selectedTicket.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conversation Timeline */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {selectedTicket.conversation && selectedTicket.conversation.length > 0 ? (
                selectedTicket.conversation.map((msg) => {
                  const isMe = msg.sender === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-foreground-muted px-1">
                        <span className="font-bold text-foreground">
                          {isMe ? 'You' : msg.senderName || 'Support Agent'}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-brand-indigo text-white rounded-tr-sm shadow-sm'
                            : 'bg-surface-subtle border border-border text-foreground rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-foreground-muted text-xs">
                  No conversation history recorded.
                </div>
              )}
            </div>

            {/* Customer Reply Input */}
            {replyError && (
              <p role="alert" className="px-4 pt-3 text-xs text-rose-600 dark:text-rose-400">{replyError}</p>
            )}
            <form onSubmit={handleSendReply} className="p-4 border-t border-border bg-surface-subtle flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a follow-up reply to the engineering team..."
                className="flex-1 h-11 px-4 rounded-xl border border-border bg-surface text-xs sm:text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="h-11 px-4 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
