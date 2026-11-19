import React from 'react';

interface SlaCoveragePickerProps {
  coverage: '24x7' | 'business_hours';
  onChange: (val: '24x7' | 'business_hours') => void;
}

export const SlaCoveragePicker: React.FC<SlaCoveragePickerProps> = ({ coverage, onChange }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1.5">
        Operating Hours Coverage
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('business_hours')}
          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-left ${
            coverage === 'business_hours'
              ? 'border-brand-indigo bg-brand-indigo/10 text-brand-indigo'
              : 'border-border bg-surface-subtle text-foreground-muted'
          }`}
        >
          <p className="font-bold">Business Hours</p>
          <p className="text-[10px] opacity-75 font-normal">Mon-Fri 09:00-18:00</p>
        </button>
        <button
          type="button"
          onClick={() => onChange('24x7')}
          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-left ${
            coverage === '24x7'
              ? 'border-brand-indigo bg-brand-indigo/10 text-brand-indigo'
              : 'border-border bg-surface-subtle text-foreground-muted'
          }`}
        >
          <p className="font-bold">24/7 Continuous</p>
          <p className="text-[10px] opacity-75 font-normal">Round-the-clock timer</p>
        </button>
      </div>
    </div>
  );
};
