import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  Edit3,
  User,
  Check,
  Filter,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { TicketPreviewData } from '@/types/common';

const SAMPLE_TICKETS: TicketPreviewData[] = [
  {
    id: 'TICK-8402',
    title: 'VPN auth failure after macOS Sonoma update',
    category: 'IT Helpdesk',
    status: 'suggested',
    priority: 'urgent',
    requester: 'Elena Rostova',
    department: 'Engineering — DevOps',
    messages: [
      {
        id: 'msg-1',
        sender: { name: 'Elena Rostova', role: 'customer' },
        content:
          'Hi IT Team, after upgrading to macOS Sonoma yesterday my WireGuard client fails handshake with error code WG_AUTH_PEER_TIMEOUT. I need access to deploy our staging clusters.',
        timestamp: '14 mins ago',
      },
    ],
    suggestedAction: {
      type: 'reply',
      confidence: 96,
      sources: ['Runbook: SecOps-WireGuard-Sonoma-Fix.md', 'IT Policy: Zero-Trust-Certs-v3.pdf'],
      suggestedText:
        'Hi Elena, macOS Sonoma updated the keychain certificate trust store. Please refresh your local profile by running:\n\n`resolyx-vpn refresh --profile prod-eu`\n\nThis re-registers the client certificate into the System Keychain. Let us know if you still see WG_AUTH_PEER_TIMEOUT.',
    },
  },
  {
    id: 'TICK-8398',
    title: 'API rate limits triggered during webhook batch sync',
    category: 'Customer Helpdesk',
    status: 'suggested',
    priority: 'high',
    requester: 'Marcus Vance',
    department: 'Acme Corp (Enterprise)',
    messages: [
      {
        id: 'msg-2',
        sender: { name: 'Marcus Vance', role: 'customer' },
        content:
          'We started receiving HTTP 429 Too Many Requests on our nightly inventory synchronization pipeline. Did our tier quota change?',
        timestamp: '32 mins ago',
      },
    ],
    suggestedAction: {
      type: 'reply',
      confidence: 93,
      sources: ['API Docs: Rate-Limits-Enterprise.md', 'CRM: Acme-Corp-SLA-Tier.json'],
      suggestedText:
        'Hi Marcus, your tier limit is 5,000 req/min with burst allowance. Your burst traffic peaked at 5,800 during the 02:00 UTC window. We recommend enabling exponential backoff with jitter on batch requests.',
    },
  },
  {
    id: 'TICK-8395',
    title: 'Figma Enterprise workspace seat provisioning',
    category: 'IT Helpdesk',
    status: 'investigating',
    priority: 'medium',
    requester: 'Sarah Chen',
    department: 'Product Design',
    messages: [
      {
        id: 'msg-3',
        sender: { name: 'Sarah Chen', role: 'customer' },
        content:
          'Requesting an editor seat in Figma Enterprise for onboarding designer Alex Morales.',
        timestamp: '1 hour ago',
      },
    ],
    suggestedAction: {
      type: 'reply',
      confidence: 89,
      sources: ['Policy: Software-Seat-Approval-Matrix.md'],
      suggestedText:
        'Hi Sarah, seat allocation verified against Design Dept budget. Preparing automated provisioning invite for alex.morales@company.local.',
    },
  },
];

