/**
 * Ticket cache backed by the Resolyx API.
 *
 * The backend is the source of truth (it runs assignment rules on create/update).
 * Pages that read tickets synchronously use the local cache, which is refreshed by
 * `syncTicketsFromBackend()` and by every create/update. Listeners are notified via
 * the `resolyx-tickets-updated` window event.
 */
import type { AgentTicket } from '@/features/agent/types/agent.types';
import { ticketsApi, type TicketWritePayload } from './ticketsApi';

const TICKETS_STORAGE_KEY = 'resolyx-agent-tickets-v7';
export const TICKETS_UPDATED_EVENT = 'resolyx-tickets-updated';

export const DEFAULT_AGENT_TICKETS: AgentTicket[] = [];

export function getStoredAgentTickets(): AgentTicket[] {
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!raw) return DEFAULT_AGENT_TICKETS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AgentTicket[]) : DEFAULT_AGENT_TICKETS;
  } catch {
    return DEFAULT_AGENT_TICKETS;
  }
}

export function saveStoredAgentTickets(tickets: AgentTicket[]): void {
  try {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // storage disabled
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(TICKETS_UPDATED_EVENT));
  }
}

function upsert(ticket: AgentTicket): AgentTicket[] {
  const current = getStoredAgentTickets();
  const exists = current.some((t) => t.id === ticket.id);
  const next = exists ? current.map((t) => (t.id === ticket.id ? ticket : t)) : [ticket, ...current];
  saveStoredAgentTickets(next);
  return next;
}

let inflight: Promise<AgentTicket[]> | null = null;

/** Replaces the cache with the tickets visible to the signed-in user.
 *  Concurrent callers (e.g. a page and the top nav) share one request. */
export function syncTicketsFromBackend(): Promise<AgentTicket[]> {
  if (!inflight) {
    inflight = ticketsApi
      .list()
      .then((tickets) => {
        saveStoredAgentTickets(tickets);
        return tickets;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Creates a ticket on the backend (assignment rules run there) and caches the result. */
export async function createTicket(payload: TicketWritePayload & { subject: string }): Promise<AgentTicket> {
  const ticket = await ticketsApi.create(payload);
  upsert(ticket);
  return ticket;
}

/** Partially updates a ticket on the backend and caches the result. */
export async function updateTicket(ticketNumber: string, payload: TicketWritePayload): Promise<AgentTicket> {
  const ticket = await ticketsApi.update(ticketNumber, payload);
  upsert(ticket);
  return ticket;
}
