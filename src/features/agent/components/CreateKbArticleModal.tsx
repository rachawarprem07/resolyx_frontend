import React, { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Check, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '@/lib/authSession';
import { getStoredKbCategories, addStoredKbCategory } from '@/lib/kbStorage';
import type { KnowledgeArticle, KbAttachment } from '../types/agent.types';
import type { KbCategory } from '@/features/admin/types/kb.types';
import { KbAttachmentsManager } from '@/features/admin/components/kb/KbAttachmentsManager';

interface CreateKbArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: KnowledgeArticle) => void;
  initialArticle?: KnowledgeArticle | null;
}

export const CreateKbArticleModal: React.FC<CreateKbArticleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialArticle,
}) => {
  const [categories, setCategories] = useState<KbCategory[]>(getStoredKbCategories);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [solutionMarkdown, setSolutionMarkdown] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'internal' | 'customer'>('all');
  const [isAiIndexed, setIsAiIndexed] = useState(true);
  const [attachments, setAttachments] = useState<KbAttachment[]>([]);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const freshCats = getStoredKbCategories();
      setCategories(freshCats);
      setCategoryError('');

      if (initialArticle) {
        setTitle(initialArticle.title);
        setCategory(initialArticle.category || freshCats[0]?.name || 'General');
        setSummary(initialArticle.summary);
        setSolutionMarkdown(initialArticle.solutionMarkdown);
        setTagsInput(initialArticle.tags?.join(', ') || '');
        setVisibility(initialArticle.visibility || 'all');
        setIsAiIndexed(initialArticle.isAiIndexed ?? true);
        setAttachments(initialArticle.attachments || []);
      } else {
        setTitle('');
        setCategory(freshCats[0]?.name || 'General');
        setSummary('');
        setSolutionMarkdown('');
        setTagsInput('');
        setVisibility('all');
        setIsAiIndexed(true);
        setAttachments([]);
      }
    }
  }, [initialArticle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !solutionMarkdown.trim()) return;

    // Graceful Category Resolution: default to General if none specified
    let finalCategory = category.trim();
    if (!finalCategory) {
      if (categories.length > 0 && categories[0]?.name) {
        finalCategory = categories[0].name;
      } else {
        finalCategory = 'General';
        addStoredKbCategory({ name: 'General', description: 'General Knowledge & Troubleshooting', color: '#6366f1' });
      }
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const articleData: KnowledgeArticle = {
      id: initialArticle ? initialArticle.id : `KB-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      category: finalCategory,
      summary: summary.trim() || title.trim(),
      solutionMarkdown: solutionMarkdown.trim(),
      tags: tags.length > 0 ? tags : ['Helpdesk', finalCategory.split(' ')[0] || 'Guide'],
      author: initialArticle
        ? initialArticle.author || getCurrentUser().name
        : getCurrentUser().name || 'Support Agent',
      updatedAt: 'Just now',
      viewsCount: initialArticle ? initialArticle.viewsCount || 1 : 1,
      helpfulCount: initialArticle ? initialArticle.helpfulCount || 0 : 0,
      isAiIndexed,
      attachments,
      visibility,
      targetRoles:
        visibility === 'all'
          ? ['admin', 'agent', 'customer']
          : visibility === 'internal'
          ? ['admin', 'agent']
          : ['customer', 'admin'],
    };

    onSave(articleData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface border border-border shadow-elevated p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-indigo/10 text-brand-indigo">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {initialArticle ? 'Edit Runbook Article' : 'Create Knowledge Base Article'}
              </h3>
              <p className="text-xs text-foreground-muted">
                {initialArticle
                  ? 'Update troubleshooting procedures & AI runbook'
                  : 'Publish verified troubleshooting steps with audio/video/docs'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {categories.length === 0 && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>A category is required to publish runbooks. Please ask an Admin to create a category first.</span>
          </div>
        )}

        {categoryError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{categoryError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Article Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Postgres Connection Pool Exhaustion Recovery"
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              {categories.length > 0 ? (
                <select
                  required
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCategoryError('');
                  }}
                  className={`w-full px-3 py-2 rounded-xl border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo ${
                    categoryError ? 'border-rose-500' : 'border-border'
                  }`}
                >
                  <option value="" disabled>-- Select Category (Required) --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2 rounded-xl bg-surface-subtle border border-dashed border-border text-xs text-foreground-muted">
                  No categories available
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Postgres, Pool, Database, Runbook"
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Role Access & Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'all' | 'internal' | 'customer')}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo font-medium"
            >
              <option value="all">All Role Types (Admin, Support Agent, Customer) — Visible to Everyone</option>
              <option value="internal">Internal Only (Admin & Support Agent) — Hidden from Customers</option>
              <option value="customer">Customer Facing Only (Customer & Admin)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Short Summary (Symptom description)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief one-sentence issue summary..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Solution (Markdown / CLI commands) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={solutionMarkdown}
              onChange={(e) => setSolutionMarkdown(e.target.value)}
              placeholder="Step-by-step verified engineering resolution..."
              className="w-full p-2.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs font-mono focus:ring-2 focus:ring-brand-indigo leading-relaxed"
            />
          </div>

          {/* Attachments Manager */}
          <KbAttachmentsManager attachments={attachments} onChange={setAttachments} />

          <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isAiIndexed}
              onChange={(e) => setIsAiIndexed(e.target.checked)}
              className="rounded border-border text-brand-indigo focus:ring-brand-indigo"
            />
            <span className="font-semibold">Index for Resolyx AI Copilot automatic drafting</span>
          </label>

          <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:bg-surface-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={categories.length === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                categories.length === 0
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-indigo hover:bg-brand-indigo-hover text-white'
              }`}
            >
              {initialArticle ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{initialArticle ? 'Save Changes' : 'Publish Runbook'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
