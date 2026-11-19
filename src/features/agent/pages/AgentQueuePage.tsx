import React, { useState } from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Search,
  Zap,
} from 'lucide-react';
import { AGENT_STATS } from '../data/agentData';
import { useTickets } from '@/hooks/useTickets';
import { AgentTicketCard } from '../components/AgentTicketCard';

export const AgentQueuePage: React.FC = () => {
  const { tickets } = useTickets();
  const [activeTab, setActiveTab] = useState<'assigned' | 'urgent' | 'resolved'>('assigned');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const assignedCount = tickets.filter((t) => t.status !== 'Resolved').length;
  const urgentCount = tickets.filter((t) => t.priority === 'Urgent' || (t.slaMinutesRemaining <= 120 && t.status !== 'Resolved')).length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'urgent' && t.slaMinutesRemaining > 120 && t.priority !== 'Urgent') {
      return false;
    }
    if (activeTab === 'resolved' && t.status !== 'Resolved') {
      return false;
    }
    if (activeTab === 'assigned' && t.status === 'Resolved') {
      return false;
    }

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          My Ticket Queue
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
          Prioritized resolution queue assigned to you. Use AI Copilot drafts to resolve customer inquiries faster.
        </p>
      </div>

      {/* 2. Quick Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-xs font-semibold">Assigned To Me</span>
            <Inbox className="h-4 w-4 text-brand-indigo" />
          </div>
          <span className="text-2xl font-bold text-foreground">{assignedCount}</span>
          <span className="text-[11px] text-foreground-muted block mt-0.5">Active triage queue</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-rose-500/30 shadow-subtle">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-1">
            <span className="text-xs font-semibold">Breaching Soon</span>
            <Clock className="h-4 w-4 animate-pulse" />
          </div>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {urgentCount}
          </span>
          <span className="text-[11px] text-rose-500/80 block mt-0.5">&lt; 2h SLA deadline</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-xs font-semibold">Resolved Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-foreground">{resolvedCount}</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
            Shift progress
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-xs font-semibold">Avg Resolution</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-foreground">{tickets.length > 0 ? `${AGENT_STATS.avgResponseMinutes}m` : '--'}</span>
          <span className="text-[11px] text-foreground-muted block mt-0.5">Powered by AI drafts</span>
        </div>
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface border border-border shadow-subtle">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('assigned')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'assigned'
                ? 'bg-brand-indigo text-white'
                : 'bg-surface-subtle text-foreground-muted hover:text-foreground'
            }`}
          >
            Assigned Queue ({assignedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'urgent'
                ? 'bg-rose-500 text-white'
                : 'bg-surface-subtle text-foreground-muted hover:text-foreground'
            }`}
          >
            🚨 Urgent Breaching ({urgentCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'resolved'
                ? 'bg-emerald-600 text-white'
                : 'bg-surface-subtle text-foreground-muted hover:text-foreground'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search tickets, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
        </div>
      </div>

      {/* 4. Ticket Cards List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-surface border border-border p-8">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground">Your ticket queue is clear!</p>
            <p className="text-xs text-foreground-muted mt-1">No active tickets currently assigned.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <AgentTicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
      </div>
    </div>
  );
};
