import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, FlaskConical, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { assignmentRulesApi } from '@/lib/assignmentRulesApi';
import { ApiError } from '@/lib/http';
import type {
  AgentOption,
  AssignmentRule,
  AssignmentRulePayload,
  FieldsMetadata,
  RuleTrigger,
  TeamOption,
} from '../../types/rule.types';
import { AssignmentActionEditor } from './AssignmentActionEditor';
import { ConditionBuilder } from './ConditionBuilder';
import { countConditions, mapServerErrors, validateTree } from './conditionTree';
import { RuleTestModal } from './RuleTestModal';
import { cleanPayload, defaultRulePayload, mapFieldErrors, payloadFromRule, validateRuleFields } from './ruleForm';
import { ErrorBanner, FieldError, Label, Section, Spinner, Toggle, inputClass, inputErrorClass } from './ui';

interface Props {
  open: boolean;
  rule: AssignmentRule | null;
  meta: FieldsMetadata;
  agents: AgentOption[];
  teams: TeamOption[];
  nextPriority: number;
  onClose: () => void;
  onSaved: (rule: AssignmentRule, isNew: boolean) => void;
}

const TRIGGERS: { key: RuleTrigger; label: string; description: string }[] = [
  { key: 'ticket_created', label: 'When a ticket is created', description: 'Runs once for every new ticket.' },
  { key: 'ticket_updated', label: 'When a ticket is updated', description: 'Runs when ticket details change (not on assignment-only changes).' },
];

