import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ResolvaLogo } from '@/components/brand/ResolvaLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Container } from '@/components/ui/Container';
import { HEADER_NAV_ITEMS } from '@/app/config/navigation.config';
import { cn } from '@/lib/utils';

export const SiteHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200 border-b',
        isScrolled
          ? 'bg-background/85 backdrop-blur-md border-border shadow-subtle'
          : 'bg-transparent border-transparent',
      )}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Official Resolyx Logo */}
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo rounded-lg p-1 -m-1"
              aria-label="Resolyx Home"
            >
              <ResolvaLogo size="lg" showSubtitle imageClassName="h-11 sm:h-12 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
            {HEADER_NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle/80 rounded-md transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right: Theme Toggle, Log In, Book a Demo CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/login"
              className="rounded-full border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-4 py-1.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition shadow-xs"
            >
              Log In
            </a>
            <a
              href="/placeholder?feature=Book%20a%20Demo"
              className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-4 py-1.5 text-sm font-semibold transition shadow-sm"
            >
              Book a Demo
            </a>
          </div>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground-muted hover:text-foreground rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border flex flex-col p-6 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200 overflow-y-auto"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
            {HEADER_NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-foreground hover:bg-surface-subtle rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
            <a
              href="/login"
              className="w-full text-center rounded-full border border-slate-300 dark:border-slate-700 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-surface-subtle transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log In
            </a>
            <a
              href="/placeholder?feature=Book%20a%20Demo"
              className="w-full text-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-2.5 text-sm font-semibold hover:bg-slate-800 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book a Demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
