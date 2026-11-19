import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, History } from 'lucide-react';
import { assignmentRulesApi } from '@/lib/assignmentRulesApi';
import type { AgentOption, AssignmentRule, ExecutionQuery, ExecutionStatus, RuleExecution } from '../../types/rule.types';
import { ErrorBanner, ExecutionStatusBadge, Spinner, inputClass } from './ui';
import { displayValue, formatDateTime } from './format';

const PAGE = 25;

interface Props {
  rules: AssignmentRule[];
  agents: AgentOption[];
}

const who = (agent: string | null, team: string | null) =>
  [agent, team && `${team} team`].filter(Boolean).join(' · ') || 'Unassigned';

export const ExecutionHistory: React.FC<Props> = ({ rules, agents }) => {
  const [filters, setFilters] = useState<ExecutionQuery>({});
  const [ticketInput, setTicketInput] = useState('');
  const [items, setItems] = useState<RuleExecution[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Debounce the ticket id search.
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, ticket_id: ticketInput.trim() || undefined })), 300);
    return () => clearTimeout(t);
  }, [ticketInput]);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const query: ExecutionQuery = {
          ...filters,
          date_from: filters.date_from ? `${filters.date_from}T00:00:00Z` : undefined,
          date_to: filters.date_to ? `${filters.date_to}T23:59:59Z` : undefined,
          limit: PAGE,
          offset,
        };
        const res = await assignmentRulesApi.executions(query, signal);
        setItems(res.items);
        setTotal(res.total);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError(e instanceof Error ? e.message : 'Could not load history.');
      } finally {
        setLoading(false);
      }
    },
    [filters, offset],
  );

  useEffect(() => {
    const ctrl = new AbortController();
    void load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const update = (patch: Partial<ExecutionQuery>) => {
    setOffset(0);
    setFilters((f) => ({ ...f, ...patch }));
  };
  const hasFilters = Boolean(filters.rule_id || filters.agent_id || filters.status || filters.date_from || filters.date_to || ticketInput);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
        <select aria-label="Filter by rule" value={filters.rule_id ?? ''} onChange={(e) => update({ rule_id: e.target.value ? Number(e.target.value) : undefined })} className={inputClass}>
          <option value="">All rules</option>
          {rules.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input aria-label="Filter by ticket ID" value={ticketInput} onChange={(e) => { setOffset(0); setTicketInput(e.target.value); }} placeholder="Ticket ID" className={inputClass} />
        <select aria-label="Filter by agent" value={filters.agent_id ?? ''} onChange={(e) => update({ agent_id: e.target.value ? Number(e.target.value) : undefined })} className={inputClass}>
          <option value="">All agents</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select aria-label="Filter by status" value={filters.status ?? ''} onChange={(e) => update({ status: (e.target.value || undefined) as ExecutionStatus | undefined })} className={inputClass}>
          <option value="">All statuses</option>
          <option value="assigned">Assigned</option>
          <option value="no_change">No change</option>
          <option value="skipped">Skipped</option>
          <option value="failed">Failed</option>
        </select>
        <input type="date" aria-label="From date" value={filters.date_from ?? ''} onChange={(e) => update({ date_from: e.target.value || undefined })} className={inputClass} />
        <input type="date" aria-label="To date" value={filters.date_to ?? ''} onChange={(e) => update({ date_to: e.target.value || undefined })} className={inputClass} />
      </div>

      {error && <ErrorBanner message={error} onRetry={() => void load()} />}

      <div className="rounded-xl border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/60 text-left text-xs font-semibold text-foreground-muted">
              <th className="px-3 py-2.5 w-8" />
              <th className="px-3 py-2.5">Ticket</th>
              <th className="px-3 py-2.5">Rule</th>
              <th className="px-3 py-2.5">Matched conditions</th>
              <th className="px-3 py-2.5">Previous assignee</th>
              <th className="px-3 py-2.5">New assignee</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Executed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && items.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-foreground-muted"><Spinner className="inline mr-2" />Loading history…</td></tr>
            )}
            {!loading && items.length === 0 && !error && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <History className="mx-auto h-6 w-6 text-foreground-muted mb-2" />
                  <p className="text-sm font-medium text-foreground">{hasFilters ? 'No executions match these filters' : 'No executions yet'}</p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {hasFilters ? 'Try widening the date range or clearing filters.' : 'Rule runs appear here when tickets are created or updated.'}
                  </p>
                </td>
              </tr>
            )}
            {items.map((e) => {
              const passed = e.matched_conditions.filter((c) => c.passed).length;
              const isOpen = expanded === e.id;
              return (
                <React.Fragment key={e.id}>
                  <tr className="hover:bg-surface-subtle/40 align-top">
                    <td className="px-3 py-2.5">
                      <button type="button" aria-label={isOpen ? 'Hide reason' : 'Show reason'} aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : e.id)} className="text-foreground-muted hover:text-foreground">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs font-semibold text-brand-indigo whitespace-nowrap">{e.ticket_number}</td>
                    <td className="px-3 py-2.5 text-foreground">
                      {e.rule_name}
                      {e.rule_id === null && <span className="ml-1 text-[11px] text-foreground-muted">(deleted)</span>}
                      <p className="text-[11px] text-foreground-muted">{e.trigger === 'ticket_created' ? 'On create' : 'On update'}</p>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-foreground-muted">{passed} of {e.matched_conditions.length}</td>
                    <td className="px-3 py-2.5 text-xs text-foreground">{who(e.previous_agent_name, e.previous_team_name)}</td>
                    <td className="px-3 py-2.5 text-xs text-foreground font-medium">
                      {e.execution_status === 'assigned' || e.execution_status === 'no_change' ? who(e.assigned_agent_name, e.assigned_team_name) : '—'}
                    </td>
                    <td className="px-3 py-2.5"><ExecutionStatusBadge status={e.execution_status} /></td>
                    <td className="px-3 py-2.5 text-xs text-foreground-muted whitespace-nowrap">{formatDateTime(e.executed_at)}</td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-surface-subtle/40">
                      <td />
                      <td colSpan={7} className="px-3 py-3 text-xs space-y-2">
                        <p className="text-foreground"><span className="font-semibold">Reason:</span> {e.execution_reason}</p>
                        <ul className="space-y-0.5">
                          {e.matched_conditions.map((c) => (
                            <li key={c.path} className={c.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                              {c.passed ? '✓' : '✗'} {c.field_label} {c.operator_label.toLowerCase()} {displayValue(c.expected)}
                              <span className="text-foreground-muted"> (was {displayValue(c.actual)})</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {total > PAGE && (
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span>{offset + 1}–{Math.min(offset + PAGE, total)} of {total}</span>
          <div className="flex gap-2">
            <button type="button" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))} className="h-8 px-3 rounded-lg border border-border text-foreground disabled:opacity-50">Previous</button>
            <button type="button" disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)} className="h-8 px-3 rounded-lg border border-border text-foreground disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};
