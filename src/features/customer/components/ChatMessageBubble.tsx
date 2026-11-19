import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/authSession';
import type { ChatMessage } from '../types/customer.types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onFeedback?: (id: string, type: 'helpful' | 'unhelpful') => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onFeedback,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'helpful' | 'unhelpful' | undefined>(
    message.feedback,
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFeedback = (type: 'helpful' | 'unhelpful') => {
    setFeedbackState(type);
    onFeedback?.(message.id, type);
  };

  const isCustomer = message.sender === 'customer';
  const isSystem = message.sender === 'system';
  const isAi = message.sender === 'ai';
  const isAgent = message.sender === 'agent';

  if (isSystem) {
    return (
      <div className="my-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs shadow-subtle space-y-2 animate-in fade-in">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Headphones className="h-4 w-4" />
          <span>Support Escalation Active</span>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-mono">
          {message.timestamp}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 my-3 animate-in fade-in ${isCustomer ? 'justify-end' : 'justify-start'}`}>
      {!isCustomer && (
        <div
          className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
            isAi ? 'bg-gradient-to-tr from-brand-indigo to-brand-violet text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 shadow-subtle ${
          isCustomer
            ? 'bg-brand-indigo text-white rounded-tr-none'
            : 'bg-surface border border-border text-foreground rounded-tl-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3 text-[11px] pb-1 border-b border-border/40">
          <div className="flex items-center gap-1.5 font-bold">
            {isAi && (
              <span className="flex items-center gap-1 text-brand-violet font-semibold">
                <Sparkles className="h-3 w-3" /> Resolyx AI Copilot
              </span>
            )}
            {isAgent && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-3 w-3" /> {message.agentName || 'Support Agent'}
              </span>
            )}
            {isCustomer && <span className="opacity-90">{getCurrentUser().name || 'You'} (You)</span>}
          </div>
          <span className={`text-[10px] ${isCustomer ? 'text-white/70' : 'text-foreground-muted'}`}>
            {message.timestamp}
          </span>
        </div>

        <div className={`text-xs whitespace-pre-wrap leading-relaxed ${isCustomer ? 'text-white' : 'text-foreground'}`}>
          {message.text}
        </div>

        {message.kbCitations && message.kbCitations.length > 0 && (
          <div className="pt-2 border-t border-border space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-brand-indigo" /> Verified Runbook Citations
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.kbCitations.map((cit) => (
                <div key={cit.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-subtle border border-border text-[11px] text-foreground font-medium">
                  <span className="font-mono font-bold text-brand-indigo">{cit.id}</span>
                  <span className="truncate max-w-[200px]">{cit.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isCustomer && (
          <div className="pt-1.5 border-t border-border flex items-center justify-between gap-2 text-[11px] text-foreground-muted">
            <div>
              {message.confidence && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {message.confidence}% Confidence
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={handleCopy} className="p-1 rounded hover:bg-surface-subtle" title="Copy">
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('helpful')}
                className={`p-1 rounded ${feedbackState === 'helpful' ? 'text-emerald-600 bg-emerald-500/10' : 'hover:bg-surface-subtle'}`}
                title="Helpful"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('unhelpful')}
                className={`p-1 rounded ${feedbackState === 'unhelpful' ? 'text-rose-600 bg-rose-500/10' : 'hover:bg-surface-subtle'}`}
                title="Not helpful"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isCustomer && (
        <div className="h-8 w-8 rounded-xl bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
          DC
        </div>
      )}
    </div>
  );
};
