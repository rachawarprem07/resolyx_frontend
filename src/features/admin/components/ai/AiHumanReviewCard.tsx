import React from 'react';
import { UserCheck } from 'lucide-react';
import type { AdminAiConfig } from '../../types/admin.types';

interface AiHumanReviewCardProps {
  config: AdminAiConfig;
  onUpdate: (updates: Partial<AdminAiConfig>) => void;
}

export const AiHumanReviewCard: React.FC<AiHumanReviewCardProps> = ({ config, onUpdate }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <UserCheck className="h-4 w-4 text-brand-indigo" />
        <h2 className="text-sm font-bold text-foreground">Human Review Preferences</h2>
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <h3 className="text-xs font-bold text-foreground">Require Agent Review Before Sending</h3>
          <p className="text-xs text-foreground-muted">
            Always present AI drafts to human agents before replying to tickets.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={config.requireHumanReview}
          onClick={() => onUpdate({ requireHumanReview: !config.requireHumanReview })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            config.requireHumanReview ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              config.requireHumanReview ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-2 border-t border-border">
        <div>
          <h3 className="text-xs font-bold text-foreground">
            Auto-resolve High-Confidence Inquiries
          </h3>
          <p className="text-xs text-foreground-muted">
            Automatically close straightforward FAQs and billing queries.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={config.autoResolveAboveThreshold}
          onClick={() => onUpdate({ autoResolveAboveThreshold: !config.autoResolveAboveThreshold })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            config.autoResolveAboveThreshold ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              config.autoResolveAboveThreshold ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
