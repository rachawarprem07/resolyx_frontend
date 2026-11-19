import React from 'react';
import {
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  FileText,
  Video,
  Headphones,
  Plus,
  BookOpen,
  Search,
  X,
  Users,
} from 'lucide-react';
import type { KnowledgeArticle } from '../../types/kb.types';

interface KbGridViewProps {
  articles: KnowledgeArticle[];
  totalArticlesCount?: number;
  searchQuery?: string;
  selectedCategory?: string;
  onClearFilters?: () => void;
  onView: (article: KnowledgeArticle) => void;
  onEdit: (article: KnowledgeArticle) => void;
  onDelete: (id: string) => void;
  onCreateNew?: () => void;
}

export const KbGridView: React.FC<KbGridViewProps> = ({
  articles,
  totalArticlesCount = 0,
  searchQuery = '',
  selectedCategory = 'All',
  onClearFilters,
  onView,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  // Case 1: Knowledge Base is completely empty (no articles in the entire KB)
  if (articles.length === 0 && totalArticlesCount === 0) {
    return (
      <div className="py-14 px-4 text-center rounded-2xl bg-surface border border-border border-dashed space-y-3.5">
        <div className="p-3 rounded-2xl bg-brand-indigo/10 text-brand-indigo w-fit mx-auto">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">Your Knowledge Base is Empty</h3>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            Publish standard operating procedures, troubleshooting runbooks, and multimedia guides to help your team resolve issues faster.
          </p>
        </div>
        {onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Article</span>
          </button>
        )}
      </div>
    );
  }

  // Case 2: Articles exist, but none match current search or category filter
  if (articles.length === 0) {
    return (
      <div className="py-12 px-4 text-center rounded-2xl bg-surface border border-border border-dashed space-y-3">
        <div className="p-2.5 rounded-2xl bg-surface-subtle text-foreground-muted w-fit mx-auto">
          <Search className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">No articles match your search or filter</p>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            {searchQuery ? `No results matching "${searchQuery}"` : 'No articles found in this category'}
            {selectedCategory && selectedCategory !== 'All' ? ` under "${selectedCategory}"` : ''}.
          </p>
        </div>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear Search & Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => {
        const audioCount = article.attachments?.filter((a) => a.type === 'audio').length || 0;
        const videoCount = article.attachments?.filter((a) => a.type === 'video').length || 0;
        const imageCount = article.attachments?.filter((a) => a.type === 'image').length || 0;
        const fileCount =
          article.attachments?.filter(
            (a) => a.type === 'doc' || a.type === 'archive' || a.type === 'file' || !a.type,
          ).length || 0;

        return (
          <div
            key={article.id}
            className="p-5 rounded-2xl bg-surface border border-border hover:border-brand-indigo/40 hover:shadow-subtle transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              {/* Category & ID badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 truncate">
                    {article.category}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0"
                    title="Available to all role types: Admins, Support Agents, and Customers"
                  >
                    <Users className="h-2.5 w-2.5" />
                    <span>{article.visibility === 'internal' ? 'Internal' : 'All Roles'}</span>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-foreground-muted shrink-0">
                  {article.id}
                </span>
              </div>

              {/* Title */}
              <h3
                onClick={() => onView(article)}
                className="text-sm font-bold text-foreground group-hover:text-brand-indigo cursor-pointer transition-colors line-clamp-2 leading-snug"
                title={article.title}
              >
                {article.title}
              </h3>

              {/* Short Description */}
              <p className="text-xs text-foreground-muted leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2.5">
              {/* Media Badges */}
              {(audioCount > 0 || videoCount > 0 || imageCount > 0 || fileCount > 0) && (
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-foreground-muted">
                  {audioCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-violet-500/10 text-violet-600 border border-violet-500/20 px-2 py-0.5 rounded-md" title={`${audioCount} Audio guides`}>
                      <Headphones className="h-3 w-3" /> {audioCount} Audio
                    </span>
                  )}
                  {videoCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2 py-0.5 rounded-md" title={`${videoCount} Video recordings`}>
                      <Video className="h-3 w-3" /> {videoCount} Video
                    </span>
                  )}
                  {imageCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 rounded-md" title={`${imageCount} Images`}>
                      <ImageIcon className="h-3 w-3" /> {imageCount} Img
                    </span>
                  )}
                  {fileCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-md" title={`${fileCount} Files/Docs`}>
                      <FileText className="h-3 w-3" /> {fileCount} Docs
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onView(article)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle hover:bg-brand-indigo/10 hover:text-brand-indigo text-xs font-semibold text-foreground border border-border transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(article)}
                    className="p-1.5 rounded-lg border border-border hover:bg-surface-subtle text-foreground-muted hover:text-foreground transition-colors"
                    title="Edit article"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(article.id)}
                    className="p-1.5 rounded-lg border border-border hover:bg-rose-500/10 text-foreground-muted hover:text-rose-600 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
