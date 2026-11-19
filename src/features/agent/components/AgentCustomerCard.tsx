import React from 'react';
import { User, Building, BookOpen } from 'lucide-react';
import type { AgentTicket } from '../types/agent.types';

interface AgentCustomerCardProps {
  ticket: AgentTicket;
}

export const AgentCustomerCard: React.FC<AgentCustomerCardProps> = ({ ticket }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface border border-border shadow-subtle text-xs">
      <div className="flex items-center gap-2.5">
        <User className="h-4 w-4 text-brand-indigo" />
        <div>
          <p className="font-semibold text-foreground">{ticket.customerName}</p>
          <p className="text-foreground-muted font-mono text-[11px]">{ticket.customerEmail}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Building className="h-4 w-4 text-brand-indigo" />
        <div>
          <p className="font-semibold text-foreground">{ticket.company}</p>
          <p className="text-foreground-muted text-[11px]">Enterprise SLA Tier</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <BookOpen className="h-4 w-4 text-brand-indigo" />
        <div>
          <p className="font-semibold text-foreground">{ticket.category}</p>
          <p className="text-foreground-muted text-[11px]">Routed to {ticket.assignedAgent}</p>
        </div>
      </div>
    </div>
  );
};

