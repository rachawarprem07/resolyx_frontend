import React, { useState } from 'react';
import { Tag, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_PRIORITIES, MOCK_STATUSES } from '../data/adminData';
import { HelpdeskCategoriesTab } from '../components/helpdesk/HelpdeskCategoriesTab';
import { HelpdeskSlaTab } from '../components/helpdesk/HelpdeskSlaTab';
import { HelpdeskKbTab } from '../components/helpdesk/HelpdeskKbTab';
import { HelpdeskStatusesTab } from '../components/helpdesk/HelpdeskStatusesTab';
import type { TicketCategory, PriorityLevel, TicketStatusItem } from '../types/admin.types';

export const HelpdeskPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'priorities' | 'statuses' | 'kb'>('kb');
  const [categories, setCategories] = useState<TicketCategory[]>(MOCK_CATEGORIES);
  const [priorities, setPriorities] = useState<PriorityLevel[]>(MOCK_PRIORITIES);
  const [statuses, setStatuses] = useState<TicketStatusItem[]>(MOCK_STATUSES);

  const handleAddCategory = (newCat: TicketCategory) => setCategories((prev) => [...prev, newCat]);
  const handleUpdateCategory = (up: TicketCategory) => setCategories((prev) => prev.map((c) => (c.id === up.id ? up : c)));
  const handleDeleteCategory = (id: string) => setCategories((prev) => prev.filter((c) => c.id !== id));

  const handleUpdatePriority = (saved: PriorityLevel) => {
    setPriorities((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
    });
  };

  const handleDeletePriority = (id: string) => setPriorities((prev) => prev.filter((p) => p.id !== id));
  const handleUpdateStatus = (up: TicketStatusItem) => setStatuses((prev) => prev.map((s) => (s.id === up.id ? up : s)));

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Helpdesk</h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
          Configure runbooks, knowledge base, ticket categories, and SLA response priorities.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('kb')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'kb' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-foreground-muted hover:text-foreground'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Knowledge Base</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'categories' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-foreground-muted hover:text-foreground'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Ticket Categories</span>
          <span className="px-1.5 py-0.5 rounded-full bg-surface-subtle text-[10px] text-foreground-muted">{categories.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('priorities')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'priorities' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-foreground-muted hover:text-foreground'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Priority Levels (SLA)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('statuses')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'statuses' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-foreground-muted hover:text-foreground'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Ticket Statuses</span>
        </button>
      </div>

      {activeTab === 'kb' && <HelpdeskKbTab />}
      {activeTab === 'categories' && (
        <HelpdeskCategoriesTab
          categories={categories}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
      {activeTab === 'priorities' && (
        <HelpdeskSlaTab priorities={priorities} onUpdatePriority={handleUpdatePriority} onDeletePriority={handleDeletePriority} />
      )}
      {activeTab === 'statuses' && (
        <HelpdeskStatusesTab statuses={statuses} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
};
