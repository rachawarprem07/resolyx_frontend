import React, { useState } from 'react';
import { Calendar, Plus, Clock, Trash2 } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
}

export const SettingsHolidaysTab: React.FC = () => {
  const [businessHours, setBusinessHours] = useState('09:00 - 18:00 (Mon - Fri)');
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: 'New Year Day', date: 'Jan 01, 2026' },
    { id: '2', name: 'Memorial Day', date: 'May 25, 2026' },
    { id: '3', name: 'Independence Day', date: 'Jul 04, 2026' },
    { id: '4', name: 'Thanksgiving Day', date: 'Nov 26, 2026' },
    { id: '5', name: 'Christmas Day', date: 'Dec 25, 2026' },
  ]);
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !newHolidayDate.trim()) return;
    setHolidays([...holidays, { id: `h-${Date.now()}`, name: newHolidayName.trim(), date: newHolidayDate.trim() }]);
    setNewHolidayName('');
    setNewHolidayDate('');
  };

  const handleDelete = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="pb-3 border-b border-border">
        <h2 className="text-base font-bold text-foreground">Business Hours & Official Holidays</h2>
        <p className="text-xs text-foreground-muted">SLA calculation timers automatically pause outside business hours and during holidays.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-border bg-surface-subtle/50 space-y-2">
          <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand-indigo" /> Standard Support Working Hours
          </label>
          <input type="text" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-brand-indigo" /> Company Holidays ({holidays.length})
          </h3>

          <form onSubmit={handleAddHoliday} className="flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="Holiday name (e.g. Labor Day)" value={newHolidayName} onChange={(e) => setNewHolidayName(e.target.value)} className="flex-1 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs" />
            <input type="text" placeholder="Date (e.g. Sep 07, 2026)" value={newHolidayDate} onChange={(e) => setNewHolidayDate(e.target.value)} className="w-full sm:w-44 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs" />
            <button type="submit" className="px-3 py-1.5 rounded-xl bg-brand-indigo text-white text-xs font-semibold flex items-center justify-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </form>

          <div className="divide-y divide-border border border-border rounded-xl bg-surface overflow-hidden">
            {holidays.map((h) => (
              <div key={h.id} className="p-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{h.name}</span>
                <div className="flex items-center gap-3 text-foreground-muted">
                  <span>{h.date}</span>
                  <button type="button" onClick={() => handleDelete(h.id)} className="p-1 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

