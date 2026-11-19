import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Check, X } from 'lucide-react';
import type { TicketCategory } from '../../types/admin.types';

type CategoryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

interface HelpdeskCategoriesTabProps {
  categories: TicketCategory[];
  onAddCategory: (newCategory: TicketCategory) => void;
  onUpdateCategory?: (updatedCategory: TicketCategory) => void;
  onDeleteCategory?: (id: string) => void;
}

export const HelpdeskCategoriesTab: React.FC<HelpdeskCategoriesTabProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [defaultPriority, setDefaultPriority] = useState<CategoryPriority>('Medium');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setDefaultPriority('Medium');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: TicketCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setDefaultPriority(cat.defaultPriority);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory && onUpdateCategory) {
      onUpdateCategory({ ...editingCategory, name: catName.trim(), description: catDesc.trim() || 'General inquiry topic', defaultPriority });
    } else {
      onAddCategory({ id: `cat-${Date.now()}`, name: catName.trim(), description: catDesc.trim() || 'General inquiry topic', defaultPriority, ticketCount: 0 });
    }
    handleCloseForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-foreground-muted">
          Standard categories available across all incoming helpdesk tickets.
        </p>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo-hover text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-surface border border-brand-indigo/30 space-y-3 shadow-subtle animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground">{editingCategory ? 'Edit Category' : 'New Category'}</h4>
            <button type="button" onClick={handleCloseForm} className="text-foreground-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Category Name"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
            <input
              type="text"
              placeholder="Short Description"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
            <select
              value={defaultPriority}
              onChange={(e) => setDefaultPriority(e.target.value as CategoryPriority)}
              className="px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={handleCloseForm} className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground-muted hover:bg-surface-subtle">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-indigo text-white flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4 rounded-2xl bg-surface border border-border hover:border-brand-indigo/30 transition-all shadow-subtle flex items-start justify-between">
            <div className="flex-1 pr-3">
              <h3 className="text-xs font-bold text-foreground">{cat.name}</h3>
              <p className="mt-1 text-xs text-foreground-muted">{cat.description}</p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-subtle border border-border text-foreground">
                  Default: {cat.defaultPriority}
                </span>
                <span className="text-[10px] text-foreground-muted">
                  {cat.ticketCount.toLocaleString()} lifetime tickets
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
                title="Edit Category"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              {onDeleteCategory && (
                <button
                  type="button"
                  onClick={() => onDeleteCategory(cat.id)}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
