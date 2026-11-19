import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SecurityNoticeProps {
  className?: string;
  showPlannedDetails?: boolean;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({
  className,
  showPlannedDetails = true,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface-subtle/80 p-4 transition-colors duration-150',
        className,
      )}
      role="note"
      aria-label="Security Notice"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 mt-0.5">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground tracking-wide uppercase">
            Administrative Access
          </p>
          <p className="text-xs text-foreground-muted leading-relaxed">
            This area is intended for authorized platform administrators. Access attempts are
            subject to organization security policy.
          </p>
          {showPlannedDetails && (
            <div className="pt-2 mt-2 border-t border-border/60 flex items-start gap-1.5 text-[11px] text-foreground-muted/90">
              <Info className="h-3 w-3 shrink-0 mt-0.5 text-brand-violet" aria-hidden="true" />
              <span>
                <strong className="font-medium text-foreground">Planned capability:</strong>{' '}
                Hardware key (FIDO2/WebAuthn) and immutable tenant audit logging will be enforced on
                backend integration.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
