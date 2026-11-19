import React from 'react';
import { HeroBrowserChrome } from './HeroBrowserChrome';
import { HeroAppContent } from './HeroAppContent';
import { HeroFloatingCards } from './HeroFloatingCards';

/**
 * HeroBrowserMockup — Coordinates the browser window shell, chrome bar,
 * workspace preview content, and the two floating metric cards.
 */
export const HeroBrowserMockup: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-4xl select-none px-2 sm:px-0">
      {/* 1. Left and Right Floating Metric Badges */}
      <HeroFloatingCards />

      {/* 2. Main Safari Browser Window Shell */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden transition-shadow">
        <HeroBrowserChrome />
        <HeroAppContent />
      </div>
    </div>
  );
};
