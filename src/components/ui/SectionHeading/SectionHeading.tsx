import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '../Badge';

export interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: 'default' | 'violet' | 'neutral';
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeVariant = 'default',
  title,
  description,
  align = 'center',
  className,
  titleClassName,
}) => {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {badge && (
        <div className="mb-4">
          <Badge variant={badgeVariant}>{badge}</Badge>
        </div>
      )}
      <h2
        className={cn(
          'text-3xl sm:text-4xl font-bold tracking-tight text-foreground',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-foreground-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
