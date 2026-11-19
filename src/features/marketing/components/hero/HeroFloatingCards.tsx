import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * HeroFloatingCards — Renders the floating metric pill cards that overlay
 * the left and right sides of the browser mockup frame.
 */
export const HeroFloatingCards: React.FC = () => {
  return (
    <>
      {/* 1. Left Card: Resolution Rates with Area Sparkline Wave */}
      <div className="absolute -bottom-4 -left-2 sm:bottom-10 sm:-left-8 lg:-left-10 z-20 w-44 sm:w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-xl shadow-slate-900/10 dark:shadow-black/40 backdrop-blur-md">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
          Resolution rates
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            +2.5%
          </span>
          <ArrowUpRight className="h-5 w-5 text-emerald-500 stroke-[2.5]" />
        </div>

        {/* Smooth Emerald Wave Sparkline */}
        <div className="mt-2 h-9 w-full overflow-hidden">
          <svg
            viewBox="0 0 160 40"
            className="w-full h-full overflow-visible"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="hero-sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0 32 Q 25 35, 45 26 T 90 22 T 130 12 T 160 8 L 160 40 L 0 40 Z"
              fill="url(#hero-sparkline-gradient)"
            />
            <path
              d="M0 32 Q 25 35, 45 26 T 90 22 T 130 12 T 160 8"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 2. Right Card: 98% AI Resolve Rate */}
      <div className="absolute -bottom-4 -right-2 sm:bottom-12 sm:-right-8 lg:-right-10 z-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-5 py-3.5 sm:py-4 shadow-xl shadow-slate-900/10 dark:shadow-black/40 backdrop-blur-md">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none block">
          98%
        </span>
        <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">
          AI Resolve Rate
        </span>
      </div>
    </>
  );
};
