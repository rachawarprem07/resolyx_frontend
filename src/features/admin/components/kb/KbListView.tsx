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

interface KbListViewProps {
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

export const KbListView: React.FC<KbListViewProps> = ({
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
  // Case 1: Knowledge Base is completely empty
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
    <div className="rounded-2xl bg-surface border border-border shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/50 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              <th className="px-4 py-3">Article Title & ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Summary</th>
              <th className="px-4 py-3">Attachments & Media</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {articles.map((article) => {
              const audioCount = article.attachments?.filter((a) => a.type === 'audio').length || 0;
              const videoCount = article.attachments?.filter((a) => a.type === 'video').length || 0;
              const imageCount = article.attachments?.filter((a) => a.type === 'image').length || 0;
              const fileCount =
                article.attachments?.filter(
                  (a) => a.type === 'doc' || a.type === 'archive' || a.type === 'file' || !a.type,
                ).length || 0;

              return (
                <tr key={article.id} className="hover:bg-surface-subtle/40 transition-colors group">
                  {/* Name & ID */}
                  <td className="px-4 py-3 max-w-xs">
                    <p
                      onClick={() => onView(article)}
                      className="font-bold text-foreground hover:text-brand-indigo cursor-pointer transition-colors truncate"
                      title={article.title}
                    >
                      {article.title}
                    </p>
                    <span className="font-mono text-[10px] text-foreground-muted">{article.id}</span>
                  </td>

                  {/* Category & Role Visibility */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                        {article.category}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        title="Available to all role types: Admins, Support Agents, and Customers"
                      >
                        <Users className="h-2.5 w-2.5" />
                        <span>{article.visibility === 'internal' ? 'Internal' : 'All Roles'}</span>
                      </span>
                    </div>
                  </td>

                  {/* Short Description */}
                  <td className="px-4 py-3 max-w-sm">
                    <p
                      className="text-xs text-foreground-muted line-clamp-2 leading-relaxed"
                      title={article.summary}
                    >
                      {article.summary}
                    </p>
                  </td>

                  {/* Media attachments */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted">
                      {audioCount > 0 && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 border border-violet-500/20"
                          title={`${audioCount} Audio`}
                        >
                          <Headphones className="h-3 w-3" /> {audioCount}
                        </span>
                      )}
                      {videoCount > 0 && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          title={`${videoCount} Video`}
                        >
                          <Video className="h-3 w-3" /> {videoCount}
                        </span>
                      )}
                      {imageCount > 0 && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          title={`${imageCount} Images`}
                        >
                          <ImageIcon className="h-3 w-3" /> {imageCount}
                        </span>
                      )}
                      {fileCount > 0 && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          title={`${fileCount} Documents/Files`}
                        >
                          <FileText className="h-3 w-3" /> {fileCount}
                        </span>
                      )}
                      {audioCount === 0 && videoCount === 0 && imageCount === 0 && fileCount === 0 && (
                        <span className="text-foreground-muted/50">—</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(article)}
                        className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-foreground-muted hover:text-foreground transition-colors"
                        title="View article"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(article)}
                        className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-foreground-muted hover:text-foreground transition-colors"
                        title="Edit article"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(article.id)}
                        className="p-1.5 rounded-lg border border-border bg-surface hover:bg-rose-500/10 text-foreground-muted hover:text-rose-600 transition-colors"
                        title="Delete article"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
