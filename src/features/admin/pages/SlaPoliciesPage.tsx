import React from 'react';
import { Clock, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import { SlaPoliciesSection } from '../components/settings/SlaPoliciesSection';

export const SlaPoliciesPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Clock className="h-7 w-7 text-brand-indigo" />
          SLA Policies & Commitments
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
          Define global response time agreements, priority escalation thresholds, and resolution targets.
        </p>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-indigo/10 text-brand-indigo">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground-muted">Configured Tiers</span>
            <p className="text-xl font-bold text-foreground">5 Policies</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground-muted">Critical Tier Target</span>
            <p className="text-xl font-bold text-foreground">1 Hour SLA</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground-muted">SLA Compliance Rate</span>
            <p className="text-xl font-bold text-foreground">98.4%</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground-muted">Active Assignment</span>
            <p className="text-xl font-bold text-foreground">Teams & Rules</p>
          </div>
        </div>
      </div>

      {/* 3. Main SLA Management Table & CRUD Section */}
      <SlaPoliciesSection />
    </div>
  );
};

