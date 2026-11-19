import type { AssignmentRule, FieldsMetadata } from '../../../types/rule.types';

/** Mirrors the shape returned by GET /assignment-rules/fields. */
export const META: FieldsMetadata = {
  fields: [
    { key: 'subject', label: 'Subject', group: 'Ticket', data_type: 'text', id_valued: false, options: [] },
    {
      key: 'priority', label: 'Priority', group: 'Ticket', data_type: 'select', id_valued: false,
      options: ['Low', 'Medium', 'High', 'Urgent'].map((v) => ({ value: v, label: v })),
    },
    {
      key: 'status', label: 'Status', group: 'Ticket', data_type: 'select', id_valued: false,
      options: ['Open', 'Resolved'].map((v) => ({ value: v, label: v })),
    },
    { key: 'created_at', label: 'Created Date', group: 'Ticket', data_type: 'date', id_valued: false, options: [] },
    { key: 'message_count', label: 'Message Count', group: 'Ticket', data_type: 'number', id_valued: false, options: [] },
    {
      key: 'customer_type', label: 'Customer Type', group: 'Customer', data_type: 'select', id_valued: false,
      options: ['Enterprise', 'Trial'].map((v) => ({ value: v, label: v })),
    },
    {
      key: 'assigned_agent', label: 'Assigned Agent', group: 'Assignment', data_type: 'select', id_valued: true,
      options: [{ value: 7, label: 'Alice Agent' }],
    },
    { key: 'is_unassigned', label: 'Is Unassigned', group: 'Assignment', data_type: 'boolean', id_valued: false, options: [] },
    { key: 'tags', label: 'Tags', group: 'Other', data_type: 'tags', id_valued: false, options: [] },
  ],
  operators: {
    text: [
      { key: 'is', label: 'Is', value_shape: 'single' },
      { key: 'contains', label: 'Contains', value_shape: 'single' },
      { key: 'is_empty', label: 'Is Empty', value_shape: 'none' },
    ],
    number: [
      { key: 'eq', label: 'Equals', value_shape: 'single' },
      { key: 'gt', label: 'Greater Than', value_shape: 'single' },
    ],
    select: [
      { key: 'is', label: 'Is', value_shape: 'single' },
      { key: 'is_not', label: 'Is Not', value_shape: 'single' },
      { key: 'in', label: 'Is Any Of', value_shape: 'list' },
      { key: 'not_in', label: 'Is None Of', value_shape: 'list' },
    ],
    date: [
      { key: 'is', label: 'Is', value_shape: 'single' },
      { key: 'between', label: 'Is Between', value_shape: 'range' },
      { key: 'within_last', label: 'Is Within Last', value_shape: 'period' },
    ],
    boolean: [
      { key: 'is_true', label: 'Is True', value_shape: 'none' },
      { key: 'is_false', label: 'Is False', value_shape: 'none' },
    ],
    tags: [
      { key: 'contains_any', label: 'Contains Any', value_shape: 'list' },
      { key: 'contains_all', label: 'Contains All', value_shape: 'list' },
    ],
  },
  period_units: ['minutes', 'hours', 'days', 'weeks'],
  limits: { max_depth: 4, max_conditions: 50, max_children_per_group: 25 },
};

export function makeRule(overrides: Partial<AssignmentRule> = {}): AssignmentRule {
  return {
    id: 1,
    name: 'High to Alice',
    description: 'Escalations',
    is_active: true,
    priority: 10,
    triggers: ['ticket_created'],
    conditions: {
      type: 'group', id: 'root', logic: 'AND',
      children: [{ type: 'condition', id: 'c1', field: 'priority', operator: 'is', value: 'High' }],
    },
    conditions_summary: 'Priority is High',
    condition_count: 1,
    assignment_type: 'agent',
    assignment_config: { agent_id: 7 },
    assigned_to_label: 'Alice Agent',
    overwrite_existing_assignment: false,
    reassign_existing: false,
    skip_unavailable_agents: true,
    continue_to_next_rule: false,
    created_by: 1,
    created_by_name: 'Ada Admin',
    created_at: '2026-11-19T10:00:00Z',
    updated_at: '2026-11-19T10:00:00Z',
    ...overrides,
  };
}
