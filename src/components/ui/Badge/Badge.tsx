import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'violet' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default:
      'bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/25 dark:bg-brand-indigo/20 dark:border-brand-indigo/35',
    violet:
      'bg-brand-violet/10 text-brand-violet border border-brand-violet/25 dark:bg-brand-violet/20 dark:border-brand-violet/35',
    success:
      'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:text-emerald-400 dark:bg-emerald-500/15',
    warning:
      'bg-amber-500/10 text-amber-600 border border-amber-500/25 dark:text-amber-400 dark:bg-amber-500/15',
    error:
      'bg-rose-500/10 text-rose-600 border border-rose-500/25 dark:text-rose-400 dark:bg-rose-500/15',
    neutral: 'bg-surface-subtle text-foreground-muted border border-border dark:text-slate-light',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium tracking-wide',
  };

  const dotColors = {
    default: 'bg-brand-indigo',
    violet: 'bg-brand-violet',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full leading-none select-none transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
