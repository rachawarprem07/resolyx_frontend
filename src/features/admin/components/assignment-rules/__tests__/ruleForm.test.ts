import { describe, expect, it } from 'vitest';
import { cleanPayload, defaultRulePayload, mapFieldErrors, payloadFromRule, validateRuleFields } from '../ruleForm';
import { META, makeRule } from './fixtures';

describe('rule form helpers', () => {
  it('defaults: enabled, created trigger, manual assignments protected', () => {
    const p = defaultRulePayload(META, 30);
    expect(p).toMatchObject({
      is_active: true, priority: 30, triggers: ['ticket_created'],
      overwrite_existing_assignment: false, skip_unavailable_agents: true, continue_to_next_rule: false,
    });
  });

  it('validates required fields per assignment type', () => {
    const base = { ...defaultRulePayload(META), name: 'R' };
    expect(validateRuleFields({ ...base, name: ' ' })).toHaveProperty('name');
    expect(validateRuleFields({ ...base, triggers: [] })).toHaveProperty('triggers');
    expect(validateRuleFields({ ...base, assignment_type: 'agent' })).toHaveProperty(['assignment_config.agent_id']);
    expect(validateRuleFields({ ...base, assignment_type: 'team' })).toHaveProperty(['assignment_config.team_id']);
    expect(validateRuleFields({ ...base, assignment_type: 'round_robin' })).toHaveProperty(['assignment_config.agent_ids']);
    expect(validateRuleFields({ ...base, assignment_type: 'least_assigned', assignment_config: { agent_ids: [1] } })).toEqual({});
  });

  it('sends only config keys relevant to the assignment type', () => {
    const p = cleanPayload({
      ...defaultRulePayload(META), name: '  Trim me ', description: '  ',
      assignment_type: 'team', assignment_config: { agent_id: 3, team_id: 5, agent_ids: [1] },
    });
    expect(p.name).toBe('Trim me');
    expect(p.description).toBeNull();
    expect(p.assignment_config).toEqual({ team_id: 5 });
  });

  it('round-trips a saved rule into the form', () => {
    const p = payloadFromRule(makeRule({ triggers: ['ticket_created', 'ticket_updated'] }));
    expect(p.triggers).toEqual(['ticket_created', 'ticket_updated']);
    expect(p.conditions.id).toBe('root');
    expect(p.assignment_config).toEqual({ agent_id: 7 });
  });

  it('maps backend field errors to form keys', () => {
    expect(mapFieldErrors([
      { path: 'assignment_config.agent_id', message: 'Agent is inactive.' },
      { path: '', message: 'Select a team or at least one agent.' },
      { path: 'root.0', message: 'condition error' },
    ])).toEqual({
      'assignment_config.agent_id': 'Agent is inactive.',
      assignment_config: 'Select a team or at least one agent.',
    });
  });
});
