import React from 'react';
import { Shield, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ResolvaLogo } from '@/components/brand/ResolvaLogo';
import { BRAND_TAGLINE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface AuthBrandPanelProps {
  className?: string;
}

export const AuthBrandPanel: React.FC<AuthBrandPanelProps> = ({ className }) => {
  const benefits = [
    {
      title: 'Private AI assistance',
      description:
        'Zero-retention model inference running securely inside your sovereign infrastructure.',
      icon: Shield,
    },
    {
      title: 'Intelligent support workflows',
      description:
        'Automated ticket categorization, intelligent triage, and rapid root-cause drafting.',
      icon: Sparkles,
    },
    {
      title: 'Human-controlled automation',
      description:
        'Enforce mandatory human sign-off on external responses and sensitive remediation actions.',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <aside
      aria-label="Resolyx Product Overview"
      className={cn(
        'relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden',
        'bg-[#0B1020] text-white border-r border-[#151C2E]',
        className,
      )}
    >
      {/* Background Subtle Gradient Glows (Restrained Indigo & Violet) */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-indigo/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-brand-violet/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Header Area: Resolva Logo & Tagline */}
      <div className="relative z-10 space-y-3">
        <a
          href="/"
          className="inline-block transition-transform hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo rounded-lg"
        >
          <ResolvaLogo
            imageSrc="/brand/resolyx.png"
            size="md"
            variant="dark-surface"
            showSubtitle={true}
          />
        </a>
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          {BRAND_TAGLINE}
        </p>
      </div>

      {/* Main Copy & Benefits */}
      <div className="relative z-10 my-auto py-8 space-y-8 max-w-lg">
        <div className="space-y-3">
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Support that solves more. Shares less.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Enterprise IT and customer support engineered with zero-compromise privacy. Resolyx
            keeps your corporate data and intellectual property strictly within your perimeter.
          </p>
        </div>

        {/* Benefit Items */}
        <div className="space-y-5 pt-2">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div key={benefit.title} className="flex items-start gap-3.5 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#151C2E] border border-brand-indigo/20 text-brand-indigo group-hover:border-brand-indigo/40 group-hover:bg-[#1E293B] transition-colors mt-0.5 shadow-subtle">
                  <IconComponent className="h-4 w-4 text-brand-indigo" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="relative z-10 pt-6 border-t border-[#151C2E] flex items-center justify-between text-xs text-slate-400">
        <span>Resolyx Enterprise v0.1</span>
        <span className="font-mono text-[11px] text-slate-500">
          SOC 2 &bull; HIPAA &bull; GDPR Ready
        </span>
      </div>
    </aside>
  );
};
