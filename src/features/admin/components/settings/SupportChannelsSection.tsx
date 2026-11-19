import React, { useState } from 'react';
import { Radio, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const SupportChannelsSection: React.FC = () => {
  const [inboundEmail, setInboundEmail] = useState('tickets@support.resolyx.io');
  const [smtpServer, setSmtpServer] = useState('smtp.mailgun.org (Port 587 TLS)');
  const [chatWidgetEnabled, setChatWidgetEnabled] = useState(true);
  const [portalAccessMode, setPortalAccessMode] = useState<'open' | 'restricted'>('open');
  const [autoAcknowledge, setAutoAcknowledge] = useState(true);

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-5">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Radio className="h-5 w-5 text-brand-indigo" />
        <div>
          <h2 className="text-sm font-bold text-foreground">Support Channels & Ingestion</h2>
          <p className="text-xs text-foreground-muted">
            Configure omnichannel incoming conduits, mail forwarding, and chat interfaces.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Inbound Ticket Forwarding Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <input
              type="email"
              value={inboundEmail}
              onChange={(e) => setInboundEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
          <span className="text-[10px] text-foreground-muted mt-1 block">
            Forward emails here to automatically convert client messages into tickets.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Outbound SMTP / Transactional Mail Relay</label>
          <div className="relative">
            <Send className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <input
              type="text"
              value={smtpServer}
              onChange={(e) => setSmtpServer(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> TLS Handshake Verified
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between py-1">
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-brand-indigo" />
              Embeddable AI Customer Chat Widget
            </h3>
            <p className="text-xs text-foreground-muted">
              Enable real-time conversational triage widget on landing page and client portal.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={chatWidgetEnabled}
            onClick={() => setChatWidgetEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              chatWidgetEnabled ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${
                chatWidgetEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-border pt-3">
          <div>
            <h3 className="text-xs font-bold text-foreground">Immediate Auto-Responder Acknowledgment</h3>
            <p className="text-xs text-foreground-muted">
              Automatically dispatch email confirmation with ticket ID and SLA target upon receipt.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoAcknowledge}
            onClick={() => setAutoAcknowledge((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              autoAcknowledge ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${
                autoAcknowledge ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-border pt-3">
          <div>
            <h3 className="text-xs font-bold text-foreground">Customer Portal Authentication Scope</h3>
            <p className="text-xs text-foreground-muted">
              {portalAccessMode === 'open'
                ? 'Open: Any registered client can submit and view tickets.'
                : 'Restricted: Only verified enterprise domain contacts can log in.'}
            </p>
          </div>
          <select
            value={portalAccessMode}
            onChange={(e) => setPortalAccessMode(e.target.value as 'open' | 'restricted')}
            className="px-3 py-1.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo font-semibold"
          >
            <option value="open">Open Portal Access</option>
            <option value="restricted">Corporate SSO Restricted</option>
          </select>
        </div>
      </div>
    </div>
  );
};

