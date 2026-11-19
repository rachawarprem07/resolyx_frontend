import React, { useEffect, useRef, useState } from 'react';
import { Copy, Eye, MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssignmentRule } from '../../types/rule.types';
import { ActiveBadge } from './ui';
import { ASSIGNMENT_TYPE_LABELS, formatDateTime, formatRelative } from './format';

interface Props {
  rules: AssignmentRule[];
  busyId: number | null;
  onView: (r: AssignmentRule) => void;
  onEdit: (r: AssignmentRule) => void;
  onDuplicate: (r: AssignmentRule) => void;
  onToggle: (r: AssignmentRule) => void;
  onDelete: (r: AssignmentRule) => void;
}

const RowMenu: React.FC<{ rule: AssignmentRule } & Omit<Props, 'rules' | 'busyId'>> = ({
  rule, onView, onEdit, onDuplicate, onToggle, onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const item = (label: string, Icon: React.ElementType, fn: () => void, danger = false) => (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        setOpen(false);
        fn();
      }}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-surface-subtle',
        danger ? 'text-rose-600 dark:text-rose-400' : 'text-foreground',
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={`Actions for ${rule.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-border bg-surface shadow-elevated py-1">
          {item('View', Eye, () => onView(rule))}
          {item('Edit', Pencil, () => onEdit(rule))}
          {item('Duplicate', Copy, () => onDuplicate(rule))}
          {item(rule.is_active ? 'Deactivate' : 'Activate', Power, () => onToggle(rule))}
          <div className="my-1 border-t border-border" />
          {item('Delete', Trash2, () => onDelete(rule), true)}
        </div>
      )}
    </div>
  );
};

export const RulesTable: React.FC<Props> = ({ rules, busyId, ...actions }) => (
  <div className="rounded-xl border border-border bg-surface overflow-x-auto">
    <table className="w-full text-sm min-w-[960px]">
      <thead>
        <tr className="border-b border-border bg-surface-subtle/60 text-left text-xs font-semibold text-foreground-muted">
          <th className="px-4 py-2.5 w-16">Priority</th>
          <th className="px-4 py-2.5">Rule</th>
          <th className="px-4 py-2.5">Conditions</th>
          <th className="px-4 py-2.5">Assignment</th>
          <th className="px-4 py-2.5">Assigned to</th>
          <th className="px-4 py-2.5">Status</th>
          <th className="px-4 py-2.5">Last modified</th>
          <th className="px-4 py-2.5 w-12"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rules.map((r) => (
          <tr key={r.id} className={cn('hover:bg-surface-subtle/40 transition-colors', busyId === r.id && 'opacity-60')}>
            <td className="px-4 py-3">
              <span className="inline-flex h-6 min-w-6 px-1.5 items-center justify-center rounded-md bg-surface-subtle border border-border font-mono text-xs font-semibold text-foreground">
                {r.priority}
              </span>
            </td>
            <td className="px-4 py-3 max-w-[16rem]">
              <button type="button" onClick={() => actions.onView(r)} className="font-semibold text-foreground hover:text-brand-indigo text-left">
                {r.name}
              </button>
              {r.description && <p className="text-xs text-foreground-muted truncate" title={r.description}>{r.description}</p>}
              <p className="mt-0.5 text-[11px] text-foreground-muted">
                {r.triggers.map((t) => (t === 'ticket_created' ? 'On create' : 'On update')).join(' · ')}
                {r.continue_to_next_rule && ' · continues'}
              </p>
            </td>
            <td className="px-4 py-3 max-w-[20rem]">
              <p className="text-xs text-foreground line-clamp-2" title={r.conditions_summary}>{r.conditions_summary}</p>
              <p className="text-[11px] text-foreground-muted mt-0.5">{r.condition_count} condition{r.condition_count === 1 ? '' : 's'}</p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-xs text-foreground">{ASSIGNMENT_TYPE_LABELS[r.assignment_type]}</td>
            <td className="px-4 py-3 text-xs text-foreground">{r.assigned_to_label}</td>
            <td className="px-4 py-3"><ActiveBadge active={r.is_active} /></td>
            <td className="px-4 py-3 whitespace-nowrap text-xs text-foreground-muted" title={formatDateTime(r.updated_at)}>
              {formatRelative(r.updated_at)}
            </td>
            <td className="px-4 py-3 text-right"><RowMenu rule={r} {...actions} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
