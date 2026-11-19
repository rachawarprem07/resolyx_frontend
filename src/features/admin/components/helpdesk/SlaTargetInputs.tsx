import React from 'react';

interface SlaTargetInputsProps {
  firstResponseMinutes: number;
  resolutionHours: number;
  onChangeFirstResponse: (val: number) => void;
  onChangeResolution: (val: number) => void;
}

export const SlaTargetInputs: React.FC<SlaTargetInputsProps> = ({
  firstResponseMinutes,
  resolutionHours,
  onChangeFirstResponse,
  onChangeResolution,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          First Response Target
        </label>
        <div className="relative">
          <input
            type="number"
            min="5"
            max="1440"
            step="5"
            required
            value={firstResponseMinutes}
            onChange={(e) => onChangeFirstResponse(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          />
          <span className="absolute right-3 top-2 text-xs text-foreground-muted font-medium">
            min
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          Resolution Target
        </label>
        <div className="relative">
          <input
            type="number"
            min="0.25"
            max="168"
            step="0.25"
            required
            value={resolutionHours}
            onChange={(e) => onChangeResolution(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          />
          <span className="absolute right-3 top-2 text-xs text-foreground-muted font-medium">
            hours
          </span>
        </div>
      </div>
    </div>
  );
};
