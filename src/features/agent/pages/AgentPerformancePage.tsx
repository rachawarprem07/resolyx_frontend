import React from 'react';
import { Award, Clock, Star, CheckCircle, TrendingUp } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';

export const AgentPerformancePage: React.FC = () => {
  const { tickets } = useTickets();
  const resolvedTickets = tickets.filter((t) => t.status === 'Resolved');

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          My Performance & SLA Scorecard
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
          Your personal ticket resolution metrics, SLA compliance rate, and customer satisfaction.
        </p>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-semibold">SLA Compliance Rate</span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">100%</p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Target on track (&gt; 98%)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-semibold">Customer CSAT</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">5.0 / 5.0</p>
          <p className="text-xs text-foreground-muted">
            {resolvedTickets.length > 0 ? `Based on ${resolvedTickets.length} reviews` : 'Awaiting feedback'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-semibold">Resolved Tickets</span>
            <Clock className="h-4 w-4 text-brand-indigo" />
          </div>
          <p className="text-3xl font-bold text-foreground">{resolvedTickets.length}</p>
          <p className="text-xs text-foreground-muted">Resolved in current shift</p>
        </div>
      </div>

      {/* 3. Daily Breakdown Table */}
      <div className="rounded-2xl bg-surface border border-border shadow-subtle p-5 space-y-4">
        <h2 className="text-sm font-bold text-foreground">Recent Shift Activity</h2>
        <div className="space-y-3">
          {resolvedTickets.length === 0 ? (
            <div className="py-8 text-center text-xs text-foreground-muted">
              No tickets resolved in this shift yet. Triaged tickets will appear here.
            </div>
          ) : (
            resolvedTickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold text-foreground">{t.id}: {t.title}</span>
                </div>
                <span className="text-foreground-muted font-mono">{t.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
