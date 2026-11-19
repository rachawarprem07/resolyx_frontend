import React, { useState } from 'react';
import { X, Edit, Trash2, Plus, Folder, AlertTriangle } from 'lucide-react';
import type { KbCategory, KnowledgeArticle } from '../../types/kb.types';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  categories: KbCategory[];
  articles: KnowledgeArticle[];
  onClose: () => void;
  onEditCategory: (category: KbCategory) => void;
  onDeleteCategory: (id: string) => void;
  onAddNewCategory: () => void;
}

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen,
  categories,
  articles,
  onClose,
  onEditCategory,
  onDeleteCategory,
  onAddNewCategory,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div>
            <h3 className="text-base font-bold text-foreground">Manage Knowledge Base Categories</h3>
            <p className="text-xs text-foreground-muted">
              Organize topics, edit names & colors, or remove unused categories.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {categories.length === 0 ? (
            <div className="py-8 text-center rounded-xl bg-surface-subtle border border-border border-dashed space-y-2">
              <Folder className="h-8 w-8 text-foreground-muted mx-auto opacity-50" />
              <p className="text-xs font-semibold text-foreground">No categories created yet</p>
              <p className="text-[11px] text-foreground-muted">
                Create your first category to start organizing knowledge base articles.
              </p>
            </div>
          ) : (
            categories.map((cat) => {
              const articleCount = articles.filter(
                (a) => a.category.toLowerCase() === cat.name.toLowerCase(),
              ).length;
              const isConfirming = confirmDeleteId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border hover:border-brand-indigo/30 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#6366f1' }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{cat.name}</p>
                      {cat.description && (
                        <p className="text-[11px] text-foreground-muted truncate max-w-xs">
                          {cat.description}
                        </p>
                      )}
                      <span className="text-[10px] text-brand-indigo font-semibold">
                        {articleCount} {articleCount === 1 ? 'article linked' : 'articles linked'}
                      </span>
                    </div>
                  </div>

                  {isConfirming ? (
                    <div className="flex items-center gap-1.5 shrink-0 animate-in fade-in">
                      <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Delete?
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteCategory(cat.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-0.5 rounded bg-surface border border-border text-[11px] text-foreground"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditCategory(cat);
                        }}
                        className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-foreground-muted hover:text-foreground transition-colors"
                        title="Edit category"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(cat.id)}
                        className="p-1.5 rounded-lg border border-border bg-surface hover:bg-rose-500/10 text-foreground-muted hover:text-rose-600 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNewCategory();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Category</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface-subtle"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
