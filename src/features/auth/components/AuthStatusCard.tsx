import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert, Info } from 'lucide-react';
import type { VerificationStatus } from '../types/auth.types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type StatusCardType = VerificationStatus | 'unauthorized';

export interface AuthStatusCardProps {
  status: StatusCardType;
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
  showPrototypeNotice?: boolean;
}

const STATUS_CONFIGS: Record<
  StatusCardType,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    badgeLabel: string;
    badgeStyle: string;
    defaultTitle: string;
    defaultDescription: string;
  }
> = {
  pending: {
    icon: Clock,
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-status-warning',
    badgeLabel: 'Pending Verification',
    badgeStyle: 'bg-amber-500/10 text-status-warning border-amber-500/20',
    defaultTitle: 'Verification pending',
    defaultDescription:
      'We are verifying your credentials with the Resolyx directory service. Please wait or check your link.',
  },
  success: {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-status-success',
    badgeLabel: 'Verified',
    badgeStyle: 'bg-emerald-500/10 text-status-success border-emerald-500/20',
    defaultTitle: 'Verification successful',
    defaultDescription:
      'Your account verification is complete. You can now access your Resolyx helpdesk workspace.',
  },
  failed: {
    icon: XCircle,
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    iconColor: 'text-status-error',
    badgeLabel: 'Verification Failed',
    badgeStyle: 'bg-rose-500/10 text-status-error border-rose-500/20',
    defaultTitle: 'Verification failed',
    defaultDescription:
      'This verification link has expired or has already been used. Please request a new link to proceed.',
  },
  unavailable: {
    icon: AlertTriangle,
    iconBg: 'bg-slate-500/10 border-slate-500/20',
    iconColor: 'text-foreground-muted',
    badgeLabel: 'Service Unavailable',
    badgeStyle: 'bg-surface-subtle text-foreground-muted border-border',
    defaultTitle: 'Verification unavailable',
    defaultDescription:
      'The identity verification service is temporarily unreachable. Please try again shortly or contact your workspace administrator.',
  },
  unauthorized: {
    icon: ShieldAlert,
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    iconColor: 'text-status-error',
    badgeLabel: 'Access Restricted',
    badgeStyle: 'bg-rose-500/10 text-status-error border-rose-500/20',
    defaultTitle: 'Access restricted',
    defaultDescription:
      'This area is intended for authorized users. Sign in with an account that has the appropriate permissions.',
  },
};

export const AuthStatusCard: React.FC<AuthStatusCardProps> = ({
  status,
  title,
  description,
  primaryActionLabel = 'Return to Sign In',
  primaryActionHref = '/login',
  onPrimaryAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className,
  showPrototypeNotice = true,
}) => {
  const config = STATUS_CONFIGS[status];
  const IconComponent = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;

  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-card text-center',
        className,
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border mb-5 transition-transform duration-200',
          config.iconBg,
          config.iconColor,
        )}
      >
        <IconComponent className="h-7 w-7" />
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border',
            config.badgeStyle,
          )}
        >
          {config.badgeLabel}
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        {displayTitle}
      </h1>

      {/* Description */}
      <p className="mt-2 text-sm text-foreground-muted leading-relaxed">{displayDescription}</p>

      {/* Prototype Notice */}
      {showPrototypeNotice && (
        <div className="mt-6 rounded-lg bg-surface-subtle border border-border p-3 text-left flex items-start gap-2.5">
          <Info className="h-4 w-4 text-brand-indigo shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11px] text-foreground-muted leading-relaxed">
            <strong className="font-semibold text-foreground">Frontend demonstration:</strong> Real
            verification and authorization checks will be performed securely by the backend in
            production.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {secondaryActionLabel && (
          <Button
            variant="outline"
            size="md"
            href={secondaryActionHref}
            onClick={onSecondaryAction}
            className="flex-1 justify-center"
          >
            {secondaryActionLabel}
          </Button>
        )}
        <Button
          variant="primary"
          size="md"
          href={primaryActionHref}
          onClick={onPrimaryAction}
          className="flex-1 justify-center"
        >
          {primaryActionLabel}
        </Button>
      </div>
    </div>
  );
};
