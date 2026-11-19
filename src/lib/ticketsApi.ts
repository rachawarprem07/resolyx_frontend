/**
 * Tickets API. Creating or updating a ticket runs assignment rules on the backend.
 * Responses are mapped to the existing `AgentTicket` shape used across the UI.
 */
import { apiRequest } from './http';
import type {
  AgentTicket,
  AiSuggestedResolution,
  TicketMessage,
  TicketPriority,
  TicketStatus,
} from '@/features/agent/types/agent.types';

export interface ApiTicket {
  id: number;
  ticket_number: string;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  category: string | null;
  subcategory: string | null;
  ticket_type: string | null;
  source: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_company: string | null;
  customer_type: string | null;
  tags: string[];
  sla_status: string | null;
  due_date: string | null;
  assigned_agent_id: number | null;
  assigned_agent_name: string | null;
  assigned_team_id: number | null;
  assigned_team_name: string | null;
  assignment_source: string | null;
  assigned_by_rule_id: number | null;
  meta: TicketMeta;
  created_at: string;
  updated_at: string;
}

export interface TicketMeta {
  conversation?: TicketMessage[];
  aiSuggestion?: AiSuggestedResolution;
  csatRating?: number;
  feedbackComment?: string;
}

export interface TicketWritePayload {
  subject?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  category?: string | null;
  subcategory?: string | null;
  ticket_type?: string | null;
  source?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_company?: string | null;
  customer_type?: string | null;
  tags?: string[];
  sla_status?: string | null;
  due_date?: string | null;
  meta?: TicketMeta;
  /** Setting these records a manual assignment. 0 clears. */
  assigned_agent_id?: number;
  assigned_team_id?: number;
}

const PRIORITIES: TicketPriority[] = ['Urgent', 'High', 'Medium', 'Low'];
const STATUSES: TicketStatus[] = ['Investigating', 'Suggested', 'Resolved', 'Escalated', 'Open'];

function slaFields(dueIso: string | null): Pick<AgentTicket, 'slaDeadline' | 'slaMinutesRemaining'> {
  if (!dueIso) return { slaDeadline: '—', slaMinutesRemaining: 0 };
  const due = new Date(dueIso);
  const minutes = Math.round((due.getTime() - Date.now()) / 60000);
  return {
    slaDeadline:
      minutes < 0 ? 'Overdue' : due.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    slaMinutesRemaining: minutes,
  };
}

export function toAgentTicket(t: ApiTicket): AgentTicket {
  const meta = t.meta || {};
  return {
    id: t.ticket_number,
    backendId: t.id,
    title: t.subject,
    description: t.description ?? undefined,
    customerName: t.customer_name || 'Customer',
    customerEmail: t.customer_email || '',
    company: t.customer_company || '',
    category: t.category || 'General Inquiries',
    priority: (PRIORITIES.includes(t.priority as TicketPriority) ? t.priority : 'Medium') as TicketPriority,
    status: (STATUSES.includes(t.status as TicketStatus) ? t.status : 'Open') as TicketStatus,
    ...slaFields(t.due_date),
    createdAt: t.created_at,
    assignedAgent: t.assigned_agent_name || 'Unassigned',
    assignedAgentId: t.assigned_agent_id,
    assignedTeam: t.assigned_team_name || undefined,
    assignedTeamId: t.assigned_team_id ? String(t.assigned_team_id) : undefined,
    assignmentSource: t.assignment_source,
    customerTier: t.customer_type || undefined,
    channel: t.source || undefined,
    conversation: Array.isArray(meta.conversation) ? meta.conversation : [],
    aiSuggestion: meta.aiSuggestion,
    tags: t.tags || [],
    csatRating: meta.csatRating,
    feedbackComment: meta.feedbackComment,
  };
}

export function metaOf(ticket: AgentTicket): TicketMeta {
  return {
    conversation: ticket.conversation,
    ...(ticket.aiSuggestion ? { aiSuggestion: ticket.aiSuggestion } : {}),
    ...(ticket.csatRating !== undefined ? { csatRating: ticket.csatRating } : {}),
    ...(ticket.feedbackComment ? { feedbackComment: ticket.feedbackComment } : {}),
  };
}

export const ticketsApi = {
  list: async (): Promise<AgentTicket[]> =>
    (await apiRequest<ApiTicket[]>('GET', '/tickets')).map(toAgentTicket),
  listRaw: () => apiRequest<ApiTicket[]>('GET', '/tickets'),
  create: async (payload: TicketWritePayload & { subject: string }): Promise<AgentTicket> =>
    toAgentTicket(await apiRequest<ApiTicket>('POST', '/tickets', { body: payload })),
  update: async (ticketNumber: string, payload: TicketWritePayload): Promise<AgentTicket> =>
    toAgentTicket(
      await apiRequest<ApiTicket>('PATCH', `/tickets/${encodeURIComponent(ticketNumber)}`, { body: payload }),
    ),
};
