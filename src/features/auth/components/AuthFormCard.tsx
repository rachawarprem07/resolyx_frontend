import React from 'react';
import { cn } from '@/lib/utils';

export interface AuthFormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'w-full rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-card transition-colors duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
