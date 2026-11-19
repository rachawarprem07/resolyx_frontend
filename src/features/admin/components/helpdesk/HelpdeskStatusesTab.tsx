import React, { useState } from 'react';
import { Edit3, Check } from 'lucide-react';
import type { TicketStatusItem } from '../../types/admin.types';

interface HelpdeskStatusesTabProps {
  statuses: TicketStatusItem[];
  onUpdateStatus: (updated: TicketStatusItem) => void;
}

export const HelpdeskStatusesTab: React.FC<HelpdeskStatusesTabProps> = ({ statuses, onUpdateStatus }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSave = (st: TicketStatusItem) => {
    if (!name.trim()) return;
    onUpdateStatus({ ...st, name: name.trim(), description: desc.trim() || st.description });
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      {statuses.map((st) => (
        <div key={st.id} className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {editingId === st.id ? (
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs font-semibold focus:ring-2 focus:ring-brand-indigo"
              />
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              />
              <button
                type="button"
                onClick={() => handleSave(st)}
                className="p-1.5 rounded-lg bg-brand-indigo text-white text-xs font-bold flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${st.isClosed ? 'bg-emerald-500' : 'bg-brand-indigo'}`} />
              <div>
                <h4 className="text-xs font-bold text-foreground">{st.name}</h4>
                <p className="text-xs text-foreground-muted">{st.description}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-surface-subtle border border-border text-foreground-muted">
              {st.isClosed ? 'Terminal State' : 'In Progress'}
            </span>
            <button
              type="button"
              onClick={() => {
                setEditingId(st.id);
                setName(st.name);
                setDesc(st.description);
              }}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
              title="Edit Status"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

