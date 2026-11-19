import type { AgentTicket, AgentQueueStats } from '../types/agent.types';

export const AGENT_STATS: AgentQueueStats = {
  assignedToMe: 0,
  breachingSoon: 0,
  resolvedToday: 0,
  avgResponseMinutes: 0,
  csatScore: 5.0,
};

export const MOCK_AGENT_TICKETS: AgentTicket[] = [];
