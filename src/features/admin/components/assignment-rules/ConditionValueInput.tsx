import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ConditionValue,
  FieldMeta,
  FieldOption,
  PeriodUnit,
  PeriodValue,
  ValueShape,
} from '../../types/rule.types';
import { inputClass, inputErrorClass } from './ui';

interface Props {
  field: FieldMeta | undefined;
  shape: ValueShape;
  value: ConditionValue;
  onChange: (value: ConditionValue) => void;
  periodUnits: PeriodUnit[];
  invalid?: boolean;
  describedBy?: string;
}

/** Renders the value control appropriate to the field's data type and the operator's value shape. */
export const ConditionValueInput: React.FC<Props> = ({
  field, shape, value, onChange, periodUnits, invalid, describedBy,
}) => {
  const cls = cn(inputClass, invalid && inputErrorClass);
  const aria = { 'aria-invalid': invalid || undefined, 'aria-describedby': describedBy, 'aria-label': `${field?.label ?? 'Condition'} value` };

  if (shape === 'none') {
    return <div className="h-9 flex items-center px-1 text-xs text-foreground-muted italic">No value needed</div>;
  }

  if (shape === 'period') {
    const p = (value as PeriodValue) ?? { amount: 7, unit: 'days' };
    return (
      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          step={1}
          value={Number.isFinite(p.amount) ? p.amount : ''}
          onChange={(e) => onChange({ ...p, amount: e.target.value === '' ? NaN : Number(e.target.value) })}
          className={cn(cls, 'w-24')}
          {...aria}
        />
        <select
          value={p.unit}
          onChange={(e) => onChange({ ...p, unit: e.target.value as PeriodUnit })}
          className={cn(inputClass, 'w-28')}
          aria-label="Time unit"
        >
          {periodUnits.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    );
  }

  if (shape === 'range') {
    const [start, end] = Array.isArray(value) ? (value as [string, string]) : ['', ''];
    return (
      <div className="flex items-center gap-2">
        <input type="date" value={start} onChange={(e) => onChange([e.target.value, end])} className={cls} {...aria} aria-label="Start date" />
        <span className="text-xs text-foreground-muted shrink-0">and</span>
        <input type="date" value={end} onChange={(e) => onChange([start, e.target.value])} className={cls} aria-label="End date" aria-invalid={invalid || undefined} />
      </div>
    );
  }

  if (shape === 'list') {
    const list = Array.isArray(value) ? (value as Array<string | number>) : [];
    if (field?.data_type === 'tags' || !field?.options.length) {
      return <ChipsInput values={list.map(String)} onChange={onChange} invalid={invalid} label={field?.label ?? 'Values'} describedBy={describedBy} />;
    }
    return <MultiSelect options={field.options} values={list} onChange={onChange} invalid={invalid} label={field.label} describedBy={describedBy} />;
  }

  // single
  if (field?.data_type === 'select') {
    const options = withCurrent(field.options, value);
    return (
      <select
        value={value === null || value === undefined ? '' : String(value)}
        onChange={(e) => onChange(field.id_valued ? Number(e.target.value) : e.target.value)}
        className={cls}
        {...aria}
      >
        {options.length === 0 && <option value="">No options available</option>}
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
        ))}
      </select>
    );
  }
  if (field?.data_type === 'date') {
    return <input type="date" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={cls} {...aria} />;
  }
  if (field?.data_type === 'number') {
    return (
      <input
        type="number"
        value={value === null || value === undefined ? '' : String(value)}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className={cls}
        placeholder="0"
        {...aria}
      />
    );
  }
  return (
    <input
      type="text"
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      className={cls}
      placeholder="Enter a value"
      maxLength={500}
      {...aria}
    />
  );
};

function withCurrent(options: FieldOption[], value: ConditionValue): FieldOption[] {
  if (value === null || value === undefined || value === '' || typeof value === 'object') return options;
  return options.some((o) => String(o.value) === String(value))
    ? options
    : [...options, { value, label: `${value} (unavailable)` }];
}

// ------------------------------------------------------------- multi-select
const MultiSelect: React.FC<{
  options: FieldOption[];
  values: Array<string | number>;
  onChange: (v: Array<string | number>) => void;
  invalid?: boolean;
  label: string;
  describedBy?: string;
}> = ({ options, values, onChange, invalid, label, describedBy }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const selected = new Set(values.map(String));
  const toggle = (opt: FieldOption) => {
    const key = String(opt.value);
    onChange(selected.has(key) ? values.filter((v) => String(v) !== key) : [...values, opt.value]);
  };
  const labelFor = (v: string | number) => options.find((o) => String(o.value) === String(v))?.label ?? String(v);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label} values`}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(inputClass, 'h-auto min-h-9 py-1 flex items-center gap-1 flex-wrap text-left', invalid && inputErrorClass)}
      >
        {values.length === 0 && <span className="text-foreground-muted/70 py-0.5">Select values…</span>}
        {values.map((v) => (
          <span key={String(v)} className="inline-flex items-center gap-1 rounded-md bg-brand-indigo/10 text-brand-indigo px-1.5 py-0.5 text-xs font-medium">
            {labelFor(v)}
          </span>
        ))}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-foreground-muted" />
      </button>
      {open && (
        <ul role="listbox" aria-multiselectable="true" className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-lg border border-border bg-surface shadow-elevated py-1">
          {options.map((opt) => {
            const isOn = selected.has(String(opt.value));
            return (
              <li key={String(opt.value)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isOn}
                  onClick={() => toggle(opt)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-surface-subtle"
                >
                  <span className={cn('flex h-4 w-4 items-center justify-center rounded border', isOn ? 'bg-brand-indigo border-brand-indigo text-white' : 'border-border')}>
                    {isOn && <Check className="h-3 w-3" />}
                  </span>
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- chips
const ChipsInput: React.FC<{
  values: string[];
  onChange: (v: string[]) => void;
  invalid?: boolean;
  label: string;
  describedBy?: string;
}> = ({ values, onChange, invalid, label, describedBy }) => {
  const [draft, setDraft] = useState('');
  const commit = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange(Array.from(new Set([...values, ...parts])));
    setDraft('');
  };
  return (
    <div className={cn(inputClass, 'h-auto min-h-9 py-1 flex flex-wrap items-center gap-1', invalid && inputErrorClass)}>
      {values.map((v) => (
        <span key={v} className="inline-flex items-center gap-1 rounded-md bg-brand-violet/10 text-brand-violet px-1.5 py-0.5 text-xs font-medium">
          {v}
          <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(values.filter((x) => x !== v))}>
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Backspace' && !draft && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={values.length ? '' : 'Type and press Enter'}
        aria-label={`${label} values`}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="flex-1 min-w-[8rem] bg-transparent outline-none text-sm py-0.5"
      />
    </div>
  );
};
