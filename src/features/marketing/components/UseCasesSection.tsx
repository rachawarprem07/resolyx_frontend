import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { USE_CASES } from '../data/useCases';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  return (
    <section id="use-cases" className="py-20 sm:py-28 scroll-mt-16">
      <Container size="xl">
        <SectionHeading
          badge="Tailored Workspaces"
          badgeVariant="default"
          title="One platform. Two support experiences."
          description="Whether resolving technical issues for internal employees or providing rapid assistance to customers, Resolyx adapts to each unique operational context."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            const isIT = useCase.id === 'it-helpdesk';

            return (
              <div
                key={useCase.id}
                className="resolva-card p-8 sm:p-10 flex flex-col justify-between group hover:shadow-card transition-all"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isIT
                          ? 'bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20'
                          : 'bg-brand-violet/10 text-brand-violet dark:bg-brand-violet/20'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant={isIT ? 'default' : 'violet'}>{useCase.badge}</Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground">{useCase.title}</h3>
                  <p className="mt-3 text-base text-foreground-muted leading-relaxed">
                    {useCase.description}
                  </p>

                  {/* Representative Request Types */}
                  <div className="mt-8">
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted block mb-3">
                      Example Support Scenarios
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {useCase.examples.map((ex) => (
                        <div
                          key={ex.title}
                          className="rounded-lg bg-surface-subtle/70 border border-border p-3 text-left"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-semibold text-foreground">
                              {ex.title}
                            </span>
                            <span className="text-[10px] font-mono text-brand-indigo dark:text-brand-violet">
                              {ex.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-foreground-muted line-clamp-2">
                            {ex.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="mt-8 pt-6 border-t border-border/70 space-y-2.5">
                    {useCase.keyBenefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-start gap-2.5 text-xs text-foreground-muted"
                      >
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 mt-0.5 ${
                            isIT ? 'text-brand-indigo' : 'text-brand-violet'
                          }`}
                        />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <a
                    href={`/placeholder?feature=${encodeURIComponent(useCase.title)}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo hover:text-brand-indigo-hover transition-colors"
                  >
                    <span>Explore {useCase.title} workflows</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
