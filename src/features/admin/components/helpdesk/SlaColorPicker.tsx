import React from 'react';
import { Check } from 'lucide-react';

const COLOR_OPTIONS = [
  { id: 'rose', value: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40', bg: 'bg-rose-500' },
  { id: 'amber', value: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40', bg: 'bg-amber-500' },
  { id: 'blue', value: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40', bg: 'bg-blue-500' },
  {
    id: 'emerald',
    value: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
    bg: 'bg-emerald-500',
  },
  {
    id: 'violet',
    value: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40',
    bg: 'bg-purple-500',
  },
  { id: 'slate', value: 'text-slate-500 bg-slate-100 dark:bg-slate-800', bg: 'bg-slate-400' },
];

interface SlaColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const SlaColorPicker: React.FC<SlaColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1.5">
        Tier Accent Color
      </label>
      <div className="flex items-center gap-2">
        {COLOR_OPTIONS.map((c) => (
          <button
            type="button"
            key={c.id}
            onClick={() => onSelectColor(c.value)}
            className={`h-6 w-6 rounded-full ${c.bg} transition-all flex items-center justify-center ${
              selectedColor === c.value
                ? 'ring-2 ring-brand-indigo ring-offset-2 scale-110'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            {selectedColor === c.value && <Check className="h-3 w-3 text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
};
