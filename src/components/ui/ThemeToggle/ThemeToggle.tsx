import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg p-2 text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo',
        className,
      )}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={cn(
            'h-5 w-5 absolute inset-0 text-amber-500 transition-all duration-300 transform',
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none',
          )}
          aria-hidden="true"
        />
        <Moon
          className={cn(
            'h-5 w-5 absolute inset-0 text-slate-muted transition-all duration-300 transform',
            !isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-50 pointer-events-none',
          )}
          aria-hidden="true"
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-sm font-medium">{isDark ? 'Light mode' : 'Dark mode'}</span>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
