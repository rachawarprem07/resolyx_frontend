import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading workspace...',
  className,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center p-8 text-center', className)}
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-brand-indigo/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-brand-indigo border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-foreground-muted">{message}</p>
      <span className="sr-only">Loading</span>
    </div>
  );
};
