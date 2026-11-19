import React from 'react';
import { cn } from '@/lib/utils';

export interface BrandMarkProps {
  size?: number | string;
  className?: string;
  withContainer?: boolean;
}

/**
 * BrandMark
 *
 * Renders the locked Resolyx brand symbol:
 * - Abstract speech-bubble and gear-inspired symbol
 * - Blue-to-cyan gradient
 * - Integrated vivid orange checkmark accent
 * - Strictly preserves approved proportions without letterforms
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 36,
  className,
  withContainer = false,
}) => {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 transition-transform duration-200 group-hover:scale-105', className)}
      role="img"
      aria-label="Resolyx Brand Mark"
    >
      <defs>
        <linearGradient
          id="resolva-bubble-grad"
          x1="6"
          y1="6"
          x2="42"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient
          id="resolva-orange-check"
          x1="16"
          y1="20"
          x2="33"
          y2="33"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <filter id="mark-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0284C7" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer subtle gear teeth notches representing IT/automation intelligence */}
      <g opacity="0.28" filter="url(#mark-glow)">
        <path
          d="M24 7C22.6 7 22.3 8.6 21.1 8.9C19.9 9.2 18.9 8.2 17.7 8.8C16.5 9.4 16.7 11 15.6 11.8C14.5 12.6 13.2 12 12.4 13.1C11.6 14.1 12.3 15.6 11.7 16.7C11.1 17.8 9.5 17.9 9.2 19.3C8.9 20.6 10.3 21.6 10.3 23C10.3 24.4 8.9 25.4 9.2 26.7C9.5 28.1 11.1 28.2 11.7 29.3C12.3 30.4 11.6 31.9 12.4 32.9C13.2 34 14.5 33.4 15.6 34.2C16.7 35 16.5 36.6 17.7 37.2C18.9 37.8 19.9 36.8 21.1 37.1C22.3 37.4 22.6 39 24 39C25.4 39 25.7 37.4 26.9 37.1C28.1 36.8 29.1 37.8 30.3 37.2C31.5 36.6 31.3 35 32.4 34.2C33.5 33.4 34.8 34 35.6 32.9C36.4 31.9 35.7 30.4 36.3 29.3C36.9 28.2 38.5 28.1 38.8 26.7C39.1 25.4 37.7 24.4 37.7 23C37.7 21.6 39.1 20.6 38.8 19.3C38.5 17.9 36.9 17.8 36.3 16.7C35.7 15.6 36.4 14.1 35.6 13.1C34.8 12 33.5 12.6 32.4 11.8C31.3 11 31.5 9.4 30.3 8.8C29.1 8.2 28.1 9.2 26.9 8.9C25.7 8.6 25.4 7 24 7Z"
          fill="url(#resolva-bubble-grad)"
        />
      </g>

      {/* Central Speech Bubble symbol with directional helpdesk tail */}
      <path
        d="M24 10C16.82 10 11 15.6 11 22.5C11 25.9 12.45 28.98 14.83 31.2L14.2 36.8C14.12 37.52 14.88 38.04 15.48 37.64L20.6 34.2C21.7 34.72 22.82 35 24 35C31.18 35 37 29.4 37 22.5C37 15.6 31.18 10 24 10Z"
        fill="url(#resolva-bubble-grad)"
      />

      {/* Interior subtle depth contour */}
      <path
        d="M24 12C17.925 12 13 16.7 13 22.5C13 25.4 14.24 28.02 16.27 29.9L15.8 34.6L20.2 32.4C21.4 32.8 22.68 33 24 33C30.075 33 35 28.3 35 22.5C35 16.7 30.075 12 24 12Z"
        fill="#0EA5E9"
        opacity="0.3"
      />

      {/* Integrated Vivid Orange Checkmark Accent */}
      <path
        d="M17.5 22.8L22.2 27.5L31.2 17.8"
        stroke="url(#resolva-orange-check)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (withContainer) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-midnight border border-navy-slate/80 shadow-subtle p-1">
        {mark}
      </div>
    );
  }

  return mark;
};
