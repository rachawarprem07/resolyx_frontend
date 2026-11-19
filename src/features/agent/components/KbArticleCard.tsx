import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ThumbsUp,
  Trash2,
  Sparkles,
  User,
  Clock,
  Edit3,
  Headphones,
  Video,
  Image as ImageIcon,
  FileText,
  Download,
  BookOpen,
  Users,
} from 'lucide-react';
import type { KnowledgeArticle } from '../types/agent.types';
import { ArticleContentRenderer } from '@/features/admin/components/kb/ArticleContentRenderer';

interface KbArticleCardProps {
  article: KnowledgeArticle;
  onView?: (article: KnowledgeArticle) => void;
  onEdit?: (article: KnowledgeArticle) => void;
  onDelete?: (id: string) => void;
  onHelpful?: (id: string) => void;
  onSelectForResolution?: (text: string) => void;
}

export const KbArticleCard: React.FC<KbArticleCardProps> = ({
  article,
  onView,
  onEdit,
  onDelete,
  onHelpful,
  onSelectForResolution,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isHelpfulActive, setIsHelpfulActive] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(article.helpfulCount || 0);

  const audioAttachments = article.attachments?.filter((a) => a.type === 'audio') || [];
  const videoAttachments = article.attachments?.filter((a) => a.type === 'video') || [];
  const imageAttachments = article.attachments?.filter((a) => a.type === 'image') || [];
  const fileAttachments =
    article.attachments?.filter(
      (a) => a.type === 'doc' || a.type === 'archive' || a.type === 'file' || !a.type,
    ) || [];

  const totalAttachments = article.attachments?.length || 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(article.solutionMarkdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleHelpful = () => {
    if (!isHelpfulActive) {
      setIsHelpfulActive(true);
      setHelpfulCount((prev) => prev + 1);
      onHelpful?.(article.id);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-brand-indigo/30 shadow-subtle transition-all space-y-3.5">
      {/* 1. Header Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-2 py-0.5 rounded-md">
            {article.id}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-subtle border border-border text-foreground">
            {article.category}
          </span>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            title="Available to all role types: Admins, Support Agents, and Customers"
          >
            <Users className="h-3 w-3" />
            <span>{article.visibility === 'internal' ? 'Internal Only' : 'All Roles'}</span>
          </span>
          {article.isAiIndexed && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-violet/10 text-brand-violet border border-brand-violet/20">
              <Sparkles className="h-3 w-3" />
              <span>AI Indexed</span>
            </span>
          )}
          {totalAttachments > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-subtle border border-border text-foreground-muted">
              {audioAttachments.length > 0 && <Headphones className="h-3 w-3 text-violet-500" />}
              {videoAttachments.length > 0 && <Video className="h-3 w-3 text-rose-500" />}
              {imageAttachments.length > 0 && <ImageIcon className="h-3 w-3 text-blue-500" />}
              {fileAttachments.length > 0 && <FileText className="h-3 w-3 text-amber-500" />}
              <span>{totalAttachments} media</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-foreground-muted">
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" /> {article.author}
            </span>
          )}
          {article.updatedAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.updatedAt}
            </span>
          )}
        </div>
      </div>

      {/* 2. Title & Introductory Lede */}
      <div>
        <h3
          onClick={() => (onView ? onView(article) : setIsExpanded((prev) => !prev))}
          className="text-base sm:text-lg font-bold text-foreground hover:text-brand-indigo cursor-pointer transition-colors leading-snug"
        >
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-xs sm:text-sm text-foreground-muted mt-1.5 leading-relaxed font-normal">
            {article.summary}
          </p>
        )}
      </div>

      {/* 3. Expandable Article Body (Rendered with Article Typography) */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-border/60 animate-in fade-in duration-150">
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-subtle/40 border border-border">
            <ArticleContentRenderer content={article.solutionMarkdown} />
          </div>

          {/* Audio Attachments */}
          {audioAttachments.length > 0 && (
            <div className="space-y-2 p-3.5 rounded-xl bg-violet-500/[0.04] border border-violet-500/20">
              <span className="text-xs font-bold text-violet-700 dark:text-violet-300 flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5" /> Audio Guide(s)
              </span>
              {audioAttachments.map((att) => (
                <div key={att.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="truncate">{att.name}</span>
                    {att.size && <span className="text-[10px] text-foreground-muted">{att.size}</span>}
                  </div>
                  <audio controls src={att.url} className="w-full h-8" preload="metadata" />
                </div>
              ))}
            </div>
          )}

          {/* Video Attachments */}
          {videoAttachments.length > 0 && (
            <div className="space-y-2 p-3.5 rounded-xl bg-rose-500/[0.04] border border-rose-500/20">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" /> Video Demonstration(s)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {videoAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="rounded-lg overflow-hidden border border-border bg-black aspect-video flex items-center justify-center"
                  >
                    <video controls src={att.url} className="w-full h-full object-contain" preload="metadata" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image & File Attachments */}
          {(imageAttachments.length > 0 || fileAttachments.length > 0) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {imageAttachments.map((att) => (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-subtle border border-border text-xs text-brand-indigo font-semibold hover:underline"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                  <span className="truncate max-w-[150px]">{att.name}</span>
                </a>
              ))}
              {fileAttachments.map((att) => (
                <a
                  key={att.id}
                  href={att.url}
                  download={att.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-subtle border border-border text-xs text-brand-indigo font-semibold hover:underline"
                >
                  <Download className="h-3.5 w-3.5 text-amber-500" />
                  <span className="truncate max-w-[150px]">{att.name}</span>
                  {att.size && <span className="text-[10px] text-foreground-muted">({att.size})</span>}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Tags & Footer Actions */}
      <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md bg-surface-subtle text-[10px] text-foreground-muted font-medium border border-border"
            >
              #{t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Read Full Article Button */}
          {onView && (
            <button
              type="button"
              onClick={() => onView(article)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-brand-indigo/10 hover:text-brand-indigo text-xs font-semibold text-foreground transition-all"
            >
              <BookOpen className="h-3 w-3" />
              <span>Read Article</span>
            </button>
          )}

          {/* Helpful Button */}
          <button
            type="button"
            onClick={handleToggleHelpful}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isHelpfulActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'border-border bg-surface hover:bg-surface-subtle text-foreground-muted hover:text-foreground'
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Helpful ({helpfulCount})</span>
          </button>

          {/* Copy Solution */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-brand-indigo/10 text-xs font-semibold text-foreground transition-all"
          >
            {isCopied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-foreground-muted" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Insert for Ticket */}
          {onSelectForResolution && (
            <button
              type="button"
              onClick={() => onSelectForResolution(article.solutionMarkdown)}
              className="px-2.5 py-1 rounded-lg bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              Insert
            </button>
          )}

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded-lg border border-border hover:bg-surface-subtle text-foreground-muted hover:text-foreground"
            title={isExpanded ? 'Collapse' : 'Expand guide inline'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Edit Action */}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(article)}
              className="p-1 rounded-lg border border-transparent hover:border-brand-indigo/20 text-foreground-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
              title="Edit Article"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Delete Action */}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(article.id)}
              className="p-1 rounded-lg border border-transparent hover:border-rose-500/20 text-foreground-muted hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Article"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
