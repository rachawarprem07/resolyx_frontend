import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * HeroHeaderContent — Renders the top announcement pill, primary headline,
 * value proposition paragraph, and dual call-to-action buttons.
 */
export const HeroHeaderContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
      {/* 1. Announcement Pill Badge */}
      <div className="inline-flex items-center gap-2 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 px-4 py-1.5 shadow-sm text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
        <Sparkles className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
        <span>Now powered by next-gen AI</span>
      </div>

      {/* 2. Main Hero Headline */}
      <h1 className="mt-4 sm:mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] sm:leading-[1.12]">
        Support, solved
        <br />
        autonomously.
      </h1>

      {/* 3. Supporting Value Proposition Description */}
      <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
        Resolyx acts as your first line of defense, instantly resolving customer tickets with
        intelligent automation so your team can focus on what matters.
      </p>

      {/* 4. Action Buttons */}
      <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <a
          href="/placeholder?feature=Get%20Started"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-7 py-3 text-sm sm:text-base font-semibold shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Start Your Free Trial
        </a>

        <a
          href="#features"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm sm:text-base font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors group"
        >
          <span>Watch how it works</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};
