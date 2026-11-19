import React from 'react';
import { ResolvaLogo } from '@/components/brand/ResolvaLogo';
import { Container } from '@/components/ui/Container';
import { FOOTER_NAV_SECTIONS } from '@/app/config/navigation.config';
import { BRAND_TAGLINE } from '@/lib/constants';

export const SiteFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-subtle/50 transition-colors">
      <Container size="xl" className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <ResolvaLogo size="md" />
            <p className="mt-4 text-sm text-foreground-muted leading-relaxed max-w-sm">
              {BRAND_TAGLINE} An enterprise helpdesk designed for IT and customer support, with
              private AI running on infrastructure you control.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-foreground-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>Self-hosted &amp; private deployment ready</span>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_NAV_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground tracking-wide">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-muted">
          <p>&copy; {currentYear} Resolyx. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="/placeholder?feature=Privacy%20Policy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/placeholder?feature=Terms%20of%20Service"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/placeholder?feature=Security%20Architecture"
              className="hover:text-foreground transition-colors"
            >
              Security Overview
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
