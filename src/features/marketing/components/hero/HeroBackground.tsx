import React from 'react';

/**
 * HeroBackground — Renders the soft warm office atmosphere,
 * dual geometric constellation wireframe meshes, and ambient sparkle stars.
 */
export const HeroBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Office Photography Layer with Soft Depth Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform-gpu scale-105 filter blur-[10px] opacity-60 dark:opacity-25"
        style={{ backgroundImage: `url('/brand/hero-bg.jpg')` }}
      />

      {/* 2. Soft Ambient Warm Overlay to Guarantee High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-white/75 to-white dark:from-slate-950/60 dark:via-slate-950/85 dark:to-slate-950" />

      {/* 3. Left Constellation Geometric Polygon Wireframe Mesh */}
      <svg
        className="absolute top-8 left-0 w-[420px] lg:w-[540px] h-[380px] text-slate-400/40 dark:text-slate-600/30"
        viewBox="0 0 500 360"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.85" strokeOpacity="0.4">
          <line x1="40" y1="180" x2="110" y2="120" />
          <line x1="110" y1="120" x2="190" y2="150" />
          <line x1="190" y1="150" x2="260" y2="100" />
          <line x1="260" y1="100" x2="340" y2="140" />
          <line x1="110" y1="120" x2="130" y2="230" />
          <line x1="190" y1="150" x2="130" y2="230" />
          <line x1="190" y1="150" x2="230" y2="220" />
          <line x1="260" y1="100" x2="230" y2="220" />
          <line x1="340" y1="140" x2="310" y2="210" />
          <line x1="230" y1="220" x2="310" y2="210" />
          <line x1="40" y1="180" x2="80" y2="270" />
          <line x1="80" y1="270" x2="130" y2="230" />
          <line x1="130" y1="230" x2="180" y2="300" />
          <line x1="230" y1="220" x2="180" y2="300" />
          <line x1="230" y1="220" x2="280" y2="290" />
          <line x1="310" y1="210" x2="280" y2="290" />
          <line x1="260" y1="100" x2="220" y2="40" />
          <line x1="190" y1="150" x2="220" y2="40" />
          <line x1="110" y1="120" x2="160" y2="50" />
          <line x1="160" y1="50" x2="220" y2="40" />
        </g>
        {/* Constellation Nodes */}
        {[
          [40, 180],
          [110, 120],
          [190, 150],
          [260, 100],
          [340, 140],
          [130, 230],
          [230, 220],
          [310, 210],
          [80, 270],
          [180, 300],
          [280, 290],
          [160, 50],
          [220, 40],
        ].map(([cx, cy], idx) => (
          <circle key={idx} cx={cx} cy={cy} r="2.5" fill="currentColor" fillOpacity="0.75" />
        ))}
      </svg>

      {/* 4. Right Constellation Geometric Polygon Wireframe Mesh */}
      <svg
        className="absolute top-10 right-0 w-[420px] lg:w-[540px] h-[380px] text-slate-400/40 dark:text-slate-600/30"
        viewBox="0 0 500 360"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.85" strokeOpacity="0.4">
          <line x1="460" y1="170" x2="390" y2="110" />
          <line x1="390" y1="110" x2="310" y2="140" />
          <line x1="310" y1="140" x2="240" y2="90" />
          <line x1="240" y1="90" x2="160" y2="130" />
          <line x1="390" y1="110" x2="370" y2="220" />
          <line x1="310" y1="140" x2="370" y2="220" />
          <line x1="310" y1="140" x2="270" y2="210" />
          <line x1="240" y1="90" x2="270" y2="210" />
          <line x1="160" y1="130" x2="190" y2="200" />
          <line x1="270" y1="210" x2="190" y2="200" />
          <line x1="460" y1="170" x2="420" y2="260" />
          <line x1="420" y1="260" x2="370" y2="220" />
          <line x1="370" y1="220" x2="320" y2="290" />
          <line x1="270" y1="210" x2="320" y2="290" />
          <line x1="240" y1="90" x2="280" y2="40" />
          <line x1="310" y1="140" x2="280" y2="40" />
        </g>
        {/* Constellation Nodes */}
        {[
          [460, 170],
          [390, 110],
          [310, 140],
          [240, 90],
          [160, 130],
          [370, 220],
          [270, 210],
          [190, 200],
          [420, 260],
          [320, 290],
          [280, 40],
        ].map(([cx, cy], idx) => (
          <circle key={idx} cx={cx} cy={cy} r="2.5" fill="currentColor" fillOpacity="0.75" />
        ))}
      </svg>

      {/* 5. Lower-Right Ambient 4-Point Diamond Sparkle Star */}
      <div className="absolute bottom-16 right-8 sm:bottom-24 sm:right-16 md:right-28 text-slate-300 dark:text-slate-700/60 opacity-80">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
        </svg>
      </div>
    </div>
  );
};
