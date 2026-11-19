import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      id,
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      className,
      containerClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className={cn('w-full text-left', containerClassName)}>
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1.5"
        >
          {label}
        </label>
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-foreground-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : hint ? hintId : undefined}
            className={cn(
              'w-full h-11 px-3.5 py-2 text-sm rounded-lg border transition-all duration-150',
              'bg-surface text-foreground placeholder:text-foreground-muted/60',
              'focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-subtle',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightElement ? 'pr-11' : 'pr-3.5',
              hasError
                ? 'border-status-error focus:ring-status-error focus:border-status-error'
                : 'border-border hover:border-border-focus/60',
              className,
            )}
            {...props}
          />
          {rightElement && <div className="absolute right-2 flex items-center">{rightElement}</div>}
        </div>

        {hasError ? (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-status-error animate-in fade-in duration-150"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1.5 text-xs text-foreground-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

AuthInput.displayName = 'AuthInput';
