import React from 'react';
import { BrandMark } from '@/components/brand/BrandMark';

/**
 * ResolvaSupportBrand — Renders the circular Resolyx speech-mark
 * with checkmark and the "Resolyx Support" wordmark.
 */
export const ResolvaSupportBrand: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2.5 mb-3 sm:mb-4 select-none">
      <BrandMark size={28} />
      <div className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        <span>Resolyx</span>
        <span className="font-normal text-slate-700 dark:text-slate-300">Support</span>
      </div>
    </div>
  );
};
