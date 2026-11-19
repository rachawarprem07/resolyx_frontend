import React from 'react';
import { Sparkles, BookOpen, ShieldCheck, Lock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const VALUE_CARDS = [
  {
    icon: Sparkles,
    title: 'Resolve repetitive requests',
    description:
      'Deflect routine setup, password, and troubleshooting inquiries by empowering agents with one-click approved responses.',
  },
  {
    icon: BookOpen,
    title: 'Find answers in company knowledge',
    description:
      'Instantly index internal guides, policy docs, and runbooks so relevant context surfaces right alongside every ticket.',
  },
  {
    icon: ShieldCheck,
    title: 'Keep humans in control',
    description:
      'AI drafts recommendations and retrieves context, but your support engineers review and approve every outgoing answer.',
  },
  {
    icon: Lock,
    title: 'Keep sensitive information private',
    description:
      'Inference runs within your controlled environment. Confidential corporate secrets and client tickets never leave your firewall.',
  },
];

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 border-y border-border/60 bg-surface-subtle/30">
      <Container size="xl">
        <SectionHeading
          badge="Unified Support Workspace"
          badgeVariant="default"
          title="Less repetitive work. More resolved issues."
          description="Resolyx brings ticket management, private AI assistance, and support automation into one unified workspace, eliminating context switching for your technical and support teams."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="resolva-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
