import type { KnowledgeArticle } from '@/features/agent/types/agent.types';
import type { KbCategory } from '@/features/admin/types/kb.types';
import { API_BASE_URL } from '@/lib/apiClient';

const KB_STORAGE_KEY = 'resolyx-knowledge-base-v6';
const KB_CATEGORIES_KEY = 'resolyx-kb-categories-v6';

// Historical keys to auto-migrate so user never loses articles or categories
const LEGACY_ARTICLE_KEYS = [
  'resolyx-knowledge-base-v6',
  'resolyx-knowledge-base-v5',
  'resolyx-knowledge-base-v4',
  'resolyx-knowledge-base',
  'resolyx_kb_articles',
  'kb_articles',
  'resolyx-articles',
];

const LEGACY_CATEGORY_KEYS = [
  'resolyx-kb-categories-v6',
  'resolyx-kb-categories-v5',
  'resolyx-kb-categories-v4',
  'resolyx-kb-categories-v3',
  'resolyx-kb-categories',
  'resolyx_kb_categories',
  'kb_categories',
];

export const INITIAL_KB_CATEGORIES: KbCategory[] = [
  {
    id: 'cat-general',
    name: 'General',
    description: 'General support and troubleshooting guides',
    color: '#6366f1',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_KB_ARTICLES: KnowledgeArticle[] = [];

// Shared BroadcastChannel for instant cross-tab and cross-window sync
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('resolyx-kb-broadcast-channel');
  } catch {
    // ignore
  }
}

function sanitizeArticle(raw: unknown): KnowledgeArticle | null {
  if (!raw || typeof raw !== 'object') return null;
  const a = raw as Partial<KnowledgeArticle>;
  if (!a.id && !a.title) return null;

  const id = typeof a.id === 'string' && a.id.trim() ? a.id.trim() : `KB-${Math.floor(100 + Math.random() * 900)}`;
  const title = typeof a.title === 'string' && a.title.trim() ? a.title.trim() : 'Untitled Article';
  const category = typeof a.category === 'string' && a.category.trim() ? a.category.trim() : 'General';
  const summary = typeof a.summary === 'string' ? a.summary : title;
  const solutionMarkdown = typeof a.solutionMarkdown === 'string' ? a.solutionMarkdown : summary;
  const tags = Array.isArray(a.tags)
    ? a.tags.filter((t): t is string => typeof t === 'string' && Boolean(t.trim()))
    : ['General'];

  return {
    id,
    title,
    category,
    summary,
    solutionMarkdown,
    tags: tags.length > 0 ? tags : ['General'],
    author: typeof a.author === 'string' ? a.author : 'Support Team',
    updatedAt: typeof a.updatedAt === 'string' ? a.updatedAt : 'Recently updated',
    viewsCount: typeof a.viewsCount === 'number' ? a.viewsCount : 1,
    helpfulCount: typeof a.helpfulCount === 'number' ? a.helpfulCount : 0,
    isAiIndexed: a.isAiIndexed !== false,
    attachments: Array.isArray(a.attachments) ? a.attachments : [],
    // Universal role visibility: all articles visible to all roles
    visibility: (a.visibility === 'internal' || a.visibility === 'customer' || a.visibility === 'all') ? a.visibility : 'all',
    targetRoles: Array.isArray(a.targetRoles) && a.targetRoles.length > 0
      ? a.targetRoles
      : ['admin', 'agent', 'customer'],
  };
}

function sanitizeCategory(raw: unknown): KbCategory | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Partial<KbCategory>;
  if (!c.name || typeof c.name !== 'string' || !c.name.trim()) return null;

  return {
    id: typeof c.id === 'string' && c.id.trim() ? c.id.trim() : `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: c.name.trim(),
    description: typeof c.description === 'string' ? c.description.trim() : '',
    color: typeof c.color === 'string' && c.color.trim() ? c.color.trim() : '#6366f1',
    createdAt: typeof c.createdAt === 'string' ? c.createdAt : new Date().toISOString(),
  };
}

// In-memory cache for rapid synchronous reads
let inMemoryArticles: KnowledgeArticle[] | null = null;
let inMemoryCategories: KbCategory[] | null = null;

export function getStoredKbCategories(): KbCategory[] {
  if (typeof window === 'undefined') return INITIAL_KB_CATEGORIES;

  if (inMemoryCategories && inMemoryCategories.length > 0) {
    return inMemoryCategories;
  }

  const categoryMap = new Map<string, KbCategory>();

  // Check all legacy category keys
  for (const key of LEGACY_CATEGORY_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const sanitized = sanitizeCategory(item);
            if (sanitized && !categoryMap.has(sanitized.name.toLowerCase())) {
              categoryMap.set(sanitized.name.toLowerCase(), sanitized);
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Ensure default "General" category exists
  if (!categoryMap.has('general')) {
    categoryMap.set('general', {
      id: 'cat-general',
      name: 'General',
      description: 'General support and troubleshooting guides',
      color: '#6366f1',
      createdAt: new Date().toISOString(),
    });
  }

  const result = Array.from(categoryMap.values());
  inMemoryCategories = result;

  // Persist consolidated list to active key
  try {
    localStorage.setItem(KB_CATEGORIES_KEY, JSON.stringify(result));
  } catch {
    // ignore
  }

  // Background fetch from backend if available
  syncCategoriesWithBackend();

  return result;
}

export function saveStoredKbCategories(cats: KbCategory[]): void {
  inMemoryCategories = cats;
  try {
    localStorage.setItem(KB_CATEGORIES_KEY, JSON.stringify(cats));
    window.dispatchEvent(new CustomEvent('resolyx-kb-categories-changed', { detail: cats }));
    broadcastChannel?.postMessage({ type: 'categories_changed', payload: cats });
  } catch {
    // ignore
  }

  // Async persist to backend
  if (typeof window !== 'undefined') {
    fetch(`${API_BASE_URL}/kb/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cats),
    }).catch(() => {
      // ignore backend offline
    });
  }
}

