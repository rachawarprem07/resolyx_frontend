import React from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Share, Plus, Shield } from 'lucide-react';

/**
 * HeroBrowserChrome — Renders the macOS Safari-styled window header
 * with window traffic controls, navigation chevrons, address bar, and action icons.
 */
export const HeroBrowserChrome: React.FC = () => {
  return (
    <div className="flex h-10 sm:h-11 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/80 px-3.5 sm:px-4 gap-2 select-none">
      {/* 1. macOS Window Traffic Controls & Navigation Chevrons */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/40" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40" />
          <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/40" />
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-400 ml-1.5">
          <ChevronLeft className="h-3.5 w-3.5" />
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* 2. Centered Safari Address Bar */}
      <div className="flex-1 max-w-[220px] sm:max-w-xs md:max-w-sm mx-auto">
        <div className="flex h-7 items-center justify-between rounded-lg bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 px-2.5 text-xs text-slate-500 shadow-inner">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
              resolyx.com
            </span>
          </div>
          <RotateCw className="h-3 w-3 text-slate-400" />
        </div>
      </div>

      {/* 3. Right Window Controls (Share & New Tab) */}
      <div className="hidden sm:flex items-center gap-2.5 text-slate-400">
        <Share className="h-3.5 w-3.5" />
        <Plus className="h-3.5 w-3.5" />
      </div>
    </div>
  );
};
