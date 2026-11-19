import React from 'react';

/**
 * LoginBackground — Ambient sky-blue gradient backdrop with lower-right diamond sparkle star.
 */
export const LoginBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Soft Sky-Blue / Periwinkle Ethereal Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EBF3FE] via-[#F4F8FF] to-[#E8F1FE] dark:from-[#0B1020] dark:via-[#0F172A] dark:to-[#0B1020]" />

      {/* 2. Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />

      {/* 3. Lower-Right Ambient 4-Point Diamond Sparkle Star */}
      <div className="absolute bottom-10 right-8 sm:bottom-16 sm:right-16 md:right-24 text-slate-300 dark:text-slate-700/60 opacity-80">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
        </svg>
      </div>
    </div>
  );
};
