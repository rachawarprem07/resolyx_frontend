import React from 'react';
import { Check, X } from 'lucide-react';
import type { PasswordStrength } from '../types/auth.types';
import { cn } from '@/lib/utils';

export interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  strength,
  className,
}) => {
  const { score, level, label, meetsMinLength, hasNumber, hasUppercase } = strength;

  const getBarColor = (index: number) => {
    if (index >= score) return 'bg-border';
    if (level === 'strong') return 'bg-status-success';
    if (level === 'medium') return 'bg-status-warning';
    return 'bg-status-error';
  };

  const getLabelColor = () => {
    if (level === 'strong') return 'text-status-success';
    if (level === 'medium') return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div className={cn('space-y-2.5 text-xs', className)}>
      <div className="flex items-center justify-between">
        <span className="text-foreground-muted font-medium">Password strength:</span>
        <span className={cn('font-semibold', getLabelColor())}>{label}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
        <div className={cn('rounded-full transition-colors duration-200', getBarColor(0))} />
        <div className={cn('rounded-full transition-colors duration-200', getBarColor(1))} />
        <div className={cn('rounded-full transition-colors duration-200', getBarColor(2))} />
      </div>

      {/* Criteria Checklist */}
      <ul
        className="space-y-1 pt-1 text-[11px] text-foreground-muted"
        aria-label="Password requirements"
      >
        <li className="flex items-center gap-1.5">
          {meetsMinLength ? (
            <Check className="h-3.5 w-3.5 text-status-success shrink-0" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5 text-foreground-muted/60 shrink-0" aria-hidden="true" />
          )}
          <span className={meetsMinLength ? 'text-foreground' : undefined}>
            At least 8 characters
          </span>
        </li>
        <li className="flex items-center gap-1.5">
          {hasNumber ? (
            <Check className="h-3.5 w-3.5 text-status-success shrink-0" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5 text-foreground-muted/60 shrink-0" aria-hidden="true" />
          )}
          <span className={hasNumber ? 'text-foreground' : undefined}>
            Contains at least one number
          </span>
        </li>
        <li className="flex items-center gap-1.5">
          {hasUppercase ? (
            <Check className="h-3.5 w-3.5 text-status-success shrink-0" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5 text-foreground-muted/60 shrink-0" aria-hidden="true" />
          )}
          <span className={hasUppercase ? 'text-foreground' : undefined}>
            Contains at least one uppercase letter
          </span>
        </li>
      </ul>
    </div>
  );
};
