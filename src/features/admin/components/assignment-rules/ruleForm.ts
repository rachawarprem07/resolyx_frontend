import type {
  AssignmentRule,
  AssignmentRulePayload,
  ConditionGroupNode,
  FieldsMetadata,
} from '../../types/rule.types';
import { emptyRoot, ensureIds } from './conditionTree';

export function defaultRulePayload(meta: FieldsMetadata, nextPriority = 10): AssignmentRulePayload {
  return {
    name: '',
    description: '',
    is_active: true,
    priority: nextPriority,
    triggers: ['ticket_created'],
    conditions: emptyRoot(meta),
    assignment_type: 'agent',
    assignment_config: {},
    overwrite_existing_assignment: false,
    reassign_existing: false,
    skip_unavailable_agents: true,
    continue_to_next_rule: false,
  };
}

export function payloadFromRule(rule: AssignmentRule): AssignmentRulePayload {
  return {
    name: rule.name,
    description: rule.description ?? '',
    is_active: rule.is_active,
    priority: rule.priority,
    triggers: [...rule.triggers],
    conditions: ensureIds(rule.conditions) as ConditionGroupNode,
    assignment_type: rule.assignment_type,
    assignment_config: { ...rule.assignment_config },
    overwrite_existing_assignment: rule.overwrite_existing_assignment,
    reassign_existing: rule.reassign_existing,
    skip_unavailable_agents: rule.skip_unavailable_agents,
    continue_to_next_rule: rule.continue_to_next_rule,
  };
}

/** Only the config keys relevant to the chosen assignment type are sent. */
export function cleanPayload(p: AssignmentRulePayload): AssignmentRulePayload {
  const c = p.assignment_config;
  const assignment_config =
    p.assignment_type === 'agent'
      ? { agent_id: c.agent_id ?? null }
      : p.assignment_type === 'team'
        ? { team_id: c.team_id ?? null }
        : { team_id: c.team_id ?? null, agent_ids: c.agent_ids ?? [] };
  return {
    ...p,
    name: p.name.trim(),
    description: p.description?.trim() || null,
    priority: Number(p.priority),
    assignment_config,
  };
}

/** Client-side checks for everything except the condition tree. Keys mirror backend paths. */
export function validateRuleFields(p: AssignmentRulePayload): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!p.name.trim()) errors.name = 'Rule name is required.';
  else if (p.name.trim().length > 120) errors.name = 'Keep the name under 120 characters.';
  if (!Number.isInteger(Number(p.priority)) || Number(p.priority) < 0) errors.priority = 'Use a whole number of 0 or more.';
  if (p.triggers.length === 0) errors.triggers = 'Choose when this rule should run.';
  const c = p.assignment_config;
  if (p.assignment_type === 'agent' && !c.agent_id) errors['assignment_config.agent_id'] = 'Select an agent.';
  if (p.assignment_type === 'team' && !c.team_id) errors['assignment_config.team_id'] = 'Select a team.';
  if ((p.assignment_type === 'round_robin' || p.assignment_type === 'least_assigned') && !c.team_id && !(c.agent_ids ?? []).length) {
    errors['assignment_config.agent_ids'] = 'Choose a team or at least one agent for the pool.';
  }
  return errors;
}

/** Maps backend field errors (`name`, `assignment_config.team_id`, pydantic `''`) onto form keys. */
export function mapFieldErrors(errors: { path: string; message: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  errors.forEach(({ path, message }) => {
    if (path.startsWith('root')) return;
    const key = path === '' ? 'assignment_config' : path;
    out[key] = message;
  });
  return out;
}
