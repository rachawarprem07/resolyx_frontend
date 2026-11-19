import React, { useState } from 'react';
import { Search, Plus, Sparkles, BookOpen } from 'lucide-react';
import { getStoredKbArticles, saveStoredKbArticles } from '@/lib/kbStorage';
import { KbArticleCard } from '@/features/agent/components/KbArticleCard';
import { CreateKbArticleModal } from '@/features/agent/components/CreateKbArticleModal';
import type { KnowledgeArticle } from '@/features/agent/types/agent.types';

export const HelpdeskKbTab: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(getStoredKbArticles);
  const [query, setQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);

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

  const handleSave = (article: KnowledgeArticle) => {
    const exists = articles.some((a) => a.id === article.id);
    const updated = exists ? articles.map((a) => (a.id === article.id ? article : a)) : [article, ...articles];
    setArticles(updated);
    saveStoredKbArticles(updated);
    setEditingArticle(null);
    setIsCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    saveStoredKbArticles(updated);
  };

  const handleHelpful = (id: string) => {
    const updated = articles.map((a) =>
      a.id === id ? { ...a, helpfulCount: (a.helpfulCount || 0) + 1 } : a,
    );
    setArticles(updated);
    saveStoredKbArticles(updated);
  };

  const aiIndexedCount = articles.filter((a) => a.isAiIndexed).length;

  return (
    <div className="space-y-4">
      {/* 1. Subheader & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand-indigo" />
            Central Knowledge Base & Runbooks
          </h2>
          <p className="text-xs text-foreground-muted mt-0.5">
            Manage approved troubleshooting runbooks and SOPs indexed for Agent & AI resolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-violet/10 border border-brand-violet/20 text-xs font-semibold text-brand-violet">
            <Sparkles className="h-3.5 w-3.5" />
            {aiIndexedCount} AI Indexed
          </span>
          <button
            type="button"
            onClick={() => {
              setEditingArticle(null);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Runbook</span>
          </button>
        </div>
      </div>

      {/* 2. Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter runbooks by keyword, error code, or category..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
        />
      </div>

      {/* 3. Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-surface border border-border">
            <p className="text-xs text-foreground-muted">No knowledge base runbooks found matching criteria.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <KbArticleCard
              key={item.id}
              article={item}
              onEdit={(a) => {
                setEditingArticle(a);
                setIsCreateOpen(true);
              }}
              onDelete={handleDelete}
              onHelpful={handleHelpful}
            />
          ))
        )}
      </div>

      {/* 4. Modal */}
      <CreateKbArticleModal
        isOpen={isCreateOpen}
        initialArticle={editingArticle}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingArticle(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