export const HelpdeskPreview: React.FC = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TICK-8402');
  const [approvedTickets, setApprovedTickets] = useState<Record<string, boolean>>({});

  const activeTicket = SAMPLE_TICKETS.find((t) => t.id === selectedTicketId) || SAMPLE_TICKETS[0]!;
  const isApproved = Boolean(approvedTickets[activeTicket.id]);

  const handleApprove = () => {
    setApprovedTickets((prev) => ({ ...prev, [activeTicket.id]: true }));
  };

  const handleResetApproval = () => {
    setApprovedTickets((prev) => ({ ...prev, [activeTicket.id]: false }));
  };

  return (
    <div className="relative w-full rounded-2xl border border-border bg-surface shadow-elevated overflow-hidden transition-all duration-300">
      {/* Top OS Window Mockup Chrome */}
      <div className="flex items-center justify-between border-b border-border bg-surface-subtle/80 px-4 py-2.5 text-xs text-foreground-muted select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-foreground-muted hidden sm:inline-block">
            workspace.resolyx.internal
          </span>
        </div>

        {/* Private AI Status Pill */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/30 px-2.5 py-0.5 text-[11px] font-medium text-brand-violet">
            <Shield className="h-3 w-3" />
            <span>Private AI: Isolated VPC</span>
          </span>
          <span className="hidden md:inline-block text-[11px] text-foreground-muted/70">
            Preview Mode
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Column: Ticket Queue (4 Cols) */}
        <div className="lg:col-span-4 border-r border-border bg-surface-subtle/30 flex flex-col">
          <div className="p-3 border-b border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <span>Ticket Queue</span>
              <span className="rounded-full bg-brand-indigo/10 text-brand-indigo px-1.5 py-0.2 text-[10px]">
                {SAMPLE_TICKETS.length} active
              </span>
            </div>
            <div className="flex items-center gap-1 text-foreground-muted">
              <Filter className="h-3.5 w-3.5" />
              <Search className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="divide-y divide-border/60 overflow-y-auto">
            {SAMPLE_TICKETS.map((ticket) => {
              const isSelected = ticket.id === activeTicket.id;
              const hasBeenApproved = approvedTickets[ticket.id];

              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={cn(
                    'w-full text-left p-3.5 transition-colors flex flex-col gap-1.5 relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-indigo',
                    isSelected
                      ? 'bg-surface border-l-2 border-brand-indigo shadow-subtle'
                      : 'hover:bg-surface/60',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-foreground-muted">{ticket.id}</span>
                    <Badge size="sm" variant={ticket.priority === 'urgent' ? 'error' : 'warning'}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-medium text-foreground line-clamp-1">
                    {ticket.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-foreground-muted mt-1">
                    <span>{ticket.requester}</span>
                    {hasBeenApproved ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="h-3 w-3" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-brand-violet">
                        <Sparkles className="h-3 w-3" /> AI Draft
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right Column: Ticket Detail & AI Suggestion (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-surface p-4 sm:p-5">
          {/* Ticket Header */}
          <div className="pb-3 border-b border-border">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-brand-indigo font-medium">
                  {activeTicket.category} &bull; {activeTicket.id}
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mt-0.5">
                  {activeTicket.title}
                </h3>
              </div>
              <Badge variant="neutral" size="sm">
                <Clock className="h-3 w-3 mr-1" /> SLA: 45m remaining
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-foreground-muted">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <User className="h-3.5 w-3.5" /> {activeTicket.requester}
              </span>
              <span>&bull;</span>
              <span>{activeTicket.department}</span>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="py-4 space-y-3">
            {activeTicket.messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 rounded-lg bg-surface-subtle/50 p-3 border border-border/60 text-xs sm:text-sm"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-black/10 dark:bg-white/10 text-foreground font-medium text-xs">
                  {msg.sender.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{msg.sender.name}</span>
                    <span className="text-[11px] text-foreground-muted">{msg.timestamp}</span>
                  </div>
                  <p className="mt-1 text-foreground-muted leading-relaxed font-sans">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Suggestion Panel (Human-in-the-Loop) */}
          <div className="mt-2 rounded-xl border border-brand-violet/30 bg-gradient-to-br from-brand-violet/[0.04] to-brand-indigo/[0.04] p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-brand-violet/15">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-violet/20 text-brand-violet">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-semibold text-foreground">
                  Private AI Suggested Resolution
                </span>
              </div>
              <span className="text-[11px] font-mono text-brand-violet font-medium">
                {activeTicket.suggestedAction?.confidence}% match
              </span>
            </div>

            {/* Cited Knowledge Sources */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-foreground-muted flex items-center gap-1">
                <FileText className="h-3 w-3" /> Sources:
              </span>
              {activeTicket.suggestedAction?.sources.map((src) => (
                <span
                  key={src}
                  className="rounded bg-surface border border-border px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted"
                >
                  {src}
                </span>
              ))}
            </div>

            {/* AI Draft Body */}
            <div className="mt-2.5 rounded-lg bg-surface border border-border p-3 text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">
              {activeTicket.suggestedAction?.suggestedText}
            </div>

            {/* Human Oversight Action Buttons */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-foreground-muted">
                {isApproved
                  ? 'Response approved by agent. Dispatched to requester.'
                  : 'Review suggested text before sending to customer.'}
              </span>
              <div className="flex items-center gap-2">
                {isApproved ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetApproval}
                    className="text-xs h-7"
                  >
                    Reset Demo
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs h-7"
                      leftIcon={<Edit3 className="h-3 w-3" />}
                    >
                      Edit Draft
                    </Button>
                    <Button
                      variant="violet"
                      size="sm"
                      onClick={handleApprove}
                      className="text-xs h-7"
                      leftIcon={<CheckCircle2 className="h-3 w-3" />}
                    >
                      Approve &amp; Send
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
