import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { PRODUCT_FEATURES } from '../data/features';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-28 scroll-mt-16">
      <Container size="xl">
        <SectionHeading
          badge="Product Capabilities"
          badgeVariant="default"
          title="Everything your support team needs."
          description="Built from the ground up for teams who demand fast ticket resolution without compromising on enterprise data security."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCT_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="resolva-card p-7 flex flex-col justify-between group hover:shadow-card transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-subtle border border-border group-hover:border-brand-indigo/40 group-hover:bg-brand-indigo/10 text-brand-indigo transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    {feature.badge && (
                      <Badge variant="violet" size="sm">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-indigo transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {feature.highlight && (
                  <div className="mt-6 pt-4 border-t border-border/70 flex items-center gap-2 text-xs font-medium text-foreground-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo shrink-0" />
                    <span>{feature.highlight}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
