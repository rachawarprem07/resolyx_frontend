import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  BookOpen,
} from 'lucide-react';
import {
  getStoredKbArticles,
  saveStoredKbArticles,
  getStoredKbCategories,
  saveStoredKbCategories,
  deleteStoredKbCategory,
  subscribeToKbChanges,
} from '@/lib/kbStorage';
import type { KnowledgeArticle, KbCategory } from '../types/kb.types';
import { KbGridView } from '../components/kb/KbGridView';
import { KbListView } from '../components/kb/KbListView';
import { AddCategoryModal } from '../components/kb/AddCategoryModal';
import { ManageCategoriesModal } from '../components/kb/ManageCategoriesModal';
import { CreateEditArticleModal } from '../components/kb/CreateEditArticleModal';
import { ArticleViewModal } from '../components/kb/ArticleViewModal';

export const AdminKbPage: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(getStoredKbArticles);
  const [categories, setCategories] = useState<KbCategory[]>(getStoredKbCategories);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [editingCategory, setEditingCategory] = useState<KbCategory | null>(null);
  const [viewingArticle, setViewingArticle] = useState<KnowledgeArticle | null>(null);

  // Sync with storage events across tabs or components
  useEffect(() => {
    const unsubscribe = subscribeToKbChanges(() => {
      setCategories(getStoredKbCategories());
      setArticles(getStoredKbArticles());
    });
    return unsubscribe;
  }, []);

  // Filtered articles based on search & category
  const filteredArticles = useMemo(() => {
    const q = search.toLowerCase().trim();
    return articles.filter((a) => {
      const artCat = (a.category || 'General').trim().toLowerCase();
      const selCat = selectedCategory.trim().toLowerCase();
      const matchCat = selCat === 'all' || artCat === selCat;

      const matchSearch =
        !q ||
        (a.title || '').toLowerCase().includes(q) ||
        (a.summary || '').toLowerCase().includes(q) ||
        (a.id || '').toLowerCase().includes(q) ||
        (a.solutionMarkdown || '').toLowerCase().includes(q) ||
        (Array.isArray(a.tags) && a.tags.some((t) => (t || '').toLowerCase().includes(q))) ||
        (a.author && a.author.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, search]);

  // Article handlers
  const handleSaveArticle = (saved: KnowledgeArticle) => {
    const exists = articles.some((a) => a.id === saved.id);
    const updated = exists ? articles.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...articles];
    setArticles(updated);
    saveStoredKbArticles(updated);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    saveStoredKbArticles(updated);
    if (viewingArticle?.id === id) setViewingArticle(null);
  };

  // Category handlers
  const handleSaveCategory = (cat: KbCategory) => {
    const exists = categories.some((c) => c.id === cat.id);
    const updated = exists ? categories.map((c) => (c.id === cat.id ? cat : c)) : [...categories, cat];
    setCategories(updated);
    saveStoredKbCategories(updated);
    setSelectedCategory(cat.name);
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (catId: string) => {
    deleteStoredKbCategory(catId);
    const updatedCats = getStoredKbCategories();
    setCategories(updatedCats);
    setArticles(getStoredKbArticles());
    setSelectedCategory('All');
  };

  const isFilterActive = search.trim() !== '' || selectedCategory !== 'All';

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Header (Clean, Minimal, Single Row on Desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BookOpen className="h-7 w-7 text-brand-indigo" />
            Knowledge Base
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
            Create categories, link articles, attach audio/video/docs, and filter operational runbooks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {categories.length > 0 && (
            <button
              type="button"
              onClick={() => setIsManageCategoriesOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-foreground shadow-subtle transition-colors"
              title="Manage existing categories"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-foreground-muted" />
              <span>Categories ({categories.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setEditingArticle(null);
              setIsArticleModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* 2. Search & View Mode Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, description, steps, or tags..."
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo shadow-subtle transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-foreground-muted hover:text-foreground"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          {isFilterActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-brand-indigo hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              <span>Clear filters</span>
            </button>
          )}

          <div className="flex items-center p-1 rounded-xl bg-surface border border-border shadow-subtle shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-brand-indigo text-white shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-brand-indigo text-white shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Pills Bar (Minimal, Even Spacing, Symmetrical) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {/* 'All' Filter Pill */}
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

        {/* Dynamic Category Pills */}
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

        {/* Inline Add Category Pill */}
        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setIsCategoryModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-border hover:border-brand-indigo/60 text-xs font-semibold text-foreground-muted hover:text-brand-indigo bg-transparent hover:bg-brand-indigo/5 transition-all whitespace-nowrap"
          title="Create a new category"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* 4. Articles View (Grid or List with Intelligent Empty States) */}
      {viewMode === 'grid' ? (
        <KbGridView
          articles={filteredArticles}
          totalArticlesCount={articles.length}
          searchQuery={search}
          selectedCategory={selectedCategory}
          onClearFilters={clearFilters}
          onView={(art) => setViewingArticle(art)}
          onEdit={(art) => {
            setEditingArticle(art);
            setIsArticleModalOpen(true);
          }}
          onDelete={handleDeleteArticle}
          onCreateNew={() => {
            setEditingArticle(null);
            setIsArticleModalOpen(true);
          }}
        />
      ) : (
        <KbListView
          articles={filteredArticles}
          totalArticlesCount={articles.length}
          searchQuery={search}
          selectedCategory={selectedCategory}
          onClearFilters={clearFilters}
          onView={(art) => setViewingArticle(art)}
          onEdit={(art) => {
            setEditingArticle(art);
            setIsArticleModalOpen(true);
          }}
          onDelete={handleDeleteArticle}
          onCreateNew={() => {
            setEditingArticle(null);
            setIsArticleModalOpen(true);
          }}
        />
      )}

      {/* 5. Modals */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        initialCategory={editingCategory}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
      />

      <ManageCategoriesModal
        isOpen={isManageCategoriesOpen}
        categories={categories}
        articles={articles}
        onClose={() => setIsManageCategoriesOpen(false)}
        onEditCategory={(cat) => {
          setEditingCategory(cat);
          setIsCategoryModalOpen(true);
        }}
        onDeleteCategory={handleDeleteCategory}
        onAddNewCategory={() => {
          setEditingCategory(null);
          setIsCategoryModalOpen(true);
        }}
      />

      <CreateEditArticleModal
        isOpen={isArticleModalOpen}
        initialArticle={editingArticle}
        onClose={() => {
          setIsArticleModalOpen(false);
          setEditingArticle(null);
        }}
        onSave={handleSaveArticle}
      />

      {viewingArticle && (
        <ArticleViewModal
          article={viewingArticle}
          isOpen={Boolean(viewingArticle)}
          onClose={() => setViewingArticle(null)}
          onEdit={(art) => {
            setEditingArticle(art);
            setIsArticleModalOpen(true);
          }}
        />
      )}
    </div>
  );
};
