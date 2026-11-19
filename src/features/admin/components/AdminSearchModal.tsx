import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Ticket, Building2, BookOpen, Users2, GitFork, Settings, Clock, ArrowRight } from 'lucide-react';

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCHABLE_ITEMS = [
  { id: '1', title: 'Kubernetes Ingress Gateway 504 Timeout', cat: 'Tickets', href: '/admin/tickets', icon: Ticket, sub: 'TICK-8042 • Urgent' },
  { id: '2', title: 'SSO SAML assertion renewal with Okta', cat: 'Tickets', href: '/admin/tickets', icon: Ticket, sub: 'TICK-8043 • Investigating' },
  { id: '3', title: 'PostgreSQL connection pool exhaustion', cat: 'Tickets', href: '/admin/tickets', icon: Ticket, sub: 'TICK-8044 • Suggested' },
  { id: '4', title: 'CloudScale Logistics', cat: 'Customers', href: '/admin/customers', icon: Building2, sub: 'Enterprise • 48 Users' },
  { id: '5', title: 'Apex Systems', cat: 'Customers', href: '/admin/customers', icon: Building2, sub: 'Enterprise • 142 Users' },
  { id: '6', title: 'Nordic FinTech Group', cat: 'Customers', href: '/admin/customers', icon: Building2, sub: 'Enterprise • 260 Users' },
  { id: '7', title: 'Envoy Ingress HTTP/2 Keepalive Tuning', cat: 'Knowledge Base', href: '/admin/kb', icon: BookOpen, sub: 'KB-402 • Runbook' },
  { id: '8', title: 'Infrastructure & K8s Escalations', cat: 'Teams', href: '/admin/settings?tab=teams', icon: Users2, sub: 'Settings • Support Teams' },
  { id: '9', title: 'Enterprise Critical Auto-Escalation', cat: 'Rules', href: '/admin/settings?tab=assignment-rules', icon: GitFork, sub: 'Settings • Routing Rules' },
  { id: '10', title: 'Excel Color Picker & Theme Branding', cat: 'Settings', href: '/admin/settings?tab=general', icon: Settings, sub: 'Brand Customization' },
  { id: '11', title: 'SLA Response & Resolution Policies', cat: 'SLA', href: '/admin/settings?tab=sla', icon: Clock, sub: 'Settings • SLA Policies' },
];

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? SEARCHABLE_ITEMS.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.cat.toLowerCase().includes(query.toLowerCase()) ||
          i.sub.toLowerCase().includes(query.toLowerCase()),
      )
    : SEARCHABLE_ITEMS.slice(0, 6);

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-subtle/50">
          <Search className="h-4 w-4 text-brand-indigo shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets, customers, KB runbooks, settings..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-muted outline-none"
          />
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {results.length > 0 ? (
            results.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-subtle transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-1.5 rounded-lg bg-surface border border-border text-foreground-muted group-hover:text-brand-indigo">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                      <p className="text-[10px] text-foreground-muted truncate">{item.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-subtle text-foreground-muted border border-border">
                      {item.cat}
                    </span>
                    <ArrowRight className="h-3 w-3 text-foreground-muted group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-foreground-muted">
              No matching records found for "{query}".
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-border bg-surface-subtle/30 flex items-center justify-between text-[11px] text-foreground-muted">
          <span>Navigate with click or arrow keys</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px]">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};

