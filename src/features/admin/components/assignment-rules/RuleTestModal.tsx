import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, FlaskConical, Info, Play, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { assignmentRulesApi } from '@/lib/assignmentRulesApi';
import { ticketsApi, type ApiTicket } from '@/lib/ticketsApi';
import { ApiError } from '@/lib/http';
import type {
  AssignmentRulePayload,
  AssignmentTarget,
  ConditionTrace,
  FieldsMetadata,
  PreviewResult,
  RuleEvaluation,
  SampleTicket,
  TicketTarget,
} from '../../types/rule.types';
import { getField } from './conditionTree';
import { ErrorBanner, ExecutionStatusBadge, Label, Modal, Spinner, inputClass } from './ui';
import { displayValue } from './format';

export type TestMode =
  | { kind: 'rule'; ruleId?: number; draft: AssignmentRulePayload }
  | { kind: 'preview' };

interface Props {
  open: boolean;
  onClose: () => void;
  mode: TestMode;
  meta: FieldsMetadata;
}

type Result =
  | { kind: 'rule'; evaluation: RuleEvaluation; ticketRef: string; changes: boolean }
  | { kind: 'preview'; preview: PreviewResult };

const SAMPLE_DEFAULT: SampleTicket = {
  subject: '',
  status: 'Open',
  priority: 'High',
  category: 'Technical Support',
  customer_type: 'Enterprise',
  source: 'Web Portal',
  tags: [],
};

