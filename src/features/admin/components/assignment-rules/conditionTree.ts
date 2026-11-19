/**
 * Pure, immutable helpers for editing a condition tree.
 *
 * The backend is the source of truth for validation; `validateTree` only gives
 * immediate inline feedback, and `mapServerErrors` places backend errors
 * (paths like `root.1.0`) onto the matching node.
 */
import type {
  ConditionGroupNode,
  ConditionNode,
  ConditionTreeNode,
  ConditionValue,
  FieldMeta,
  FieldsMetadata,
  MatchLogic,
  OperatorMeta,
  PeriodValue,
  ValueShape,
} from '../../types/rule.types';

let idCounter = 0;
export function newNodeId(prefix = 'n'): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getField(meta: FieldsMetadata, key: string): FieldMeta | undefined {
  return meta.fields.find((f) => f.key === key);
}

export function operatorsFor(meta: FieldsMetadata, fieldKey: string): OperatorMeta[] {
  const field = getField(meta, fieldKey);
  return field ? meta.operators[field.data_type] ?? [] : [];
}

export function getOperator(meta: FieldsMetadata, fieldKey: string, op: string): OperatorMeta | undefined {
  return operatorsFor(meta, fieldKey).find((o) => o.key === op);
}

export function shapeOf(meta: FieldsMetadata, fieldKey: string, op: string): ValueShape {
  return getOperator(meta, fieldKey, op)?.value_shape ?? 'single';
}

/** A sensible starting value for a field/operator pair. */
export function defaultValue(field: FieldMeta | undefined, shape: ValueShape): ConditionValue {
  switch (shape) {
    case 'none':
      return null;
    case 'list':
      return [];
    case 'range':
      return [todayIso(), todayIso()];
    case 'period':
      return { amount: 7, unit: 'days' };
    default:
      if (!field) return '';
      if (field.data_type === 'date') return todayIso();
      if (field.data_type === 'select') return field.options[0]?.value ?? '';
      return '';
  }
}

/**
 * Keeps the entered value when the operator changes, if the new operator can use it
 * (e.g. "Is High" -> "Is Any Of [High]"), otherwise falls back to a default.
 */
export function carryValue(
  previous: ConditionValue,
  fromShape: ValueShape,
  toShape: ValueShape,
  field: FieldMeta | undefined,
): ConditionValue {
  if (fromShape === toShape) return previous;
  if (fromShape === 'single' && toShape === 'list' && previous !== '' && previous !== null) {
    return [previous as string | number];
  }
  if (fromShape === 'list' && toShape === 'single' && Array.isArray(previous) && previous.length) {
    return previous[0] as string | number;
  }
  if (fromShape === 'single' && toShape === 'range' && typeof previous === 'string' && previous) {
    return [previous, previous];
  }
  if (fromShape === 'range' && toShape === 'single' && Array.isArray(previous)) {
    return (previous[0] as string) ?? defaultValue(field, toShape);
  }
  return defaultValue(field, toShape);
}

export function createCondition(meta: FieldsMetadata, fieldKey?: string): ConditionNode {
  const field =
    (fieldKey && getField(meta, fieldKey)) || getField(meta, 'priority') || meta.fields[0];
  const op = field ? operatorsFor(meta, field.key)[0] : undefined;
  return {
    type: 'condition',
    id: newNodeId('c'),
    field: field?.key ?? '',
    operator: op?.key ?? '',
    value: defaultValue(field, op?.value_shape ?? 'single'),
  };
}

export function createGroup(meta: FieldsMetadata, logic: MatchLogic = 'AND'): ConditionGroupNode {
  return { type: 'group', id: newNodeId('g'), logic, children: [createCondition(meta)] };
}

export function emptyRoot(meta: FieldsMetadata): ConditionGroupNode {
  return { ...createGroup(meta, 'AND'), id: 'root' };
}

/** Changing a condition's field resets operator & value to ones valid for the new type. */
export function changeField(meta: FieldsMetadata, node: ConditionNode, fieldKey: string): ConditionNode {
  const prevField = getField(meta, node.field);
  const field = getField(meta, fieldKey);
  const ops = operatorsFor(meta, fieldKey);
  const sameType = prevField && field && prevField.data_type === field.data_type;
  const keepOp = sameType && ops.some((o) => o.key === node.operator);
  const op = keepOp ? ops.find((o) => o.key === node.operator)! : ops[0];
  const shape = op?.value_shape ?? 'single';
  // Same data type with free-form values (text/number/date/tags): keep what was typed.
  const keepValue = keepOp && field && field.data_type !== 'select';
  return {
    ...node,
    field: fieldKey,
    operator: op?.key ?? '',
    value: keepValue ? node.value : defaultValue(field, shape),
  };
}

export function changeOperator(meta: FieldsMetadata, node: ConditionNode, op: string): ConditionNode {
  const field = getField(meta, node.field);
  const from = shapeOf(meta, node.field, node.operator);
  const to = shapeOf(meta, node.field, op);
  return { ...node, operator: op, value: carryValue(node.value, from, to, field) };
}

