import React, { useEffect } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExecutionStatus } from '../../types/rule.types';

export const inputClass =
  'w-full h-9 px-3 rounded-lg border border-border bg-surface text-foreground text-sm placeholder:text-foreground-muted/70 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-indigo/40 focus:border-brand-indigo transition-colors disabled:opacity-60';

export const inputErrorClass = 'border-rose-500/70 focus:ring-rose-500/30 focus:border-rose-500';

export const Label: React.FC<{ htmlFor?: string; children: React.ReactNode; hint?: string; required?: boolean }> = ({
  htmlFor, children, hint, required,
}) => (
  <label htmlFor={htmlFor} className="block text-xs font-semibold text-foreground mb-1.5">
    {children}
    {required && <span className="text-rose-500 ml-0.5">*</span>}
    {hint && <span className="ml-1.5 font-normal text-foreground-muted">{hint}</span>}
  </label>
);

export const FieldError: React.FC<{ message?: string | null; id?: string }> = ({ message, id }) =>
  message ? (
    <p id={id} role="alert" className="mt-1 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  ) : null;

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}> = ({ checked, onChange, label, description, disabled, id }) => (
  <label className={cn('flex items-start gap-3 select-none', disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer')}>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo/50',
        checked ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-600',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-4',
        )}
      />
    </button>
    <span className="min-w-0">
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {description && <span className="block text-xs text-foreground-muted mt-0.5">{description}</span>}
    </span>
  </label>
);

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <Loader2 className={cn('h-4 w-4 animate-spin', className)} aria-hidden="true" />
);

export const Section: React.FC<{
  step?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}> = ({ step, title, description, children, aside }) => (
  <section className="space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {step && (
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-indigo/10 text-[11px] font-bold text-brand-indigo">
            {step}
          </span>
        )}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>}
        </div>
      </div>
      {aside}
    </div>
    <div className={step ? 'sm:pl-9' : undefined}>{children}</div>
  </section>
);

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}> = ({ open, onClose, title, subtitle, children, footer, size = 'lg' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const width = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full rounded-xl bg-surface border border-border shadow-elevated flex flex-col max-h-[90vh]', width)}>
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground truncate">{title}</h2>
            {subtitle && <p className="text-xs text-foreground-muted mt-0.5">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-subtle">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

const STATUS_STYLES: Record<ExecutionStatus, { label: string; cls: string }> = {
  assigned: { label: 'Assigned', cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25' },
  no_change: { label: 'No change', cls: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/25' },
  skipped: { label: 'Skipped', cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' },
  failed: { label: 'Failed', cls: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25' },
};

export const ExecutionStatusBadge: React.FC<{ status: ExecutionStatus | null }> = ({ status }) => {
  if (!status) {
    return (
      <span className="inline-flex px-2 py-0.5 rounded-full border text-[11px] font-semibold bg-surface-subtle text-foreground-muted border-border">
        Not matched
      </span>
    );
  }
  const s = STATUS_STYLES[status];
  return <span className={cn('inline-flex px-2 py-0.5 rounded-full border text-[11px] font-semibold', s.cls)}>{s.label}</span>;
};

export const ActiveBadge: React.FC<{ active: boolean }> = ({ active }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold',
      active
        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
        : 'bg-surface-subtle text-foreground-muted border-border',
    )}
  >
    <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-emerald-500' : 'bg-slate-400')} />
    {active ? 'Active' : 'Inactive'}
  </span>
);

export const ErrorBanner: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div role="alert" className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
    <span className="flex-1">{message}</span>
    {onRetry && (
      <button type="button" onClick={onRetry} className="text-xs font-semibold underline underline-offset-2">
        Retry
      </button>
    )}
  </div>
);
