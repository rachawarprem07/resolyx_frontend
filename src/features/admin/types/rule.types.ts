/**
 * Assignment Rules — types mirroring the backend API (`/api/v1/assignment-rules`).
 */

export type MatchLogic = 'AND' | 'OR';
export type RuleTrigger = 'ticket_created' | 'ticket_updated';
export type AssignmentType = 'agent' | 'team' | 'round_robin' | 'least_assigned';
export type ExecutionStatus = 'assigned' | 'no_change' | 'skipped' | 'failed';
export type FieldDataType = 'text' | 'number' | 'select' | 'date' | 'boolean' | 'tags';
export type ValueShape = 'none' | 'single' | 'list' | 'range' | 'period';
export type PeriodUnit = 'minutes' | 'hours' | 'days' | 'weeks';

export interface PeriodValue {
  amount: number;
  unit: PeriodUnit;
}

export type ConditionValue =
  | string
  | number
  | null
  | Array<string | number>
  | [string, string]
  | PeriodValue;

export interface ConditionNode {
  type: 'condition';
  id: string;
  field: string;
  operator: string;
  value: ConditionValue;
}

export interface ConditionGroupNode {
  type: 'group';
  id: string;
  logic: MatchLogic;
  children: ConditionTreeNode[];
}

export type ConditionTreeNode = ConditionNode | ConditionGroupNode;

// ------------------------------------------------------------ metadata
export interface FieldOption {
  value: string | number;
  label: string;
}

export interface FieldMeta {
  key: string;
  label: string;
  group: string;
  data_type: FieldDataType;
  id_valued: boolean;
  options: FieldOption[];
}

export interface OperatorMeta {
  key: string;
  label: string;
  value_shape: ValueShape;
}

export interface FieldsMetadata {
  fields: FieldMeta[];
  operators: Record<FieldDataType, OperatorMeta[]>;
  period_units: PeriodUnit[];
  limits: { max_depth: number; max_conditions: number; max_children_per_group: number };
}

// ---------------------------------------------------------------- rules
export interface AssignmentConfig {
  agent_id?: number | null;
  team_id?: number | null;
  agent_ids?: number[];
}

export interface AssignmentRulePayload {
  name: string;
  description: string | null;
  is_active: boolean;
  priority: number;
  triggers: RuleTrigger[];
  conditions: ConditionGroupNode;
  assignment_type: AssignmentType;
  assignment_config: AssignmentConfig;
  overwrite_existing_assignment: boolean;
  reassign_existing: boolean;
  skip_unavailable_agents: boolean;
  continue_to_next_rule: boolean;
}

export interface AssignmentRule extends AssignmentRulePayload {
  id: number;
  conditions_summary: string;
  condition_count: number;
  assigned_to_label: string;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssignmentRuleStats {
  total_rules: number;
  active_rules: number;
  inactive_rules: number;
  tickets_assigned_automatically: number;
}

export interface AssignmentRuleList {
  items: AssignmentRule[];
  total: number;
  stats: AssignmentRuleStats;
}

export interface RuleListQuery {
  search?: string;
  status?: 'active' | 'inactive' | '';
  assignment_type?: AssignmentType | '';
  sort?: 'priority_asc' | 'priority_desc' | 'updated_desc' | 'name_asc';
}

// ------------------------------------------------------- test / preview
export interface SampleTicket {
  ticket_id?: string;
  subject?: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  subcategory?: string;
  ticket_type?: string;
  source?: string;
  customer_name?: string;
  customer_email?: string;
  customer_company?: string;
  customer_type?: string;
  tags?: string[];
  sla_status?: string;
  due_date?: string;
  message_count?: number;
  assigned_agent_id?: number;
  assigned_team_id?: number;
  assignment_source?: 'manual' | 'rule';
}

export interface TicketTarget {
  ticket_id?: string;
  sample_ticket?: SampleTicket;
}

export interface ConditionTrace {
  path: string;
  field: string;
  field_label: string;
  operator: string;
  operator_label: string;
  expected: unknown;
  actual: unknown;
  passed: boolean;
}

export interface AssignmentTarget {
  assignment_type: string | null;
  agent_id: number | null;
  agent_name: string | null;
  team_id: number | null;
  team_name: string | null;
}

export interface RuleEvaluation {
  rule_id: number | null;
  rule_name: string;
  priority: number;
  matched: boolean;
  status: ExecutionStatus | null;
  reason: string;
  passed_conditions: ConditionTrace[];
  failed_conditions: ConditionTrace[];
  expected_assignment: AssignmentTarget | null;
}

export interface RuleTestResult extends RuleEvaluation {
  ticket_ref: string;
  would_change_assignment: boolean;
}

export interface PreviewResult {
  ticket_ref: string;
  trigger: RuleTrigger | null;
  rules_considered: number;
  winning_rule_id: number | null;
  winning_rule_name: string | null;
  current_assignment: AssignmentTarget;
  final_assignment: AssignmentTarget;
  would_change_assignment: boolean;
  summary: string;
  evaluations: RuleEvaluation[];
}

// -------------------------------------------------------------- history
export interface RuleExecution {
  id: number;
  rule_id: number | null;
  rule_name: string;
  ticket_id: number;
  ticket_number: string | null;
  trigger: RuleTrigger;
  previous_agent_id: number | null;
  previous_agent_name: string | null;
  previous_team_id: number | null;
  previous_team_name: string | null;
  assigned_agent_id: number | null;
  assigned_agent_name: string | null;
  assigned_team_id: number | null;
  assigned_team_name: string | null;
  execution_status: ExecutionStatus;
  execution_reason: string;
  matched_conditions: ConditionTrace[];
  executed_at: string;
}

export interface ExecutionList {
  items: RuleExecution[];
  total: number;
}

export interface ExecutionQuery {
  rule_id?: number;
  ticket_id?: string;
  agent_id?: number;
  status?: ExecutionStatus | '';
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

// -------------------------------------------------------------- lookups
export interface AgentOption {
  id: number;
  name: string;
  email: string;
  role: string;
  is_available: boolean;
  open_tickets: number;
  team_ids: number[];
}

export interface TeamOption {
  id: number;
  name: string;
  member_count: number;
  member_ids: number[];
}
