import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, BookOpen, Layers, X } from 'lucide-react';
import {
  getStoredKbArticles,
  saveStoredKbArticles,
  getStoredKbCategories,
  subscribeToKbChanges,
} from '@/lib/kbStorage';
import { KbArticleCard } from '../components/KbArticleCard';
import { CreateKbArticleModal } from '../components/CreateKbArticleModal';
import { ArticleViewModal } from '@/features/admin/components/kb/ArticleViewModal';
import type { KnowledgeArticle } from '../types/agent.types';
import type { KbCategory } from '@/features/admin/types/kb.types';

export const AgentKbPage: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(getStoredKbArticles);
  const [categories, setCategories] = useState<KbCategory[]>(getStoredKbCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [viewingArticle, setViewingArticle] = useState<KnowledgeArticle | null>(null);

  useEffect(() => {
    // Universal real-time synchronization across tabs, storage, and windows
    const unsubscribe = subscribeToKbChanges(() => {
      setArticles(getStoredKbArticles());
      setCategories(getStoredKbCategories());
    });
    return unsubscribe;
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const artCategory = (a.category || 'General').trim().toLowerCase();
      const selCategory = selectedCategory.trim().toLowerCase();
      const matchesCategory = selCategory === 'all' || artCategory === selCategory;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        (a.title || '').toLowerCase().includes(query) ||
        (a.summary || '').toLowerCase().includes(query) ||
        (a.id || '').toLowerCase().includes(query) ||
        (a.solutionMarkdown || '').toLowerCase().includes(query) ||
        (Array.isArray(a.tags) && a.tags.some((t) => (t || '').toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

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

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* 1. Header with Publish Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BookOpen className="h-7 w-7 text-brand-indigo" />
            Knowledge Base
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
            Verified standard operating procedures, multimedia debugging runbooks, and AI-indexed solutions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingArticle(null);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New KB Article</span>
        </button>
      </div>

      {/* 2. Search & Category Filters (Minimal & Clean) */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search runbooks by title, root cause error, tag, or KB-ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo shadow-subtle transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-foreground-muted hover:text-foreground"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills (Minimal, Even Spacing, Symmetrical) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-brand-indigo text-white shadow-sm border border-brand-indigo'
                : 'bg-surface border border-border text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
            }`}
          >
            <span>All</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedCategory === 'All'
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-subtle text-foreground-muted'
              }`}
            >
              {articles.length}
            </span>
          </button>

          {categories.map((cat) => {
            const catName = (cat.name || '').trim();
            const isSelected = selectedCategory.trim().toLowerCase() === catName.toLowerCase();
            const count = articles.filter(
              (a) => (a.category || 'General').trim().toLowerCase() === catName.toLowerCase(),
            ).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(catName)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-indigo text-white shadow-sm border border-brand-indigo'
                    : 'bg-surface border border-border text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color || '#6366f1' }}
                />
                <span>{catName}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-subtle text-foreground-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-brand-indigo hover:underline flex items-center gap-1 pl-1"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Articles Feed */}
      <div className="space-y-3.5">
        {filteredArticles.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface border border-dashed border-border text-center space-y-2">
            <Layers className="h-8 w-8 text-foreground-muted mx-auto" />
            <h3 className="text-sm font-bold text-foreground">No Knowledge Articles Found</h3>
            <p className="text-xs text-foreground-muted max-w-sm mx-auto">
              No solutions matched &ldquo;{searchQuery || selectedCategory}&rdquo;. Create a new article or broaden your search criteria.
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <KbArticleCard
              key={article.id}
              article={article}
              onView={(a) => setViewingArticle(a)}
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

      {/* 4. Create / Edit Article Modal */}
      <CreateKbArticleModal
        isOpen={isCreateOpen}
        initialArticle={editingArticle}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingArticle(null);
        }}
        onSave={handleSave}
      />

      {/* 5. Reader Mode Modal */}
      {viewingArticle && (
        <ArticleViewModal
          article={viewingArticle}
          isOpen={Boolean(viewingArticle)}
          onClose={() => setViewingArticle(null)}
          onEdit={(a) => {
            setViewingArticle(null);
            setEditingArticle(a);
            setIsCreateOpen(true);
          }}
        />
      )}
    </div>
  );
};
