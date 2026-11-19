import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <Container size="lg">
        <div className="relative rounded-3xl bg-gradient-to-b from-surface to-surface-subtle border border-border p-8 sm:p-14 lg:p-16 text-center shadow-card overflow-hidden">
          {/* Subtle accent backdrop */}
          <div
            className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-r from-brand-indigo/10 via-brand-violet/10 to-brand-indigo/10 blur-2xl opacity-70"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-indigo dark:text-brand-violet mb-3 inline-block">
              Private AI &bull; Smarter Support
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Make every support request count.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-foreground-muted leading-relaxed">
              Bring your tickets, company knowledge, and private AI assistance into one support
              workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                href="/placeholder?feature=Get%20Started"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                Get Started with Resolyx
              </Button>
              <Button variant="secondary" size="lg" href="#features" className="w-full sm:w-auto">
                Explore the product
              </Button>
            </div>

            <p className="mt-6 text-xs text-foreground-muted">
              Zero telemetry leaks. Self-hosted &amp; private VPC deployment architecture.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
