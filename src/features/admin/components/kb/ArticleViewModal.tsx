import React, { useState } from 'react';
import {
  X,
  Edit,
  Image as ImageIcon,
  FileText,
  Video,
  Headphones,
  Archive,
  File,
  Download,
  Copy,
  Check,
  Printer,
  ThumbsUp,
  Clock,
  Share2,
  Calendar,
  Sparkles,
  ChevronRight,
  Bookmark,
  Users,
} from 'lucide-react';
import type { KnowledgeArticle } from '../../types/kb.types';
import { ArticleContentRenderer } from './ArticleContentRenderer';

interface ArticleViewModalProps {
  article: KnowledgeArticle;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (article: KnowledgeArticle) => void;
}

function isEmbeddableVideoUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = url.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/,
  );
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }
  return null;
}

// Estimate reading time in minutes
function calculateReadTime(text: string): string {
  const words = (text || '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  article,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(article.helpfulCount || 0);
  const [isHelpfulActive, setIsHelpfulActive] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySolution = () => {
    navigator.clipboard.writeText(article.solutionMarkdown || article.summary);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const handleHelpfulClick = () => {
    if (!isHelpfulActive) {
      setIsHelpfulActive(true);
      setHelpfulCount((prev) => prev + 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const audioAttachments = article.attachments?.filter((a) => a.type === 'audio') || [];
  const videoAttachments = article.attachments?.filter((a) => a.type === 'video') || [];
  const imageAttachments = article.attachments?.filter((a) => a.type === 'image') || [];
  const fileAttachments =
    article.attachments?.filter(
      (a) => a.type === 'doc' || a.type === 'archive' || a.type === 'file' || !a.type,
    ) || [];

  const readTime = calculateReadTime(
    `${article.title} ${article.summary} ${article.solutionMarkdown}`,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />

      {/* Main Document / Article Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* 1. Article Navigation Bar / Top Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-surface/95 backdrop-blur-sm shrink-0">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-foreground-muted min-w-0" aria-label="Breadcrumb">
            <span className="font-semibold text-foreground hover:text-brand-indigo cursor-pointer transition-colors">
              Knowledge Base
            </span>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-semibold text-brand-indigo truncate">
              {article.category}
            </span>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-mono text-[11px] text-foreground-muted shrink-0">
              {article.id}
            </span>
          </nav>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-foreground transition-all"
              title="Copy link to article"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5 text-foreground-muted" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopySolution}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-foreground transition-all"
              title="Copy solution text"
            >
              {copiedSolution ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-foreground-muted" />}
              <span className="hidden sm:inline">{copiedSolution ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg border border-border hover:bg-surface-subtle text-foreground-muted hover:text-foreground transition-colors hidden md:inline-flex"
              title="Print article"
            >
              <Printer className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(article);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
              title="Close article"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* 2. Article Body (Scrollable Document Canvas) */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 md:px-12 py-6 sm:py-8 space-y-6">
          <article className="max-w-3xl mx-auto space-y-6">
            {/* Masthead / Header Info */}
            <div className="space-y-3 border-b border-border/60 pb-6">
              {/* Category pill and tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                  <Bookmark className="h-3 w-3" />
                  <span>{article.category}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Users className="h-3 w-3" />
                  <span>
                    {article.visibility === 'internal'
                      ? 'Internal Only (Admin & Agent)'
                      : article.visibility === 'customer'
                      ? 'Customer Facing'
                      : 'All Role Types (Admin, Agent, Customer)'}
                  </span>
                </span>

                {article.isAiIndexed && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Verified Runbook</span>
                  </span>
                )}

                {article.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md bg-surface-subtle border border-border text-xs text-foreground-muted font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Main Article Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {article.title}
              </h1>

              {/* Author & Publication Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-foreground-muted pt-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-brand-indigo/20 text-brand-indigo font-bold flex items-center justify-center text-[10px]">
                    {((article.author || 'A')[0] || 'A').toUpperCase()}
                  </div>
                  <span className="font-semibold text-foreground">
                    {article.author || 'System Administrator'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Updated {article.updatedAt || 'Recently'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{readTime}</span>
                </div>
              </div>
            </div>

            {/* Executive Summary / Lede Paragraph */}
            {article.summary && (
              <div className="relative pl-4 sm:pl-5 py-2 border-l-4 border-brand-indigo bg-brand-indigo/[0.03] rounded-r-2xl">
                <p className="text-base sm:text-lg text-foreground/90 font-medium leading-relaxed italic">
                  {article.summary}
                </p>
              </div>
            )}

            {/* Main Article Content (Rendered with Article Typography & Blocks) */}
            <div className="article-prose pt-2">
              <ArticleContentRenderer content={article.solutionMarkdown} />
            </div>

            {/* 3. Multimedia & Audio Section */}
            {audioAttachments.length > 0 && (
              <section className="my-8 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Audio Guide & Podcast Walkthrough
                  </h3>
                </div>

                <div className="space-y-3">
                  {audioAttachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-4 rounded-2xl bg-violet-500/[0.04] border border-violet-500/20 space-y-3 shadow-subtle"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">{att.name}</p>
                          <p className="text-[11px] text-foreground-muted">
                            Audio walkthrough and spoken operational instructions
                          </p>
                        </div>
                        {att.size && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-foreground-muted self-start sm:self-auto">
                            {att.size}
                          </span>
                        )}
                      </div>

                      <audio controls src={att.url} className="w-full h-10" preload="metadata">
                        Your browser does not support audio playback.
                      </audio>

                      {att.url && att.url !== '#' && (
                        <div className="flex justify-end pt-1">
                          <a
                            href={att.url}
                            download={att.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" /> Download Audio
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Multimedia & Video Section */}
            {videoAttachments.length > 0 && (
              <section className="my-8 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                    <Video className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Video Demonstration & Screen Recording
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {videoAttachments.map((att) => {
                    const embedUrl = isEmbeddableVideoUrl(att.url);

                    return (
                      <div
                        key={att.id}
                        className="p-4 rounded-2xl bg-surface-subtle/50 border border-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-foreground">{att.name}</p>
                          {att.size && (
                            <span className="text-xs text-foreground-muted">{att.size}</span>
                          )}
                        </div>

                        <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-md">
                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              title={att.name}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : att.url && att.url !== '#' ? (
                            <video controls src={att.url} className="w-full h-full object-contain" preload="metadata">
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div className="p-4 text-center text-xs text-white/70">No video stream available</div>
                          )}
                        </div>

                        {att.url && att.url !== '#' && !embedUrl && (
                          <div className="flex justify-end">
                            <a
                              href={att.url}
                              download={att.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-indigo hover:underline"
                            >
                              <Download className="h-3.5 w-3.5" /> Download Video
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 5. Diagram & Image Gallery */}
            {imageAttachments.length > 0 && (
              <section className="my-8 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Diagrams & Architecture Visuals
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {imageAttachments.map((att) => (
                    <figure
                      key={att.id}
                      className="p-3 rounded-2xl bg-surface-subtle/50 border border-border space-y-2 group"
                    >
                      {att.url && att.url !== '#' && (
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl overflow-hidden border border-border bg-black/5 hover:opacity-95 transition-opacity max-h-60"
                        >
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </a>
                      )}
                      <figcaption className="flex items-center justify-between text-xs text-foreground-muted px-1">
                        <span className="font-semibold text-foreground truncate">{att.name}</span>
                        {att.size && <span>{att.size}</span>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Document & Resource Attachments */}
            {fileAttachments.length > 0 && (
              <section className="my-8 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Reference Files & Downloads
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fileAttachments.map((att) => {
                    const isArchive = att.type === 'archive';
                    const IconComponent = isArchive ? Archive : att.type === 'doc' ? FileText : File;
                    const iconColor = isArchive ? 'text-emerald-500' : att.type === 'doc' ? 'text-amber-500' : 'text-slate-500';

                    return (
                      <div
                        key={att.id}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-subtle border border-border hover:border-brand-indigo/30 transition-all shadow-subtle"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-surface border border-border shrink-0">
                            <IconComponent className={`h-5 w-5 ${iconColor}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs sm:text-sm text-foreground truncate" title={att.name}>
                              {att.name}
                            </p>
                            <p className="text-[11px] text-foreground-muted capitalize">
                              {att.type || 'File'} {att.size ? `• ${att.size}` : ''}
                            </p>
                          </div>
                        </div>

                        {att.url && att.url !== '#' && (
                          <a
                            href={att.url}
                            download={att.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity shrink-0"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 7. Article Feedback & Rating Footer */}
            <div className="my-10 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-subtle/40 border border-border">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground">Was this article helpful?</h4>
                <p className="text-xs text-foreground-muted">
                  Help us improve this engineering runbook for our support team.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleHelpfulClick}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isHelpfulActive
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 scale-105'
                      : 'border-border bg-surface hover:bg-surface-subtle text-foreground hover:border-brand-indigo/30'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{isHelpfulActive ? 'Helpful!' : 'Yes, Helpful'} ({helpfulCount})</span>
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* 8. Reader Footer */}
        <footer className="px-6 py-3 border-t border-border bg-surface shrink-0 flex items-center justify-between text-xs text-foreground-muted">
          <span>Article ID: <code className="font-mono text-brand-indigo font-bold">{article.id}</code></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-border text-foreground font-semibold hover:bg-surface-subtle"
          >
            Close Reader
          </button>
        </footer>
      </div>
    </div>
  );
};