export function addStoredKbCategory(cat: Omit<KbCategory, 'id'> & { id?: string }): KbCategory {
  const current = getStoredKbCategories();
  const existing = current.find((c) => c.name.toLowerCase() === cat.name.trim().toLowerCase());
  if (existing) return existing;

  const newCat: KbCategory = {
    id: cat.id || `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: cat.name.trim(),
    description: cat.description?.trim() || '',
    color: cat.color || '#6366f1',
    createdAt: new Date().toISOString(),
  };
  const updated = [...current, newCat];
  saveStoredKbCategories(updated);
  return newCat;
}

export function updateStoredKbCategory(cat: KbCategory): void {
  const current = getStoredKbCategories();
  const updated = current.map((c) => (c.id === cat.id ? cat : c));
  saveStoredKbCategories(updated);
}

export function deleteStoredKbCategory(id: string): void {
  const current = getStoredKbCategories();
  const catToDelete = current.find((c) => c.id === id);
  const updated = current.filter((c) => c.id !== id);
  saveStoredKbCategories(updated);

  // If articles are linked to this category, update them to 'General'
  if (catToDelete) {
    const articles = getStoredKbArticles();
    let hasChanges = false;
    const updatedArticles = articles.map((a) => {
      if ((a.category || '').toLowerCase() === catToDelete.name.toLowerCase()) {
        hasChanges = true;
        return { ...a, category: 'General' };
      }
      return a;
    });
    if (hasChanges) {
      saveStoredKbArticles(updatedArticles);
    }
  }
}

export function getStoredKbArticles(): KnowledgeArticle[] {
  if (typeof window === 'undefined') return INITIAL_KB_ARTICLES;

  if (inMemoryArticles) {
    return inMemoryArticles;
  }

  const articleMap = new Map<string, KnowledgeArticle>();

  // Check all legacy article keys to recover any existing user articles
  for (const key of LEGACY_ARTICLE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const sanitized = sanitizeArticle(item);
            if (sanitized && !articleMap.has(sanitized.id)) {
              articleMap.set(sanitized.id, sanitized);
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  const result = Array.from(articleMap.values());
  inMemoryArticles = result;

  // Persist consolidated list to active key
  try {
    localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // ignore
  }

  // Ensure any categories used in articles are registered in categories list
  if (result.length > 0) {
    const cats = getStoredKbCategories();
    const existingCatNames = new Set(cats.map((c) => c.name.toLowerCase()));
    let catsAdded = false;
    const updatedCats = [...cats];

    for (const art of result) {
      const catName = (art.category || 'General').trim();
      if (!existingCatNames.has(catName.toLowerCase())) {
        existingCatNames.add(catName.toLowerCase());
        updatedCats.push({
          id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: catName,
          description: `${catName} runbooks and guides`,
          color: '#6366f1',
          createdAt: new Date().toISOString(),
        });
        catsAdded = true;
      }
    }

    if (catsAdded) {
      saveStoredKbCategories(updatedCats);
    }
  }

  // Background fetch from backend if available
  syncArticlesWithBackend();

  return result;
}

export function saveStoredKbArticles(articles: KnowledgeArticle[]): void {
  // Sanitize all before saving
  const cleanArticles = articles.map((a) => sanitizeArticle(a)!).filter(Boolean);
  inMemoryArticles = cleanArticles;

  try {
    localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(cleanArticles));
    window.dispatchEvent(new CustomEvent('resolyx-kb-articles-changed', { detail: cleanArticles }));
    broadcastChannel?.postMessage({ type: 'articles_changed', payload: cleanArticles });
  } catch {
    // ignore
  }

  // Async persist to backend
  if (typeof window !== 'undefined') {
    fetch(`${API_BASE_URL}/kb/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanArticles),
    }).catch(() => {
      // ignore backend offline
    });
  }
}

