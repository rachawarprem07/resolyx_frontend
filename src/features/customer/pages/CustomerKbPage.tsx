import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Headphones,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  X,
  Ticket,
  HelpCircle,
  Tag,
  Users,
} from 'lucide-react';
import { getStoredKbArticles, getStoredKbCategories, subscribeToKbChanges } from '@/lib/kbStorage';
import type { KnowledgeArticle } from '@/features/agent/types/agent.types';
import type { KbCategory } from '@/features/admin/types/kb.types';

export const CustomerKbPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<KnowledgeArticle[]>(() => getStoredKbArticles());
  const [categories, setCategories] = useState<KbCategory[]>(() => getStoredKbCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'helpful' | 'not-helpful'>>({});

  useEffect(() => {
    // Universal real-time subscription across tabs, storage events, and windows
    const unsubscribe = subscribeToKbChanges(() => {
      setArticles(getStoredKbArticles());
      setCategories(getStoredKbCategories());
    });
    return unsubscribe;
  }, []);

  // Filter articles based on category and search query
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Role visibility: the user requested: "the knowledge base aricles can be seen all the role types."
      // All articles are visible to customer portal
      const isVisibleToCustomer =
        !article.visibility ||
        article.visibility === 'all' ||
        article.visibility === 'customer' ||
        (Array.isArray(article.targetRoles) && article.targetRoles.includes('customer')) ||
        article.visibility !== 'internal';

      if (!isVisibleToCustomer) return false;

      const artCategory = (article.category || 'General').trim().toLowerCase();
      const selCategory = selectedCategory.trim().toLowerCase();
      const matchesCategory =
        selCategory === 'all' || artCategory === selCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = (article.title || '').toLowerCase().includes(q);
      const inSummary = (article.summary || '').toLowerCase().includes(q);
      const inCategory = artCategory.includes(q);
      const inContent = (article.solutionMarkdown || '').toLowerCase().includes(q);
      const inTags = Array.isArray(article.tags)
        ? article.tags.some((t) => (t || '').toLowerCase().includes(q))
        : false;

      return inTitle || inSummary || inCategory || inContent || inTags;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleFeedback = (articleId: string, type: 'helpful' | 'not-helpful') => {
    setFeedbackGiven((prev) => ({ ...prev, [articleId]: type }));
  };

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* 1. Hero Help Center Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-indigo/15 via-brand-violet/10 to-transparent border border-border p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo text-xs font-semibold mb-3 border border-brand-indigo/20">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Customer Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How can we help you today?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-foreground-muted">
            Search our verified runbooks, configuration guides, and troubleshooting documentation for instant solutions.
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, error codes, tutorials, or keywords..."
              className="w-full h-13 pl-12 pr-10 rounded-2xl border border-border bg-surface text-sm sm:text-base text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-foreground-muted hover:text-foreground"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wide uppercase text-foreground-muted flex items-center gap-2">
            <span>Browse By Category</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-subtle border border-border">
              {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
            </span>
          </h2>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs text-brand-indigo hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
              selectedCategory === 'All'
                ? 'bg-brand-indigo text-white shadow-sm shadow-brand-indigo/25'
                : 'bg-surface border border-border text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
            }`}
          >
            All Articles ({articles.length})
          </button>

          {categories.map((cat) => {
            const catName = (cat.name || '').trim();
            const count = articles.filter(
              (a) => (a.category || 'General').trim().toLowerCase() === catName.toLowerCase(),
            ).length;
            const isSelected = selectedCategory.trim().toLowerCase() === catName.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(catName)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-brand-indigo text-white shadow-sm shadow-brand-indigo/25'
                    : 'bg-surface border border-border text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
                }`}
              >
                {catName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface p-10 sm:p-14 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center mx-auto">
            <HelpCircle className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {searchQuery
                ? `No articles found matching "${searchQuery}"`
                : 'No knowledge base articles published yet'}
            </h3>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1.5">
              {searchQuery
                ? 'Try refining your search terms or browse all categories.'
                : 'Our support team is constantly updating troubleshooting runbooks. You can submit a support ticket to get immediate human assistance.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-surface-subtle border border-border text-xs sm:text-sm font-semibold hover:bg-surface transition-colors"
              >
                Clear Search
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/customer/tickets')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs sm:text-sm font-semibold hover:bg-brand-indigo-hover shadow-sm transition-all"
            >
              <Ticket className="h-4 w-4" />
              <span>Go to My Tickets</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredArticles.map((article) => {
            const hasAudio = article.attachments?.some((att) => att.type === 'audio');
            const hasVideo = article.attachments?.some((att) => att.type === 'video');
            const hasDocs = article.attachments?.some(
              (att) => att.type === 'doc' || att.type === 'file'
            );

            return (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 sm:p-6 hover:border-brand-indigo/50 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
                        title="Available to all role types: Admins, Support Agents, and Customers"
                      >
                        <Users className="h-3 w-3" />
                        <span>All Roles</span>
                      </span>
                      {hasAudio && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <Headphones className="h-3 w-3" />
                          Audio
                        </span>
                      )}
                      {hasVideo && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                          <Video className="h-3 w-3" />
                          Video
                        </span>
                      )}
                      {hasDocs && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                          <FileText className="h-3 w-3" />
                          Doc
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-brand-indigo transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-foreground-muted line-clamp-3 leading-relaxed">
                    {article.summary ||
                      article.solutionMarkdown?.slice(0, 150) ||
                      'View step-by-step guidance and resolution steps.'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-foreground-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(article.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle text-[11px] text-foreground-muted"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-brand-indigo group-hover:translate-x-0.5 transition-transform">
                    <span>Read</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Helpdesk CTA footer */}
      <div className="rounded-2xl border border-border bg-surface-subtle p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-foreground">Can't find what you are looking for?</h4>
          <p className="text-xs text-foreground-muted">
            Submit a direct ticket to our dedicated technical support engineers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/customer/tickets')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo text-white text-xs sm:text-sm font-semibold hover:bg-brand-indigo-hover shadow-sm transition-all"
        >
          <Ticket className="h-4 w-4" />
          <span>Create Support Ticket</span>
        </button>
      </div>

      {/* 5. Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden text-foreground">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4 bg-surface/50">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                    {activeArticle.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <Users className="h-3 w-3" />
                    <span>Visible to All Roles</span>
                  </span>
                  {activeArticle.updatedAt && (
                    <span className="text-xs text-foreground-muted">
                      Updated {activeArticle.updatedAt}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {activeArticle.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm sm:text-base leading-relaxed">
              {/* Summary Callout */}
              {activeArticle.summary && (
                <div className="p-4 rounded-2xl bg-brand-indigo/5 border border-brand-indigo/15 text-sm text-foreground">
                  <span className="font-bold text-brand-indigo block mb-1">Summary</span>
                  {activeArticle.summary}
                </div>
              )}

              {/* Multimedia Attachments (e.g. Audio Guides / Podcast Walkthroughs) */}
              {activeArticle.attachments && activeArticle.attachments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold tracking-wide uppercase text-foreground-muted flex items-center gap-1.5">
                    <Headphones className="h-3.5 w-3.5 text-brand-indigo" />
                    <span>Media & Runbook Walkthroughs</span>
                  </h4>
                  <div className="space-y-2">
                    {activeArticle.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3.5 rounded-2xl bg-surface-subtle border border-border space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground flex items-center gap-2">
                            {att.type === 'audio' && <Headphones className="h-4 w-4 text-emerald-500" />}
                            {att.type === 'video' && <Video className="h-4 w-4 text-rose-500" />}
                            {att.type === 'doc' && <FileText className="h-4 w-4 text-brand-indigo" />}
                            {att.name}
                          </span>
                          {att.url && (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-indigo hover:underline inline-flex items-center gap-1 text-[11px]"
                            >
                              <span>Open URL</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {att.type === 'audio' && att.url && (
                          <audio controls className="w-full h-8 pt-1" src={att.url}>
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solution / Instructions Content */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-wide uppercase text-foreground-muted">
                  Resolution Guide
                </h4>
                <div className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap text-sm leading-relaxed bg-surface-subtle p-5 rounded-2xl border border-border font-mono text-xs sm:text-sm">
                  {activeArticle.solutionMarkdown || 'No detailed steps provided.'}
                </div>
              </div>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <span className="text-xs font-semibold text-foreground-muted">Tags:</span>
                  {activeArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-surface-subtle text-xs text-foreground-muted font-medium border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer: Was this helpful? + Ticket link */}
            <div className="p-5 sm:p-6 border-t border-border bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-foreground-muted">
                  Was this article helpful?
                </span>
                {feedbackGiven[activeArticle.id] ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Thank you for your feedback!
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleFeedback(activeArticle.id, 'helpful')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20 text-xs font-semibold transition-all"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Yes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeedback(activeArticle.id, 'not-helpful')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/20 text-xs font-semibold transition-all"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      <span>No</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveArticle(null);
                  navigate('/customer/tickets');
                }}
                className="text-xs font-bold text-brand-indigo hover:underline inline-flex items-center gap-1"
              >
                <span>Still need help? Submit a ticket</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
