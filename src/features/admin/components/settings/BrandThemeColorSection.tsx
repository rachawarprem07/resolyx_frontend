import React, { useState, useRef } from 'react';
import { Palette, Check, Grid, Sparkles, Pipette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { BRAND_COLOR_PRESETS } from '@/lib/colorUtils';
import { ExcelColorPicker } from './ExcelColorPicker';

export const BrandThemeColorSection: React.FC = () => {
  const { primaryColor, setPrimaryColor } = useTheme();
  const [showExcelPicker, setShowExcelPicker] = useState(true);
  const customColorInputRef = useRef<HTMLInputElement>(null);

  const isPresetSelected = BRAND_COLOR_PRESETS.some(
    (p) => p.hex.toLowerCase() === primaryColor.toLowerCase(),
  );

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-5">
      {/* 1. Header & Excel Palette Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-brand-indigo" />
          <div>
            <h2 className="text-sm font-bold text-foreground">Theme & Brand Color</h2>
            <p className="text-xs text-foreground-muted">
              Select the primary brand accent applied across buttons, active navigation, and UI highlights.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowExcelPicker((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface-subtle hover:bg-brand-indigo/10 text-xs font-semibold text-foreground transition-all self-start sm:self-auto"
        >
          <Grid className="h-3.5 w-3.5 text-brand-indigo" />
          <span>{showExcelPicker ? 'Hide Excel Palette' : 'Excel Color Palette'}</span>
        </button>
      </div>

      {/* 2. Excel Palette / Spreadsheet Color Picker */}
      {showExcelPicker && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Grid className="h-3.5 w-3.5 text-brand-indigo" />
              Spreadsheet Color Palette (Excel Theme & Standard Matrix)
            </span>
            <span className="text-[11px] font-mono text-brand-indigo font-bold">
              Current: {primaryColor}
            </span>
          </div>
          <ExcelColorPicker currentColor={primaryColor} onSelectColor={setPrimaryColor} />
        </div>
      )}

      {/* 3. Popular Helpdesk Presets + Custom Color (8-Box Grid) */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2.5">Theme Presets & Custom Accent</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BRAND_COLOR_PRESETS.map((preset) => {
            const isSelected = primaryColor.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPrimaryColor(preset.hex)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-brand-indigo bg-brand-indigo/10 shadow-sm ring-1 ring-brand-indigo/40'
                    : 'border-border bg-surface-subtle hover:border-border-hover'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    style={{ backgroundColor: preset.hex }}
                    className="h-6 w-6 rounded-lg shrink-0 shadow-sm flex items-center justify-center border border-black/10"
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{preset.name}</p>
                    <p className="text-[10px] text-foreground-muted font-mono">{preset.hex}</p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* 8th Card: Custom Color Picker */}
          <button
            type="button"
            onClick={() => customColorInputRef.current?.click()}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              !isPresetSelected
                ? 'border-brand-indigo bg-brand-indigo/10 shadow-sm ring-1 ring-brand-indigo/40'
                : 'border-border bg-surface-subtle hover:border-border-hover'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                style={{ backgroundColor: primaryColor }}
                className="h-6 w-6 rounded-lg shrink-0 shadow-sm flex items-center justify-center border border-black/10"
              >
                {!isPresetSelected ? (
                  <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                ) : (
                  <Pipette className="h-3.5 w-3.5 text-white/90" />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">Custom Color</p>
                <p className="text-[10px] text-foreground-muted font-mono">{primaryColor}</p>
              </div>
            </div>
            <input
              ref={customColorInputRef}
              type="color"
              value={primaryColor.startsWith('#') && primaryColor.length === 7 ? primaryColor : '#6366F1'}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="sr-only"
              aria-label="Pick custom theme color"
            />
          </button>
        </div>
      </div>

      {/* 4. Live UI Color Application Preview */}
      <div className="p-4 rounded-xl bg-surface-subtle/60 border border-border space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-brand-indigo" />
          <span>Live Applied UI Preview</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-brand-indigo text-white font-semibold text-xs shadow-sm hover:opacity-90 transition-opacity"
          >
            Primary Action Button
          </button>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/25">
            Active Tag / Badge
          </span>
          <span className="px-3 py-1 rounded-xl text-xs font-semibold border-2 border-brand-indigo text-brand-indigo">
            Active Outline Tab
          </span>
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <span className="h-3 w-3 rounded-full bg-brand-indigo" />
            <span>Accent Dot</span>
          </div>
        </div>
      </div>
    </div>
  );
};
