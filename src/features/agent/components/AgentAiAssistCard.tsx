import React from 'react';
import { Sparkles, Copy, BookOpen } from 'lucide-react';
import type { AiSuggestedResolution } from '../types/agent.types';

interface AgentAiAssistCardProps {
  suggestion: AiSuggestedResolution;
  onApplyDraft: () => void;
}

export const AgentAiAssistCard: React.FC<AgentAiAssistCardProps> = ({
  suggestion,
  onApplyDraft,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-brand-violet/5 border border-brand-violet/30 shadow-subtle space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-violet" />
          <h2 className="text-xs font-bold text-brand-violet uppercase tracking-wider">
            AI Copilot Draft Resolution ({suggestion.confidenceScore}% Confidence)
          </h2>
        </div>
        <button
          type="button"
          onClick={onApplyDraft}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-violet text-white text-xs font-semibold hover:bg-brand-violet-hover shadow-sm transition-all self-start sm:self-auto"
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Apply AI Draft into Reply</span>
        </button>
      </div>

      <p className="text-xs text-foreground-muted">
        <span className="font-semibold text-foreground">Root Cause:</span> {suggestion.summary}
      </p>

      <div className="p-3.5 rounded-xl bg-surface border border-brand-violet/20 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
        {suggestion.draftReply}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
        <BookOpen className="h-3 w-3 text-brand-violet" />
        <span>
          Knowledge Base Reference:{' '}
          <strong className="text-foreground">{suggestion.knowledgeBaseSource}</strong>
        </span>
      </div>
    </div>
  );
};