export function addStoredKbArticle(article: KnowledgeArticle): void {
  const current = getStoredKbArticles();
  const sanitized = sanitizeArticle(article);
  if (!sanitized) return;

  const updated = [sanitized, ...current.filter((a) => a.id !== sanitized.id)];
  saveStoredKbArticles(updated);
}

export function deleteStoredKbArticle(id: string): void {
  const current = getStoredKbArticles();
  const updated = current.filter((a) => a.id !== id);
  saveStoredKbArticles(updated);
}

// Background sync helpers with backend API
let isSyncingArticles = false;
function syncArticlesWithBackend(): void {
  if (isSyncingArticles || typeof window === 'undefined') return;
  isSyncingArticles = true;

  fetch(`${API_BASE_URL}/kb/articles`)
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('Not available');
    })
    .then((backendArticles: unknown[]) => {
      if (!Array.isArray(backendArticles)) return;
      const current = inMemoryArticles || [];
      const currentMap = new Map(current.map((a) => [a.id, a]));
      let hasNew = false;

      for (const item of backendArticles) {
        const sanitized = sanitizeArticle(item);
        if (sanitized && !currentMap.has(sanitized.id)) {
          currentMap.set(sanitized.id, sanitized);
          hasNew = true;
        }
      }

      if (hasNew) {
        const merged = Array.from(currentMap.values());
        inMemoryArticles = merged;
        localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('resolyx-kb-articles-changed', { detail: merged }));
      } else if (current.length > backendArticles.length) {
        // Push local articles to backend if backend had fewer
        fetch(`${API_BASE_URL}/kb/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current),
        }).catch(() => {});
      }
    })
    .catch(() => {
      // Backend not running or endpoint unreachable; localStorage remains source of truth
    })
    .finally(() => {
      isSyncingArticles = false;
    });
}

let isSyncingCategories = false;
function syncCategoriesWithBackend(): void {
  if (isSyncingCategories || typeof window === 'undefined') return;
  isSyncingCategories = true;

  fetch(`${API_BASE_URL}/kb/categories`)
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('Not available');
    })
    .then((backendCats: unknown[]) => {
      if (!Array.isArray(backendCats)) return;
      const current = inMemoryCategories || [];
      const currentMap = new Map(current.map((c) => [c.name.toLowerCase(), c]));
      let hasNew = false;

      for (const item of backendCats) {
        const sanitized = sanitizeCategory(item);
        if (sanitized && !currentMap.has(sanitized.name.toLowerCase())) {
          currentMap.set(sanitized.name.toLowerCase(), sanitized);
          hasNew = true;
        }
      }

      if (hasNew) {
        const merged = Array.from(currentMap.values());
        inMemoryCategories = merged;
        localStorage.setItem(KB_CATEGORIES_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('resolyx-kb-categories-changed', { detail: merged }));
      } else if (current.length > backendCats.length) {
        fetch(`${API_BASE_URL}/kb/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current),
        }).catch(() => {});
      }
    })
    .catch(() => {
      // Backend not running; localStorage remains source of truth
    })
    .finally(() => {
      isSyncingCategories = false;
    });
}

/**
 * Universal subscription helper for React components.
 * Listens to:
 * 1. window CustomEvents (same window/tab)
 * 2. window 'storage' events (cross-tab native localStorage)
 * 3. BroadcastChannel events (modern cross-tab message exchange)
 */
export function subscribeToKbChanges(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomArt = () => {
    inMemoryArticles = null;
    callback();
  };
  const handleCustomCat = () => {
    inMemoryCategories = null;
    callback();
  };
  const handleStorage = (e: StorageEvent) => {
    if (
      !e.key ||
      e.key.includes('resolyx-knowledge-base') ||
      e.key.includes('resolyx-kb-categories')
    ) {
      inMemoryArticles = null;
      inMemoryCategories = null;
      callback();
    }
  };

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data?.type === 'articles_changed' || e.data?.type === 'categories_changed') {
      inMemoryArticles = null;
      inMemoryCategories = null;
      callback();
    }
  };

  window.addEventListener('resolyx-kb-articles-changed', handleCustomArt);
  window.addEventListener('resolyx-kb-categories-changed', handleCustomCat);
  window.addEventListener('storage', handleStorage);
  broadcastChannel?.addEventListener('message', handleBroadcast);

  return () => {
    window.removeEventListener('resolyx-kb-articles-changed', handleCustomArt);
    window.removeEventListener('resolyx-kb-categories-changed', handleCustomCat);
    window.removeEventListener('storage', handleStorage);
    broadcastChannel?.removeEventListener('message', handleBroadcast);
  };
}
