import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FlaskConical, GitFork, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { assignmentRulesApi } from '@/lib/assignmentRulesApi';
import type {
  AgentOption,
  AssignmentRule,
  AssignmentRuleStats,
  FieldsMetadata,
  RuleListQuery,
  TeamOption,
} from '../types/rule.types';
import { AgentAvailability } from '../components/assignment-rules/AgentAvailability';
import { ExecutionHistory } from '../components/assignment-rules/ExecutionHistory';
import { RuleEditorDrawer } from '../components/assignment-rules/RuleEditorDrawer';
import { RuleTestModal } from '../components/assignment-rules/RuleTestModal';
import { RuleViewModal } from '../components/assignment-rules/RuleViewModal';
import { RulesTable } from '../components/assignment-rules/RulesTable';
import { ErrorBanner, Modal, Spinner, inputClass } from '../components/assignment-rules/ui';

type Tab = 'rules' | 'history' | 'agents';

interface Lookups {
  meta: FieldsMetadata;
  agents: AgentOption[];
  teams: TeamOption[];
}

const StatCard: React.FC<{ label: string; value: number | string; accent?: string }> = ({ label, value, accent }) => (
  <div className="rounded-xl border border-border bg-surface px-4 py-3">
    <p className="text-xs font-medium text-foreground-muted">{label}</p>
    <p className={cn('mt-1 text-2xl font-semibold tracking-tight text-foreground', accent)}>{value}</p>
  </div>
);