export const RuleEditorDrawer: React.FC<Props> = ({ open, rule, meta, agents, teams, nextPriority, onClose, onSaved }) => {
  const [form, setForm] = useState<AssignmentRulePayload>(() => defaultRulePayload(meta, nextPriority));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [treeErrors, setTreeErrors] = useState<Record<string, string>>({});
  const [treeError, setTreeError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const initial = useRef<string>('');

  useEffect(() => {
    if (!open) return;
    const next = rule ? payloadFromRule(rule) : defaultRulePayload(meta, nextPriority);
    setForm(next);
    initial.current = JSON.stringify(next);
    setErrors({});
    setTreeErrors({});
    setTreeError(null);
    setBannerError(null);
    setSubmitted(false);
  }, [open, rule, meta, nextPriority]);

  // Re-validate live after the first save attempt so errors clear as they are fixed.
  useEffect(() => {
    if (!submitted) return;
    setErrors(validateRuleFields(form));
    const t = validateTree(meta, form.conditions);
    setTreeErrors(t.nodeErrors);
    setTreeError(t.treeError);
  }, [form, submitted, meta]);

  const dirty = useMemo(() => JSON.stringify(form) !== initial.current, [form]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !testOpen) requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!open) return null;

  const set = <K extends keyof AssignmentRulePayload>(key: K, value: AssignmentRulePayload[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function requestClose() {
    if (dirty && !window.confirm('Discard unsaved changes to this rule?')) return;
    onClose();
  }

  const toggleTrigger = (t: RuleTrigger) =>
    set('triggers', form.triggers.includes(t) ? form.triggers.filter((x) => x !== t) : [...form.triggers, t]);

  const validateAll = (): boolean => {
    setSubmitted(true);
    const fieldErrs = validateRuleFields(form);
    const t = validateTree(meta, form.conditions);
    setErrors(fieldErrs);
    setTreeErrors(t.nodeErrors);
    setTreeError(t.treeError);
    return Object.keys(fieldErrs).length === 0 && Object.keys(t.nodeErrors).length === 0 && !t.treeError;
  };

  const save = async () => {
    setBannerError(null);
    if (!validateAll()) {
      setBannerError('Please fix the highlighted fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = cleanPayload(form);
      const saved = rule ? await assignmentRulesApi.update(rule.id, payload) : await assignmentRulesApi.create(payload);
      onSaved(saved, !rule);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 409) setErrors((prev) => ({ ...prev, name: e.message }));
        const nodeErrs = mapServerErrors(form.conditions, e.fieldErrors);
        setTreeErrors(nodeErrs);
        setErrors((prev) => ({ ...prev, ...mapFieldErrors(e.fieldErrors) }));
        setBannerError(e.message);
      } else {
        setBannerError('Could not save the rule.');
      }
    } finally {
      setSaving(false);
    }
  };

  const openTest = () => {
    if (!validateAll()) {
      setBannerError('Complete the rule before testing it.');
      return;
    }
    setBannerError(null);
    setTestOpen(true);
  };

  const conditionCount = countConditions(form.conditions);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="rule-editor-title">
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px]" onClick={requestClose} />
      <div className="relative h-full w-full max-w-4xl bg-background border-l border-border shadow-elevated flex flex-col">
        <header className="flex items-start justify-between gap-4 px-5 sm:px-8 py-4 border-b border-border bg-surface">
          <div className="min-w-0">
            <h2 id="rule-editor-title" className="text-lg font-semibold text-foreground truncate">
              {rule ? `Edit rule` : 'Create assignment rule'}
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              {rule ? rule.name : 'Automatically route matching tickets to the right agent or team.'}
            </p>
          </div>
          <button type="button" onClick={requestClose} aria-label="Close editor" className="p-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-subtle">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-8">
          {bannerError && <ErrorBanner message={bannerError} />}

          <Section step="1" title="Basic information">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_9rem] gap-4">
              <div>
                <Label htmlFor="rule-name" required>Rule name</Label>
                <input
                  id="rule-name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  maxLength={120}
                  placeholder="e.g. Enterprise urgent tickets → Tier 2"
                  className={cn(inputClass, errors.name && inputErrorClass)}
                  aria-invalid={Boolean(errors.name) || undefined}
                  autoFocus
                />
                <FieldError message={errors.name} />
              </div>
              <div>
                <Label htmlFor="rule-priority" hint="lower runs first">Priority</Label>
                <input
                  id="rule-priority"
                  type="number"
                  min={0}
                  step={1}
                  value={form.priority}
                  onChange={(e) => set('priority', e.target.value === '' ? ('' as unknown as number) : Number(e.target.value))}
                  className={cn(inputClass, errors.priority && inputErrorClass)}
                />
                <FieldError message={errors.priority} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="rule-description">Description</Label>
                <textarea
                  id="rule-description"
                  rows={2}
                  value={form.description ?? ''}
                  onChange={(e) => set('description', e.target.value)}
                  maxLength={2000}
                  placeholder="What this rule is for (optional)"
                  className={cn(inputClass, 'h-auto py-2 resize-y')}
                />
              </div>
              <div className="sm:col-span-2">
                <Toggle checked={form.is_active} onChange={(v) => set('is_active', v)} label="Enable rule" description="Inactive rules are saved but never run." />
              </div>
            </div>
          </Section>

          <Section step="2" title="When should this rule run?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRIGGERS.map((t) => {
                const on = form.triggers.includes(t.key);
                return (
                  <label
                    key={t.key}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                      on ? 'border-brand-indigo bg-brand-indigo/5' : 'border-border bg-surface hover:border-brand-indigo/40',
                    )}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggleTrigger(t.key)} className="mt-0.5 h-4 w-4 accent-[#6366F1]" />
                    <span>
                      <span className="block text-sm font-medium text-foreground">{t.label}</span>
                      <span className="block text-xs text-foreground-muted mt-0.5">{t.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <FieldError message={errors.triggers} />
          </Section>

          <Section
            step="3"
            title="Conditions"
            description="The ticket must satisfy these conditions. Use groups to combine ALL / ANY logic."
            aside={
              <span className="text-xs text-foreground-muted whitespace-nowrap">
                {conditionCount} / {meta.limits.max_conditions}
              </span>
            }
          >
            <ConditionBuilder
              meta={meta}
              value={form.conditions}
              onChange={(c) => set('conditions', c)}
              errors={treeErrors}
              treeError={treeError}
            />
          </Section>

          <Section step="4" title="Assignment action" description="Who receives tickets that match.">
            <AssignmentActionEditor
              type={form.assignment_type}
              config={form.assignment_config}
              onChange={(type, config) => setForm((f) => ({ ...f, assignment_type: type, assignment_config: config }))}
              agents={agents}
              teams={teams}
              skipUnavailable={form.skip_unavailable_agents}
              errors={errors}
            />
          </Section>

          <Section title="Assignment settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-border bg-surface p-4">
              <Toggle
                checked={!form.overwrite_existing_assignment}
                onChange={(v) => set('overwrite_existing_assignment', !v)}
                label="Do not overwrite manual assignments"
                description="Tickets a person assigned are left alone."
              />
              <Toggle
                checked={form.reassign_existing}
                onChange={(v) => set('reassign_existing', v)}
                label="Reassign existing tickets when rule matches"
                description="Re-route tickets that an earlier rule run already assigned."
              />
              <Toggle checked onChange={() => undefined} disabled label="Skip inactive agents" description="Always enforced: inactive or deleted agents never receive tickets." />
              <Toggle
                checked={form.skip_unavailable_agents}
                onChange={(v) => set('skip_unavailable_agents', v)}
                label="Skip agents unavailable for assignment"
                description="Agents marked away on the Agents tab are excluded."
              />
              <div className="md:col-span-2 border-t border-border pt-4">
                <Toggle
                  checked={form.continue_to_next_rule}
                  onChange={(v) => set('continue_to_next_rule', v)}
                  label="Continue to next rule (advanced)"
                  description="Keep evaluating lower-priority rules after this one matches. Later rules can only fill an agent or team slot this run has not set yet — they never overwrite it."
                />
              </div>
            </div>
          </Section>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 px-5 sm:px-8 py-3 border-t border-border bg-surface">
          <button
            type="button"
            onClick={openTest}
            className="h-9 px-3.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-sm font-medium text-foreground inline-flex items-center gap-2"
          >
            <FlaskConical className="h-4 w-4 text-brand-indigo" /> Test rule
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={requestClose} className="h-9 px-4 rounded-lg text-sm font-medium text-foreground-muted hover:bg-surface-subtle">
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="h-9 px-4 rounded-lg bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Spinner /> : <Check className="h-4 w-4" />}
              {rule ? 'Save changes' : 'Create rule'}
            </button>
          </div>
        </footer>
      </div>

      {testOpen && (
        <RuleTestModal
          open={testOpen}
          onClose={() => setTestOpen(false)}
          meta={meta}
          mode={{ kind: 'rule', ruleId: rule?.id, draft: cleanPayload(form) }}
        />
      )}
    </div>
  );
};
