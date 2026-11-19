import React from 'react';
import { Sparkles } from 'lucide-react';
import { QUICK_PROMPTS } from '../data/customerData';

interface CustomerQuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

export const CustomerQuickPrompts: React.FC<CustomerQuickPromptsProps> = ({
  onSelectPrompt,
  disabled,
}) => {
  return (
    <div className="py-2 space-y-1.5 select-none">
      <span className="text-[11px] font-semibold text-foreground-muted flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-brand-violet" />
        Suggested Prompts & Common Issues:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="text-left px-3 py-1.5 rounded-xl border border-border bg-surface hover:border-brand-indigo/50 hover:bg-brand-indigo/5 text-xs text-foreground font-medium transition-all shadow-subtle disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

