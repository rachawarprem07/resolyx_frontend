import React from 'react';
import { cn } from '@/lib/utils';

export interface AuthPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const AuthPageHeader: React.FC<AuthPageHeaderProps> = ({
  title,
  description,
  badge,
  align = 'left',
  className,
}) => {
  return (
    <div className={cn('space-y-1.5', align === 'center' ? 'text-center' : 'text-left', className)}>
      {badge && (
        <div className={cn('flex', align === 'center' ? 'justify-center' : 'justify-start')}>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
            {badge}
          </span>
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      {description && (
        <p className="text-sm text-foreground-muted leading-relaxed">{description}</p>
      )}
    </div>
  );
};
