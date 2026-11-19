import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { assignmentRulesApi } from '@/lib/assignmentRulesApi';
import type { AssignmentRule, RuleExecution } from '../../types/rule.types';
import { ActiveBadge, ErrorBanner, ExecutionStatusBadge, Modal, Spinner } from './ui';
import { ASSIGNMENT_TYPE_LABELS, formatDateTime } from './format';

interface Props {
  rule: AssignmentRule | null;
  onClose: () => void;
  onEdit: (rule: AssignmentRule) => void;
}

const yesNo = (v: boolean) => (v ? 'Yes' : 'No');

export const RuleViewModal: React.FC<Props> = ({ rule, onClose, onEdit }) => {
  const [executions, setExecutions] = useState<RuleExecution[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rule) return;
    setExecutions(null);
    setError(null);
    let cancelled = false;
    assignmentRulesApi
      .ruleExecutions(rule.id, 10)
      .then((res) => {
        if (cancelled) return;
        setExecutions(res.items);
        setTotal(res.total);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Could not load history.'));
    return () => {
      cancelled = true;
    };
  }, [rule]);

  if (!rule) return null;

  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      title={rule.name}
      subtitle={rule.description || undefined}
      footer={
        <button
          type="button"
          onClick={() => onEdit(rule)}
          className="h-9 px-4 rounded-lg bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold inline-flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" /> Edit rule
        </button>
      }
    >
      <div className="space-y-6">
        <dl className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-4 gap-y-2.5 text-sm">
          <dt className="text-foreground-muted">Status</dt>
          <dd><ActiveBadge active={rule.is_active} /></dd>
          <dt className="text-foreground-muted">Priority</dt>
          <dd className="text-foreground">{rule.priority} <span className="text-xs text-foreground-muted">(lower runs first)</span></dd>
          <dt className="text-foreground-muted">Runs</dt>
          <dd className="text-foreground">
            {rule.triggers.map((t) => (t === 'ticket_created' ? 'When a ticket is created' : 'When a ticket is updated')).join(', ')}
          </dd>
          <dt className="text-foreground-muted">Conditions</dt>
          <dd className="text-foreground">{rule.conditions_summary}</dd>
          <dt className="text-foreground-muted">Action</dt>
          <dd className="text-foreground">{ASSIGNMENT_TYPE_LABELS[rule.assignment_type]} → {rule.assigned_to_label}</dd>
          <dt className="text-foreground-muted">Overwrite manual</dt>
          <dd className="text-foreground">{yesNo(rule.overwrite_existing_assignment)}</dd>
          <dt className="text-foreground-muted">Reassign existing</dt>
          <dd className="text-foreground">{yesNo(rule.reassign_existing)}</dd>
          <dt className="text-foreground-muted">Skip unavailable</dt>
          <dd className="text-foreground">{yesNo(rule.skip_unavailable_agents)}</dd>
          <dt className="text-foreground-muted">Continue to next rule</dt>
          <dd className="text-foreground">{yesNo(rule.continue_to_next_rule)}</dd>
          <dt className="text-foreground-muted">Last modified</dt>
          <dd className="text-foreground">
            {formatDateTime(rule.updated_at)}
            {rule.created_by_name && <span className="text-foreground-muted"> · created by {rule.created_by_name}</span>}
          </dd>
        </dl>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Recent executions {total > 0 && <span className="font-normal text-foreground-muted">({total} total)</span>}
          </h3>
          {error && <ErrorBanner message={error} />}
          {!executions && !error && <p className="flex items-center gap-2 text-sm text-foreground-muted"><Spinner /> Loading…</p>}
          {executions && executions.length === 0 && (
            <p className="text-sm text-foreground-muted">This rule has not matched any tickets yet.</p>
          )}
          {executions && executions.length > 0 && (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {executions.map((e) => (
                <li key={e.id} className="px-3 py-2.5 text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-xs font-semibold text-brand-indigo">{e.ticket_number}</span>
                  <ExecutionStatusBadge status={e.execution_status} />
                  <span className="text-foreground flex-1 min-w-[12rem]">{e.execution_reason}</span>
                  <span className="text-xs text-foreground-muted">{formatDateTime(e.executed_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
};
