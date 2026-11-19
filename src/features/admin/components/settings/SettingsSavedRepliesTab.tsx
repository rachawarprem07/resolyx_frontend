import React, { useState } from 'react';
import { Zap, Plus, Sliders, Trash2 } from 'lucide-react';

interface Props {
  mode: 'replies' | 'fields' | 'integrations';
}

export const SettingsSavedRepliesTab: React.FC<Props> = ({ mode }) => {
  const [replies, setReplies] = useState([
    { id: '1', title: 'Greeting & Triage Notice', text: 'Hello! Thank you for reaching out to Resolyx support. We have received your request and our engineering team is actively investigating.' },
    { id: '2', title: 'Request System Logs', text: 'Could you please provide the application debug logs or console output from your container pod to help us expedite diagnosis?' },
    { id: '3', title: 'Resolution & CSAT Survey', text: 'We have applied the fix and verified all services are healthy. Please let us know if any further issues arise.' },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;
    setReplies([...replies, { id: `r-${Date.now()}`, title: newTitle.trim(), text: newText.trim() }]);
    setNewTitle('');
    setNewText('');
  };

  if (mode === 'fields') {
    return (
      <div className="p-6 space-y-5">
        <div className="pb-3 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Field Dependencies & Conditional Forms</h2>
          <p className="text-xs text-foreground-muted">Define conditional visibility rules for ticket categories, sub-categories, and custom metadata.</p>
        </div>
        <div className="space-y-3">
          {[
            { parent: 'Category: Infrastructure / Cloud', child: 'Shows: Cloud Provider, Region, Cluster ARN' },
            { parent: 'Category: Billing & Invoice', child: 'Shows: Invoice Number, Payment Gateway, PO Number' },
            { parent: 'Category: Security / SSO', child: 'Shows: Identity Provider, SAML Protocol, User Email' },
          ].map((rule) => (
            <div key={rule.parent} className="p-4 rounded-xl border border-border bg-surface-subtle/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5"><Sliders className="h-3.5 w-3.5 text-brand-indigo" /> {rule.parent}</span>
                <p className="text-xs text-foreground-muted mt-0.5">{rule.child}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo text-[10px] font-bold">Rule Active</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'integrations') {
    return (
      <div className="p-6 space-y-5">
        <div className="pb-3 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Connected Integrations & Webhooks</h2>
          <p className="text-xs text-foreground-muted">Link external services, ticketing sync, and webhook endpoints.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'Slack Notifications', desc: 'Post instant ticket alerts into support channels.', active: true },
            { name: 'Jira Issue Sync', desc: 'Bi-directional incident sync for software engineering teams.', active: true },
            { name: 'PagerDuty On-Call', desc: 'Trigger on-call escalations for Tier 1 critical breaches.', active: false },
            { name: 'Custom Outbound Webhook', desc: 'Send JSON payloads on ticket status changes.', active: true },
          ].map((int) => (
            <div key={int.name} className="p-4 rounded-xl border border-border bg-surface-subtle/50 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{int.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${int.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-500'}`}>
                    {int.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-foreground-muted mt-1">{int.desc}</p>
              </div>
              <button type="button" className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-foreground hover:bg-surface-subtle self-start">
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="pb-3 border-b border-border">
        <h2 className="text-base font-bold text-foreground">Saved Replies & Canned Macros</h2>
        <p className="text-xs text-foreground-muted">Pre-written templates support agents can insert into ticket replies with one click.</p>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-surface-subtle/50 space-y-3">
        <h3 className="text-xs font-bold text-foreground">Create New Saved Reply</h3>
        <input type="text" placeholder="Title (e.g. Server Logs Request)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-border bg-surface text-xs" />
        <textarea rows={2} placeholder="Reply body text..." value={newText} onChange={(e) => setNewText(e.target.value)} className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs" />
        <button type="submit" className="px-3 py-1.5 rounded-xl bg-brand-indigo text-white text-xs font-semibold inline-flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Save Reply
        </button>
      </form>

      <div className="space-y-3">
        {replies.map((r) => (
          <div key={r.id} className="p-3.5 rounded-xl border border-border bg-surface flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-brand-indigo" /> {r.title}</span>
              <p className="text-xs text-foreground-muted leading-relaxed">{r.text}</p>
            </div>
            <button type="button" onClick={() => setReplies(replies.filter((x) => x.id !== r.id))} className="p-1 hover:text-rose-600 shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