// ---------------------------------------------------------------- tree edits
export function mapTree(
  node: ConditionTreeNode,
  id: string,
  fn: (n: ConditionTreeNode) => ConditionTreeNode,
): ConditionTreeNode {
  if (node.id === id) return fn(node);
  if (node.type === 'group') {
    return { ...node, children: node.children.map((c) => mapTree(c, id, fn)) };
  }
  return node;
}

export function updateNode<T extends ConditionTreeNode>(
  root: ConditionGroupNode,
  id: string,
  fn: (n: T) => T,
): ConditionGroupNode {
  return mapTree(root, id, (n) => fn(n as T)) as ConditionGroupNode;
}

export function addChild(root: ConditionGroupNode, groupId: string, child: ConditionTreeNode): ConditionGroupNode {
  return updateNode<ConditionGroupNode>(root, groupId, (g) => ({ ...g, children: [...g.children, child] }));
}

/** Removes a node; nested groups left empty are removed too (the root is kept). */
export function removeNode(root: ConditionGroupNode, id: string): ConditionGroupNode {
  if (id === root.id) return root;
  const prune = (group: ConditionGroupNode): ConditionGroupNode => ({
    ...group,
    children: group.children
      .filter((c) => c.id !== id)
      .map((c) => (c.type === 'group' ? prune(c) : c))
      .filter((c) => c.type !== 'group' || c.children.length > 0),
  });
  return prune(root);
}

/** Switching AND/OR only changes `logic`: children and their values are untouched. */
export function setLogic(root: ConditionGroupNode, groupId: string, logic: MatchLogic): ConditionGroupNode {
  return updateNode<ConditionGroupNode>(root, groupId, (g) => ({ ...g, logic }));
}

export function countConditions(node: ConditionTreeNode): number {
  return node.type === 'condition' ? 1 : node.children.reduce((n, c) => n + countConditions(c), 0);
}

/** Adds ids to nodes loaded from the server that lack them (defensive). */
export function ensureIds(node: ConditionTreeNode, isRoot = true): ConditionTreeNode {
  const id = isRoot ? 'root' : node.id || newNodeId(node.type === 'group' ? 'g' : 'c');
  if (node.type === 'group') {
    return { ...node, id, children: node.children.map((c) => ensureIds(c, false)) };
  }
  return { ...node, id };
}

// ---------------------------------------------------------------- validation
function isBlank(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
}

export function validateCondition(meta: FieldsMetadata, node: ConditionNode): string | null {
  const field = getField(meta, node.field);
  if (!field) return 'Choose a field.';
  const op = getOperator(meta, node.field, node.operator);
  if (!op) return 'Choose an operator.';
  const v = node.value;
  switch (op.value_shape) {
    case 'none':
      return null;
    case 'list':
      return Array.isArray(v) && v.length > 0 ? null : 'Select at least one value.';
    case 'range': {
      if (!Array.isArray(v) || v.length !== 2 || isBlank(v[0]) || isBlank(v[1])) return 'Choose both dates.';
      return String(v[0]) <= String(v[1]) ? null : 'Start date must be on or before the end date.';
    }
    case 'period': {
      const p = v as PeriodValue | null;
      if (!p || !Number.isInteger(Number(p.amount)) || Number(p.amount) < 1) return 'Enter a whole number of 1 or more.';
      return null;
    }
    default:
      if (isBlank(v)) return 'Enter a value.';
      if (field.data_type === 'number' && !Number.isFinite(Number(v))) return 'Enter a valid number.';
      if (typeof v === 'string' && v.length > 500) return 'Keep values under 500 characters.';
      return null;
  }
}

export interface TreeValidation {
  nodeErrors: Record<string, string>;
  treeError: string | null;
}

export function validateTree(meta: FieldsMetadata, root: ConditionGroupNode): TreeValidation {
  const nodeErrors: Record<string, string> = {};
  const walk = (node: ConditionTreeNode, depth: number) => {
    if (node.type === 'condition') {
      const err = validateCondition(meta, node);
      if (err) nodeErrors[node.id] = err;
      return;
    }
    if (depth > meta.limits.max_depth) nodeErrors[node.id] = `Groups can be nested at most ${meta.limits.max_depth} levels.`;
    if (node.children.length === 0 && node.id !== root.id) nodeErrors[node.id] = 'Add a condition to this group.';
    node.children.forEach((c) => walk(c, depth + 1));
  };
  walk(root, 1);
  const total = countConditions(root);
  let treeError: string | null = null;
  if (total === 0) treeError = 'Add at least one condition.';
  else if (total > meta.limits.max_conditions) treeError = `A rule can contain at most ${meta.limits.max_conditions} conditions.`;
  return { nodeErrors, treeError };
}

/** Maps backend error paths (`root.1.0`) to node ids in the current tree. */
export function mapServerErrors(
  root: ConditionGroupNode,
  errors: { path: string; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  errors.forEach(({ path, message }) => {
    if (!path.startsWith('root')) return;
    let node: ConditionTreeNode | undefined = root;
    for (const part of path.split('.').slice(1)) {
      node = node?.type === 'group' ? node.children[Number(part)] : undefined;
    }
    if (node) out[node.id] = message.replace(/^.*?: /, '') || message;
  });
  return out;
}

/** Depth of each group (root = 1); used for nesting limits and styling. */
export function canNest(meta: FieldsMetadata, depth: number): boolean {
  return depth < meta.limits.max_depth;
}
