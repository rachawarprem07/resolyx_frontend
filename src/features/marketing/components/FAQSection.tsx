import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FAQ_ITEMS } from '../data/faqs';
import { cn } from '@/lib/utils';

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'what-is-resolyx': true, // First item open by default for immediate preview
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 bg-surface-subtle/30 border-y border-border/60 scroll-mt-16"
    >
      <Container size="md">
        <SectionHeading
          badge="Frequently Asked Questions"
          badgeVariant="default"
          title="Questions about Resolyx &amp; Private AI"
          description="Clear answers about our architecture, private AI inference, deployment models, and helpdesk features."
        />

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = Boolean(openItems[item.id]);
            const buttonId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className="resolva-card overflow-hidden bg-surface transition-colors"
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo rounded-xl"
                >
                  <span className="text-base sm:text-lg font-semibold text-foreground pr-2">
                    {item.question}
                  </span>
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-subtle text-foreground-muted transition-transform duration-200',
                      isOpen && 'rotate-180 text-brand-indigo bg-brand-indigo/10',
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 text-sm sm:text-base text-foreground-muted leading-relaxed border-t border-border/40 mt-1"
                  >
                    <p className="pt-4">{item.answer}</p>
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
