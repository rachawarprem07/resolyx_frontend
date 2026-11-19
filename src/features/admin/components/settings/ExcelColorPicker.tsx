import React, { useRef } from 'react';
import { Pipette, Check } from 'lucide-react';
import {
  EXCEL_THEME_COLUMNS,
  EXCEL_STANDARD_COLORS,
  normalizeHex,
} from '@/lib/colorUtils';

interface ExcelColorPickerProps {
  currentColor: string;
  onSelectColor: (color: string) => void;
}

export const ExcelColorPicker: React.FC<ExcelColorPickerProps> = ({
  currentColor,
  onSelectColor,
}) => {
  const nativeColorInputRef = useRef<HTMLInputElement>(null);
  const normalizedCurrent = normalizeHex(currentColor).toUpperCase();

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
      onSelectColor(normalizeHex(val));
    } else if (!val.startsWith('#') && (val.length === 3 || val.length === 6)) {
      onSelectColor(normalizeHex('#' + val));
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-surface border border-border shadow-elevated space-y-3.5 max-w-sm sm:max-w-md select-none">
      {/* 1. Theme Colors Grid (Excel 10 Columns Matrix) */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted mb-2">
          Theme Colors
        </p>
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
          {EXCEL_THEME_COLUMNS.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1 sm:gap-1.5">
              {col.shades.map((shade, rowIdx) => {
                const isSelected = normalizedCurrent === shade.toUpperCase();
                return (
                  <button
                    key={rowIdx}
                    type="button"
                    title={`${col.name}: ${shade}`}
                    onClick={() => onSelectColor(shade)}
                    style={{ backgroundColor: shade }}
                    className={`h-5 w-5 sm:h-6 sm:w-6 rounded-md border transition-transform hover:scale-110 flex items-center justify-center relative ${
                      rowIdx === 0 ? 'border-black/25' : 'border-black/10'
                    } ${
                      isSelected ? 'ring-2 ring-brand-indigo ring-offset-1 z-10' : ''
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className={`h-3 w-3 ${
                          rowIdx < 2 && (colIdx === 0 || colIdx === 2)
                            ? 'text-slate-900'
                            : 'text-white'
                        } stroke-[3]`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Standard Colors Row */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted mb-2">
          Standard Colors
        </p>
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
          {EXCEL_STANDARD_COLORS.map((color, idx) => {
            const isSelected = normalizedCurrent === color.toUpperCase();
            return (
              <button
                key={idx}
                type="button"
                title={`Standard: ${color}`}
                onClick={() => onSelectColor(color)}
                style={{ backgroundColor: color }}
                className={`h-5 w-5 sm:h-6 sm:w-6 rounded-md border border-black/15 transition-transform hover:scale-110 flex items-center justify-center relative ${
                  isSelected ? 'ring-2 ring-brand-indigo ring-offset-1 z-10' : ''
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Custom Color / Eyedropper Picker */}
      <div className="pt-2 border-t border-border flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => nativeColorInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:border-brand-indigo bg-surface-subtle hover:bg-brand-indigo/10 text-xs font-semibold text-foreground transition-all"
        >
          <Pipette className="h-3.5 w-3.5 text-brand-indigo" />
          <span>More Colors...</span>
          <input
            ref={nativeColorInputRef}
            type="color"
            value={normalizedCurrent}
            onChange={(e) => onSelectColor(e.target.value)}
            className="sr-only"
            aria-label="Pick custom spectrum color"
          />
        </button>

        <div className="flex items-center gap-2">
          <span
            style={{ backgroundColor: normalizedCurrent }}
            className="h-5 w-5 rounded-md border border-black/20 shrink-0 shadow-sm"
          />
          <input
            type="text"
            defaultValue={normalizedCurrent}
            key={normalizedCurrent}
            onBlur={handleCustomHexChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCustomHexChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            placeholder="#6366F1"
            className="w-20 px-2 py-1 rounded-lg border border-border bg-surface-subtle text-foreground font-mono text-xs focus:ring-2 focus:ring-brand-indigo uppercase text-center"
          />
        </div>
      </div>
    </div>
  );
};

