import React, { useMemo } from 'react';
import { FolderPlus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ConditionGroupNode,
  ConditionNode,
  ConditionValue,
  FieldMeta,
  FieldsMetadata,
  MatchLogic,
} from '../../types/rule.types';
import {
  addChild,
  canNest,
  changeField,
  changeOperator,
  countConditions,
  createCondition,
  createGroup,
  getField,
  operatorsFor,
  removeNode,
  setLogic,
  shapeOf,
  updateNode,
} from './conditionTree';
import { ConditionValueInput } from './ConditionValueInput';
import { FieldError, inputClass, inputErrorClass } from './ui';

interface BuilderProps {
  meta: FieldsMetadata;
  value: ConditionGroupNode;
  onChange: (next: ConditionGroupNode) => void;
  errors?: Record<string, string>;
  treeError?: string | null;
}

interface Ctx {
  meta: FieldsMetadata;
  root: ConditionGroupNode;
  onChange: (next: ConditionGroupNode) => void;
  errors: Record<string, string>;
  fieldGroups: [string, FieldMeta[]][];
  atLimit: boolean;
}

const LOGIC_STYLE: Record<MatchLogic, { accent: string; chip: string; label: string }> = {
  AND: { accent: 'border-l-brand-indigo', chip: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/25', label: 'ALL' },
  OR: { accent: 'border-l-brand-violet', chip: 'bg-brand-violet/10 text-brand-violet border-brand-violet/25', label: 'ANY' },
};

/**
 * Visual condition builder. Groups combine their children with AND ("all") or
 * OR ("any") and can be nested. Switching logic never alters entered values.
 */
export const ConditionBuilder: React.FC<BuilderProps> = ({ meta, value, onChange, errors = {}, treeError }) => {
  const fieldGroups = useMemo(() => {
    const map = new Map<string, FieldMeta[]>();
    meta.fields.forEach((f) => map.set(f.group, [...(map.get(f.group) ?? []), f]));
    return Array.from(map.entries());
  }, [meta]);

  const ctx: Ctx = {
    meta, root: value, onChange, errors, fieldGroups,
    atLimit: countConditions(value) >= meta.limits.max_conditions,
  };

  return (
    <div className="space-y-2" data-testid="condition-builder">
      <GroupEditor ctx={ctx} group={value} depth={1} />
      <FieldError message={treeError} />
    </div>
  );
};

const LogicToggle: React.FC<{ logic: MatchLogic; onChange: (l: MatchLogic) => void; groupLabel: string }> = ({
  logic, onChange, groupLabel,
}) => (
  <div role="radiogroup" aria-label={`${groupLabel} match logic`} className="inline-flex rounded-lg border border-border bg-surface p-0.5">
    {(['AND', 'OR'] as MatchLogic[]).map((l) => (
      <button
        key={l}
        type="button"
        role="radio"
        aria-checked={logic === l}
        onClick={() => onChange(l)}
        className={cn(
          'px-2.5 py-1 rounded-md text-xs font-semibold transition-colors',
          logic === l
            ? l === 'AND' ? 'bg-brand-indigo text-white shadow-sm' : 'bg-brand-violet text-white shadow-sm'
            : 'text-foreground-muted hover:text-foreground',
        )}
      >
        {LOGIC_STYLE[l].label}
      </button>
    ))}
  </div>
);

const Connector: React.FC<{ logic: MatchLogic }> = ({ logic }) => (
  <div className="flex items-center gap-2 py-1 pl-3" aria-hidden="true">
    <span className={cn('px-1.5 py-px rounded border text-[10px] font-bold tracking-wider', LOGIC_STYLE[logic].chip)}>{logic}</span>
    <span className="h-px flex-1 bg-border-subtle" />
  </div>
);

const GroupEditor: React.FC<{ ctx: Ctx; group: ConditionGroupNode; depth: number }> = ({ ctx, group, depth }) => {
  const { meta, root, onChange, errors, atLimit } = ctx;
  const isRoot = depth === 1;
  const label = isRoot ? 'Rule conditions' : `Nested group (level ${depth})`;

  const header = (
    <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
      <span className="text-foreground-muted">{isRoot ? 'Match' : 'Group matches'}</span>
      <LogicToggle logic={group.logic} onChange={(l) => onChange(setLogic(root, group.id, l))} groupLabel={label} />
      <span className="text-foreground-muted">of the following</span>
      {!isRoot && (
        <button
          type="button"
          onClick={() => onChange(removeNode(root, group.id))}
          className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-foreground-muted hover:text-rose-600 hover:bg-rose-500/10"
          aria-label="Remove group"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove group
        </button>
      )}
    </div>
  );

  const body = (
    <div className="mt-3">
      {group.children.map((child, i) => (
        <React.Fragment key={child.id}>
          {i > 0 && <Connector logic={group.logic} />}
          {child.type === 'group' ? (
            <GroupEditor ctx={ctx} group={child} depth={depth + 1} />
          ) : (
            <ConditionRow ctx={ctx} node={child} />
          )}
        </React.Fragment>
      ))}
      {group.children.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-foreground-muted">
          No conditions yet. Add one to define when this rule applies.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={atLimit}
          onClick={() => onChange(addChild(root, group.id, createCondition(meta)))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-brand-indigo/60 hover:text-brand-indigo disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus className="h-3.5 w-3.5" /> Add condition
        </button>
        {canNest(meta, depth) && (
          <button
            type="button"
            disabled={atLimit}
            onClick={() => onChange(addChild(root, group.id, createGroup(meta, group.logic === 'AND' ? 'OR' : 'AND')))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-brand-violet/60 hover:text-brand-violet disabled:opacity-50 disabled:pointer-events-none"
          >
            <FolderPlus className="h-3.5 w-3.5" /> Add group
          </button>
        )}
      </div>
      <FieldError message={errors[group.id]} />
    </div>
  );

  if (isRoot) {
    return (
      <div className="rounded-xl border border-border bg-surface-subtle/40 p-4">
        {header}
        {body}
      </div>
    );
  }
  return (
    <div
      data-testid="condition-group"
      data-logic={group.logic}
      className={cn(
        'rounded-lg border border-border border-l-[3px] p-3',
        LOGIC_STYLE[group.logic].accent,
        depth % 2 === 0 ? 'bg-surface' : 'bg-surface-subtle/60',
      )}
    >
      {header}
      {body}
    </div>
  );
};

const ConditionRow: React.FC<{ ctx: Ctx; node: ConditionNode }> = ({ ctx, node }) => {
  const { meta, root, onChange, errors, fieldGroups } = ctx;
  const field = getField(meta, node.field);
  const ops = operatorsFor(meta, node.field);
  const shape = shapeOf(meta, node.field, node.operator);
  const error = errors[node.id];
  const errorId = error ? `err-${node.id}` : undefined;
  const set = (fn: (n: ConditionNode) => ConditionNode) => onChange(updateNode<ConditionNode>(root, node.id, fn));

  return (
    <div data-testid="condition-row">
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,12rem)_minmax(0,11rem)_minmax(0,1fr)_auto] gap-2 items-start rounded-lg border border-border bg-surface p-2">
        <select
          value={node.field}
          onChange={(e) => set((n) => changeField(meta, n, e.target.value))}
          className={cn(inputClass, !field && inputErrorClass)}
          aria-label="Field"
        >
          {!field && <option value={node.field}>Unknown field</option>}
          {fieldGroups.map(([groupName, fields]) => (
            <optgroup key={groupName} label={groupName}>
              {fields.map((f) => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <select
          value={node.operator}
          onChange={(e) => set((n) => changeOperator(meta, n, e.target.value))}
          className={inputClass}
          aria-label="Operator"
        >
          {ops.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
        <ConditionValueInput
          field={field}
          shape={shape}
          value={node.value}
          onChange={(v: ConditionValue) => set((n) => ({ ...n, value: v }))}
          periodUnits={meta.period_units}
          invalid={Boolean(error)}
          describedBy={errorId}
        />
        <button
          type="button"
          onClick={() => onChange(removeNode(root, node.id))}
          className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-foreground-muted hover:text-rose-600 hover:bg-rose-500/10 justify-self-end"
          aria-label={`Remove condition ${field?.label ?? ''}`.trim()}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <FieldError message={error} id={errorId} />
    </div>
  );
};
