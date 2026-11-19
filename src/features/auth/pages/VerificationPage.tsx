import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthStatusCard } from '../components/AuthStatusCard';
import type { VerificationStatus } from '../types/auth.types';
import { cn } from '@/lib/utils';

export const VerificationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramStatus = searchParams.get('status') as VerificationStatus | null;
  const initialStatus: VerificationStatus =
    paramStatus && ['pending', 'success', 'failed', 'unavailable'].includes(paramStatus)
      ? paramStatus
      : 'pending';

  const [activeStatus, setActiveStatus] = useState<VerificationStatus>(initialStatus);

  const handleStatusChange = (status: VerificationStatus) => {
    setActiveStatus(status);
    setSearchParams({ status });
  };

  const statusOptions: { label: string; value: VerificationStatus }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Success', value: 'success' },
    { label: 'Failed', value: 'failed' },
    { label: 'Unavailable', value: 'unavailable' },
  ];

  return (
    <AuthLayout maxWidth="md">
      <div className="space-y-6">
        {/* Interactive Demo State Selector */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            Demonstration State Preview
          </p>
          <div className="inline-flex rounded-lg bg-surface border border-border p-1 gap-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStatusChange(opt.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer',
                  activeStatus === opt.value
                    ? 'bg-brand-indigo text-white shadow-subtle'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Status Card */}
        <AuthStatusCard
          status={activeStatus}
          primaryActionLabel="Return to Sign In"
          primaryActionHref="/login"
          secondaryActionLabel={activeStatus === 'failed' ? 'Request New Link' : undefined}
          secondaryActionHref={activeStatus === 'failed' ? '/forgot-password' : undefined}
        />
      </div>
    </AuthLayout>
  );
};