export const AssignmentRulesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('rules');
  const [lookups, setLookups] = useState<Lookups | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [rules, setRules] = useState<AssignmentRule[]>([]);
  const [allRules, setAllRules] = useState<AssignmentRule[]>([]);
  const [stats, setStats] = useState<AssignmentRuleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState<RuleListQuery>({ sort: 'priority_asc' });

  const [editor, setEditor] = useState<{ open: boolean; rule: AssignmentRule | null }>({ open: false, rule: null });
  const [viewing, setViewing] = useState<AssignmentRule | null>(null);
  const [deleting, setDeleting] = useState<AssignmentRule | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };

  const loadLookups = useCallback(async () => {
    setLookupError(null);
    try {
      const [meta, agents, teams] = await Promise.all([
        assignmentRulesApi.fields(),
        assignmentRulesApi.agents(),
        assignmentRulesApi.teams(),
      ]);
      setLookups({ meta, agents, teams });
    } catch (e) {
      setLookupError(e instanceof Error ? e.message : 'Could not load assignment settings.');
    }
  }, []);

  const loadRules = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setListError(null);
    try {
      const res = await assignmentRulesApi.list(query, signal);
      setRules(res.items);
      setStats(res.stats);
      const unfiltered = !query.search && !query.status && !query.assignment_type;
      if (unfiltered) setAllRules(res.items);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setListError(e instanceof Error ? e.message : 'Could not load rules.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    const ctrl = new AbortController();
    void loadRules(ctrl.signal);
    return () => ctrl.abort();
  }, [loadRules]);

  useEffect(() => {
    const t = setTimeout(() => setQuery((q) => ({ ...q, search: searchInput.trim() || undefined })), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // The full list (for history filters & next priority) is fetched once if a filter was active on load.
  useEffect(() => {
    if (allRules.length || !stats?.total_rules) return;
    assignmentRulesApi.list({ sort: 'priority_asc' }).then((r) => setAllRules(r.items)).catch(() => undefined);
  }, [allRules.length, stats?.total_rules]);

  const nextPriority = useMemo(
    () => (allRules.length ? Math.max(...allRules.map((r) => r.priority)) + 10 : 10),
    [allRules],
  );

  const refreshAll = async () => {
    await loadRules();
    const all = await assignmentRulesApi.list({ sort: 'priority_asc' }).catch(() => null);
    if (all) setAllRules(all.items);
  };

  const runAction = async (rule: AssignmentRule, fn: () => Promise<unknown>, message: string) => {
    setBusyId(rule.id);
    setActionError(null);
    try {
      await fn();
      await refreshAll();
      notify(message);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const hasFilters = Boolean(query.search || query.status || query.assignment_type);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
            <GitFork className="h-6 w-6 text-brand-indigo" /> Assignment Rules
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Route new and updated tickets to the right agent or team automatically. Rules run in priority order.
          </p>
        </div>
        <div className="flex shrink-0 gap-2 whitespace-nowrap">
          <button
            type="button"
            disabled={!lookups}
            onClick={() => setPreviewOpen(true)}
            className="h-9 px-3.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-sm font-medium text-foreground inline-flex items-center gap-2 disabled:opacity-50"
          >
            <FlaskConical className="h-4 w-4 text-brand-indigo" /> Preview assignment
          </button>
          <button
            type="button"
            disabled={!lookups}
            onClick={() => setEditor({ open: true, rule: null })}
            className="h-9 px-4 rounded-lg bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Create rule
          </button>
        </div>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 right-6 z-[70] flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-surface px-4 py-2.5 text-sm text-foreground shadow-elevated">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {toast}
        </div>
      )}

      {lookupError && (
        <ErrorBanner
          message={lookupError}
          onRetry={() => {
            void loadLookups();
            void loadRules();
          }}
        />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total rules" value={stats?.total_rules ?? '—'} />
        <StatCard label="Active rules" value={stats?.active_rules ?? '—'} accent="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Inactive rules" value={stats?.inactive_rules ?? '—'} />
        <StatCard label="Tickets assigned automatically" value={stats?.tickets_assigned_automatically ?? '—'} accent="text-brand-indigo" />
      </div>

      <div role="tablist" aria-label="Assignment rules sections" className="flex gap-1 border-b border-border">
        {([
          ['rules', 'Rules'],
          ['history', 'Execution history'],
          ['agents', 'Agent availability'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              '-mb-px px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              tab === key ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-foreground-muted hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'rules' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search rules by name or description"
                aria-label="Search rules"
                className={cn(inputClass, 'pl-9')}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 lg:w-[34rem]">
              <select aria-label="Filter by status" value={query.status ?? ''} onChange={(e) => setQuery((q) => ({ ...q, status: (e.target.value || undefined) as RuleListQuery['status'] }))} className={inputClass}>
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select aria-label="Filter by assignment type" value={query.assignment_type ?? ''} onChange={(e) => setQuery((q) => ({ ...q, assignment_type: (e.target.value || undefined) as RuleListQuery['assignment_type'] }))} className={inputClass}>
                <option value="">All types</option>
                <option value="agent">Agent</option>
                <option value="team">Team</option>
                <option value="round_robin">Round Robin</option>
                <option value="least_assigned">Least Assigned</option>
              </select>
              <select aria-label="Sort rules" value={query.sort} onChange={(e) => setQuery((q) => ({ ...q, sort: e.target.value as RuleListQuery['sort'] }))} className={inputClass}>
                <option value="priority_asc">Priority: first → last</option>
                <option value="priority_desc">Priority: last → first</option>
                <option value="updated_desc">Recently modified</option>
                <option value="name_asc">Name A–Z</option>
              </select>
            </div>
          </div>

          {actionError && <ErrorBanner message={actionError} />}
          {listError && listError !== lookupError && <ErrorBanner message={listError} onRetry={() => void loadRules()} />}

          {loading && rules.length === 0 && !listError ? (
            <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center text-sm text-foreground-muted">
              <Spinner className="inline mr-2" /> Loading rules…
            </div>
          ) : !listError && rules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-14 text-center">
              <GitFork className="mx-auto h-7 w-7 text-foreground-muted mb-3" />
              <p className="text-sm font-semibold text-foreground">{hasFilters ? 'No rules match your filters' : 'No assignment rules yet'}</p>
              <p className="text-sm text-foreground-muted mt-1 max-w-md mx-auto">
                {hasFilters
                  ? 'Clear the search or filters to see all rules.'
                  : 'Create a rule to assign tickets automatically, for example sending urgent enterprise tickets to Tier 2 in round robin.'}
              </p>
              {!hasFilters && lookups && (
                <button type="button" onClick={() => setEditor({ open: true, rule: null })} className="mt-4 h-9 px-4 rounded-lg bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Create your first rule
                </button>
              )}
            </div>
          ) : (
            rules.length > 0 && (
              <RulesTable
                rules={rules}
                busyId={busyId}
                onView={setViewing}
                onEdit={(r) => setEditor({ open: true, rule: r })}
                onDuplicate={(r) => runAction(r, () => assignmentRulesApi.duplicate(r.id), `Duplicated “${r.name}” (inactive copy).`)}
                onToggle={(r) =>
                  runAction(r, () => assignmentRulesApi.setStatus(r.id, !r.is_active), `“${r.name}” ${r.is_active ? 'deactivated' : 'activated'}.`)
                }
                onDelete={setDeleting}
              />
            )
          )}
        </div>
      )}

      {tab === 'history' && <ExecutionHistory rules={allRules} agents={lookups?.agents ?? []} />}

      {tab === 'agents' &&
        (lookups ? (
          <AgentAvailability
            agents={lookups.agents}
            teams={lookups.teams}
            onChange={(a) => setLookups((l) => (l ? { ...l, agents: l.agents.map((x) => (x.id === a.id ? a : x)) } : l))}
          />
        ) : (
          !lookupError && <p className="text-sm text-foreground-muted"><Spinner className="inline mr-2" />Loading agents…</p>
        ))}

      {lookups && (
        <RuleEditorDrawer
          open={editor.open}
          rule={editor.rule}
          meta={lookups.meta}
          agents={lookups.agents}
          teams={lookups.teams}
          nextPriority={nextPriority}
          onClose={() => setEditor({ open: false, rule: null })}
          onSaved={(saved, isNew) => {
            setEditor({ open: false, rule: null });
            void refreshAll();
            notify(isNew ? `Rule “${saved.name}” created.` : `Rule “${saved.name}” saved.`);
          }}
        />
      )}

      {lookups && previewOpen && (
        <RuleTestModal open={previewOpen} onClose={() => setPreviewOpen(false)} meta={lookups.meta} mode={{ kind: 'preview' }} />
      )}

      <RuleViewModal
        rule={viewing}
        onClose={() => setViewing(null)}
        onEdit={(r) => {
          setViewing(null);
          setEditor({ open: true, rule: r });
        }}
      />

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        size="md"
        title="Delete assignment rule?"
        footer={
          <>
            <button type="button" onClick={() => setDeleting(null)} className="h-9 px-4 rounded-lg text-sm font-medium text-foreground-muted hover:bg-surface-subtle">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const r = deleting!;
                setDeleting(null);
                void runAction(r, () => assignmentRulesApi.remove(r.id), `Rule “${r.name}” deleted.`);
              }}
              className="h-9 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
            >
              Delete rule
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground">
          <span className="font-semibold">{deleting?.name}</span> will stop assigning tickets immediately. Existing ticket
          assignments and execution history are kept. Consider deactivating it instead if you may need it again.
        </p>
      </Modal>
    </div>
  );
};
