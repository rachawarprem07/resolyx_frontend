import { apiRequest } from './http';
import type {
  AgentOption,
  AssignmentRule,
  AssignmentRuleList,
  AssignmentRulePayload,
  ExecutionList,
  ExecutionQuery,
  FieldsMetadata,
  PreviewResult,
  RuleListQuery,
  RuleTestResult,
  RuleTrigger,
  TeamOption,
  TicketTarget,
} from '@/features/admin/types/rule.types';

const BASE = '/assignment-rules';

export const assignmentRulesApi = {
  list: (query: RuleListQuery = {}, signal?: AbortSignal) =>
    apiRequest<AssignmentRuleList>('GET', BASE, { query: { ...query }, signal }),
  get: (id: number) => apiRequest<AssignmentRule>('GET', `${BASE}/${id}`),
  create: (payload: AssignmentRulePayload) => apiRequest<AssignmentRule>('POST', BASE, { body: payload }),
  update: (id: number, payload: AssignmentRulePayload) =>
    apiRequest<AssignmentRule>('PUT', `${BASE}/${id}`, { body: payload }),
  remove: (id: number) => apiRequest<void>('DELETE', `${BASE}/${id}`),
  setStatus: (id: number, isActive: boolean) =>
    apiRequest<AssignmentRule>('PATCH', `${BASE}/${id}/status`, { body: { is_active: isActive } }),
  duplicate: (id: number) => apiRequest<AssignmentRule>('POST', `${BASE}/${id}/duplicate`),

  /** Dry-run a saved rule (optionally with unsaved edits in `rule`). Never modifies data. */
  test: (id: number, target: TicketTarget, rule?: AssignmentRulePayload) =>
    apiRequest<RuleTestResult>('POST', `${BASE}/${id}/test`, { body: { ...target, rule } }),
  /** Dry-run the active rule set — or a single unsaved draft — for a ticket. */
  preview: (target: TicketTarget, options: { trigger?: RuleTrigger; rule?: AssignmentRulePayload } = {}) =>
    apiRequest<PreviewResult>('POST', `${BASE}/preview`, { body: { ...target, ...options } }),

  executions: (query: ExecutionQuery = {}, signal?: AbortSignal) =>
    apiRequest<ExecutionList>('GET', `${BASE}/executions`, { query: { ...query }, signal }),
  ruleExecutions: (id: number, limit = 20) =>
    apiRequest<ExecutionList>('GET', `${BASE}/${id}/executions`, { query: { limit } }),

  fields: () => apiRequest<FieldsMetadata>('GET', `${BASE}/fields`),
  agents: () => apiRequest<AgentOption[]>('GET', `${BASE}/agents`),
  teams: () => apiRequest<TeamOption[]>('GET', `${BASE}/teams`),
  setAgentAvailability: (agentId: number, isAvailable: boolean) =>
    apiRequest<AgentOption>('PATCH', `${BASE}/agents/${agentId}/availability`, {
      body: { is_available: isAvailable },
    }),
};
