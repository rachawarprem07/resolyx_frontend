import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Inbox, BrainCircuit, CheckCircle, ShieldAlert } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    label: 'Capture',
    title: 'Collect and organize requests',
    description:
      'Tickets flow seamlessly from internal employee portals, email, chat, or customer forms into an organized, prioritized central queue.',
    icon: Inbox,
  },
  {
    step: '02',
    label: 'Understand',
    title: 'Classify & search knowledge',
    description:
      'Private AI classifies request severity, identifies the topic, and searches relevant internal documents and past approved resolutions.',
    icon: BrainCircuit,
  },
  {
    step: '03',
    label: 'Resolve',
    title: 'Suggest, route, or escalate',
    description:
      'Provide a suggested solution for agent review, route to the appropriate technical team, or safely trigger approved self-service workflows.',
    icon: CheckCircle,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 bg-surface-subtle/30 border-y border-border/60 scroll-mt-16"
    >
      <Container size="xl">
        <SectionHeading
          badge="Step-by-Step Workflow"
          badgeVariant="default"
          title="From incoming request to resolution."
          description="A structured, policy-controlled pipeline designed to accelerate support without relinquishing human oversight or data control."
        />

        {/* 3-Step Process: Horizontal on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="resolva-card p-8 flex flex-col justify-between relative bg-surface"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-bold text-brand-indigo/60 dark:text-brand-indigo/80">
                      {step.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <span className="text-xs uppercase tracking-wider font-semibold text-brand-violet">
                    {step.label}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-1 mb-3">{step.title}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-foreground-muted">
                  <span>Phase {idx + 1} of 3</span>
                  <span className="font-medium text-brand-indigo">Policy bounded &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Policy Note */}
        <div className="mt-12 rounded-xl border border-border bg-surface p-4 sm:p-5 flex items-start gap-3.5 max-w-3xl mx-auto shadow-subtle">
          <ShieldAlert className="h-5 w-5 text-brand-indigo shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
            <strong className="text-foreground font-semibold">Policy Guardrails:</strong> Automatic
            actions are limited by configured role permissions and enterprise execution policies.
            Destructive actions, system access grants, and external emails always require explicit
            human verification.
          </p>
        </div>
      </Container>
    </section>
  );
};
