import { apiRequest } from './http';
import { saveStoredTeams } from './teamsStorage';
import type { RoutingStrategy, SupportTeam } from '@/features/admin/types/team.types';

export interface ApiTeamMember {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export interface ApiTeam {
  id: number;
  name: string;
  description: string | null;
  routing_strategy: RoutingStrategy;
  sla_target_hours: number;
  lead_user_id: number | null;
  lead_name: string | null;
  lead_email: string | null;
  is_active: boolean;
  members: ApiTeamMember[];
  open_tickets: number;
  created_at: string;
  updated_at: string;
}

export interface TeamPayload {
  name: string;
  description: string | null;
  routing_strategy: RoutingStrategy;
  sla_target_hours: number;
  lead_user_id: number | null;
  member_ids: number[];
  is_active: boolean;
}

export function toSupportTeam(t: ApiTeam): SupportTeam {
  return {
    id: String(t.id),
    backendId: t.id,
    name: t.name,
    description: t.description ?? '',
    leadName: t.lead_name ?? '—',
    leadEmail: t.lead_email ?? '',
    leadUserId: t.lead_user_id,
    membersCount: t.members.length,
    activeTicketsCount: t.open_tickets,
    slaTargetHours: t.sla_target_hours,
    routingStrategy: t.routing_strategy,
    memberNames: t.members.map((m) => m.name),
    memberIds: t.members.map((m) => m.id),
    isActive: t.is_active,
    createdAt: t.created_at,
  };
}

export const teamsApi = {
  /** Loads teams and refreshes the local cache used by synchronous readers. */
  list: async (): Promise<SupportTeam[]> => {
    const teams = (await apiRequest<ApiTeam[]>('GET', '/teams')).map(toSupportTeam);
    saveStoredTeams(teams);
    return teams;
  },
  create: async (payload: TeamPayload) => toSupportTeam(await apiRequest<ApiTeam>('POST', '/teams', { body: payload })),
  update: async (id: number, payload: TeamPayload) =>
    toSupportTeam(await apiRequest<ApiTeam>('PUT', `/teams/${id}`, { body: payload })),
  remove: (id: number) => apiRequest<void>('DELETE', `/teams/${id}`),
};
