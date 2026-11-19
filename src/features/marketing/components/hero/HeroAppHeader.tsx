import React from 'react';
import { HelpCircle, Bell } from 'lucide-react';
import { BrandMark } from '@/components/brand/BrandMark';

/**
 * HeroAppHeader — Top application navigation bar inside the browser mockup.
 */
export const HeroAppHeader: React.FC = () => {
  return (
    <div className="flex h-11 sm:h-12 items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <BrandMark size={20} />
        <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Resolyx
        </span>
      </div>

      <div className="flex items-center gap-3">
        <HelpCircle className="h-4 w-4 text-slate-400 hover:text-slate-600 transition cursor-pointer" />
        <div className="relative cursor-pointer">
          <Bell className="h-4 w-4 text-slate-400 hover:text-slate-600 transition" />
          <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </div>
        {/* User Portrait Avatar */}
        <div className="h-6 w-6 rounded-full bg-slate-800 text-white font-semibold text-[10px] flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
            alt="Agent Avatar"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-[10px] font-bold">JD</span>
        </div>
      </div>
    </div>
  );
};