export const RuleTestModal: React.FC<Props> = ({ open, onClose, mode, meta }) => {
  const [source, setSource] = useState<'ticket' | 'sample'>('ticket');
  const [tickets, setTickets] = useState<ApiTicket[] | null>(null);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState('');
  const [ticketQuery, setTicketQuery] = useState('');
  const [sample, setSample] = useState<SampleTicket>(SAMPLE_DEFAULT);
  const [tagsText, setTagsText] = useState('');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!open) return;
    setResult(null);
    setError(null);
    let cancelled = false;
    ticketsApi
      .listRaw()
      .then((list) => {
        if (cancelled) return;
        setTickets(list);
        if (list.length === 0) setSource('sample');
      })
      .catch((e) => !cancelled && setTicketsError(e instanceof Error ? e.message : 'Could not load tickets.'));
    return () => {
      cancelled = true;
    };
  }, [open]);

  const filteredTickets = useMemo(() => {
    const q = ticketQuery.trim().toLowerCase();
    const list = tickets ?? [];
    return (q ? list.filter((t) => `${t.ticket_number} ${t.subject} ${t.customer_name ?? ''}`.toLowerCase().includes(q)) : list).slice(0, 100);
  }, [tickets, ticketQuery]);

  const optionsOf = (key: string) => getField(meta, key)?.options ?? [];

  const run = async () => {
    setError(null);
    setResult(null);
    let target: TicketTarget;
    if (source === 'ticket') {
      if (!ticketId) {
        setError('Choose a ticket to test against.');
        return;
      }
      target = { ticket_id: ticketId };
    } else {
      const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
      const clean = Object.fromEntries(Object.entries({ ...sample, tags }).filter(([, v]) => v !== '' && v !== undefined));
      target = { sample_ticket: clean as SampleTicket };
    }
    setRunning(true);
    try {
      if (mode.kind === 'preview') {
        setResult({ kind: 'preview', preview: await assignmentRulesApi.preview(target) });
      } else if (mode.ruleId) {
        const r = await assignmentRulesApi.test(mode.ruleId, target, mode.draft);
        setResult({ kind: 'rule', evaluation: r, ticketRef: r.ticket_ref, changes: r.would_change_assignment });
      } else {
        const p = await assignmentRulesApi.preview(target, { rule: mode.draft });
        setResult({ kind: 'rule', evaluation: p.evaluations[0]!, ticketRef: p.ticket_ref, changes: p.would_change_assignment });
      }
    } catch (e) {
      const msg = e instanceof ApiError && e.fieldErrors.length
        ? `${e.message} ${e.fieldErrors.map((f) => f.message).join(' ')}`
        : e instanceof Error ? e.message : 'Test failed.';
      setError(msg);
    } finally {
      setRunning(false);
    }
  };

  const title = mode.kind === 'preview' ? 'Preview assignment' : `Test rule${mode.draft.name ? `: ${mode.draft.name}` : ''}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={title}
      subtitle={
        mode.kind === 'preview'
          ? 'See which active rule would assign a ticket, in priority order.'
          : 'Evaluates the rule as currently edited, including unsaved changes.'
      }
      footer={
        <>
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg text-sm font-medium text-foreground-muted hover:bg-surface-subtle">
            Close
          </button>
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="h-9 px-4 rounded-lg bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60"
          >
            {running ? <Spinner /> : <Play className="h-4 w-4" />}
            {mode.kind === 'preview' ? 'Run preview' : 'Run test'}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="flex items-center gap-2 text-xs text-foreground-muted">
          <Info className="h-3.5 w-3.5" /> Dry run: no ticket is assigned or modified.
        </p>

        <div role="tablist" className="inline-flex rounded-lg border border-border bg-surface-subtle p-0.5">
          {(['ticket', 'sample'] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={source === s}
              onClick={() => setSource(s)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-semibold',
                source === s ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground',
              )}
            >
              {s === 'ticket' ? 'Existing ticket' : 'Sample data'}
            </button>
          ))}
        </div>

        {source === 'ticket' ? (
          <div className="space-y-2">
            {ticketsError && <ErrorBanner message={ticketsError} />}
            {tickets === null && !ticketsError ? (
              <p className="flex items-center gap-2 text-sm text-foreground-muted"><Spinner /> Loading tickets…</p>
            ) : tickets && tickets.length === 0 ? (
              <p className="text-sm text-foreground-muted">There are no tickets yet. Use sample data instead.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="test-ticket-search">Search tickets</Label>
                  <input id="test-ticket-search" value={ticketQuery} onChange={(e) => setTicketQuery(e.target.value)} placeholder="Number, subject or customer" className={inputClass} />
                </div>
                <div>
                  <Label htmlFor="test-ticket">Ticket</Label>
                  <select id="test-ticket" value={ticketId} onChange={(e) => setTicketId(e.target.value)} className={inputClass}>
                    <option value="">Select a ticket…</option>
                    {filteredTickets.map((t) => (
                      <option key={t.id} value={t.ticket_number}>
                        {t.ticket_number} · {t.subject.slice(0, 60)} · {t.priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-3">
              <Label htmlFor="s-subject">Subject</Label>
              <input id="s-subject" value={sample.subject ?? ''} onChange={(e) => setSample({ ...sample, subject: e.target.value })} className={inputClass} placeholder="e.g. VPN disconnects every hour" />
            </div>
            {(
              [
                ['status', 'Status'], ['priority', 'Priority'], ['category', 'Category'],
                ['ticket_type', 'Ticket type'], ['source', 'Source'], ['customer_type', 'Customer type'],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={`s-${key}`}>{label}</Label>
                <select
                  id={`s-${key}`}
                  value={(sample[key] as string) ?? ''}
                  onChange={(e) => setSample({ ...sample, [key]: e.target.value || undefined })}
                  className={inputClass}
                >
                  <option value="">—</option>
                  {optionsOf(key).map((o) => (
                    <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
                  ))}
                </select>
              </div>
            ))}
            <div>
              <Label htmlFor="s-email">Customer email</Label>
              <input id="s-email" value={sample.customer_email ?? ''} onChange={(e) => setSample({ ...sample, customer_email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="s-company">Customer company</Label>
              <input id="s-company" value={sample.customer_company ?? ''} onChange={(e) => setSample({ ...sample, customer_company: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="s-tags" hint="comma separated">Tags</Label>
              <input id="s-tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className={inputClass} placeholder="vpn, network" />
            </div>
          </div>
        )}

        {error && <ErrorBanner message={error} />}
        {result?.kind === 'rule' && <RuleResult evaluation={result.evaluation} ticketRef={result.ticketRef} changes={result.changes} />}
        {result?.kind === 'preview' && <PreviewResultView preview={result.preview} />}
      </div>
    </Modal>
  );
};

const targetText = (t: AssignmentTarget | null | undefined): string => {
  if (!t) return 'Nobody';
  const parts = [t.agent_name, t.team_name && `${t.team_name} team`].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Unassigned';
};

const TraceList: React.FC<{ title: string; items: ConditionTrace[]; passed: boolean }> = ({ title, items, passed }) => (
  <div>
    <h4 className="text-xs font-semibold text-foreground mb-2">
      {title} <span className="text-foreground-muted font-normal">({items.length})</span>
    </h4>
    {items.length === 0 ? (
      <p className="text-xs text-foreground-muted">None</p>
    ) : (
      <ul className="space-y-1.5">
        {items.map((c) => (
          <li key={c.path} className="flex items-start gap-2 text-xs">
            {passed ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-label="passed" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-rose-500" aria-label="failed" />
            )}
            <span className="text-foreground">
              <span className="font-medium">{c.field_label}</span> {c.operator_label.toLowerCase()}{' '}
              <span className="font-medium">{displayValue(c.expected)}</span>
              <span className="block text-foreground-muted">Ticket value: {displayValue(c.actual)}</span>
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const RuleResult: React.FC<{ evaluation: RuleEvaluation; ticketRef: string; changes: boolean }> = ({ evaluation, ticketRef, changes }) => (
  <div className="rounded-xl border border-border overflow-hidden" data-testid="rule-test-result">
    <div className={cn('px-4 py-3 flex flex-wrap items-center gap-3', evaluation.matched ? 'bg-emerald-500/5' : 'bg-surface-subtle')}>
      {evaluation.matched ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-foreground-muted" />}
      <span className="text-sm font-semibold text-foreground">
        {evaluation.matched ? 'Rule matches' : 'Rule does not match'} {ticketRef}
      </span>
      <ExecutionStatusBadge status={evaluation.status} />
    </div>
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TraceList title="Conditions passed" items={evaluation.passed_conditions} passed />
        <TraceList title="Conditions failed" items={evaluation.failed_conditions} passed={false} />
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-sm border-t border-border pt-4">
        <dt className="text-foreground-muted">Expected assignment</dt>
        <dd className="font-medium text-foreground">
          {evaluation.expected_assignment ? targetText(evaluation.expected_assignment) : '—'}
          {evaluation.matched && !changes && evaluation.status !== 'assigned' && (
            <span className="ml-2 text-xs text-foreground-muted">(assignment would not change)</span>
          )}
        </dd>
        <dt className="text-foreground-muted">Reason</dt>
        <dd className="text-foreground">{evaluation.reason}</dd>
      </dl>
    </div>
  </div>
);

const PreviewResultView: React.FC<{ preview: PreviewResult }> = ({ preview }) => (
  <div className="space-y-4" data-testid="preview-result">
    <div className="rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <FlaskConical className="h-4 w-4 text-brand-indigo" /> {preview.summary}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-lg bg-surface-subtle px-3 py-1.5 text-foreground">{targetText(preview.current_assignment)}</span>
        <ArrowRight className="h-4 w-4 text-foreground-muted" />
        <span className={cn('rounded-lg px-3 py-1.5 font-semibold', preview.would_change_assignment ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-surface-subtle text-foreground')}>
          {targetText(preview.final_assignment)}
        </span>
      </div>
    </div>
    {preview.evaluations.length > 0 && (
      <div className="rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-subtle text-xs text-foreground-muted">
            <tr>
              <th className="text-left font-semibold px-3 py-2">Priority</th>
              <th className="text-left font-semibold px-3 py-2">Rule</th>
              <th className="text-left font-semibold px-3 py-2">Result</th>
              <th className="text-left font-semibold px-3 py-2">Conditions</th>
              <th className="text-left font-semibold px-3 py-2">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {preview.evaluations.map((e) => (
              <tr key={`${e.rule_id}-${e.rule_name}`} className={e.rule_id === preview.winning_rule_id ? 'bg-brand-indigo/5' : undefined}>
                <td className="px-3 py-2 font-mono text-xs">{e.priority}</td>
                <td className="px-3 py-2 font-medium text-foreground">{e.rule_name}</td>
                <td className="px-3 py-2"><ExecutionStatusBadge status={e.status} /></td>
                <td className="px-3 py-2 text-xs text-foreground-muted whitespace-nowrap">
                  {e.passed_conditions.length} passed · {e.failed_conditions.length} failed
                </td>
                <td className="px-3 py-2 text-xs text-foreground">{e.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-3 py-2 text-xs text-foreground-muted border-t border-border">
          Rules after the first match are not evaluated unless that rule has “Continue to next rule” enabled.
        </p>
      </div>
    )}
  </div>
);
