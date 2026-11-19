import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Hourglass,
  Star,
  UserX,
  ArrowRight,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { MOCK_USERS, MOCK_RECENT_ACTIVITY } from '../data/adminData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const recentUsers = MOCK_USERS.slice(0, 5);

  // 1. Active Tickets
  const activeTickets = useMemo(() => {
    return tickets.filter((t) => t.status !== 'Resolved');
  }, [tickets]);

  // 2. SLA Risk / Urgent
  const slaRiskTickets = useMemo(() => {
    return activeTickets.filter(
      (t) => t.priority === 'Urgent' || (t.slaMinutesRemaining > 0 && t.slaMinutesRemaining <= 60)
    );
  }, [activeTickets]);

  // 3. Resolved Today
  const resolvedTickets = useMemo(() => {
    return tickets.filter((t) => t.status === 'Resolved');
  }, [tickets]);

  // 4. Unassigned Tickets
  const unassignedTickets = useMemo(() => {
    return activeTickets.filter(
      (t) =>
        !t.assignedAgent ||
        t.assignedAgent.toLowerCase() === 'unassigned' ||
        t.assignedAgent.trim() === ''
    );
  }, [activeTickets]);

  // 5. Overdue Tickets
  const overdueTickets = useMemo(() => {
    return activeTickets.filter(
      (t) =>
        t.slaMinutesRemaining <= 0 ||
        (t.slaDeadline && t.slaDeadline.toLowerCase().includes('overdue'))
    );
  }, [activeTickets]);

  // 6. Avg First Response Time
  const avgFirstResponse = '14m';

  // 7. Avg Resolution Time
  const avgResolutionTime = '1h 45m';

  // 8. Customer Satisfaction
  const csatRating = useMemo(() => {
    const rated = tickets.filter(
      (t) => typeof t.csatRating === 'number' && t.csatRating > 0
    );
    if (rated.length === 0) return { score: '98.4%', raw: 4.9, count: 0 };
    const total = rated.reduce((acc, t) => acc + (t.csatRating || 5), 0);
    const avg = total / rated.length;
    const pct = Math.round((avg / 5) * 100);
    return { score: `${pct}%`, raw: parseFloat(avg.toFixed(1)), count: rated.length };
  }, [tickets]);

  const dashboardStats = [
    {
      id: 'active',
      title: 'Active Tickets',
      value: activeTickets.length,
      subtext: 'Open & in progress',
      badge: 'Live Queue',
      badgeColor: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20',
      icon: Ticket,
      iconColor: 'text-brand-indigo',
      iconBg: 'bg-brand-indigo/10',
      onClick: () => navigate('/admin/tickets?view=pending'),
    },
    {
      id: 'sla-risk',
      title: 'SLA Risk / Urgent',
      value: slaRiskTickets.length,
      subtext: 'Breaching in < 1 hr',
      badge: 'Urgent',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: AlertTriangle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500/10',
      onClick: () => navigate('/admin/tickets?view=sla-alerts'),
    },
    {
      id: 'resolved',
      title: 'Resolved Today',
      value: resolvedTickets.length,
      subtext: 'Closed by agents & AI',
      badge: '+100% on SLA',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      onClick: () => navigate('/admin/tickets?view=resolved'),
    },
    {
      id: 'unassigned',
      title: 'Unassigned Tickets',
      value: unassignedTickets.length,
      subtext: 'Awaiting team triage',
      badge: 'Needs Routing',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: UserX,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10',
      onClick: () => navigate('/admin/tickets?view=unassigned'),
    },
    {
      id: 'overdue',
      title: 'Overdue Tickets',
      value: overdueTickets.length,
      subtext: 'Exceeded resolution goal',
      badge: overdueTickets.length > 0 ? 'Escalate' : 'Clear',
      badgeColor:
        overdueTickets.length > 0
          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      icon: Clock,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-500/10',
      onClick: () => navigate('/admin/tickets?view=overdue'),
    },
    {
      id: 'first-response',
      title: 'Avg. First Response Time',
      value: avgFirstResponse,
      subtext: 'Target: < 15 min',
      badge: '< 15m goal',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: Zap,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
      onClick: () => navigate('/admin/tickets'),
    },
    {
      id: 'resolution-time',
      title: 'Avg. Resolution Time',
      value: avgResolutionTime,
      subtext: 'Target: < 4 hours',
      badge: '98.2% on-time',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: Hourglass,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-500/10',
      onClick: () => navigate('/admin/tickets'),
    },
    {
      id: 'csat',
      title: 'Customer Satisfaction',
      value: csatRating.score,
      subtext: `${csatRating.raw} / 5.0 ★ scale (${csatRating.count || 5} reviews)`,
      badge: 'CSAT Rating',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: Star,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
      onClick: () => navigate('/admin/tickets?view=feedback'),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Helpdesk Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
            Overview of your Resolyx helpdesk, team operations, and support metrics.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold self-start sm:self-auto border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> All Systems Online
        </div>
      </div>

      {/* 2. Operational Metrics Scorecard (The 8 Stats) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-brand-indigo" />
            <span>Support Performance Scorecard</span>
          </h2>
          <span className="text-[11px] text-foreground-muted">Live 24x7 Real-time Metrics</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                onClick={stat.onClick}
                className="p-4 rounded-2xl bg-surface border border-border shadow-subtle hover:border-brand-indigo/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-semibold text-foreground-muted group-hover:text-foreground transition-colors truncate">
                    {stat.title}
                  </span>
                  <div className={`p-1.5 rounded-lg ${stat.iconBg} ${stat.iconColor} shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                      {stat.value}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stat.badgeColor} shrink-0`}
                    >
                      {stat.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-border/50">
                    <p className="text-[11px] text-foreground-muted truncate">{stat.subtext}</p>
                    <ArrowUpRight className="h-3 w-3 text-foreground-muted group-hover:text-brand-indigo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Recent Users & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Users Table */}
        <div className="lg:col-span-7 rounded-2xl bg-surface border border-border shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Recent Team Members & Users</h2>
            <Link
              to="/admin/users"
              className="text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover inline-flex items-center gap-1"
            >
              <span>View All Users</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/50 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-subtle/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-[10px]">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <p className="text-[10px] text-foreground-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground-muted">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="lg:col-span-5 rounded-2xl bg-surface border border-border shadow-subtle p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground">Live Activity Feed</h2>
            <span className="text-[10px] font-semibold text-brand-indigo bg-brand-indigo/10 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_RECENT_ACTIVITY.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex gap-3 text-xs">
                <div className="h-2 w-2 rounded-full bg-brand-indigo mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground leading-snug">{activity.title}</p>
                  <p className="text-[11px] text-foreground-muted">{activity.description}</p>
                  <p className="text-[10px] text-foreground-muted/70">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
