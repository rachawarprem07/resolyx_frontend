import React from 'react';
import { ResolvaLogo } from '@/components/brand/ResolvaLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

export interface AuthLayoutProps {
  children: React.ReactNode;
  brandPanel?: React.ReactNode;
  headerCenter?: React.ReactNode;
  showMobileBrandHeader?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  brandPanel,
  headerCenter,
  showMobileBrandHeader = true,
  maxWidth = 'md',
  className,
}) => {
  const hasBrandPanel = Boolean(brandPanel);

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  if (hasBrandPanel) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col lg:grid lg:grid-cols-12 transition-colors duration-200">
        {/* Left Column: Brand Panel (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5 h-full">{brandPanel}</div>

        {/* Right Column: Interactive Content / Form Panel */}
        <main className="flex-1 lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-4 sm:p-8 lg:p-12 min-h-screen">
          {/* Top Navbar */}
          <header className="w-full flex items-center justify-between py-2 mb-6">
            <div className="flex items-center gap-3">
              {/* Show logo on mobile/tablet or when brand panel is hidden */}
              <div className="lg:hidden">
                <a
                  href="/"
                  className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo rounded-lg"
                  aria-label="Resolyx Home"
                >
                  <ResolvaLogo imageSrc="/brand/resolyx.png" size="sm" />
                </a>
              </div>
              {headerCenter}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          {/* Form Content (Centered Vertically and Horizontally) */}
          <div className="w-full my-auto flex flex-col items-center justify-center">
            <div className={cn('w-full', maxWidthClass, className)}>{children}</div>
          </div>

          {/* Minimal Auth Footer */}
          <footer className="w-full pt-8 mt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground-muted">
            <p>&copy; {new Date().getFullYear()} Resolyx AI Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a
                href="/placeholder?feature=Privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-border">&bull;</span>
              <a
                href="/placeholder?feature=Terms"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // Centered single-column layout (Admin, Password Reset, Verification, Unauthorized)
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-10 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 mb-4">
        {showMobileBrandHeader ? (
          <a
            href="/"
            className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo rounded-lg"
            aria-label="Resolyx Home"
          >
            <ResolvaLogo imageSrc="/brand/resolyx.png" size="md" />
          </a>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-3">
          {headerCenter}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full my-auto flex flex-col items-center justify-center py-6">
        <div className={cn('w-full', maxWidthClass, className)}>{children}</div>
      </main>

      {/* Minimal Auth Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground-muted">
        <p>&copy; {new Date().getFullYear()} Resolyx AI Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="/placeholder?feature=Privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-border">&bull;</span>
          <a href="/placeholder?feature=Terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};
