import React, { useState } from 'react';
import { X, Search, BookOpen, ArrowDownToLine, Sparkles } from 'lucide-react';
import { getStoredKbArticles } from '@/lib/kbStorage';
import type { KnowledgeArticle } from '../types/agent.types';

interface KbInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSolution: (solutionText: string) => void;
}

export const KbInsertModal: React.FC<KbInsertModalProps> = ({
  isOpen,
  onClose,
  onInsertSolution,
}) => {
  const [articles] = useState<KnowledgeArticle[]>(getStoredKbArticles);
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = articles.filter((a) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface border border-border shadow-elevated p-5 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-indigo/10 text-brand-indigo">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Insert Knowledge Base Solution</h3>
              <p className="text-xs text-foreground-muted">Select an approved standard runbook to insert into your reply</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative my-3 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search KB solutions by symptom, code error, or tag..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          />
        </div>

        {/* List of KB articles */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-foreground-muted text-center py-8">
              No knowledge base articles match your search.
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-border bg-surface-subtle/50 hover:border-brand-indigo/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-brand-indigo bg-brand-indigo/10 px-1.5 py-0.5 rounded">
                      {item.id}
                    </span>
                    <span className="text-[11px] font-semibold text-foreground-muted">
                      {item.category}
                    </span>
                    {item.isAiIndexed && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-violet/10 text-brand-violet">
                        <Sparkles className="h-2.5 w-2.5" />
                        AI Verified
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onInsertSolution(item.solutionMarkdown);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                    <span>Insert</span>
                  </button>
                </div>

                <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                <p className="text-[11px] text-foreground-muted line-clamp-2">{item.summary}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

