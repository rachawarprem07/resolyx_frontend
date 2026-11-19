import React, { useState, useEffect } from 'react';
import { X, Check, Plus, FolderPlus, AlertCircle } from 'lucide-react';
import type { KnowledgeArticle, KbAttachment, KbCategory } from '../../types/kb.types';
import { getStoredKbCategories, addStoredKbCategory } from '@/lib/kbStorage';
import { getCurrentUser } from '@/lib/authSession';
import { KbAttachmentsManager } from './KbAttachmentsManager';
import { AddCategoryModal } from './AddCategoryModal';

interface CreateEditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: KnowledgeArticle) => void;
  initialArticle?: KnowledgeArticle | null;
}

export const CreateEditArticleModal: React.FC<CreateEditArticleModalProps> = ({
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
  const [attachments, setAttachments] = useState<KbAttachment[]>([]);
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
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
        setAttachments(initialArticle.attachments || []);
      } else {
        setTitle('');
        setCategory(freshCats[0]?.name || 'General');
        setSummary('');
        setSolutionMarkdown('');
        setTagsInput('');
        setVisibility('all');
        setAttachments([]);
      }
    }
  }, [isOpen, initialArticle]);

  if (!isOpen) return null;

  const handleInlineSaveCategory = (newCat: KbCategory) => {
    addStoredKbCategory(newCat);
    const updated = getStoredKbCategories();
    setCategories(updated);
    setCategory(newCat.name);
    setCategoryError('');
    setIsAddCatOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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

    if (tags.length === 0) {
      tags.push(finalCategory.split(' ')[0] || 'Guide');
    }

    onSave({
      id: initialArticle?.id || `KB-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      category: finalCategory,
      summary: summary.trim() || title.trim(),
      solutionMarkdown: solutionMarkdown.trim() || summary.trim(),
      tags,
      author: initialArticle?.author || getCurrentUser().name || 'System Administrator',
      updatedAt: 'Just now',
      viewsCount: initialArticle?.viewsCount || 1,
      helpfulCount: initialArticle?.helpfulCount || 0,
      isAiIndexed: true,
      attachments,
      visibility,
      targetRoles:
        visibility === 'all'
          ? ['admin', 'agent', 'customer']
          : visibility === 'internal'
          ? ['admin', 'agent']
          : ['customer', 'admin'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-border shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              {initialArticle ? `Edit Article • ${initialArticle.id}` : 'Create Knowledge Base Article'}
            </h3>
            <p className="text-xs text-foreground-muted">
              Publish runbooks, audio/video guides, and documentation linked to a category.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Mandatory Warning if no categories exist */}
        {categories.length === 0 && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>A category is <strong>mandatory</strong> to publish articles. You don't have any categories created yet.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddCatOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs shrink-0 self-start sm:self-auto hover:bg-amber-700 transition-colors"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Create Category First</span>
            </button>
          </div>
        )}

        {categoryError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{categoryError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Linked Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Setting up VPN Client Certificates"
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-foreground">
                  Linked Category <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(true)}
                  className="text-[10px] font-semibold text-brand-indigo hover:underline flex items-center gap-0.5"
                >
                  <Plus className="h-2.5 w-2.5" /> New
                </button>
              </div>
              {categories.length > 0 ? (
                <select
                  required
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCategoryError('');
                  }}
                  className={`w-full px-3 py-2 rounded-xl border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo ${
                    categoryError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-border'
                  }`}
                >
                  <option value="" disabled>-- Select Category (Required) --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(true)}
                  className="w-full px-3 py-2 rounded-xl border border-dashed border-rose-400 bg-rose-500/5 text-rose-600 text-xs font-semibold hover:bg-rose-500/10 flex items-center justify-center gap-1.5"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  <span>+ Add Required Category</span>
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tags <span className="text-[11px] font-normal text-foreground-muted">(Comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. VPN, Security, Certificate, Guide"
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          {/* Role Access & Visibility */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Role Access & Target Audience
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
            <p className="text-[11px] text-foreground-muted mt-1">
              {visibility === 'all'
                ? '✓ Available to all role types: Super Admins, Admins, Support Agents, and Customers.'
                : visibility === 'internal'
                ? '🔒 Restrict this runbook to internal support staff and administrators.'
                : '👥 Published directly for external customers and clients.'}
            </p>
          </div>

          {/* Short Summary */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Short Description / Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="1-2 sentences summarizing this article or issue..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          {/* Solution / Steps */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Detailed Content / Resolution Steps
            </label>
            <textarea
              rows={4}
              value={solutionMarkdown}
              onChange={(e) => setSolutionMarkdown(e.target.value)}
              placeholder="Step-by-step instructions, CLI commands, or troubleshooting procedures..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs font-mono focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          {/* Multi-format Attachments Manager (Audio, Video, Images, Docs, Files) */}
          <KbAttachmentsManager attachments={attachments} onChange={setAttachments} />

          {/* Footer */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={categories.length === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                categories.length === 0
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-indigo text-white hover:opacity-90'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>{initialArticle ? 'Save Changes' : 'Save Article'}</span>
            </button>
          </div>
        </form>

        <AddCategoryModal
          isOpen={isAddCatOpen}
          onClose={() => setIsAddCatOpen(false)}
          onSave={handleInlineSaveCategory}
        />
      </div>
    </div>
  );
};
