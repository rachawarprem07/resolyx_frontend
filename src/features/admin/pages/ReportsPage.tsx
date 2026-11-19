import React, { useState } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Building2, Sparkles } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const weeklyData = [
    { day: 'Mon', total: 420, resolved: 360 },
    { day: 'Tue', total: 580, resolved: 490 },
    { day: 'Wed', total: 640, resolved: 540 },
    { day: 'Thu', total: 590, resolved: 510 },
    { day: 'Fri', total: 520, resolved: 440 },
    { day: 'Sat', total: 210, resolved: 190 },
    { day: 'Sun', total: 180, resolved: 165 },
  ];

  const maxVal = 700;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
            Platform performance metrics, ticket throughput, and AI assistance analytics.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                period === p
                  ? 'bg-brand-indigo text-white'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 4 Metric Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground-muted font-medium">Ticket Volume</span>
            <BarChart3 className="h-4 w-4 text-brand-indigo" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">28,940</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +18% vs previous period
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground-muted font-medium">Resolved Tickets</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">23,846</p>
          <span className="text-[11px] text-foreground-muted mt-1 block">
            82.4% resolution rate
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground-muted font-medium">Organization Usage</span>
            <Building2 className="h-4 w-4 text-brand-indigo" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">148 Orgs</p>
          <span className="text-[11px] text-foreground-muted mt-1 block">3,420 platform users</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-brand-violet/30 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground-muted font-medium">AI Usage</span>
            <Sparkles className="h-4 w-4 text-brand-violet" />
          </div>
          <p className="text-2xl font-bold text-brand-violet mt-2">184.2k</p>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            91.2% suggestion accept
          </span>
        </div>
      </div>

      {/* 3. Charts & Usage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Ticket Volume Bar Chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">Ticket Volume & Resolutions</h2>
              <p className="text-xs text-foreground-muted">
                Incoming tickets vs successfully resolved
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-foreground-muted">
                <span className="h-2.5 w-2.5 rounded-sm bg-brand-indigo/30" /> Total
              </span>
              <span className="flex items-center gap-1.5 text-foreground-muted">
                <span className="h-2.5 w-2.5 rounded-sm bg-brand-indigo" /> Resolved
              </span>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-4">
            {weeklyData.map((item) => (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
              >
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  {/* Total Bar */}
                  <div
                    style={{ height: `${(item.total / maxVal) * 100}%` }}
                    className="w-1/2 bg-brand-indigo/30 rounded-t-sm transition-all"
                    title={`Total: ${item.total}`}
                  />
                  {/* Resolved Bar */}
                  <div
                    style={{ height: `${(item.resolved / maxVal) * 100}%` }}
                    className="w-1/2 bg-brand-indigo rounded-t-sm transition-all"
                    title={`Resolved: ${item.resolved}`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-foreground-muted">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Organizations Usage */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground">Top Client Usage</h2>
            <p className="text-xs text-foreground-muted">Most active enterprise accounts</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Nordic FinTech Group', tickets: '8,420 tickets', pct: 85 },
              { name: 'Apex Systems', tickets: '6,140 tickets', pct: 68 },
              { name: 'CloudScale Logistics', tickets: '4,280 tickets', pct: 45 },
              { name: 'BioHealth Informatics', tickets: '2,910 tickets', pct: 32 },
            ].map((org) => (
              <div key={org.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground truncate">{org.name}</span>
                  <span className="text-foreground-muted">{org.tickets}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
                  <div
                    style={{ width: `${org.pct}%` }}
                    className="h-full bg-brand-indigo rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
