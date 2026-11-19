import React from 'react';
import { Server, Lock, UserCheck, Shield, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';

export const PrivacySection: React.FC = () => {
  return (
    <section id="privacy" className="py-20 sm:py-28 relative overflow-hidden scroll-mt-16">
      <Container size="xl">
        {/* Distinctive Dark Surface Container with Indigo/Violet Accents */}
        <div className="relative rounded-3xl bg-navy-midnight border border-navy-slate/80 p-8 sm:p-12 lg:p-16 text-white shadow-2xl overflow-hidden">
          {/* Ambient background glow */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-indigo/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl">
            <Badge variant="violet" dot size="md" className="mb-4">
              Private-AI Architecture
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Your data. Your infrastructure.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-violet">
                Your control.
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
              Resolyx is designed around private AI inference. Keep support conversations and
              company knowledge within your controlled deployment instead of sending them to public
              AI APIs.
            </p>
          </div>

          {/* Three Key Architectural Pillars */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* 1. Private Inference */}
            <div className="rounded-2xl bg-navy-slate/70 border border-navy-slate p-6 sm:p-8 flex flex-col justify-between hover:border-brand-indigo/40 transition-colors">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-indigo/20 text-brand-indigo mb-5">
                  <Server className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Private Inference</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AI runs within the configured controlled environment. Support ticket history and
                  customer data never leave your hosting boundary or feed external LLM training
                  loops.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-navy-slate/80 flex items-center gap-2 text-xs text-brand-indigo">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Zero telemetry to public LLMs</span>
              </div>
            </div>

            {/* 2. Knowledge Access Controls */}
            <div className="rounded-2xl bg-navy-slate/70 border border-navy-slate p-6 sm:p-8 flex flex-col justify-between hover:border-brand-violet/40 transition-colors">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-violet/20 text-brand-violet mb-5">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Knowledge Access Controls</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AI retrieval strictly respects document permissions. Internal engineering
                  runbooks, executive memos, and customer records are segregated by role-based ACLs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-navy-slate/80 flex items-center gap-2 text-xs text-brand-violet">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Enforced retrieval permissions</span>
              </div>
            </div>

            {/* 3. Human Oversight */}
            <div className="rounded-2xl bg-navy-slate/70 border border-navy-slate p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-5">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Human Oversight</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Review AI suggestions and control which actions can run automatically. Human
                  agents remain the decision-makers for all sensitive communications and
                  administrative grants.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-navy-slate/80 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Human-in-the-loop by design</span>
              </div>
            </div>
          </div>

          {/* Architectural transparency footer note */}
          <div className="mt-10 pt-6 border-t border-navy-slate flex items-center gap-3 text-xs text-slate-400">
            <Shield className="h-4 w-4 text-brand-indigo shrink-0" />
            <p>
              Architectural Design Commitment: Resolyx builds upon self-contained models and
              verified access boundaries. Capabilities describe target system design and are subject
              to your deployment environment configuration.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
